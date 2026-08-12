/**
 * Seed data ported (values) from the design files' `<script>` constants:
 * MENU, BENEFITS, PLANS, STALLS, SLOTS, CANCEL_REASONS, plus the vendor
 * TXNS/LOYAL/PAYOUTS/REJECT_REASONS. Field names/enums follow API_CONTRACT.md
 * (see types.ts) — swapped for real backend responses in http mode, kept
 * here so the UI runs with no backend.
 */
import { PRICING } from '../config';
import type {
  CancelReason,
  DisplayLine,
  LoyalCustomer,
  MenuItem,
  Order,
  OrderLine,
  Payout,
  PickupRecord,
  PickupSlot,
  Preorder,
  RejectReason,
  Stall,
  SubscriptionBenefit,
  SubscriptionPlan,
  Txn,
  UserProfile,
  Vendor,
  VendorMenuItem,
  VendorSummary,
  VendorTierStatus,
} from '../types';

export const MENU: MenuItem[] = [
  { id: 'ayam-ijo', name: 'Ayam Penyet Sambal Ijo', desc: 'Ayam goreng garing, sambal hijau nampol', priceRp: 22000, cat: 'food', isBestSeller: true, isAvailable: true },
  { id: 'ayam-ori', name: 'Ayam Penyet Original', desc: 'Sambal terasi khas + lalapan segar', priceRp: 20000, cat: 'food', isAvailable: true },
  { id: 'lele', name: 'Lele Penyet', desc: 'Lele goreng kremes, sambal mentah', priceRp: 19000, cat: 'food', isAvailable: true },
  { id: 'nasgor', name: 'Nasi Goreng Spesial', desc: 'Telur, ayam suwir, kerupuk, acar', priceRp: 18000, cat: 'food', isBestSeller: true, isAvailable: true },
  { id: 'seblak', name: 'Seblak Ceker Pedas', desc: 'Kerupuk basah, ceker, level 1–5', priceRp: 15000, cat: 'food', isAvailable: true },
  { id: 'tahutempe', name: 'Tahu Tempe Penyet', desc: 'Gorengan hangat + sambal bawang', priceRp: 8000, cat: 'food', isAvailable: true },
  { id: 'esteh', name: 'Es Teh Jumbo', desc: 'Manis segar, gelas jumbo', priceRp: 8000, cat: 'drink', isBestSeller: true, isAvailable: true },
  { id: 'esjeruk', name: 'Es Jeruk Peras', desc: 'Jeruk peras asli, seger', priceRp: 10000, cat: 'drink', isAvailable: true },
];

/** Second orderable vendor (E1 multi-vendor demo — cross-vendor cart switch needs at least two). */
const TAICHAN_MENU: MenuItem[] = [
  { id: 'taichan-original', name: 'Sate Taichan Original', desc: 'Ayam bakar tanpa bumbu, sambal korek pedas', priceRp: 20000, cat: 'food', isBestSeller: true, isAvailable: true },
  { id: 'taichan-keju', name: 'Sate Taichan Keju', desc: 'Taburan keju parut, sambal korek', priceRp: 23000, cat: 'food', isAvailable: true },
  { id: 'sayap-bakar', name: 'Sayap Bakar Madu', desc: 'Sayap ayam bakar manis pedas, 3 tusuk', priceRp: 18000, cat: 'food', isAvailable: true },
  { id: 'es-teh-taichan', name: 'Es Teh Manis', desc: 'Teh manis dingin segar', priceRp: 6000, cat: 'drink', isBestSeller: true, isAvailable: true },
  { id: 'es-jeruk-taichan', name: 'Es Jeruk Peras', desc: 'Jeruk peras asli, seger', priceRp: 9000, cat: 'drink', isAvailable: true },
];

