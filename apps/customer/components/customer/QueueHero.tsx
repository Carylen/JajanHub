'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrder, useQueueState, useCancelOrder, stageOf, type OrderStatus } from '@jajanhub/api';
import { Button, Card, Icon, Spinner, cn } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { QueueSteps } from './QueueSteps';
import { CancelSheet } from './CancelSheet';

const STATUS_TEXT: Record<number, string> = { 0: 'Pesanan Diterima', 1: 'Lagi Dimasak!', 2: 'Siap Diambil!' };
const STATUS_SUB: Record<number, string> = {
  0: 'Nunggu giliran masuk dapur',
  1: 'Sabar ya, enak nggak bakal lari',
  2: 'Buruan ke gerobak, mumpung hangat!',
};
const STATUS_STYLE: Record<number, string> = {
  0: 'bg-[#FFF0E0] text-[#B8791F]',
  1: 'bg-[#FFEDD9] text-brand-deep',
  2: 'bg-mint-soft text-mint-deep',
};

function tone(ahead: number) {
  if (ahead <= 6) return { label: 'Antrean lancar', bg: 'bg-mint-soft', color: 'text-mint-deep', dot: 'bg-mint' };
  if (ahead <= 13) return { label: 'Agak ramai', bg: 'bg-[#FFF0E0]', color: 'text-[#B8791F]', dot: 'bg-[#F5A623]' };
  return { label: 'Lagi padat', bg: 'bg-[#FFEBE9]', color: 'text-danger', dot: 'bg-[#F5566B]' };
}

