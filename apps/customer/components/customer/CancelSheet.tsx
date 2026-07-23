'use client';
import { useState } from 'react';
import { CANCEL_REASONS } from '@jajanhub/api';
import { BottomSheet, Button, Chip, Money, Icon } from '@jajanhub/ui';

interface CancelSheetProps {
  open: boolean;
  onClose: () => void;
  refundAmount: number;
  onConfirm: (reason: string) => void;
  pending?: boolean;
}

/** Bottom-sheet confirmation for cancelling an order (BRIEF §5). */
export function CancelSheet({ open, onClose, refundAmount, onConfirm, pending }: CancelSheetProps) {
  const [reason, setReason] = useState('');

  return (
    <BottomSheet open={open} onClose={onClose} label="Batalkan pesanan">
      <div className="font-display font-extrabold text-xl">Batalkan pesanan?</div>
      <div className="text-sm text-faint mt-1 leading-[1.5]">Boleh cerita alasannya? (opsional)</div>

      <div className="flex flex-wrap gap-[9px] mt-4">
        {CANCEL_REASONS.map((r) => (
          <Chip key={r} active={reason === r} onClick={() => setReason(reason === r ? '' : r)}>
            {r}
          </Chip>
        ))}
      </div>

      <div className="mt-[18px] bg-mint-soft rounded-2xl px-[15px] py-3.5 flex items-center gap-3">
        <span className="flex-none w-[38px] h-[38px] rounded-[11px] bg-mint flex items-center justify-center">
          <Icon name="cart-arrow" size={20} className="text-white" strokeWidth={2.2} />
        </span>
        <div className="flex-1">
          <div className="font-extrabold text-sm text-[#0E7A56]">
            Dana kembali penuh <Money amount={refundAmount} />
          </div>
          <div className="text-xs text-[#3FA980] mt-px">Balik ke QRIS/e-wallet dalam 1–3 hari kerja</div>
        </div>
      </div>

      <Button
        variant="danger"
        fullWidth
        className="mt-[18px]"
        disabled={pending}
        onClick={() => onConfirm(reason)}
      >
        {pending ? 'Membatalkan…' : 'Ya, Batalkan Pesanan'}
      </Button>
      <Button variant="ghost" fullWidth className="mt-2 text-faint" onClick={onClose}>
        Nggak jadi
      </Button>
    </BottomSheet>
  );
}
