'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWarung, type Warung } from '@jajanhub/api';
import { Icon } from '@jajanhub/ui';
import { BrandMark } from './BrandMark';

/**
 * Desktop-only persistent navigation, matching `Antre/Antri Desktop.dc.html`'s
 * `<aside>` (266px) with one deliberate deviation from that raw reference,
 * per the brief's explicit product decision: the reference's sidebar is
 * *just* a merchant-page category filter list. The brief instead wants real
 * site-wide navigation (Profile/Subscription/Discovery) always present, with
 * the reference's merchant card kept as contextual content layered on top.
 *
 * The reference's category filters are NOT reproduced here — they're owned
 * by `useMerchantScreen()`'s local filter state, which this global,
 * route-agnostic sidebar has no access to without prop-drilling from every
 * page. They render instead at the top of `MerchantDesktopView`'s catalog
 * column, functionally equivalent ("filter kategori untuk konteks menu")
 * without the cross-tree coupling a shared context would need for a single
 * use site.
 */
export function CustomerSidebar() {
  const pathname = usePathname();
  const merchantId = pathname.match(/^\/m\/([^/]+)/)?.[1];
  const { data: warung } = useWarung(merchantId ?? '');

  return (
    <aside className="hidden lg:flex flex-none w-[266px] min-h-screen bg-white flex-col sticky top-0 h-screen px-[18px] py-6 shadow-[2px_0_24px_rgba(35,24,15,.05)]">
      <Link href="/near" className="flex items-center gap-[11px] px-1.5 pb-5">
        <div className="w-[42px] h-[42px] rounded-[13px] bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] flex items-center justify-center flex-none shadow-[0_6px_16px_rgba(255,122,26,.32)]">
          <BrandMark size={23} />
        </div>
        <span className="font-display font-extrabold text-2xl tracking-[-.6px]">JajanHub</span>
      </Link>

      {merchantId && warung && <MerchantCard warung={warung} />}

      <nav className="flex flex-col gap-[3px] mt-5">
        <SidebarLink href="/near" icon="map-pin" label="Sekitar Sini" />
        <SidebarLink href="/subscribe" icon="bolt" label="JajanHub Plus" />
        <SidebarLink href="/profile" icon="users" label="Profil" />
      </nav>

      <Link
        href="/subscribe"
        className="mt-auto bg-[#F4F0FF] border border-[#E4D8FF] rounded-2xl p-[15px] flex items-center gap-3 transition-transform active:scale-[.98]"
      >
        <span className="flex-none w-[38px] h-[38px] rounded-xl bg-prio flex items-center justify-center">
          <Icon name="bolt" size={20} className="text-white" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-[13.5px] text-[#5B2BC4]">JajanHub Priority</div>
          <div className="text-[11.5px] text-[#8B6FC9]">Naik antrean tiap pesan</div>
        </div>
      </Link>
    </aside>
  );
}

function MerchantCard({ warung }: { warung: Warung }) {
  return (
    <div className="bg-[linear-gradient(155deg,#FFB870,#FF7A1A_60%,#E4560A)] rounded-[20px] p-[18px] text-white relative overflow-hidden">
      <span className="inline-flex items-center gap-1.5 bg-white/[.22] text-[11px] font-bold px-2.5 py-1 rounded-full">
        <Icon name="check" size={12} strokeWidth={2.6} className="text-white" />
        Terverifikasi
      </span>
      <div className="font-display font-extrabold text-[19px] leading-[1.15] mt-[11px]">{warung.name}</div>
      <div className="text-[12.5px] opacity-90 mt-[5px] flex items-center gap-1.5">
        <span className="w-[7px] h-[7px] rounded-full bg-white animate-pulse" />
        {warung.isOpen ? 'Buka' : 'Tutup'} · {warung.openFrom}–{warung.openTo}
      </div>
    </div>
  );
}

function SidebarLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: Parameters<typeof Icon>[0]['name'];
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 px-3 py-[11px] rounded-[13px] text-[14.5px] font-bold text-muted hover:bg-[#FBF1E6] hover:text-ink transition-colors"
    >
      <Icon name={icon} size={19} />
      {label}
    </Link>
  );
}
