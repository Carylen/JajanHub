'use client';
import { formatQueueCode, minutesSince, type Order, type OrderStatus } from '@jajanhub/api';
import { Icon, Money, cn, type IconName } from '@jajanhub/ui';

export interface StatusConfig {
  chipText: string;
  chipClass: string;
  cooking: boolean;
  btnLabel: string;
  btnClass: string;
  btnIcon: IconName;
}

/** Exported so KanbanOrderCard (desktop) reuses the same text/icon/cooking
 * mapping, applying its own color classes for the reference's palette. */
export const ORDER_STATUS_CONFIG: Record<Exclude<OrderStatus, 'pending_payment' | 'picked_up' | 'cancelled' | 'rejected'>, StatusConfig> = {
  waiting_confirmation: {
    chipText: 'Pesanan Baru',
    chipClass: 'bg-[#FFF0E0] text-[#B8791F]',
    cooking: false,
    btnLabel: 'Mulai Masak',
    btnClass: 'bg-brand text-white shadow-[0_8px_18px_rgba(255,122,26,.32)]',
    btnIcon: 'play',
  },
  cooking: {
    chipText: 'Sedang Dimasak',
    chipClass: 'bg-[#FFEDD9] text-brand-deep',
    cooking: true,
    btnLabel: 'Tandai Siap',
    btnClass: 'bg-mint text-white shadow-[0_8px_18px_rgba(22,199,132,.32)]',
    btnIcon: 'check',
  },
  ready: {
    chipText: 'Siap Diambil',
    chipClass: 'bg-mint-soft text-mint-deep',
    cooking: false,
    btnLabel: 'Sudah Diambil',
    btnClass: 'bg-ink text-white shadow-[0_8px_18px_rgba(35,24,15,.25)]',
    btnIcon: 'bag',
  },
};

interface OrderCardProps {
  order: Order;
  onAdvance: () => void;
  onReject: () => void;
}

export function OrderCard({ order, onAdvance, onReject }: OrderCardProps) {
  const cfg = order.status === 'rejected' ? null : ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG];
  const rejected = cfg == null;
  const num = formatQueueCode(order).replace(/^[A-Za-z]+/, '');
  const canReject = !rejected && (order.status === 'waiting_confirmation' || order.status === 'cooking');

  return (
    <div
      className={cn(
        'rounded-[24px] p-[18px] shadow-[0_6px_18px_rgba(35,24,15,.06)] relative',
        rejected ? 'bg-[#F7F1E9] border border-[#EADFD2] opacity-90' : order.isPriority ? 'bg-[#FBF8FF] border-2 border-[#C9B0FF]' : 'bg-white border border-[#F1E7DC]',
      )}
    >
      {order.isPriority && !rejected && (
        <span className="absolute -top-[9px] left-[18px] bg-prio text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-[0_5px_12px_rgba(122,59,245,.4)] flex items-center gap-1.5">
          <Icon name="bolt" size={12} className="text-white" />
          PRIORITAS
        </span>
      )}
      {rejected && (
        <span className="absolute -top-[9px] left-[18px] bg-brand-press text-white text-[11px] font-extrabold px-3 py-1 rounded-full shadow-[0_5px_12px_rgba(196,64,47,.35)]">
          DITOLAK
        </span>
      )}

      <div className="flex items-center gap-3.5">
        <div
          className="flex-none w-[58px] h-[58px] rounded-[17px] flex flex-col items-center justify-center text-white"
          style={{
            background: rejected ? '#C6B7A8' : order.isPriority ? 'linear-gradient(135deg,#A879FF,#7A3BF5)' : 'linear-gradient(135deg,#FFB870,#FF7A1A)',
            boxShadow: rejected ? 'none' : `0 5px 14px ${order.isPriority ? 'rgba(122,59,245,.35)' : 'rgba(255,122,26,.32)'}`,
          }}
        >
          <span className="font-display font-extrabold text-xl leading-none">{num}</span>
          <span className="text-[9px] opacity-85 font-semibold">{rejected ? 'DITOLAK' : 'ANTRIAN'}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <div className={cn('inline-flex items-center gap-1.5 font-bold text-xs px-[11px] py-1 rounded-full', rejected ? 'bg-[#FBEEE9] text-brand-press' : cfg!.chipClass)}>
              {cfg?.cooking && <span className="w-[11px] h-[11px] rounded-full border-2 border-[rgba(228,86,10,.3)] border-t-brand-deep animate-spin" />}
              {rejected ? 'Ditolak' : cfg!.chipText}
            </div>
            {order.addons.length > 0 && (
              <span className="inline-flex items-center gap-1 bg-mint-soft text-mint-deep font-extrabold text-[11px] px-2 py-1 rounded-full">
                +{order.addons.length} tambahan
              </span>
            )}
          </div>
          <div className="text-[13px] text-faint mt-1.5">Menunggu {minutesSince(order.createdAt)} menit</div>
        </div>
        <div className="text-right">
          <Money amount={order.totalRp} display className="text-[17px] text-brand-deep" />
        </div>
      </div>

      <div className="my-3.5 py-3 border-y border-dashed border-line flex flex-col gap-[7px]">
        {order.lines.map((l, i) => (
          <div key={i} className="flex items-center gap-2.5 text-sm">
            <span className="flex-none min-w-[28px] h-[26px] px-[7px] rounded-lg bg-[#FFF3E7] text-brand-deep font-extrabold text-[13px] flex items-center justify-center">
              {l.qty}×
            </span>
            <span className="font-semibold">{l.name}</span>
          </div>
        ))}
      </div>

      {rejected ? (
        <div className="bg-[#FBEEE9] border border-[rgba(196,64,47,.18)] rounded-[14px] px-3.5 py-3 flex items-center gap-2.5">
          <span className="flex-none w-[30px] h-[30px] rounded-[9px] bg-[#FADFD6] flex items-center justify-center">
            <Icon name="cart-arrow" size={17} className="text-brand-press" strokeWidth={2} />
          </span>
          <div className="flex-1">
            <div className="text-[13px] font-extrabold text-brand-press leading-[1.3]">Dana pelanggan dikembalikan penuh</div>
            <div className="text-xs text-[#B08979] mt-px">Alasan: {order.rejectReason ?? '-'}</div>
          </div>
        </div>
      ) : (
        <>
          <button
            type="button"
            onClick={onAdvance}
            className={cn('w-full rounded-[16px] py-4 font-extrabold text-base flex items-center justify-center gap-2.5 transition-transform active:scale-[.98]', cfg!.btnClass)}
          >
            <Icon name={cfg!.btnIcon} size={19} className="text-white" strokeWidth={2.6} />
            {cfg!.btnLabel}
          </button>
          {canReject && (
            <button
              type="button"
              onClick={onReject}
              className="mt-[9px] w-full text-[#B08979] font-bold text-[13px] py-1.5 transition-transform active:scale-[.98]"
            >
              Tolak Pesanan
            </button>
          )}
        </>
      )}
    </div>
  );
}
