'use client';
import { useBreakpoint } from '@jajanhub/ui';
import { RefundStatus } from '../../../../components/customer/RefundStatus';
import { RefundStatusDesktopView } from '../../../../components/customer/RefundStatusDesktopView';

export default function RefundPage({ params }: { params: { orderId: string } }) {
  const bp = useBreakpoint();
  return bp === 'desktop' ? (
    <RefundStatusDesktopView orderId={params.orderId} />
  ) : (
    <RefundStatus orderId={params.orderId} />
  );
}
