/**
 * HTTP implementation of {@link JajanhubClient} against the Elysia backend —
 * maps 1:1 onto API_CONTRACT.md's routes/envelope/headers (BRIEF §6/M5). Not
 * the default yet — flip `NEXT_PUBLIC_API_MODE=http` to use it. If the
 * backend adopts Eden Treaty, replace the fetch calls with the Eden client
 * without touching any UI.
 *
 * A few endpoints the client interface needs have no literal contract route
 * (the vendor order board's initial REST snapshot, the vendor's own id in a
 * URL, discovery's decorative map fields, …) — each is flagged inline with
 * `// TODO confirm with backend` at the point it's assumed.
 */
import type { Customer, RequestOtpResult } from '../auth';
import type { AddonInput, JajanhubClient, Unsubscribe } from '../client';
import { formatQueueCode } from '../order';
import { parseApiErrorBody } from '../errors';
import type {
  CancelReason,
  ConfigFees,
  CreateOrderInput,
  LoyalCustomer,
  MenuItem,
  Order,
  Payout,
  PickupRecord,
  Preorder,
  QueueState,
  RejectReasonId,
  Stall,
  SubscriptionBenefit,
  SubscriptionPlan,
  SubscriptionStatus,
  Txn,
  UserProfile,
  Vendor,
  VendorMenuItem,
  VendorSummary,
  VendorTierStatus,
} from '../types';

function cartToLines(cart: Record<string, number>): { menuItemId: string; qty: number }[] {
  return Object.entries(cart)
    .filter(([, qty]) => qty > 0)
    .map(([menuItemId, qty]) => ({ menuItemId, qty }));
}

/**
 * @param vendorId The vendor the `apps/vendor` client acts as. The contract's
 * vendor-scoped endpoints are all `:id`-parameterized but never says how a
 * logged-in vendor learns their own id — `'me'` assumes a conventional
 * self-referencing path segment the backend resolves from the session
 * cookie. TODO confirm with backend.
 */
