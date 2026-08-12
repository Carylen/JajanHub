'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProfile, useLogout } from '@jajanhub/api';
import { Icon, Toggle, type IconName } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { usePageAuthGuard } from './auth/usePageAuthGuard';
import { LogoutModal } from './LogoutModal';

/**
 * Desktop Profile screen — matches Antre/Antri Desktop.dc.html's `isProfile`
 * state: 2-column grid (identity+notifications left, stats+account right)
 * instead of mobile's stacked hero. Same `useProfile()` query as
 * `Profile.tsx` (mobile), no separate data source — only the layout differs.
 * Notification toggles are local UI state here too (mobile has no
 * persistence for them either; there's no backend field for it yet).
 */
export function ProfileDesktopView() {
  const router = useRouter();
  const isLoggedIn = usePageAuthGuard();
  const { data: profile, isLoading, isError, refetch } = useProfile();
  const [notifStatus, setNotifStatus] = useState(true);
  const [notifPromo, setNotifPromo] = useState(true);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const logout = useLogout();

  if (!isLoggedIn) return <LoadingState />;
  if (isLoading) return <LoadingState />;
  if (isError || !profile) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-10 flex justify-center animate-screen-in">
      <div className="w-full max-w-[960px]">
        <div className="font-display font-extrabold text-[30px] tracking-[-.6px] mb-[22px]">Profil</div>

        <div className="grid grid-cols-[1.05fr_1fr] gap-[22px] items-start">
          <div className="flex flex-col gap-[22px]">
            <div className="bg-white rounded-[22px] p-[26px] shadow-[0_6px_16px_rgba(35,24,15,.05)]">
              <div className="flex items-center gap-4">
                <div className="flex-none w-[66px] h-[66px] rounded-[20px] bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] flex items-center justify-center font-display font-extrabold text-2xl text-white shadow-[0_6px_16px_rgba(255,122,26,.28)]">
                  {profile.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-display font-extrabold text-xl">{profile.name}</div>
                  {profile.subscriptionActive && (
                    <span className="inline-flex items-center gap-[5px] bg-[#F4F0FF] text-[#5B2BC4] text-[11.5px] font-extrabold px-2.5 py-1 rounded-full mt-1.5">
                      <Icon name="bolt" size={12} className="text-prio" />
                      Priority · aktif
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col mt-5">
                <ProfileRow icon="phone" label="Nomor HP" value={profile.phone} action="Ubah" />
                <ProfileRow icon="users" label="Member" value={`${profile.totalOrders} pesanan sejak gabung`} />
              </div>
            </div>

            <div className="bg-white rounded-[22px] p-[26px] shadow-[0_6px_16px_rgba(35,24,15,.05)]">
              <div className="font-display font-extrabold text-lg mb-1.5">Notifikasi</div>
              <div className="text-[13px] text-faint mb-3.5">Atur kabar apa aja yang mau kamu terima.</div>
              <ToggleRow title="Antrean dipanggil" sub="Kabar pas nomormu siap diambil" checked={notifStatus} onChange={() => setNotifStatus((v) => !v)} />
              <ToggleRow title="Promo & menu baru" sub="Diskon dari gerobak favorit" checked={notifPromo} onChange={() => setNotifPromo((v) => !v)} last />
            </div>
          </div>

          <div className="flex flex-col gap-[22px]">
            <div className="flex gap-3.5">
              <div className="flex-1 bg-ink rounded-[20px] p-5 text-white">
                <div className="font-display font-extrabold text-[30px] leading-none">{profile.totalOrders}</div>
                <div className="text-[12.5px] text-[#C9B8A6] mt-1">Total pesanan</div>
              </div>
              <div className="flex-1 bg-[linear-gradient(150deg,#FFB870,#FF7A1A)] rounded-[20px] p-5 text-white">
                <div className="font-display font-extrabold text-[30px] leading-none">{profile.points}</div>
                <div className="text-[12.5px] opacity-90 mt-1">Poin</div>
              </div>
            </div>

            <Link
              href="/subscribe"
              className="bg-[#2A1A3E] rounded-[22px] px-[18px] py-4 flex items-center gap-[13px] shadow-[0_10px_24px_rgba(42,26,62,.24)] transition-transform active:scale-[.98]"
            >
              <div className="flex-none w-[42px] h-[42px] rounded-[13px] bg-[linear-gradient(135deg,#A879FF,#7A3BF5)] flex items-center justify-center shadow-[0_6px_14px_rgba(122,59,245,.4)]">
                <Icon name="bolt" size={21} className="text-white" />
              </div>
              <div className="flex-1">
                <div className="text-white font-bold text-sm">
                  {profile.subscriptionActive ? 'JajanHub Plus aktif' : 'JajanHub Plus belum aktif'}
                </div>
                <div className="text-[#C6B4E6] text-xs mt-px">Aktifkan buat skip antrean, mulai Rp15rb/bln</div>
              </div>
              <Icon name="chevron-right" size={18} className="text-[#C6B4E6]" />
            </Link>

            <div className="bg-white rounded-[22px] p-[18px] shadow-[0_6px_16px_rgba(35,24,15,.05)]">
              <div className="font-extrabold text-sm px-1.5 pb-1.5">Akun</div>
              <NavRow icon="clock" iconBg="bg-[#FFF3E7]" iconColor="text-brand-deep" label="Riwayat Pesanan" />
              <NavRow icon="card" iconBg="bg-prio-soft" iconColor="text-prio" label="Metode Pembayaran" trailing="GoPay" />
              <NavRow icon="map-pin" iconBg="bg-[#E7FBF2]" iconColor="text-mint-deep" label="Gerobak Favorit" trailing={`${profile.favorites}`} last />
            </div>

            <button
              type="button"
              onClick={() => setLogoutOpen(true)}
              className="w-full bg-danger-soft text-danger rounded-[18px] py-4 font-extrabold text-[15px] flex items-center justify-center gap-2 transition-transform active:scale-[.98]"
            >
              <Icon name="logout" size={18} />
              Keluar
            </button>
          </div>
        </div>
      </div>

      <LogoutModal
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        pending={logout.isPending}
        onConfirm={() => logout.mutate(undefined, { onSuccess: () => router.push('/') })}
      />
    </div>
  );
}

function ProfileRow({ icon, label, value, action }: { icon: IconName; label: string; value: string; action?: string }) {
  return (
    <div className="flex items-center gap-3 py-3 border-t border-[#F4ECE2]">
      <span className="flex-none text-faint">
        <Icon name={icon} size={19} />
      </span>
      <div className="flex-1">
        <div className="text-xs text-faint">{label}</div>
        <div className="font-bold text-[14.5px] mt-px">{value}</div>
      </div>
      {action && <span className="text-brand-deep font-bold text-[13px] cursor-pointer">{action}</span>}
    </div>
  );
}

function ToggleRow({
  title,
  sub,
  checked,
  onChange,
  last,
}: {
  title: string;
  sub: string;
  checked: boolean;
  onChange: () => void;
  last?: boolean;
}) {
  return (
    <div className={`flex items-center gap-3.5 py-3.5 ${last ? '' : 'border-t border-[#F4ECE2]'}`}>
      <div className="flex-1">
        <div className="font-bold text-[14.5px]">{title}</div>
        <div className="text-xs text-faint mt-px">{sub}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} label={title} />
    </div>
  );
}

function NavRow({
  icon,
  iconBg,
  iconColor,
  label,
  trailing,
  last,
}: {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  label: string;
  trailing?: string;
  last?: boolean;
}) {
  return (
    <button
      type="button"
      className={`w-full flex items-center gap-3.5 px-3 py-[13px] transition-colors hover:bg-[#FFF6EE] rounded-xl ${last ? '' : 'border-b border-[#F4ECE2]'}`}
    >
      <span className={`flex-none w-9 h-9 rounded-[11px] ${iconBg} flex items-center justify-center`}>
        <Icon name={icon} size={18} className={iconColor} />
      </span>
      <span className="flex-1 text-left font-bold text-sm">{label}</span>
      {trailing && <span className="text-xs text-faint mr-0.5">{trailing}</span>}
      <Icon name="chevron-right" size={16} className="text-[#C6B7A8]" />
    </button>
  );
}
