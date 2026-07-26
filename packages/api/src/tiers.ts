import type { VendorSummary, VendorTier } from './types';

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

/** Requirement to advance FROM this tier to the next one. Absent for the max tier (gold). */
export interface TierRequirement {
  ordersNeeded: number;
  ordersWindowLabel: string;
  avgResponseLabel: string;
}

/**
 * Centralized tier definitions (BRIEF D4 §5/§6) — numbers and copy live here,
 * not scattered across mobile/desktop components, so they can be adjusted
 * later (payout schedule and priority-fee split depend on payment-gateway
 * verification still pending, per BRIEF §6) without touching any screen.
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

/** Requirement to advance FROM the keyed tier to the next one — no entry for `gold` (already max). */
export const TIER_REQUIREMENTS: Record<'bronze' | 'silver', TierRequirement> = {
  bronze: { ordersNeeded: 20, ordersWindowLabel: 'pesanan minggu ini', avgResponseLabel: '4 mnt' },
  silver: { ordersNeeded: 30, ordersWindowLabel: 'pesanan minggu ini', avgResponseLabel: '3 mnt' },
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
  requirement: TierRequirement | null;
  ordersHave: number;
  ordersNeeded: number;
  isMaxTier: boolean;
}

/**
 * Pure, testable — the single place tier progress is computed from raw
 * vendor data, shared by every mobile/desktop screen that shows it (Beranda
 * card, Level Pedagang detail, Settlement banner, Analytics lock).
 */
export function getVendorTierProgress(vendor: Pick<VendorSummary, 'tier' | 'tierOrdersThisWindow'>): VendorTierProgress {
  const idx = TIER_ORDER.indexOf(vendor.tier);
  const current = tierDefinition(vendor.tier);
  const next = idx >= 0 && idx < TIER_ORDER.length - 1 ? tierDefinition(TIER_ORDER[idx + 1]!) : null;
  const requirement = next ? TIER_REQUIREMENTS[vendor.tier as 'bronze' | 'silver'] : null;
  const ordersNeeded = requirement?.ordersNeeded ?? 0;
  const ordersHave = vendor.tierOrdersThisWindow;
  const progress = requirement ? Math.min(100, Math.round((ordersHave / requirement.ordersNeeded) * 100)) : 100;

  return {
    current,
    next,
    progress,
    requirementsMet: requirement ? ordersHave >= requirement.ordersNeeded : true,
    requirement,
    ordersHave,
    ordersNeeded,
    isMaxTier: next === null,
  };
}

/** Next tier in sequence, or the same tier if already at the max (used by the demo "preview level up" action). */
export function nextTierId(tier: VendorTier): VendorTier {
  const idx = TIER_ORDER.indexOf(tier);
  return TIER_ORDER[Math.min(TIER_ORDER.length - 1, idx + 1)]!;
}
