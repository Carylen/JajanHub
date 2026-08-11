'use client';
import { useLoyalCustomers } from '@jajanhub/api';
import { Card, Icon } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';

export function Customers() {
  const { data: customers, isLoading, isError, refetch } = useLoyalCustomers();

  if (isLoading) return <LoadingState />;
  if (isError || !customers) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="animate-screen-in">
      <div className="px-[22px] pt-[22px] pb-1.5">
        <div className="font-display font-extrabold text-2xl tracking-[-.5px]">Pelanggan Setia</div>
        <div className="text-[13px] text-faint mt-0.5">Mereka yang sering balik lagi</div>
      </div>

      <div className="px-5 pt-3.5">
        <div className="bg-[linear-gradient(135deg,#FFF3E7,#FFE7D2)] border border-brand/[.16] rounded-[20px] p-[18px] flex items-center gap-3.5 shadow-[0_6px_18px_rgba(255,122,26,.07)]">
          <div className="flex-none w-[52px] h-[52px] rounded-2xl bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] flex items-center justify-center">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
              <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18.6 6 21l1.2-6.6L2.4 9.7l6.6-.9z" />
            </svg>
          </div>
          <div className="flex-1">
            <div className="font-extrabold text-[15px]">120 pelanggan setia</div>
            <div className="text-[13px] text-[#B8791F] mt-px">Nyumbang 64% dari total penjualanmu</div>
          </div>
        </div>
      </div>

      <div className="px-5 pt-4 flex flex-col gap-[11px]">
        {customers.map((c) => (
          <Card key={c.id} className="px-4 py-[15px] flex items-center gap-[13px] shadow-[0_4px_14px_rgba(35,24,15,.05)]">
            <div className="flex-none w-12 h-12 rounded-[15px] flex items-center justify-center text-white font-display font-extrabold text-base" style={{ background: c.avatarGradient }}>
              {c.initials}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-[7px]">
                <span className="font-bold text-[15px]">{c.name}</span>
                {c.isPriorityMember && (
                  <span className="bg-prio-soft text-prio text-[10px] font-extrabold px-2 py-[3px] rounded-full flex items-center gap-[3px]">
                    <Icon name="bolt" size={10} className="text-prio" />
                    PRIORITAS
                  </span>
                )}
                <span className="text-[11px] text-faint font-semibold">{c.customerPhoneMasked}</span>
              </div>
              <div className="text-xs text-faint mt-[3px] flex items-center gap-[5px]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="#FFB020" aria-hidden="true">
                  <path d="M12 2l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 18.6 6 21l1.2-6.6L2.4 9.7l6.6-.9z" />
                </svg>
                Suka {c.favoriteItem}
              </div>
            </div>
            <div className="text-right">
              <div className="font-display font-extrabold text-xl leading-none">{c.orderCount}×</div>
              <div className="text-[11px] text-faint">pesan</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
