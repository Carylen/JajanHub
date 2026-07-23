import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from './cn';

/** White rounded card with the design's soft shadow. */
export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-card rounded-[22px] shadow-card', className)} {...props} />;
}

export interface ChipProps {
  active?: boolean;
  onClick?: () => void;
  children: ReactNode;
  /** Accent color used when active. Defaults to brand. */
  tone?: 'brand' | 'ink';
  className?: string;
}

/** Pill filter/selection chip (menu filters, rating chips, cancel reasons). */
export function Chip({ active, onClick, children, tone = 'brand', className }: ChipProps) {
  const activeCls =
    tone === 'ink'
      ? 'bg-ink text-white'
      : 'bg-[#FFEEDF] text-brand-deep border-brand';
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex-none cursor-pointer px-[15px] py-[9px] rounded-full font-bold text-[13px] whitespace-nowrap',
        'border-[1.5px] transition-transform active:scale-95',
        active ? activeCls : 'bg-card text-muted border-line',
        className,
      )}
    >
      {children}
    </button>
  );
}

export interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  /** Track color when on. Defaults to brand. */
  tone?: 'brand' | 'prio';
  label: string;
}

/** iOS-style switch used for priority + notification toggles. */
export function Toggle({ checked, onChange, tone = 'brand', label }: ToggleProps) {
  return (
    <span
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation();
        onChange();
      }}
      className={cn(
        'flex-none w-[46px] h-[27px] rounded-full relative transition-colors',
        checked ? (tone === 'prio' ? 'bg-prio' : 'bg-brand') : 'bg-[#DDD2C4]',
      )}
    >
      <span
        className="absolute top-[3px] w-[21px] h-[21px] rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,.2)] transition-[left]"
        style={{ left: checked ? '22px' : '3px' }}
      />
    </span>
  );
}

/** Spinning ring used for loading states. */
export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block w-4 h-4 rounded-full border-2 border-[#FFE0C4] border-t-brand animate-spin',
        className,
      )}
    />
  );
}
