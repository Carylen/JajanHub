'use client';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
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
 * Portaled to `document.body` for the same reason as {@link BottomSheet}:
 * `fixed inset-0` inside AppShell's transformed content wrapper spans that
 * wrapper's own (scrollable) content height rather than the viewport on any
 * route taller than one screen, pushing the backdrop off-screen. Escaping
 * via the portal means this always covers the actual viewport (dimming the
 * sidebar too) — which this doc comment already treated as an acceptable
 * fallback before the portal made it the only behavior.
 */
export function Modal({ open, onClose, children, label, width = '420px', className }: ModalProps) {
  useOverlayBehavior(open, onClose);

  if (!open) return null;

  return createPortal(
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
    </div>,
    document.body,
  );
}
