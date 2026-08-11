import Link from 'next/link';
import { formatQueueCode } from '@jajanhub/api';
import { Card, Icon, Money, cn } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { TierCard } from '../TierCard';
import type { HomeScreenView } from './useHomeScreen';

const STATUS_LABEL: Record<string, { text: string; color: string }> = {
  waiting_confirmation: { text: 'Pesanan Baru', color: 'text-[#B8791F]' },
  cooking: { text: 'Sedang Dimasak', color: 'text-brand-deep' },
  ready: { text: 'Siap Diambil', color: 'text-mint-deep' },
  rejected: { text: 'Ditolak', color: 'text-brand-press' },
};

export function HomeMobileView(vm: HomeScreenView) {
  if (vm.isLoading) return <LoadingState />;
  if (vm.isError || !vm.summary) return <ErrorState onRetry={vm.refetch} />;

  const s = vm.summary;

  return (
    <div className="animate-screen-in">
      {/* Header */}
      <div className="px-[22px] pt-[22px] pb-1.5 flex items-center gap-[13px]">
        <Link
          href="/settings"
          aria-label="Pengaturan"
          className="flex-none w-[50px] h-[50px] rounded-2xl bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] flex items-center justify-center text-white font-display font-extrabold text-[19px] shadow-[0_6px_16px_rgba(255,122,26,.3)] transition-transform active:scale-90"
        >
          PB
        </Link>
        <Link href="/settings" className="flex-1 text-left">
          <div className="font-display font-extrabold text-[19px] leading-[1.1]">{s.merchantName}</div>
          <div className="text-[13px] text-faint">
            {s.greeting} · {s.dateLabel}
          </div>
        </Link>
        <div className="flex-none w-11 h-11 rounded-[14px] bg-white flex items-center justify-center shadow-[0_3px_10px_rgba(35,24,15,.06)]">
          <Icon name="bell" size={21} className="text-ink" />
        </div>
      </div>

      {/* Revenue card → settlement */}
      <div className="px-5 pt-3.5">
        <Link
          href="/settlement"
          className="block w-full text-left bg-[linear-gradient(150deg,#23180F,#3A2A1C)] rounded-[26px] p-6 shadow-[0_14px_34px_rgba(35,24,15,.2)] relative overflow-hidden transition-transform active:scale-[.99]"
        >
          <div className="flex items-center justify-between">
            <div className="text-[#C9B8A6] text-sm font-semibold">Pendapatan hari ini</div>
            <span className="inline-flex items-center gap-1 text-[#C9B8A6] text-xs font-bold">
              Pencairan <Icon name="chevron-right" size={15} className="text-[#C9B8A6]" />
            </span>
          </div>
          <Money amount={s.revenueToday} display className="text-white text-[46px] tracking-[-1.5px] leading-none mt-1.5 block" />
          <div className="inline-flex items-center gap-1.5 mt-3 bg-[rgba(22,199,132,.18)] text-[#4FE0A8] font-bold text-[13px] px-3 py-1.5 rounded-full">
            <Icon name="arrow-up" size={14} className="text-[#4FE0A8]" strokeWidth={2.4} />
            {s.revenueDeltaPct}% dari kemarin
          </div>
        </Link>
      </div>

      {/* Tier status */}
      {vm.tier.progress && (
        <div className="px-5 pt-3.5">
          <TierCard progress={vm.tier.progress} merchantName={s.merchantName} />
        </div>
      )}

      {/* Stats */}
      <div className="px-5 pt-3.5 flex gap-3">
        <Card className="flex-1 p-[18px]">
          <div className="text-[13px] text-faint font-semibold">Pesanan hari ini</div>
          <div className="font-display font-extrabold text-[38px] leading-none mt-1.5">{s.ordersToday}</div>
        </Card>
        <div className="flex-1 bg-[#FFF3E7] border border-brand/[.16] rounded-[22px] p-[18px] shadow-[0_5px_16px_rgba(255,122,26,.06)]">
          <div className="text-[13px] text-[#B8791F] font-semibold">Pesanan aktif</div>
          <div key={vm.activeOrders.length} className="font-display font-extrabold text-[38px] leading-none mt-1.5 text-brand-deep animate-pop">
            {vm.activeOrders.length}
          </div>
        </div>
      </div>

      {/* Avg serve */}
      <div className="px-5 pt-3.5">
        <Card className="p-[18px] flex items-center gap-4">
          <div className="flex-none w-14 h-14 rounded-[17px] bg-[#FFF3E7] flex items-center justify-center">
            <Icon name="clock" size={28} className="text-brand-deep" strokeWidth={2} />
          </div>
          <div className="flex-1">
            <div className="text-[13px] text-faint font-semibold">Rata-rata waktu layan hari ini</div>
            <div className="font-display font-extrabold text-[32px] leading-none mt-1">{s.avgServeLabel}</div>
            <div className="text-xs text-faint mt-[5px] leading-[1.35]">
              Angka ini yang dipakai buat hitung estimasi antrean pelanggan
            </div>
          </div>
        </Card>
      </div>

      {/* Warung open toggle */}
      <div className="px-5 pt-4">
        <button
          type="button"
          onClick={vm.toggleWarungOpen}
          aria-pressed={vm.warungOpen}
          className={cn(
            'w-full rounded-[22px] p-[22px] flex items-center gap-4 transition-transform active:scale-[.98]',
            vm.warungOpen ? 'bg-[linear-gradient(135deg,#E7FBF2,#D2F7E7)] shadow-[0_10px_24px_rgba(22,199,132,.16)]' : 'bg-white shadow-card',
          )}
        >
          <div className={cn('flex-none w-[52px] h-[52px] rounded-2xl flex items-center justify-center', vm.warungOpen ? 'bg-mint' : 'bg-[#F1E7DC]')}>
            <Icon name="store" size={26} className={vm.warungOpen ? 'text-white' : 'text-[#B8A99B]'} />
          </div>
          <div className="flex-1 text-left">
            <div className={cn('font-display font-extrabold text-xl', vm.warungOpen ? 'text-[#0E7A56]' : 'text-faint')}>
              {vm.warungOpen ? 'Warung Buka' : 'Warung Tutup'}
            </div>
            <div className={cn('text-[13px]', vm.warungOpen ? 'text-[#3FA980]' : 'text-[#B8A99B]')}>
              {vm.warungOpen ? 'Pelanggan bisa pesan sekarang' : 'Ketuk untuk mulai terima pesanan'}
            </div>
          </div>
          <span className={cn('flex-none w-14 h-8 rounded-full relative', vm.warungOpen ? 'bg-mint' : 'bg-[#DDD2C4]')}>
            <span
              className="absolute top-[3px] w-[26px] h-[26px] rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,.25)] transition-[left]"
              style={{ left: vm.warungOpen ? '27px' : '3px' }}
            />
          </span>
        </button>
      </div>

      {/* Habis banner */}
      {vm.habisCount > 0 && (
        <div className="px-5 pt-3">
          <button
            type="button"
            onClick={vm.openStock}
            className="w-full bg-[#FFF1E9] border border-[rgba(196,64,47,.18)] rounded-2xl px-[15px] py-[13px] flex items-center gap-[11px] transition-transform active:scale-[.99]"
          >
            <span className="flex-none w-[34px] h-[34px] rounded-[11px] bg-[#FDE0DA] flex items-center justify-center">
              <Icon name="warning" size={18} className="text-brand-press" strokeWidth={2} />
            </span>
            <span className="flex-1 text-left font-bold text-sm text-brand-press">{vm.habisCount} menu sedang habis</span>
            <span className="text-xs font-bold text-brand-press">Kelola ›</span>
          </button>
        </div>
      )}

      {/* Active orders preview */}
      <div className="px-5 pt-5">
        <div className="flex items-center justify-between mb-3">
          <div className="font-display font-extrabold text-[17px]">Pesanan aktif</div>
          <Link href="/orders" className="text-brand font-bold text-[13px]">
            Lihat semua ›
          </Link>
        </div>
        <div className="flex flex-col gap-2.5">
          {vm.activeOrders.slice(0, 3).map((o) => {
            const label = STATUS_LABEL[o.status]!;
            const first = o.lines[0];
            const more = o.lines.length > 1 ? ` +${o.lines.length - 1} lagi` : '';
            return (
              <div
                key={o.id}
                className={cn(
                  'bg-white rounded-[18px] px-4 py-3.5 flex items-center gap-[13px] shadow-[0_4px_14px_rgba(35,24,15,.05)] border',
                  o.isPriority ? 'border-2 border-[#C9B0FF]' : 'border-[#F1E7DC]',
                )}
              >
                <div
                  className="flex-none w-[46px] h-[46px] rounded-[13px] flex items-center justify-center text-white font-display font-extrabold text-[15px]"
                  style={{ background: o.isPriority ? 'linear-gradient(135deg,#A879FF,#7A3BF5)' : 'linear-gradient(135deg,#FFB870,#FF7A1A)' }}
                >
                  {formatQueueCode(o).replace(/^[A-Za-z]+/, '')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm leading-[1.2] truncate">
                    {first ? `${first.qty}× ${first.name}${more}` : '—'}
                  </div>
                  <div className={cn('text-xs font-semibold mt-0.5', label.color)}>{label.text}</div>
                </div>
                {o.isPriority && (
                  <span className="flex-none bg-prio text-white text-[10px] font-extrabold px-[9px] py-1 rounded-full">PRIORITAS</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
