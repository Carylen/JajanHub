'use client';
import { useBreakpoint } from '@jajanhub/ui';
import { useOrdersScreen } from '../../../components/screens/useOrdersScreen';
import { OrdersMobileView } from '../../../components/screens/OrdersMobileView';
import { OrdersDesktopView } from '../../../components/screens/OrdersDesktopView';

export default function OrdersPage() {
  const vm = useOrdersScreen();
  const bp = useBreakpoint();
  return bp === 'desktop' ? <OrdersDesktopView {...vm} /> : <OrdersMobileView {...vm} />;
}
