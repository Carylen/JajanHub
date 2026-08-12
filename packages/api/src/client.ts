/**
 * The single interface every backend implementation satisfies. UI code depends
 * only on this — never on `fetch` or the mock internals — so swapping mock →
 * http is invisible to components (BRIEF §6).
 *
 * Method names stay app-ergonomic (e.g. `getWarung` composes two contract
 * endpoints under the hood) — what must match API_CONTRACT.md precisely is
 * the *types* flowing through, plus what `http/httpClient.ts` actually sends
 * on the wire and what `mock/mockClient.ts` simulates.
 */
import type { Customer, RequestOtpResult } from './auth';
import type {
  CancelReason,
  ConfigFees,
  CreateOrderInput,
  LoyalCustomer,
  Order,
  Payout,
  PickupRecord,
  Preorder,
  QueueState,
  RefundState,
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
} from './types';

/** Map of menu item id -> quantity, same shape `CreateOrderInput.cart` uses. */
export type AddonInput = Record<string, number>;

/** Call to stop receiving realtime callbacks. */
export type Unsubscribe = () => void;

export interface JajanhubClient {
  /* auth (API_CONTRACT.md §1) — no screen calls these yet, see auth.ts */
  requestOtp(phone: string): Promise<RequestOtpResult>;
  verifyOtp(phone: string, code: string): Promise<Customer>;
  getMe(): Promise<Customer>;
  logout(): Promise<void>;

  /* customer */
  getWarung(id: string): Promise<Vendor>;
  createOrder(input: CreateOrderInput): Promise<Order>;
  getOrder(id: string): Promise<Order>;
  cancelOrder(id: string, reason: CancelReason): Promise<Order>;
  confirmPickup(id: string): Promise<Order>;
  /** Simulate the "payment received" webhook (mock only; no-op-ish in http). */
  markPaid(id: string): Promise<Order>;
  /** Add items to a live order (D3). Rejects if `canAddOrder(order)` is false. */
  createAddon(orderId: string, items: AddonInput): Promise<Order>;

  /** Push live queue snapshots until unsubscribed. Fires once immediately. */
  subscribeQueue(orderId: string, cb: (state: QueueState) => void): Unsubscribe;
  /** Push refund progress until it reaches `completed`. */
  subscribeRefund(orderId: string, cb: (state: RefundState) => void): Unsubscribe;

  getStalls(): Promise<Stall[]>;
  getConfigFees(): Promise<ConfigFees>;
  getPlans(): Promise<SubscriptionPlan[]>;
  getBenefits(): Promise<SubscriptionBenefit[]>;
  getSubscriptionStatus(): Promise<SubscriptionStatus>;
  getProfile(): Promise<UserProfile>;
  /** Orders across all vendors that aren't picked up/cancelled/rejected yet (API_CONTRACT.md §13's `GET /orders/active`). */
  getActiveOrders(): Promise<Order[]>;

  /* vendor */
  getVendorSummary(): Promise<VendorSummary>;
  getVendorTier(): Promise<VendorTierStatus>;
  /** Demo-only (D4): advance to the next tier and reset the progress window. Real tier progression would be server-computed from order history. */
  advanceVendorTier(): Promise<VendorTierStatus>;
  /** Demo-only (D4): reset the tier demo back to bronze. */
  resetVendorTier(): Promise<VendorTierStatus>;
  getVendorOrders(): Promise<Order[]>;
  /** Move an order to its next stage — confirm (waiting_confirmation→cooking), advance (cooking→ready), or the vendor board's "quick" pickup shortcut (ready→picked_up; the code-verified path via `verifyPickupCode` is the primary contract flow for that step). */
  advanceVendorOrder(id: string): Promise<Order[]>;
  rejectVendorOrder(id: string, reason: RejectReasonId): Promise<Order[]>;
  getPreorders(): Promise<Preorder[]>;
  verifyPickupCode(code: string): Promise<PickupRecord | null>;
  getVendorMenu(): Promise<VendorMenuItem[]>;
  setStock(itemId: string, inStock: boolean): Promise<VendorMenuItem[]>;
  markAllOut(): Promise<VendorMenuItem[]>;
  getPayouts(): Promise<Payout[]>;
  getTxns(): Promise<Txn[]>;
  getLoyalCustomers(): Promise<LoyalCustomer[]>;
}
