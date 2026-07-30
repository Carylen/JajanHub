'use client';
import { useState } from 'react';
import { tierDefinition, type Stall } from '@jajanhub/api';
import { Icon, cn } from '@jajanhub/ui';
import { FOOD_GRADIENTS, DRINK_GRADIENT } from '../../lib/visuals';
import { FoodGlyph } from './FoodGlyph';
import { useVendorSelect } from './useVendorSelect';
import { SwitchVendorModal } from './SwitchVendorModal';

const FILTERS = [
  { value: 'all', label: 'Semua gerobak', icon: 'grid4' as const },
  { value: 'nasi', label: 'Nasi', icon: 'utensils' as const },
  { value: 'mie', label: 'Mie & Bakso', icon: 'bag' as const },
  { value: 'minuman', label: 'Minuman', icon: 'cup' as const },
  { value: 'jajanan', label: 'Jajanan', icon: 'star' as const },
];

function stallGradient(stall: Stall, index: number): string {
  if (stall.category === 'minuman') return DRINK_GRADIENT;
  return FOOD_GRADIENTS[index % FOOD_GRADIENTS.length] ?? FOOD_GRADIENTS[0]!;
}

function pinColor(stall: Stall) {
  if (!stall.open) return '#B8A99B';
  return stall.queue <= 5 ? '#16C784' : '#FF9A3D';
}

function tierBadge(stall: Stall) {
  if (stall.tier !== 'gold' && stall.tier !== 'silver') return null;
  const def = tierDefinition(stall.tier);
  return { label: def.name, bg: def.soft, color: def.accent };
}

/**
 * Desktop "Sekitar Sini" screen — matches Antre/Antri Desktop.dc.html's
 * `isDiscovery` state: catalog grid left + sticky map panel right (366px).
 * Reuses mobile Discovery's data shape (`Stall`, `mapX`/`mapY` pins) so both
 * views stay driven by the same `useStalls()` query; only the chrome differs
 * (grid instead of list, map always visible instead of a toggle).
 */