export const WARUNGS: Record<string, Vendor> = {
  'my-bosz': {
    id: 'my-bosz',
    name: 'Ayam Penyet My Bosz',
    category: 'ayam',
    /** TODO confirm with backend — no real photo pipeline in the mock. */
    photoUrl: '',
    isOpen: true,
    tier: 'bronze',
    queueEstimate: { peopleAhead: 12, etaMin: 18 },
    avgServeTimeSec: 240,
    location: { lat: -6.2088, lng: 106.8456, address: 'Jl. Merdeka No.12' },
    tagline: 'Sambal nampol, antre terpantau',
    rating: 4.8,
    orderCount: 320,
    openFrom: '10.00',
    openTo: '22.00',
    menu: MENU,
  },
  'taichan-jul': {
    id: 'taichan-jul',
    name: 'Sate Taichan Bang Jul',
    category: 'jajanan',
    photoUrl: '',
    isOpen: true,
    tier: 'silver',
    queueEstimate: { peopleAhead: 8, etaMin: 13 },
    avgServeTimeSec: 200,
    location: { lat: -6.2211, lng: 106.8331, address: 'Jl. Sudirman Kav.7' },
    tagline: 'Sambal korek nampol, bakar di tempat',
    rating: 4.7,
    orderCount: 210,
    openFrom: '16.00',
    openTo: '23.00',
    menu: TAICHAN_MENU,
  },
};

export const DEFAULT_VENDOR_ID = 'my-bosz';

/** Looks up `priceRp` from `MENU` by name — vendor-board/preorder seed data below is written as `{name, qty}` for readability, this fills in the rest of `OrderLine`. */
function toOrderLines(spec: { name: string; qty: number }[]): OrderLine[] {
  return spec.map(({ name, qty }) => {
    const item = MENU.find((m) => m.name === name);
    return { menuItemId: item?.id ?? name, name, qty, priceRp: item?.priceRp ?? 0 };
  });
}

export const BENEFITS: SubscriptionBenefit[] = [
  { title: 'Prioritas antrean tiap pesan', sub: 'Pesananmu naik ke urutan depan otomatis' },
  { title: 'Gratis biaya prioritas', sub: 'Hemat Rp8.000 setiap kali pesan' },
  { title: 'Berlaku di semua gerobak JajanHub', sub: 'Sekali langganan, dipakai di mana aja' },
  { title: 'Promo & menu spesial mingguan', sub: 'Diskon rutin khusus member' },
];

export const PLANS: SubscriptionPlan[] = [
  { id: 'plan_monthly', name: 'Bulanan', note: 'Fleksibel, bisa stop kapan aja', priceRp: 15000, periodDays: 30, per: '/bulan' },
  { id: 'plan_yearly', name: 'Tahunan', note: 'Cuma Rp12.400/bulan', priceRp: 149000, periodDays: 365, per: '/tahun', badge: 'HEMAT 17%' },
];

export const STALLS: Stall[] = [
  { id: 'my-bosz', name: 'Ayam Penyet My Bosz', type: 'Nasi · Ayam', category: 'nasi', distance: '80 m', queue: 3, open: true, mapX: '46%', mapY: '42%', tier: 'gold' },
  { id: 'mie-gino', name: 'Mie Ayam Pak Gino', type: 'Mie · Bakso', category: 'mie', distance: '120 m', queue: 15, open: true, mapX: '72%', mapY: '26%', tier: 'silver' },
  { id: 'kelapa-nur', name: 'Es Kelapa Bu Nur', type: 'Minuman', category: 'minuman', distance: '60 m', queue: 2, open: true, mapX: '28%', mapY: '62%' },
  { id: 'taichan-jul', name: 'Sate Taichan Bang Jul', type: 'Jajanan · Sate', category: 'jajanan', distance: '200 m', queue: 8, open: true, mapX: '60%', mapY: '68%', tier: 'silver' },
  { id: 'padang-sederhana', name: 'Nasi Padang Sederhana', type: 'Nasi Padang', category: 'nasi', distance: '150 m', queue: 6, open: true, mapX: '18%', mapY: '32%' },
  { id: 'kopi-kaki-lima', name: 'Kopi Kaki Lima', type: 'Minuman · Kopi', category: 'minuman', distance: '90 m', queue: 4, open: true, mapX: '84%', mapY: '54%', tier: 'gold' },
  { id: 'batagor-kingsley', name: 'Batagor Kingsley', type: 'Jajanan', category: 'jajanan', distance: '240 m', queue: 0, open: false, mapX: '48%', mapY: '82%' },
  { id: 'bakmi-gm', name: 'Bakmi GM Gerobak', type: 'Mie', category: 'mie', distance: '300 m', queue: 0, open: false, mapX: '86%', mapY: '80%' },
];

export const SLOTS: PickupSlot[] = [
  { time: '11.00', left: 2 },
  { time: '11.30' },
  { time: '12.00' },
  { time: '12.30', full: true },
  { time: '13.00' },
];

