'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { tierDefinition, type Stall } from '@jajanhub/api';
import { IconButton, Icon, cn } from '@jajanhub/ui';
import { FOOD_GRADIENTS, DRINK_GRADIENT } from '../../lib/visuals';
import { FoodGlyph } from './FoodGlyph';
import { useVendorSelect } from './useVendorSelect';
import { SwitchVendorSheet } from './SwitchVendorSheet';

type View = 'list' | 'map';
const FILTERS = [
  { value: 'all', label: 'Semua' },
  { value: 'nasi', label: 'Nasi' },
  { value: 'mie', label: 'Mie' },
  { value: 'minuman', label: 'Minuman' },
  { value: 'jajanan', label: 'Jajanan' },
  { value: 'sepi', label: 'Antrian Sepi' },
];

function stallGradient(stall: Stall, index: number): string {
  if (stall.category === 'minuman') return DRINK_GRADIENT;
  return FOOD_GRADIENTS[index % FOOD_GRADIENTS.length] ?? FOOD_GRADIENTS[0]!;
}

function badgeOf(stall: Stall) {
  if (!stall.open) return { label: 'Tutup', bg: 'bg-[#F1E7DC]', color: 'text-faint' };
  if (stall.queue <= 5) return { label: `Antrian ${stall.queue} orang`, bg: 'bg-mint-soft', color: 'text-mint-deep' };
  return { label: `Ramai · ${stall.queue} orang`, bg: 'bg-[#FFEDD9]', color: 'text-brand-deep' };
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

export function Discovery({ stalls }: { stalls: Stall[] }) {
  const router = useRouter();
  const [view, setView] = useState<View>('list');
  const [filter, setFilter] = useState('all');
  const [query, setQuery] = useState('');
  const { pending, activeVendorName, select, confirm, cancel } = useVendorSelect(stalls);

  const q = query.trim().toLowerCase();
  const visible = stalls
    .filter((s) => (filter === 'all' ? true : filter === 'sepi' ? s.open && s.queue <= 5 : s.category === filter))
    .filter((s) => !q || s.name.toLowerCase().includes(q) || s.type.toLowerCase().includes(q));
  const openCount = stalls.filter((s) => s.open).length;

  return (
    <div className="animate-screen-in pb-8">
      {/* Sticky header */}
      <div className="sticky top-0 z-[15] bg-cream/[.94] backdrop-blur-[10px] px-5 pt-4 pb-2.5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-[11px]">
            <IconButton aria-label="Kembali" onClick={() => router.back()}>
              <Icon name="chevron-left" size={19} strokeWidth={2.2} />
            </IconButton>
            <div>
              <div className="text-xs text-faint font-semibold">Lagi di sekitar</div>
              <div className="flex items-center gap-[5px] font-display font-extrabold text-[19px] leading-[1.05]">
                <Icon name="map-pin" size={16} className="text-brand" />
                Area SCBD
              </div>
            </div>
          </div>
          <div className="flex-none flex gap-1 bg-[#F1E7DC] rounded-[13px] p-1">
            <ViewToggle active={view === 'list'} onClick={() => setView('list')} icon="list" label="Tampilan daftar" />
            <ViewToggle active={view === 'map'} onClick={() => setView('map')} icon="map" label="Tampilan peta" />
          </div>
        </div>
        <div className="flex items-center gap-2.5 bg-white rounded-[15px] px-[15px] py-3 mt-3 shadow-[0_3px_12px_rgba(35,24,15,.05)]">
          <Icon name="search" size={18} className="text-faint" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari gerobak atau makanan…"
            className="flex-1 min-w-0 border-0 outline-none bg-transparent text-sm text-ink font-sans"
          />
        </div>
        <div className="flex items-center gap-[7px] mt-2.5 pl-0.5">
          <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
          <span className="text-[13px] text-muted font-semibold">{openCount} gerobak buka sekarang</span>
        </div>
        <div className="flex gap-2 mt-[13px] overflow-x-auto no-scrollbar">
          {FILTERS.map((f) => {
            const active = filter === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={cn(
                  'flex-none px-[15px] py-[9px] rounded-full font-bold text-[13px] whitespace-nowrap transition-transform active:scale-95',
                  active ? 'bg-ink text-white' : 'bg-white text-muted',
                )}
              >
                {f.label}
              </button>
            );
          })}
        </div>
      </div>

      {view === 'list' ? (
        <div className="px-5 pt-1.5 flex flex-col gap-3">
          {visible.length === 0 ? (
            <div className="text-center text-faint text-sm py-16">Belum ada gerobak di filter ini.</div>
          ) : (
            visible.map((s, i) => {
              const badge = badgeOf(s);
              const tier = tierBadge(s);
              return (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => select(s)}
                  className={cn(
                    'w-full text-left bg-white rounded-[22px] p-3 flex gap-3.5 items-center shadow-card transition-transform active:scale-[.99]',
                    s.open ? 'cursor-pointer' : 'opacity-60 cursor-default',
                  )}
                >
                  <div
                    className="flex-none w-[82px] h-[82px] rounded-[17px] flex items-center justify-center shadow-[inset_0_-16px_28px_rgba(0,0,0,.08)] relative"
                    style={{ background: stallGradient(s, i) }}
                  >
                    <FoodGlyph cat={s.category === 'minuman' ? 'drink' : 'food'} size={34} />
                    {tier && (
                      <span
                        className="absolute -top-1.5 -left-1.5 inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-[3px] rounded-full shadow-[0_4px_9px_rgba(35,24,15,.14)] whitespace-nowrap"
                        style={{ background: tier.bg, color: tier.color }}
                      >
                        <Icon name="medal" size={10} />
                        {tier.label}
                      </span>
                    )}
                    {!s.open && (
                      <span className="absolute inset-0 bg-[rgba(35,24,15,.28)] rounded-[17px] flex items-center justify-center text-white font-extrabold text-xs">
                        Tutup
                      </span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[15px] leading-[1.2] truncate">{s.name}</div>
                    <div className="text-faint text-xs my-0.5 mb-2 flex items-center gap-1.5">
                      <span>{s.type}</span>
                      <span>·</span>
                      <span className="font-bold text-muted">{s.distance}</span>
                    </div>
                    <span className={cn('inline-flex items-center gap-1.5 font-bold text-xs px-2.5 py-1 rounded-full', badge.bg, badge.color)}>
                      {s.open && <span className={cn('w-1.5 h-1.5 rounded-full', s.queue <= 5 ? 'bg-mint-deep' : 'bg-brand-deep')} />}
                      {badge.label}
                    </span>
                  </div>
                  {s.open && <Icon name="chevron-right" size={18} className="text-[#C6B7A8]" />}
                </button>
              );
            })
          )}
        </div>
      ) : (
        <MapView stalls={visible} onOpen={select} />
      )}

      <SwitchVendorSheet
        open={!!pending}
        onClose={cancel}
        activeVendorName={activeVendorName}
        pendingVendorName={pending?.name ?? ''}
        onConfirm={confirm}
      />
    </div>
  );
}

function ViewToggle({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean;
  onClick: () => void;
  icon: 'list' | 'map';
  label: string;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        'rounded-[9px] w-[38px] h-8 flex items-center justify-center transition-transform active:scale-90',
        active ? 'bg-white text-brand-deep shadow-[0_2px_6px_rgba(35,24,15,.1)]' : 'text-faint',
      )}
    >
      <Icon name={icon} size={18} />
    </button>
  );
}

