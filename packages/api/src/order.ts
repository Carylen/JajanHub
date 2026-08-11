import type { Order, OrderStatus } from './types';

/**
 * "A" + queue number, e.g. "A27" — the contract only carries the numeric
 * `queueNumber`, so both the customer hero display and the vendor board's
 * badge derive this instead of storing a separate letter/prefixed field.
 */
export function formatQueueCode(order: Pick<Order, 'queueNumber'>): string {
  return `A${order.queueNumber}`;
}

/** Minutes elapsed since `order.createdAt` — replaces the old stored `waitMins` field on the vendor board, which would otherwise go stale between polls. */
export function minutesSince(createdAt: string): number {
  const ms = Date.now() - new Date(createdAt).getTime();
  return Math.max(0, Math.floor(ms / 60_000));
}

/** Maps an order status to the 3-step queue stage index used by the hero. */
export function stageOf(status: OrderStatus): number {
  if (status === 'ready' || status === 'picked_up') return 2;
  if (status === 'cooking') return 1;
  return 0;
}
