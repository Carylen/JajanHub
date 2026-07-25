'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useVendorOrders } from '@jajanhub/api';
import { Icon, cn, type IconName } from '@jajanhub/ui';

/** Also the base of the desktop Sidebar's nav list (see Sidebar.tsx) — kept
 * here since BottomNav owned it first. */
export const NAV_TABS: Array<{ href: string; label: string; icon: IconName }> = [
  { href: '/beranda', label: 'Beranda', icon: 'home' },
  { href: '/orders', label: 'Pesanan', icon: 'list' },
  { href: '/analytics', label: 'Laporan', icon: 'chart' },
  { href: '/customers', label: 'Pelanggan', icon: 'users' },
  { href: '/menu', label: 'Menu', icon: 'grid4' },
];

export function BottomNav() {
  const pathname = usePathname();
  const { data: orders } = useVendorOrders();
  const activeCount = (orders ?? []).filter((o) => o.status !== 'ditolak').length;

  return (
    <nav className="fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-vendor md:max-w-tablet lg:hidden bg-white/[.96] backdrop-blur-[12px] border-t border-line px-2 pt-[9px] pb-4 flex z-50 shadow-[0_-6px_24px_rgba(35,24,15,.06)]">
      {NAV_TABS.map((tab) => {
        const active = pathname === tab.href;
        const showBadge = tab.href === '/orders' && activeCount > 0;
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? 'page' : undefined}
            className="flex-1 flex flex-col items-center gap-1 py-1.5 relative transition-transform active:scale-90"
          >
            {showBadge && (
              <span className="absolute top-0 right-[calc(50%-20px)] bg-brand-deep text-white text-[10px] font-extrabold min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center border-2 border-white">
                {activeCount}
              </span>
            )}
            <Icon name={tab.icon} size={26} className={cn(active ? 'text-brand' : 'text-[#B8A99B]')} />
            <span className={cn('text-[11px] font-bold', active ? 'text-brand' : 'text-[#B8A99B]')}>{tab.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
