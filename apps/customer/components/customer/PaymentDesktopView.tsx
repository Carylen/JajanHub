import { useQueueScreen } from './useQueueScreen';
import { QueueDesktopView } from './QueueDesktopView';
import { PayModal } from './PayModal';
import type { PaymentScreenView } from './usePaymentScreen';

/**
 * Desktop Pay is a modal over the Queue screen (Antre/Antri Desktop.dc.html:
 * `payOpen`), not a full page like mobile. Both `usePaymentScreen` (this
 * view's data) and `useQueueScreen` (the background) independently call
 * `useOrder(orderId)` — TanStack Query dedupes that to one cache entry, so
 * this isn't a double-fetch, just two views sharing one query.
 */
export function PaymentDesktopView({ orderId, ...vm }: PaymentScreenView & { orderId: string }) {
  const queueVm = useQueueScreen(orderId);
  return (
    <>
      <QueueDesktopView {...queueVm} />
      <PayModal {...vm} />
    </>
  );
}
