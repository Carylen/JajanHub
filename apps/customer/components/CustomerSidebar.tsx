'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useActiveOrders } from '@jajanhub/api';
import { Icon, cn, type IconName } from '@jajanhub/ui';
import { BrandMark } from './BrandMark';
import { useAuth } from './customer/auth/AuthContext';

/**
 * Desktop-only persistent navigation, matching `Antre/Antri Desktop.dc.html`'s
 * `<aside>` (266px). The reference's sidebar nav (Beranda/Pesanan
 * Aktif/Langganan Prioritas/Profil, active-highlighted, badge on Pesanan
 * Aktif) is real site-wide navigation here too — same intent as the
 * reference's single-`screen` state switch, just expressed as routes instead
 * of a local `go(screen)` setState. Gated items (`gated: true`) go through
 * `requireAuth` instead of a plain `Link` so a logged-out click opens the
 * login modal first, matching mobile's bottom tab bar.
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
  const router = useRouter();
  const { requireAuth } = useAuth();
  const { data: activeOrders } = useActiveOrders();

  const NAV: Array<{ href: string; icon: IconName; label: string; badge?: string; gated: boolean; match: (p: string) => boolean }> = [
    { href: '/', icon: 'home', label: 'Beranda', gated: false, match: (p) => p === '/' || p.startsWith('/m/') || p.startsWith('/order/') },
    {
      href: '/orders',
      icon: 'receipt',
      label: 'Pesanan Aktif',
      gated: true,
      badge: activeOrders && activeOrders.length > 0 ? String(activeOrders.length) : undefined,
      match: (p) => p.startsWith('/orders'),
    },
    { href: '/subscribe', icon: 'bolt', label: 'Langganan Prioritas', gated: true, match: (p) => p.startsWith('/subscribe') },
    { href: '/profile', icon: 'users', label: 'Profil', gated: true, match: (p) => p.startsWith('/profile') },
  ];

  return (
    <aside className="hidden lg:flex flex-none w-[266px] min-h-screen bg-white flex-col sticky top-0 h-screen px-[18px] py-6 shadow-[2px_0_24px_rgba(35,24,15,.05)] overflow-y-auto">
      <Link href="/" className="flex items-center gap-[11px] px-1.5 pb-5">
        <div className="w-[42px] h-[42px] rounded-[13px] bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] flex items-center justify-center flex-none shadow-[0_6px_16px_rgba(255,122,26,.32)]">
          <BrandMark size={23} />
        </div>
        <span className="font-display font-extrabold text-2xl tracking-[-.6px]">JajanHub</span>
      </Link>

      <nav className="flex flex-col gap-[3px] mt-1">
        <div className="text-[11px] font-extrabold text-faint tracking-[.5px] px-3 pb-2">NAVIGASI</div>
        {NAV.map((n) => {
          const active = n.match(pathname);
          const cls = cn(
            'flex items-center gap-3 px-3 py-[11px] rounded-[13px] text-[14.5px] font-bold transition-colors text-left w-full',
            active ? 'bg-[#FFF3E7] text-brand-deep' : 'text-muted hover:bg-[#FBF1E6] hover:text-ink',
          );
          const content = (
            <>
              <Icon name={n.icon} size={19} className={active ? 'text-brand-deep' : 'text-faint'} />
              <span className="flex-1">{n.label}</span>
              {n.badge && (
                <span className="flex-none text-[10px] font-extrabold text-white bg-prio px-2 py-[3px] rounded-full">
                  {n.badge}
                </span>
              )}
            </>
          );
          if (!n.gated) {
            return (
              <Link key={n.href} href={n.href} className={cls}>
                {content}
              </Link>
            );
          }
          return (
            <button key={n.href} type="button" onClick={() => requireAuth(() => router.push(n.href))} className={cls}>
              {content}
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => requireAuth(() => router.push('/subscribe'))}
        className="mt-auto text-left bg-[#F4F0FF] border border-[#E4D8FF] rounded-2xl p-[15px] flex items-center gap-3 transition-transform active:scale-[.98]"
      >
        <span className="flex-none w-[38px] h-[38px] rounded-xl bg-prio flex items-center justify-center">
          <Icon name="bolt" size={20} className="text-white" />
        </span>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-[13.5px] text-[#5B2BC4]">JajanHub Priority</div>
          <div className="text-[11.5px] text-[#8B6FC9]">Naik antrean tiap pesan</div>
        </div>
      </button>
    </aside>
  );
}
