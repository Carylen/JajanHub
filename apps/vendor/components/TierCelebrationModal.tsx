'use client';
import type { TierDefinition } from '@jajanhub/api';
import { Icon, Modal, type IconName } from '@jajanhub/ui';

const BENEFIT_ICON: Record<string, IconName> = {
  payout: 'card',
  discovery: 'map-pin',
  prioritySplit: 'percent',
  analytics: 'chart',
};

const CONFETTI_COLORS = ['#FF7A1A', '#16C784', '#E8C765', '#B9C1CE', '#FFB870', '#7A3BF5'];
const CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  left: `${4 + i * 5.3}%`,
  bg: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
  delay: `${(i % 6) * 0.14}s`,
  dur: `${1.9 + (i % 4) * 0.4}s`,
  size: `${6 + (i % 3) * 3}px`,
  round: i % 2 ? '50%' : '2px',
}));

/**
 * Level-up celebration — matches Antre/Antri Pedagang.dc.html's `levelUpOpen`
 * modal. Uses the shared `Modal` for both mobile and desktop: the reference
 * centers this dialog on mobile too (unlike Pay/Cancel, which are bottom
 * sheets on mobile), so there's no separate Sheet variant needed here.
 */
export function TierCelebrationModal({ open, onClose, tier }: { open: boolean; onClose: () => void; tier: TierDefinition }) {
  return (
    <Modal open={open} onClose={onClose} label="Naik level pedagang" width="340px">
      <div className="relative overflow-hidden">
        <div className="absolute inset-[-24px] overflow-hidden pointer-events-none" aria-hidden="true">
          {CONFETTI.map((c, i) => (
            <span
              key={i}
              className="absolute -top-6 rounded-sm"
              style={{
                left: c.left,
                width: c.size,
                height: c.size,
                background: c.bg,
                borderRadius: c.round,
                animation: `confettiFall ${c.dur} ease-in ${c.delay} infinite`,
              }}
            />
          ))}
        </div>

        <div className="relative text-center">
          <div
            className="w-[88px] h-[88px] mx-auto rounded-[28px] flex items-center justify-center text-white"
            style={{ background: tier.gradient, boxShadow: `0 14px 30px ${tier.accent}66` }}
          >
            <Icon name="medal" size={44} />
          </div>
          <div className="text-[12.5px] text-faint font-extrabold mt-4 tracking-[.5px]">SELAMAT, KAMU NAIK LEVEL!</div>
          <div className="font-display font-extrabold text-[30px] mt-1" style={{ color: tier.accent }}>
            Level {tier.name}
          </div>
          <div className="text-[13px] text-muted mt-1.5 leading-[1.45]">{tier.tag} · warungmu makin dipercaya pelanggan</div>

          <div className="mt-[18px] rounded-[18px] p-[14px_15px] text-left flex flex-col gap-[11px]" style={{ background: tier.soft }}>
            {tier.benefits.map((b) => (
              <div key={b.key} className="flex items-center gap-2.5">
                <span className="flex-none w-7 h-7 rounded-[9px] bg-white flex items-center justify-center" style={{ color: tier.accent }}>
                  <Icon name={BENEFIT_ICON[b.key]!} size={14} />
                </span>
                <span className="flex-1 text-[12.5px] text-muted">{b.label}</span>
                <span className="text-[12.5px] font-extrabold text-ink">{b.value}</span>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="mt-5 w-full rounded-2xl py-[15px] font-extrabold text-[15px] text-white transition-transform active:scale-[.98]"
            style={{ background: tier.gradient, boxShadow: `0 12px 26px ${tier.accent}66` }}
          >
            Lihat benefit baru
          </button>
          <button type="button" onClick={onClose} className="mt-2 w-full text-faint font-bold text-[13px] py-2 transition-transform active:scale-[.98]">
            Nanti aja
          </button>
        </div>
      </div>
    </Modal>
  );
}
