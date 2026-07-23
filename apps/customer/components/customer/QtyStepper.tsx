'use client';
import { Icon } from '@jajanhub/ui';

interface QtyStepperProps {
  qty: number;
  onAdd: () => void;
  onRemove: () => void;
  name: string;
  /** Compact variant used in the cart list. */
  size?: 'md' | 'sm';
}

/**
 * Add / quantity stepper. Collapses to a single "+" button at qty 0, expands to
 * −/count/+ once the item is in the cart (design behavior).
 */
export function QtyStepper({ qty, onAdd, onRemove, name, size = 'md' }: QtyStepperProps) {
  if (qty === 0) {
    return (
      <button
        type="button"
        aria-label={`Tambah ${name}`}
        onClick={onAdd}
        className="w-[42px] h-[42px] rounded-[14px] bg-[#FFEEDF] text-brand flex items-center justify-center transition-transform active:scale-[.85]"
      >
        <Icon name="plus" size={20} strokeWidth={2.4} />
      </button>
    );
  }
  const btn = size === 'sm' ? 'w-7 h-7 rounded-[9px]' : 'w-8 h-8 rounded-[10px]';
  const wrap = size === 'sm' ? 'gap-1.5 rounded-xl p-1' : 'gap-1.5 rounded-[14px] p-[5px]';
  return (
    <div className={`flex items-center bg-[#FFEEDF] ${wrap}`}>
      <button
        type="button"
        aria-label={`Kurangi ${name}`}
        onClick={onRemove}
        className={`${btn} bg-white text-brand flex items-center justify-center shadow-[0_2px_5px_rgba(0,0,0,.06)] transition-transform active:scale-[.85]`}
      >
        <Icon name="minus" size={size === 'sm' ? 15 : 17} strokeWidth={2.4} />
      </button>
      <span
        key={qty}
        className="font-extrabold text-ink min-w-[18px] text-center animate-pop"
        aria-live="polite"
      >
        {qty}
      </span>
      <button
        type="button"
        aria-label={`Tambah ${name}`}
        onClick={onAdd}
        className={`${btn} bg-brand text-white flex items-center justify-center shadow-[0_3px_8px_rgba(255,122,26,.4)] transition-transform active:scale-[.85]`}
      >
        <Icon name="plus" size={size === 'sm' ? 15 : 17} strokeWidth={2.4} />
      </button>
    </div>
  );
}
