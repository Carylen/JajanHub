import type { ReactNode } from 'react';
import { BottomNav } from '../../components/BottomNav';
import { StockSheet } from '../../components/StockSheet';

/** Shared shell for the 5 bottom-nav tabs (BRIEF §4). */
export default function ShellLayout({ children }: { children: ReactNode }) {
  return (
    <div className="pb-24 min-h-screen">
      {children}
      <BottomNav />
      {/* Stock sheet is reachable from Beranda and Papan Pesanan. */}
      <StockSheet />
    </div>
  );
}
