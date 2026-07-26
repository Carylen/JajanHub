'use client';
import { BottomSheet, Button, Icon, Money, QrCode, cn, formatCountdown } from '@jajanhub/ui';
import { PRICING } from '@jajanhub/api';
import { itemGradient } from '../../lib/visuals';
import { FoodGlyph } from './FoodGlyph';
import type { AddonFlowView } from './useAddonFlow';

/** Mobile "Tambah Pesanan" sheet (D3) — matches Antre/Antri.dc.html's `addonSheetOpen`: quantity picker step, then a QRIS pay step with a countdown. */
export function AddonSheet({
  vm,
  orderNo,
  orderSeed,
  merchantName,
}: {
  vm: AddonFlowView;
  orderNo: string;
  orderSeed: number;
  merchantName: string;
}) {
  return (
    <BottomSheet open={vm.open} onClose={vm.closeFlow} label="Tambah pesanan">
      {vm.step === 'menu' ? (
        <>
          <div className="text-center">
            <div className="font-display font-extrabold text-xl">Tambah Pesanan</div>
            <span className="inline-flex items-center gap-1.5 bg-[#FFF3E7] text-brand-deep text-xs font-extrabold px-2.5 py-1.5 rounded-full mt-2">
              Untuk Antrean #{orderNo} · {merchantName}
            </span>
          </div>
          <div className="mt-4 flex flex-col gap-2.5 max-h-[40vh] overflow-y-auto">
            {vm.menu.map(({ item, qty }, i) => (
              <div key={item.id} className="bg-white rounded-2xl p-3 flex items-center gap-3 shadow-card">
                <div className="flex-none w-[54px] h-[54px] rounded-2xl flex items-center justify-center" style={{ background: itemGradient(item, i) }}>
                  <FoodGlyph cat={item.cat} size={26} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-sm leading-[1.2] truncate">{item.name}</div>
                  <Money amount={item.price} display className="text-brand-deep font-extrabold text-[15px] mt-0.5 block" />
                </div>
                {qty > 0 ? (
                  <div className="flex-none flex items-center gap-2 bg-[#FFEEDF] rounded-xl p-1">
                    <button type="button" onClick={() => vm.dec(item.id)} className="w-[30px] h-[30px] rounded-lg bg-white text-brand font-extrabold text-base flex items-center justify-center active:scale-90 transition-transform shadow-[0_2px_5px_rgba(0,0,0,.06)]">
                      −
                    </button>
                    <span key={qty} className="font-extrabold text-sm min-w-[16px] text-center animate-pop">{qty}</span>
                    <button type="button" onClick={() => vm.add(item.id)} className="w-[30px] h-[30px] rounded-lg bg-brand text-white font-extrabold text-base flex items-center justify-center active:scale-90 transition-transform shadow-[0_3px_8px_rgba(255,122,26,.4)]">
                      +
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => vm.add(item.id)}
                    className="flex-none w-[38px] h-[38px] rounded-xl bg-[#FFEEDF] text-brand flex items-center justify-center active:scale-90 transition-transform"
                  >
                    <Icon name="plus" size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="mt-3.5 bg-white rounded-2xl p-[15px] shadow-card">
            <Row label="Subtotal tambahan" value={<Money amount={vm.subtotal} className="font-semibold" />} />
            <div className="flex justify-between items-center text-[13.5px] text-muted py-1.5">
              <span className="flex items-center gap-1.5">Biaya tambahan</span>
              <span className="flex items-center gap-1.5">
                <span className="line-through text-faint text-xs">
                  <Money amount={PRICING.priorityFee} />
                </span>
                <span className="font-bold text-mint-deep">
                  <Money amount={vm.fee} />
                </span>
              </span>
            </div>
            <div className="flex justify-end -mt-0.5 mb-1">
              <span className="inline-flex items-center gap-1 bg-mint-soft text-[#0E7A56] font-bold text-[11px] px-[9px] py-1 rounded-full">
                <Icon name="check" size={12} strokeWidth={2.6} className="text-mint" />
                Hemat <Money amount={PRICING.priorityFee - vm.fee} /> — udah gabung antrian
              </span>
            </div>
            <div className="h-px bg-[#F4ECE2] my-1" />
            <div className="flex justify-between items-center pt-1">
              <span className="font-bold text-[14.5px]">Total tambahan</span>
              <Money key={vm.total} amount={vm.total} display className="text-xl animate-pop" />
            </div>
          </div>
          {vm.hasItems ? (
            <Button variant="dark" fullWidth className="mt-3" onClick={vm.goPay}>
              <Icon name="qr" size={18} className="text-white" />
              Bayar QRIS · {vm.total > 0 && <Money amount={vm.total} />}
            </Button>
          ) : (
            <div className="mt-3 w-full bg-[#F4ECE2] text-faint rounded-2xl py-[15px] font-bold text-sm text-center">
              Pilih menu dulu ya
            </div>
          )}
        </>
      ) : (
        <>
          <div className="flex items-center gap-3">
            <button type="button" onClick={vm.back} className="w-9 h-9 rounded-[11px] bg-[#F1E7DC] flex items-center justify-center active:scale-90 transition-transform">
              <Icon name="chevron-left" size={18} />
            </button>
            <div>
              <div className="font-display font-extrabold text-lg">Bayar tambahan</div>
              <div className="text-xs text-faint">Tambahan untuk Antrean #{orderNo}</div>
            </div>
          </div>

          <div className="text-center mt-4">
            <div className="text-[13px] text-faint font-semibold">Scan buat bayar tambahan</div>
            <Money amount={vm.total} display className="text-[26px] mt-0.5 block" />
            <div className="mx-auto mt-4 w-[248px] bg-white rounded-3xl p-3 shadow-[0_14px_34px_rgba(35,24,15,.12)]">
              <div className="flex items-center justify-between px-1.5 pb-2.5">
                <span className="font-display font-extrabold text-brand-deep text-[15px]">QRIS</span>
                <span className="text-xs text-faint">Antrean #{orderNo}</span>
              </div>
              <div className="w-full aspect-square">
                <QrCode seed={orderSeed} />
              </div>
            </div>

            <div className="mx-1 mt-4 bg-white rounded-2xl px-[15px] py-3.5 flex items-center gap-3 shadow-card">
              <span className="flex-none w-[22px] h-[22px] rounded-full border-[2.5px] border-[#FFE0C4] border-t-brand animate-spin" />
              <div className="flex-1 text-left">
                <div className="font-bold text-sm">Menunggu pembayaran</div>
                <div className="text-xs text-faint tabular-nums">Kadaluarsa dalam {formatCountdown(vm.payLeft)}</div>
              </div>
            </div>

            <Button variant="mint" fullWidth className="mt-3.5" disabled={vm.confirmPending} onClick={vm.confirm}>
              {vm.confirmPending ? 'Memproses…' : 'Saya sudah bayar'}
            </Button>
            <div className="mt-2.5 text-xs text-faint leading-[1.4]">
              Tambahan langsung digabung ke Antrean #{orderNo} — nggak perlu ngantre ulang
            </div>
          </div>
        </>
      )}
    </BottomSheet>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className={cn('flex justify-between text-[13.5px] text-muted py-1')}>
      <span>{label}</span>
      {value}
    </div>
  );
}
