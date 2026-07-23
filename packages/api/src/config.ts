/**
 * Central place for pricing constants and user-facing copy that depends on
 * payment-gateway / disbursement rules not yet finalized (see BRIEF §9).
 * Change these here rather than hardcoding across screens.
 */
export const PRICING = {
  serviceFee: 2000,
  priorityFee: 8000,
} as const;

export const COPY = {
  refundEta: 'Balik ke QRIS/e-wallet dalam 1–3 hari kerja',
  refundEtaShort: '1–3 hari kerja',
  payoutEta: 'Cair besok ±jam 10.00',
} as const;

export type ApiMode = 'mock' | 'http';

export function resolveApiMode(): ApiMode {
  const mode = process.env.NEXT_PUBLIC_API_MODE;
  return mode === 'http' ? 'http' : 'mock';
}

export function resolveApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3333';
}
