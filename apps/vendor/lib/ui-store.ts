import { create } from 'zustand';

interface VendorUiState {
  /** Stock sheet is reachable from both Beranda and Papan Pesanan. */
  stockSheetOpen: boolean;
  openStockSheet: () => void;
  closeStockSheet: () => void;
  /** Warung open/closed toggle — shown on Beranda (mobile) AND the desktop
   * Sidebar (Antre/Antri Pedagang Desktop.dc.html); lifted here so both
   * stay in sync instead of each keeping its own local copy. */
  warungOpen: boolean;
  toggleWarungOpen: () => void;
  /** Verify-pickup-code overlay: reachable from Orders (mobile) and the
   * desktop VendorTopBar (present on every screen), so it's global too. */
  verifyOpen: boolean;
  openVerify: () => void;
  closeVerify: () => void;
}

export const useVendorUi = create<VendorUiState>((set) => ({
  stockSheetOpen: false,
  openStockSheet: () => set({ stockSheetOpen: true }),
  closeStockSheet: () => set({ stockSheetOpen: false }),
  warungOpen: true,
  toggleWarungOpen: () => set((s) => ({ warungOpen: !s.warungOpen })),
  verifyOpen: false,
  openVerify: () => set({ verifyOpen: true }),
  closeVerify: () => set({ verifyOpen: false }),
}));
