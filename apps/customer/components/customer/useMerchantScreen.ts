'use client';
import { useEffect } from 'react';
import { useWarung, type Warung } from '@jajanhub/api';
import { useCartStore } from '../../lib/cart-store';

export interface MerchantScreenView {
  warung: Warung | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * Shared data for the merchant experience. Mobile's splash→landing→menu
 * navigation is NOT here — it's pure UI state with no data/business-logic
 * behind it, specific to how the mobile view onboards into a merchant, and
 * doesn't exist at all on desktop (which goes straight to the merged
 * catalog+cart screen) — so it lives in `MerchantMobileView` instead.
 */
export function useMerchantScreen(merchantId: string): MerchantScreenView {
  const { data: warung, isLoading, isError, refetch } = useWarung(merchantId);
  const ensureMerchant = useCartStore((s) => s.ensureMerchant);

  useEffect(() => {
    ensureMerchant(merchantId);
  }, [merchantId, ensureMerchant]);

  return { warung, isLoading, isError, refetch };
}
