import { useMemo } from 'react';

/**
 * Deterministic decorative QR placeholder, ported from the design's `qr()`
 * generator. Not a real payload — swapped for a real QRIS/pickup QR image once
 * the backend provides one. `seed` lets different orders render distinct-looking
 * codes while staying stable across re-renders.
 */
function generateModules(seed: number, cell: number): Array<{ left: number; top: number }> {
  const N = 28;
  let s = seed;
  const rnd = () => {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
    return (s >> 17) & 1;
  };
  const boxes: Array<[number, number]> = [
    [0, 0],
    [0, 21],
    [21, 0],
  ];
  const mods: Array<{ left: number; top: number }> = [];
  for (let r = 0; r < N; r++) {
    for (let c = 0; c < N; c++) {
      const b = boxes.find(([br, bc]) => r >= br && r < br + 7 && c >= bc && c < bc + 7);
      let on: boolean;
      if (b) {
        const rr = r - b[0];
        const cc = c - b[1];
        on = rr === 0 || rr === 6 || cc === 0 || cc === 6 || (rr >= 2 && rr <= 4 && cc >= 2 && cc <= 4);
      } else {
        on = rnd() === 1;
      }
      if (on) mods.push({ left: c * cell, top: r * cell });
    }
  }
  return mods;
}

export interface QrCodeProps {
  seed?: number;
  /** Whether to overlay the brand mark in the center (payment QR). */
  branded?: boolean;
}

export function QrCode({ seed = 99, branded = false }: QrCodeProps) {
  const cell = 8;
  const mods = useMemo(() => generateModules(seed, cell), [seed]);
  return (
    <div className="relative w-[224px] h-[224px] bg-white">
      {mods.map((m, i) => (
        <span
          key={i}
          className="absolute bg-[#1A1108]"
          style={{ width: cell, height: cell, left: m.left, top: m.top }}
        />
      ))}
      {branded && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-[11px] bg-white flex items-center justify-center shadow-[0_0_0_4px_#fff]">
          <div className="w-8 h-8 rounded-[9px] bg-gradient-to-br from-brand to-brand-deep flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 20V10a6 6 0 0 1 12 0v10" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 20.5h16" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
