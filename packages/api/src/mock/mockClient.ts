/**
 * Mock implementation of {@link JajanhubClient}. Reads seed data and simulates
 * the queue/payment/refund progression with timers, exactly like the design's
 * `setInterval` dummies — but hidden behind the client interface so swapping to
 * the http client requires no UI changes.
 */
import type { JajanhubClient, Unsubscribe } from '../client';
import { PRICING } from '../config';
import type {
  CreateOrderInput,
  Order,
  OrderLine,
  OrderStatus,
  QueueState,
  RefundState,
  VendorOrder,
  VendorOrderStatus,
  Warung,
} from '../types';
import {
  BENEFITS,
  DEFAULT_MERCHANT_ID,
  LOYAL_CUSTOMERS,
  PAYOUTS,
  PLANS,
  PROFILE,
  STALLS,
  VENDOR_ORDERS,
  WARUNGS,
} from './seed';
import { orderStore } from './store';

const delay = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

let queueSeq = 26;

function buildLines(warung: Warung, cart: Record<string, number>): OrderLine[] {
  return warung.menu
    .filter((m) => (cart[m.id] ?? 0) > 0)
    .map((m) => ({ itemId: m.id, name: m.name, qty: cart[m.id] ?? 0, price: m.price }));
}

/** Maps an order status to the 3-step queue stage index used by the hero. */
export function stageOf(status: OrderStatus): number {
  if (status === 'ready' || status === 'picked_up') return 2;
  if (status === 'cooking') return 1;
  return 0;
}

let vendorOrders: VendorOrder[] = VENDOR_ORDERS.map((o) => ({ ...o }));

export function createMockClient(): JajanhubClient {
  return {
    async getWarung(id) {
      await delay(200);
      const w = WARUNGS[id] ?? WARUNGS[DEFAULT_MERCHANT_ID];
      if (!w) throw new Error(`Warung ${id} tidak ditemukan`);
      return w;
    },

    async createOrder(input: CreateOrderInput) {
      await delay(300);
      const warung = WARUNGS[input.merchantId] ?? WARUNGS[DEFAULT_MERCHANT_ID];
      if (!warung) throw new Error('Warung tidak ditemukan');
      const lines = buildLines(warung, input.cart);
      if (lines.length === 0) throw new Error('Keranjang kosong');
      const subtotal = lines.reduce((a, l) => a + l.qty * l.price, 0);
      const serviceFee = PRICING.serviceFee;
      const priorityFee = input.priority ? PRICING.priorityFee : 0;
      const num = ++queueSeq;
      const id = `AY-${2000 + num}`;
      const order: Order = {
        id,
        merchantId: warung.id,
        merchantName: warung.name,
        code: `#${id}`,
        queueLetter: 'A',
        queueNumber: num,
        lines,
        subtotal,
        serviceFee,
        priorityFee,
        total: subtotal + serviceFee + priorityFee,
        priority: input.priority,
        pickupMode: input.pickupMode,
        pickupSlot: input.pickupSlot,
        pickupCode: String(4000 + Math.floor(Math.random() * 5999)),
        status: 'awaiting_payment',
        createdAt: new Date().toISOString(),
      };
      return orderStore.put(order);
    },

    async getOrder(id) {
      await delay(150);
      const order = orderStore.get(id);
      if (!order) throw new Error(`Pesanan ${id} tidak ditemukan`);
      return order;
    },

    async markPaid(id) {
      const next = orderStore.update(id, { status: 'paid' });
      if (!next) throw new Error('Pesanan tidak ditemukan');
      return next;
    },

    async cancelOrder(id) {
      const next = orderStore.update(id, { status: 'cancelled' });
      if (!next) throw new Error('Pesanan tidak ditemukan');
      return next;
    },

    async confirmPickup(id) {
      const next = orderStore.update(id, { status: 'picked_up' });
      if (!next) throw new Error('Pesanan tidak ditemukan');
      return next;
    },

    subscribeQueue(orderId, cb): Unsubscribe {
      const timers: ReturnType<typeof setTimeout>[] = [];
      let people = WARUNGS[DEFAULT_MERCHANT_ID]?.peopleAhead ?? 12;
      let eta = WARUNGS[DEFAULT_MERCHANT_ID]?.etaMin ?? 18;
      let payLeft = 299;
      let stopped = false;

      const snapshot = (): QueueState => {
        const order = orderStore.get(orderId);
        const status = order?.status ?? 'awaiting_payment';
        return { status, peopleAhead: people, etaMin: eta, payLeft };
      };
      const emit = () => {
        if (!stopped) cb(snapshot());
      };

      emit();

      // Payment countdown while awaiting payment.
      const payTick = setInterval(() => {
        const order = orderStore.get(orderId);
        if (!order || order.status !== 'awaiting_payment') return;
        payLeft = Math.max(0, payLeft - 1);
        emit();
      }, 1000);
      timers.push(payTick as unknown as ReturnType<typeof setTimeout>);

      // Once paid, run the cook → ready progression (design timings).
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

      // Watch for the paid transition, then progress once.
      let progressed = false;
      const watch = setInterval(() => {
        const order = orderStore.get(orderId);
        if (!order) return;
        if (!progressed && (order.status === 'paid' || order.status === 'cooking')) {
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
      const amount = order?.total ?? 0;
      const emit = (state: RefundState) => {
        if (!stopped) cb(state);
      };
      emit({ stage: 'cancelled', amount, method: 'GoPay •••• 7890' });
      timers.push(setTimeout(() => {
        orderStore.update(orderId, { status: 'refunding' });
        emit({ stage: 'processing', amount, method: 'GoPay •••• 7890' });
      }, 1500));
      timers.push(setTimeout(() => {
        orderStore.update(orderId, { status: 'refunded' });
        emit({ stage: 'done', amount, method: 'GoPay •••• 7890' });
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
    async getPlans() {
      await delay(120);
      return PLANS;
    },
    async getBenefits() {
      await delay(120);
      return BENEFITS;
    },
    async getProfile() {
      await delay(150);
      return PROFILE;
    },

    async getVendorOrders() {
      await delay(200);
      return vendorOrders.map((o) => ({ ...o }));
    },
    async updateVendorOrder(id, status: VendorOrderStatus) {
      await delay(150);
      vendorOrders = vendorOrders.map((o) => (o.id === id ? { ...o, status } : o));
      const updated = vendorOrders.find((o) => o.id === id);
      if (!updated) throw new Error('Pesanan tidak ditemukan');
      return { ...updated };
    },
    async rejectVendorOrder(id) {
      await delay(150);
      vendorOrders = vendorOrders.filter((o) => o.id !== id);
    },
    async getPayouts() {
      await delay(200);
      return PAYOUTS;
    },
    async getLoyalCustomers() {
      await delay(200);
      return LOYAL_CUSTOMERS;
    },
  };
}
