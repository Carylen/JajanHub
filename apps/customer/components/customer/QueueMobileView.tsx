import { formatQueueCode } from '@jajanhub/api';
import { Button, Card, Icon, Spinner, cn } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { QueueSteps } from './QueueSteps';
import { CancelSheet } from './CancelSheet';
import { AddonSheet } from './AddonSheet';
import type { QueueScreenView } from './useQueueScreen';

const STATUS_TEXT: Record<number, string> = { 0: 'Pesanan Diterima', 1: 'Lagi Dimasak!', 2: 'Siap Diambil!' };
const STATUS_SUB: Record<number, string> = {
  0: 'Nunggu giliran masuk dapur',
  1: 'Sabar ya, enak nggak bakal lari',
  2: 'Buruan ke gerobak, mumpung hangat!',
};
const STATUS_STYLE: Record<number, string> = {
  0: 'bg-[#FFF0E0] text-[#B8791F]',
  1: 'bg-[#FFEDD9] text-brand-deep',
  2: 'bg-mint-soft text-mint-deep',
};

/** Pure presentation — all data/effects/mutations live in useQueueScreen(). */
export function QueueMobileView(vm: QueueScreenView) {
  if (vm.isLoading) return <LoadingState label="Memuat antrean…" />;
  if (vm.isError || !vm.order) return <ErrorState onRetry={vm.refetch} />;

  const { order, stage } = vm;

  return (
    <div className="animate-screen-in min-h-screen bg-[linear-gradient(180deg,#FFF8F1,#FFF1E4)] pb-8">
      {vm.isReady && (
        <div className="fixed left-1/2 -translate-x-1/2 top-3.5 w-[calc(100%-32px)] max-w-[388px] z-40 bg-[#0F1F17] rounded-[18px] px-[15px] py-[13px] flex items-center gap-3 shadow-[0_16px_34px_rgba(15,31,23,.34)] animate-toast-in">
          <div className="flex-none w-9 h-9 rounded-[11px] bg-mint flex items-center justify-center">
            <Icon name="bell" size={20} className="text-white" />
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-sm">Pesananmu siap!</div>
            <div className="text-[#9DBFAF] text-xs">Ambil di gerobak, tunjukin nomor antrianmu ya</div>
          </div>
        </div>
      )}
      {vm.addon.justAdded && (
        <div className="fixed left-1/2 -translate-x-1/2 top-3.5 w-[calc(100%-32px)] max-w-[388px] z-40 bg-[#0F1F17] rounded-[18px] px-[15px] py-[13px] flex items-center gap-3 shadow-[0_16px_34px_rgba(15,31,23,.34)] animate-toast-in">
          <div className="flex-none w-9 h-9 rounded-[11px] bg-mint flex items-center justify-center">
            <Icon name="check" size={20} className="text-white" strokeWidth={2.6} />
          </div>
          <div className="flex-1">
            <div className="text-white font-bold text-sm">Tambahan masuk ke antrian!</div>
            <div className="text-[#9DBFAF] text-xs">Dimasak bareng pesanan utamamu</div>
          </div>
        </div>
      )}

      <div className="px-5 pt-[18px] pb-1 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="w-[9px] h-[9px] rounded-full bg-mint animate-pulse" />
          <span className="text-[13px] text-muted font-semibold">Pesanan {order.code} · live</span>
        </div>
        <span className="text-xs text-faint">{order.vendorName.split(' ').slice(-1)}</span>
      </div>

      <div className="text-center mt-5">
        <div className="text-[13px] text-faint font-semibold tracking-[.5px]">NOMOR ANTRIANMU</div>
        <div className="flex items-baseline justify-center gap-1 mt-0.5">
          <span className="font-display font-extrabold text-[34px] text-brand leading-none">{formatQueueCode(order).charAt(0)}</span>
          <span
            key={order.queueNumber}
            className="font-display font-extrabold text-[128px] text-ink leading-[.9] tracking-[-4px] animate-qnum"
          >
            {order.queueNumber}
          </span>
        </div>
        <div className="mt-3.5">
          <span className={cn('inline-flex items-center gap-2 font-extrabold text-[15px] px-[18px] py-[9px] rounded-full', STATUS_STYLE[stage])}>
            {STATUS_TEXT[stage]}
          </span>
        </div>
        <div className="text-faint text-[13px] mt-2.5 leading-[1.4]">{STATUS_SUB[stage]}</div>
        {order.addons.length > 0 && (
          <div className="mt-3">
            <span className="inline-flex items-center gap-[7px] bg-mint-soft text-[#0E7A56] font-bold text-xs px-[14px] py-[7px] rounded-full">
              <Icon name="plus" size={14} className="text-mint" strokeWidth={2.6} />
              {order.addons.length} tambahan sudah masuk
            </span>
          </div>
        )}
      </div>

      <div className="mx-5 mt-[22px] flex gap-3">
        <Card className="flex-1 p-[15px] text-center">
          <div key={vm.ahead} className="font-display font-extrabold text-2xl text-ink animate-numflip">
            {vm.ahead > 0 ? vm.ahead : 0}
          </div>
          <div className="text-[11px] text-faint mt-0.5">di depanmu</div>
        </Card>
        <Card className="flex-1 p-[15px] text-center">
          <div key={vm.eta} className="font-display font-extrabold text-2xl text-ink animate-numflip">
            {vm.eta > 0 ? `±${vm.eta}` : '≈'}
          </div>
          <div className="text-[11px] text-faint mt-0.5">{vm.eta > 0 ? 'menit lagi' : 'sebentar lagi'}</div>
        </Card>
      </div>

      <div className="mx-5 mt-3 bg-white rounded-2xl px-[15px] py-3 flex items-center gap-[11px] shadow-card">
        <span className={cn('flex-none inline-flex items-center gap-1.5 font-bold text-xs px-[11px] py-1.5 rounded-full', vm.tone.bg, vm.tone.color)}>
          <span className={cn('w-[7px] h-[7px] rounded-full animate-pulse', vm.tone.dot)} />
          {vm.tone.label}
        </span>
        <span className="flex-1 text-xs text-faint leading-[1.35]">
          Estimasi dihitung dari kecepatan masak hari ini, bukan tebakan
        </span>
      </div>

      <Card className="mx-5 mt-4 px-5 pt-5 pb-1">
        <QueueSteps stage={stage} />
      </Card>

      {!vm.isReady && vm.addon.canOpen && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[22px] w-full max-w-app px-[18px] z-[34] flex justify-end pointer-events-none">
          <button
            type="button"
            onClick={vm.addon.openFlow}
            className="pointer-events-auto rounded-full bg-brand text-white font-extrabold text-sm px-5 py-[13px] flex items-center gap-[9px] shadow-[0_12px_28px_rgba(255,122,26,.45)] animate-floaty transition-transform active:scale-95"
          >
            <Icon name="plus" size={19} className="text-white" strokeWidth={2.6} />
            Tambah Pesanan
          </button>
        </div>
      )}
      {!vm.isReady && !vm.addon.canOpen && order.addons.length > 0 && (
        <div className="fixed left-1/2 -translate-x-1/2 bottom-[22px] w-full max-w-app px-[18px] z-[34] flex justify-end pointer-events-none">
          <div className="pointer-events-auto bg-[#F1E7DC] text-faint rounded-full px-[17px] py-[11px] flex items-center gap-2 font-bold text-[12.5px] shadow-[0_6px_16px_rgba(35,24,15,.12)]">
            <Icon name="check-circle" size={15} />
            Maks. 2 tambahan tercapai
          </div>
        </div>
      )}

      <div className="px-5 pt-4">
        {vm.isReady ? (
          <Button variant="mint" fullWidth className="animate-ringpulse" onClick={vm.goPickup}>
            <Icon name="grid" size={19} className="text-white" />
            Lihat Kode Pengambilan
          </Button>
        ) : (
          <div className="text-center text-faint text-[13px] flex items-center justify-center gap-[7px]">
            <Spinner className="w-4 h-4 border-2" />
            Kami kabari begitu siap, santai aja
          </div>
        )}

        <div className="mt-3.5">
          {vm.canCancel && (
            <button
              type="button"
              onClick={vm.openCancel}
              className="w-full bg-white border-[1.5px] border-[#F3C9C0] text-danger rounded-2xl py-3.5 font-bold text-sm transition-transform active:scale-[.98]"
            >
              Batalkan Pesanan
            </button>
          )}
          {vm.cannotCancel && (
            <div className="bg-[#FAF4EC] border border-[#F1E7DC] rounded-2xl px-[15px] py-[13px] flex items-center gap-[11px]">
              <span className="flex-none w-[30px] h-[30px] rounded-[9px] bg-[#FFEDD9] flex items-center justify-center">
                <Icon name="clock" size={17} className="text-brand-deep" strokeWidth={2} />
              </span>
              <div className="text-xs text-faint leading-[1.4]">
                Pesanan udah mulai dimasak, jadi nggak bisa dibatalkan lagi ya
              </div>
            </div>
          )}
        </div>
      </div>

      <CancelSheet
        open={vm.cancelOpen}
        onClose={vm.closeCancel}
        refundAmount={order.totalRp}
        onConfirm={vm.confirmCancel}
        pending={vm.cancelPending}
      />
      <AddonSheet
        vm={vm.addon}
        orderNo={formatQueueCode(order)}
        orderSeed={order.queueNumber * 13 + 7}
        merchantName={order.vendorName}
      />
    </div>
  );
}
