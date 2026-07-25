import type { ReactNode } from 'react';
import { BottomNav } from '../../components/BottomNav';
import { StockSheet } from '../../components/StockSheet';

/** Shared shell for the 5 bottom-nav tabs (BRIEF §4). */
export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    // pb-24 clears BottomNav; dropped at lg since BottomNav hides there (Sidebar takes over).
    <div className="pb-24 lg:pb-0 min-h-screen">
      {children}
      <BottomNav />
      {/* Stock sheet is reachable from Beranda and Papan Pesanan. */}
      <StockSheet />
    </div>
  );
}
