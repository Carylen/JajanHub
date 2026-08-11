'use client';
import { Icon, Modal, Money, QrCode, cn } from '@jajanhub/ui';
import { PRICING } from '@jajanhub/api';
import { itemGradient } from '../../lib/visuals';
import type { AddonFlowView } from './useAddonFlow';

/** Desktop "Tambah Pesanan" modal (D3) — matches Antre/Antri Desktop.dc.html's `addonOpen`. */
export function AddonModal({ vm, orderNo, orderSeed }: { vm: AddonFlowView; orderNo: string; orderSeed: number }) {
  return (
    <Modal open={vm.open} onClose={vm.closeFlow} label="Tambah pesanan" width="640px" className="p-0 overflow-hidden max-h-[88vh] flex flex-col">
      {vm.step === 'menu' ? (
        <>
          <div className="flex-none px-7 pt-6 pb-4 border-b border-[#F4ECE2] flex items-center justify-between">
            <div>
              <div className="font-display font-extrabold text-[22px]">Tambah Pesanan</div>
              <span className="inline-flex items-center gap-1.5 bg-[#FFF3E7] text-brand-deep text-[12.5px] font-extrabold px-[11px] py-[5px] rounded-full mt-2">
                <Icon name="bag" size={13} className="text-brand-deep" />
                Tambahan untuk Antrean #{orderNo}
              </span>
            </div>
            <button
              type="button"
              onClick={vm.closeFlow}
              className="w-9 h-9 rounded-[11px] bg-[#F1E7DC] text-muted flex items-center justify-center transition-transform active:scale-90"
            >
              <Icon name="x" size={17} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-7 py-[18px]">
            <div className="grid grid-cols-2 gap-3">
              {vm.menu.map(({ item, qty }, i) => (
                <div key={item.id} className="bg-white rounded-2xl p-[13px] flex items-center gap-3 shadow-[0_3px_10px_rgba(35,24,15,.04)]">
                  <div className="flex-none w-12 h-12 rounded-xl" style={{ background: itemGradient(item, i) }} />
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[13.5px] leading-[1.2] truncate">{item.name}</div>
                    <Money amount={item.priceRp} className="text-brand-deep font-extrabold text-[13px] mt-[3px] block" />
                  </div>
                  {qty > 0 ? (
                    <div className="flex-none flex items-center gap-[7px]">
                      <button type="button" onClick={() => vm.dec(item.id)} className="w-[26px] h-[26px] rounded-lg bg-[#F1E7DC] font-extrabold text-sm flex items-center justify-center transition-transform active:scale-90">
                        −
                      </button>
                      <span className="font-extrabold text-sm min-w-[14px] text-center">{qty}</span>
                      <button type="button" onClick={() => vm.add(item.id)} className="w-[26px] h-[26px] rounded-lg bg-brand text-white font-extrabold text-sm flex items-center justify-center transition-transform active:scale-90">
                        +
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => vm.add(item.id)}
                      className="flex-none w-[30px] h-[30px] rounded-[9px] bg-ink text-white font-extrabold text-base flex items-center justify-center transition-transform active:scale-90 hover:bg-[#3A2A1C]"
                    >
                      +
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex-none px-7 py-[18px] border-t border-[#F4ECE2] bg-[#FFFCF8] flex items-center gap-4">
            <div className="flex-1">
              <div className="text-[12.5px] text-faint">{vm.qty > 0 ? `${vm.qty} item tambahan` : 'Belum ada tambahan'}</div>
              <Money amount={vm.subtotal} display className="text-[22px]" />
            </div>
            <button
              type="button"
              onClick={vm.goPay}
              disabled={!vm.hasItems}
              className={cn(
                'rounded-2xl px-[26px] py-[15px] font-extrabold text-[15px] text-white flex items-center gap-2 transition-transform active:scale-[.98]',
                vm.hasItems ? 'bg-brand cursor-pointer' : 'bg-[#E4C6A8] cursor-not-allowed',
              )}
            >
              Lanjut bayar
              <Icon name="chevron-right" size={17} className="text-white" />
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="flex-none px-7 pt-5 pb-3.5 border-b border-[#F4ECE2] flex items-center gap-3">
            <button
              type="button"
              onClick={vm.back}
              className="w-9 h-9 rounded-[11px] bg-[#F1E7DC] flex items-center justify-center transition-transform active:scale-90"
            >
              <Icon name="chevron-left" size={18} />
            </button>
            <div>
              <div className="font-display font-extrabold text-xl">Bayar tambahan</div>
              <div className="text-[12.5px] text-faint">Tambahan untuk Antrean #{orderNo}</div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto px-7 py-5 grid grid-cols-2 gap-6 items-center">
            <div>
              <div className="flex flex-col gap-[11px]">
                {vm.menu
                  .filter((r) => r.qty > 0)
                  .map(({ item, qty }, i) => (
                    <div key={item.id} className="flex items-center gap-[11px]">
                      <div className="flex-none w-10 h-10 rounded-[11px]" style={{ background: itemGradient(item, i) }} />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-[13.5px] leading-[1.2]">{item.name}</div>
                        <div className="text-xs text-faint mt-px">×{qty}</div>
                      </div>
                      <Money amount={item.priceRp * qty} className="font-extrabold text-[13.5px]" />
                    </div>
                  ))}
              </div>
              <div className="h-px bg-[#F1E7DC] my-4" />
              <div className="flex justify-between text-[13.5px] text-muted mb-2">
                <span>Subtotal tambahan</span>
                <Money amount={vm.subtotal} className="font-bold" />
              </div>
              <div className="flex justify-between items-center text-[13.5px] text-muted mb-2">
                <span className="flex items-center gap-1.5">
                  Biaya tambahan
                  <span className="bg-mint-soft text-mint-deep text-[10.5px] font-extrabold px-[7px] py-0.5 rounded-full">HEMAT</span>
                </span>
                <span className="flex items-center gap-[7px]">
                  <span className="line-through text-faint font-semibold">
                    <Money amount={PRICING.priorityFeeRp} />
                  </span>
                  <Money amount={vm.fee} className="font-extrabold text-mint-deep" />
                </span>
              </div>
              <div className="text-[11.5px] text-faint leading-[1.4] mb-3">
                Lebih murah dari biaya layanan normal karena digabung ke antrean yang sama.
              </div>
              <div className="flex justify-between items-center border-t border-[#F1E7DC] pt-3">
                <span className="font-bold text-sm">Total bayar</span>
                <Money amount={vm.total} display className="text-2xl" />
              </div>
            </div>
            <div className="text-center">
              <div className="w-[190px] h-[190px] bg-white rounded-[20px] mx-auto p-[15px] shadow-[0_8px_20px_rgba(35,24,15,.08)]">
                <QrCode seed={orderSeed} />
              </div>
              <div className="text-[12.5px] text-faint mt-3 leading-[1.4]">
                Scan QRIS ini buat bayar
                <br />
                tambahannya
              </div>
            </div>
          </div>

          <div className="flex-none px-7 py-[18px] border-t border-[#F4ECE2] bg-[#FFFCF8]">
            <button
              type="button"
              onClick={vm.confirm}
              disabled={vm.confirmPending}
              className="w-full rounded-2xl py-4 font-extrabold text-base bg-mint text-white shadow-[0_10px_22px_rgba(22,199,132,.3)] transition-transform active:scale-[.98] disabled:opacity-60"
            >
              {vm.confirmPending ? 'Memproses…' : 'Saya sudah bayar tambahan'}
            </button>
          </div>
        </>
      )}
    </Modal>
  );
}
