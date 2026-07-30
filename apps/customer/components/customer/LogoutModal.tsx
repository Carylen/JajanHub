'use client';
import { Modal } from '@jajanhub/ui';

interface LogoutModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pending?: boolean;
}

/** Logout confirmation — desktop. Modeled on CancelModal.tsx. */
export function LogoutModal({ open, onClose, onConfirm, pending }: LogoutModalProps) {
  return (
    <Modal open={open} onClose={onClose} label="Keluar dari akun" width="420px">
      <div className="font-display font-extrabold text-[22px]">Keluar dari akun?</div>
      <div className="text-sm text-faint mt-1.5 leading-[1.5]">
        Kamu perlu verifikasi nomor HP lagi buat masuk. Pesanan aktif tetap aman.
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
          disabled={pending}
          className="flex-1 rounded-[14px] py-[15px] font-extrabold text-[15px] bg-danger text-white transition-transform active:scale-[.98] disabled:opacity-60"
        >
          {pending ? 'Memproses…' : 'Ya, keluar'}
        </button>
      </div>
    </Modal>
  );
}
