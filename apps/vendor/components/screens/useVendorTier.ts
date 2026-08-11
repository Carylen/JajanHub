'use client';
import { useVendorTier as useVendorTierStatus, getVendorTierProgress, type VendorTierProgress } from '@jajanhub/api';

export interface VendorTierView {
  progress: VendorTierProgress | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
}

/**
 * Read-only tier progress, shared by every screen that displays it (Beranda
 * card, Level Pedagang detail, Settlement banner, Analytics lock) — one
 * `GET /vendors/:id/tier` query (via the API package's `useVendorTier` hook,
 * aliased here to avoid a name clash with this file's own export) + one call
 * to the pure `getVendorTierProgress`, not recomputed per screen. Mutating
 * the tier (demo preview/reset) lives in `useTierLevelUpFlow`, used only by
 * the Level Pedagang page.
 */
export function useVendorTier(): VendorTierView {
  const { data: status, isLoading, isError, refetch } = useVendorTierStatus();
  return {
    progress: status ? getVendorTierProgress(status) : undefined,
    isLoading,
    isError,
    refetch,
  };
}
