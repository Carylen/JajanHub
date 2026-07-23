import { cn } from './cn';
import { formatRupiah } from './format';

export interface MoneyProps {
  amount: number | null | undefined;
  className?: string;
  /** Render the display font (Bricolage) used for prices/totals in the design. */
  display?: boolean;
}

/** Consistent Rupiah rendering across both apps. */
export function Money({ amount, className, display }: MoneyProps) {
  return (
    <span className={cn(display && 'font-display tabular-nums', className)}>
      {formatRupiah(amount)}
    </span>
  );
}