function MapView({ stalls, onOpen }: { stalls: Stall[]; onOpen: (s: Stall) => void }) {
  return (
    <div className="px-5 pt-2">
      <div className="relative h-[440px] rounded-[24px] overflow-hidden bg-[linear-gradient(160deg,#E8F5EE,#F3ECDE)] shadow-[0_6px_18px_rgba(35,24,15,.06)]">
        <svg className="absolute inset-0 w-full h-full opacity-50" viewBox="0 0 340 440" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0 120 H340 M0 300 H340 M120 0 V440 M240 0 V440" stroke="#fff" strokeWidth="14" fill="none" />
          <path d="M60 0 L200 440" stroke="#fff" strokeWidth="20" fill="none" opacity=".7" />
        </svg>
        {stalls.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onOpen(s)}
            aria-label={s.name}
            className="absolute -translate-x-1/2 -translate-y-full flex flex-col items-center transition-transform active:scale-90"
            style={{ left: s.mapX, top: s.mapY }}
          >
            <div
              className="text-white font-extrabold text-xs px-[11px] py-1.5 rounded-xl shadow-[0_6px_14px_rgba(0,0,0,.2)] whitespace-nowrap"
              style={{ background: pinColor(s) }}
            >
              {s.open ? `${s.queue} org` : 'Tutup'}
            </div>
            <div className="w-[11px] h-[11px] rotate-45 -mt-[5px] rounded-[2px]" style={{ background: pinColor(s) }} />
          </button>
        ))}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="relative w-5 h-5">
            <span className="absolute inset-0 rounded-full bg-[rgba(37,99,235,.35)] animate-ripple" />
            <span className="absolute inset-1 rounded-full bg-[#2563EB] border-2 border-white shadow-[0_2px_6px_rgba(0,0,0,.25)]" />
          </div>
          <span className="mt-[5px] bg-ink text-white text-[10px] font-bold px-2 py-[3px] rounded-full">Kamu di sini</span>
        </div>
      </div>
      <div className="text-center text-[#B8A99B] text-[11px] mt-3">Ketuk pin buat lihat gerobaknya</div>
    </div>
  );
}
