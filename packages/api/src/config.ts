/**
 * Central place for pricing constants and user-facing copy that depends on
 * payment-gateway / disbursement rules not yet finalized (see BRIEF §9).
 * Change these here rather than hardcoding across screens.
 *
 * Field names match API_CONTRACT.md §11's `GET /config/fees` exactly — this
 * object doubles as the mock's response for that endpoint (see
 * `getConfigFees` in mockClient.ts). The values themselves are the product's
 * real, already-shipped numbers, not the contract doc's illustrative 🔸
 * examples (which differ, e.g. `priorityFeeRp: 3000` there vs `8000` here) —
 * §15 marks those as unagreed, not as instructions to change pricing.
 * TODO confirm with backend.
 */
export const PRICING = {
  serviceFeeRp: 2000,
  priorityFeeRp: 8000,
  /** Fee for an order add-on — cheaper than a fresh order's priorityFeeRp since it rides the same queue slot. */
  addonFeeRp: 2000,
  /** Max add-ons a single order can carry (D3). */
  maxAddonsPerOrder: 2,
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
