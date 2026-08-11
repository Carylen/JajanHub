/**
 * Mock implementation of {@link JajanhubClient}. Reads seed data and simulates
 * the queue/payment/refund progression with timers, exactly like the design's
 * `setInterval` dummies — but hidden behind the client interface so swapping to
 * the http client requires no UI changes. Throws {@link ApiError} with
 * API_CONTRACT.md's documented codes for the failure paths the contract
 * defines, so UI error handling exercises the same branches it will against
 * the real backend.
 */
import type { Customer, RequestOtpResult } from '../auth';
import type { AddonInput, JajanhubClient, Unsubscribe } from '../client';
import { canAddOrder } from '../addon';
import { PRICING } from '../config';
import { ApiError } from '../errors';
import { nextTierId } from '../tiers';
import type {
  CancelReason,
  CreateOrderInput,
  Order,
  OrderAddon,
  OrderLine,
  OrderStatus,
  QueueState,
  RefundState,
  RejectReasonId,
  Vendor,
  VendorMenuItem,
  VendorTierStatus,
} from '../types';
import {
  BENEFITS,
  DEFAULT_VENDOR_ID,
  LOYAL_CUSTOMERS,
  PAYOUTS,
  PICKUP_RECORDS,
  PLANS,
  PREORDERS,
  PROFILE,
  STALLS,
  TIER_BENEFITS,
  TIER_THRESHOLDS,
  TXNS,
  VENDOR_MENU,
  VENDOR_ORDERS,
  VENDOR_SUMMARY,
  VENDOR_TIER_STATUS,
  WARUNGS,
} from './seed';
import { orderStore } from './store';

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

let queueSeq = 26;

/** Demo phone/OTP — no real WhatsApp provider wired (API_CONTRACT.md §1). TODO confirm with backend. */
const DEMO_OTP_CODE = '123456';
let mockCustomer: Customer | null = null;

function buildLines(vendor: Vendor, cart: Record<string, number>): OrderLine[] {
  return vendor.menu
    .filter((m) => (cart[m.id] ?? 0) > 0)
    .map((m) => ({ menuItemId: m.id, name: m.name, qty: cart[m.id] ?? 0, priceRp: m.priceRp }));
}

const VENDOR_NEXT: Record<Exclude<OrderStatus, 'pending_payment' | 'cancelled' | 'rejected'>, OrderStatus> = {
  waiting_confirmation: 'cooking',
  cooking: 'ready',
  ready: 'picked_up',
  picked_up: 'picked_up',
};

// Module-level mutable vendor state (mirrors the design's local component state).
let vendorOrders: Order[] = VENDOR_ORDERS.map((o) => ({ ...o }));
let vendorMenu: VendorMenuItem[] = VENDOR_MENU.map((m) => ({ ...m }));
let vendorSummary = { ...VENDOR_SUMMARY };
let vendorTierStatus: VendorTierStatus = { ...VENDOR_TIER_STATUS };

