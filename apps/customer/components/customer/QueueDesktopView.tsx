import { formatQueueCode } from '@jajanhub/api';
import { Icon, QrCode, cn } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { QueueSteps } from './QueueSteps';
import { CancelModal } from './CancelModal';
import { AddonModal } from './AddonModal';
import { RatingModal } from './RatingModal';
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
              {formatQueueCode(order)}
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

          {/* Reference's `queueReady` CTA ("Sudah diambil · kasih rating")
              both confirms pickup and opens rating in one click — desktop
              already shows the code inline (no need for mobile's separate
              /pickup route), so it can do the same here. Mobile keeps its
              explicit two-step confirm-then-rate flow (BRIEF's product
              decision to keep a pickup-confirmation step at all); both share
              `usePickupFlow` for the mutation + rating state. */}
          {vm.isReady && (
            <button
              type="button"
              onClick={() => vm.pickup.confirm(() => vm.pickup.openRating())}
              disabled={vm.pickup.confirmPending || order.status === 'picked_up'}
              className="rounded-2xl py-[15px] font-extrabold text-[15px] bg-mint text-white shadow-[0_10px_22px_rgba(22,199,132,.3)] flex items-center justify-center gap-2 transition-transform active:scale-[.98] disabled:opacity-70"
            >
              <Icon name="check" size={18} className="text-white" strokeWidth={2.6} />
              {order.status === 'picked_up' ? 'Sudah dikonfirmasi' : vm.pickup.confirmPending ? 'Menyimpan…' : 'Sudah diambil · kasih rating'}
            </button>
          )}

          {!vm.isReady && (
            <div className="bg-white rounded-[22px] p-5 shadow-card">
              {order.addons.length > 0 && (
                <div className="flex items-center gap-[9px] bg-mint-soft rounded-[13px] px-[13px] py-[11px] mb-3.5">
                  <span className="flex-none w-[26px] h-[26px] rounded-lg bg-mint flex items-center justify-center">
                    <Icon name="check" size={15} className="text-white" strokeWidth={2.8} />
                  </span>
                  <div className="flex-1">
                    <div className="font-extrabold text-[13px] text-mint-deep">{order.addons.length} tambahan sudah masuk</div>
                    <div className="text-[11.5px] text-[#5AAE8C]">Diproses bareng pesanan utama</div>
                  </div>
                </div>
              )}
              <button
                type="button"
                onClick={vm.addon.openFlow}
                disabled={!vm.addon.canOpen}
                className={cn(
                  'w-full rounded-2xl py-[15px] font-extrabold text-[15px] flex items-center justify-center gap-2 transition-transform active:scale-[.98]',
                  vm.addon.canOpen ? 'bg-[#FFF3E7] text-brand-deep' : 'bg-[#EFE6DA] text-faint cursor-not-allowed',
                )}
              >
                <Icon name="plus" size={18} />
                Tambah Pesanan
              </button>
              {!vm.addon.canOpen && (
                <div className="text-center text-xs text-faint mt-2.5">Maksimal 2 tambahan per antrean sudah tercapai</div>
              )}
            </div>
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
      <AddonModal vm={vm.addon} orderNo={formatQueueCode(order)} orderSeed={order.queueNumber * 13 + 7} />
      <RatingModal
        open={vm.pickup.ratingOpen}
        onClose={vm.pickup.finish}
        merchantName={order.vendorName}
        orderCode={order.code}
        onSubmit={vm.pickup.finish}
      />
    </div>
  );
}
