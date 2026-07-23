/**
 * Seed data ported verbatim (values) from the design files' `<script>`
 * constants: MENU, BENEFITS, PLANS, STALLS, SLOTS, CANCEL_REASONS, plus the
 * vendor TXNS/LOYAL/PAYOUTS/REJECT_REASONS. Swapped for backend responses in
 * http mode; kept here so the UI runs with no backend.
 */
import type {
  LoyalCustomer,
  MenuItem,
  Payout,
  PickupSlot,
  RejectReason,
  Stall,
  SubscriptionBenefit,
  SubscriptionPlan,
  UserProfile,
  VendorOrder,
  Warung,
} from '../types';

export const MENU: MenuItem[] = [
  { id: 'ayam-ijo', name: 'Ayam Penyet Sambal Ijo', desc: 'Ayam goreng garing, sambal hijau nampol', price: 22000, cat: 'food', best: true, available: true },
  { id: 'ayam-ori', name: 'Ayam Penyet Original', desc: 'Sambal terasi khas + lalapan segar', price: 20000, cat: 'food', available: true },
  { id: 'lele', name: 'Lele Penyet', desc: 'Lele goreng kremes, sambal mentah', price: 19000, cat: 'food', available: true },
  { id: 'nasgor', name: 'Nasi Goreng Spesial', desc: 'Telur, ayam suwir, kerupuk, acar', price: 18000, cat: 'food', best: true, available: true },
  { id: 'seblak', name: 'Seblak Ceker Pedas', desc: 'Kerupuk basah, ceker, level 1–5', price: 15000, cat: 'food', available: true },
  { id: 'tahutempe', name: 'Tahu Tempe Penyet', desc: 'Gorengan hangat + sambal bawang', price: 8000, cat: 'food', available: true },
  { id: 'esteh', name: 'Es Teh Jumbo', desc: 'Manis segar, gelas jumbo', price: 8000, cat: 'drink', best: true, available: true },
  { id: 'esjeruk', name: 'Es Jeruk Peras', desc: 'Jeruk peras asli, seger', price: 10000, cat: 'drink', available: true },
];

export const WARUNGS: Record<string, Warung> = {
  'my-bosz': {
    id: 'my-bosz',
    name: 'Ayam Penyet My Bosz',
    tagline: 'Sambal nampol, antre terpantau',
    address: 'Jl. Merdeka No.12',
    rating: 4.8,
    orderCount: 320,
    openFrom: '10.00',
    openTo: '22.00',
    isOpen: true,
    peopleAhead: 12,
    etaMin: 18,
    menu: MENU,
  },
};

export const DEFAULT_MERCHANT_ID = 'my-bosz';

export const BENEFITS: SubscriptionBenefit[] = [
  { title: 'Prioritas antrean tiap pesan', sub: 'Pesananmu naik ke urutan depan otomatis' },
  { title: 'Gratis biaya prioritas', sub: 'Hemat Rp8.000 setiap kali pesan' },
  { title: 'Berlaku di semua gerobak JajanHub', sub: 'Sekali langganan, dipakai di mana aja' },
  { title: 'Promo & menu spesial mingguan', sub: 'Diskon rutin khusus member' },
];

export const PLANS: SubscriptionPlan[] = [
  { id: 'bulan', name: 'Bulanan', note: 'Fleksibel, bisa stop kapan aja', price: 15000, per: '/bulan' },
  { id: 'tahun', name: 'Tahunan', note: 'Cuma Rp12.400/bulan', price: 149000, per: '/tahun', badge: 'HEMAT 17%' },
];

export const STALLS: Stall[] = [
  { id: 'my-bosz', name: 'Ayam Penyet My Bosz', type: 'Nasi · Ayam', category: 'nasi', distance: '80 m', queue: 3, open: true, mapX: '46%', mapY: '42%' },
  { id: 'mie-gino', name: 'Mie Ayam Pak Gino', type: 'Mie · Bakso', category: 'mie', distance: '120 m', queue: 15, open: true, mapX: '72%', mapY: '26%' },
  { id: 'kelapa-nur', name: 'Es Kelapa Bu Nur', type: 'Minuman', category: 'minuman', distance: '60 m', queue: 2, open: true, mapX: '28%', mapY: '62%' },
  { id: 'taichan-jul', name: 'Sate Taichan Bang Jul', type: 'Jajanan · Sate', category: 'jajanan', distance: '200 m', queue: 8, open: true, mapX: '60%', mapY: '68%' },
  { id: 'padang-sederhana', name: 'Nasi Padang Sederhana', type: 'Nasi Padang', category: 'nasi', distance: '150 m', queue: 6, open: true, mapX: '18%', mapY: '32%' },
  { id: 'kopi-kaki-lima', name: 'Kopi Kaki Lima', type: 'Minuman · Kopi', category: 'minuman', distance: '90 m', queue: 4, open: true, mapX: '84%', mapY: '54%' },
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

export const CANCEL_REASONS = ['Salah pesan', 'Kelamaan', 'Berubah pikiran'] as const;

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

export const VENDOR_ORDERS: VendorOrder[] = [
  {
    id: 'AY-2071',
    code: '#AY-2071',
    queueLabel: 'A27',
    customerName: 'Rizky P.',
    lines: [
      { name: 'Ayam Penyet Sambal Ijo', qty: 1 },
      { name: 'Es Teh Jumbo', qty: 2 },
    ],
    total: 40000,
    priority: true,
    status: 'new',
    pickupCode: '4729',
    placedAgo: '2 mnt lalu',
  },
  {
    id: 'AY-2072',
    code: '#AY-2072',
    queueLabel: 'A28',
    customerName: 'Dewi S.',
    lines: [{ name: 'Nasi Goreng Spesial', qty: 1 }],
    total: 20000,
    priority: false,
    status: 'cooking',
    pickupCode: '8153',
    placedAgo: '5 mnt lalu',
  },
  {
    id: 'AY-2073',
    code: '#AY-2073',
    queueLabel: 'A29',
    customerName: 'Bagus W.',
    lines: [
      { name: 'Lele Penyet', qty: 2 },
      { name: 'Es Jeruk Peras', qty: 1 },
    ],
    total: 48000,
    priority: false,
    status: 'ready',
    pickupCode: '3061',
    placedAgo: '9 mnt lalu',
  },
];

export const PAYOUTS: Payout[] = [
  { id: 'p1', date: '22 Jul 2026', amount: 1_240_000, status: 'settled' },
  { id: 'p2', date: '21 Jul 2026', amount: 980_000, status: 'settled' },
  { id: 'p3', date: '20 Jul 2026', amount: 1_115_000, status: 'settled' },
];

export const LOYAL_CUSTOMERS: LoyalCustomer[] = [
  { id: 'l1', name: 'Rizky Pratama', initials: 'RP', orders: 48, lastVisit: 'Hari ini', spend: 1_120_000 },
  { id: 'l2', name: 'Dewi Sartika', initials: 'DS', orders: 31, lastVisit: 'Kemarin', spend: 740_000 },
  { id: 'l3', name: 'Bagus Wibowo', initials: 'BW', orders: 22, lastVisit: '2 hari lalu', spend: 560_000 },
];

export const REJECT_REASONS: RejectReason[] = [
  { id: 'habis', label: 'Bahan habis' },
  { id: 'tutup', label: 'Mau tutup' },
  { id: 'ramai', label: 'Lagi ramai banget' },
  { id: 'lain', label: 'Alasan lain' },
];
