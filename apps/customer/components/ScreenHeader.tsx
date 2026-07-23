'use client';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { IconButton, Icon } from '@jajanhub/ui';

export interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  /** Where the back button goes. Defaults to router.back(). */
  backHref?: string;
  onBack?: () => void;
  right?: ReactNode;
  /** Sticky translucent header (used by scrollable lists). */
  sticky?: boolean;
}

/** Standard back-chevron + title header used across customer screens. */
export function ScreenHeader({ title, subtitle, backHref, onBack, right, sticky }: ScreenHeaderProps) {
  const router = useRouter();
  const handleBack = () => {
    if (onBack) onBack();
    else if (backHref) router.push(backHref);
    else router.back();
  };
  return (
    <div
      className={
        sticky
          ? 'sticky top-0 z-[15] bg-cream/90 backdrop-blur-[10px] px-5 pt-4 pb-2.5'
          : 'px-5 pt-4 pb-1.5'
      }
    >
      <div className="flex items-center gap-3">
        <IconButton aria-label="Kembali" onClick={handleBack}>
          <Icon name="chevron-left" size={19} strokeWidth={2.2} />
        </IconButton>
        <div className="flex-1 min-w-0">
          <div className="font-display font-extrabold text-[19px] leading-none">{title}</div>
          {subtitle && <div className="text-xs text-faint mt-0.5">{subtitle}</div>}
        </div>
        {right}
      </div>
    </div>
  );
}
