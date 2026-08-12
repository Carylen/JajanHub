'use client';
import { Button, BottomSheet } from '@jajanhub/ui';

interface LogoutSheetProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  pending?: boolean;
}

/** Logout confirmation — mobile. Modeled on CancelSheet.tsx. */
export function LogoutSheet({ open, onClose, onConfirm, pending }: LogoutSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} label="Keluar dari akun">
      <div className="font-display font-extrabold text-xl">Keluar dari akun?</div>
      <div className="text-sm text-faint mt-1.5 leading-[1.5]">
        Kamu perlu verifikasi nomor HP lagi buat masuk. Pesanan aktif tetap aman.
      </div>
      <Button variant="danger" fullWidth className="mt-5" onClick={onConfirm} disabled={pending}>
        {pending ? 'Memproses…' : 'Ya, Keluar'}
      </Button>
      <Button variant="ghost" fullWidth className="mt-2 text-faint" onClick={onClose}>
        Batal
      </Button>
    </BottomSheet>
  );
}