export function createMockClient(): JajanhubClient {
  return {
    async requestOtp(phone: string): Promise<RequestOtpResult> {
      await delay(300);
      if (!/^\d{9,13}$/.test(phone)) {
        throw new ApiError('INVALID_PHONE', 'Format nomor tidak valid');
      }
      return { expiresInSec: 120, resendAvailableInSec: 45 };
    },
    async verifyOtp(phone: string, code: string): Promise<Customer> {
      await delay(300);
      if (code !== DEMO_OTP_CODE) {
        throw new ApiError('OTP_INVALID', 'Kode OTP salah', { details: { attemptsLeft: 2 } });
      }
      const masked = phone.length >= 3 ? `0${phone.slice(0, 3)}-••••-${phone.slice(-3)}` : phone;
      mockCustomer = {
        id: 'cus_demo',
        phone: `+62${phone}`,
        phoneMasked: masked,
        createdAt: new Date().toISOString(),
        isNewCustomer: true,
      };
      return mockCustomer;
    },
    async getMe(): Promise<Customer> {
      await delay(100);
      if (!mockCustomer) throw new ApiError('UNAUTHENTICATED', 'Belum login');
      return mockCustomer;
    },
    async logout(): Promise<void> {
      await delay(100);
      mockCustomer = null;
    },

    async getWarung(id) {
      await delay(200);
      const w = WARUNGS[id] ?? WARUNGS[DEFAULT_VENDOR_ID];
      if (!w) throw new ApiError('ORDER_NOT_FOUND', `Warung ${id} tidak ditemukan`);
      return w;
    },

    async createOrder(input: CreateOrderInput) {
      await delay(300);
      const vendor = WARUNGS[input.vendorId] ?? WARUNGS[DEFAULT_VENDOR_ID];
      if (!vendor) throw new ApiError('ORDER_NOT_FOUND', 'Warung tidak ditemukan');
      if (!vendor.isOpen) throw new ApiError('VENDOR_CLOSED', 'Warung sedang tutup');
      for (const [itemId, qty] of Object.entries(input.cart)) {
        if (qty <= 0) continue;
        const item = vendor.menu.find((m) => m.id === itemId);
        if (item && item.isAvailable === false) {
          throw new ApiError('ITEM_UNAVAILABLE', `${item.name} lagi habis`, { details: { itemId } });
        }
      }
      const lines = buildLines(vendor, input.cart);
      if (lines.length === 0) throw new Error('Keranjang kosong');
      const subtotalRp = lines.reduce((a, l) => a + l.qty * l.priceRp, 0);
      const serviceFeeRp = PRICING.serviceFeeRp;
      const priorityFeeRp = input.isPriority ? PRICING.priorityFeeRp : 0;
      const num = ++queueSeq;
      const id = `AY-${2000 + num}`;
      const order: Order = {
        id,
        vendorId: vendor.id,
        customerId: mockCustomer?.id ?? 'cus_guest',
        queueNumber: num,
        lines,
        subtotalRp,
        serviceFeeRp,
        totalRp: subtotalRp + serviceFeeRp + priorityFeeRp,
        status: 'pending_payment',
        isPriority: input.isPriority,
        addons: [],
        pickupCode: '',
        createdAt: new Date().toISOString(),
        estimatedReadyAt: null,
        confirmDeadlineAt: null,
        code: `#${id}`,
        vendorName: vendor.name,
        priorityFeeRp,
        pickupMode: input.pickupMode,
        pickupSlot: input.pickupSlot,
      };
      return orderStore.put(order);
    },

    async getOrder(id) {
      await delay(150);
      const order = orderStore.get(id);
      if (!order) throw new ApiError('ORDER_NOT_FOUND', `Pesanan ${id} tidak ditemukan`);
      return order;
    },

    async markPaid(id) {
      // Mock-only: simulates the payment-gateway webhook (API_CONTRACT.md §8) that
      // moves `pending_payment` → `waiting_confirmation` and starts the vendor's
      // confirm-deadline countdown.
      const confirmDeadlineAt = new Date(Date.now() + 5 * 60_000).toISOString();
      const next = orderStore.update(id, { status: 'waiting_confirmation', confirmDeadlineAt });
      if (!next) throw new ApiError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan');
      return next;
    },

    async createAddon(orderId: string, items: AddonInput) {
      await delay(300);
      const order = orderStore.get(orderId);
      if (!order) throw new ApiError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan');
      if (order.addons.length >= PRICING.maxAddonsPerOrder) {
        throw new ApiError('ADDON_LIMIT_REACHED', 'Batas tambahan pesanan tercapai');
      }
      if (!canAddOrder(order)) {
        throw new ApiError('ORDER_NOT_ADDABLE', 'Pesanan ini sudah tidak bisa ditambah lagi');
      }
      const vendor = WARUNGS[order.vendorId] ?? WARUNGS[DEFAULT_VENDOR_ID];
      if (!vendor) throw new ApiError('ORDER_NOT_FOUND', 'Warung tidak ditemukan');
      const lines = buildLines(vendor, items);
      if (lines.length === 0) throw new Error('Belum ada item tambahan dipilih');
      const subtotalRp = lines.reduce((a, l) => a + l.qty * l.priceRp, 0);
      // Mock simplification: the contract's addon flow issues its own
      // `paymentQrisUrl` and starts `pending_payment`, but no screen in this
      // app calls a separate "mark addon paid" step today (the addon sheet's
      // countdown is purely cosmetic) — mark `paid` immediately so behavior
      // matches what's actually wired up. TODO confirm with backend.
      const addon: OrderAddon = {
        id: `${orderId}-addon-${order.addons.length + 1}`,
        parentOrderId: orderId,
        lines,
        feeRp: PRICING.addonFeeRp,
        status: 'paid',
        createdAt: new Date().toISOString(),
        subtotalRp,
        totalRp: subtotalRp + PRICING.addonFeeRp,
      };
      const next = orderStore.update(orderId, { addons: [...order.addons, addon] });
      if (!next) throw new ApiError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan');
      return next;
    },

    async cancelOrder(id, reason: CancelReason) {
      const order = orderStore.get(id);
      if (!order) throw new ApiError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan');
      if (!['pending_payment', 'waiting_confirmation', 'cooking'].includes(order.status)) {
        throw new ApiError('CANCEL_NOT_ALLOWED', 'Pesanan sudah tidak bisa dibatalkan');
      }
      void reason; // accepted per API_CONTRACT.md §4 request body; not persisted on Order today
      const next = orderStore.update(id, { status: 'cancelled' });
      if (!next) throw new ApiError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan');
      return next;
    },

    async confirmPickup(id) {
      // Not a literal contract endpoint — the real pickup confirmation is
      // vendor-side and code-verified (`verifyPickupCode`). This customer-side
      // "sudah diambil" convenience predates that flow and is kept as a
      // mock-only shortcut so the existing screen still works.
      const next = orderStore.update(id, { status: 'picked_up' });
      if (!next) throw new ApiError('ORDER_NOT_FOUND', 'Pesanan tidak ditemukan');
      return next;
    },

    subscribeQueue(orderId, cb): Unsubscribe {
      const timers: ReturnType<typeof setTimeout>[] = [];
      let people = WARUNGS[DEFAULT_VENDOR_ID]?.queueEstimate.peopleAhead ?? 12;
      let eta = WARUNGS[DEFAULT_VENDOR_ID]?.queueEstimate.etaMin ?? 18;
      let payLeft = 299;
      let stopped = false;

      const snapshot = (): QueueState => {
        const order = orderStore.get(orderId);
        const status = order?.status ?? 'pending_payment';
        return { status, peopleAhead: people, etaMin: eta, payLeft };
      };
      const emit = () => {
        if (!stopped) cb(snapshot());
      };

      emit();

      // Payment countdown while awaiting payment.
      const payTick = setInterval(() => {
        const order = orderStore.get(orderId);
        if (!order || order.status !== 'pending_payment') return;
        payLeft = Math.max(0, payLeft - 1);
        emit();
      }, 1000);
      timers.push(payTick as unknown as ReturnType<typeof setTimeout>);

      // Once paid, run the cook → ready progression (design timings). Mock-only:
      // the real backend requires an explicit vendor `confirm`/`advance` action;
      // this local timer simulates that response automatically since the
      // customer and vendor apps' mock stores aren't connected to each other.
      const startProgress = () => {
        timers.push(setTimeout(() => {
          orderStore.update(orderId, { status: 'cooking' });
          emit();
        }, 3600));
        const aheadTick = setInterval(() => {
          people = Math.max(0, people - 2);
          eta = Math.max(2, eta - 3);
          emit();
        }, 2000);
        timers.push(aheadTick as unknown as ReturnType<typeof setTimeout>);
        timers.push(setTimeout(() => {
          clearInterval(aheadTick);
          people = 0;
          eta = 0;
          orderStore.update(orderId, { status: 'ready' });
          emit();
        }, 11000));
      };

      // Watch for the waiting_confirmation transition, then progress once.
      let progressed = false;
      const watch = setInterval(() => {
        const order = orderStore.get(orderId);
        if (!order) return;
        if (!progressed && (order.status === 'waiting_confirmation' || order.status === 'cooking')) {
          progressed = true;
          clearInterval(watch);
          startProgress();
        }
        if (order.status === 'ready' || order.status === 'picked_up') {
          progressed = true;
          clearInterval(watch);
        }
      }, 300);
      timers.push(watch as unknown as ReturnType<typeof setTimeout>);

      return () => {
        stopped = true;
        clearInterval(payTick);
        clearInterval(watch);
        timers.forEach((t) => {
          clearTimeout(t);
          clearInterval(t as unknown as ReturnType<typeof setInterval>);
        });
      };
    },

    subscribeRefund(orderId, cb): Unsubscribe {
      const timers: ReturnType<typeof setTimeout>[] = [];
      let stopped = false;
      const order = orderStore.get(orderId);
      const amountRp = order?.totalRp ?? 0;
      const emit = (state: RefundState) => {
        if (!stopped) cb(state);
      };
      emit({ stage: 'cancelled', amountRp, method: 'GoPay •••• 7890', estimatedDays: '1-3' });
      timers.push(setTimeout(() => {
        emit({ stage: 'processing', amountRp, method: 'GoPay •••• 7890', estimatedDays: '1-3' });
      }, 1500));
      timers.push(setTimeout(() => {
        emit({ stage: 'completed', amountRp, method: 'GoPay •••• 7890', estimatedDays: '1-3' });
      }, 5000));
      return () => {
        stopped = true;
        timers.forEach(clearTimeout);
      };
    },

    async getStalls() {
      await delay(200);
      return STALLS;
    },
    async getConfigFees() {
      await delay(80);
      return { ...PRICING };
    },
    async getPlans() {
      await delay(120);
      return PLANS;
    },
    async getBenefits() {
      await delay(120);
      return BENEFITS;
    },
    async getSubscriptionStatus() {
      await delay(120);
      return { isActive: PROFILE.subscriptionActive, planId: null, expiresAt: null };
    },
    async getProfile() {
      await delay(150);
      return PROFILE;
    },

    async getVendorSummary() {
      await delay(150);
      return { ...vendorSummary };
    },
    async getVendorTier() {
      await delay(150);
      return { ...vendorTierStatus };
    },
    async advanceVendorTier() {
      await delay(150);
      const current = nextTierId(vendorTierStatus.current);
      const next = current === 'gold' ? null : nextTierId(current);
      const thresholds = next ? TIER_THRESHOLDS[current as 'bronze' | 'silver'] : null;
      vendorTierStatus = {
        current,
        next,
        progress: {
          ordersCompleted: 0,
          ordersRequired: thresholds?.ordersRequired ?? vendorTierStatus.progress.ordersRequired,
          avgResponseSec: vendorTierStatus.progress.avgResponseSec,
          responseRequiredSec: thresholds?.responseRequiredSec ?? vendorTierStatus.progress.responseRequiredSec,
          timeoutRejectRate: vendorTierStatus.progress.timeoutRejectRate,
          timeoutRejectRateMax: vendorTierStatus.progress.timeoutRejectRateMax,
        },
        benefits: TIER_BENEFITS[current],
      };
      return { ...vendorTierStatus };
    },
    async resetVendorTier() {
      await delay(100);
      vendorTierStatus = {
        current: 'bronze',
        next: 'silver',
        progress: {
          ordersCompleted: 6,
          ordersRequired: TIER_THRESHOLDS.bronze.ordersRequired,
          avgResponseSec: 260,
          responseRequiredSec: TIER_THRESHOLDS.bronze.responseRequiredSec,
          timeoutRejectRate: 0.02,
          timeoutRejectRateMax: 0.05,
        },
        benefits: TIER_BENEFITS.bronze,
      };
      return { ...vendorTierStatus };
    },
    async getVendorOrders() {
      await delay(200);
      return vendorOrders.map((o) => ({ ...o }));
    },
    async advanceVendorOrder(id) {
      await delay(120);
      vendorOrders = vendorOrders
        .map((o) => {
          if (o.id !== id) return o;
          const next = VENDOR_NEXT[o.status as keyof typeof VENDOR_NEXT];
          if (!next) return o;
          if (next === 'ready') return { ...o, status: next, pickupCode: String(4000 + Math.floor(Math.random() * 5999)) };
          return { ...o, status: next };
        })
        .filter((o) => o.status !== 'picked_up');
      return vendorOrders.map((o) => ({ ...o }));
    },
    async rejectVendorOrder(id, reason: RejectReasonId) {
      await delay(120);
      vendorOrders = vendorOrders.map((o) =>
        o.id === id ? { ...o, status: 'rejected' as const, rejectReason: reason, rejectedBy: 'vendor' as const } : o,
      );
      return vendorOrders.map((o) => ({ ...o }));
    },
    async getPreorders() {
      await delay(150);
      return PREORDERS;
    },
    async verifyPickupCode(code: string) {
      await delay(200);
      return PICKUP_RECORDS.find((r) => r.code === code) ?? null;
    },
    async getVendorMenu() {
      await delay(150);
      return vendorMenu.map((m) => ({ ...m }));
    },
    async setStock(itemId, inStock) {
      await delay(80);
      vendorMenu = vendorMenu.map((m) => (m.id === itemId ? { ...m, inStock } : m));
      return vendorMenu.map((m) => ({ ...m }));
    },
    async markAllOut() {
      await delay(120);
      vendorMenu = vendorMenu.map((m) => ({ ...m, inStock: false }));
      return vendorMenu.map((m) => ({ ...m }));
    },
    async getPayouts() {
      await delay(200);
      return PAYOUTS;
    },
    async getTxns() {
      await delay(200);
      return TXNS;
    },
    async getLoyalCustomers() {
      await delay(200);
      return LOYAL_CUSTOMERS;
    },
  };
}
