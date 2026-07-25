'use client';
import { useState } from 'react';
import { usePreorders, SLOT_ORDER, type Preorder } from '@jajanhub/api';
import { Icon, cn } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { OrderCard } from '../OrderCard';
import { RejectSheet } from '../RejectSheet';
import { VerifyCodeSheet } from '../VerifyCodeSheet';
import { useVendorUi } from '../../lib/ui-store';
import type { OrdersScreenView } from './useOrdersScreen';

type Tab = 'now' | 'later';

export function OrdersMobileView(vm: OrdersScreenView) {
  const { data: preorders = [] } = usePreorders();
  const verifyOpen = useVendorUi((s) => s.verifyOpen);
  const openVerify = useVendorUi((s) => s.openVerify);
  const closeVerify = useVendorUi((s) => s.closeVerify);
  const openStock = useVendorUi((s) => s.openStockSheet);

  const [tab, setTab] = useState<Tab>('now');
  const [quota, setQuota] = useState<Record<string, number>>(() =>
    Object.fromEntries(SLOT_ORDER.map((s) => [s, 6])),
  );

  if (vm.isLoading) return <LoadingState label="Memuat pesanan…" />;
  if (vm.isError || !vm.orders) return <ErrorState onRetry={vm.refetch} />;

  const slotGroups = SLOT_ORDER.filter((sl) => preorders.some((p) => p.slot === sl)).map((sl) => {
    const list = preorders.filter((p) => p.slot === sl);
    const porsi = list.reduce((a, p) => a + p.lines.reduce((x, l) => x + l.qty, 0), 0);
    const q = quota[sl] ?? 6;
    return { slot: sl, list, porsi, quota: q, full: list.length >= q };
  });

  return (
    <div className="animate-screen-in pb-20">
      {/* Sticky header + tabs */}
      <div className="sticky top-0 z-[15] bg-cream/[.94] backdrop-blur-[10px] px-[22px] pt-[22px] pb-3">
        <div className="font-display font-extrabold text-2xl tracking-[-.5px]">Pesanan Masuk</div>
        <div className="text-[13px] text-faint flex items-center gap-1.5 mt-0.5">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
          Live · {vm.activeCount} pesanan aktif
        </div>
        <div className="flex gap-1.5 bg-[#F1E7DC] rounded-[15px] p-[5px] mt-3.5">
          <button
            type="button"
            onClick={() => setTab('now')}
            className={cn('flex-1 rounded-[11px] py-3 font-extrabold text-[15px] transition-all active:scale-[.97]', tab === 'now' ? 'bg-white text-brand-deep shadow-[0_3px_8px_rgba(35,24,15,.08)]' : 'text-faint')}
          >
            Sekarang
          </button>
          <button
            type="button"
            onClick={() => setTab('later')}
            className={cn('flex-1 rounded-[11px] py-3 font-extrabold text-[15px] flex items-center justify-center gap-1.5 transition-all active:scale-[.97]', tab === 'later' ? 'bg-white text-brand-deep shadow-[0_3px_8px_rgba(35,24,15,.08)]' : 'text-faint')}
          >
            Nanti
            <span className={cn('text-xs font-extrabold min-w-[22px] h-[22px] px-1.5 rounded-full flex items-center justify-center', tab === 'later' ? 'bg-brand text-white' : 'bg-[#E0D4C4] text-faint')}>
              {preorders.length}
            </span>
          </button>
        </div>
      </div>

      {tab === 'now' ? (
        <div className="px-5 pt-1.5 flex flex-col gap-3.5">
          {vm.sorted.length === 0 ? (
            <div className="text-center py-16 text-faint">
              <div className="font-display font-extrabold text-[19px] text-ink">Semua pesanan beres!</div>
              <div className="text-sm mt-1.5">Belum ada antrian baru. Santai dulu ☕</div>
            </div>
          ) : (
            vm.sorted.map((o) => (
              <OrderCard key={o.id} order={o} onAdvance={() => vm.advance(o.id)} onReject={() => vm.openReject(o.id)} />
            ))
          )}
        </div>
      ) : (
        <div className="px-5 pt-1.5 flex flex-col gap-3.5">
          <div className="bg-[linear-gradient(135deg,#FFF3E7,#FFE7D2)] border border-brand/20 rounded-[18px] px-4 py-[15px] flex items-center gap-3 shadow-[0_6px_16px_rgba(255,122,26,.08)]">
            <div className="flex-none w-11 h-11 rounded-[14px] bg-white flex items-center justify-center shadow-[0_4px_10px_rgba(255,122,26,.14)]">
              <Icon name="clock" size={22} className="text-brand-deep" strokeWidth={2} />
            </div>
            <div className="flex-1">
              <div className="font-extrabold text-[15px]">15 menit lagi</div>
              <div className="text-[13px] text-[#B8791F] mt-0.5">
                {slotGroups[0] ? `Siapkan ${slotGroups.find((g) => g.slot === '12.00')?.porsi ?? slotGroups[0].porsi} porsi untuk slot ${slotGroups.find((g) => g.slot === '12.00')?.slot ?? slotGroups[0].slot}` : 'Belum ada pesanan terjadwal'}
              </div>
            </div>
          </div>

          {slotGroups.map((g) => (
            <SlotGroupCard
              key={g.slot}
              slot={g.slot}
              list={g.list}
              porsi={g.porsi}
              quota={g.quota}
              full={g.full}
              onInc={() => setQuota((q) => ({ ...q, [g.slot]: Math.min(20, (q[g.slot] ?? 6) + 1) }))}
              onDec={() => setQuota((q) => ({ ...q, [g.slot]: Math.max(1, (q[g.slot] ?? 6) - 1) }))}
            />
          ))}
        </div>
      )}

      {/* Fixed action bar */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-[104px] w-full max-w-[480px] px-5 z-40 flex gap-2.5">
        <button
          type="button"
          onClick={openVerify}
          className="flex-1 bg-mint text-white rounded-[18px] py-[17px] font-extrabold text-base flex items-center justify-center gap-2.5 shadow-[0_12px_28px_rgba(22,199,132,.4)] transition-transform active:scale-[.97]"
        >
          <Icon name="grid" size={21} className="text-white" />
          Verifikasi Kode
        </button>
        <button
          type="button"
          aria-label="Kelola stok"
          onClick={openStock}
          className="flex-none w-[62px] bg-white text-brand-deep rounded-[18px] flex flex-col items-center justify-center gap-0.5 shadow-[0_12px_28px_rgba(35,24,15,.14)] transition-transform active:scale-95"
        >
          <Icon name="box" size={24} className="text-brand-deep" />
          <span className="text-[10px] font-extrabold">Stok</span>
        </button>
      </div>

      <VerifyCodeSheet open={verifyOpen} onClose={closeVerify} />
      <RejectSheet
        open={vm.rejectId !== null}
        orderNo={vm.rejectingOrder?.no ?? ''}
        onClose={vm.closeReject}
        pending={vm.rejectPending}
        onConfirm={vm.confirmReject}
      />
    </div>
  );
}

function SlotGroupCard({
  slot,
  list,
  porsi,
  quota,
  full,
  onInc,
  onDec,
}: {
  slot: string;
  list: Preorder[];
  porsi: number;
  quota: number;
  full: boolean;
  onInc: () => void;
  onDec: () => void;
}) {
  return (
    <div className={cn('bg-white rounded-[24px] p-[18px] shadow-[0_6px_18px_rgba(35,24,15,.06)] border', full ? 'border-2 border-[#F3C9C0]' : 'border-[#F1E7DC]')}>
      <div className="flex items-center gap-3.5">
        <div className={cn('flex-none w-[60px] h-[60px] rounded-[17px] flex flex-col items-center justify-center', full ? 'bg-[#FDE0DA] text-brand-press' : 'bg-[#FFF3E7] text-brand-deep')}>
          <span className="font-display font-extrabold text-[19px] leading-none">{slot}</span>
          <span className="text-[9px] font-bold opacity-80 mt-0.5">SLOT</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-base">{list.length} pesanan</div>
          <div className="text-[13px] text-faint mt-0.5">{porsi} porsi disiapkan</div>
        </div>
        {full && <span className="flex-none bg-[#FDE0DA] text-brand-press text-[11px] font-extrabold px-[11px] py-[5px] rounded-full">PENUH</span>}
      </div>

      <div className="mt-3.5 bg-[#FAF4EC] rounded-[16px] px-3.5 py-3 flex items-center justify-between">
        <div>
          <div className="text-[13px] font-bold text-muted">Kuota per slot</div>
          <div className="text-[11px] text-faint mt-px">Maks pesanan yang diterima</div>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" aria-label="Kurangi kuota" onClick={onDec} className="w-10 h-10 rounded-[13px] bg-white text-brand-deep shadow-[0_3px_8px_rgba(35,24,15,.08)] flex items-center justify-center transition-transform active:scale-90">
            <Icon name="minus" size={20} strokeWidth={2.6} />
          </button>
          <span key={quota} className="font-display font-extrabold text-2xl min-w-[26px] text-center animate-pop">{quota}</span>
          <button type="button" aria-label="Tambah kuota" onClick={onInc} className="w-10 h-10 rounded-[13px] bg-brand text-white shadow-[0_4px_10px_rgba(255,122,26,.35)] flex items-center justify-center transition-transform active:scale-90">
            <Icon name="plus" size={20} strokeWidth={2.6} />
          </button>
        </div>
      </div>

      <div className="mt-3.5 flex flex-col gap-[9px]">
        {list.map((p) => {
          const porsiP = p.lines.reduce((a, l) => a + l.qty, 0);
          const first = p.lines[0];
          const more = p.lines.length > 1 ? ` +${p.lines.length - 1}` : '';
          return (
            <div key={p.no} className={cn('flex items-center gap-[11px] px-3 py-2.5 rounded-[14px]', p.priority ? 'bg-[#FBF8FF]' : 'bg-[#FAF4EC]')}>
              <div
                className="flex-none w-10 h-10 rounded-xl flex items-center justify-center text-white font-display font-extrabold text-[13px]"
                style={{ background: p.priority ? 'linear-gradient(135deg,#A879FF,#7A3BF5)' : 'linear-gradient(135deg,#FFB870,#FF7A1A)' }}
              >
                {p.no.split('-')[1]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold text-sm truncate">{p.customer}</span>
                  {p.priority && <span className="flex-none bg-prio text-white text-[9px] font-extrabold px-[7px] py-0.5 rounded-full">PRIO</span>}
                </div>
                <div className="text-xs text-faint mt-0.5 truncate">{first ? `${first.qty}× ${first.name}${more}` : ''}</div>
              </div>
              <span className="flex-none font-display font-extrabold text-base text-brand-deep">{porsiP} porsi</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
