'use client';
import { useState } from 'react';
import { CANCEL_REASONS, type CancelReason } from '@jajanhub/api';
import { Modal, Icon, cn } from '@jajanhub/ui';

interface CancelModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: CancelReason) => void;
  pending?: boolean;
}

/**
 * Desktop cancel confirmation — matches Antre/Antri Desktop.dc.html's cancel
 * modal (radio-style reason picker, reason required to confirm — a real
 * difference from mobile's CancelSheet, which treats the reason as
 * optional; both wrap the same shared confirmCancel from useQueueScreen).
 * The reference's own inline "cancelled" success state is intentionally not
 * reproduced here: this app already has a fuller refund-tracking route
 * (`/order/[id]/refund`, staged via subscribeRefund) that confirmCancel
 * navigates to — duplicating a second, simpler "done" state in the modal
 * would fork that logic instead of reusing it.
 */
export function CancelModal({ open, onClose, onConfirm, pending }: CancelModalProps) {
  const [reason, setReason] = useState<CancelReason | ''>('');

  return (
    <Modal open={open} onClose={onClose} label="Batalkan pesanan">
      <div className="font-display font-extrabold text-[22px]">Batalkan pesanan?</div>
      <div className="text-sm text-faint mt-[5px] leading-[1.5]">
        Dana kamu akan dikembalikan penuh ke metode pembayaran. Pilih alasannya:
      </div>

      <div className="flex flex-col gap-2.5 my-5">
        {CANCEL_REASONS.map((r) => {
          const selected = reason === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setReason(r.id)}
              className={cn(
                'text-left flex items-center gap-3 border-2 rounded-2xl px-4 py-3.5 transition-transform active:scale-[.98]',
                selected ? 'border-brand-press bg-[#FBEEE9]' : 'border-line bg-white',
              )}
            >
              <span className="flex-1 font-bold text-[15px]">{r.label}</span>
              {selected && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="#C4402F" />
                  <path d="M8 12l3 3 5-6" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex gap-2.5">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-[14px] py-[15px] font-extrabold text-[15px] bg-[#F1E7DC] text-ink transition-transform active:scale-[.98]"
        >
          Nggak jadi
        </button>
        <button
          type="button"
          disabled={!reason || pending}
          onClick={() => reason && onConfirm(reason)}
          className={cn(
            'flex-[1.4] rounded-[14px] py-[15px] font-extrabold text-[15px] text-white transition-transform active:scale-[.98] disabled:cursor-not-allowed',
            reason ? 'bg-brand-press' : 'bg-[#E0B5AD]',
          )}
        >
          {pending ? (
            'Memproses…'
          ) : (
            <span className="inline-flex items-center gap-1.5">
              <Icon name="cart-arrow" size={16} className="text-white" strokeWidth={2.2} />
              Batalkan & refund
            </span>
          )}
        </button>
      </div>
    </Modal>
  );
}
