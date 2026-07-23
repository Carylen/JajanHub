'use client';
import type { ReactNode } from 'react';
import { Button, Spinner } from '@jajanhub/ui';

/** Centered full-screen loading state. */
export function LoadingState({ label = 'Memuat…' }: { label?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-faint">
      <Spinner className="w-6 h-6" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

/** Centered error state with retry. */
export function ErrorState({
  title = 'Ada yang nggak beres',
  message,
  onRetry,
}: {
  title?: string;
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-3 px-8 text-center">
      <div className="font-display font-extrabold text-xl">{title}</div>
      {message && <p className="text-faint text-sm max-w-[280px]">{message}</p>}
      {onRetry && (
        <Button variant="outline" size="md" onClick={onRetry} className="mt-2">
          Coba lagi
        </Button>
      )}
    </div>
  );
}

/** Generic empty state. */
export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 px-8 py-20 text-center">
      <div className="font-display font-extrabold text-lg">{title}</div>
      {children && <p className="text-faint text-sm max-w-[280px]">{children}</p>}
    </div>
  );
}
