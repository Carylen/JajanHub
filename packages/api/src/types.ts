/**
 * Domain types for JajanHub. Field names, nesting, and enums mirror
 * `API_CONTRACT.md` (the wire contract with the backend) wherever it defines
 * a shape — these are the contract both the mock and http client
 * implementations satisfy. Fields the contract doc is silent on but the
 * shipped product still needs (map pin coordinates, tier gradient copy,
 * scheduled-pickup slots, …) are kept as additive fields, each commented
 * `// UI-only extension, not in API_CONTRACT.md`.
 */

export type MenuCategory = 'food' | 'drink';

export interface MenuItem {
  id: string;
  name: string;
  /** UI-only extension, not in API_CONTRACT.md. */
  desc: string;
  /** Price in whole Rupiah (no decimals). Contract: `priceRp`. */
  priceRp: number;
  cat: MenuCategory;
  isBestSeller?: boolean;
  /** Whether the item can currently be ordered. */
  isAvailable?: boolean;
}

/** baru gabung → hampir naik → naik, based on completed orders / response time / reject rate (API_CONTRACT.md §9). */
export type VendorTier = 'bronze' | 'silver' | 'gold';

export interface Vendor {
  id: string;
  name: string;
  category: string;
  photoUrl: string;
  isOpen: boolean;
  tier: VendorTier;
  queueEstimate: { peopleAhead: number; etaMin: number };
  avgServeTimeSec: number;
  location: { lat: number; lng: number; address: string };
  // UI-only extensions, not in API_CONTRACT.md — the contract's Vendor shape
  // doesn't cover per-merchant landing-page copy, but the shipped screens do:
  /** Short marketing line under the vendor name. */
  tagline: string;
  rating: number;
  orderCount: number;
  openFrom: string;
  openTo: string;
  /** Composed client-side from `GET /vendors/:id/menu` — see `getWarung` in client.ts. */
  menu: MenuItem[];
}

export interface CartLine {
  item: MenuItem;
  qty: number;
}

/** UI-only extension, not in API_CONTRACT.md — the contract only models immediate ordering. */
export type PickupMode = 'now' | 'later';

export interface CreateOrderInput {
  vendorId: string;
  /** Map of menu item id -> quantity. */
  cart: Record<string, number>;
  isPriority: boolean;
  /** UI-only extension, not in API_CONTRACT.md. */
  pickupMode: PickupMode;
  /** UI-only extension, not in API_CONTRACT.md. */
  pickupSlot?: string;
}

/** Matches API_CONTRACT.md §4's `OrderStatus` exactly. */
export type OrderStatus =
  | 'pending_payment'
  | 'waiting_confirmation'
  | 'cooking'
  | 'ready'
  | 'picked_up'
  | 'cancelled'
  | 'rejected';

export interface OrderLine {
  menuItemId: string;
  name: string;
  qty: number;
  priceRp: number;
}

/**
 * Matches API_CONTRACT.md §4's `Order` model — the single resource shared by
 * the customer's Queue Status screen and the vendor's order board (the
 * contract's `/ws/vendors/:id/orders` channel pushes this same shape, so
 * there's no separate "VendorOrder" type). Vendor-board-only display bits
 * (queue code like "A26", minutes-waiting) are derived via `formatQueueCode`/
 * `minutesSince` in `order.ts`, not stored fields.
 */
