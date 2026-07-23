'use client';
import { Card, Icon } from '@jajanhub/ui';

const HOURS = [
  { h: '10', pct: 30, hot: false },
  { h: '11', pct: 52, hot: false },
  { h: '12', pct: 100, hot: true },
  { h: '13', pct: 64, hot: false },
  { h: '15', pct: 38, hot: false },
  { h: '17', pct: 58, hot: false },
  { h: '19', pct: 92, hot: true },
  { h: '21', pct: 44, hot: false },
];

const TOP_MENU = [
  { name: 'Ayam Penyet Sambal Ijo', qty: '132 porsi', pct: 100, mint: false },
  { name: 'Nasi Goreng Spesial', qty: '98 porsi', pct: 74, mint: false },
  { name: 'Es Teh Jumbo', qty: '87 gelas', pct: 66, mint: true },
  { name: 'Lele Penyet', qty: '54 porsi', pct: 41, mint: false },
];

export function Analytics() {
  return (
    <div className="animate-screen-in">
      <div className="px-[22px] pt-[22px] pb-1.5">
        <div className="font-display font-extrabold text-2xl tracking-[-.5px]">Laporan Warung</div>
        <div className="text-[13px] text-faint mt-0.5">Ringkasan minggu ini</div>
      </div>

      {/* Free-trial banner */}
      <div className="px-5 pt-3">
        <div className="bg-[linear-gradient(135deg,#7A3BF5,#5B2BC4)] rounded-[20px] px-[18px] py-4 flex items-center gap-3 shadow-[0_10px_24px_rgba(122,59,245,.28)]">
          <div className="flex-none w-[42px] h-[42px] rounded-[13px] bg-white/[.18] flex items-center justify-center">
            <Icon name="bolt" size={22} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-white font-extrabold text-[15px]">Uji Coba Gratis</div>
            <div className="text-[#D8C6FF] text-xs mt-px">Sisa 21 hari · buka semua laporan</div>
          </div>
          <button type="button" className="flex-none bg-white text-prio font-extrabold text-[13px] px-[15px] py-[9px] rounded-xl transition-transform active:scale-95">
            Upgrade
          </button>
        </div>
      </div>

      {/* Stat pair */}
      <div className="px-5 pt-4 flex gap-3">
        <Card className="flex-1 p-[18px]">
          <div className="text-[13px] text-faint font-semibold">Rata-rata waktu layan</div>
          <div className="font-display font-extrabold text-[36px] leading-none mt-1.5">
            8<span className="text-lg text-faint"> mnt</span>
          </div>
          <div className="text-xs text-mint-deep font-bold mt-1">2 mnt lebih cepat</div>
        </Card>
        <Card className="flex-1 p-[18px]">
          <div className="text-[13px] text-faint font-semibold">Pelanggan baru</div>
          <div className="font-display font-extrabold text-[36px] leading-none mt-1.5">17</div>
          <div className="text-xs text-mint-deep font-bold mt-1">minggu ini</div>
        </Card>
      </div>

      {/* Busiest hours */}
      <div className="px-5 pt-4">
        <Card className="p-5">
          <div className="font-display font-extrabold text-[17px] mb-0.5">Jam Paling Ramai</div>
          <div className="text-[13px] text-faint mb-[18px]">Paling laris jam 12 & 19</div>
          <div className="flex items-end gap-[7px] h-[130px]">
            {HOURS.map((b) => (
              <div key={b.h} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div
                  className={cnBar(b.hot)}
                  style={{ height: `${b.pct}%`, transformOrigin: 'bottom' }}
                />
                <span className={`text-[11px] ${b.hot ? 'text-brand-deep font-extrabold' : 'text-faint'}`}>{b.h}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top menu */}
      <div className="px-5 pt-4">
        <Card className="p-5">
          <div className="font-display font-extrabold text-[17px] mb-4">Menu Terlaris</div>
          <div className="flex flex-col gap-3.5">
            {TOP_MENU.map((m) => (
              <div key={m.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-bold">{m.name}</span>
                  <span className="text-faint font-semibold">{m.qty}</span>
                </div>
                <div className="h-[9px] rounded-full bg-[#F4ECE2]">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${m.pct}%`,
                      background: m.mint ? 'linear-gradient(90deg,#34C9A8,#16C784)' : 'linear-gradient(90deg,#FF9A3D,#FF7A1A)',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Premium locked cards */}
      <div className="px-5 pt-4">
        <PremiumCard title="Tren Pendapatan Mingguan" tall />
      </div>
      <div className="px-5 pt-3.5">
        <PremiumCard title="Bandingkan dengan Warung Sekitar" />
      </div>
    </div>
  );
}

function cnBar(hot: boolean): string {
  return `w-full rounded-[7px_7px_4px_4px] animate-[barGrow_.5s_ease] ${
    hot ? 'bg-[linear-gradient(#FF9A3D,#FF7A1A)]' : 'bg-[#FFC48A]'
  }`;
}

function PremiumCard({ title, tall }: { title: string; tall?: boolean }) {
  return (
    <div className="relative bg-white rounded-[22px] p-5 shadow-card overflow-hidden">
      <div className="blur-[7px] opacity-60 pointer-events-none">
        <div className="font-display font-extrabold text-[17px] mb-3.5">{title}</div>
        <div className="flex items-end gap-2 h-[110px]">
          {[50, 70, 45, 85, 60, 100, 78].map((h, i) => (
            <div key={i} className="flex-1 rounded-md bg-[#FFB067]" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-2.5 bg-white/35">
        {tall ? (
          <>
            <div className="w-12 h-12 rounded-[15px] bg-prio-ink flex items-center justify-center shadow-[0_8px_20px_rgba(42,26,62,.3)]">
              <LockIcon color="#fff" />
            </div>
            <div className="font-display font-extrabold text-base">Fitur Premium</div>
            <button type="button" className="bg-prio text-white font-extrabold text-sm px-5 py-[11px] rounded-[14px] shadow-[0_8px_20px_rgba(122,59,245,.34)] transition-transform active:scale-95">
              Buka dengan JajanHub Pro
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2.5">
            <LockIcon color="#7A3BF5" />
            <span className="font-extrabold text-sm text-prio">Fitur Premium</span>
          </div>
        )}
      </div>
    </div>
  );
}

function LockIcon({ color }: { color: string }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="5" y="11" width="14" height="9" rx="2.5" stroke={color} strokeWidth="2" />
      <path d="M8 11V8a4 4 0 0 1 8 0v3" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
