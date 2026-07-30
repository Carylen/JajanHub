'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Stall } from '@jajanhub/api';
import { cartCount, useCartStore } from '../../lib/cart-store';

/**
 * Shared by Discovery/DiscoveryDesktopView: picking a vendor while another
 * vendor's cart is non-empty must prompt a confirmation instead of silently
 * wiping it (that wipe still happens, just later — in `useMerchantScreen`'s
 * `ensureMerchant`, once the route actually changes after `confirm()`).
 */
export function useVendorSelect(stalls: Stall[]) {
  const router = useRouter();
  const merchantId = useCartStore((s) => s.merchantId);
  const items = useCartStore((s) => s.items);
  const [pending, setPending] = useState<Stall | null>(null);

  const activeVendorName = stalls.find((s) => s.id === merchantId)?.name ?? merchantId ?? '';

  const select = (stall: Stall) => {
    if (!stall.open) return;
    if (merchantId && merchantId !== stall.id && cartCount(items) > 0) {
      setPending(stall);
      return;
    }
    router.push(`/m/${stall.id}`);
  };
  const confirm = () => {
    if (pending) router.push(`/m/${pending.id}`);
    setPending(null);
  };
  const cancel = () => setPending(null);

  return { pending, activeVendorName, select, confirm, cancel };
}
