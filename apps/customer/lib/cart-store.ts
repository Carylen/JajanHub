import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PickupMode = 'now' | 'later';

interface CartState {
  /** Merchant the cart belongs to; switching merchants clears it. */
  merchantId: string | null;
  /** menu item id -> quantity */
  items: Record<string, number>;
  priority: boolean;
  pickupMode: PickupMode;
  pickupSlot: string | null;

  ensureMerchant: (merchantId: string) => void;
  add: (itemId: string) => void;
  remove: (itemId: string) => void;
  setPriority: (priority: boolean) => void;
  togglePriority: () => void;
  setPickupMode: (mode: PickupMode) => void;
  setPickupSlot: (slot: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      merchantId: null,
      items: {},
      priority: false,
      pickupMode: 'now',
      pickupSlot: null,

      ensureMerchant: (merchantId) => {
        if (get().merchantId !== merchantId) {
          set({ merchantId, items: {}, priority: false, pickupMode: 'now', pickupSlot: null });
        }
      },
      add: (itemId) =>
        set((s) => ({ items: { ...s.items, [itemId]: (s.items[itemId] ?? 0) + 1 } })),
      remove: (itemId) =>
        set((s) => {
          const next = { ...s.items };
          const q = (next[itemId] ?? 0) - 1;
          if (q <= 0) delete next[itemId];
          else next[itemId] = q;
          return { items: next };
        }),
      setPriority: (priority) => set({ priority }),
      togglePriority: () => set((s) => ({ priority: !s.priority })),
      setPickupMode: (pickupMode) => set({ pickupMode }),
      setPickupSlot: (pickupSlot) => set({ pickupSlot }),
      clear: () => set({ items: {}, priority: false, pickupMode: 'now', pickupSlot: null }),
    }),
    { name: 'jajanhub:cart' },
  ),
);

/** Total item count across the cart. */
export function cartCount(items: Record<string, number>): number {
  return Object.values(items).reduce((a, b) => a + b, 0);
}
