import { Icon, cn } from '@jajanhub/ui';
import { VendorTopBar } from '../VendorTopBar';

const HOURLY = [
  { label: '09', v: 6 }, { label: '10', v: 14 }, { label: '11', v: 34 }, { label: '12', v: 42 },
  { label: '13', v: 28 }, { label: '14', v: 11 }, { label: '19', v: 24 }, { label: '20', v: 18 },
];
const TOP_MENU = [
  { name: 'Ayam Penyet Sambal Ijo', count: 84 },
  { name: 'Nasi Goreng Spesial', count: 61 },
  { name: 'Es Teh Jumbo', count: 57 },
  { name: 'Lele Penyet', count: 38 },
  { name: 'Seblak Ceker Pedas', count: 29 },
];

/**
 * Desktop Analytics — matches Antre/Antri Pedagang Desktop.dc.html's
 * `isReport` grid (stat row + hourly chart + top-menu list). The reference
 * only has real backing data for 2 metrics (avg serve, new customers) —
 * shown as a 2-card row rather than inventing 2 more numbers to fill a
 * 4-column grid. The free-trial banner + blurred premium cards aren't in
 * the reference at all, but are kept (styled for the desktop grid) since
 * they're a real feature already shipped on mobile — dropping them here
 * would silently regress that upsell, not just diverge from the reference.
 */
export function AnalyticsDesktopView() {
  const maxV = Math.max(...HOURLY.map((h) => h.v));
  const maxCount = Math.max(...TOP_MENU.map((m) => m.count));

  return (
    <>
      <VendorTopBar title="Analitik" sub="Performa 7 hari terakhir" />
      <div className="p-[28px_34px_44px] flex flex-col gap-[22px] animate-screen-in">
        <div className="bg-[linear-gradient(135deg,#7A3BF5,#5B2BC4)] rounded-[20px] px-5 py-4 flex items-center gap-3 shadow-[0_10px_24px_rgba(122,59,245,.28)]">
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

        <div className="grid grid-cols-2 gap-[18px]">
          <div className="bg-white rounded-[20px] p-5 shadow-card">
            <div className="text-[13px] text-faint font-semibold">Rata-rata waktu layan</div>
            <div className="font-display font-extrabold text-[30px] leading-none mt-2">
              8<span className="text-lg text-faint"> mnt</span>
            </div>
            <div className="text-xs text-mint-deep font-bold mt-1.5">2 mnt lebih cepat</div>
          </div>
          <div className="bg-white rounded-[20px] p-5 shadow-card">
            <div className="text-[13px] text-faint font-semibold">Pelanggan baru</div>
            <div className="font-display font-extrabold text-[30px] leading-none mt-2">17</div>
            <div className="text-xs text-mint-deep font-bold mt-1.5">minggu ini</div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-[18px]">
          <div className="bg-white rounded-[22px] p-6 shadow-card">
            <div className="font-display font-extrabold text-lg mb-1.5">Jam tersibuk</div>
            <div className="text-[13px] text-faint mb-[18px]">Rata-rata pesanan per jam</div>
            <div className="flex items-end justify-between gap-2 h-[170px]">
              {HOURLY.map((h) => (
                <div key={h.label} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                  <div
                    className="w-full max-w-[26px] rounded-[7px] origin-bottom animate-[barGrow_.5s_ease_both]"
                    style={{ height: `${Math.round((h.v / maxV) * 100)}%`, background: h.v === maxV ? '#FF7A1A' : '#FFC48A' }}
                  />
                  <div className="text-[11px] font-bold text-faint">{h.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-[22px] p-6 shadow-card">
            <div className="font-display font-extrabold text-lg mb-[18px]">Menu terlaris minggu ini</div>
            <div className="flex flex-col gap-4">
              {TOP_MENU.map((m) => (
                <div key={m.name}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-bold">{m.name}</span>
                    <span className="font-extrabold text-faint">{m.count} porsi</span>
                  </div>
                  <div className="h-[9px] rounded-full bg-[#F1E7DC] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[linear-gradient(90deg,#FF9A3D,#FF7A1A)] animate-[barGrow_.6s_ease_both]"
                      style={{ width: `${Math.round((m.count / maxCount) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <PremiumCard title="Tren Pendapatan Mingguan" tall />
        <PremiumCard title="Bandingkan dengan Warung Sekitar" />
      </div>
    </>
  );
}

function PremiumCard({ title, tall }: { title: string; tall?: boolean }) {
  return (
    <div className="relative bg-white rounded-[22px] p-6 shadow-card overflow-hidden">
      <div className="blur-[7px] opacity-60 pointer-events-none">
        <div className="font-display font-extrabold text-lg mb-3.5">{title}</div>
        <div className="flex items-end gap-2.5 h-[110px]">
          {[50, 70, 45, 85, 60, 100, 78, 66, 90].map((h, i) => (
            <div key={i} className="flex-1 rounded-md bg-[#FFB067]" style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
      <div className={cn('absolute inset-0 flex items-center justify-center gap-2.5 bg-white/40', tall && 'flex-col')}>
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
          <>
            <LockIcon color="#7A3BF5" />
            <span className="font-extrabold text-sm text-prio">Fitur Premium</span>
          </>
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
