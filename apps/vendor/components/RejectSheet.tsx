'use client';
import { useState } from 'react';
import { REJECT_REASONS, type RejectReasonId } from '@jajanhub/api';
import { BottomSheet, Button, Icon, cn, type IconName } from '@jajanhub/ui';

const REASON_ICON: Record<RejectReasonId, IconName> = { bahan_habis: 'box', terlalu_ramai: 'users', tutup: 'store' };

interface RejectSheetProps {
  open: boolean;
  orderNo: string;
  onClose: () => void;
  onConfirm: (reason: RejectReasonId) => void;
  pending?: boolean;
}

/** Reject-order overlay with reason picker + refund reassurance (BRIEF §5). */
export function RejectSheet({ open, orderNo, onClose, onConfirm, pending }: RejectSheetProps) {
  const [reason, setReason] = useState<RejectReasonId | ''>('');

  return (
    <BottomSheet open={open} onClose={onClose} label="Tolak pesanan">
      <div className="font-display font-extrabold text-xl">Tolak pesanan {orderNo}?</div>
      <div className="text-sm text-faint mt-1 leading-[1.5]">Nggak apa-apa, kadang emang kepepet. Pilih alasannya ya.</div>

      <div className="flex flex-col gap-[9px] mt-4">
        {REJECT_REASONS.map((r) => {
          const active = reason === r.id;
          return (
            <button
              key={r.id}
              type="button"
              onClick={() => setReason(r.id)}
              className={cn(
                'w-full text-left rounded-[16px] px-4 py-[15px] flex items-center gap-[13px] border-[1.5px] transition-transform active:scale-[.98]',
                active ? 'border-brand-deep bg-[#FFF6EE]' : 'border-line bg-white',
              )}
            >
              <span className={cn('flex-none w-[38px] h-[38px] rounded-xl flex items-center justify-center', active ? 'bg-[#FFEEDF]' : 'bg-[#F4ECE2]')}>
                <Icon name={REASON_ICON[r.id] ?? 'warning'} size={20} className="text-brand-deep" strokeWidth={2} />
              </span>
              <span className="flex-1 font-bold text-[15px]">{r.label}</span>
              <span className={cn('flex-none w-[22px] h-[22px] rounded-full border-2 flex items-center justify-center', active ? 'border-brand-deep' : 'border-[#D6C9BA]')}>
                <span className={cn('w-[11px] h-[11px] rounded-full', active ? 'bg-brand-deep' : 'bg-transparent')} />
              </span>
            </button>
          );
        })}
      </div>

      <div className="mt-4 bg-mint-soft rounded-[16px] px-[15px] py-3.5 flex items-center gap-3">
        <span className="flex-none w-[38px] h-[38px] rounded-[11px] bg-mint flex items-center justify-center">
          <Icon name="check" size={20} className="text-white" strokeWidth={2.6} />
        </span>
        <div className="flex-1 text-[13px] text-[#0E7A56] font-bold leading-[1.4]">
          Dana pelanggan otomatis dikembalikan penuh. Kamu nggak kena potongan.
        </div>
      </div>

      <Button variant="danger" fullWidth className="mt-[18px]" disabled={!reason || pending} onClick={() => reason && onConfirm(reason)}>
        {pending ? 'Memproses…' : 'Tolak & Kembalikan Dana'}
      </Button>
      <Button variant="ghost" fullWidth className="mt-2 text-faint" onClick={onClose}>
        Batal, lanjut masak
      </Button>
    </BottomSheet>
  );
}