/** Matches API_CONTRACT.md §4's cancel-reason enum; `label` is what the reason chips display. */
export const CANCEL_REASONS: { id: CancelReason; label: string }[] = [
  { id: 'salah_pesan', label: 'Salah pesan' },
  { id: 'kelamaan', label: 'Kelamaan' },
  { id: 'berubah_pikiran', label: 'Berubah pikiran' },
  { id: 'lainnya', label: 'Lainnya' },
];

export const RATING_CHIPS = ['Enak banget', 'Cepet', 'Porsi pas', 'Sambalnya mantap', 'Ramah'] as const;
export const RATING_LABELS = ['', 'Kurang oke', 'Lumayan', 'Cukup enak', 'Enak!', 'Mantap banget!'] as const;

export const PROFILE: UserProfile = {
  id: 'me',
  name: 'Rizky Pratama',
  phone: '+62 812-3456-7890',
  initials: 'RP',
  totalOrders: 48,
  points: 320,
  favorites: 6,
  subscriptionActive: false,
};

/* ------------------------------ Vendor seed ------------------------------ */

export const VENDOR_SUMMARY: VendorSummary = {
  merchantName: 'Ayam Penyet My Bosz',
  greeting: 'Halo Pak Budi',
  dateLabel: 'Senin, 22 Jul',
  revenueToday: 1_240_000,
  revenueDeltaPct: 18,
  ordersToday: 42,
  avgServeLabel: '4 mnt 30 dtk',
};

/** Per-tier advancement thresholds for the `GET /vendors/:id/tier` demo — TODO confirm with backend (real values are server-computed from order history). No entry for `gold` (already max). */
export const TIER_THRESHOLDS: Record<'bronze' | 'silver', { ordersRequired: number; responseRequiredSec: number }> = {
  bronze: { ordersRequired: 20, responseRequiredSec: 240 },
  silver: { ordersRequired: 30, responseRequiredSec: 180 },
};

/** Per-tier `benefits` for `GET /vendors/:id/tier` — TODO confirm with backend (payout schedule/fee share are disbursement-gateway-dependent, see API_CONTRACT.md §15). */
export const TIER_BENEFITS: Record<Vendor['tier'], VendorTierStatus['benefits']> = {
  bronze: { payoutSchedule: '1x_per_day', priorityFeeShare: 0, discoveryBoost: false, advancedAnalytics: false },
  silver: { payoutSchedule: '2x_per_day', priorityFeeShare: 0.1, discoveryBoost: true, advancedAnalytics: false },
  gold: { payoutSchedule: 'realtime', priorityFeeShare: 0.3, discoveryBoost: true, advancedAnalytics: true },
};

export const VENDOR_TIER_STATUS: VendorTierStatus = {
  current: 'bronze',
  next: 'silver',
  progress: {
    ordersCompleted: 6,
    ordersRequired: TIER_THRESHOLDS.bronze.ordersRequired,
    avgResponseSec: 260,
    responseRequiredSec: TIER_THRESHOLDS.bronze.responseRequiredSec,
    timeoutRejectRate: 0.02,
    timeoutRejectRateMax: 0.05,
  },
  benefits: TIER_BENEFITS.bronze,
};

/** Builds a full `Order` for the vendor board seed — `agoMin` fills `createdAt` so `minutesSince()` matches the design's original static "waitMins" numbers. */
function vendorOrder(spec: {
  id: string;
  queueNumber: number;
  agoMin: number;
  lines: { name: string; qty: number }[];
  isPriority: boolean;
  status: Order['status'];
  addonSubtotalRp?: number;
}): Order {
  const lines = toOrderLines(spec.lines);
  const subtotalRp = lines.reduce((a, l) => a + l.priceRp * l.qty, 0);
  const serviceFeeRp = PRICING.serviceFeeRp;
  const priorityFeeRp = spec.isPriority ? PRICING.priorityFeeRp : 0;
  const createdAt = new Date(Date.now() - spec.agoMin * 60_000).toISOString();
  const addons: Order['addons'] = spec.addonSubtotalRp
    ? [
        {
          id: `${spec.id}-addon-1`,
          parentOrderId: spec.id,
          lines: toOrderLines([{ name: 'Es Jeruk Peras', qty: 1 }]),
          feeRp: PRICING.addonFeeRp,
          status: 'paid',
          createdAt,
          subtotalRp: spec.addonSubtotalRp,
          totalRp: spec.addonSubtotalRp + PRICING.addonFeeRp,
        },
      ]
    : [];

  return {
    id: spec.id,
    vendorId: DEFAULT_VENDOR_ID,
    customerId: `cus_demo_${spec.id}`,
    queueNumber: spec.queueNumber,
    lines,
    subtotalRp,
    serviceFeeRp,
    totalRp: subtotalRp + serviceFeeRp + priorityFeeRp,
    status: spec.status,
    isPriority: spec.isPriority,
    addons,
    pickupCode: spec.status === 'ready' ? String(4000 + Math.floor(Math.random() * 5999)) : '',
    createdAt,
    estimatedReadyAt: null,
    confirmDeadlineAt: null,
    code: `#AY-${2000 + spec.queueNumber}`,
    vendorName: WARUNGS[DEFAULT_VENDOR_ID]!.name,
    priorityFeeRp,
    pickupMode: 'now',
  };
}

