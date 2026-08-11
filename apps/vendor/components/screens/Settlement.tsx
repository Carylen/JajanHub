'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { usePayouts, useTxns, COPY, type Payout } from '@jajanhub/api';
import { IconButton, Icon, Money, cn } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { useVendorTier } from './useVendorTier';

/** Contract's `Payout.status` is the English enum ('processing'|'completed'); this maps it to the Indonesian badge text the design uses. */
const PAYOUT_STATUS_LABEL: Record<Payout['status'], string> = { processing: 'Diproses', completed: 'Cair' };

export function Settlement() {
  const router = useRouter();
  const payouts = usePayouts();
  const txns = useTxns();
  const { progress: tierProgress } = useVendorTier();

  if (payouts.isLoading || txns.isLoading) return <LoadingState />;
  if (payouts.isError || txns.isError || !payouts.data || !txns.data) {
    return <ErrorState onRetry={() => { payouts.refetch(); txns.refetch(); }} />;
  }

  return (
    <div className="animate-screen-in pb-8">
      {/* Dark header */}
      <div className="relative bg-[linear-gradient(150deg,#23180F,#3A2A1C)] px-[22px] pt-5 pb-[60px] overflow-hidden">
        <div className="relative flex items-center gap-3">
          <IconButton aria-label="Kembali" tone="translucent" onClick={() => router.back()}>
            <Icon name="chevron-left" size={19} strokeWidth={2.2} />
          </IconButton>
          <div className="text-white font-display font-extrabold text-xl">Pencairan Dana</div>
        </div>
      </div>

      {/* Balance card */}
      <div className="mx-5 -mt-[42px] relative">
        <div className="bg-white rounded-[24px] p-[22px] shadow-soft">
          <div className="text-sm text-faint font-semibold">Saldo belum dicairkan</div>
          <Money amount={420_000} display className="text-[46px] tracking-[-1.5px] leading-none mt-1 block" />
          <div className="flex items-center gap-2.5 mt-3.5 bg-mint-soft rounded-[14px] px-3.5 py-3">
            <span className="flex-none w-[34px] h-[34px] rounded-[10px] bg-mint flex items-center justify-center">
              <Icon name="clock" size={18} className="text-white" strokeWidth={2} />
            </span>
            <div className="flex-1">
              <div className="font-extrabold text-sm text-[#0E7A56]">{COPY.payoutEta}</div>
              <div className="text-xs text-[#3FA980] mt-px">Otomatis ke BCA •••• 3391</div>
            </div>
          </div>
          <button
            type="button"
            className="mt-4 w-full bg-mint text-white rounded-[16px] py-4 font-extrabold text-base flex items-center justify-center gap-2 shadow-[0_12px_26px_rgba(22,199,132,.3)] transition-transform active:scale-[.98]"
          >
            <Icon name="download" size={19} className="text-white" strokeWidth={2.2} />
            Cairkan Sekarang
          </button>
        </div>
      </div>

      {/* Tier indicator */}
      {tierProgress && (
        <div className="px-5 pt-4">
          <Link
            href="/level"
            className="w-full flex items-center gap-3 rounded-2xl px-[15px] py-3.5 transition-transform active:scale-[.99]"
            style={{ background: tierProgress.current.soft, border: `1px solid ${tierProgress.current.accent}33` }}
          >
            <span
              className="flex-none w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ background: tierProgress.current.gradient }}
            >
              <Icon name="medal" size={19} />
            </span>
            <div className="flex-1">
              <div className="font-bold text-[13.5px] leading-[1.35]">
                Sebagai {tierProgress.current.name}, dana kamu cair {tierProgress.current.payoutFrequencyLabel}
              </div>
              <div className="text-[11.5px] text-faint mt-0.5">Naik tier buat pencairan lebih cepat</div>
            </div>
            <Icon name="chevron-right" size={16} style={{ color: tierProgress.current.accent }} />
          </Link>
        </div>
      )}

      {/* Today breakdown */}
      <Section title="RINCIAN HARI INI">
        <div className="bg-white rounded-[22px] p-[18px] shadow-card">
          <Row label="Total pesanan" value="42 pesanan" />
          <Row label="Penjualan kotor" value={<Money amount={1_240_000} className="font-bold text-ink" />} />
          <Row
            label={<>Biaya admin QRIS <span className="text-[11px] text-faint">0,7%</span></>}
            value={<span className="font-bold text-brand-press">−<Money amount={8680} /></span>}
          />
          <div className="h-px bg-[#F4ECE2] my-2.5" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-[15px]">Yang kamu terima</span>
            <Money amount={1_231_320} display className="text-[22px] text-mint-deep" />
          </div>
        </div>
      </Section>

      {/* Payout history */}
      <Section title="RIWAYAT PENCAIRAN">
        <div className="bg-white rounded-[22px] px-1.5 py-1 shadow-card">
          {payouts.data.map((p, i) => {
            const settled = p.status === 'completed';
            return (
              <div key={p.id} className={cn('flex items-center gap-[13px] px-3 py-3.5', i < payouts.data.length - 1 && 'border-b border-[#F4ECE2]')}>
                <span className={cn('flex-none w-10 h-10 rounded-xl flex items-center justify-center', settled ? 'bg-mint-soft' : 'bg-[#FFF0E0]')}>
                  <Icon name="download" size={19} className={settled ? 'text-mint-deep' : 'text-brand-deep'} strokeWidth={2} />
                </span>
                <div className="flex-1">
                  <div className="font-bold text-sm">{p.date}</div>
                  <div className="text-xs text-faint mt-px">{p.sub}</div>
                </div>
                <div className="text-right">
                  <Money amount={p.amountRp} display className="text-base block" />
                  <span className={cn('text-[11px] font-bold mt-0.5 inline-block', settled ? 'text-mint-deep' : 'text-[#B8791F]')}>{PAYOUT_STATUS_LABEL[p.status]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      {/* Per-order transactions */}
      <Section title="TRANSAKSI PER PESANAN">
        <div className="bg-white rounded-[22px] px-1.5 py-1 shadow-card">
          {txns.data.map((t, i) => (
            <div key={t.no} className={cn('flex items-center gap-[13px] px-3 py-[13px]', i < txns.data.length - 1 && 'border-b border-[#F4ECE2]')}>
              <span className={cn('flex-none w-11 h-11 rounded-[13px] flex items-center justify-center font-display font-extrabold text-[13px]', t.refund ? 'bg-[#FBEEE9] text-brand-press' : 'bg-[#FFF3E7] text-brand-deep')}>
                {t.no.split('-')[1]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{t.items}</div>
                <div className="text-xs text-faint mt-px">{(t.refund ? 'Refund · ' : 'Selesai · ') + t.time}</div>
              </div>
              <span className={cn('flex-none font-display font-extrabold text-[15px]', t.refund ? 'text-brand-press' : 'text-mint-deep')}>
                {t.refund ? '−' : '+'}
                <Money amount={t.amount} />
              </span>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 justify-center mt-3.5 text-faint text-xs">
          <span className="w-2.5 h-2.5 rounded-[3px] bg-[#FBEEE9] border border-[rgba(196,64,47,.3)]" />
          Baris merah = pesanan yang di-refund
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 pt-[18px]">
      <div className="text-xs font-bold text-faint tracking-[.4px] px-1 pb-2.5">{title}</div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-center text-sm text-muted py-1.5">
      <span className="flex items-center gap-1.5">{label}</span>
      <span>{value}</span>
    </div>
  );
}
