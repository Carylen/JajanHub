'use client';
import { formatQueueCode, minutesSince, type Order } from '@jajanhub/api';
import { Money, cn } from '@jajanhub/ui';
import { ORDER_STATUS_CONFIG } from './OrderCard';

interface KanbanOrderCardProps {
  order: Order;
  onAdvance: () => void;
  onReject: () => void;
}

/**
 * Desktop Kanban card — matches Antre/Antri Pedagang Desktop.dc.html's
 * compact card. Reuses ORDER_STATUS_CONFIG (from OrderCard.tsx) for the
 * text/icon/cooking mapping so status→label/action logic isn't duplicated;
 * only the layout and color palette differ from the mobile card.
 */
export function KanbanOrderCard({ order, onAdvance, onReject }: KanbanOrderCardProps) {
  const cfg = order.status === 'rejected' ? null : ORDER_STATUS_CONFIG[order.status as keyof typeof ORDER_STATUS_CONFIG];
  const num = formatQueueCode(order).replace(/^[A-Za-z]+/, '');
  const canReject = !!cfg && (order.status === 'waiting_confirmation' || order.status === 'cooking');

  return (
    <div
      className={cn(
        'rounded-2xl p-[15px] shadow-[0_4px_12px_rgba(35,24,15,.05)] animate-[slideCard_.3s_ease] border',
        order.isPriority ? 'bg-[#FBF8FF] border-2 border-[#C9B0FF]' : 'bg-white border-[#F1E7DC]',
      )}
    >
      <div className="flex items-center gap-[11px]">
        <div
          className="flex-none w-[46px] h-[46px] rounded-[13px] flex flex-col items-center justify-center text-white leading-none"
          style={{ background: order.isPriority ? 'linear-gradient(135deg,#A879FF,#7A3BF5)' : 'linear-gradient(135deg,#FFB870,#FF7A1A)' }}
        >
          <span className="text-[8px] font-extrabold opacity-85 tracking-[.5px]">ANTRIAN</span>
          <span className="font-display font-extrabold text-base">{num}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-[7px] flex-wrap">
            <Money amount={order.totalRp} display className="text-[15px]" />
            {order.isPriority && <span className="bg-prio text-white text-[9px] font-extrabold px-[7px] py-[3px] rounded-full">PRIORITAS</span>}
            {order.addons.length > 0 && (
              <span className="bg-mint-soft text-mint-deep text-[9px] font-extrabold px-[7px] py-[3px] rounded-full">+{order.addons.length} tambahan</span>
            )}
          </div>
          <div className="text-xs text-faint font-semibold mt-0.5">Masuk {minutesSince(order.createdAt)} mnt lalu</div>
        </div>
        {cfg?.cooking && <span className="flex-none w-[9px] h-[9px] rounded-full bg-brand-deep animate-pulse" />}
      </div>

      <div className="mt-3 flex flex-col gap-[5px]">
        {order.lines.map((l, i) => (
          <div key={i} className="flex gap-[9px] text-[13.5px]">
            <span className="flex-none font-extrabold text-brand-deep min-w-[22px]">{l.qty}×</span>
            <span className="flex-1 text-[#3A2A1C]">{l.name}</span>
          </div>
        ))}
      </div>

      {order.status === 'rejected' ? (
        <div className="mt-3 bg-[#FBEEE9] text-brand-press text-[12.5px] font-semibold px-3 py-2.5 rounded-[11px]">
          {order.rejectReason ? `Alasan: ${order.rejectReason}` : 'Ditolak'} · dana pelanggan otomatis dikembalikan
        </div>
      ) : (
        cfg && (
          <div className="mt-[13px] flex gap-2">
            <button
              type="button"
              onClick={onAdvance}
              className={cn('flex-1 rounded-xl py-[11px] font-extrabold text-sm transition-transform active:scale-[.97]', cfg.btnClass)}
            >
              {cfg.btnLabel}
            </button>
            {canReject && (
              <button
                type="button"
                onClick={onReject}
                className="flex-none border border-[#F0D9D3] rounded-xl px-3.5 font-bold text-[13px] bg-white text-brand-press transition-transform active:scale-[.97]"
              >
                Tolak
              </button>
            )}
          </div>
        )
      )}
    </div>
  );
}
