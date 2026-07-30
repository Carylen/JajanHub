'use client';
import { Icon, Modal } from '@jajanhub/ui';

interface SwitchVendorModalProps {
  open: boolean;
  onClose: () => void;
  activeVendorName: string;
  pendingVendorName: string;
  onConfirm: () => void;
}

/** Cross-vendor cart conflict — desktop. Modeled on CancelModal.tsx. */
export function SwitchVendorModal({ open, onClose, activeVendorName, pendingVendorName, onConfirm }: SwitchVendorModalProps) {
  return (
    <Modal open={open} onClose={onClose} label="Pindah ke gerobak lain?" width="470px">
      <div className="flex items-center gap-3.5">
        <span className="flex-none w-12 h-12 rounded-[14px] bg-[#FFF3E7] flex items-center justify-center">
          <Icon name="bag" size={24} className="text-brand-deep" />
        </span>
        <div className="font-display font-extrabold text-[22px] leading-[1.15]">Pindah ke gerobak lain?</div>
      </div>
      <div className="text-[14.5px] text-muted mt-3.5 leading-[1.55]">
        Kamu masih punya keranjang aktif di <b className="text-ink">{activeVendorName}</b>. Pesan dari{' '}
        <b className="text-ink">{pendingVendorName}</b> akan jadi <b className="text-ink">pesanan terpisah</b> —
        keranjang yang sekarang dikosongkan dulu ya.
      </div>
      <div className="flex gap-2.5 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 rounded-[14px] py-[15px] font-extrabold text-[15px] bg-[#F1E7DC] text-ink transition-transform active:scale-[.98]"
        >
          Batal
        </button>
        <button
          type="button"
          onClick={onConfirm}
          className="flex-[1.5] rounded-[14px] py-[15px] font-extrabold text-[15px] bg-ink text-white transition-transform active:scale-[.98]"
        >
          Buat pesanan terpisah
        </button>
      </div>
    </Modal>
  );
}
