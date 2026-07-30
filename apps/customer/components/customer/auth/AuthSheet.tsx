'use client';
import { BottomSheet } from '@jajanhub/ui';
import { AuthBody } from './AuthBody';
import type { AuthFlowProps } from './AuthProvider';

/** Mobile login sheet — matches Antre/Antri.dc.html's `isAuth` screen. */
export function AuthSheet(props: AuthFlowProps) {
  const { open, step, onClose } = props;
  return (
    <BottomSheet open={open} onClose={onClose} label="Masuk ke akun" draggable={step !== 'ok'}>
      {step !== 'ok' && (
        <div className="flex justify-center gap-2 mb-4">
          <span className="w-6 h-1.5 rounded-full bg-brand" />
          <span className={`w-6 h-1.5 rounded-full transition-colors ${step === 'otp' ? 'bg-brand' : 'bg-line'}`} />
        </div>
      )}
      <AuthBody {...props} />
    </BottomSheet>
  );
}