export function createHttpClient(baseUrl: string, vendorId = 'me'): JajanhubClient {
  async function unwrap<T>(res: Response): Promise<T> {
    // 204 (e.g. `POST /auth/logout`) has no body to parse — nothing to unwrap.
    if (res.status === 204) return undefined as T;
    const body = await res.json().catch(() => null);
    if (!res.ok) throw parseApiErrorBody(body, res.status);
    return (body as { data: T }).data;
  }

  async function req<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      // Session lives in an httpOnly cookie (API_CONTRACT.md §0), not a bearer token.
      credentials: 'include',
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
    return unwrap<T>(res);
  }

  /** UUID header required on financial-transaction endpoints (API_CONTRACT.md §0). */
  function idempotencyHeaders(): HeadersInit {
    return { 'Idempotency-Key': crypto.randomUUID() };
  }

  function wsUrl(path: string): string {
    return `${baseUrl.replace(/^http/, 'ws')}${path}`;
  }

  const vendorOrdersPath = `/vendors/${vendorId}/orders`;

  return {
    requestOtp: (phone) =>
      req<RequestOtpResult>('/auth/otp/request', { method: 'POST', body: JSON.stringify({ phone }) }),
    verifyOtp: (phone, code) =>
      req<{ customer: Customer }>('/auth/otp/verify', {
        method: 'POST',
        body: JSON.stringify({ phone, code }),
      }).then((d) => d.customer),
    getMe: () => req<{ customer: Customer }>('/auth/me').then((d) => d.customer),
    logout: () => req<void>('/auth/logout', { method: 'POST' }),

    getWarung: async (id) => {
      const [vendor, menu] = await Promise.all([
        req<Omit<Vendor, 'menu'>>(`/vendors/${id}`),
        req<MenuItem[]>(`/vendors/${id}/menu`),
      ]);
      return { ...vendor, menu };
    },
    createOrder: (input: CreateOrderInput) =>
      req<{ order: Order }>('/orders', {
        method: 'POST',
        headers: idempotencyHeaders(),
        body: JSON.stringify({
          vendorId: input.vendorId,
          lines: cartToLines(input.cart),
          isPriority: input.isPriority,
          pickupMode: input.pickupMode,
          pickupSlot: input.pickupSlot,
        }),
      }).then((d) => d.order),
    getOrder: (id) => req<Order>(`/orders/${id}`),
    // No literal contract endpoint: payment status flips pending_payment→waiting_confirmation
    // via the payment-gateway webhook (API_CONTRACT.md §8), not a frontend call. Re-fetch
    // current state instead of pretending to trigger it.
    markPaid: (id) => req<Order>(`/orders/${id}`),
    cancelOrder: (id, reason: CancelReason) =>
      req<Order>(`/orders/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
    // No literal contract endpoint: real pickup confirmation is vendor-side and
    // code-verified (`verify-pickup`) — this customer-side action just re-fetches.
    confirmPickup: (id) => req<Order>(`/orders/${id}`),
    createAddon: async (orderId: string, items: AddonInput) => {
      await req<{ addon: unknown; paymentQrisUrl: string }>(`/orders/${orderId}/addons`, {
        method: 'POST',
        headers: idempotencyHeaders(),
        body: JSON.stringify({ lines: cartToLines(items) }),
      });
      // Contract returns the addon + a QRIS charge, not the parent order — refetch
      // to hand back the shape `JajanhubClient.createAddon` promises.
      return req<Order>(`/orders/${orderId}`);
    },

    subscribeQueue(orderId, cb): Unsubscribe {
      const ws = new WebSocket(wsUrl(`/ws/orders/${orderId}`));
      let state: QueueState = { status: 'pending_payment', peopleAhead: 0, etaMin: 0 };
      ws.onmessage = (ev) => {
        try {
          const frame = JSON.parse(ev.data) as
            | { event: 'status_changed'; order: Order }
            | { event: 'queue_update'; peopleAhead: number; etaMin: number };
          state =
            frame.event === 'status_changed'
              ? { ...state, status: frame.order.status }
              : { ...state, peopleAhead: frame.peopleAhead, etaMin: frame.etaMin };
          cb(state);
        } catch {
          /* ignore malformed frame */
        }
      };
      // TODO: exponential-backoff reconnect + 10s poll fallback per API_CONTRACT.md §5.
      return () => ws.close();
    },
    // No WS channel for refund in the contract (only `GET /orders/:id/refund`) —
    // poll at the doc's own suggested fallback cadence instead of a socket.
    subscribeRefund(orderId, cb): Unsubscribe {
      let stopped = false;
      const poll = async () => {
        if (stopped) return;
        try {
          const r = await req<{ status: 'processing' | 'completed'; amountRp: number; estimatedDays: string }>(
            `/orders/${orderId}/refund`,
          );
          cb({ stage: r.status, amountRp: r.amountRp, method: '', estimatedDays: r.estimatedDays });
        } catch {
          /* transient poll failure — try again next tick */
        }
        if (!stopped) setTimeout(poll, 10_000);
      };
      poll();
      return () => {
        stopped = true;
      };
    },

    // TODO confirm with backend — `GET /vendors` has no `distance`/map-pin/`type`
    // fields this decorative discovery screen wants; placeholder until product
    // decides whether that data belongs in the contract or stays frontend-only.
    getStalls: async () => {
      const vendors = await req<Vendor[]>('/vendors');
      return vendors.map(
        (v): Stall => ({
          id: v.id,
          name: v.name,
          type: v.category,
          category: v.category,
          distance: '—',
          queue: v.queueEstimate.peopleAhead,
          open: v.isOpen,
          mapX: '50%',
          mapY: '50%',
        }),
      );
    },
    getConfigFees: () => req<ConfigFees>('/config/fees'),
    getPlans: () => req<SubscriptionPlan[]>('/subscription/plans'),
    // No contract endpoint for benefit copy — presentation-only, stays frontend content.
    getBenefits: () => Promise.resolve<SubscriptionBenefit[]>([]),
    getSubscriptionStatus: () => req<SubscriptionStatus>('/me/subscription'),
    // TODO confirm with backend — no contract endpoint for the full profile
    // (name/points/favorites/totalOrders); best-effort from the auth `Customer`.
    getProfile: async () => {
      const customer = await req<{ customer: Customer }>('/auth/me').then((d) => d.customer);
      return {
        id: customer.id,
        name: '',
        phone: customer.phone,
        initials: '',
        totalOrders: 0,
        points: 0,
        favorites: 0,
        subscriptionActive: false,
      } satisfies UserProfile;
    },

    // TODO confirm with backend — no literal contract endpoint for vendor dashboard stats.
    getVendorSummary: () => req<VendorSummary>(`/vendors/${vendorId}/summary`),
    getVendorTier: () => req<VendorTierStatus>(`/vendors/${vendorId}/tier`),
    // Demo-only in mock mode; API_CONTRACT.md §9 explicitly has no "claim tier"
    // endpoint (tier is server-computed) — no-op against a real backend.
    advanceVendorTier: () => req<VendorTierStatus>(`/vendors/${vendorId}/tier`),
    resetVendorTier: () => req<VendorTierStatus>(`/vendors/${vendorId}/tier`),
    // TODO confirm with backend — the contract only documents the `/ws/vendors/:id/orders`
    // push channel, not a REST list; this assumes an equivalent GET exists for initial hydration.
    getVendorOrders: () => req<Order[]>(vendorOrdersPath),
    advanceVendorOrder: async (id) => {
      const current = await req<Order>(`/orders/${id}`);
      if (current.status === 'waiting_confirmation') {
        await req(`/orders/${id}/confirm`, { method: 'POST' });
      } else if (current.status === 'cooking') {
        await req(`/orders/${id}/advance`, { method: 'POST' });
      } else if (current.status === 'ready') {
        // Auto-submits the code the backend already generated — a legitimate
        // contract-correct pickup confirmation, not a bypass.
        await req(`/orders/${id}/verify-pickup`, {
          method: 'POST',
          body: JSON.stringify({ code: current.pickupCode }),
        });
      }
      return req<Order[]>(vendorOrdersPath);
    },
    rejectVendorOrder: async (id, reason: RejectReasonId) => {
      await req(`/orders/${id}/reject`, { method: 'POST', body: JSON.stringify({ reason }) });
      return req<Order[]>(vendorOrdersPath);
    },
    // No contract endpoint for scheduled "nanti" pre-orders — derived client-side
    // from the vendor's live order list.
    getPreorders: async () => {
      const orders = await req<Order[]>(vendorOrdersPath);
      return orders
        .filter((o) => o.pickupMode === 'later' && o.pickupSlot)
        .map(
          (o): Preorder => ({
            no: formatQueueCode(o),
            slot: o.pickupSlot!,
            customer: o.customerLabel ?? '',
            lines: o.lines.map((l) => ({ name: l.name, qty: l.qty })),
            priority: o.isPriority,
          }),
        );
    },
    // Contract's `verify-pickup` is per-order (`POST /orders/:id/verify-pickup`), not a
    // global code lookup — find the matching `ready` order client-side first.
    verifyPickupCode: async (code) => {
      const orders = await req<Order[]>(vendorOrdersPath);
      const match = orders.find((o) => o.pickupCode === code && o.status === 'ready');
      if (!match) return null;
      await req(`/orders/${match.id}/verify-pickup`, { method: 'POST', body: JSON.stringify({ code }) });
      return {
        code,
        no: formatQueueCode(match),
        customer: match.customerLabel ?? '',
        slot: match.pickupMode === 'later' && match.pickupSlot ? `Slot ${match.pickupSlot}` : 'Ambil sekarang',
        lines: match.lines.map((l) => ({ name: l.name, qty: l.qty })),
      } satisfies PickupRecord;
    },
    getVendorMenu: async () => {
      const items = await req<MenuItem[]>(`/vendors/${vendorId}/menu`);
      return items.map(
        (m): VendorMenuItem => ({ id: m.id, name: m.name, priceRp: m.priceRp, cat: m.cat, inStock: m.isAvailable !== false }),
      );
    },
    setStock: async (itemId, inStock) => {
      await req(`/vendors/${vendorId}/menu/${itemId}`, {
        method: 'PATCH',
        body: JSON.stringify({ isAvailable: inStock }),
      });
      const items = await req<MenuItem[]>(`/vendors/${vendorId}/menu`);
      return items.map(
        (m): VendorMenuItem => ({ id: m.id, name: m.name, priceRp: m.priceRp, cat: m.cat, inStock: m.isAvailable !== false }),
      );
    },
    markAllOut: async () => {
      const items = await req<MenuItem[]>(`/vendors/${vendorId}/menu`);
      await Promise.all(
        items.map((m) =>
          req(`/vendors/${vendorId}/menu/${m.id}`, { method: 'PATCH', body: JSON.stringify({ isAvailable: false }) }),
        ),
      );
      return items.map((m): VendorMenuItem => ({ id: m.id, name: m.name, priceRp: m.priceRp, cat: m.cat, inStock: false }));
    },
    getPayouts: () => req<Payout[]>(`/vendors/${vendorId}/settlement/payouts`),
    getTxns: () => req<Txn[]>(`/vendors/${vendorId}/settlement/transactions`),
    getLoyalCustomers: () => req<LoyalCustomer[]>(`/vendors/${vendorId}/customers`),
  };
}
