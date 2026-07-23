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
  QueueState,
  RefundState,
  Stall,
  SubscriptionBenefit,
  SubscriptionPlan,
  UserProfile,
  VendorOrder,
  VendorOrderStatus,
  Warung,
} from './types';

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

  /** Push live queue snapshots until unsubscribed. Fires once immediately. */
  subscribeQueue(orderId: string, cb: (state: QueueState) => void): Unsubscribe;
  /** Push refund progress until it reaches `done`. */
  subscribeRefund(orderId: string, cb: (state: RefundState) => void): Unsubscribe;

  getStalls(): Promise<Stall[]>;
  getPlans(): Promise<SubscriptionPlan[]>;
  getBenefits(): Promise<SubscriptionBenefit[]>;
  getProfile(): Promise<UserProfile>;

  /* vendor */
  getVendorOrders(): Promise<VendorOrder[]>;
  updateVendorOrder(id: string, status: VendorOrderStatus): Promise<VendorOrder>;
  rejectVendorOrder(id: string, reasonId: string): Promise<void>;
  getPayouts(): Promise<Payout[]>;
  getLoyalCustomers(): Promise<LoyalCustomer[]>;
}
