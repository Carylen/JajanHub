'use client';
import { useEffect } from 'react';

/**
 * Escape-to-close + body-scroll-lock, shared by every overlay primitive
 * ({@link BottomSheet}, {@link Modal}). Extracted so both stay in sync
 * instead of drifting independently.
 */
export function useOverlayBehavior(open: boolean, onClose: () => void): void {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);
}
