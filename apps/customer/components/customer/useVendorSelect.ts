'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Stall } from '@jajanhub/api';
import { cartCount, useCartStore } from '../../lib/cart-store';

/**
 * Shared by Discovery/DiscoveryDesktopView: picking a vendor while another
 * vendor's cart is non-empty must prompt a confirmation instead of silently
 * wiping it (that wipe still happens, just later — in `useMerchantScreen`'s
 * `ensureVendor`, once the route actually changes after `confirm()`).
 */
export function useVendorSelect(stalls: Stall[]) {
  const router = useRouter();
  const vendorId = useCartStore((s) => s.vendorId);
  const items = useCartStore((s) => s.items);
  const [pending, setPending] = useState<Stall | null>(null);

  const activeVendorName = stalls.find((s) => s.id === vendorId)?.name ?? vendorId ?? '';

  const select = (stall: Stall) => {
    if (!stall.open) return;
    if (vendorId && vendorId !== stall.id && cartCount(items) > 0) {
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
