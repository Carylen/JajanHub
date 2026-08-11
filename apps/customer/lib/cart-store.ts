import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PickupMode = 'now' | 'later';

interface CartState {
  /** Vendor the cart belongs to; switching vendors clears it. */
  vendorId: string | null;
  /** menu item id -> quantity */
  items: Record<string, number>;
  priority: boolean;
  pickupMode: PickupMode;
  pickupSlot: string | null;

  ensureVendor: (vendorId: string) => void;
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
      vendorId: null,
      items: {},
      priority: false,
      pickupMode: 'now',
      pickupSlot: null,

      ensureVendor: (vendorId) => {
        if (get().vendorId !== vendorId) {
          set({ vendorId, items: {}, priority: false, pickupMode: 'now', pickupSlot: null });
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
    // v2: bumped when the persisted `merchantId` field was renamed to `vendorId`.
    { name: 'jajanhub:cart:v2' },
  ),
);

/** Total item count across the cart. */
export function cartCount(items: Record<string, number>): number {
  return Object.values(items).reduce((a, b) => a + b, 0);
}
