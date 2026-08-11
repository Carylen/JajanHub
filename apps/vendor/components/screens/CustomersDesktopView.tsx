'use client';
import { useLoyalCustomers } from '@jajanhub/api';
import { VendorTopBar } from '../VendorTopBar';
import { LoadingState, ErrorState } from '../StateViews';

/** Desktop Pelanggan — table layout matching Antre/Antri Pedagang Desktop.dc.html. */
export function CustomersDesktopView() {
  const { data: customers, isLoading, isError, refetch } = useLoyalCustomers();

  return (
    <>
      <VendorTopBar title="Pelanggan Setia" sub="Pelanggan yang paling sering jajan" />
      <div className="p-[28px_34px_44px] animate-screen-in">
        {isLoading ? (
          <LoadingState />
        ) : isError || !customers ? (
          <ErrorState onRetry={refetch} />
        ) : (
          <div className="bg-white rounded-[22px] px-2 py-3 shadow-card overflow-hidden">
            <div className="grid grid-cols-[2fr_1.4fr_1fr_1fr] gap-4 px-[22px] py-4 text-xs font-extrabold text-faint tracking-[.4px]">
              <div>PELANGGAN</div>
              <div>FAVORIT</div>
              <div className="text-right">TRANSAKSI</div>
              <div className="text-right">STATUS</div>
            </div>
            {customers.map((c) => (
              <div key={c.id} className="grid grid-cols-[2fr_1.4fr_1fr_1fr] gap-4 items-center px-[22px] py-3.5 rounded-2xl hover:bg-[#FBF6EF] transition-colors">
                <div className="flex items-center gap-[13px] min-w-0">
                  <div
                    className="flex-none w-11 h-11 rounded-2xl flex items-center justify-center text-white font-display font-extrabold text-[15px]"
                    style={{ background: c.avatarGradient }}
                  >
                    {c.initials}
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-[15px] truncate">{c.name}</div>
                    <div className="text-xs text-faint truncate">{c.customerPhoneMasked}</div>
                  </div>
                </div>
                <div className="text-sm text-[#3A2A1C] truncate">{c.favoriteItem}</div>
                <div className="text-right font-display font-extrabold text-lg">{c.orderCount}</div>
                <div className="text-right">
                  <span
                    className={`inline-block text-xs font-bold px-[11px] py-[5px] rounded-full ${
                      c.isPriorityMember ? 'bg-prio-soft text-prio' : 'bg-[#F1E7DC] text-faint'
                    }`}
                  >
                    {c.isPriorityMember ? 'Member' : 'Reguler'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
