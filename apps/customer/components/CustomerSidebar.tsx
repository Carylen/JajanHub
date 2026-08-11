'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWarung, useStalls, DEFAULT_VENDOR_ID, type Vendor } from '@jajanhub/api';
import { Icon, cn, type IconName } from '@jajanhub/ui';
import { BrandMark } from './BrandMark';

/**
 * Desktop-only persistent navigation, matching `Antre/Antri Desktop.dc.html`'s
 * `<aside>` (266px). The reference's sidebar nav (`NAV`: Pesan di sini/Sekitar
 * Sini/Langganan Prioritas/Profil, active-highlighted, badge on Sekitar Sini)
 * is real site-wide navigation here too — same intent as the reference's
 * single-`screen` state switch, just expressed as routes instead of a local
 * `go(screen)` setState, per the brief's explicit product decision to keep
 * every mobile screen reachable at desktop.
 *
 * The reference's category filters (below its NAV, context-aware per screen)
 * are NOT reproduced here — they're owned by each screen's own local filter
 * state (`MerchantDesktopView`'s cat buttons, `DiscoveryDesktopView`'s, …),
 * which this global, route-agnostic sidebar has no access to without
 * prop-drilling from every page. Rendering them inside each content column
 * instead is functionally equivalent ("filter kategori untuk konteks layar")
 * without the cross-tree coupling a shared context would need for one site.
 */
export function CustomerSidebar() {
  const pathname = usePathname();
  const vendorId = pathname.match(/^\/m\/([^/]+)/)?.[1];
  const { data: warung } = useWarung(vendorId ?? '');
  const { data: stalls } = useStalls();

  const NAV: Array<{ href: string; icon: IconName; label: string; badge?: string; match: (p: string) => boolean }> = [
    { href: `/m/${vendorId ?? DEFAULT_VENDOR_ID}`, icon: 'store', label: 'Pesan di sini', match: (p) => p.startsWith('/m/') },
    { href: '/near', icon: 'map-pin', label: 'Sekitar Sini', badge: stalls ? String(stalls.length) : undefined, match: (p) => p.startsWith('/near') },
    { href: '/subscribe', icon: 'bolt', label: 'Langganan Prioritas', match: (p) => p.startsWith('/subscribe') },
    { href: '/profile', icon: 'users', label: 'Profil', match: (p) => p.startsWith('/profile') },
  ];

  return (
    <aside className="hidden lg:flex flex-none w-[266px] min-h-screen bg-white flex-col sticky top-0 h-screen px-[18px] py-6 shadow-[2px_0_24px_rgba(35,24,15,.05)] overflow-y-auto">
      <Link href="/near" className="flex items-center gap-[11px] px-1.5 pb-5">
        <div className="w-[42px] h-[42px] rounded-[13px] bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] flex items-center justify-center flex-none shadow-[0_6px_16px_rgba(255,122,26,.32)]">
          <BrandMark size={23} />
        </div>
        <span className="font-display font-extrabold text-2xl tracking-[-.6px]">JajanHub</span>
      </Link>

      {vendorId && warung && <MerchantCard warung={warung} />}

      <nav className="flex flex-col gap-[3px] mt-5">
        <div className="text-[11px] font-extrabold text-faint tracking-[.5px] px-3 pb-2">NAVIGASI</div>
        {NAV.map((n) => {
          const active = n.match(pathname);
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                'flex items-center gap-3 px-3 py-[11px] rounded-[13px] text-[14.5px] font-bold transition-colors',
                active ? 'bg-[#FFF3E7] text-brand-deep' : 'text-muted hover:bg-[#FBF1E6] hover:text-ink',
              )}
            >
              <Icon name={n.icon} size={19} className={active ? 'text-brand-deep' : 'text-faint'} />
              <span className="flex-1">{n.label}</span>
              {n.badge && (
                <span className="flex-none text-[10px] font-extrabold text-white bg-prio px-2 py-[3px] rounded-full">
                  {n.badge}
                </span>
              )}
            </Link>
          );
        })}
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

function MerchantCard({ warung }: { warung: Vendor }) {
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
