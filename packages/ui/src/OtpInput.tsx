'use client';
import { useEffect, useRef } from 'react';
import { cn } from './cn';

export interface OtpInputProps {
  length?: number;
  values: string[];
  onChange: (next: string[]) => void;
  /** Fired once every box holds a digit. */
  onComplete?: (code: string) => void;
  error?: boolean;
  /** Focus the first box on mount (e.g. entering the OTP step). */
  autoFocus?: boolean;
}

/**
 * 6-box OTP entry: numeric-only, auto-advances on input, backspace jumps to
 * the previous box when the current one is already empty. Shared by the
 * mobile sheet and desktop modal login flows.
 */
export function OtpInput({ length = 6, values, onChange, onComplete, error, autoFocus }: OtpInputProps) {
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus]);

  const setDigit = (i: number, raw: string) => {
    const digit = raw.replace(/\D/g, '').slice(-1);
    const next = values.slice();
    next[i] = digit;
    onChange(next);
    if (digit && i < length - 1) refs.current[i + 1]?.focus();
    if (onComplete && next.every((v) => v !== '')) onComplete(next.join(''));
  };

  const onKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !values[i] && i > 0) refs.current[i - 1]?.focus();
  };

  return (
    <div className="flex gap-2.5 justify-between">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          value={values[i] ?? ''}
          onChange={(e) => setDigit(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          inputMode="numeric"
          maxLength={1}
          aria-label={`Digit ${i + 1}`}
          className={cn(
            'w-full h-[60px] rounded-[15px] border-2 text-center font-display font-extrabold text-[26px] text-ink bg-white outline-none focus:border-brand',
            error ? 'border-danger/40' : 'border-line',
          )}
        />
      ))}
    </div>
  );
}
