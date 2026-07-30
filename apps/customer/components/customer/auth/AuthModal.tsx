'use client';
import { Icon, Modal } from '@jajanhub/ui';
import { AuthBody } from './AuthBody';
import type { AuthFlowProps } from './AuthProvider';

/** Desktop login modal — matches Antre/Antri Desktop.dc.html's `authOpen` modal. */
export function AuthModal(props: AuthFlowProps) {
  const { open, step, onClose } = props;
  return (
    <Modal open={open} onClose={onClose} label="Masuk ke akun" width="460px">
      {step !== 'ok' && (
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <span className="w-[26px] h-1.5 rounded-full bg-brand" />
            <span className={`w-[26px] h-1.5 rounded-full transition-colors ${step === 'otp' ? 'bg-brand' : 'bg-line'}`} />
          </div>
          <button
            type="button"
            aria-label="Tutup"
            onClick={onClose}
            className="w-[34px] h-[34px] rounded-[11px] bg-[#F1E7DC] text-muted flex items-center justify-center transition-transform active:scale-95"
          >
            <Icon name="x" size={15} strokeWidth={2.4} />
          </button>
        </div>
      )}
      <AuthBody {...props} />
    </Modal>
  );
}
