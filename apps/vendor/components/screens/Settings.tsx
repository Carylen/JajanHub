'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { IconButton, Icon, Toggle, type IconName } from '@jajanhub/ui';

export function Settings() {
  const router = useRouter();
  const [notifOrder, setNotifOrder] = useState(true);
  const [soundVibe, setSoundVibe] = useState(true);
  const [autoPrint, setAutoPrint] = useState(false);
  const [autoPayout, setAutoPayout] = useState(true);

  return (
    <div className="animate-screen-in pb-8">
      {/* Dark header */}
      <div className="relative bg-[linear-gradient(150deg,#23180F,#3A2A1C)] px-[22px] pt-5 pb-14 overflow-hidden">
        <div className="relative flex items-center gap-3">
          <IconButton aria-label="Kembali" tone="translucent" onClick={() => router.back()}>
            <Icon name="chevron-left" size={19} strokeWidth={2.2} />
          </IconButton>
          <div className="text-white font-display font-extrabold text-xl">Pengaturan</div>
        </div>
      </div>

      {/* Identity */}
      <div className="mx-5 -mt-10 relative">
        <div className="bg-white rounded-[24px] p-[18px] shadow-soft flex items-center gap-[15px]">
          <div className="flex-none w-[60px] h-[60px] rounded-[19px] bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] flex items-center justify-center text-white font-display font-extrabold text-[22px] shadow-[0_6px_16px_rgba(255,122,26,.3)]">
            PB
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-extrabold text-[18px] leading-[1.15]">Ayam Penyet My Bosz</div>
            <div className="inline-flex items-center gap-[5px] bg-mint/[.13] text-mint-deep font-bold text-[11px] px-[9px] py-[3px] rounded-full mt-[5px]">
              <Icon name="check" size={11} className="text-mint-deep" strokeWidth={2.6} />
              Gerobak terverifikasi
            </div>
          </div>
          <IconButton aria-label="Edit warung" tone="brand">
            <Icon name="edit" size={18} />
          </IconButton>
        </div>
      </div>

      {/* Warung info */}
      <Section title="INFO WARUNG">
        <NavRow icon="map-pin" iconBg="bg-[#E7FBF2]" iconColor="text-mint-deep" title="Alamat gerobak" sub="Jl. Merdeka No.12, Bandung" />
        <NavRow icon="clock" iconBg="bg-[#FFF3E7]" iconColor="text-brand-deep" title="Jam operasional" sub="Setiap hari · 10.00 – 22.00" />
        <NavRow icon="phone" iconBg="bg-[#E7FBF2]" iconColor="text-mint-deep" title="Nomor WhatsApp" sub="+62 813-2200-1180" last />
      </Section>

      {/* Payment */}
      <Section title="PEMBAYARAN">
        <NavRow icon="card" iconBg="bg-prio-soft" iconColor="text-prio" title="Rekening pencairan" sub="BCA •••• 3391 · Budi Santoso" />
        <ToggleRow icon="download" iconBg="bg-[#E7FBF2]" iconColor="text-mint-deep" title="Pencairan otomatis" sub="Cairkan tiap tutup warung" checked={autoPayout} onChange={() => setAutoPayout((v) => !v)} last />
      </Section>

      {/* Pro upsell */}
      <div className="px-5 pt-4">
        <div className="relative bg-[linear-gradient(135deg,#7A3BF5,#5B2BC4)] rounded-[22px] p-5 shadow-[0_10px_24px_rgba(122,59,245,.28)] overflow-hidden">
          <div className="inline-flex items-center gap-1.5 bg-white/[.18] text-white font-bold text-xs px-[11px] py-[5px] rounded-full">
            <Icon name="bolt" size={13} className="text-white" />
            Uji coba · sisa 21 hari
          </div>
          <div className="text-white font-display font-extrabold text-xl mt-3 leading-[1.2]">JajanHub Pro buat warungmu</div>
          <div className="text-[#E4D6FF] text-[13px] mt-1 leading-[1.45]">Laporan lengkap, banding warung sekitar, & tanpa biaya layanan tambahan.</div>
          <button type="button" className="mt-3.5 bg-white text-prio font-extrabold text-sm px-[18px] py-[11px] rounded-[13px] transition-transform active:scale-95">
            Upgrade – Rp49rb/bln
          </button>
        </div>
      </div>

      {/* Preferences */}
      <Section title="PREFERENSI">
        <ToggleRow icon="bell" iconBg="bg-[#FFF3E7]" iconColor="text-brand-deep" title="Notifikasi pesanan baru" sub="Muncul tiap ada pesanan masuk" checked={notifOrder} onChange={() => setNotifOrder((v) => !v)} />
        <ToggleRow icon="volume" iconBg="bg-prio-soft" iconColor="text-prio" title="Suara & getar" sub="Biar kedengeran pas lagi masak" checked={soundVibe} tone="prio" onChange={() => setSoundVibe((v) => !v)} />
        <ToggleRow icon="printer" iconBg="bg-[#F4ECE2]" iconColor="text-muted" title="Cetak struk otomatis" sub="Perlu printer bluetooth" checked={autoPrint} onChange={() => setAutoPrint((v) => !v)} last />
      </Section>

      {/* Misc */}
      <div className="px-5 pt-4">
        <div className="bg-white rounded-[22px] px-1.5 py-1 shadow-card">
          <NavRow icon="help" iconBg="bg-[#F4ECE2]" iconColor="text-muted" title="Bantuan & Hubungi Kami" />
          <NavRow icon="info" iconBg="bg-[#F4ECE2]" iconColor="text-muted" title="Tentang JajanHub Pedagang" trailing="v1.4.0" last />
        </div>
      </div>

      <div className="px-5 pt-5">
        <button
          type="button"
          onClick={() => router.push('/beranda')}
          className="w-full bg-danger-soft text-danger rounded-[18px] py-4 font-extrabold text-[15px] flex items-center justify-center gap-2 transition-transform active:scale-[.98]"
        >
          <Icon name="logout" size={18} />
          Keluar
        </button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="px-5 pt-4">
      <div className="text-xs font-bold text-faint tracking-[.4px] px-1 pb-2">{title}</div>
      <div className="bg-white rounded-[22px] px-1.5 py-1 shadow-card">{children}</div>
    </div>
  );
}

function NavRow({
  icon,
  iconBg,
  iconColor,
  title,
  sub,
  trailing,
  last,
}: {
  icon: IconName;
  iconBg: string;
  iconColor: string;
  title: string;
  sub?: string;
  trailing?: string;
  last?: boolean;
}) {
  return (
    <button type="button" className={`w-full flex items-center gap-3.5 px-3 py-[15px] transition-colors hover:bg-[#FFF6EE] ${last ? '' : 'border-b border-[#F4ECE2]'}`}>
      <span className={`flex-none w-9 h-9 rounded-[11px] ${iconBg} flex items-center justify-center`}>
        <Icon name={icon} size={19} className={iconColor} />
      </span>
      <span className="flex-1 text-left">
        <span className="block font-bold text-sm">{title}</span>
        {sub && <span className="block text-xs text-faint mt-px">{sub}</span>}
      </span>
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
