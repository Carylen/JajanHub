'use client';
import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Warung } from '@jajanhub/api';
import { Chip, Icon, Money } from '@jajanhub/ui';
import { ScreenHeader } from '../ScreenHeader';
import { useCartStore, cartCount } from '../../lib/cart-store';
import { computeTotals } from '../../lib/pricing';
import { MenuItemCard } from './MenuItemCard';

type Filter = 'all' | 'best' | 'food' | 'drink';

const FILTERS: Array<{ value: Filter; label: string }> = [
  { value: 'all', label: 'Semua' },
  { value: 'best', label: 'Terlaris' },
  { value: 'food', label: 'Makanan' },
  { value: 'drink', label: 'Minuman' },
];

export function Menu({ warung, onBack }: { warung: Warung; onBack: () => void }) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');
  const items = useCartStore((s) => s.items);
  const add = useCartStore((s) => s.add);
  const remove = useCartStore((s) => s.remove);

  const count = cartCount(items);
  const { subtotal } = useMemo(
    () => computeTotals(warung.menu, items, false),
    [warung.menu, items],
  );

  const visible = warung.menu.filter((m) =>
    filter === 'all' ? true : filter === 'best' ? m.best : m.cat === filter,
  );

  return (
    <div>
      <div className="animate-screen-in pb-[120px]">
        <ScreenHeader title="Menu" subtitle={warung.name} onBack={onBack} sticky />
        <div className="px-5 -mt-1 pb-2.5 sticky top-[62px] z-[14] bg-cream/90 backdrop-blur-[10px]">
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {FILTERS.map((f) => (
              <Chip key={f.value} active={filter === f.value} tone="ink" onClick={() => setFilter(f.value)}>
                {f.label}
              </Chip>
            ))}
          </div>
        </div>

        <div className="px-5 pt-1.5 flex flex-col gap-3">
          {visible.length === 0 ? (
            <div className="text-center text-faint text-sm py-16">
              Belum ada menu di kategori ini.
            </div>
          ) : (
            visible.map((item) => {
              const index = warung.menu.indexOf(item);
              return (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  index={index}
                  qty={items[item.id] ?? 0}
                  onAdd={() => add(item.id)}
                  onRemove={() => remove(item.id)}
                />
              );
            })
          )}
        </div>
      </div>

      {count > 0 && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-4 w-full max-w-app px-4 z-30 animate-screen-in">
          <button
            type="button"
            onClick={() => router.push(`/w/${warung.id}/cart`)}
            className="w-full bg-ink text-white rounded-[19px] pl-[14px] pr-4 py-[14px] flex items-center justify-between shadow-[0_14px_30px_rgba(35,24,15,.34)] transition-transform active:scale-[.98]"
          >
            <span className="flex items-center gap-[11px]">
              <span
                key={count}
                className="bg-brand w-[30px] h-[30px] rounded-[10px] flex items-center justify-center font-extrabold text-sm animate-pop"
              >
                {count}
              </span>
              <span className="font-bold text-[15px]">Lihat Keranjang</span>
            </span>
            <span className="flex items-center gap-2">
              <Money amount={subtotal} display key={subtotal} className="font-bold text-base animate-pop" />
              <Icon name="chevron-right" size={17} strokeWidth={2.2} className="text-white" />
            </span>
          </button>
        </div>
      )}
    </div>
  );
}
