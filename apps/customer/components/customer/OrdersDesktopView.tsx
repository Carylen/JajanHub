'use client';
import { useRouter } from 'next/navigation';
import { Money } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { FOOD_GRADIENTS } from '../../lib/visuals';
import { orderStatusMeta } from '../../lib/orderStatus';
import { useActiveOrdersScreen } from './useActiveOrdersScreen';

/** Desktop "Pesanan Aktif" — matches Antre/Antri Desktop.dc.html's `isActive` screen. */
export function OrdersDesktopView() {
  const router = useRouter();
  const { isLoggedIn, orders, isLoading, isError, refetch } = useActiveOrdersScreen();

  if (!isLoggedIn) return <LoadingState />;
  if (isLoading) return <LoadingState label="Memuat pesanan…" />;
  if (isError || !orders) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-10 flex justify-center animate-screen-in">
      <div className="w-full max-w-[1000px]">
        <div className="font-display font-extrabold text-[30px] tracking-[-.6px]">Pesanan Aktif</div>
        <div className="text-[14px] text-faint mt-1">{orders.length} pesanan lagi berjalan di gerobak berbeda</div>

        {orders.length === 0 ? (
          <div className="mt-10 bg-white rounded-3xl p-[60px] shadow-[0_6px_16px_rgba(35,24,15,.05)] flex flex-col items-center gap-4 text-center">
            <div className="font-bold text-base text-faint max-w-[320px] leading-[1.5]">
              Belum ada pesanan berjalan. Pilih gerobak di Beranda buat mulai pesan.
            </div>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="cursor-pointer bg-brand text-white border-none rounded-[15px] px-[26px] py-[15px] font-extrabold text-[15px] shadow-raised transition-transform active:scale-[.98]"
            >
              Ke Beranda
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-5 mt-6">
            {orders.map((o, i) => {
              const meta = orderStatusMeta(o.status);
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => router.push(`/order/${o.id}`)}
                  className="text-left bg-white rounded-[22px] p-6 shadow-[0_6px_16px_rgba(35,24,15,.05)] flex flex-col gap-4 transition-transform active:scale-[.99] hover:shadow-[0_12px_28px_rgba(35,24,15,.1)]"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="flex-none w-14 h-14 rounded-2xl flex flex-col items-center justify-center text-white"
                      style={{ background: FOOD_GRADIENTS[i % FOOD_GRADIENTS.length] }}
                    >
                      <span className="font-display font-extrabold text-xl leading-none">{o.queueNumber}</span>
                      <span className="text-[9px] font-bold opacity-90">antre</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-extrabold text-[17px] leading-[1.2] truncate">{o.merchantName}</div>
                      <div className="text-[13px] text-faint mt-[3px] truncate">{o.lines.map((l) => l.name).join(', ')}</div>
                    </div>
                  </div>
                  <span
                    className={`inline-flex items-center gap-1.5 self-start font-extrabold text-[12.5px] px-3 py-1.5 rounded-full ${meta.bg} ${meta.color}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${meta.dot}`} />
                    {meta.label}
                  </span>
                  <div className="flex items-center justify-between border-t border-[#F4ECE2] pt-4">
                    <div>
                      <div className="text-xs text-faint">Total</div>
                      <Money amount={o.total} display className="text-lg" />
                    </div>
                    <span className="text-brand-deep font-extrabold text-sm">Lihat antrean →</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
