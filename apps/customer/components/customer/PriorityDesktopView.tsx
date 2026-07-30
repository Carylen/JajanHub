'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlans, useBenefits } from '@jajanhub/api';
import { Icon, Money, cn } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { usePageAuthGuard } from './auth/usePageAuthGuard';

/**
 * Desktop "Langganan Prioritas" screen — matches Antre/Antri Desktop.dc.html's
 * `isPriority` state: centered 2-col plan-card grid instead of mobile's
 * stacked hero+radio-list. Same `usePlans()`/`useBenefits()` queries as
 * `Subscription.tsx` (mobile) — no separate data source, only the layout
 * differs, per D0.
 */
export function PriorityDesktopView() {
  const router = useRouter();
  const isLoggedIn = usePageAuthGuard();
  const plansQuery = usePlans();
  const benefitsQuery = useBenefits();
  const [planId, setPlanId] = useState('tahun');

  if (!isLoggedIn) return <LoadingState />;
  if (plansQuery.isLoading || benefitsQuery.isLoading) return <LoadingState />;
  if (plansQuery.isError || benefitsQuery.isError || !plansQuery.data || !benefitsQuery.data) {
    return (
      <ErrorState
        onRetry={() => {
          plansQuery.refetch();
          benefitsQuery.refetch();
        }}
      />
    );
  }

  const plans = plansQuery.data;
  const benefits = benefitsQuery.data;
  const selected = plans.find((p) => p.id === planId) ?? plans[0];

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-10 flex justify-center animate-screen-in">
      <div className="w-full max-w-[940px]">
        <div className="text-center mb-1.5">
          <span className="inline-flex items-center gap-1.5 bg-[#F4F0FF] text-[#5B2BC4] text-[12.5px] font-extrabold px-[13px] py-1.5 rounded-full">
            <Icon name="bolt" size={14} className="text-prio" />
            Antri Priority
          </span>
        </div>
        <div className="font-display font-extrabold text-[34px] tracking-[-.8px] text-center leading-[1.1] mt-3">
          Nggak pernah kelamaan
          <br />
          di antrean lagi
        </div>
        <div className="text-center text-faint text-[15px] mt-2.5 max-w-[520px] mx-auto leading-[1.5]">
          Otomatis naik antrean tiap kali pesan, tanpa bayar biaya prioritas lagi. Pilih paket yang pas buat kamu.
        </div>

        <div className="grid grid-cols-2 gap-[22px] mt-8 items-stretch">
          {plans.map((p) => {
            const active = planId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlanId(p.id)}
                aria-pressed={active}
                className={cn(
                  'text-left relative overflow-hidden rounded-3xl p-7 flex flex-col transition-transform active:scale-[.99] border-2',
                  active
                    ? 'bg-[linear-gradient(160deg,#F7F2FF,#fff_55%)] border-prio shadow-[0_14px_34px_rgba(122,59,245,.16)]'
                    : 'bg-white border-line shadow-[0_5px_16px_rgba(35,24,15,.05)]',
                )}
              >
                {p.badge && (
                  <span className="absolute top-0 right-0 bg-prio text-white text-[11px] font-extrabold px-3.5 py-1.5 rounded-bl-[14px]">
                    {p.badge}
                  </span>
                )}
                <div className={cn('font-extrabold text-sm', active ? 'text-[#5B2BC4]' : 'text-faint')}>{p.name}</div>
                <div className="flex items-end gap-1 mt-3">
                  <span className={cn('font-display font-extrabold text-[40px] leading-none', active ? 'text-[#5B2BC4]' : 'text-ink')}>
                    <Money amount={p.price} />
                  </span>
                  <span className="text-sm text-faint font-semibold mb-1.5">{p.per}</span>
                </div>
                <div className={cn('text-[13px] mt-1.5', active ? 'text-prio' : 'text-faint')}>{p.note}</div>
                <div className={cn('h-px my-5', active ? 'bg-[#EBE1FF]' : 'bg-[#F4ECE2]')} />
                <div className="flex flex-col gap-3 flex-1">
                  {benefits.map((b) => (
                    <div key={b.title} className="flex items-start gap-2.5">
                      <span className={cn('flex-none w-5 h-5 rounded-full flex items-center justify-center mt-px', active ? 'bg-prio' : 'bg-[#DDD2C4]')}>
                        <Icon name="check" size={12} className="text-white" strokeWidth={3} />
                      </span>
                      <span className="text-[13.5px] text-[#3A2A1C] leading-[1.4]">{b.title}</span>
                    </div>
                  ))}
                </div>
                <div
                  className={cn(
                    'mt-[22px] w-full text-center rounded-2xl py-[15px] font-extrabold text-[15px]',
                    active ? 'bg-[linear-gradient(135deg,#9B6BFF,#7A3BF5)] text-white' : 'bg-[#F1E7DC] text-ink',
                  )}
                >
                  {active ? `Pilih ${p.name} · Hemat` : `Pilih ${p.name}`}
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-[22px] bg-white rounded-[20px] p-[22px_26px] shadow-[0_5px_16px_rgba(35,24,15,.05)] flex items-center gap-4">
          <span className="flex-none w-11 h-11 rounded-[13px] bg-mint-soft flex items-center justify-center">
            <Icon name="check-circle" size={22} className="text-mint-deep" />
          </span>
          <div className="flex-1">
            <div className="font-extrabold text-[14.5px]">Bisa berhenti kapan aja</div>
            <div className="text-[13px] text-faint mt-0.5">Nggak ada kontrak. Batalkan langganan langsung dari halaman Profil.</div>
          </div>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-none bg-ink text-white font-extrabold text-sm px-6 py-3.5 rounded-2xl transition-transform active:scale-[.97]"
          >
            Langganan · <Money amount={selected?.price} />
          </button>
        </div>
      </div>
    </div>
  );
}
