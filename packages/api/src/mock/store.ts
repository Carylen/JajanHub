/**
 * In-memory order store with best-effort localStorage mirroring so a full page
 * reload on `/order/[orderId]` still finds the order created earlier. Purely a
 * mock concern — the http client keeps state on the server.
 */
import type { Order } from '../types';

const KEY = 'jajanhub:orders';
const mem = new Map<string, Order>();
let hydrated = false;

function hydrate(): void {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Order[];
    for (const o of parsed) mem.set(o.id, o);
  } catch {
    /* ignore corrupt storage */
  }
}

function persist(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify([...mem.values()]));
  } catch {
    /* storage full / unavailable — mock still works in-memory */
  }
}

export const orderStore = {
  get(id: string): Order | undefined {
    hydrate();
    return mem.get(id);
  },
  put(order: Order): Order {
    hydrate();
    mem.set(order.id, order);
    persist();
    return order;
  },
  update(id: string, patch: Partial<Order>): Order | undefined {
    hydrate();
    const cur = mem.get(id);
    if (!cur) return undefined;
    const next = { ...cur, ...patch };
    mem.set(id, next);
    persist();
    return next;
  },
};
