import type { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

/**
 * Adaptive chrome, replacing the old hardcoded `max-w-[480px]` wrapper in
 * app/layout.tsx. Pure CSS — see apps/customer/components/AppShell.tsx for
 * the full rationale (same pattern, mirrored here for vendor). Renders on
 * every route (including /settings and /settlement, which BottomNav never
 * covers) so Sidebar keeps them reachable on desktop per the brief.
 *
 * The content wrapper's `[transform:translateZ(0)]` makes it the containing
 * block for `position: fixed` descendants (BottomNav, BottomSheet, the
 * Orders action bar, Modal, …) so they center under the content column
 * instead of the full window once Sidebar is showing.
 *
 * Desktop content is uncapped (`lg:flex-1`), matching the reference's
 * `<main style="flex:1">` and its `#F1E7DC` background — see
 * apps/customer/components/AppShell.tsx for the same reasoning.
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="lg:flex">
      <Sidebar />
      <div
        className="mx-auto max-w-vendor md:max-w-tablet lg:mx-0 lg:max-w-none lg:min-w-0 lg:flex-1 min-h-screen bg-cream lg:bg-[#F1E7DC] relative overflow-x-hidden shadow-[0_0_70px_rgba(0,0,0,.1)] lg:shadow-none [transform:translateZ(0)]"
      >
        {children}
      </div>
    </div>
  );
}
