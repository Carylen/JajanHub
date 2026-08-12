'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateOrder, PRICING } from '@jajanhub/api';
import { Icon, Money, cn, type IconName } from '@jajanhub/ui';
import { LoadingState, ErrorState } from '../StateViews';
import { useCartStore } from '../../lib/cart-store';
import { computeTotals } from '../../lib/pricing';
import { itemGradient } from '../../lib/visuals';
import { MenuGridCard } from './MenuGridCard';
import type { MerchantScreenView } from './useMerchantScreen';
import { useAuth } from './auth/AuthContext';

type CatFilter = 'all' | 'food' | 'drink' | 'best';

const CATS: Array<{ value: CatFilter; label: string; icon: IconName }> = [
  { value: 'all', label: 'Semua menu', icon: 'grid4' },
  { value: 'food', label: 'Makanan', icon: 'utensils' },
  { value: 'drink', label: 'Minuman', icon: 'cup' },
  { value: 'best', label: 'Terlaris', icon: 'star' },
];

/**
 * Desktop merged catalog+cart screen (matches Antre/Antri Desktop.dc.html's
 * `isOrder` state). Collapses mobile's separate splash/landing/menu/cart
 * screens into one: cart is an always-visible sticky panel, not a route.
 * Category filters live here (not in CustomerSidebar) — see that file's doc
 * comment for why. Checkout still calls the same useCreateOrder() mutation
 * mobile's Cart.tsx uses, then routes to /order/[id]/pay — same order
 * creation path, just triggered from a panel instead of a dedicated screen.
 */
