'use client';
import { useState } from 'react';
import { useAdvanceVendorTier, useResetVendorTier } from '@jajanhub/api';
import { useVendorTier, type VendorTierView } from './useVendorTier';

export interface TierLevelUpFlowView extends VendorTierView {
  previewLevelUp: () => void;
  previewPending: boolean;
  resetDemo: () => void;
  celebrateOpen: boolean;
  closeCelebrate: () => void;
}

/**
 * Owns the Level Pedagang page's demo actions on top of `useVendorTier`'s
 * read-only progress: "Pratinjau naik ke X" (advances the tier + opens the
 * celebration modal) and "Atur ulang demo". Kept separate from
 * `useVendorTier` so Beranda/Settlement/Analytics — which only ever read
 * progress — don't carry mutation state they never use.
 */
export function useTierLevelUpFlow(): TierLevelUpFlowView {
  const tier = useVendorTier();
  const advance = useAdvanceVendorTier();
  const reset = useResetVendorTier();
  const [celebrateOpen, setCelebrateOpen] = useState(false);

  return {
    ...tier,
    previewLevelUp: () => advance.mutate(undefined, { onSuccess: () => setCelebrateOpen(true) }),
    previewPending: advance.isPending,
    resetDemo: () => reset.mutate(),
    celebrateOpen,
    closeCelebrate: () => setCelebrateOpen(false),
  };
}
