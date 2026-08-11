import { Money, QrCode, Spinner, Icon, formatCountdown } from '@jajanhub/ui';
import { ScreenHeader } from '../ScreenHeader';
import { LoadingState, ErrorState } from '../StateViews';
import type { PaymentScreenView } from './usePaymentScreen';

/** Pure presentation — all data/effects live in usePaymentScreen(). */
export function PaymentMobileView(vm: PaymentScreenView) {
  if (vm.isLoading) return <LoadingState label="Membuka pembayaran…" />;
  if (vm.isError || !vm.order) return <ErrorState onRetry={vm.refetch} />;

  const { order } = vm;

  return (
    <div className="animate-screen-in min-h-screen pb-8">
      <ScreenHeader title="Pembayaran" onBack={vm.goBack} />

      <div className="text-center px-5 pt-3.5">
        <div className="text-faint text-[13px]">Total tagihan</div>
        <Money amount={order.totalRp} display className="text-[34px] text-ink tracking-[-.5px]" />
      </div>

      {/* QR card */}
      <div className="mt-4 mx-auto w-[264px] bg-white rounded-[26px] p-5 shadow-[0_16px_40px_rgba(35,24,15,.12)]">
        <div className="flex items-center justify-between mb-3.5">
          <span className="font-display font-extrabold text-[15px] text-[#0A2E6E] tracking-[.5px]">QRIS</span>
          <span className="text-[9px] font-bold text-faint border border-sand rounded-[5px] px-1.5 py-0.5">GPN</span>
        </div>
        <div className="mx-auto w-[224px]">
          <QrCode branded seed={order.queueNumber * 7 + 3} />
        </div>
        <div className="text-center mt-3.5 text-xs text-faint leading-[1.4]">
          {order.vendorName}
          <br />
          NMID : ID10243398201
        </div>
      </div>

      {/* Countdown */}
      <div className="flex items-center justify-center gap-2 mt-[18px]">
        <span className="text-[13px] text-faint">Bayar sebelum</span>
        <span className="inline-flex items-center gap-1.5 bg-[#FFEBE9] text-[#FF3D57] font-extrabold text-sm px-3 py-1.5 rounded-full tabular-nums">
          <Icon name="clock" size={14} strokeWidth={2} className="text-[#FF3D57]" />
          {formatCountdown(vm.payLeft)}
        </span>
      </div>

      {/* Waiting indicator */}
      <div className="mx-5 mt-5 bg-white rounded-[18px] px-4 py-[15px] flex items-center gap-[13px] shadow-card">
        <Spinner className="flex-none w-[22px] h-[22px] border-[2.5px]" />
        <div className="flex-1">
          <div className="font-bold text-sm">
            Menunggu pembayaran
            <span className="animate-dots">.</span>
            <span className="animate-dots [animation-delay:.2s]">.</span>
            <span className="animate-dots [animation-delay:.4s]">.</span>
          </div>
          <div className="text-faint text-xs mt-px">Otomatis lanjut begitu pembayaran masuk</div>
        </div>
      </div>

      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={vm.markPaid}
          disabled={vm.markPaidPending}
          className="w-full border-[1.5px] border-sand text-muted rounded-2xl py-3.5 font-bold text-sm transition-transform active:scale-[.98] disabled:opacity-60"
        >
          {vm.markPaidPending ? 'Memproses…' : 'Simulasikan: sudah bayar'}
        </button>
      </div>
      <div className="text-center text-[#B8A99B] text-[11px] mt-3.5">
        Scan pakai GoPay, OVO, DANA, m-banking, apa aja
      </div>
    </div>
  );
}
