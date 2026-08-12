'use client';
import { useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cn } from './cn';
import { useOverlayBehavior } from './useOverlayBehavior';

export interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Accessible label for the dialog. */
  label: string;
  /** Allow dragging the sheet down to dismiss (default true). */
  draggable?: boolean;
  className?: string;
}

/**
 * Reusable bottom sheet backing every sheet/overlay in the app (BRIEF §5):
 * backdrop fade-in, `sheetUp` slide, Escape-to-close, body-scroll lock, and
 * optional drag-to-dismiss. Constrained to the app column width.
 *
 * Portaled to `document.body`: AppShell's content wrapper carries a
 * `transform` (see its doc comment) so it becomes the containing block for
 * `position: fixed` descendants — but that containing block's height is its
 * own (scrollable) content height, not the viewport, so `inset-y-0` spans
 * the whole page rather than the visible screen on any route taller than one
 * viewport (e.g. Beranda's vendor list). The portal escapes that ancestor so
 * `fixed` means the actual viewport again, which is what every sheet needs.
 */
export function BottomSheet({
  open,
  onClose,
  children,
  label,
  draggable = true,
  className,
}: BottomSheetProps) {
  const [dragY, setDragY] = useState(0);
  const startY = useRef<number | null>(null);

  useOverlayBehavior(open, onClose);

  if (!open) return null;

  const onPointerDown = (e: React.PointerEvent) => {
    if (!draggable) return;
    startY.current = e.clientY;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (startY.current === null) return;
    setDragY(Math.max(0, e.clientY - startY.current));
  };
  const onPointerUp = () => {
    if (startY.current === null) return;
    if (dragY > 120) onClose();
    setDragY(0);
    startY.current = null;
  };

  return createPortal(
    <div
      role="presentation"
      onClick={onClose}
      className="fixed left-1/2 -translate-x-1/2 inset-y-0 w-full max-w-app z-[60] bg-[rgba(23,15,8,.55)] backdrop-blur-[3px] flex flex-col justify-end animate-fade-in"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={label}
        onClick={(e) => e.stopPropagation()}
        style={dragY ? { transform: `translateY(${dragY}px)` } : undefined}
        className={cn(
          'bg-cream rounded-t-[28px] px-5 pt-3 pb-7 animate-sheet-up',
          !dragY && 'transition-transform',
          className,
        )}
      >
        <button
          type="button"
          aria-label="Tutup"
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onClick={onClose}
          className="block w-11 h-[5px] rounded-full bg-[#E0D4C4] mx-auto mb-4 cursor-grab touch-none border-0 p-0"
        />
        {children}
      </div>
    </div>,
    document.body,
  );
}
