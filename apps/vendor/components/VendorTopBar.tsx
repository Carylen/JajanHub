'use client';
import type { ReactNode } from 'react';
import { Icon } from '@jajanhub/ui';
import { useVendorUi } from '../lib/ui-store';
import { VerifyModal } from './VerifyModal';

interface VendorTopBarProps {
  title: string;
  sub: ReactNode;
}

/**
 * Sticky desktop header — present on every vendor desktop screen (matches
 * Antre/Antri Pedagang Desktop.dc.html's `<header>`). Search is decorative
 * for now (no search endpoint exists in packages/api yet); "Verifikasi
 * Ambil" opens the same global verify flow as mobile's Orders button.
 */
export function VendorTopBar({ title, sub }: VendorTopBarProps) {
  const verifyOpen = useVendorUi((s) => s.verifyOpen);
  const openVerify = useVendorUi((s) => s.openVerify);
  const closeVerify = useVendorUi((s) => s.closeVerify);

  return (
    <>
      <header className="sticky top-0 z-20 bg-[rgba(241,231,220,.86)] backdrop-blur-[12px] border-b border-[rgba(35,24,15,.07)] px-[34px] py-5 flex items-center gap-5">
        <div className="flex-1 min-w-0">
          <div className="font-display font-extrabold text-[27px] tracking-[-.6px] leading-none whitespace-nowrap">{title}</div>
          <div className="text-[13.5px] text-faint mt-[3px] flex items-center gap-[7px] whitespace-nowrap overflow-hidden text-ellipsis">
            {sub}
          </div>
        </div>
        <div className="flex-none flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-white rounded-[13px] px-[15px] py-[11px] w-[250px] shadow-[0_3px_10px_rgba(35,24,15,.05)]">
            <Icon name="search" size={18} className="text-faint" />
            <input
              placeholder="Cari pesanan / pelanggan…"
              className="flex-1 border-0 outline-none bg-transparent font-sans text-sm text-ink min-w-0"
            />
          </div>
          <button
            type="button"
            onClick={openVerify}
            className="flex items-center gap-2.5 bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] text-white font-extrabold text-[14.5px] px-[18px] py-3 rounded-[13px] shadow-[0_8px_18px_rgba(255,122,26,.3)] transition-transform active:scale-[.97]"
          >
            <Icon name="qr" size={18} className="text-white" strokeWidth={2.4} />
            Verifikasi Ambil
          </button>
          <button
            type="button"
            aria-label="Notifikasi"
            className="flex-none w-[46px] h-[46px] rounded-[13px] bg-white flex items-center justify-center shadow-[0_3px_10px_rgba(35,24,15,.05)] relative transition-transform active:scale-90"
          >
            <Icon name="bell" size={21} className="text-ink" />
            <span className="absolute top-[11px] right-3 w-2 h-2 rounded-full bg-brand border-2 border-white" />
          </button>
        </div>
      </header>

      <VerifyModal open={verifyOpen} onClose={closeVerify} />
    </>
  );
}
