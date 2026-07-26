'use client';
import type { Stall } from '@jajanhub/api';
import { useBreakpoint } from '@jajanhub/ui';
import { Discovery } from './Discovery';
import { DiscoveryDesktopView } from './DiscoveryDesktopView';

/** D0 breakpoint switch for /near — stalls are server-fetched (SEO) and passed down. */
export function DiscoveryScreen({ stalls }: { stalls: Stall[] }) {
  const bp = useBreakpoint();
  return bp === 'desktop' ? <DiscoveryDesktopView stalls={stalls} /> : <Discovery stalls={stalls} />;
}
