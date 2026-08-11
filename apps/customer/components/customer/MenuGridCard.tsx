'use client';
import type { MenuItem } from '@jajanhub/api';
import { Icon, Money } from '@jajanhub/ui';
import { itemGradient } from '../../lib/visuals';

interface MenuGridCardProps {
  item: MenuItem;
  index: number;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}

/** Desktop catalog card — vertical layout (banner on top), distinct from
 * MenuItemCard's horizontal mobile layout. Matches Antre/Antri Desktop.dc.html. */
export function MenuGridCard({ item, index, qty, onAdd, onRemove }: MenuGridCardProps) {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-card flex flex-col">
      <div className="h-[120px] relative" style={{ background: itemGradient(item, index) }}>
        {item.isBestSeller && (
          <span className="absolute top-3 left-3 bg-[rgba(35,24,15,.82)] text-white text-[11px] font-extrabold px-2.5 py-1.5 rounded-full">
            ★ Terlaris
          </span>
        )}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="font-display font-extrabold text-[16.5px] leading-[1.2]">{item.name}</div>
        <div className="text-[13px] text-faint mt-1.5 leading-[1.4] flex-1">{item.desc}</div>
        <div className="flex items-center justify-between mt-3.5">
          <Money amount={item.priceRp} display className="text-lg text-brand-deep" />
          {qty === 0 ? (
            <button
              type="button"
              onClick={onAdd}
              className="flex items-center gap-1.5 bg-ink text-white font-extrabold text-[13.5px] px-[15px] py-2.5 rounded-xl transition-transform active:scale-95"
            >
              <Icon name="plus" size={16} strokeWidth={2.4} className="text-white" />
              Tambah
            </button>
          ) : (
            <div className="flex items-center gap-[11px] bg-[#FFF3E7] rounded-xl p-[5px]">
              <button
                type="button"
                aria-label={`Kurangi ${item.name}`}
                onClick={onRemove}
                className="w-8 h-8 rounded-lg bg-white text-brand-deep font-extrabold text-lg flex items-center justify-center shadow-[0_2px_6px_rgba(35,24,15,.08)] transition-transform active:scale-90"
              >
                −
              </button>
              <span key={qty} className="font-display font-extrabold text-[17px] min-w-[18px] text-center animate-pop">
                {qty}
              </span>
              <button
                type="button"
                aria-label={`Tambah ${item.name}`}
                onClick={onAdd}
                className="w-8 h-8 rounded-lg bg-brand text-white font-extrabold text-lg flex items-center justify-center shadow-[0_3px_8px_rgba(255,122,26,.3)] transition-transform active:scale-90"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
