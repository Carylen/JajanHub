import { PRICING, type MenuItem } from '@jajanhub/api';

export interface CartLineView {
  item: MenuItem;
  qty: number;
}

export interface CartTotals {
  lines: CartLineView[];
  count: number;
  subtotal: number;
  serviceFee: number;
  priorityFee: number;
  total: number;
}

/**
 * Derive cart line items + totals from the raw quantity map and the menu.
 * Single source of pricing math shared by the menu, cart, and pay screens.
 */
export function computeTotals(
  menu: MenuItem[],
  items: Record<string, number>,
  priority: boolean,
): CartTotals {
  const lines = menu
    .filter((m) => (items[m.id] ?? 0) > 0)
    .map((m) => ({ item: m, qty: items[m.id] ?? 0 }));
  const count = lines.reduce((a, l) => a + l.qty, 0);
  const subtotal = lines.reduce((a, l) => a + l.qty * l.item.priceRp, 0);
  const serviceFee = count > 0 ? PRICING.serviceFeeRp : 0;
  const priorityFee = priority ? PRICING.priorityFeeRp : 0;
  return { lines, count, subtotal, serviceFee, priorityFee, total: subtotal + serviceFee + priorityFee };
}
