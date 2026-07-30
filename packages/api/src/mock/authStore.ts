/**
 * In-memory auth session with best-effort localStorage mirroring, mirroring
 * `store.ts`'s pattern so a reload keeps the demo session logged in. Purely a
 * mock concern — the http client would keep this server-side (cookie/token).
 */
import type { AuthSession } from '../types';

const KEY = 'jajanhub:session';
let session: AuthSession | null = null;
let hydrated = false;

function hydrate(): void {
  if (hydrated || typeof window === 'undefined') return;
  hydrated = true;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (raw) session = JSON.parse(raw) as AuthSession;
  } catch {
    /* ignore corrupt storage */
  }
}

function persist(): void {
  if (typeof window === 'undefined') return;
  try {
    if (session) window.localStorage.setItem(KEY, JSON.stringify(session));
    else window.localStorage.removeItem(KEY);
  } catch {
    /* storage full / unavailable — mock still works in-memory */
  }
}

export const authStore = {
  get(): AuthSession | null {
    hydrate();
    return session;
  },
  set(next: AuthSession): AuthSession {
    hydrate();
    session = next;
    persist();
    return session;
  },
  clear(): void {
    hydrate();
    session = null;
    persist();
  },
};