export function QueueHero({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const queue = useQueueState(orderId);
  const cancelOrder = useCancelOrder();
  const [cancelOpen, setCancelOpen] = useState(false);

  const status: OrderStatus = queue?.status ?? order?.status ?? 'paid';
  const stage = stageOf(status);

  // Redirect back to payment if not paid yet; to refund flow if cancelled.
  useEffect(() => {
    if (status === 'awaiting_payment') router.replace(`/order/${orderId}/pay`);
    if (status === 'cancelled' || status === 'refunding' || status === 'refunded') {
      router.replace(`/order/${orderId}/refund`);
    }
  }, [status, orderId, router]);

  if (isLoading) return <LoadingState label="Memuat antrean…" />;
  if (isError || !order) return <ErrorState onRetry={() => refetch()} />;

  const ahead = queue?.peopleAhead ?? order.queueNumber;
  const eta = queue?.etaMin ?? 0;
  const t = tone(ahead);
  const isReady = stage === 2;
  const canCancel = stage === 0;
  const cannotCancel = stage === 1;

  const confirmCancel = () => {
    cancelOrder.mutate(orderId, {
      onSuccess: () => {
        setCancelOpen(false);
        router.push(`/order/${orderId}/refund`);
      },
    });
  };

  return (
    <div className="animate-screen-in min-h-screen bg-[linear-gradient(180deg,#FFF8F1,#FFF1E4)] pb-8">
      {/* Ready toast */}
      {isReady && (
        <div className="fixed left-1/2 -translate-x-1/2 top-3.5 w-[calc(100%-32px)] max-w-[388px] z-40 bg-[#0F1F17] rounded-[18px] px-[15px] py-[13px] flex items-center gap-3 shadow-[0_16px_34px_rgba(15,31,23,.34)] animate-toast-in">
          <div className="flex-none w-9 h-9 rounded-[11px] bg-mint flex items-center justify-center">
            <Icon name="bell" size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-sm">Pesananmu siap!</div>
            <div className="text-[#9DBFAF] text-xs">Ambil di gerobak, tunjukin nomor antrianmu ya</div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="px-5 pt-[18px] pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-[9px] h-[9px] rounded-full bg-mint animate-pulse" />
          <span className="text-[13px] text-muted font-semibold">Pesanan {order.code} · live</span>
        </div>
        <span className="text-xs text-faint">{order.merchantName.split(' ').slice(-1)}</span>
      </div>

      {/* Hero number */}
      <div className="text-center mt-5">
        <div className="text-[13px] text-faint font-semibold tracking-[.5px]">NOMOR ANTRIANMU</div>
        <div className="flex items-baseline justify-center gap-1 mt-0.5">
          <span className="font-display font-extrabold text-[34px] text-brand leading-none">{order.queueLetter}</span>
          <span
            key={order.queueNumber}
            className="font-display font-extrabold text-[128px] text-ink leading-[.9] tracking-[-4px] animate-qnum"
          >
            {order.queueNumber}
          </span>
        </div>
        <div className="mt-3.5">
          <span className={cn('inline-flex items-center gap-2 font-extrabold text-[15px] px-[18px] py-[9px] rounded-full', STATUS_STYLE[stage])}>
            {STATUS_TEXT[stage]}
          </span>
        </div>
        <div className="text-faint text-[13px] mt-2.5 leading-[1.4]">{STATUS_SUB[stage]}</div>
      </div>

      {/* Stats */}
      <div className="mx-5 mt-[22px] flex gap-3">
        <Card className="flex-1 p-[15px] text-center">
          <div key={ahead} className="font-display font-extrabold text-2xl text-ink animate-numflip">
            {ahead > 0 ? ahead : 0}
          </div>
          <div className="text-[11px] text-faint mt-0.5">di depanmu</div>
        </Card>
        <Card className="flex-1 p-[15px] text-center">
          <div key={eta} className="font-display font-extrabold text-2xl text-ink animate-numflip">
            {eta > 0 ? `±${eta}` : '≈'}
          </div>
          <div className="text-[11px] text-faint mt-0.5">{eta > 0 ? 'menit lagi' : 'sebentar lagi'}</div>
        </Card>
      </div>

      {/* Tone */}
      <div className="mx-5 mt-3 bg-white rounded-2xl px-[15px] py-3 flex items-center gap-[11px] shadow-card">
        <span className={cn('flex-none inline-flex items-center gap-1.5 font-bold text-xs px-[11px] py-1.5 rounded-full', t.bg, t.color)}>
          <span className={cn('w-[7px] h-[7px] rounded-full animate-pulse', t.dot)} />
          {t.label}
        </span>
        <span className="flex-1 text-xs text-faint leading-[1.35]">
          Estimasi dihitung dari kecepatan masak hari ini, bukan tebakan
        </span>
      </div>

      {/* Steps */}
      <Card className="mx-5 mt-4 px-5 pt-5 pb-1">
        <QueueSteps stage={stage} />
      </Card>

      {/* Actions */}
      <div className="px-5 pt-4">
        {isReady ? (
          <Button
            variant="mint"
            fullWidth
            className="animate-ringpulse"
            onClick={() => router.push(`/order/${orderId}/pickup`)}
          >
            <Icon name="grid" size={19} className="text-white" />
            Lihat Kode Pengambilan
          </Button>
        ) : (
          <div className="text-center text-faint text-[13px] flex items-center justify-center gap-[7px]">
            <Spinner className="w-4 h-4 border-2" />
            Kami kabari begitu siap, santai aja
          </div>
        )}

        <div className="mt-3.5">
          {canCancel && (
            <button
              type="button"
              onClick={() => setCancelOpen(true)}
              className="w-full bg-white border-[1.5px] border-[#F3C9C0] text-danger rounded-2xl py-3.5 font-bold text-sm transition-transform active:scale-[.98]"
            >
              Batalkan Pesanan
            </button>
          )}
          {cannotCancel && (
            <div className="bg-[#FAF4EC] border border-[#F1E7DC] rounded-2xl px-[15px] py-[13px] flex items-center gap-[11px]">
              <span className="flex-none w-[30px] h-[30px] rounded-[9px] bg-[#FFEDD9] flex items-center justify-center">
                <Icon name="clock" size={17} className="text-brand-deep" strokeWidth={2} />
              </span>
              <div className="text-xs text-faint leading-[1.4]">
                Pesanan udah mulai dimasak, jadi nggak bisa dibatalkan lagi ya
              </div>
            </div>
          )}
        </div>
      </div>

      <CancelSheet
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        refundAmount={order.total}
        onConfirm={confirmCancel}
        pending={cancelOrder.isPending}
      />
    </div>
  );
}
