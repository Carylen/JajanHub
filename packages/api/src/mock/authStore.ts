/**
 * In-memory auth session with best-effort localStorage mirroring, mirroring
 * `store.ts`'s pattern so a reload keeps the demo session logged in. Purely a
 * mock concern — the http client keeps this server-side (httpOnly cookie,
 * see API_CONTRACT.md §0).
 */
import type { Customer } from '../auth';

const KEY = 'jajanhub:session';
let customer: Customer | null = null;
let hydrated = false;

function hydrate(): void {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) customer = JSON.parse(raw) as Customer;
  } catch {
    /* ignore corrupt storage */
  }
}

function persist(): void {
  if (typeof window === 'undefined') return;
  try {
    if (customer) window.localStorage.setItem(KEY, JSON.stringify(customer));
    else window.localStorage.removeItem(KEY);
  } catch {
    /* storage full / unavailable — mock still works in-memory */
  }
}

export const authStore = {
  get(): Customer | null {
    hydrate();
    return customer;
  },
  set(next: Customer): Customer {
    hydrate();
    customer = next;
    persist();
    return customer;
  },
  clear(): void {
    hydrate();
    customer = null;
    persist();
  },
};
