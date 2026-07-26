'use client';
import { useRouter } from 'next/navigation';
import { useOrder, useRefundState, COPY, type RefundStage } from '@jajanhub/api';
import { Icon, Money, cn } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { useCartStore } from '../../lib/cart-store';

const STEPS = [
  { label: 'Pembatalan diterima', sub: 'Pesanan sudah dibatalkan' },
  { label: 'Dana diproses', sub: 'Refund dikirim ke metode pembayaranmu' },
  { label: 'Refund selesai', sub: `Estimasi ${COPY.refundEtaShort}` },
];

function stageIndex(stage: RefundStage): number {
  return stage === 'cancelled' ? 1 : stage === 'processing' ? 2 : 3;
}

/**
 * Desktop refund screen — matches Antre/Antri Desktop.dc.html's
 * `queueCancelled` state: horizontal 3-step timeline instead of mobile's
 * vertical `RefundSteps`. Same `useOrder`/`useRefundState` as
 * `RefundStatus.tsx` (mobile) — no separate data source.
 */
export function RefundStatusDesktopView({ orderId }: { orderId: string }) {
  const router = useRouter();
  const { data: order, isLoading, isError, refetch } = useOrder(orderId);
  const refund = useRefundState(orderId);
  const clearCart = useCartStore((s) => s.clear);

  if (isLoading) return <LoadingState label="Memuat status refund…" />;
  if (isError || !order) return <ErrorState onRetry={() => refetch()} />;

  const amount = refund?.amount ?? order.total;
  const stage = refund?.stage ?? 'cancelled';
  const idx = stageIndex(stage);

  const orderAgain = () => {
    clearCart();
    router.push(`/m/${order.merchantId}`);
  };

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-10 flex justify-center animate-screen-in">
      <div className="w-full max-w-[820px]">
        <div className="bg-white rounded-[26px] p-[34px] shadow-[0_6px_16px_rgba(35,24,15,.05)]">
          <div className="flex items-center gap-4">
            <span className="flex-none w-14 h-14 rounded-2xl bg-[#FBEEE9] flex items-center justify-center">
              <Icon name="trash" size={26} className="text-brand-press" />
            </span>
            <div className="flex-1">
              <div className="font-display font-extrabold text-2xl">Refund sedang diproses</div>
              <div className="text-sm text-faint mt-[3px]">
                Pesanan {order.code} · dibatalkan · <Money amount={amount} />
              </div>
            </div>
          </div>

          <div className="mt-[34px] flex items-start">
            {STEPS.map((s, i) => {
              const done = i < idx;
              const active = i === idx;
              const hasLine = i < STEPS.length - 1;
              return (
                <div key={s.label} className="flex-1 flex flex-col items-center text-center relative">
                  {hasLine && (
                    <div
                      className={cn('absolute top-[19px] left-1/2 w-full h-[3px] rounded', done ? 'bg-mint' : 'bg-[#EFE6DA]')}
                    />
                  )}
                  <div
                    className={cn(
                      'relative z-[1] w-[38px] h-[38px] rounded-full flex items-center justify-center',
                      done ? 'bg-mint text-white' : active ? 'bg-brand-press text-white' : 'bg-[#EFE6DA] text-[#C9B8A6]',
                    )}
                    style={active ? { boxShadow: '0 0 0 6px rgba(196,64,47,.14)' } : undefined}
                  >
                    {done ? (
                      <Icon name="check" size={18} strokeWidth={2.6} />
                    ) : active ? (
                      <span className="w-[18px] h-[18px] rounded-full border-2 border-white/50 border-t-white animate-spin" />
                    ) : (
                      <span className="w-[9px] h-[9px] rounded-full bg-current" />
                    )}
                  </div>
                  <div className={cn('font-extrabold text-[13.5px] mt-3 max-w-[150px]', done || active ? 'text-ink' : 'text-faint')}>
                    {s.label}
                  </div>
                  <div className="text-xs text-faint mt-[3px] max-w-[150px] leading-[1.4]">{s.sub}</div>
                </div>
              );
            })}
          </div>

          <div className="mt-7 bg-[#FBF6EF] rounded-2xl px-5 py-[18px] flex items-center gap-[13px]">
            <span className="flex-none text-brand-deep">
              <Icon name="info" size={22} />
            </span>
            <div className="flex-1 text-[13.5px] text-[#6B5D4F] leading-[1.5]">
              Dana <b>
                <Money amount={amount} />
              </b>{' '}
              dikembalikan ke metode pembayaran asal. Biasanya masuk dalam <b>{COPY.refundEtaShort}</b>.
            </div>
          </div>

          <button
            type="button"
            onClick={orderAgain}
            className="mt-[22px] w-full rounded-2xl py-4 font-extrabold text-base bg-ink text-white transition-transform active:scale-[.99]"
          >
            Pesan lagi
          </button>
        </div>
      </div>
    </div>
  );
}
