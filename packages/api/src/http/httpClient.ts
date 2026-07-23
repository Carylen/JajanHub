/**
 * HTTP implementation of {@link JajanhubClient} against the Elysia backend.
 * Fully typed and wired to the same interface; realtime uses WebSocket. Not the
 * default yet (BRIEF §6/M5) — flip NEXT_PUBLIC_API_MODE=http to use it. If the
 * backend adopts Eden Treaty, replace the fetch calls with the Eden client
 * without touching any UI.
 */
import type { JajanhubClient, Unsubscribe } from '../client';
import type {
  CreateOrderInput,
  LoyalCustomer,
  Order,
  Payout,
  PickupRecord,
  Preorder,
  QueueState,
  RefundState,
  Stall,
  SubscriptionBenefit,
  SubscriptionPlan,
  Txn,
  UserProfile,
  VendorMenuItem,
  VendorOrder,
  VendorSummary,
  Warung,
} from '../types';

export function createHttpClient(baseUrl: string): JajanhubClient {
  async function req<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      throw new Error(`API ${res.status} ${path}${detail ? `: ${detail}` : ''}`);
    }
    return (await res.json()) as T;
  }

  function wsUrl(path: string): string {
    const base = baseUrl.replace(/^http/, 'ws');
    return `${base}${path}`;
  }

  return {
    getWarung: (id) => req<Warung>(`/warung/${id}`),
    createOrder: (input: CreateOrderInput) =>
      req<Order>('/orders', { method: 'POST', body: JSON.stringify(input) }),
    getOrder: (id) => req<Order>(`/orders/${id}`),
    markPaid: (id) => req<Order>(`/orders/${id}/paid`, { method: 'POST' }),
    cancelOrder: (id) => req<Order>(`/orders/${id}/cancel`, { method: 'POST' }),
    confirmPickup: (id) => req<Order>(`/orders/${id}/pickup`, { method: 'POST' }),

    subscribeQueue(orderId, cb): Unsubscribe {
      const ws = new WebSocket(wsUrl(`/orders/${orderId}/queue`));
      ws.onmessage = (ev) => {
        try {
          cb(JSON.parse(ev.data) as QueueState);
        } catch {
          /* ignore malformed frame */
        }
      };
      return () => ws.close();
    },
    subscribeRefund(orderId, cb): Unsubscribe {
      const ws = new WebSocket(wsUrl(`/orders/${orderId}/refund`));
      ws.onmessage = (ev) => {
        try {
          cb(JSON.parse(ev.data) as RefundState);
        } catch {
          /* ignore malformed frame */
        }
      };
      return () => ws.close();
    },

    getStalls: () => req<Stall[]>('/stalls'),
    getPlans: () => req<SubscriptionPlan[]>('/plans'),
    getBenefits: () => req<SubscriptionBenefit[]>('/benefits'),
    getProfile: () => req<UserProfile>('/me'),

    getVendorSummary: () => req<VendorSummary>('/vendor/summary'),
    getVendorOrders: () => req<VendorOrder[]>('/vendor/orders'),
    advanceVendorOrder: (id) => req<VendorOrder[]>(`/vendor/orders/${id}/advance`, { method: 'POST' }),
    rejectVendorOrder: (id, reason) =>
      req<VendorOrder[]>(`/vendor/orders/${id}/reject`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
    getPreorders: () => req<Preorder[]>('/vendor/preorders'),
    verifyPickupCode: (code) => req<PickupRecord | null>(`/vendor/pickup/${code}`),
    getVendorMenu: () => req<VendorMenuItem[]>('/vendor/menu'),
    setStock: (itemId, inStock) =>
      req<VendorMenuItem[]>(`/vendor/menu/${itemId}/stock`, {
        method: 'PATCH',
        body: JSON.stringify({ inStock }),
      }),
    markAllOut: () => req<VendorMenuItem[]>('/vendor/menu/mark-all-out', { method: 'POST' }),
    getPayouts: () => req<Payout[]>('/vendor/payouts'),
    getTxns: () => req<Txn[]>('/vendor/txns'),
    getLoyalCustomers: () => req<LoyalCustomer[]>('/vendor/customers'),
  };
}
