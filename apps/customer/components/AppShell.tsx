import type { ReactNode } from 'react';
import { CustomerSidebar } from './CustomerSidebar';

/**
 * Adaptive chrome, replacing the old hardcoded `max-w-app` wrapper in
 * app/layout.tsx. Pure CSS (`md:`/`lg:` classes) — no JS breakpoint check
 * needed here, since Sidebar visibility and column width don't require a
 * different component tree, only different classes (see useBreakpoint.ts
 * doc for when the JS hook IS warranted: real MobileView/DesktopView swaps).
 *
 * The content wrapper below carries `[transform:translateZ(0)]` — a no-op
 * visually, but per the CSS spec any `transform` on an element makes it the
 * containing block for `position: fixed` descendants. That's what keeps
 * every existing `fixed left-1/2 -translate-x-1/2 max-w-*` overlay
 * (BottomSheet, BottomNav-equivalents, toasts) and the new `Modal` primitive
 * centered under the content column instead of the full browser window once
 * the desktop sidebar below is showing. Applied unconditionally (all
 * breakpoints) so overlay components need exactly one positioning contract,
 * not a breakpoint-conditional one.
 *
 * Desktop content is uncapped (`lg:flex-1`, no max-width) — matching
 * `Antre/Antri Desktop.dc.html`'s `<main style="flex:1">`, which fills all
 * remaining space next to the sidebar; individual desktop views (e.g. the
 * Queue screen's `max-w-[920px]` centered grid) constrain their own width
 * where the reference does, rather than AppShell imposing one globally.
 * Routes without a desktop view yet keep the D0 fallback (mobile view,
 * still capped at `max-w-app`/`max-w-tablet`, which remains correct since
 * that fallback IS the mobile view, just centered in more room).
 */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="lg:flex">
      <CustomerSidebar />
      <div
        className="mx-auto max-w-app md:max-w-tablet lg:mx-0 lg:max-w-none lg:min-w-0 lg:flex-1 min-h-screen bg-cream lg:bg-[#F1E7DC] relative overflow-x-hidden shadow-[0_0_70px_rgba(0,0,0,.1)] lg:shadow-none [transform:translateZ(0)]"
      >
        {children}
      </div>
    </div>
  );
}
