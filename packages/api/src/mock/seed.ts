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
  PickupRecord,
  PickupSlot,
  Preorder,
  RejectReason,
  Stall,
  SubscriptionBenefit,
  SubscriptionPlan,
  Txn,
  UserProfile,
  VendorMenuItem,
  VendorOrder,
  VendorSummary,
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

export const VENDOR_SUMMARY: VendorSummary = {
  merchantName: 'Ayam Penyet My Bosz',
  greeting: 'Halo Pak Budi',
  dateLabel: 'Senin, 22 Jul',
  revenueToday: 1_240_000,
  revenueDeltaPct: 18,
  ordersToday: 42,
  avgServeLabel: '4 mnt 30 dtk',
  tier: 'bronze',
  tierOrdersThisWindow: 6,
};

export const VENDOR_ORDERS: VendorOrder[] = [
  { id: '5', no: 'A-26', waitMins: 1, lines: [{ name: 'Ayam Penyet Original', qty: 1 }, { name: 'Es Teh Jumbo', qty: 2 }], total: 36000, priority: true, status: 'baru' },
  { id: '1', no: 'A-24', waitMins: 2, lines: [{ name: 'Ayam Penyet Sambal Ijo', qty: 1 }, { name: 'Es Teh Jumbo', qty: 1 }], total: 30000, priority: true, status: 'baru' },
  { id: '2', no: 'A-25', waitMins: 4, lines: [{ name: 'Nasi Goreng Spesial', qty: 2 }], total: 38000, priority: false, status: 'baru' },
  { id: '3', no: 'A-23', waitMins: 6, lines: [{ name: 'Lele Penyet', qty: 1 }, { name: 'Tahu Tempe Penyet', qty: 1 }, { name: 'Es Jeruk Peras', qty: 1 }], total: 37000, priority: false, status: 'masak', addonCount: 1 },
  { id: '4', no: 'A-22', waitMins: 9, lines: [{ name: 'Seblak Ceker Pedas', qty: 1 }], total: 15000, priority: false, status: 'siap' },
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
  price: m.price,
  cat: m.cat,
  inStock: true,
}));

export const PAYOUTS: Payout[] = [
  { id: 'p0', date: 'Hari ini', amount: 420_000, status: 'Diproses', sub: 'Menunggu dicairkan besok' },
  { id: 'p1', date: 'Kemarin · 21 Jul', amount: 1_180_000, status: 'Cair', sub: 'BCA •••• 3391' },
  { id: 'p2', date: '20 Jul', amount: 960_000, status: 'Cair', sub: 'BCA •••• 3391' },
  { id: 'p3', date: '19 Jul', amount: 1_035_000, status: 'Cair', sub: 'BCA •••• 3391' },
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
  { id: 'l1', name: 'Bu Sari', initials: 'BS', transactions: 38, member: true, favorite: 'Ayam Sambal Ijo', avatarGradient: 'linear-gradient(135deg,#FFB870,#FF7A1A)' },
  { id: 'l2', name: 'Mas Andi', initials: 'MA', transactions: 27, member: true, favorite: 'Nasi Goreng Spesial', avatarGradient: 'linear-gradient(135deg,#34C9A8,#16C784)' },
  { id: 'l3', name: 'Pak Rahmat', initials: 'PR', transactions: 19, member: false, favorite: 'Lele Penyet', avatarGradient: 'linear-gradient(135deg,#A879FF,#7A3BF5)' },
  { id: 'l4', name: 'Dinda', initials: 'DN', transactions: 15, member: true, favorite: 'Seblak Ceker', avatarGradient: 'linear-gradient(135deg,#FFB7A0,#FF7A5C)' },
  { id: 'l5', name: 'Koh Aliong', initials: 'KA', transactions: 12, member: false, favorite: 'Es Teh Jumbo', avatarGradient: 'linear-gradient(135deg,#FFD98A,#F5A623)' },
  { id: 'l6', name: 'Mbak Tuti', initials: 'MT', transactions: 9, member: false, favorite: 'Tahu Tempe Penyet', avatarGradient: 'linear-gradient(135deg,#8FB7FF,#4D7BF5)' },
];

export const REJECT_REASONS: RejectReason[] = [
  { id: 'habis', label: 'Bahan habis' },
  { id: 'ramai', label: 'Terlalu ramai' },
  { id: 'tutup', label: 'Tutup dulu' },
];
