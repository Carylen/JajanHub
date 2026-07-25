'use client';
import { useEffect, useState } from 'react';
import { BREAKPOINTS } from './breakpoints';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

function resolve(): Breakpoint {
  if (typeof window === 'undefined') return 'mobile';
  if (window.matchMedia(`(min-width: ${BREAKPOINTS.desktop}px)`).matches) return 'desktop';
  if (window.matchMedia(`(min-width: ${BREAKPOINTS.tablet}px)`).matches) return 'tablet';
  return 'mobile';
}

/**
 * Reports the current adaptive-layout tier. SSR-safe: guesses `'mobile'` on
 * the server and first client render, then corrects on mount — so it must
 * only gate genuine component-tree swaps (`XxxMobileView` vs
 * `XxxDesktopView`), never pure CSS chrome (use `md:`/`lg:` classes for
 * that, which have no hydration-mismatch risk).
 */
export function useBreakpoint(): Breakpoint {
  const [bp, setBp] = useState<Breakpoint>('mobile');

  useEffect(() => {
    const desktopQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.desktop}px)`);
    const tabletQuery = window.matchMedia(`(min-width: ${BREAKPOINTS.tablet}px)`);
    const update = () => setBp(resolve());
    update();
    desktopQuery.addEventListener('change', update);
    tabletQuery.addEventListener('change', update);
    return () => {
      desktopQuery.removeEventListener('change', update);
      tabletQuery.removeEventListener('change', update);
    };
  }, []);

  return bp;
}
