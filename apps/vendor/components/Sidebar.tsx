'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useVendorOrders } from '@jajanhub/api';
import { Icon, cn, type IconName } from '@jajanhub/ui';
import { NAV_TABS } from './BottomNav';
import { useVendorUi } from '../lib/ui-store';

/**
 * Desktop-only persistent nav, matching Antre/Antri Pedagang Desktop.dc.html's
 * dark `<aside>` (264px, #23180F) — visually distinct from mobile's
 * BottomNav, not just a wider version of it. Superset of BottomNav's 5 tabs
 * plus Settlement + Pengaturan (mobile drill-down pages with no bottom-tab
 * presence, but reachable here per the brief's explicit instruction — the
 * reference's own NAVDEF omits Pengaturan entirely).
 */
const EXTRA_LINKS: Array<{ href: string; label: string; icon: IconName }> = [
  { href: '/settlement', label: 'Pencairan', icon: 'download' },
  { href: '/settings', label: 'Pengaturan', icon: 'store' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: orders } = useVendorOrders();
  const warungOpen = useVendorUi((s) => s.warungOpen);
  const toggleWarungOpen = useVendorUi((s) => s.toggleWarungOpen);
  const activeCount = (orders ?? []).filter((o) => o.status !== 'ditolak').length;

  return (
    <aside className="hidden lg:flex flex-none w-[264px] min-h-screen bg-ink text-[#F4ECE2] flex-col sticky top-0 h-screen px-[18px] py-6">
      <div className="flex items-center gap-3 px-2 pb-[22px]">
        <div className="flex-none w-11 h-11 rounded-2xl bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] flex items-center justify-center shadow-[0_6px_16px_rgba(255,122,26,.35)]">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 20.5h16" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
            <path d="M6 20V10a6 6 0 0 1 12 0v10" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M9 7V3.5M12 6.4V3M15 7V3.5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
        <div>
          <div className="font-display font-extrabold text-[22px] tracking-[-.5px] leading-none">JajanHub</div>
          <div className="text-[11px] text-[#B79C82] font-semibold tracking-[.3px]">DASBOR PEDAGANG</div>
        </div>
      </div>

      <nav className="flex flex-col gap-[3px] mt-1.5">
        {NAV_TABS.map((tab) => {
          const active = pathname === tab.href;
          const badge = tab.href === '/orders' && activeCount > 0 ? activeCount : undefined;
          return <SidebarLink key={tab.href} href={tab.href} icon={tab.icon} label={tab.label} active={active} badge={badge} />;
        })}
        {EXTRA_LINKS.map((link) => (
          <SidebarLink key={link.href} href={link.href} icon={link.icon} label={link.label} active={pathname === link.href} />
        ))}
      </nav>

      <div className="mt-auto flex flex-col gap-3.5">
        <button
          type="button"
          onClick={toggleWarungOpen}
          aria-pressed={warungOpen}
          className={cn('text-left w-full rounded-2xl p-[15px] transition-transform active:scale-[.98]', warungOpen ? 'bg-[rgba(22,199,132,.16)]' : 'bg-white/[.06]')}
        >
          <div className="flex items-center justify-between">
            <div className={cn('text-xs font-bold tracking-[.3px]', warungOpen ? 'text-[#4FE0A8]' : 'text-[#B79C82]')}>STATUS WARUNG</div>
            <span className={cn('flex-none w-[46px] h-[26px] rounded-full relative', warungOpen ? 'bg-mint' : 'bg-white/20')}>
              <span
                className="absolute top-[3px] w-5 h-5 rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,.3)] transition-[left]"
                style={{ left: warungOpen ? '23px' : '3px' }}
              />
            </span>
          </div>
          <div className={cn('font-display font-extrabold text-[19px] mt-1.5', warungOpen ? 'text-white' : 'text-[#B79C82]')}>
            {warungOpen ? 'Buka' : 'Tutup'}
          </div>
        </button>

        <div className="flex items-center gap-[11px] px-2 pt-4 border-t border-white/[.08]">
          <div className="flex-none w-10 h-10 rounded-xl bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] flex items-center justify-center text-white font-display font-extrabold text-[15px]">
            PB
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm leading-[1.1] truncate">Pak Budi</div>
            <div className="text-xs text-[#B79C82]">Ayam Penyet My Bosz</div>
          </div>
          <Icon name="check" size={13} strokeWidth={2.6} className="flex-none text-[#4FE0A8]" />
        </div>
      </div>
    </aside>
  );
}

function SidebarLink({
  href,
  icon,
  label,
  active,
  badge,
}: {
  href: string;
  icon: IconName;
  label: string;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'flex items-center gap-[13px] px-3.5 py-3 rounded-[13px] text-[14.5px] font-bold transition-colors',
        active ? 'bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] text-white' : 'text-[#D8C4AE] hover:bg-white/[.06]',
      )}
    >
      <Icon name={icon} size={20} className={active ? 'text-white' : 'text-[#B79C82]'} />
      <span className="flex-1">{label}</span>
      {badge !== undefined && (
        <span className="bg-brand text-white text-[11px] font-extrabold min-w-5 h-5 px-1.5 rounded-full flex items-center justify-center">
          {badge}
        </span>
      )}
    </Link>
  );
}
