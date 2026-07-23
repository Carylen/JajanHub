import { create } from 'zustand';

interface VendorUiState {
  /** Stock sheet is reachable from both Beranda and Papan Pesanan. */
  stockSheetOpen: boolean;
  openStockSheet: () => void;
  closeStockSheet: () => void;
}

export const useVendorUi = create<VendorUiState>((set) => ({
  stockSheetOpen: false,
  openStockSheet: () => set({ stockSheetOpen: true }),
  closeStockSheet: () => set({ stockSheetOpen: false }),
}));