export function MerchantDesktopView({ warung, isLoading, isError, refetch }: MerchantScreenView) {
  const router = useRouter();
  const { requireAuth } = useAuth();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState<CatFilter>('all');
  const items = useCartStore((s) => s.items);
  const priority = useCartStore((s) => s.priority);
  const add = useCartStore((s) => s.add);
  const remove = useCartStore((s) => s.remove);
  const togglePriority = useCartStore((s) => s.togglePriority);
  const createOrder = useCreateOrder();

  if (isLoading) return <LoadingState label="Menyiapkan gerobak…" />;
  if (isError || !warung) {
    return <ErrorState message="Gagal memuat gerobak ini. Cek koneksimu, ya." onRetry={refetch} />;
  }

  const totals = computeTotals(warung.menu, items, priority);
  const filtered = warung.menu.filter((m) => {
    if (query) return (m.name + ' ' + m.desc).toLowerCase().includes(query.toLowerCase());
    if (cat === 'all') return true;
    if (cat === 'best') return !!m.isBestSeller;
    return m.cat === cat;
  });
  const catLabel = query ? `Hasil "${query}"` : (CATS.find((c) => c.value === cat)?.label ?? 'Semua menu');

  const checkout = () => {
    requireAuth(() => {
      createOrder.mutate(
        { vendorId: warung.id, cart: items, isPriority: priority, pickupMode: 'now' },
        { onSuccess: (order) => router.push(`/order/${order.id}/pay`) },
      );
    });
  };

  return (
    <div className="flex min-h-screen">
      {/* Catalog */}
      <div className="flex-1 min-w-0 flex flex-col">
        <div className="relative h-[180px] flex-none bg-[linear-gradient(158deg,#FFB870,#FF7A1A_56%,#E4560A)] overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(60%_80%_at_82%_0%,rgba(255,255,255,.28),transparent)]" />
          <div className="relative px-10 py-[34px] text-white">
            <div className="font-display font-extrabold text-[34px] tracking-[-.8px] leading-none">Mau makan apa hari ini?</div>
            <div className="text-[15px] opacity-95 mt-2 max-w-[520px] leading-[1.5]">
              Pesan sekarang, bayar online, tinggal ambil pas nomormu dipanggil. Nggak pakai antre lama.
            </div>
          </div>
        </div>

        <div className="px-10 pt-[22px] pb-3 flex items-center gap-4 flex-none">
          <div className="flex-1 flex items-center gap-2.5 bg-white rounded-[14px] px-[17px] py-[13px] shadow-[0_3px_12px_rgba(35,24,15,.05)]">
            <Icon name="search" size={19} className="text-faint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari menu favoritmu…"
              className="flex-1 border-0 outline-none bg-transparent text-[15px] text-ink min-w-0 font-sans"
            />
          </div>
          <div className="flex-none flex items-center gap-[7px] bg-[#EAF6EF] text-mint-deep font-bold text-[13.5px] px-[15px] py-3 rounded-[14px]">
            <span className="w-2 h-2 rounded-full bg-mint animate-pulse" />
            Antrean sekarang · {warung.queueEstimate.peopleAhead} orang
          </div>
        </div>

        <div className="px-10 flex items-center gap-2 flex-none">
          {CATS.map((c) => {
            const active = cat === c.value && !query;
            return (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  setCat(c.value);
                  setQuery('');
                }}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold transition-colors',
                  active ? 'bg-[#FFF3E7] text-brand-deep' : 'text-muted hover:bg-white',
                )}
              >
                <Icon name={c.icon} size={16} />
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="flex-1 overflow-y-auto px-10 pb-10 pt-3">
          <div className="font-display font-extrabold text-[19px] my-4">
            {catLabel} <span className="text-faint font-bold text-[15px]">· {filtered.length} menu</span>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center text-faint text-sm py-16">Nggak ada menu yang cocok.</div>
          ) : (
            <div className="grid gap-[18px] [grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]">
              {filtered.map((item) => {
                const index = warung.menu.indexOf(item);
                return (
                  <MenuGridCard
                    key={item.id}
                    item={item}
                    index={index}
                    qty={items[item.id] ?? 0}
                    onAdd={() => add(item.id)}
                    onRemove={() => remove(item.id)}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Cart panel — always visible, no separate /cart route needed at desktop */}
      <aside className="flex-none w-[366px] bg-white shadow-[-2px_0_24px_rgba(35,24,15,.05)] flex flex-col sticky top-0 h-screen">
        <div className="px-6 pt-6 pb-4 border-b border-[#F4ECE2]">
          <div className="font-display font-extrabold text-xl">Pesananmu</div>
          <div className="text-[13px] text-faint mt-0.5">
            {totals.count > 0 ? `${totals.count} item dipilih` : 'Belum ada item'}
          </div>
        </div>

        {totals.count === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3.5 p-[30px] text-center">
            <div className="w-20 h-20 rounded-3xl bg-[#FBF1E6] flex items-center justify-center">
              <Icon name="bag" size={38} className="text-[#E4A96B]" />
            </div>
            <div className="font-bold text-[15px] text-faint max-w-[200px] leading-[1.5]">
              Keranjang masih kosong. Pilih menu di sebelah kiri ya!
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <div className="flex flex-col gap-3.5">
                {totals.lines.map((l) => {
                  const index = warung.menu.indexOf(l.item);
                  return (
                    <div key={l.item.id} className="flex gap-[13px] items-center">
                      <div
                        className="flex-none w-[52px] h-[52px] rounded-2xl"
                        style={{ background: itemGradient(l.item, index) }}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm leading-[1.2]">{l.item.name}</div>
                        <Money amount={l.item.priceRp * l.qty} className="text-brand-deep font-bold text-[13px] mt-[3px] block" />
                      </div>
                      <div className="flex-none flex items-center gap-[9px]">
                        <button
                          type="button"
                          aria-label={`Kurangi ${l.item.name}`}
                          onClick={() => remove(l.item.id)}
                          className="w-7 h-7 rounded-lg bg-[#F1E7DC] text-ink font-extrabold text-[17px] flex items-center justify-center transition-transform active:scale-90"
                        >
                          −
                        </button>
                        <span className="font-extrabold text-[15px] min-w-[16px] text-center">{l.qty}</span>
                        <button
                          type="button"
                          aria-label={`Tambah ${l.item.name}`}
                          onClick={() => add(l.item.id)}
                          className="w-7 h-7 rounded-lg bg-brand text-white font-extrabold text-[17px] flex items-center justify-center transition-transform active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={togglePriority}
                aria-pressed={priority}
                className={cn(
                  'w-full text-left mt-5 rounded-2xl p-[15px] flex items-center gap-[13px] border-2 transition-transform active:scale-[.99]',
                  priority ? 'bg-[#F4F0FF] border-[#C9B0FF]' : 'bg-[#FBF6EF] border-line',
                )}
              >
                <span className={cn('flex-none w-10 h-10 rounded-xl flex items-center justify-center', priority ? 'bg-prio' : 'bg-[#E4D8FF]')}>
                  <Icon name="bolt" size={21} className={priority ? 'text-white' : 'text-prio'} />
                </span>
                <div className="flex-1">
                  <div className={cn('font-extrabold text-sm', priority ? 'text-[#5B2BC4]' : 'text-ink')}>Prioritas antrean</div>
                  <div className="text-xs text-faint mt-px">
                    Naik ke depan · <Money amount={PRICING.priorityFeeRp} />
                  </div>
                </div>
                <span className={cn('flex-none w-[46px] h-[26px] rounded-full relative', priority ? 'bg-prio' : 'bg-[#DDD2C4]')}>
                  <span
                    className="absolute top-[3px] w-5 h-5 rounded-full bg-white shadow-[0_2px_5px_rgba(0,0,0,.25)] transition-[left]"
                    style={{ left: priority ? '23px' : '3px' }}
                  />
                </span>
              </button>
            </div>

            <div className="flex-none px-6 py-5 border-t border-[#F4ECE2] bg-[#FFFCF8]">
              <Row label="Subtotal" value={<Money amount={totals.subtotal} className="font-bold text-ink" />} />
              <Row label="Biaya layanan" value={<Money amount={totals.serviceFee} className="font-bold text-ink" />} />
              {priority && <Row label="Biaya prioritas" value={<Money amount={totals.priorityFee} className="font-bold text-prio" />} />}
              <div className="flex justify-between items-center my-3">
                <span className="font-bold text-[15px]">Total</span>
                <Money amount={totals.total} display className="text-[26px]" />
              </div>
              <button
                type="button"
                onClick={checkout}
                disabled={createOrder.isPending}
                className="w-full rounded-[15px] py-[17px] font-extrabold text-base bg-[linear-gradient(135deg,#FFB870,#FF7A1A)] text-white shadow-[0_10px_22px_rgba(255,122,26,.32)] flex items-center justify-center gap-2 transition-transform active:scale-[.98] disabled:opacity-60"
              >
                {createOrder.isPending ? (
                  'Memproses…'
                ) : (
                  <>
                    Bayar dengan QRIS
                    <Icon name="chevron-right" size={18} className="text-white" />
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between text-sm text-muted py-1.5">
      <span>{label}</span>
      {value}
    </div>
  );
}
