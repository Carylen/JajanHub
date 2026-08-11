'use client';
import { useState } from 'react';
import { REJECT_REASONS, type RejectReasonId } from '@jajanhub/api';
import { Modal, Icon, cn, type IconName } from '@jajanhub/ui';

const REASON_ICON: Record<RejectReasonId, IconName> = { bahan_habis: 'box', terlalu_ramai: 'users', tutup: 'store' };

interface RejectModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: RejectReasonId) => void;
  pending?: boolean;
}

/** Desktop counterpart to RejectSheet — matches Antre/Antri Pedagang
 * Desktop.dc.html's reject modal (icon + checkmark-circle radio style). */
export function RejectModal({ open, onClose, onConfirm, pending }: RejectModalProps) {
  const [reason, setReason] = useState<RejectReasonId | ''>('');

  return (
    <Modal open={open} onClose={onClose} label="Tolak pesanan">
      <div className="font-display font-extrabold text-[22px]">Tolak pesanan ini?</div>
      <div className="text-sm text-faint mt-[5px] leading-[1.5]">
        Pelanggan langsung dapat notifikasi & dananya otomatis dikembalikan penuh.
      </div>

      <div className="flex flex-col gap-2.5 my-5">
        {REJECT_REASONS.map((r) => {
          const selected = reason === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setReason(r.id)}
              className={cn(
                'text-left flex items-center gap-[13px] border-2 rounded-2xl px-4 py-3.5 transition-transform active:scale-[.98]',
                selected ? 'border-brand-deep bg-[#FFF6EE]' : 'border-line bg-white',
              )}
            >
              <Icon name={REASON_ICON[r.id] ?? 'warning'} size={20} className="text-brand-deep flex-none" strokeWidth={2} />
              <span className="flex-1 font-bold text-[15px] text-ink">{r.label}</span>
              {selected && (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle cx="12" cy="12" r="10" fill="#E4560A" />
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
          Batal
        </button>
        <button
          type="button"
          disabled={!reason || pending}
          onClick={() => reason && onConfirm(reason)}
          className={cn(
            'flex-[1.4] rounded-[14px] py-[15px] font-extrabold text-[15px] text-white transition-transform active:scale-[.98] disabled:cursor-not-allowed',
            reason ? 'bg-danger' : 'bg-[#E0B5AD]',
          )}
        >
          {pending ? 'Memproses…' : 'Tolak & kembalikan dana'}
        </button>
      </div>
    </Modal>
  );
}
