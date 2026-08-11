'use client';
import type { MenuItem } from '@jajanhub/api';
import { Money } from '@jajanhub/ui';
import { itemGradient } from '../../lib/visuals';
import { FoodGlyph } from './FoodGlyph';
import { QtyStepper } from './QtyStepper';

interface MenuItemCardProps {
  item: MenuItem;
  index: number;
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
}

export function MenuItemCard({ item, index, qty, onAdd, onRemove }: MenuItemCardProps) {
  return (
    <div className="bg-white rounded-[22px] p-3 flex gap-[14px] items-center shadow-card">
      <div
        className="flex-none w-[86px] h-[86px] rounded-[17px] flex items-center justify-center relative shadow-[inset_0_-18px_30px_rgba(0,0,0,.08)]"
        style={{ background: itemGradient(item, index) }}
      >
        {item.isBestSeller && (
          <span className="absolute -top-[7px] -left-1.5 bg-[#FF3D57] text-white text-[10px] font-extrabold px-[9px] py-[3px] rounded-full shadow-[0_4px_9px_rgba(255,61,87,.42)] whitespace-nowrap">
            Terlaris
          </span>
        )}
        <FoodGlyph cat={item.cat} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-bold text-[15px] leading-[1.2]">{item.name}</div>
        <div className="text-faint text-xs my-0.5 mb-[9px] leading-[1.3]">{item.desc}</div>
        <Money amount={item.priceRp} display className="font-bold text-brand-deep text-base" />
      </div>
      <div className="flex-none">
        <QtyStepper qty={qty} onAdd={onAdd} onRemove={onRemove} name={item.name} />
      </div>
    </div>
  );
}
