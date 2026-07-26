'use client';
import Link from 'next/link';
import type { VendorTierProgress } from '@jajanhub/api';
import { Icon } from '@jajanhub/ui';

/**
 * Beranda's tier status card — matches Antre/Antri Pedagang.dc.html's level
 * card (medal + progress bar, or the max-tier banner). Pure presentation of
 * `useVendorTier()`'s `progress`, shared by `HomeMobileView` today; the
 * desktop Beranda card (once its reference lands) renders the same data,
 * just a different wrapper.
 */
export function TierCard({ progress, merchantName }: { progress: VendorTierProgress; merchantName: string }) {
  const { current, next, requirement, ordersHave, ordersNeeded, isMaxTier } = progress;

  return (
    <Link
      href="/level"
      className="block w-full text-left bg-white rounded-3xl p-[18px] shadow-[0_6px_18px_rgba(35,24,15,.06)] relative overflow-hidden transition-transform active:scale-[.99]"
    >
      <div
        className="absolute -right-[34px] -top-[34px] w-[120px] h-[120px] rounded-full opacity-70"
        style={{ background: current.soft }}
      />
      <div className="relative flex items-center gap-3.5">
        <div
          className="flex-none w-[52px] h-[52px] rounded-2xl flex items-center justify-center text-white shadow-[0_6px_16px_rgba(35,24,15,.16)]"
          style={{ background: current.gradient }}
        >
          <Icon name="medal" size={26} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-display font-extrabold text-xl leading-[1.05]">Level {current.name}</div>
          <div className="text-[12.5px] text-faint mt-0.5">{current.tag}</div>
        </div>
        <span className="flex-none inline-flex items-center gap-[3px] text-xs font-bold" style={{ color: current.accent }}>
          Detail
          <Icon name="chevron-right" size={15} />
        </span>
      </div>

      {!isMaxTier && next && requirement && (
        <div className="relative mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-[12.5px] text-muted font-semibold">
              Menuju Level <b style={{ color: current.accent }}>{next.name}</b>
            </span>
            <span className="text-[12.5px] font-extrabold" style={{ color: current.accent }}>
              {ordersHave}/{ordersNeeded}
            </span>
          </div>
          <div className="h-2.5 rounded-full bg-[#F1E7DC] overflow-hidden">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{ width: `${progress.progress}%`, background: current.gradient }}
            />
          </div>
          <div className="flex items-center gap-3.5 mt-[11px] flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: current.accent }} />
              {ordersHave}/{ordersNeeded} {requirement.ordersWindowLabel}
            </span>
            <span className="inline-flex items-center gap-1 text-xs text-mint-deep font-bold">
              <Icon name="check" size={14} strokeWidth={2.8} className="text-mint" />
              Respon rata-rata {requirement.avgResponseLabel}
            </span>
          </div>
        </div>
      )}

      {isMaxTier && (
        <div
          className="relative mt-3.5 rounded-2xl px-3.5 py-3 flex items-center gap-2.5"
          style={{ background: current.soft }}
        >
          <Icon name="star" size={18} style={{ color: current.accent }} />
          <span className="text-[13px] font-bold" style={{ color: current.accent }}>
            Kamu sudah di tier tertinggi. Mantap, {merchantName}!
          </span>
        </div>
      )}
    </Link>
  );
}
