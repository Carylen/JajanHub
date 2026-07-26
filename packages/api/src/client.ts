/**
 * The single interface every backend implementation satisfies. UI code depends
 * only on this — never on `fetch` or the mock internals — so swapping mock →
 * http is invisible to components (BRIEF §6).
 */
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
} from './types';

/** Map of menu item id -> quantity, same shape `CreateOrderInput.cart` uses. */
export type AddonInput = Record<string, number>;

/** Call to stop receiving realtime callbacks. */
export type Unsubscribe = () => void;

export interface JajanhubClient {
  /* customer */
  getWarung(id: string): Promise<Warung>;
  createOrder(input: CreateOrderInput): Promise<Order>;
  getOrder(id: string): Promise<Order>;
  cancelOrder(id: string): Promise<Order>;
  confirmPickup(id: string): Promise<Order>;
  /** Simulate the "payment received" webhook (mock only; no-op-ish in http). */
  markPaid(id: string): Promise<Order>;
  /** Add items to a live order (D3). Rejects if `canAddOrder(order)` is false. */
  createAddon(orderId: string, items: AddonInput): Promise<Order>;

  /** Push live queue snapshots until unsubscribed. Fires once immediately. */
  subscribeQueue(orderId: string, cb: (state: QueueState) => void): Unsubscribe;
  /** Push refund progress until it reaches `done`. */
  subscribeRefund(orderId: string, cb: (state: RefundState) => void): Unsubscribe;

  getStalls(): Promise<Stall[]>;
  getPlans(): Promise<SubscriptionPlan[]>;
  getBenefits(): Promise<SubscriptionBenefit[]>;
  getProfile(): Promise<UserProfile>;

  /* vendor */
  getVendorSummary(): Promise<VendorSummary>;
  /** Demo-only (D4): advance to the next tier and reset the progress window. Real tier progression would be server-computed from order history. */
  advanceVendorTier(): Promise<VendorSummary>;
  /** Demo-only (D4): reset the tier demo back to bronze. */
  resetVendorTier(): Promise<VendorSummary>;
  getVendorOrders(): Promise<VendorOrder[]>;
  /** Move an order to its next stage (baru→masak→siap→done/removed). */
  advanceVendorOrder(id: string): Promise<VendorOrder[]>;
  rejectVendorOrder(id: string, reason: string): Promise<VendorOrder[]>;
  getPreorders(): Promise<Preorder[]>;
  verifyPickupCode(code: string): Promise<PickupRecord | null>;
  getVendorMenu(): Promise<VendorMenuItem[]>;
  setStock(itemId: string, inStock: boolean): Promise<VendorMenuItem[]>;
  markAllOut(): Promise<VendorMenuItem[]>;
  getPayouts(): Promise<Payout[]>;
  getTxns(): Promise<Txn[]>;
  getLoyalCustomers(): Promise<LoyalCustomer[]>;
}
