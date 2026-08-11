import type { VendorTier, VendorTierStatus } from './types';

const TIER_ORDER: VendorTier[] = ['bronze', 'silver', 'gold'];

export interface TierBenefit {
  key: 'payout' | 'discovery' | 'prioritySplit' | 'analytics';
  label: string;
  /** Display value for this specific tier, e.g. "2× / hari". */
  value: string;
}

export interface TierDefinition {
  id: VendorTier;
  name: string;
  tag: string;
  accent: string;
  soft: string;
  gradient: string;
  benefits: TierBenefit[];
  /** Longer-form copy for the Settlement banner ("dana kamu cair …"), distinct from the compact `payout` benefit value. */
  payoutFrequencyLabel: string;
}

/**
 * Centralized tier definitions (visual/copy only — the underlying numbers
 * come from `GET /vendors/:id/tier`, see `VendorTierStatus`) so they can be
 * adjusted later without touching any screen.
 */
export const TIERS: TierDefinition[] = [
  {
    id: 'bronze',
    name: 'Bronze',
    tag: 'Pedagang Baru',
    accent: '#A9714B',
    soft: '#F3E7DB',
    gradient: 'linear-gradient(135deg,#C89268,#9A6640)',
    payoutFrequencyLabel: '1× sehari, tiap pagi',
    benefits: [
      { key: 'payout', label: 'Kecepatan pencairan', value: '1× / hari' },
      { key: 'discovery', label: 'Posisi di Discovery', value: 'Standar' },
      { key: 'prioritySplit', label: 'Bagi hasil fee prioritas', value: '0%' },
      { key: 'analytics', label: 'Akses analytics', value: 'Dasar' },
    ],
  },
  {
    id: 'silver',
    name: 'Silver',
    tag: 'Langganan Ramai',
    accent: '#7E8798',
    soft: '#ECEEF2',
    gradient: 'linear-gradient(135deg,#B9C1CE,#868FA1)',
    payoutFrequencyLabel: '2× sehari',
    benefits: [
      { key: 'payout', label: 'Kecepatan pencairan', value: '2× / hari' },
      { key: 'discovery', label: 'Posisi di Discovery', value: 'Diprioritaskan' },
      { key: 'prioritySplit', label: 'Bagi hasil fee prioritas', value: '15%' },
      { key: 'analytics', label: 'Akses analytics', value: '+ Tren mingguan' },
    ],
  },
  {
    id: 'gold',
    name: 'Gold',
    tag: 'Andalan Kawasan',
    accent: '#BE922E',
    soft: '#FAF0D6',
    gradient: 'linear-gradient(135deg,#E8C765,#CB9E34)',
    payoutFrequencyLabel: 'real-time, tiap transaksi masuk',
    benefits: [
      { key: 'payout', label: 'Kecepatan pencairan', value: 'Real-time' },
      { key: 'discovery', label: 'Posisi di Discovery', value: 'Teratas + badge' },
      { key: 'prioritySplit', label: 'Bagi hasil fee prioritas', value: '30%' },
      { key: 'analytics', label: 'Akses analytics', value: 'Lengkap' },
    ],
  },
];

/** Display copy paired with a tier's progress requirement — the actual thresholds (`ordersRequired`, `responseRequiredSec`, …) come from `GET /vendors/:id/tier` (`VendorTierStatus`); this only holds copy the network response doesn't carry. No entry for `gold` (already max). */
export const TIER_COPY: Record<'bronze' | 'silver', { ordersWindowLabel: string }> = {
  bronze: { ordersWindowLabel: 'pesanan minggu ini' },
  silver: { ordersWindowLabel: 'pesanan minggu ini' },
};

export function tierDefinition(id: VendorTier): TierDefinition {
  return TIERS.find((t) => t.id === id) ?? TIERS[0]!;
}

export interface VendorTierProgress {
  current: TierDefinition;
  next: TierDefinition | null;
  /** 0–100. Always 100 for the max tier. */
  progress: number;
  requirementsMet: boolean;
  requirement: { ordersWindowLabel: string; avgResponseLabel: string } | null;
  ordersHave: number;
  ordersNeeded: number;
  isMaxTier: boolean;
}

function formatSeconds(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  if (m === 0) return `${s} dtk`;
  if (s === 0) return `${m} mnt`;
  return `${m} mnt ${s} dtk`;
}

/**
 * Pure, testable — the single place tier progress is computed from the raw
 * `GET /vendors/:id/tier` response, shared by every mobile/desktop screen
 * that shows it (Beranda card, Level Pedagang detail, Settlement banner,
 * Analytics lock).
 */
export function getVendorTierProgress(status: VendorTierStatus): VendorTierProgress {
  const current = tierDefinition(status.current);
  const next = status.next ? tierDefinition(status.next) : null;
  const { ordersCompleted, ordersRequired, responseRequiredSec } = status.progress;
  const progress = next ? Math.min(100, Math.round((ordersCompleted / Math.max(1, ordersRequired)) * 100)) : 100;
  const copy = next ? TIER_COPY[status.current as 'bronze' | 'silver'] : null;

  return {
    current,
    next,
    progress,
    requirementsMet: next ? ordersCompleted >= ordersRequired : true,
    requirement: copy
      ? { ordersWindowLabel: copy.ordersWindowLabel, avgResponseLabel: formatSeconds(responseRequiredSec) }
      : null,
    ordersHave: ordersCompleted,
    ordersNeeded: ordersRequired,
    isMaxTier: next === null,
  };
}

/** Next tier in sequence, or the same tier if already at the max (used by the demo "preview level up" action). */
export function nextTierId(tier: VendorTier): VendorTier {
  const idx = TIER_ORDER.indexOf(tier);
  return TIER_ORDER[Math.min(TIER_ORDER.length - 1, idx + 1)]!;
}
