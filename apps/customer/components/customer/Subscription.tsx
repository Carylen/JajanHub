'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePlans, useBenefits } from '@jajanhub/api';
import { Button, IconButton, Icon, Money, cn } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { usePageAuthGuard } from './auth/usePageAuthGuard';

export function Subscription() {
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
  const selected = plans.find((p) => p.id === planId) ?? plans[0];

  return (
    <div>
      <div className="animate-screen-in pb-[120px]">
        {/* Purple hero */}
        <div className="relative bg-[linear-gradient(160deg,#3A2359,#241338)] px-5 pt-4 pb-[34px] overflow-hidden">
          <svg className="absolute -right-[30px] -top-5 opacity-[.18]" width="180" height="180" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M13 2L4 14h6l-1 8 10-12h-6z" fill="#fff" />
          </svg>
          <div className="relative flex items-center gap-3">
            <IconButton aria-label="Kembali" tone="translucent" onClick={() => router.back()}>
              <Icon name="chevron-left" size={19} strokeWidth={2.2} />
            </IconButton>
            <div className="text-white font-display font-extrabold text-[19px]">JajanHub Plus</div>
          </div>
          <div className="relative mt-[22px] text-center text-white">
            <div className="inline-flex items-center gap-1.5 bg-[rgba(168,121,255,.22)] text-[#D8C6FF] font-bold text-xs px-[13px] py-1.5 rounded-full mb-3.5">
              <Icon name="bolt" size={13} className="text-[#D8C6FF]" />
              Langganan Prioritas
            </div>
            <h1 className="font-display font-extrabold text-[27px] leading-[1.15] tracking-[-.5px]">
              Nggak usah ngantri
              <br />
              lama-lama lagi
            </h1>
            <p className="text-[#C6B4E6] text-sm mt-2.5 leading-[1.5]">
              Prioritas otomatis tiap pesan, di semua
              <br />
              gerobak langganan JajanHub
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="mx-5 -mt-5 bg-white rounded-[24px] p-5 shadow-[0_14px_34px_rgba(36,19,56,.14)]">
          <div className="font-extrabold text-sm mb-3.5">Yang kamu dapat</div>
          <div className="flex flex-col gap-3.5">
            {benefitsQuery.data.map((b) => (
              <div key={b.title} className="flex gap-3 items-start">
                <span className="flex-none w-[26px] h-[26px] rounded-lg bg-prio-soft flex items-center justify-center">
                  <Icon name="check" size={15} className="text-prio" strokeWidth={2.6} />
                </span>
                <div>
                  <div className="font-bold text-sm leading-[1.25]">{b.title}</div>
                  <div className="text-faint text-xs mt-px">{b.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Plans */}
        <div className="px-5 pt-[18px] flex flex-col gap-3">
          {plans.map((p) => {
            const active = planId === p.id;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => setPlanId(p.id)}
                aria-pressed={active}
                className={cn(
                  'w-full text-left bg-white rounded-[20px] px-[18px] py-4 flex items-center gap-3.5 relative border-2 transition-transform active:scale-[.99]',
                  active ? 'border-prio' : 'border-line',
                )}
              >
                <span
                  className={cn(
                    'flex-none w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center',
                    active ? 'border-prio' : 'border-[#D6C9BA]',
                  )}
                >
                  <span className={cn('w-3 h-3 rounded-full', active ? 'bg-prio' : 'bg-transparent')} />
                </span>
                <div className="flex-1">
                  <div className="font-bold text-[15px]">{p.name}</div>
                  <div className="text-faint text-xs mt-px">{p.note}</div>
                </div>
                <div className="text-right">
                  <Money amount={p.priceRp} display className="text-lg text-ink" />
                  <div className="text-[11px] text-faint">{p.per}</div>
                </div>
                {p.badge && (
                  <span className="absolute -top-[9px] right-4 bg-prio text-white text-[10px] font-extrabold px-[9px] py-[3px] rounded-full">
                    {p.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-app px-5 pt-4 pb-[22px] bg-[linear-gradient(to_top,#FFF8F1_72%,transparent)] z-20">
        <Button variant="prio" fullWidth onClick={() => router.back()}>
          Langganan Sekarang · <Money amount={selected?.priceRp} />
        </Button>
        <div className="text-center text-[#B8A99B] text-[11px] mt-2.5">Batalkan kapan aja, tanpa ribet</div>
      </div>
    </div>
  );
}
