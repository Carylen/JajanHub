'use client';
import { Button, Icon, BottomSheet } from '@jajanhub/ui';

interface SwitchVendorSheetProps {
  open: boolean;
  onClose: () => void;
  activeVendorName: string;
  pendingVendorName: string;
  onConfirm: () => void;
}

/** Cross-vendor cart conflict — mobile. Modeled on CancelSheet.tsx. */
export function SwitchVendorSheet({ open, onClose, activeVendorName, pendingVendorName, onConfirm }: SwitchVendorSheetProps) {
  return (
    <BottomSheet open={open} onClose={onClose} label="Pindah ke gerobak lain?">
      <div className="flex items-center gap-3">
        <span className="flex-none w-11 h-11 rounded-[13px] bg-[#FFEDD9] flex items-center justify-center">
          <Icon name="bag" size={22} className="text-brand-deep" />
        </span>
        <div className="font-display font-extrabold text-xl leading-[1.1]">Pindah ke gerobak lain?</div>
      </div>
      <div className="text-sm text-faint mt-3 leading-[1.55]">
        Kamu masih punya keranjang aktif di <b className="text-ink">{activeVendorName}</b>. Pesan dari{' '}
        <b className="text-ink">{pendingVendorName}</b> bakal jadi <b className="text-ink">pesanan terpisah</b> —
        keranjang yang sekarang dikosongkan dulu ya.
      </div>
      <Button variant="dark" fullWidth className="mt-5" onClick={onConfirm}>
        Lanjut, buat pesanan terpisah
      </Button>
      <Button variant="ghost" fullWidth className="mt-2 text-faint" onClick={onClose}>
        Batal
      </Button>
    </BottomSheet>
  );
}
