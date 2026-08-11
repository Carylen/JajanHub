import Link from 'next/link';
import { formatQueueCode } from '@jajanhub/api';
import { Icon, Money, cn } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { VendorTopBar } from '../VendorTopBar';
import type { HomeScreenView } from './useHomeScreen';

/** Decorative 7-day revenue split (direct vs pre-order) — same "local mock
 * display data" pattern Analytics.tsx already uses for its hourly chart. */
const WEEK_CHART = [
  { day: 'Sen', total: 960_000, pre: 180_000 },
  { day: 'Sel', total: 1_035_000, pre: 220_000 },
  { day: 'Rab', total: 880_000, pre: 150_000 },
  { day: 'Kam', total: 1_120_000, pre: 310_000 },
  { day: 'Jum', total: 1_240_000, pre: 280_000, today: true },
  { day: 'Sab', total: 1_050_000, pre: 240_000 },
  { day: 'Min', total: 1_035_000, pre: 200_000 },
];

export function HomeDesktopView(vm: HomeScreenView) {
  if (vm.isLoading) {
    return (
      <>
        <VendorTopBar title="Beranda" sub="Ringkasan warungmu hari ini" />
        <div className="p-10"><LoadingState /></div>
      </>
    );
  }
  if (vm.isError || !vm.summary) {
    return (
      <>
        <VendorTopBar title="Beranda" sub="Ringkasan warungmu hari ini" />
        <div className="p-10"><ErrorState onRetry={vm.refetch} /></div>
      </>
    );
  }

  const s = vm.summary;
  const maxTotal = Math.max(...WEEK_CHART.map((c) => c.total));
  const weekTotal = WEEK_CHART.reduce((a, c) => a + c.total, 0);

  return (
    <>
      <VendorTopBar title="Beranda" sub={`${s.dateLabel} · Ringkasan warungmu hari ini`} />
      <div className="p-[28px_34px_44px] flex flex-col gap-[22px] animate-screen-in">
        {/* KPI row */}
        <div className="grid grid-cols-4 gap-[18px]">
          <Link
            href="/settlement"
            className="text-left bg-[linear-gradient(150deg,#2B1E12,#3A2A1C)] rounded-[22px] p-[22px] shadow-[0_14px_30px_rgba(35,24,15,.18)] relative overflow-hidden transition-transform active:scale-[.99]"
          >
            <div className="text-[#C9B8A6] text-[13px] font-semibold">Pendapatan hari ini</div>
            <Money amount={s.revenueToday} display className="text-white text-[34px] tracking-[-1px] leading-none mt-2 block" />
            <div className="inline-flex items-center gap-1.5 mt-3 bg-[rgba(22,199,132,.18)] text-[#4FE0A8] font-bold text-xs px-2.5 py-1.5 rounded-full">
              <Icon name="arrow-up" size={13} className="text-[#4FE0A8]" strokeWidth={2.4} />
              {s.revenueDeltaPct}% dari kemarin
            </div>
          </Link>

          <KpiCard label="Pesanan hari ini" value={String(s.ordersToday)} hint="pesanan masuk" icon="list" tone="light" />
          <KpiCard label="Pesanan aktif" value={String(vm.activeOrders.length)} hint="sedang diproses sekarang" icon="clock" tone="brand" />
          <KpiCard label="Rata waktu layan" value={s.avgServeLabel} hint="menit per pesanan" icon="clock" tone="mint" />
        </div>

        {/* Chart + active orders */}
        <div className="grid grid-cols-[1.55fr_1fr] gap-[18px] items-start">
          <div className="bg-white rounded-[22px] p-6 shadow-card">
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="font-display font-extrabold text-lg">Pendapatan 7 hari</div>
                <div className="text-[13px] text-faint mt-0.5">
                  Total minggu ini <b className="text-ink"><Money amount={weekTotal} /></b>
                </div>
              </div>
              <div className="flex gap-4 items-center text-xs text-faint font-semibold">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-brand inline-block" />
                  Langsung
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-[3px] bg-prio inline-block" />
                  Pre-order
                </span>
              </div>
            </div>
            <div className="flex items-end justify-between gap-3.5 h-[210px] pt-2.5">
              {WEEK_CHART.map((c) => (
                <div key={c.day} className="flex-1 flex flex-col items-center gap-2.5 h-full justify-end">
                  <div className={cn('text-xs font-extrabold', c.today ? 'text-brand-deep' : 'text-[#B0A192]')}>
                    Rp{Math.round(c.total / 1000)}k
                  </div>
                  <div
                    className="w-full max-w-[38px] flex flex-col justify-end rounded-lg overflow-hidden origin-bottom animate-[barGrow_.5s_ease_both]"
                    style={{ height: `${Math.round((c.total / maxTotal) * 100)}%` }}
                  >
                    <div style={{ height: `${Math.round((c.pre / c.total) * 100)}%`, background: '#7A3BF5' }} />
                    <div className="flex-1" style={{ background: c.today ? '#FF7A1A' : '#FFC48F' }} />
                  </div>
                  <div className={cn('text-xs font-bold', c.today ? 'text-ink' : 'text-faint')}>{c.day}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[22px] p-[22px] shadow-card flex flex-col">
            <div className="flex items-center justify-between mb-3.5">
              <div className="font-display font-extrabold text-lg">Pesanan aktif</div>
              <Link href="/orders" className="text-brand font-bold text-[13px]">
                Buka papan ›
              </Link>
            </div>
            <div className="flex flex-col gap-2.5 flex-1">
              {vm.activeOrders.length === 0 ? (
                <div className="text-center text-faint text-sm py-8">Belum ada pesanan aktif.</div>
              ) : (
                vm.activeOrders.slice(0, 4).map((o) => {
                  const first = o.lines[0];
                  const more = o.lines.length > 1 ? ` +${o.lines.length - 1} lagi` : '';
                  return (
                    <div key={o.id} className="bg-[#FBF6EF] rounded-[15px] px-3.5 py-3 flex items-center gap-3">
                      <div
                        className="flex-none w-[42px] h-[42px] rounded-xl flex items-center justify-center text-white font-display font-extrabold text-sm"
                        style={{ background: o.isPriority ? 'linear-gradient(135deg,#A879FF,#7A3BF5)' : 'linear-gradient(135deg,#FFB870,#FF7A1A)' }}
                      >
                        {formatQueueCode(o).replace(/^[A-Za-z]+/, '')}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate">{first ? `${first.qty}× ${first.name}${more}` : '—'}</div>
                      </div>
                      {o.isPriority && (
                        <span className="flex-none bg-prio text-white text-[9px] font-extrabold px-2 py-1 rounded-full">PRIORITAS</span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {vm.habisCount > 0 && (
          <Link
            href="/menu"
            className="w-full bg-[#FFF1E9] border border-[rgba(196,64,47,.18)] rounded-2xl px-[18px] py-4 flex items-center gap-[13px] transition-transform active:scale-[.995]"
          >
            <span className="flex-none w-[38px] h-[38px] rounded-xl bg-[#FDE0DA] flex items-center justify-center">
              <Icon name="warning" size={20} className="text-brand-press" strokeWidth={2} />
            </span>
            <span className="flex-1 font-bold text-[14.5px] text-brand-press">
              {vm.habisCount} menu sedang habis — pelanggan tidak bisa memesannya
            </span>
            <span className="text-[13px] font-bold text-brand-press">Kelola menu ›</span>
          </Link>
        )}
      </div>
    </>
  );
}

function KpiCard({
  label,
  value,
  hint,
  icon,
  tone,
}: {
  label: string;
  value: string;
  hint: string;
  icon: 'list' | 'clock';
  tone: 'light' | 'brand' | 'mint';
}) {
  const wrap = tone === 'brand' ? 'bg-[#FFF3E7] border border-brand/[.16]' : 'bg-white';
  const labelColor = tone === 'brand' ? 'text-[#B8791F]' : 'text-faint';
  const valueColor = tone === 'brand' ? 'text-brand-deep' : 'text-ink';
  const iconBg = tone === 'brand' ? 'bg-white' : tone === 'mint' ? 'bg-mint-soft' : 'bg-[#FFF3E7]';
  const iconColor = tone === 'mint' ? 'text-mint-deep' : 'text-brand-deep';

  return (
    <div className={cn('rounded-[22px] p-5 shadow-card', wrap)}>
      <div className="flex items-center justify-between">
        <div className={cn('text-[13px] font-semibold', labelColor)}>{label}</div>
        <span className={cn('flex-none w-[34px] h-[34px] rounded-[11px] flex items-center justify-center', iconBg)}>
          <Icon name={icon} size={18} className={iconColor} />
        </span>
      </div>
      <div className={cn('font-display font-extrabold text-[34px] leading-none mt-3', valueColor)}>{value}</div>
      <div className="text-xs text-faint mt-1.5">{hint}</div>
    </div>
  );
}
