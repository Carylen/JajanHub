/** Format a whole-Rupiah amount as `Rp22.000` (id-ID grouping). */
export function formatRupiah(amount: number | null | undefined): string {
  return 'Rp' + (amount ?? 0).toLocaleString('id-ID');
}

/** Format seconds as `m:ss` for countdowns. */
export function formatCountdown(totalSeconds: number): string {
  const s = Math.max(0, totalSeconds);
  const mm = Math.floor(s / 60);
  const ss = s % 60;
  return `${mm}:${String(ss).padStart(2, '0')}`;
}
