'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useProfile, useLogout } from '@jajanhub/api';
import { Card, IconButton, Icon, Toggle, type IconName } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { usePageAuthGuard } from './auth/usePageAuthGuard';
import { LogoutSheet } from './LogoutSheet';

export function Profile() {
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
    <div className="animate-screen-in pb-10">
      {/* Hero */}
      <div className="relative bg-[linear-gradient(158deg,#FFB870,#FF7A1A_56%,#E4560A)] px-5 pt-4 pb-[58px] overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_82%_6%,rgba(255,255,255,.28),transparent)]" />
        <div className="relative flex items-center gap-3">
          <IconButton aria-label="Kembali" tone="translucent" onClick={() => router.back()}>
            <Icon name="chevron-left" size={19} strokeWidth={2.2} />
          </IconButton>
          <div className="text-white font-display font-extrabold text-xl">Profil</div>
        </div>
      </div>

      {/* Identity card */}
      <div className="mx-5 -mt-[42px] relative">
        <Card className="p-[18px] shadow-soft flex items-center gap-[15px]">
          <div className="flex-none w-[60px] h-[60px] rounded-[19px] bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] flex items-center justify-center text-white font-display font-extrabold text-[22px] shadow-[0_6px_16px_rgba(255,122,26,.3)]">
            {profile.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-extrabold text-[19px] leading-[1.1]">{profile.name}</div>
            <div className="text-[13px] text-faint mt-0.5">{profile.phone}</div>
          </div>
          <IconButton aria-label="Edit profil" tone="brand">
            <Icon name="edit" size={18} />
          </IconButton>
        </Card>
      </div>

      {/* Stats */}
      <div className="px-5 pt-3.5 flex gap-[11px]">
        <Stat value={profile.totalOrders} label="total pesanan" color="text-ink" />
        <Stat value={profile.points} label="poin" color="text-brand" />
        <Stat value={profile.favorites} label="gerobak favorit" color="text-mint-deep" />
      </div>

      {/* Subscription upsell */}
      <div className="px-5 pt-3.5">
        <Link
          href="/subscribe"
          className="w-full text-left bg-prio-ink rounded-[22px] px-[18px] py-4 flex items-center gap-[13px] shadow-[0_10px_24px_rgba(42,26,62,.24)] transition-transform active:scale-[.98]"
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
      </div>

      {/* Account section */}
      <Section title="AKUN">
        <NavRow icon="clock" iconBg="bg-[#FFF3E7]" iconColor="text-brand-deep" label="Riwayat Pesanan" />
        <NavRow icon="card" iconBg="bg-prio-soft" iconColor="text-prio" label="Metode Pembayaran" trailing="GoPay" />
        <NavRow icon="map-pin" iconBg="bg-[#E7FBF2]" iconColor="text-mint-deep" label="Gerobak Favorit" last />
      </Section>

      {/* Notifications */}
      <Section title="NOTIFIKASI">
        <ToggleRow
          icon="bell"
          iconBg="bg-[#FFF3E7]"
          iconColor="text-brand-deep"
          title="Status pesanan"
          sub="Kabar begitu pesanan siap"
          checked={notifStatus}
          onChange={() => setNotifStatus((v) => !v)}
        />
        <ToggleRow
          icon="speaker"
          iconBg="bg-prio-soft"
          iconColor="text-prio"
          title="Promo & menu baru"
          sub="Diskon dari gerobak favorit"
          checked={notifPromo}
          tone="prio"
          onChange={() => setNotifPromo((v) => !v)}
          last
        />
      </Section>

      {/* Misc */}
      <div className="px-5 pt-4">
        <Card className="px-1.5 py-1">
          <NavRow icon="help" iconBg="bg-[#F4ECE2]" iconColor="text-muted" label="Bantuan & FAQ" />
          <NavRow icon="info" iconBg="bg-[#F4ECE2]" iconColor="text-muted" label="Tentang JajanHub" trailing="v1.4.0" last />
        </Card>
      </div>

      <div className="px-5 pt-5">
        <button
          type="button"
          onClick={() => setLogoutOpen(true)}
          className="w-full bg-danger-soft text-danger rounded-[18px] py-4 font-extrabold text-[15px] flex items-center justify-center gap-2 transition-transform active:scale-[.98]"
        >
          <Icon name="logout" size={18} />
          Keluar
        </button>
      </div>

      <LogoutSheet
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        pending={logout.isPending}
        onConfirm={() => logout.mutate(undefined, { onSuccess: () => router.push('/') })}
      />
    </div>
  );
}

function Stat({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <Card className="flex-1 p-[15px] text-center">
      <div className={`font-display font-extrabold text-2xl ${color}`}>{value}</div>
      <div className="text-[11px] text-faint mt-0.5">{label}</div>
    </Card>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 pt-4">
      <div className="text-xs font-bold text-faint tracking-[.4px] px-1 pb-2">{title}</div>
      <Card className="px-1.5 py-1">{children}</Card>
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
      className={`w-full flex items-center gap-3.5 px-3 py-[15px] transition-colors hover:bg-[#FFF6EE] ${
        last ? '' : 'border-b border-[#F4ECE2]'
      }`}
    >
      <span className={`flex-none w-9 h-9 rounded-[11px] ${iconBg} flex items-center justify-center`}>
        <Icon name={icon} size={19} className={iconColor} />
      </span>
      <span className="flex-1 text-left font-bold text-sm">{label}</span>
      {trailing && <span className="text-xs text-faint mr-0.5">{trailing}</span>}
      <Icon name="chevron-right" size={17} className="text-[#C6B7A8]" />
    </button>
  );
}

function ToggleRow({
  icon,
  iconBg,
  iconColor,
  title,
  sub,
  checked,
  onChange,
  tone,
  last,
}: {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  title: string;
  sub: string;
  checked: boolean;
  onChange: () => void;
  tone?: 'brand' | 'prio';
  last?: boolean;
}) {
  return (
    <div className={`w-full flex items-center gap-3.5 px-3 py-[15px] ${last ? '' : 'border-b border-[#F4ECE2]'}`}>
      <span className={`flex-none w-9 h-9 rounded-[11px] ${iconBg} flex items-center justify-center`}>
        <Icon name={icon} size={19} className={iconColor} />
      </span>
      <span className="flex-1 text-left">
        <span className="block font-bold text-sm">{title}</span>
        <span className="block text-xs text-faint mt-px">{sub}</span>
      </span>
      <Toggle checked={checked} onChange={onChange} tone={tone} label={title} />
    </div>
  );
}
