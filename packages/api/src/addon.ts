import { PRICING } from './config';
import type { Order } from './types';

/**
 * Whether an order can still receive an add-on (D3): status must still be
 * "bisa ditambah" (paid/cooking — not yet ready/picked-up/cancelled) and
 * under the max-per-order cap. Single source of truth so mobile, desktop,
 * and the mutation layer (`createAddon`) all agree — never re-derive this
 * inline in a component.
 */
export function canAddOrder(order: Pick<Order, 'status' | 'addons'>): boolean {
  const addable = order.status === 'waiting_confirmation' || order.status === 'cooking';
  return addable && order.addons.length < PRICING.maxAddonsPerOrder;
}