export interface Order {
  id: string;
  vendorId: string;
  customerId: string;
  queueNumber: number;
  lines: OrderLine[];
  subtotalRp: number;
  serviceFeeRp: number;
  totalRp: number;
  status: OrderStatus;
  isPriority: boolean;
  /** Extra items added to a live order (max 2, see `canAddOrder`). */
  addons: OrderAddon[];
  /** 4 digits, generated once `status` becomes `ready`. */
  pickupCode: string;
  createdAt: string;
  estimatedReadyAt: string | null;
  /** Deadline for the vendor to confirm before auto-cancel (API_CONTRACT.md §4). Backend-internal — not for a customer-facing countdown. */
  confirmDeadlineAt: string | null;
  /** Set once `status` is `rejected`. */
  rejectReason?: string;
  /** `'vendor'` (honest early rejection) vs `'timeout'` (vendor never responded) — see API_CONTRACT.md §4/§9; these do NOT weigh equally against tier score. */
  rejectedBy?: 'vendor' | 'timeout';
  // UI-only extensions, not in API_CONTRACT.md:
  /** Short display id, e.g. "#AY-2026". */
  code: string;
  vendorName: string;
  /** Contract's Order has no separate priority-fee line item; kept broken out since checkout/add-on screens display it. */
  priorityFeeRp: number;
  pickupMode: PickupMode;
  pickupSlot?: string;
  /** Vendor-board display name — the contract gives vendors no customer name, only masked phone via the loyalty endpoint. Mock-only convenience. */
  customerLabel?: string;
}

/**
 * A follow-up order attached to an already-paid parent order — cheaper fee
 * than a fresh order since it rides the same queue slot. Max 2 per order,
 * enforced in `createAddon` (not just the UI) so mobile/desktop/vendor agree.
 * Matches API_CONTRACT.md §7's `OrderAddon`.
 */
export interface OrderAddon {
  id: string;
  parentOrderId: string;
  lines: OrderLine[];
  feeRp: number;
  status: 'pending_payment' | 'paid';
  createdAt: string;
  // UI-only extensions, not in API_CONTRACT.md:
  subtotalRp: number;
  totalRp: number;
}

/** Realtime snapshot pushed by `subscribeQueue`, unwrapped from `/ws/orders/:id`'s event envelope. */
export interface QueueState {
  status: OrderStatus;
  peopleAhead: number;
  etaMin: number;
  /** UI-only extension, not in API_CONTRACT.md — seconds left on the payment countdown (only while `pending_payment`). */
  payLeft?: number;
}

/** Matches API_CONTRACT.md §8's `GET /orders/:id/refund` `status`, plus a client-only `cancelled` lead-in stage (the contract has no realtime refund push, so this local staged view is a UI-only extension). */
export type RefundStage = 'cancelled' | 'processing' | 'completed';

export interface RefundState {
  stage: RefundStage;
  amountRp: number;
  /** UI-only extension, not in API_CONTRACT.md. */
  method: string;
  /** From `GET /orders/:id/refund`'s `estimatedDays` — TODO confirm with backend (depends on payment-gateway SLA). */
  estimatedDays?: string;
}

/** Matches API_CONTRACT.md §4's cancel-reason enum. */
export type CancelReason = 'salah_pesan' | 'kelamaan' | 'berubah_pikiran' | 'lainnya';

/** Matches API_CONTRACT.md §4's reject-reason enum (vendor). */
export type RejectReasonId = 'bahan_habis' | 'terlalu_ramai' | 'tutup';

/** Nearby stall for the discovery screen. UI-only extension, not in API_CONTRACT.md — the contract's `GET /vendors` list covers this concept in principle, but this screen's decorative map/distance fields have no wire equivalent, so it's kept as its own type rather than forced into `Vendor`. */
export interface Stall {
  id: string;
  name: string;
  type: string;
  category: string;
  distance: string;
  queue: number;
  open: boolean;
  /** Map pin position as CSS percentages. */
  mapX: string;
  mapY: string;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  priceRp: number;
  periodDays: number;
  // UI-only extensions, not in API_CONTRACT.md:
  note: string;
  per: string;
  badge?: string;
}

export interface SubscriptionBenefit {
  title: string;
  sub: string;
}

/** `GET /me/subscription`. */
export interface SubscriptionStatus {
  isActive: boolean;
  planId: string | null;
  expiresAt: string | null;
}

