import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from './cn';

export type ButtonVariant =
  | 'primary'
  | 'dark'
  | 'prio'
  | 'mint'
  | 'outline'
  | 'ghost'
  | 'danger'
  | 'dangerSoft';

export type ButtonSize = 'md' | 'lg';

const VARIANTS: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-white shadow-raised',
  dark: 'bg-ink text-white shadow-[0_12px_26px_rgba(35,24,15,.34)]',
  prio: 'bg-prio text-white shadow-[0_12px_26px_rgba(122,59,245,.36)]',
  mint: 'bg-mint text-white shadow-[0_12px_26px_rgba(22,199,132,.34)]',
  outline: 'bg-card text-ink border-[1.5px] border-line shadow-card',
  ghost: 'bg-transparent text-faint',
  danger: 'bg-danger text-white shadow-[0_12px_26px_rgba(229,72,77,.3)]',
  dangerSoft: 'bg-danger-soft text-danger',
};

const SIZES: Record<ButtonSize, string> = {
  md: 'px-4 py-3.5 text-sm rounded-2xl',
  lg: 'px-4 py-[17px] text-base rounded-[18px]',
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/**
 * Shared button used across both apps. Encodes the design's press affordance
 * (`active:scale-[.97]`) and the common variants derived from the design files.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'lg', fullWidth, className, type = 'button', ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-extrabold cursor-pointer',
        'transition-transform active:scale-[.97] disabled:opacity-60 disabled:cursor-not-allowed',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    />
  );
});
