import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from './cn';

export type IconButtonTone = 'card' | 'translucent' | 'brand';

const TONES: Record<IconButtonTone, string> = {
  card: 'bg-card text-ink shadow-[0_3px_10px_rgba(35,24,15,.07)]',
  translucent: 'bg-white/16 text-white',
  brand: 'bg-[#FFEEDF] text-brand',
};

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  tone?: IconButtonTone;
  /** Required for icon-only buttons — accessibility (BRIEF §8). */
  'aria-label': string;
}

/** 40×40 rounded icon button, e.g. the back chevrons throughout the design. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { tone = 'card', className, type = 'button', children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'flex-none w-10 h-10 rounded-[13px] flex items-center justify-center cursor-pointer',
        'transition-transform active:scale-90',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
        TONES[tone],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
});
