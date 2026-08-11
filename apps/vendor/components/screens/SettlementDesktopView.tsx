'use client';
import { usePayouts, useTxns, type Payout } from '@jajanhub/api';
import { Icon, Money, cn } from '@jajanhub/ui';
import { VendorTopBar } from '../VendorTopBar';
import { LoadingState, ErrorState } from '../StateViews';

/** Contract's `Payout.status` is the English enum ('processing'|'completed'); this maps it to the Indonesian badge text the design uses. */
const PAYOUT_STATUS_LABEL: Record<Payout['status'], string> = { processing: 'Diproses', completed: 'Cair' };

/** Desktop Pencairan — 2-col grid matching Antre/Antri Pedagang Desktop.dc.html. */
export function SettlementDesktopView() {
  const payouts = usePayouts();
  const txns = useTxns();

  return (
    <>
      <VendorTopBar title="Pencairan Dana" sub="Saldo, riwayat pencairan & transaksi" />
      <div className="p-[28px_34px_44px] animate-screen-in">
        {payouts.isLoading || txns.isLoading ? (
          <LoadingState />
        ) : payouts.isError || txns.isError || !payouts.data || !txns.data ? (
          <ErrorState
            onRetry={() => {
              payouts.refetch();
              txns.refetch();
            }}
          />
        ) : (
          <div className="grid grid-cols-[1fr_1.25fr] gap-[22px] items-start">
            <div className="flex flex-col gap-[18px]">
              <div className="bg-[linear-gradient(150deg,#2B1E12,#3A2A1C)] rounded-[22px] p-[26px] shadow-[0_14px_30px_rgba(35,24,15,.18)]">
                <div className="text-[#C9B8A6] text-[13.5px] font-semibold">Saldo siap dicairkan</div>
                <Money amount={2_180_000} display className="text-white text-[42px] tracking-[-1.5px] leading-none mt-2 block" />
                <div className="text-[13px] text-[#9A8A7C] mt-2.5">Rekening tujuan · BCA •••• 3391</div>
                <button
                  type="button"
                  className="mt-5 w-full bg-white text-ink font-extrabold text-[15.5px] py-[15px] rounded-2xl transition-transform active:scale-[.98]"
                >
                  Cairkan sekarang
                </button>
              </div>

              <div className="bg-white rounded-[22px] p-[22px] shadow-card">
                <div className="font-display font-extrabold text-[17px] mb-3.5">Riwayat pencairan</div>
                <div className="flex flex-col">
                  {payouts.data.map((p, i) => {
                    const settled = p.status === 'completed';
                    return (
                      <div key={p.id} className={cn('flex items-center gap-[13px] py-3.5', i < payouts.data.length - 1 && 'border-b border-[#F4ECE2]')}>
                        <span className={cn('flex-none w-10 h-10 rounded-xl flex items-center justify-center', settled ? 'bg-mint-soft' : 'bg-[#FFF0E0]')}>
                          <Icon name="download" size={19} className={settled ? 'text-mint-deep' : 'text-brand-deep'} strokeWidth={2} />
                        </span>
                        <div className="flex-1">
                          <div className="font-bold text-sm">{p.date}</div>
                          <div className="text-xs text-faint">{p.sub}</div>
                        </div>
                        <div className="text-right">
                          <Money amount={p.amountRp} display className="text-[15px] block" />
                          <span className={cn('text-xs font-bold', settled ? 'text-mint-deep' : 'text-[#B8791F]')}>{PAYOUT_STATUS_LABEL[p.status]}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[22px] p-[22px] shadow-card">
              <div className="flex items-center justify-between mb-2">
                <div className="font-display font-extrabold text-[17px]">Transaksi hari ini</div>
                <div className="text-[13px] text-faint font-semibold">42 pesanan</div>
              </div>
              <div className="flex flex-col">
                {txns.data.map((t) => (
                  <div key={t.no} className="flex items-center gap-[13px] py-3.5 border-b border-[#F4ECE2] last:border-0">
                    <div
                      className={cn(
                        'flex-none w-10 h-10 rounded-xl flex items-center justify-center font-display font-extrabold text-sm',
                        t.refund ? 'bg-[#FBEEE9] text-brand-press' : 'bg-[#FFF3E7] text-brand-deep',
                      )}
                    >
                      {t.no.split('-')[1]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm truncate">{t.items}</div>
                      <div className="text-xs text-faint font-semibold mt-0.5">{(t.refund ? 'Refund · ' : 'Selesai · ') + t.time}</div>
                    </div>
                    <span className={cn('font-extrabold text-[15px]', t.refund ? 'text-brand-press' : 'text-mint-deep')}>
                      {t.refund ? '−' : '+'}
                      <Money amount={t.amount} />
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
