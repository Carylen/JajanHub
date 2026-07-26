'use client';
import { useVendorSummary, useVendorOrders, useVendorMenu, type VendorOrder, type VendorMenuItem, type VendorSummary } from '@jajanhub/api';
import { useVendorUi } from '../../lib/ui-store';
import { useVendorTier, type VendorTierView } from './useVendorTier';

export interface HomeScreenView {
  summary: VendorSummary | undefined;
  isLoading: boolean;
  isError: boolean;
  refetch: () => void;
  activeOrders: VendorOrder[];
  habisCount: number;
  menu: VendorMenuItem[];
  warungOpen: boolean;
  toggleWarungOpen: () => void;
  openStock: () => void;
  tier: VendorTierView;
}

export function useHomeScreen(): HomeScreenView {
  const summary = useVendorSummary();
  const { data: orders = [] } = useVendorOrders();
  const { data: menu = [] } = useVendorMenu();
  const warungOpen = useVendorUi((s) => s.warungOpen);
  const toggleWarungOpen = useVendorUi((s) => s.toggleWarungOpen);
  const openStock = useVendorUi((s) => s.openStockSheet);
  const tier = useVendorTier();

  return {
    summary: summary.data,
    isLoading: summary.isLoading,
    isError: summary.isError,
    refetch: summary.refetch,
    activeOrders: orders.filter((o) => o.status !== 'ditolak'),
    habisCount: menu.filter((m) => !m.inStock).length,
    menu,
    warungOpen,
    toggleWarungOpen,
    openStock,
    tier,
  };
}
