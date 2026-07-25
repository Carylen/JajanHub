import { Modal, Money, QrCode, formatCountdown } from '@jajanhub/ui';
import type { PaymentScreenView } from './usePaymentScreen';

/** Desktop QRIS pay overlay — matches Antre/Antri Desktop.dc.html's pay modal. */
export function PayModal(vm: PaymentScreenView) {
  if (!vm.order) return null;
  const { order } = vm;

  return (
    <Modal open label="Bayar dengan QRIS" onClose={vm.goBack}>
      <div className="text-center">
        <div className="font-display font-extrabold text-[22px]">Bayar dengan QRIS</div>
        <div className="text-sm text-faint">Scan pakai aplikasi bank / e-wallet apa aja</div>
        <div className="w-[210px] h-[210px] bg-white rounded-[20px] mx-auto my-5 p-4 shadow-[0_8px_20px_rgba(35,24,15,.08)]">
          <QrCode branded seed={order.queueNumber * 7 + 3} />
        </div>
        <Money amount={order.total} display className="text-[30px]" />
        <div className="text-[13px] text-faint mt-0.5">{order.merchantName}</div>
        <div className="text-xs text-faint mt-2 tabular-nums">Bayar sebelum {formatCountdown(vm.payLeft)}</div>
        <button
          type="button"
          onClick={vm.markPaid}
          disabled={vm.markPaidPending}
          className="mt-[22px] w-full rounded-[15px] py-4 font-extrabold text-base bg-mint text-white shadow-[0_10px_22px_rgba(22,199,132,.3)] transition-transform active:scale-[.98] disabled:opacity-60"
        >
          {vm.markPaidPending ? 'Memproses…' : 'Saya sudah bayar'}
        </button>
        <button type="button" onClick={vm.goBack} className="mt-2.5 w-full text-faint font-bold text-sm py-1.5">
          Batal
        </button>
      </div>
    </Modal>
  );
}
