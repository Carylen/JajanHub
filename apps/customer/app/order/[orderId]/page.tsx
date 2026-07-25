'use client';
import { useBreakpoint } from '@jajanhub/ui';
import { useQueueScreen } from '../../../components/customer/useQueueScreen';
import { QueueMobileView } from '../../../components/customer/QueueMobileView';
import { QueueDesktopView } from '../../../components/customer/QueueDesktopView';

export default function OrderPage({ params }: { params: { orderId: string } }) {
  const vm = useQueueScreen(params.orderId);
  const bp = useBreakpoint();
  return bp === 'desktop' ? <QueueDesktopView {...vm} /> : <QueueMobileView {...vm} />;
}
