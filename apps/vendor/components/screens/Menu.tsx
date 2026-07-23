'use client';
import { useVendorMenu, useSetStock } from '@jajanhub/api';
import { Card, Icon, Money, Toggle, cn } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { menuGradient } from '../../lib/visuals';
import { FoodGlyph } from '../FoodGlyph';

export function Menu() {
  const { data: menu, isLoading, isError, refetch } = useVendorMenu();
  const setStock = useSetStock();

  if (isLoading) return <LoadingState />;
  if (isError || !menu) return <ErrorState onRetry={() => refetch()} />;

  const activeCount = menu.filter((m) => m.inStock).length;

  return (
    <div className="animate-screen-in">
      <div className="px-[22px] pt-[22px] pb-1.5 flex items-center justify-between">
        <div>
          <div className="font-display font-extrabold text-2xl tracking-[-.5px]">Kelola Menu</div>
          <div className="text-[13px] text-faint mt-0.5">{activeCount} menu aktif</div>
        </div>
        <button
          type="button"
          className="bg-brand text-white font-extrabold text-sm px-4 py-[11px] rounded-[14px] flex items-center gap-1.5 shadow-[0_8px_18px_rgba(255,122,26,.3)] transition-transform active:scale-95"
        >
          <Icon name="plus" size={17} className="text-white" strokeWidth={2.6} />
          Tambah
        </button>
      </div>

      <div className="px-5 pt-3.5 flex flex-col gap-[11px]">
        {menu.map((m, i) => (
          <Card key={m.id} className={cn('p-3 flex items-center gap-[13px] shadow-[0_4px_14px_rgba(35,24,15,.05)]', !m.inStock && 'opacity-[.55]')}>
            <div className="flex-none w-14 h-14 rounded-[15px] flex items-center justify-center" style={{ background: menuGradient(m.cat, i) }}>
              <FoodGlyph cat={m.cat} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-[15px] leading-[1.2]">{m.name}</div>
              <Money amount={m.price} display className="text-brand-deep text-[15px] mt-[3px] block" />
              <div className={cn('text-xs font-bold mt-[3px]', m.inStock ? 'text-mint-deep' : 'text-brand-press')}>
                {m.inStock ? 'Tersedia' : 'Stok Habis'}
              </div>
            </div>
            <Toggle checked={m.inStock} onChange={() => setStock.mutate({ itemId: m.id, inStock: !m.inStock })} label={`Stok ${m.name}`} />
          </Card>
        ))}
      </div>
    </div>
  );
}
