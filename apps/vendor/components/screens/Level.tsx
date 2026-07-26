'use client';
import { useRouter } from 'next/navigation';
import { TIERS } from '@jajanhub/api';
import { IconButton, Icon, cn, type IconName } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { TierCelebrationModal } from '../TierCelebrationModal';
import { useTierLevelUpFlow } from './useTierLevelUpFlow';

const BENEFIT_ICON: Record<string, IconName> = {
  payout: 'card',
  discovery: 'map-pin',
  prioritySplit: 'percent',
  analytics: 'chart',
};

/**
 * "Level Pedagang" detail — matches Antre/Antri Pedagang.dc.html's `isLevel`
 * tab: 3 tier cards to compare + a progress/preview card (or a demo-reset
 * button once maxed). No desktop view yet (D0 fallback — see `app/level/page.tsx`).
 */
export function Level() {
  const router = useRouter();
  const vm = useTierLevelUpFlow();

  if (vm.isLoading) return <LoadingState />;
  if (vm.isError || !vm.progress) return <ErrorState onRetry={vm.refetch} />;

  const { current, next, requirement, ordersHave, ordersNeeded, progress: pct, isMaxTier } = vm.progress;

  return (
    <div className="animate-screen-in pb-11">
      {/* Hero */}
      <div className="relative px-[22px] pt-5 pb-[52px] overflow-hidden" style={{ background: current.gradient }}>
        <div className="absolute inset-0 bg-[radial-gradient(72%_60%_at_86%_0%,rgba(255,255,255,.26),transparent)]" />
        <div className="relative flex items-center gap-3">
          <IconButton aria-label="Kembali" tone="translucent" onClick={() => router.back()}>
            <Icon name="chevron-left" size={19} strokeWidth={2.2} />
          </IconButton>
          <div className="text-white font-display font-extrabold text-xl">Level Pedagang</div>
        </div>
        <div className="relative mt-4 text-white">
          <div className="text-[13px] opacity-85 font-semibold">Tier kamu sekarang</div>
          <div className="font-display font-extrabold text-[30px] tracking-[-.5px] leading-none mt-1 flex items-center gap-2.5">
            <Icon name="medal" size={26} />
            {current.name}
          </div>
        </div>
      </div>

      {/* Compare tiers */}
      <div className="px-5 pt-3.5 pb-0.5">
        <div className="text-xs font-bold text-faint tracking-[.4px]">BANDINGKAN TIER · geser →</div>
      </div>
      <div className="flex gap-3.5 overflow-x-auto px-5 pt-2.5 pb-2 [scroll-snap-type:x_mandatory]">
        {TIERS.map((t) => {
          const active = t.id === current.id;
          const passed = TIERS.findIndex((x) => x.id === t.id) < TIERS.findIndex((x) => x.id === current.id);
          const statusLabel = passed ? 'Sudah terlewati' : active ? 'Tier kamu sekarang' : 'Belum terbuka';
          return (
            <div
              key={t.id}
              className={cn('flex-none w-[248px] bg-white rounded-3xl p-[18px] [scroll-snap-align:center]', active ? 'border-[2.5px]' : 'border-[1.5px] border-[#EDE3D6] opacity-50')}
              style={{
                borderColor: active ? t.accent : undefined,
                boxShadow: active ? `0 14px 30px ${t.accent}40` : '0 5px 16px rgba(35,24,15,.05)',
              }}
            >
              <div className="flex items-center gap-3">
                <div className="flex-none w-[46px] h-[46px] rounded-2xl flex items-center justify-center text-white" style={{ background: t.gradient }}>
                  <Icon name="medal" size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-extrabold text-lg">{t.name}</div>
                  <div className="text-[11.5px] text-faint">{t.tag}</div>
                </div>
              </div>
              <div
                className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-extrabold px-[11px] py-1.5 rounded-full"
                style={{ background: active ? t.soft : '#F4ECE2', color: active ? t.accent : '#9A8A7C' }}
              >
                {statusLabel}
              </div>
              <div className="h-px bg-[#F4ECE2] my-3.5" />
              <div className="flex flex-col gap-3">
                {t.benefits.map((b) => (
                  <div key={b.key} className="flex items-center gap-2.5">
                    <span className="flex-none w-8 h-8 rounded-[10px] flex items-center justify-center" style={{ background: t.soft, color: t.accent }}>
                      <Icon name={BENEFIT_ICON[b.key]!} size={16} />
                    </span>
                    <span className="flex-1 text-xs text-muted leading-[1.25]">{b.label}</span>
                    <span className="flex-none text-[12.5px] font-extrabold text-right max-w-[92px]">{b.value}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress / demo actions */}
      {!isMaxTier && next && requirement && (
        <div className="px-5 pt-3">
          <div className="bg-white rounded-[20px] p-4 shadow-card">
            <div className="font-bold text-sm">
              Sedikit lagi menuju Level <span style={{ color: current.accent }}>{next.name}</span>
            </div>
            <div className="text-[12.5px] text-faint mt-[3px] leading-[1.45]">
              {ordersHave}/{ordersNeeded} {requirement.ordersWindowLabel} · Respon rata-rata {requirement.avgResponseLabel}
            </div>
            <div className="h-2.5 rounded-full bg-[#F1E7DC] overflow-hidden mt-3">
              <div className="h-full rounded-full" style={{ width: `${pct}%`, background: current.gradient }} />
            </div>
            <button
              type="button"
              onClick={vm.previewLevelUp}
              disabled={vm.previewPending}
              className="mt-3.5 w-full rounded-2xl py-3.5 font-extrabold text-sm text-white transition-transform active:scale-[.98] disabled:opacity-70"
              style={{ background: current.gradient }}
            >
              {vm.previewPending ? 'Memproses…' : `Pratinjau naik ke ${next.name}`}
            </button>
            <div className="text-[11px] text-faint text-center mt-2">Simulasi buat lihat perayaan & benefit tier berikutnya</div>
          </div>
        </div>
      )}
      {isMaxTier && (
        <div className="px-5 pt-3">
          <button
            type="button"
            onClick={vm.resetDemo}
            className="w-full border-[1.5px] border-[#EDE3D6] text-faint rounded-2xl py-3.5 font-bold text-[13px] transition-transform active:scale-[.98]"
          >
            Atur ulang demo ke Bronze
          </button>
        </div>
      )}

      <TierCelebrationModal open={vm.celebrateOpen} onClose={vm.closeCelebrate} tier={current} />
    </div>
  );
}
