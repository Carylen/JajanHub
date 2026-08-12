'use client';
import { useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateOrder, useWarung, PRICING } from '@jajanhub/api';
import { Button, Card, Icon, Money, cn } from '@jajanhub/ui';
import { ScreenHeader } from '../ScreenHeader';
import { LoadingState, ErrorState, EmptyState } from '../StateViews';
import { useCartStore } from '../../lib/cart-store';
import { computeTotals } from '../../lib/pricing';
import { itemGradient } from '../../lib/visuals';
import { PickupPicker } from './PickupPicker';
import { useAuth } from './auth/AuthContext';

export function Cart({ vendorId }: { vendorId: string }) {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const { data: warung, isLoading, isError, refetch } = useWarung(vendorId);
  const items = useCartStore((s) => s.items);
  const priority = useCartStore((s) => s.priority);
  const togglePriority = useCartStore((s) => s.togglePriority);
  const pickupMode = useCartStore((s) => s.pickupMode);
  const pickupSlot = useCartStore((s) => s.pickupSlot);
  const add = useCartStore((s) => s.add);
  const remove = useCartStore((s) => s.remove);
  const createOrder = useCreateOrder();

  const totals = useMemo(
    () => (warung ? computeTotals(warung.menu, items, priority) : null),
    [warung, items, priority],
  );

  if (isLoading) return <LoadingState />;
  if (isError || !warung) return <ErrorState onRetry={() => refetch()} />;

  const backToMenu = () => router.push(`/m/${vendorId}`);

  if (!totals || totals.count === 0) {
    return (
      <div className="min-h-screen">
        <ScreenHeader title="Keranjang" onBack={backToMenu} />
        <EmptyState title="Keranjang masih kosong">
          Yuk pilih menu dulu, nanti antreannya kami pantau buat kamu.
        </EmptyState>
        <div className="px-5">
          <Button variant="primary" fullWidth onClick={backToMenu}>
            Lihat Menu
          </Button>
        </div>
      </div>
    );
  }

  const submit = () => {
    requireAuth(() => {
      createOrder.mutate(
        { vendorId, cart: items, isPriority: priority, pickupMode, pickupSlot: pickupSlot ?? undefined },
        { onSuccess: (order) => router.push(`/order/${order.id}/pay`) },
      );
    });
  };

  return (
    <div>
      <div className="animate-screen-in pb-[130px]">
        <ScreenHeader title="Keranjang" onBack={backToMenu} />

        <div className="px-5 pt-2">
          {/* Line items */}
          <Card className="px-4 py-2">
            {totals.lines.map((l) => {
              const index = warung.menu.indexOf(l.item);
              return (
                <div
                  key={l.item.id}
                  className="flex items-center gap-3 py-[13px] border-b border-[#F4ECE2]"
                >
                  <div
                    className="flex-none w-[46px] h-[46px] rounded-[13px] flex items-center justify-center text-white font-display font-extrabold text-[15px]"
                    style={{ background: itemGradient(l.item, index) }}
                  >
                    {l.qty}×
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-sm leading-[1.2]">{l.item.name}</div>
                    <Money amount={l.item.priceRp} className="text-faint text-xs mt-px block" />
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#FFF6EE] rounded-xl p-1">
                    <button
                      type="button"
                      aria-label={`Kurangi ${l.item.name}`}
                      onClick={() => remove(l.item.id)}
                      className="w-7 h-7 rounded-[9px] bg-white text-brand flex items-center justify-center shadow-[0_2px_5px_rgba(0,0,0,.06)] transition-transform active:scale-[.85]"
                    >
                      <Icon name="minus" size={15} strokeWidth={2.4} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Tambah ${l.item.name}`}
                      onClick={() => add(l.item.id)}
                      className="w-7 h-7 rounded-[9px] bg-brand text-white flex items-center justify-center shadow-[0_2px_6px_rgba(255,122,26,.4)] transition-transform active:scale-[.85]"
                    >
                      <Icon name="plus" size={15} strokeWidth={2.4} />
                    </button>
                  </div>
                </div>
              );
            })}
            <button
              type="button"
              onClick={backToMenu}
              className="w-full text-brand font-bold text-[13px] pt-3.5 pb-3 flex items-center justify-center gap-1.5"
            >
              <Icon name="plus" size={15} strokeWidth={2.4} />
              Tambah menu lagi
            </button>
          </Card>

          <PickupPicker />

          {/* Priority toggle */}
          <button
            type="button"
            onClick={togglePriority}
            aria-pressed={priority}
            className={cn(
              'mt-[14px] w-full text-left rounded-[20px] px-4 py-[15px] flex items-center gap-[13px] border-[1.5px] transition-transform active:scale-[.99]',
              priority ? 'border-prio bg-[#F6F0FF]' : 'border-line bg-white',
            )}
          >
            <div className="flex-none w-10 h-10 rounded-xl bg-[linear-gradient(135deg,#A879FF,#7A3BF5)] flex items-center justify-center">
              <Icon name="bolt" size={20} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="font-bold text-sm">Antrian Prioritas</div>
              <div className="text-faint text-xs mt-px">
                Dimasak duluan, hemat waktu · <Money amount={PRICING.priorityFeeRp} />
              </div>
            </div>
            <span
              className={cn(
                'flex-none w-[46px] h-[27px] rounded-full relative transition-colors',
                priority ? 'bg-prio' : 'bg-[#DDD2C4]',
              )}
            >
              <span
                className="absolute top-[3px] w-[21px] h-[21px] rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,.2)] transition-[left]"
                style={{ left: priority ? '22px' : '3px' }}
              />
            </span>
          </button>

          {/* Price breakdown */}
          <Card className="mt-[14px] p-[18px]">
            <Row label="Subtotal" value={<Money amount={totals.subtotal} className="font-semibold text-ink" />} />
            <Row label="Biaya layanan" value={<Money amount={totals.serviceFee} className="font-semibold text-ink" />} />
            {priority && (
              <Row
                label="Antrian prioritas"
                labelClass="text-prio"
                value={<Money amount={totals.priorityFee} className="font-bold text-prio" />}
              />
            )}
            <div className="h-px bg-[#F4ECE2] my-2.5" />
            <div className="flex justify-between items-center">
              <span className="font-bold text-[15px]">Total</span>
              <Money
                key={totals.total}
                amount={totals.total}
                display
                className="font-extrabold text-[22px] text-brand-deep animate-pop"
              />
            </div>
          </Card>
        </div>
      </div>

      {/* Pay CTA */}
      <div className="fixed left-1/2 -translate-x-1/2 bottom-0 w-full max-w-app px-5 pt-4 pb-[22px] bg-[linear-gradient(to_top,#FFF8F1_72%,transparent)] z-20">
        {createOrder.isError && (
          <p className="text-danger text-xs text-center mb-2">Gagal membuat pesanan. Coba lagi.</p>
        )}
        <Button variant="primary" fullWidth onClick={submit} disabled={createOrder.isPending}>
          <Icon name="card" size={19} className="text-white" />
          {createOrder.isPending ? 'Memproses…' : <>Bayar <Money amount={totals.total} /> · QRIS</>}
        </Button>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  labelClass,
}: {
  label: string;
  value: React.ReactNode;
  labelClass?: string;
}) {
  return (
    <div className="flex justify-between text-sm py-[5px]">
      <span className={labelClass ?? 'text-muted'}>{label}</span>
      {value}
    </div>
  );
}
