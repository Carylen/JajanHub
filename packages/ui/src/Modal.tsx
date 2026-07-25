'use client';
import type { ReactNode } from 'react';
import { cn } from './cn';
import { useOverlayBehavior } from './useOverlayBehavior';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Accessible label for the dialog. */
  label: string;
  /** Fixed card width. Defaults to 420px (desktop Pay/Cancel per design spec). */
  width?: string;
  className?: string;
}

/**
 * Centered, fixed-width overlay for desktop (Pay/Cancel/Verify/Reject/etc.).
 * Counterpart to {@link BottomSheet} for mobile — same backdrop/Escape/
 * scroll-lock/backdrop-click behavior via {@link useOverlayBehavior}, but a
 * scale+fade `modalIn` entrance instead of a bottom slide, and no
 * drag-to-dismiss (that's a mobile-sheet-only affordance).
 *
 * Not to be confused with `RatingModal` (apps/customer) — that's a
 * pre-existing `BottomSheet` wrapper despite its name, unrelated to this
 * primitive.
 *
 * The backdrop is a plain `fixed inset-0` — it relies on an ancestor
 * (AppShell's content wrapper) establishing a CSS containing block for
 * `position: fixed` descendants (any `transform` does this per spec), so the
 * backdrop fills the app's content column instead of the full browser
 * viewport once a sidebar is present. Without that ancestor this covers the
 * whole window, which is still acceptable (just dims the sidebar too).
 */
export function Modal({ open, onClose, children, label, width = '420px', className }: ModalProps) {
  useOverlayBehavior(open, onClose);

  if (!open) return null;

  return (
    <div
      role="presentation"
      onClick={onClose}
      className="fixed inset-0 z-[60] bg-[rgba(23,15,8,.55)] backdrop-blur-[3px] flex items-center justify-center p-5 animate-fade-in"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: width }}
        className={cn('w-full bg-cream rounded-3xl p-6 shadow-soft animate-[modalIn_.22s_ease]', className)}
      >
        {children}
      </div>
    </div>
  );
}
