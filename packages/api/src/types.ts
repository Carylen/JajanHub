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

export type VendorOrderStatus = 'new' | 'cooking' | 'ready';

export interface VendorOrderLine {
  name: string;
  qty: number;
}

export interface VendorOrder {
  id: string;
  code: string;
  queueLabel: string;
  customerName: string;
  lines: VendorOrderLine[];
  total: number;
  priority: boolean;
  status: VendorOrderStatus;
  pickupCode: string;
  placedAgo: string;
}

export interface Payout {
  id: string;
  date: string;
  amount: number;
  status: 'settled' | 'pending' | 'processing';
}

export interface LoyalCustomer {
  id: string;
  name: string;
  initials: string;
  orders: number;
  lastVisit: string;
  spend: number;
}

export interface RejectReason {
  id: string;
  label: string;
}
