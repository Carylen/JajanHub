'use client';
import { useVendorSummary, getVendorTierProgress, type VendorTierProgress } from '@jajanhub/api';

export interface VendorTierView {
  progress: VendorTierProgress | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * Read-only tier progress, shared by every screen that displays it (Beranda
 * card, Level Pedagang detail, Settlement banner, Analytics lock) — one
 * `useVendorSummary()` query + one call to the pure `getVendorTierProgress`,
 * not recomputed per screen. Mutating the tier (demo preview/reset) lives in
 * `useTierLevelUpFlow`, used only by the Level Pedagang page.
 */
export function useVendorTier(): VendorTierView {
  const { data: summary, isLoading, isError, refetch } = useVendorSummary();
  return {
    progress: summary ? getVendorTierProgress(summary) : undefined,
    isLoading,
    isError,
    refetch,
  };
}