/** UI-only extension, not in API_CONTRACT.md — scheduled ("nanti") pickup slots have no wire equivalent. */
export interface PickupSlot {
  time: string;
  left?: number;
  full?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  initials: string;
  totalOrders: number;
  points: number;
  favorites: number;
  subscriptionActive: boolean;
}

/* ----------------------------- Vendor domain ----------------------------- */

/** A line item shown in a `Preorder`/`PickupRecord` grouping — deliberately lighter than `OrderLine` since these views don't need price/id. */
export interface DisplayLine {
  name: string;
  qty: number;
}

/** A scheduled ("nanti") pre-order shown grouped by pickup slot. UI-only extension, not in API_CONTRACT.md — the contract only models immediate ordering. */
export interface Preorder {
  no: string;
  slot: string;
  customer: string;
  lines: DisplayLine[];
  priority: boolean;
}

/** A pickup code a vendor can verify against a ready order — mirrors `POST /orders/:id/verify-pickup`'s success shape. */
export interface PickupRecord {
  code: string;
  no: string;
  customer: string;
  slot: string;
  lines: DisplayLine[];
}

/** UI-only extension, not in API_CONTRACT.md — the vendor's own stock-management view; `setStock` maps to the contract's `PATCH /vendors/:id/menu/:itemId` `{isAvailable}` body at the http layer. */
export interface VendorMenuItem {
  id: string;
  name: string;
  priceRp: number;
  cat: MenuCategory;
  inStock: boolean;
}

/** Matches API_CONTRACT.md §10's settlement payout item. */
export interface Payout {
  id: string;
  amountRp: number;
  status: 'processing' | 'completed';
  // UI-only extensions, not in API_CONTRACT.md — friendly Indonesian display copy:
  date: string;
  sub: string;
}

/** UI-only extension, not in API_CONTRACT.md — the contract doesn't specify an exact transaction-row schema for `GET /vendors/:id/settlement/transactions`. */
export interface Txn {
  no: string;
  items: string;
  time: string;
  amount: number;
  refund: boolean;
}

/** Matches API_CONTRACT.md §13's `GET /vendors/:id/customers` — phone is ALWAYS masked, never sent full. */
export interface LoyalCustomer {
  id: string;
  customerPhoneMasked: string;
  orderCount: number;
  favoriteItem: string;
  isPriorityMember: boolean;
  // UI-only extensions, not in API_CONTRACT.md:
  name: string;
  initials: string;
  avatarGradient: string;
}

export interface RejectReason {
  id: RejectReasonId;
  label: string;
}

/** Home dashboard summary numbers. UI-only extension, not in API_CONTRACT.md — the contract has no vendor-dashboard endpoint. */
export interface VendorSummary {
  merchantName: string;
  greeting: string;
  dateLabel: string;
  revenueToday: number;
  revenueDeltaPct: number;
  ordersToday: number;
  avgServeLabel: string;
}

/** Matches API_CONTRACT.md §9's `GET /vendors/:id/tier` response exactly — the network-shaped tier resource. */
export interface VendorTierStatus {
  current: VendorTier;
  next: VendorTier | null;
  progress: {
    ordersCompleted: number;
    ordersRequired: number;
    /** New telemetry with no current data source — mock returns a static plausible value. TODO confirm with backend. */
    avgResponseSec: number;
    responseRequiredSec: number;
    /** Only counts `rejectedBy: 'timeout'`, never `'vendor'` — see API_CONTRACT.md §9. TODO confirm with backend. */
    timeoutRejectRate: number;
    timeoutRejectRateMax: number;
  };
  benefits: {
    payoutSchedule: string;
    priorityFeeShare: number;
    discoveryBoost: boolean;
    advancedAnalytics: boolean;
  };
}

/** Matches API_CONTRACT.md §11's `GET /config/fees`. */
export interface ConfigFees {
  serviceFeeRp: number;
  addonFeeRp: number;
  priorityFeeRp: number;
  maxAddonsPerOrder: number;
}
