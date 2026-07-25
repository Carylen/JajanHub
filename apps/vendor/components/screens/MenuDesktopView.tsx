'use client';
import { useVendorMenu, useSetStock, useMarkAllOut } from '@jajanhub/api';
import { Toggle, cn } from '@jajanhub/ui';
import { VendorTopBar } from '../VendorTopBar';
import { LoadingState, ErrorState } from '../StateViews';
import { menuGradient } from '../../lib/visuals';
import { FoodGlyph } from '../FoodGlyph';

/** Desktop Kelola Menu — 3-col grid matching Antre/Antri Pedagang Desktop.dc.html. */
export function MenuDesktopView() {
  const { data: menu, isLoading, isError, refetch } = useVendorMenu();
  const setStock = useSetStock();
  const markAllOut = useMarkAllOut();

  return (
    <>
      <VendorTopBar title="Kelola Menu" sub="Atur ketersediaan menu secara real-time" />
      <div className="p-[28px_34px_44px] flex flex-col gap-[18px] animate-screen-in">
        {isLoading ? (
          <LoadingState />
        ) : isError || !menu ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <>
            <div className="flex items-center gap-3.5 bg-white rounded-2xl px-[18px] py-3.5 shadow-card">
              <div className="flex-1">
                <div className="font-bold text-[15px]">
                  {menu.filter((m) => m.inStock).length} dari {menu.length} menu tersedia
                </div>
                <div className="text-[13px] text-faint">Matikan menu yang habis biar pelanggan nggak salah pesan</div>
              </div>
              <button
                type="button"
                onClick={() => markAllOut.mutate()}
                className="border border-[#F0D9D3] bg-[#FFF1E9] text-brand-press font-bold text-[13.5px] px-4 py-[11px] rounded-xl transition-transform active:scale-[.97]"
              >
                Tandai habis semua
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {menu.map((m, i) => (
                <div
                  key={m.id}
                  className={cn('bg-white rounded-2xl p-4 shadow-card flex items-center gap-3.5', !m.inStock && 'opacity-[.55]')}
                >
                  <div className="flex-none w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: menuGradient(m.cat, i) }}>
                    <FoodGlyph cat={m.cat} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={cn('font-bold text-[15px] leading-[1.2]', !m.inStock && 'line-through text-faint')}>{m.name}</div>
                    <div className="text-[13px] text-faint mt-[3px]">
                      Rp{m.price.toLocaleString('id-ID')} ·{' '}
                      <span className={cn('font-bold', m.inStock ? 'text-mint-deep' : 'text-brand-press')}>
                        {m.inStock ? 'Tersedia' : 'Stok Habis'}
                      </span>
                    </div>
                  </div>
                  <Toggle checked={m.inStock} onChange={() => setStock.mutate({ itemId: m.id, inStock: !m.inStock })} label={`Stok ${m.name}`} />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}