export const VENDOR_ORDERS: Order[] = [
  vendorOrder({ id: '5', queueNumber: 26, agoMin: 1, lines: [{ name: 'Ayam Penyet Original', qty: 1 }, { name: 'Es Teh Jumbo', qty: 2 }], isPriority: true, status: 'waiting_confirmation' }),
  vendorOrder({ id: '1', queueNumber: 24, agoMin: 2, lines: [{ name: 'Ayam Penyet Sambal Ijo', qty: 1 }, { name: 'Es Teh Jumbo', qty: 1 }], isPriority: true, status: 'waiting_confirmation' }),
  vendorOrder({ id: '2', queueNumber: 25, agoMin: 4, lines: [{ name: 'Nasi Goreng Spesial', qty: 2 }], isPriority: false, status: 'waiting_confirmation' }),
  vendorOrder({ id: '3', queueNumber: 23, agoMin: 6, lines: [{ name: 'Lele Penyet', qty: 1 }, { name: 'Tahu Tempe Penyet', qty: 1 }, { name: 'Es Jeruk Peras', qty: 1 }], isPriority: false, status: 'cooking', addonSubtotalRp: 10000 }),
  vendorOrder({ id: '4', queueNumber: 22, agoMin: 9, lines: [{ name: 'Seblak Ceker Pedas', qty: 1 }], isPriority: false, status: 'ready' }),
];

export const PREORDERS: Preorder[] = [
  { no: 'P-31', slot: '11.00', customer: 'Bu Sari', lines: [{ name: 'Ayam Penyet Sambal Ijo', qty: 2 }, { name: 'Es Teh Jumbo', qty: 2 }], priority: true },
  { no: 'P-32', slot: '11.00', customer: 'Kantor Pak Deni', lines: [{ name: 'Nasi Goreng Spesial', qty: 4 }], priority: false },
  { no: 'P-33', slot: '11.30', customer: 'Mbak Tuti', lines: [{ name: 'Lele Penyet', qty: 1 }, { name: 'Es Jeruk Peras', qty: 1 }], priority: false },
  { no: 'P-34', slot: '12.00', customer: 'Rapat Lantai 3', lines: [{ name: 'Ayam Penyet Original', qty: 6 }], priority: false },
  { no: 'P-35', slot: '12.00', customer: 'Mas Andi', lines: [{ name: 'Seblak Ceker Pedas', qty: 2 }], priority: true },
  { no: 'P-36', slot: '12.00', customer: 'Bu Rina', lines: [{ name: 'Nasi Goreng Spesial', qty: 1 }, { name: 'Es Teh Jumbo', qty: 2 }], priority: false },
  { no: 'P-37', slot: '12.30', customer: 'Pak Rahmat', lines: [{ name: 'Tahu Tempe Penyet', qty: 3 }], priority: false },
];

export const SLOT_ORDER = ['11.00', '11.30', '12.00', '12.30', '13.00'] as const;

export const PICKUP_RECORDS: PickupRecord[] = [
  { code: '4729', no: 'A-22', customer: 'Andi Wijaya', slot: 'Ambil sekarang', lines: [{ name: 'Seblak Ceker Pedas', qty: 1 }] },
  { code: '8315', no: 'A-23', customer: 'Sinta Dewi', slot: 'Ambil sekarang', lines: [{ name: 'Lele Penyet', qty: 1 }, { name: 'Tahu Tempe Penyet', qty: 1 }, { name: 'Es Jeruk Peras', qty: 1 }] },
  { code: '6042', no: 'P-31', customer: 'Bu Sari', slot: 'Slot 11.00', lines: [{ name: 'Ayam Penyet Sambal Ijo', qty: 2 }, { name: 'Es Teh Jumbo', qty: 2 }] },
];

