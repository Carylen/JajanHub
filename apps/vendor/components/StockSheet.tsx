'use client';
import { useVendorMenu, useSetStock, useMarkAllOut } from '@jajanhub/api';
import { BottomSheet, Button, Toggle, Icon, cn } from '@jajanhub/ui';
import { menuGradient } from '../lib/visuals';
import { FoodGlyph } from './FoodGlyph';
import { useVendorUi } from '../lib/ui-store';

/** Quick stock management overlay (BRIEF §5 vendor). */
export function StockSheet() {
  const open = useVendorUi((s) => s.stockSheetOpen);
  const close = useVendorUi((s) => s.closeStockSheet);
  const { data: menu = [] } = useVendorMenu();
  const setStock = useSetStock();
  const markAllOut = useMarkAllOut();

  const habisCount = menu.filter((m) => !m.inStock).length;

  return (
    <BottomSheet open={open} onClose={close} label="Kelola stok menu" draggable={false}>
      <div className="flex items-center justify-between mb-1">
        <div>
          <div className="font-display font-extrabold text-xl">Stok Menu</div>
          <div className="text-[13px] text-faint mt-px">
            {habisCount > 0 ? `${habisCount} menu ditandai habis` : 'Semua menu tersedia'}
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => markAllOut.mutate()}
        className="my-3 w-full bg-[#FFF1E9] text-brand-press border-[1.5px] border-[rgba(196,64,47,.22)] rounded-2xl py-3.5 font-extrabold text-[15px] flex items-center justify-center gap-2 transition-transform active:scale-[.98]"
      >
        <Icon name="warning" size={18} className="text-brand-press" strokeWidth={2} />
        Tandai Habis Semua
      </button>

      <div className="max-h-[52vh] overflow-y-auto pt-2 flex flex-col gap-[9px]">
        {menu.map((m, i) => (
          <div
            key={m.id}
            className={cn('bg-white rounded-[18px] px-3 py-[11px] flex items-center gap-3 shadow-card', !m.inStock && 'opacity-55')}
          >
            <div className="flex-none w-12 h-12 rounded-[13px] flex items-center justify-center" style={{ background: menuGradient(m.cat, i) }}>
              <FoodGlyph cat={m.cat} size={22} />
            </div>
            <div className="flex-1 min-w-0">
              <div className={cn('font-bold text-[15px] leading-[1.2]', !m.inStock && 'line-through text-faint')}>{m.name}</div>
              <div className={cn('text-xs font-bold mt-0.5', m.inStock ? 'text-mint-deep' : 'text-brand-press')}>
                {m.inStock ? 'Tersedia' : 'Stok Habis'}
              </div>
            </div>
            <Toggle
              checked={m.inStock}
              onChange={() => setStock.mutate({ itemId: m.id, inStock: !m.inStock })}
              label={`Stok ${m.name}`}
            />
          </div>
        ))}
      </div>

      <Button variant="primary" fullWidth className="mt-3.5" onClick={close}>
        Selesai
      </Button>
    </BottomSheet>
  );
}
