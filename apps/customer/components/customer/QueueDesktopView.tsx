import Link from 'next/link';
import { QrCode, cn } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { QueueSteps } from './QueueSteps';
import { CancelModal } from './CancelModal';
import type { QueueScreenView } from './useQueueScreen';

/**
 * Desktop Queue screen — 2-column grid matching Antre/Antri Desktop.dc.html's
 * `isQueue` state. Unlike mobile, the pickup code is always visible here
 * (not gated behind a separate `/pickup` route reached only once ready) —
 * that's the reference's own design, not a bug: desktop has room to show
 * everything about the order at once.
 */
export function QueueDesktopView(vm: QueueScreenView) {
  if (vm.isLoading) return <LoadingState label="Memuat antrean…" />;
  if (vm.isError || !vm.order) return <ErrorState onRetry={vm.refetch} />;

  const { order, stage } = vm;
  const headline = stage >= 2 ? 'Pesananmu siap! 🎉' : vm.ahead <= 0 ? 'Bentar lagi giliranmu' : 'Pesananmu lagi diproses';
  const sub =
    stage >= 2
      ? 'Langsung ambil ke gerobak dan tunjukkan kode di bawah.'
      : 'Santai aja, kami kabarin pas nomormu dipanggil. Nggak perlu berdiri antre.';

  return (
    <div className="flex-1 min-w-0 overflow-y-auto p-10 flex justify-center animate-screen-in">
      <div className="w-full max-w-[920px] grid grid-cols-2 gap-[22px] items-start">
        {/* Hero */}
        <div className="col-span-2 bg-[linear-gradient(150deg,#FFB870,#FF7A1A_60%,#E4560A)] rounded-[26px] p-[34px] text-white relative overflow-hidden flex items-center gap-[34px]">
          <div className="flex-none text-center">
            <div className="text-sm opacity-90 font-semibold">Nomor antreanmu</div>
            <div
              key={order.queueNumber}
              className="font-display font-extrabold text-[92px] leading-[.9] tracking-[-2px] animate-qnum"
            >
              {order.queueLetter}
              {order.queueNumber}
            </div>
          </div>
          <div className="flex-1">
            <div className="font-display font-extrabold text-[26px] leading-[1.15]">{headline}</div>
            <div className="text-[15px] opacity-95 mt-2 leading-[1.5]">{sub}</div>
            <div className="flex gap-3 mt-[18px]">
              <div className="bg-white/[.18] rounded-[15px] px-[18px] py-[14px]">
                <div className="text-xs opacity-90">Di depanmu</div>
                <div key={vm.ahead} className="font-display font-extrabold text-2xl leading-none mt-[3px] animate-numflip">
                  {vm.ahead > 0 ? vm.ahead : 0}
                </div>
              </div>
              <div className="bg-white/[.18] rounded-[15px] px-[18px] py-[14px]">
                <div className="text-xs opacity-90">Estimasi</div>
                <div key={vm.eta} className="font-display font-extrabold text-2xl leading-none mt-[3px] animate-numflip">
                  ~{vm.eta} mnt
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Left: status timeline */}
        <div className="bg-white rounded-[22px] p-[26px] shadow-card">
          <div className="font-display font-extrabold text-lg mb-5">Status pesanan</div>
          <QueueSteps stage={stage} />
        </div>

        {/* Right: pickup code (always visible) + cancel */}
        <div className="flex flex-col gap-[22px]">
          <div className="bg-ink rounded-[22px] p-[26px] text-white text-center">
            <div className="text-[13px] text-[#C9B8A6] font-semibold">Tunjukkan ini saat ambil</div>
            <div className="font-display font-extrabold text-[44px] tracking-[6px] my-2.5">{order.pickupCode}</div>
            <div className="w-[132px] h-[132px] bg-white rounded-2xl mx-auto p-[11px] overflow-hidden">
              <div className="w-[110px] h-[110px] overflow-hidden">
                <div className="origin-top-left scale-[.491]">
                  <QrCode seed={order.queueNumber * 11 + 5} />
                </div>
              </div>
            </div>
            <div className="text-[12.5px] text-[#C9B8A6] mt-3.5 leading-[1.5]">
              Sebutkan kode atau scan QR ini ke penjual pas nomormu dipanggil
            </div>
          </div>

          {/* Reference doesn't model a pickup-confirmation step (it treats
              "show code" as the terminal state) — this app has one, so keep
              it reachable. Falls back to the mobile Pickup view (D0 rule),
              centered wider, since there's no desktop design for it yet. */}
          {vm.isReady && (
            <Link
              href={`/order/${order.id}/pickup`}
              className="text-center text-mint-deep font-bold text-sm py-1"
            >
              Sudah diambil? Konfirmasi di sini →
            </Link>
          )}

          {vm.canCancel && (
            <button
              type="button"
              onClick={vm.openCancel}
              className="border border-[#F0D9D3] bg-white text-brand-press font-bold text-[14.5px] py-[15px] rounded-[15px] transition-transform active:scale-[.98]"
            >
              Batalkan pesanan
            </button>
          )}
          {vm.cannotCancel && (
            <div className={cn('bg-[#FAF4EC] border border-[#F1E7DC] rounded-2xl px-[15px] py-[13px] text-center text-xs text-faint leading-[1.4]')}>
              Pesanan udah mulai dimasak, jadi nggak bisa dibatalkan lagi ya
            </div>
          )}
        </div>
      </div>

      <CancelModal open={vm.cancelOpen} onClose={vm.closeCancel} onConfirm={vm.confirmCancel} pending={vm.cancelPending} />
    </div>
  );
}
