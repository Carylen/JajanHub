'use client';
import { useOrder } from '@jajanhub/api';
import { Button, Card, Icon, QrCode } from '@jajanhub/ui';
import { ScreenHeader } from '../ScreenHeader';
import { BrandMark } from '../BrandMark';
import { LoadingState, ErrorState } from '../StateViews';
import { RatingSheet } from './RatingSheet';
import { usePickupFlow } from './usePickupFlow';

export function Pickup({ orderId }: { orderId: string }) {
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const pf = usePickupFlow(order);

  if (isLoading) return <LoadingState label="Menyiapkan kode…" />;
  if (isError || !order) return <ErrorState onRetry={() => refetch()} />;

  const done = order.status === 'picked_up';
  const digits = (order.pickupCode || '0000').split('');

  if (done) {
    return (
      <div className="min-h-screen bg-[linear-gradient(180deg,#FFF8F1,#FFF1E4)] flex flex-col items-center justify-center px-6 py-8 text-center">
        <div className="relative w-[120px] h-[120px] flex items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-mint/[.16] animate-ripple" />
          <div className="w-24 h-24 rounded-[32px] bg-[linear-gradient(135deg,#34E0A8,#16C784)] flex items-center justify-center shadow-[0_16px_34px_rgba(22,199,132,.4)] animate-popin">
            <Icon name="check" size={52} className="text-white" strokeWidth={2.6} />
          </div>
        </div>
        <h1 className="font-display font-extrabold text-[28px] mt-6 mb-2 tracking-[-.5px]">Selamat menikmati!</h1>
        <p className="text-faint text-[15px] leading-[1.5] max-w-[280px]">
          Pesananmu udah diambil. Makasih udah antre bareng JajanHub 🧡
        </p>
        <div className="mt-[22px] bg-white rounded-[18px] px-[22px] py-3.5 shadow-card flex items-center gap-5">
          <div className="text-center">
            <div className="font-display font-extrabold text-[22px] text-brand">+15</div>
            <div className="text-[11px] text-faint">poin</div>
          </div>
          <div className="w-px h-[30px] bg-[#F1E7DC]" />
          <div className="text-center">
            <div className="font-display font-extrabold text-[22px] text-ink">9</div>
            <div className="text-[11px] text-faint">menit tunggu</div>
          </div>
        </div>
        <Button variant="primary" className="w-full max-w-[320px] mt-[30px]" onClick={pf.openRating}>
          Beri Rating
        </Button>
        <Button variant="ghost" className="text-faint pt-3.5" onClick={pf.finish}>
          Kembali ke beranda
        </Button>

        <RatingSheet
          open={pf.ratingOpen}
          onClose={pf.finish}
          merchantName={order.merchantName}
          orderCode={order.code}
          onSubmit={pf.finish}
        />
      </div>
    );
  }

  return (
    <div className="animate-screen-in min-h-screen bg-[linear-gradient(180deg,#FFF8F1,#FFF1E4)] pb-[130px]">
      <ScreenHeader title="Kode Pengambilan" backHref={`/order/${orderId}`} />

      <div className="text-center mt-3.5">
        <span className="inline-flex items-center gap-2 bg-mint-soft text-mint-deep font-extrabold text-sm px-4 py-2 rounded-full">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
          Pesanan Siap Diambil
        </span>
      </div>

      {/* Code card */}
      <div className="mx-5 mt-5 bg-white rounded-[28px] px-[22px] py-[26px] shadow-[0_18px_44px_rgba(35,24,15,.13)] text-center">
        <div className="text-[13px] text-faint font-bold tracking-[1px]">TUNJUKKAN KODE INI</div>
        <div className="flex justify-center gap-2.5 mt-4">
          {digits.map((d, i) => (
            <div
              key={i}
              className="w-16 h-[84px] rounded-[18px] bg-[linear-gradient(160deg,#FFF3E7,#FFE7D2)] flex items-center justify-center shadow-[inset_0_-6px_14px_rgba(255,122,26,.1),0_5px_14px_rgba(255,122,26,.08)]"
            >
              <span className="font-display font-extrabold text-[52px] text-brand-deep leading-none">{d}</span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mx-2 mt-[22px] text-[#C6B7A8]">
          <span className="flex-1 h-px bg-[#F1E7DC]" />
          <span className="text-xs font-bold text-[#B8A99B]">atau scan QR</span>
          <span className="flex-1 h-px bg-[#F1E7DC]" />
        </div>
        <div className="flex justify-center mt-4">
          <div className="w-[110px] h-[110px] overflow-hidden rounded-[14px] border border-[#F1E7DC] p-1.5 bg-white">
            <div className="origin-top-left scale-[.437]">
              <QrCode seed={order.queueNumber * 11 + 5} />
            </div>
          </div>
        </div>
      </div>

      {/* Order summary */}
      <Card className="mx-5 mt-4 px-[18px] py-4">
        <div className="flex items-center gap-[11px] pb-3 border-b border-[#F4ECE2]">
          <div className="flex-none w-10 h-10 rounded-xl bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] flex items-center justify-center">
            <BrandMark size={20} />
          </div>
          <div className="flex-1">
            <div className="font-bold text-sm">{order.merchantName}</div>
            <div className="text-xs text-faint">Pesanan {order.code}</div>
          </div>
        </div>
        <div className="pt-3 flex flex-col gap-2">
          {order.lines.map((l) => (
            <div key={l.itemId} className="flex items-center gap-2.5 text-sm">
              <span className="flex-none min-w-[28px] h-[26px] px-[7px] rounded-lg bg-[#FFF3E7] text-brand-deep font-extrabold text-[13px] flex items-center justify-center">
                {l.qty}×
              </span>
              <span className="font-semibold">{l.name}</span>
            </div>
          ))}
        </div>
      </Card>

      <div className="fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-app px-5 pt-4 pb-[22px] bg-[linear-gradient(to_top,#FFF1E4_72%,transparent)] z-20">
        <Button variant="mint" fullWidth disabled={pf.confirmPending} onClick={() => pf.confirm()}>
          <Icon name="check" size={19} className="text-white" strokeWidth={2.6} />
          {pf.confirmPending ? 'Menyimpan…' : 'Konfirmasi Sudah Diambil'}
        </Button>
      </div>
    </div>
  );
}