export function DiscoveryDesktopView({ stalls }: { stalls: Stall[] }) {
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const { pending, activeVendorName, select, confirm, cancel } = useVendorSelect(stalls);

  const q = query.trim().toLowerCase();
  const visible = stalls
    .filter((s) => (filter === 'all' ? true : s.category === filter))
    .filter((s) => !q || s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q));
  const nearest = [...stalls].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance)).slice(0, 3);
  const filterCount = (v: string) => (v === 'all' ? stalls.length : stalls.filter((s) => s.category === v).length);

  return (
    <div className="flex-1 min-w-0 flex">
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="relative h-[170px] flex-none bg-[linear-gradient(158deg,#7FD0B4,#2FB98F_60%,#159C77)] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_82%_0%,rgba(255,255,255,.26),transparent)]" />
          <div className="relative px-10 py-[30px] text-white">
            <div className="inline-flex items-center gap-1.5 bg-white/[.22] text-xs font-bold px-[11px] py-1 rounded-full mb-2.5">
              <Icon name="map-pin" size={13} className="text-white" />
              Area SCBD · radius 1 km
            </div>
            <div className="font-display font-extrabold text-[32px] tracking-[-.8px] leading-none">Sekitar Sini</div>
            <div className="text-[15px] opacity-95 mt-[7px] max-w-[520px] leading-[1.5]">
              Gerobak lain yang lagi buka di dekatmu. Pesan dari mana aja, ambil pas siap.
            </div>
          </div>
        </div>

        <div className="px-10 pt-[22px] flex-none">
          <div className="flex items-center gap-2.5 bg-white rounded-[14px] px-[17px] py-[13px] shadow-[0_3px_12px_rgba(35,24,15,.05)] max-w-[420px]">
            <Icon name="search" size={18} className="text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari gerobak atau makanan…"
              className="flex-1 min-w-0 border-0 outline-none bg-transparent text-sm text-ink font-sans"
            />
          </div>
        </div>

        <div className="px-10 pt-[14px] pb-2 flex-none flex items-center justify-between">
          <div className="font-display font-extrabold text-[19px]">
            {FILTERS.find((f) => f.value === filter)?.label ?? 'Semua gerobak'}{' '}
            <span className="text-faint font-bold text-[15px]">· {visible.length} gerobak</span>
          </div>
          <div className="text-[13px] text-faint">
            Urutkan: <span className="font-bold text-ink">Terdekat</span>
          </div>
        </div>

        <div className="px-10 flex items-center gap-2 flex-none">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-colors',
                  active ? 'bg-mint-soft text-mint-deep' : 'text-muted hover:bg-white',
                )}
              >
                <Icon name={f.icon} size={16} />
                {f.label}
                <span className={cn('text-xs font-bold', active ? 'text-mint-deep' : 'text-[#C4B29B]')}>
                  {filterCount(f.value)}
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-10 pt-3 pb-10">
          {visible.length === 0 ? (
            <div className="text-center text-faint text-sm py-16">Belum ada gerobak di filter ini.</div>
          ) : (
            <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fill,minmax(260px,1fr))]">
              {visible.map((s, i) => {
                const tier = tierBadge(s);
                return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => select(s)}
                  disabled={!s.open}
                  className={cn(
                    'text-left bg-white rounded-[20px] overflow-hidden shadow-[0_5px_16px_rgba(35,24,15,.05)] flex flex-col transition-transform',
                    s.open ? 'cursor-pointer active:scale-[.99]' : 'cursor-not-allowed opacity-80',
                  )}
                >
                  <div
                    className="h-[112px] relative flex items-center justify-center"
                    style={{ background: stallGradient(s, i), filter: s.open ? 'none' : 'grayscale(.55) opacity(.85)' }}
                  >
                    <FoodGlyph cat={s.category === 'minuman' ? 'drink' : 'food'} size={32} />
                    <span className="absolute top-3 left-3 inline-flex items-center gap-[5px] bg-white/[.92] text-ink text-[11px] font-extrabold px-[10px] py-[5px] rounded-full">
                      <Icon name="star" size={11} className="text-[#F5A623]" />
                      {s.type}
                    </span>
                    {tier && (
                      <span
                        className="absolute top-3 right-3 inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full"
                        style={{ background: tier.bg, color: tier.color }}
                      >
                        <Icon name="medal" size={11} />
                        {tier.label}
                      </span>
                    )}
                    <span
                      className={cn(
                        'absolute bottom-2.5 left-3 inline-flex items-center gap-[5px] text-[11px] font-extrabold px-2.5 py-1 rounded-full',
                        s.open ? 'bg-mint-soft text-mint-deep' : 'bg-white/[.92] text-faint',
                      )}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: s.open ? '#16C784' : '#C4B29B' }} />
                      {s.open ? 'Buka' : 'Tutup'}
                    </span>
                  </div>
                  <div className="p-[15px] flex flex-col flex-1">
                    <div className="font-display font-extrabold text-base leading-[1.2]">{s.name}</div>
                    <div className="text-[12.5px] text-faint mt-1">
                      {s.type} · {s.distance}
                    </div>
                    <div className="flex items-center justify-between mt-3.5">
                      <div className={cn('flex items-center gap-1.5 text-[12.5px] font-bold', s.open ? 'text-muted' : 'text-faint')}>
                        <Icon name="users" size={15} />
                        {s.open ? `${s.queue} antre` : 'Belum buka'}
                      </div>
                      <span
                        className={cn(
                          'font-extrabold text-[12.5px] px-[13px] py-2 rounded-[11px]',
                          s.open ? 'bg-ink text-white' : 'bg-[#EFE6DA] text-faint',
                        )}
                      >
                        {s.open ? 'Lihat menu' : 'Tutup'}
                      </span>
                    </div>
                  </div>
                </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Map panel */}
      <aside className="flex-none w-[366px] bg-white shadow-[-2px_0_24px_rgba(35,24,15,.05)] flex flex-col sticky top-0 h-screen">
        <div className="px-6 pt-6 pb-3.5 border-b border-[#F4ECE2]">
          <div className="font-display font-extrabold text-xl">Peta sekitar</div>
          <div className="text-[13px] text-faint mt-0.5">{stalls.length} gerobak dalam 1 km</div>
        </div>
        <div className="flex-1 relative overflow-hidden bg-[#EDE7DD]">
          <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 366 500" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0 120 H366 M0 300 H366 M120 0 V500 M250 0 V500" stroke="#fff" strokeWidth="14" fill="none" />
            <path d="M60 0 L200 500" stroke="#fff" strokeWidth="20" fill="none" opacity=".7" />
          </svg>
          {stalls.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => select(s)}
              aria-label={s.name}
              className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center transition-transform active:scale-90"
              style={{ left: s.mapX, top: s.mapY }}
            >
              <div
                className="text-white font-extrabold text-[11px] px-[9px] py-1.5 rounded-lg shadow-[0_4px_10px_rgba(0,0,0,.2)] whitespace-nowrap"
                style={{ background: pinColor(s) }}
              >
                {s.open ? `${s.queue} org` : 'Tutup'}
              </div>
              <div className="w-2 h-2 rotate-45 -mt-[3px] rounded-[2px]" style={{ background: pinColor(s) }} />
            </button>
          ))}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
            <div className="relative w-5 h-5">
              <span className="absolute inset-0 rounded-full bg-[rgba(37,99,235,.35)] animate-ripple" />
              <span className="absolute inset-1 rounded-full bg-[#2563EB] border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,.25)]" />
            </div>
            <span className="mt-[5px] bg-ink text-white text-[10px] font-bold px-2 py-[3px] rounded-full whitespace-nowrap">Kamu di sini</span>
          </div>
        </div>
        <div className="flex-none px-6 py-[18px] border-t border-[#F4ECE2] bg-[#FFFCF8]">
          <div className="text-[11px] font-extrabold text-faint tracking-[.5px] mb-2.5">PALING DEKAT</div>
          {nearest.map((n, i) => (
            <button
              key={n.id}
              type="button"
              onClick={() => select(n)}
              disabled={!n.open}
              className="w-full flex items-center gap-[11px] py-[7px] text-left"
            >
              <span
                className="flex-none w-[26px] h-[26px] rounded-lg text-white font-extrabold text-xs flex items-center justify-center"
                style={{ background: pinColor(n) }}
              >
                {i + 1}
              </span>
              <span className="flex-1 min-w-0 font-bold text-[13.5px] leading-[1.2] truncate">{n.name}</span>
              <span className="flex-none text-[12.5px] text-faint font-semibold">{n.distance}</span>
            </button>
          ))}
        </div>
      </aside>

      <SwitchVendorModal
        open={!!pending}
        onClose={cancel}
        activeVendorName={activeVendorName}
        pendingVendorName={pending?.name ?? ''}
        onConfirm={confirm}
      />
    </div>
  );
}
