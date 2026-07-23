'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder, useQueueState, useMarkPaid } from '@jajanhub/api';
import { Money, QrCode, Spinner, Icon, formatCountdown } from '@jajanhub/ui';
import { ScreenHeader } from '../ScreenHeader';
import { LoadingState, ErrorState } from '../StateViews';

export function Payment({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const queue = useQueueState(orderId);
  const markPaid = useMarkPaid();

  // Once payment is registered, move to the live queue.
  useEffect(() => {
    if (order && order.status !== 'awaiting_payment') {
      router.replace(`/order/${orderId}`);
    }
  }, [order, orderId, router]);

  if (isLoading) return <LoadingState label="Membuka pembayaran…" />;
  if (isError || !order) return <ErrorState onRetry={() => refetch()} />;

  const payLeft = queue?.payLeft ?? 299;

  return (
    <div className="animate-screen-in min-h-screen pb-8">
      <ScreenHeader title="Pembayaran" onBack={() => router.back()} />

      <div className="text-center px-5 pt-3.5">
        <div className="text-faint text-[13px]">Total tagihan</div>
        <Money amount={order.total} display className="text-[34px] text-ink tracking-[-.5px]" />
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
          {order.merchantName}
          <br />
          NMID : ID10243398201
        </div>
      </div>

      {/* Countdown */}
      <div className="flex items-center justify-center gap-2 mt-[18px]">
        <span className="text-[13px] text-faint">Bayar sebelum</span>
        <span className="inline-flex items-center gap-1.5 bg-[#FFEBE9] text-[#FF3D57] font-extrabold text-sm px-3 py-1.5 rounded-full tabular-nums">
          <Icon name="clock" size={14} strokeWidth={2} className="text-[#FF3D57]" />
          {formatCountdown(payLeft)}
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
          onClick={() => markPaid.mutate(orderId)}
          disabled={markPaid.isPending}
          className="w-full border-[1.5px] border-sand text-muted rounded-2xl py-3.5 font-bold text-sm transition-transform active:scale-[.98] disabled:opacity-60"
        >
          {markPaid.isPending ? 'Memproses…' : 'Simulasikan: sudah bayar'}
        </button>
      </div>
      <div className="text-center text-[#B8A99B] text-[11px] mt-3.5">
        Scan pakai GoPay, OVO, DANA, m-banking, apa aja
      </div>
    </div>
  );
}
