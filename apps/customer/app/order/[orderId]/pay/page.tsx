'use client';
import { useBreakpoint } from '@jajanhub/ui';
import { usePaymentScreen } from '../../../../components/customer/usePaymentScreen';
import { PaymentMobileView } from '../../../../components/customer/PaymentMobileView';
import { PaymentDesktopView } from '../../../../components/customer/PaymentDesktopView';

/** D0 proof-of-concept: one hook, breakpoint picks the view. */
export default function PayPage({ params }: { params: { orderId: string } }) {
  const vm = usePaymentScreen(params.orderId);
  const bp = useBreakpoint();
  return bp === 'desktop' ? (
    <PaymentDesktopView orderId={params.orderId} {...vm} />
  ) : (
    <PaymentMobileView {...vm} />
  );
}
