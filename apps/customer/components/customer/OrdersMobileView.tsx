'use client';
import { useRouter } from 'next/navigation';
import { Button, Icon, cn } from '@jajanhub/ui';
import { EmptyState, ErrorState, LoadingState } from '../StateViews';
import { FOOD_GRADIENTS } from '../../lib/visuals';
import { orderStatusMeta } from '../../lib/orderStatus';
import { useActiveOrdersScreen } from './useActiveOrdersScreen';

/** Mobile "Pesanan Aktif" — matches Antre/Antri.dc.html's `isActive` screen. */
export function OrdersMobileView() {
  const router = useRouter();
  const { isLoggedIn, orders, isLoading, isError, refetch } = useActiveOrdersScreen();

  if (!isLoggedIn) return <LoadingState />;
  if (isLoading) return <LoadingState label="Memuat pesanan…" />;
  if (isError || !orders) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="animate-screen-in pb-8">
      <div className="px-5 pt-4 pb-1.5">
        <div className="font-display font-extrabold text-2xl">Pesanan Aktif</div>
        <div className="text-faint text-[13px] mt-0.5">{orders.length} pesanan lagi berjalan</div>
      </div>

      {orders.length === 0 ? (
        <>
          <EmptyState title="Belum ada pesanan berjalan">Yuk pesan dari gerobak sekitar!</EmptyState>
          <div className="px-5">
            <Button variant="primary" fullWidth onClick={() => router.push('/')}>
              Cari Gerobak
            </Button>
          </div>
        </>
      ) : (
        <div className="px-5 pt-1.5 flex flex-col gap-3">
          {orders.map((o, i) => {
            const meta = orderStatusMeta(o.status);
            return (
              <button
                key={o.id}
                type="button"
                onClick={() => router.push(`/order/${o.id}`)}
                className="w-full text-left bg-white rounded-[22px] p-3.5 flex gap-3.5 items-center shadow-card transition-transform active:scale-[.99]"
              >
                <div
                  className="flex-none w-[58px] h-[58px] rounded-2xl flex flex-col items-center justify-center text-white"
                  style={{ background: FOOD_GRADIENTS[i % FOOD_GRADIENTS.length] }}
                >
                  <span className="font-display font-extrabold text-xl leading-none">{o.queueNumber}</span>
                  <span className="text-[9px] font-bold opacity-90">antre</span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[15px] leading-[1.2] truncate">{o.vendorName}</div>
                  <div className="text-faint text-xs mt-0.5 mb-2 truncate">{o.lines.map((l) => l.name).join(', ')}</div>
                  <span className={cn('inline-flex items-center gap-1.5 font-bold text-xs px-2.5 py-1 rounded-full', meta.bg, meta.color)}>
                    <span className={cn('w-1.5 h-1.5 rounded-full', meta.dot)} />
                    {meta.label}
                  </span>
                </div>
                <Icon name="chevron-right" size={18} className="text-[#C6B7A8]" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
