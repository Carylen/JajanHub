'use client';
import Link from 'next/link';
import type { Warung } from '@jajanhub/api';
import { Button, Icon } from '@jajanhub/ui';

interface LandingProps {
  warung: Warung;
  onSeeMenu: () => void;
}

/** Merchant landing: hero, live-queue card, upsells, and CTA to the menu. */
export function Landing({ warung, onSeeMenu }: LandingProps) {
  return (
    <div>
      <div className="animate-screen-in pb-[118px]">
        {/* Hero */}
        <div className="relative h-[266px] bg-[linear-gradient(158deg,#FFB870,#FF7A1A_56%,#E4560A)] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_82%_6%,rgba(255,255,255,.28),transparent)]" />
          <svg className="absolute -right-[34px] -bottom-[30px] opacity-[.16]" width="230" height="230" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <circle cx="12" cy="12" r="9.2" stroke="#fff" strokeWidth="1.2" />
            <circle cx="12" cy="12" r="5" stroke="#fff" strokeWidth="1.2" />
          </svg>
          <div className="relative p-[22px] flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-[7px] bg-white/[.22] text-white font-bold text-[13px] px-[13px] py-2 rounded-full transition-transform active:scale-95"
            >
              <Icon name="chevron-left" size={16} strokeWidth={2.2} />
              Semua Gerobak
            </Link>
            <div className="flex items-center gap-[9px]">
              <div className="flex items-center gap-1.5 bg-white/[.22] px-[11px] py-[7px] rounded-full text-white text-xs font-semibold">
                <Icon name="check" size={13} strokeWidth={2.4} />
                Terverifikasi
              </div>
              <Link
                href="/profile"
                aria-label="Profil"
                className="flex-none w-[38px] h-[38px] rounded-xl bg-white/90 flex items-center justify-center text-brand-deep font-display font-extrabold text-sm shadow-[0_4px_12px_rgba(120,40,0,.2)] transition-transform active:scale-90"
              >
                RP
              </Link>
            </div>
          </div>
        </div>

        {/* Overlapping content */}
        <div className="mt-[-72px] mx-5 relative">
          <div className="bg-white rounded-[26px] p-[22px] shadow-soft">
            <div className="flex items-center gap-2 mb-[11px]">
              <span className="inline-flex items-center gap-1.5 bg-mint/[.13] text-mint-deep font-bold text-xs px-[11px] py-[5px] rounded-full">
                <span className="w-[7px] h-[7px] rounded-full bg-mint animate-pulse" />
                {warung.isOpen ? 'Buka sekarang' : 'Tutup'}
              </span>
              <span className="text-faint text-xs">
                {warung.openFrom} – {warung.openTo}
              </span>
            </div>
            <h1 className="font-display font-extrabold text-[27px] mb-2 tracking-[-.6px] leading-[1.12]">
              {warung.name}
            </h1>
            <div className="flex items-center gap-[11px] text-faint text-[13px] flex-wrap">
              <span className="flex items-center gap-1 text-ink font-bold">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="#FFB020" aria-hidden="true">
                  <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18.6 6 21l1.2-6.6L2.4 9.7l6.6-.9z" />
                </svg>
                {warung.rating.toFixed(1)}
              </span>
              <span>{warung.orderCount}+ pesanan</span>
              <span>·</span>
              <span>{warung.address}</span>
            </div>
          </div>

          {/* Live queue card */}
          <div className="mt-[14px] bg-[linear-gradient(135deg,#FFF3E7,#FFE7D2)] border border-brand/[.16] rounded-[24px] px-5 py-[18px] flex items-center gap-4 shadow-[0_8px_20px_rgba(255,122,26,.08)]">
            <div className="flex-none w-[60px] h-[60px] rounded-[19px] bg-white flex flex-col items-center justify-center shadow-[0_5px_14px_rgba(255,122,26,.16)]">
              <span className="font-display font-extrabold text-[25px] text-brand leading-none">{warung.peopleAhead}</span>
              <span className="text-[9px] text-faint font-semibold">antre</span>
            </div>
            <div className="flex-1">
              <div className="font-bold text-[15px]">{warung.peopleAhead} orang di depanmu</div>
              <div className="text-faint text-[13px] flex items-center gap-[5px] mt-0.5">
                <Icon name="clock" size={14} strokeWidth={2} className="text-faint" />
                estimasi ±{warung.etaMin} menit
              </div>
            </div>
          </div>

          {/* Subscription upsell */}
          <Link
            href="/subscribe"
            className="mt-[14px] w-full text-left bg-prio-ink rounded-[22px] px-[18px] py-4 flex items-center gap-[13px] shadow-[0_10px_24px_rgba(42,26,62,.24)] transition-transform active:scale-[.98]"
          >
            <div className="flex-none w-[42px] h-[42px] rounded-[13px] bg-[linear-gradient(135deg,#A879FF,#7A3BF5)] flex items-center justify-center shadow-[0_6px_14px_rgba(122,59,245,.4)]">
              <Icon name="bolt" size={21} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="text-white font-bold text-sm">JajanHub Plus · Skip antrean</div>
              <div className="text-[#C6B4E6] text-xs mt-px">Prioritas tiap pesan, mulai Rp15rb/bln</div>
            </div>
            <Icon name="chevron-right" size={18} className="text-[#C6B4E6]" />
          </Link>

          {/* Discovery upsell */}
          <Link
            href="/"
            className="mt-3 w-full text-left bg-white border-[1.5px] border-line rounded-[22px] px-[18px] py-[15px] flex items-center gap-[13px] shadow-[0_5px_16px_rgba(35,24,15,.05)] transition-transform active:scale-[.98]"
          >
            <div className="flex-none w-[42px] h-[42px] rounded-[13px] bg-[#E7FBF2] flex items-center justify-center">
              <Icon name="map-pin" size={22} className="text-mint-deep" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">Cari makan sekitar sini</div>
              <div className="text-faint text-xs mt-px">14 gerobak buka di Area SCBD</div>
            </div>
            <Icon name="chevron-right" size={18} className="text-[#C6B7A8]" />
          </Link>
        </div>
      </div>

      {/* Sticky CTA */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-app px-5 pt-4 pb-[22px] bg-[linear-gradient(to_top,#FFF8F1_72%,transparent)] z-20">
        <Button variant="primary" fullWidth onClick={onSeeMenu}>
          Lihat Menu <Icon name="chevron-right" size={18} strokeWidth={2.4} className="text-white" />
        </Button>
      </div>
    </div>
  );
}
