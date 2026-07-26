'use client';
import { useEffect, useState } from 'react';
import { useWarung, useCreateAddon, canAddOrder, PRICING, type MenuItem, type Order } from '@jajanhub/api';

const PAY_COUNTDOWN_SECONDS = 99;
const TOAST_MS = 3400;

export interface AddonMenuRow {
  item: MenuItem;
  qty: number;
}

export interface AddonFlowView {
  open: boolean;
  openFlow: () => void;
  closeFlow: () => void;
  step: 'menu' | 'pay';
  menu: AddonMenuRow[];
  add: (id: string) => void;
  dec: (id: string) => void;
  qty: number;
  hasItems: boolean;
  subtotal: number;
  fee: number;
  total: number;
  goPay: () => void;
  back: () => void;
  confirm: () => void;
  confirmPending: boolean;
  canOpen: boolean;
  addonsLeft: number;
  /** Seconds left on the addon-payment countdown, ticking while `step === 'pay'`. */
  payLeft: number;
  /** True for a few seconds right after a successful confirm — drives the "Tambahan masuk ke antrian!" toast. */
  justAdded: boolean;
}

/**
 * Owns the "Tambah Pesanan" (D3) flow's data + state — shared by the mobile
 * bottom sheet and desktop modal, which render different shells around the
 * same `step`/`cart`/`confirm`. Mirrors `useQueueScreen`'s split: one hook,
 * two chromes. `payLeft`/`justAdded` are consumed by the mobile chrome only
 * (matches Antre/Antri.dc.html's pay countdown + post-confirm toast, absent
 * from the desktop reference's addon modal) — kept here rather than
 * duplicated locally so there's exactly one countdown timer, not two.
 */
export function useAddonFlow(order: Order | undefined): AddonFlowView {
  const { data: warung } = useWarung(order?.merchantId ?? '');
  const createAddon = useCreateAddon();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<'menu' | 'pay'>('menu');
  const [cart, setCart] = useState<Record<string, number>>({});
  const [payLeft, setPayLeft] = useState(PAY_COUNTDOWN_SECONDS);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (step !== 'pay' || !open) return;
    setPayLeft(PAY_COUNTDOWN_SECONDS);
    const id = setInterval(() => setPayLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [step, open]);

  useEffect(() => {
    if (!justAdded) return;
    const id = setTimeout(() => setJustAdded(false), TOAST_MS);
    return () => clearTimeout(id);
  }, [justAdded]);

  const menuItems = warung?.menu ?? [];
  const menu: AddonMenuRow[] = menuItems.map((item) => ({ item, qty: cart[item.id] ?? 0 }));
  const ids = Object.keys(cart).filter((id) => (cart[id] ?? 0) > 0);
  const qty = ids.reduce((a, id) => a + (cart[id] ?? 0), 0);
  const subtotal = ids.reduce((a, id) => {
    const item = menuItems.find((m) => m.id === id);
    return a + (item ? item.price * (cart[id] ?? 0) : 0);
  }, 0);
  const fee = PRICING.addonFee;

  const addonsLeft = order ? PRICING.maxAddonsPerOrder - order.addons.length : 0;
  const canOpen = order ? canAddOrder(order) : false;

  return {
    open,
    openFlow: () => {
      if (!canOpen) return;
      setCart({});
      setStep('menu');
      setOpen(true);
    },
    closeFlow: () => setOpen(false),
    step,
    menu,
    add: (id) => setCart((c) => ({ ...c, [id]: (c[id] ?? 0) + 1 })),
    dec: (id) =>
      setCart((c) => {
        const next = { ...c };
        const n = (next[id] ?? 0) - 1;
        if (n <= 0) delete next[id];
        else next[id] = n;
        return next;
      }),
    qty,
    hasItems: ids.length > 0,
    subtotal,
    fee,
    total: subtotal + fee,
    goPay: () => ids.length > 0 && setStep('pay'),
    back: () => setStep('menu'),
    confirm: () => {
      if (!order) return;
      createAddon.mutate(
        { orderId: order.id, items: cart },
        { onSuccess: () => { setOpen(false); setJustAdded(true); } },
      );
    },
    confirmPending: createAddon.isPending,
    canOpen,
    addonsLeft,
    payLeft,
    justAdded,
  };
}
