'use client';
import { useBreakpoint } from '@jajanhub/ui';
import { OrdersMobileView } from './OrdersMobileView';
import { OrdersDesktopView } from './OrdersDesktopView';

/** D0 breakpoint switch for /orders. */
export function OrdersScreen() {
  const bp = useBreakpoint();
  return bp === 'desktop' ? <OrdersDesktopView /> : <OrdersMobileView />;
}
