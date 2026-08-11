import { formatQueueCode } from '@jajanhub/api';
import { Money } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { VendorTopBar } from '../VendorTopBar';
import { KanbanOrderCard } from '../KanbanOrderCard';
import { RejectModal } from '../RejectModal';
import type { OrdersScreenView } from './useOrdersScreen';

const COLUMNS = [
  { key: 'waiting_confirmation' as const, title: 'Pesanan Baru', dot: '#FF7A1A', titleColor: '#E4560A', badgeBg: '#FFE4CC', badgeColor: '#E4560A', bg: '#FBEFE1' },
  { key: 'cooking' as const, title: 'Sedang Dimasak', dot: '#F5A623', titleColor: '#B8791F', badgeBg: '#FFEFD4', badgeColor: '#B8791F', bg: '#FBF3E4' },
  { key: 'ready' as const, title: 'Siap Diambil', dot: '#16C784', titleColor: '#0E9F6E', badgeBg: '#D7F2E5', badgeColor: '#0E9F6E', bg: '#EAF6EF' },
];

/**
 * Desktop Kanban board — matches Antre/Antri Pedagang Desktop.dc.html's
 * `isOrders` state. Actions call the same `vm.advance`/`vm.openReject` from
 * useOrdersScreen as the mobile list, not reimplemented. The reference has
 * no "Nanti" (preorder) tab at all here — that stays mobile-only for now
 * (see useOrdersScreen's doc comment).
 */
export function OrdersDesktopView(vm: OrdersScreenView) {
  if (vm.isLoading) {
    return (
      <>
        <VendorTopBar title="Papan Pesanan" sub="live" />
        <div className="p-10"><LoadingState label="Memuat pesanan…" /></div>
      </>
    );
  }
  if (vm.isError || !vm.orders) {
    return (
      <>
        <VendorTopBar title="Papan Pesanan" sub="live" />
        <div className="p-10"><ErrorState onRetry={vm.refetch} /></div>
      </>
    );
  }

  const rejectedList = vm.sorted.filter((o) => o.status === 'rejected');

  return (
    <>
      <VendorTopBar
        title="Papan Pesanan"
        sub={
          <>
            <span className="w-2 h-2 rounded-full bg-mint inline-block animate-pulse" />
            Live · {vm.activeCount} pesanan aktif
          </>
        }
      />
      <div className="p-[28px_34px_44px] animate-screen-in">
        <div className="grid grid-cols-3 gap-[18px] items-start">
          {COLUMNS.map((col) => {
            const items = vm.sorted.filter((o) => o.status === col.key);
            return (
              <div key={col.key} className="rounded-[20px] p-4 min-h-[200px]" style={{ background: col.bg }}>
                <div className="flex items-center gap-2.5 px-1.5 pb-3.5">
                  <span className="w-[11px] h-[11px] rounded-full flex-none" style={{ background: col.dot }} />
                  <div className="font-display font-extrabold text-base" style={{ color: col.titleColor }}>
                    {col.title}
                  </div>
                  <span
                    className="ml-auto min-w-6 h-6 px-[7px] rounded-full flex items-center justify-center text-[13px] font-extrabold"
                    style={{ background: col.badgeBg, color: col.badgeColor }}
                  >
                    {items.length}
                  </span>
                </div>
                <div className="flex flex-col gap-3">
                  {items.length === 0 ? (
                    <div className="text-center text-[#B0A192] text-[13px] font-semibold py-[26px]">Belum ada pesanan</div>
                  ) : (
                    items.map((o) => (
                      <KanbanOrderCard key={o.id} order={o} onAdvance={() => vm.advance(o.id)} onReject={() => vm.openReject(o.id)} />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {rejectedList.length > 0 && (
          <div className="mt-[22px] bg-white rounded-[20px] px-[22px] py-5 shadow-card">
            <div className="font-display font-extrabold text-base mb-3.5 text-faint">Ditolak hari ini</div>
            <div className="flex flex-col gap-2.5">
              {rejectedList.map((o) => (
                <div key={o.id} className="flex items-center gap-[13px] bg-[#F7F1E9] rounded-[14px] px-[15px] py-3.5">
                  <div className="flex-none w-10 h-10 rounded-xl bg-[#C6B7A8] flex flex-col items-center justify-center text-white leading-none">
                    <span className="text-[7px] font-extrabold">DITOLAK</span>
                    <span className="font-display font-extrabold text-sm">{formatQueueCode(o).replace(/^[A-Za-z]+/, '')}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm">{o.lines[0]?.name ?? '—'}</div>
                    <div className="text-xs text-brand-press font-semibold mt-0.5">{o.rejectReason ? `Alasan: ${o.rejectReason}` : ''}</div>
                  </div>
                  <Money amount={o.totalRp} display className="text-sm text-faint" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <RejectModal open={vm.rejectId !== null} onClose={vm.closeReject} onConfirm={vm.confirmReject} pending={vm.rejectPending} />
    </>
  );
}