export const VENDOR_MENU: VendorMenuItem[] = MENU.map((m) => ({
  id: m.id,
  name: m.name,
  priceRp: m.priceRp,
  cat: m.cat,
  inStock: true,
}));

export const PAYOUTS: Payout[] = [
  { id: 'p0', date: 'Hari ini', amountRp: 420_000, status: 'processing', sub: 'Menunggu dicairkan besok' },
  { id: 'p1', date: 'Kemarin · 21 Jul', amountRp: 1_180_000, status: 'completed', sub: 'BCA •••• 3391' },
  { id: 'p2', date: '20 Jul', amountRp: 960_000, status: 'completed', sub: 'BCA •••• 3391' },
  { id: 'p3', date: '19 Jul', amountRp: 1_035_000, status: 'completed', sub: 'BCA •••• 3391' },
];

export const TXNS: Txn[] = [
  { no: 'A-24', items: 'Ayam Sambal Ijo, Es Teh', time: '12.31', amount: 29000, refund: false },
  { no: 'A-23', items: 'Lele Penyet, Tahu, Es Jeruk', time: '12.24', amount: 35800, refund: false },
  { no: 'A-22', items: 'Seblak Ceker Pedas', time: '12.09', amount: 14500, refund: false },
  { no: 'A-21', items: 'Nasi Goreng Spesial ×2', time: '11.58', amount: 36000, refund: false },
  { no: 'A-20', items: 'Ayam Penyet Original', time: '11.47', amount: 20000, refund: true },
  { no: 'A-19', items: 'Es Teh Jumbo ×3', time: '11.32', amount: 23400, refund: false },
];

export const LOYAL_CUSTOMERS: LoyalCustomer[] = [
  { id: 'l1', name: 'Bu Sari', customerPhoneMasked: '0812-••••-101', initials: 'BS', orderCount: 38, isPriorityMember: true, favoriteItem: 'Ayam Sambal Ijo', avatarGradient: 'linear-gradient(135deg,#FFB870,#FF7A1A)' },
  { id: 'l2', name: 'Mas Andi', customerPhoneMasked: '0813-••••-202', initials: 'MA', orderCount: 27, isPriorityMember: true, favoriteItem: 'Nasi Goreng Spesial', avatarGradient: 'linear-gradient(135deg,#34C9A8,#16C784)' },
  { id: 'l3', name: 'Pak Rahmat', customerPhoneMasked: '0812-••••-303', initials: 'PR', orderCount: 19, isPriorityMember: false, favoriteItem: 'Lele Penyet', avatarGradient: 'linear-gradient(135deg,#A879FF,#7A3BF5)' },
  { id: 'l4', name: 'Dinda', customerPhoneMasked: '0821-••••-404', initials: 'DN', orderCount: 15, isPriorityMember: true, favoriteItem: 'Seblak Ceker', avatarGradient: 'linear-gradient(135deg,#FFB7A0,#FF7A5C)' },
  { id: 'l5', name: 'Koh Aliong', customerPhoneMasked: '0878-••••-505', initials: 'KA', orderCount: 12, isPriorityMember: false, favoriteItem: 'Es Teh Jumbo', avatarGradient: 'linear-gradient(135deg,#FFD98A,#F5A623)' },
  { id: 'l6', name: 'Mbak Tuti', customerPhoneMasked: '0856-••••-606', initials: 'MT', orderCount: 9, isPriorityMember: false, favoriteItem: 'Tahu Tempe Penyet', avatarGradient: 'linear-gradient(135deg,#8FB7FF,#4D7BF5)' },
];

/** Matches API_CONTRACT.md §4's reject-reason enum (vendor). */
export const REJECT_REASONS: RejectReason[] = [
  { id: 'bahan_habis', label: 'Bahan habis' },
  { id: 'terlalu_ramai', label: 'Terlalu ramai' },
  { id: 'tutup', label: 'Tutup dulu' },
];

/** Not part of API_CONTRACT.md's typed `Preorder`/`PickupRecord`, but re-exported for convenience where a raw display-line list is needed. */
export type { DisplayLine };
