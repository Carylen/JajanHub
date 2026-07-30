'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useActiveOrders } from '@jajanhub/api';
import { Icon, cn, type IconName } from '@jajanhub/ui';
import { useAuth } from './customer/auth/AuthContext';

const TABS: Array<{ href: string; icon: IconName; label: string; gated: boolean }> = [
  { href: '/', icon: 'home', label: 'Beranda', gated: false },
  { href: '/orders', icon: 'receipt', label: 'Pesanan Aktif', gated: true },
  { href: '/profile', icon: 'users', label: 'Profil', gated: true },
];

/** Mobile bottom tabs for the three top-level sections — matches the design's new Beranda/Pesanan Aktif/Profil nav. */
export function MobileTabBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { requireAuth } = useAuth();
  const { data: activeOrders } = useActiveOrders();
  const badge = activeOrders && activeOrders.length > 0 ? String(activeOrders.length) : '';

  return (
    <div className="lg:hidden fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-app z-30 bg-cream/[.96] backdrop-blur-[12px] border-t border-line flex px-5 pt-2 pb-3.5">
      {TABS.map((tab) => {
        const active = tab.href === '/' ? pathname === '/' : pathname.startsWith(tab.href);
        const go = () => {
          if (tab.gated) requireAuth(() => router.push(tab.href));
          else router.push(tab.href);
        };
        return (
          <button
            key={tab.href}
            type="button"
            onClick={go}
            className={cn(
              'flex-1 bg-transparent border-0 flex flex-col items-center gap-[3px] py-1.5 transition-transform active:scale-[.92]',
              active ? 'text-brand-deep' : 'text-faint',
            )}
          >
            <span className="relative flex">
              <Icon name={tab.icon} size={22} />
              {tab.href === '/orders' && badge && (
                <span className="absolute -top-1.5 -right-2 bg-danger text-white text-[9px] font-extrabold min-w-[15px] h-[15px] px-1 rounded-full flex items-center justify-center">
                  {badge}
                </span>
              )}
            </span>
            <span className="text-[11px] font-bold">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
