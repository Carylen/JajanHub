'use client';
import { Button, Spinner } from '@jajanhub/ui';

export function LoadingState({ label = 'Memuat…' }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 text-faint">
      <Spinner className="w-6 h-6" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3 px-8 text-center">
      <div className="font-display font-extrabold text-xl">Ada yang nggak beres</div>
      {message && <p className="text-faint text-sm max-w-[280px]">{message}</p>}
      {onRetry && (
        <Button variant="outline" size="md" onClick={onRetry} className="mt-2">
          Coba lagi
        </Button>
      )}
    </div>
  );
}
