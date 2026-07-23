'use client';
import { SLOTS } from '@jajanhub/api';
import { Card, Icon, cn } from '@jajanhub/ui';
import { useCartStore, type PickupMode } from '../../lib/cart-store';

/** "Ambil Sekarang / Pesan untuk Nanti" segmented control + slot picker. */
export function PickupPicker() {
  const mode = useCartStore((s) => s.pickupMode);
  const slot = useCartStore((s) => s.pickupSlot);
  const setMode = useCartStore((s) => s.setPickupMode);
  const setSlot = useCartStore((s) => s.setPickupSlot);

  const chosen = SLOTS.find((s) => s.time === slot);
  const hasSlot = mode === 'later' && !!slot && !chosen?.full;

  const tab = (value: PickupMode, label: string) => {
    const active = mode === value;
    return (
      <button
        type="button"
        onClick={() => setMode(value)}
        className={cn(
          'flex-1 rounded-[11px] py-3 font-bold text-sm transition-all active:scale-[.97]',
          active ? 'bg-white text-brand-deep shadow-[0_3px_8px_rgba(35,24,15,.08)]' : 'text-faint',
        )}
      >
        {label}
      </button>
    );
  };

  return (
    <Card className="mt-[14px] p-4">
      <div className="font-extrabold text-sm mb-3">Waktu pengambilan</div>
      <div className="flex gap-1.5 bg-[#F4ECE2] rounded-[15px] p-[5px]">
        {tab('now', 'Ambil Sekarang')}
        {tab('later', 'Pesan untuk Nanti')}
      </div>

      {mode === 'later' && (
        <div className="mt-[15px]">
          <div className="text-xs text-faint font-semibold mb-2.5">Pilih slot jam makan siang</div>
          <div className="flex gap-[9px] overflow-x-auto no-scrollbar py-0.5">
            {SLOTS.map((s) => {
              const selected = slot === s.time && !s.full;
              return (
                <button
                  key={s.time}
                  type="button"
                  disabled={s.full}
                  onClick={() => setSlot(s.time)}
                  className={cn(
                    'flex-none rounded-[15px] px-2 pt-[11px] pb-[9px] min-w-[76px] text-center border-[1.5px] transition-transform active:scale-95',
                    s.full
                      ? 'bg-[#F4ECE2] border-line opacity-60 cursor-not-allowed'
                      : selected
                        ? 'bg-[#FFEEDF] border-brand'
                        : 'bg-white border-line',
                  )}
                >
                  <div
                    className={cn(
                      'font-display font-extrabold text-[19px] leading-none',
                      s.full ? 'text-[#B8A99B]' : selected ? 'text-brand-deep' : 'text-ink',
                    )}
                  >
                    {s.time}
                  </div>
                  <div
                    className={cn(
                      'text-[10px] font-bold mt-1 h-3',
                      s.full ? 'text-brand-press' : s.left ? 'text-[#B8791F]' : 'text-transparent',
                    )}
                  >
                    {s.full ? 'Penuh' : s.left ? `Sisa ${s.left}` : ''}
                  </div>
                </button>
              );
            })}
          </div>

          {hasSlot && (
            <div className="mt-[13px] bg-mint-soft rounded-[15px] px-[15px] py-[13px] flex items-center gap-[11px]">
              <Icon name="check-circle" size={20} className="text-mint" strokeWidth={2.4} />
              <div className="font-bold text-sm text-[#0E7A56]">Pesananmu siap diambil jam {slot}</div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
