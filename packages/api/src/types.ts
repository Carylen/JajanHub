/**
 * Domain types for JajanHub. Derived from the constant data in the design
 * files (MENU, PLANS, STALLS, CANCEL_REASONS, …). These are the contract both
 * the mock and http client implementations satisfy.
 */

export type MenuCategory = 'food' | 'drink';

export interface MenuItem {
  id: string;
  name: string;
  desc: string;
  /** Price in whole Rupiah (no decimals). */
  price: number;
  cat: MenuCategory;
  best?: boolean;
  /** Whether the item can currently be ordered. */
  available?: boolean;
}

export interface Warung {
  id: string;
  name: string;
  tagline: string;
  address: string;
  rating: number;
  orderCount: number;
  openFrom: string;
  openTo: string;
  isOpen: boolean;
  /** People currently ahead in the queue. */
  peopleAhead: number;
  /** Estimated wait in minutes. */
  etaMin: number;
  menu: MenuItem[];
}

export interface CartLine {
  item: MenuItem;
  qty: number;
}

export type PickupMode = 'now' | 'later';

export interface CreateOrderInput {
  merchantId: string;
  /** Map of menu item id -> quantity. */
  cart: Record<string, number>;
  priority: boolean;
  pickupMode: PickupMode;
  pickupSlot?: string;
}

/**
 * Lifecycle of an order. Maps to the design's `queueStage` (0/1/2) plus the
 * terminal states that live outside the happy path.
 */
export type OrderStatus =
  | 'awaiting_payment'
  | 'paid'
  | 'cooking'
  | 'ready'
  | 'picked_up'
  | 'cancelled'
  | 'refunding'
  | 'refunded';

export interface OrderLine {
  itemId: string;
  name: string;
  qty: number;
  price: number;
}

export interface Order {
  id: string;
  merchantId: string;
  merchantName: string;
  code: string;
  /** Queue letter + number shown as the hero, e.g. "A27". */
  queueLetter: string;
  queueNumber: number;
  lines: OrderLine[];
  subtotal: number;
  serviceFee: number;
  priorityFee: number;
  total: number;
  priority: boolean;
  pickupMode: PickupMode;
  pickupSlot?: string;
  pickupCode: string;
  status: OrderStatus;
  createdAt: string;
  /** Extra items added to a live order (max 2, see `canAddOrder`). */
  addons: OrderAddon[];
}

/**
 * A follow-up order attached to an already-paid parent order — cheaper fee
 * than a fresh order since it rides the same queue slot. Max 2 per order,
 * enforced in `createAddon` (not just the UI) so mobile/desktop/vendor agree.
 */
export interface OrderAddon {
  id: string;
  parentOrderId: string;
  lines: OrderLine[];
  subtotal: number;
  feeAmount: number;
  total: number;
  createdAt: string;
}

/** Realtime snapshot pushed by `subscribeQueue`. */
export interface QueueState {
  status: OrderStatus;
  peopleAhead: number;
  etaMin: number;
  /** Seconds left on the payment countdown (only while awaiting_payment). */
  payLeft?: number;
}

export type RefundStage = 'cancelled' | 'processing' | 'done';

export interface RefundState {
  stage: RefundStage;
  amount: number;
  method: string;
}

/** Nearby stall for the discovery screen. */
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
  /** Loyalty badge shown on the card (bronze = no badge). */
  tier?: VendorTier;
}

/** Phone + WhatsApp-OTP session state. */
export interface AuthSession {
  phone: string;
  loggedIn: boolean;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  note: string;
  price: number;
  per: string;
  badge?: string;
}

export interface SubscriptionBenefit {
  title: string;
  sub: string;
}

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

/** baru → masak → siap → (done, removed) or ditolak. */
export type VendorOrderStatus = 'baru' | 'masak' | 'siap' | 'ditolak';

export interface VendorOrderLine {
  name: string;
  qty: number;
}

export interface VendorOrder {
  id: string;
  no: string;
  waitMins: number;
  lines: VendorOrderLine[];
  total: number;
  priority: boolean;
  status: VendorOrderStatus;
  rejectReason?: string;
  /** Count of D3 add-ons riding this order — shown as a badge, never a separate kanban card. */
  addonCount?: number;
}

/** A scheduled ("nanti") pre-order shown grouped by pickup slot. */
export interface Preorder {
  no: string;
  slot: string;
  customer: string;
  lines: VendorOrderLine[];
  priority: boolean;
}

/** A pickup code a vendor can verify against a ready order. */
export interface PickupRecord {
  code: string;
  no: string;
  customer: string;
  slot: string;
  lines: VendorOrderLine[];
}

export interface VendorMenuItem {
  id: string;
  name: string;
  price: number;
  cat: MenuCategory;
  inStock: boolean;
}

export interface Payout {
  id: string;
  date: string;
  amount: number;
  status: 'Cair' | 'Diproses';
  sub: string;
}

export interface Txn {
  no: string;
  items: string;
  time: string;
  amount: number;
  refund: boolean;
}

export interface LoyalCustomer {
  id: string;
  name: string;
  initials: string;
  transactions: number;
  member: boolean;
  favorite: string;
  avatarGradient: string;
}

export interface RejectReason {
  id: string;
  label: string;
}

/** baru gabung → hampir naik → naik, based on completed orders / response time / reject rate / rating (D4). */
export type VendorTier = 'bronze' | 'silver' | 'gold';

/** Home dashboard summary numbers. */
export interface VendorSummary {
  merchantName: string;
  greeting: string;
  dateLabel: string;
  revenueToday: number;
  revenueDeltaPct: number;
  ordersToday: number;
  avgServeLabel: string;
  tier: VendorTier;
  /** Completed orders counted toward the next tier's requirement window (see `packages/api/tiers.ts`). */
  tierOrdersThisWindow: number;
}
