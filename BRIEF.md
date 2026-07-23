# BRIEF — Frontend "JajanHub" (Next.js)

Kamu (Claude Code) akan membangun **frontend saja** untuk platform pemesanan makanan pedagang kaki lima bernama **JajanHub**. Backend TERPISAH memakai ElysiaJS (Bun) — kamu TIDAK membangun backend, hanya memanggilnya lewat HTTP/WebSocket.

Ada tiga file design HTML hasil "Claude Design" sebagai sumber kebenaran visual:
- `Antri_dc.html` — Customer App
- `Antri_Pedagang_dc.html` — Vendor App
- `Antri_Landing_dc.html` — Landing / marketing (opsional, kerjakan paling akhir)

> Catatan nama: file design masih berjudul "Antri" (nama sementara sebelumnya). Nama aplikasi resmi sekarang **JajanHub** — pakai "JajanHub" di semua teks, judul, metadata, dan penamaan baru (folder, package.json, dsb). Isi visual/logika di file HTML tetap valid sebagai referensi; hanya nama produknya yang berubah.

Tugasmu: **port** design ini ke aplikasi Next.js yang rapi dan maintainable. Ini port, bukan copy-paste — lihat bagian "Cara membaca file design" di bawah.

---

## 0. Prinsip utama (baca dulu, jangan dilanggar)

1. **Frontend-only.** JANGAN pakai Next.js API Routes atau Server Actions untuk logika bisnis. Semua data/aksi lewat client API ke backend Elysia. Server Components boleh dipakai untuk *fetch data awal* (mis. detail warung), tapi fetch-nya tetap memanggil Elysia — bukan DB langsung.
2. **Jangan salin inline style dari file design apa adanya.** File design penuh `style="..."` panjang. Pindahkan ke Tailwind memakai token di Bagian 3. Menyalin inline style = ditolak.
3. **Fidelity visual tinggi.** Hasil akhir harus terlihat sama dengan file design (warna, radius, font, spacing, animasi). Design adalah sumber kebenaran; jika ragu, buka file HTML-nya dan tiru.
4. **TypeScript ketat.** `strict: true`. Tidak ada `any` kecuali benar-benar terpaksa dengan komentar alasannya.
5. **Mobile-first & responsive.** Customer app dibungkus kolom max-width ~420px (lihat design). Vendor app app-like dengan bottom nav; harus rapi di HP dan tablet.
6. Kerjakan bertahap sesuai "Rencana build" (Bagian 7). Selesaikan satu milestone sampai bisa dijalankan sebelum lanjut. Commit di tiap milestone.

---

## 1. Cara membaca file design (DSL → React)

File design memakai runtime kecil (`support.js`) yang meng-compile DSL ke React. Kamu TIDAK memakai `support.js`; kamu menerjemahkan DSL-nya ke JSX asli. Petanya:

| DSL di file design | Terjemahan React/JSX |
|---|---|
| `<sc-if value="{{ isMenu }}">…</sc-if>` | `{isMenu && (<>…</>)}` |
| `<sc-for list="{{ menu }}" as="item">…</sc-for>` | `{menu.map((item) => (<>…</>))}` |
| `{{ totalStr }}` (interpolasi teks) | `{totalStr}` |
| `onClick="{{ payNow }}"` | `onClick={payNow}` |
| `style="color:{{ c }}"` | pindahkan ke Tailwind / `style={{ color: c }}` bila dinamis |
| `style-active="transform:scale(.98)"` | Tailwind `active:scale-[.98]` |
| `hint-placeholder-val` / `hint-placeholder-count` | ABAIKAN — itu hanya data contoh waktu design |

**Logika ada di `<script data-dc-script>` paling bawah tiap file.** Isinya class component gaya React lama:
- `state = { screen:'splash', cart:{}, ... }` → jadikan `useReducer` (customer app kompleks) atau kumpulan `useState`.
- `go('queue')` yang cuma menukar `screen` → JANGAN ditiru mentah. Ubah jadi **navigasi route Next.js** untuk layar utama; sisakan sebagai state hanya untuk overlay/sheet (lihat Bagian 5).
- Method seperti `add()`, `remove()`, `renderVals()` → pindahkan jadi handler + nilai turunan (`useMemo`).
- Konstanta data (`MENU`, `PLANS`, `TXNS`, `LOYAL`, `PAYOUTS`, dll) → ekstrak jadi seed/mock di `lib/mock/` supaya UI bisa jalan sebelum backend siap. Nanti diganti panggilan API.

**Timer simulasi bukan fitur nyata.** Di design ada `setInterval` yang menurunkan `payLeft`, `peopleAhead`, `etaMin`, dan menaikkan `queueStage`. Itu dummy. Untuk sekarang, pertahankan sebagai simulasi lokal DI BALIK lapisan data (lihat Bagian 6) supaya mudah ditukar ke WebSocket nanti.

---

## 2. Arsitektur & struktur folder

Gunakan **monorepo pnpm + Turborepo**:

```
jajanhub/
├─ apps/
│  ├─ customer/      # Next.js App Router — PWA, image opt, SEO discovery
│  └─ vendor/        # Next.js App Router — app-like, di balik login
├─ packages/
│  ├─ ui/            # komponen bersama: Button, BottomSheet, QueueBadge, Money, dst
│  ├─ tokens/        # tailwind preset (warna/font/radius) — satu sumber
│  └─ api/           # API client ke Elysia + tipe + hook data
├─ package.json
├─ pnpm-workspace.yaml
└─ turbo.json
```

- Kedua app meng-`extends` preset Tailwind dari `packages/tokens`.
- Komponen yang muncul di dua app (tombol, sheet, badge status, formatter Rupiah) tinggal di `packages/ui`.
- Semua akses backend lewat `packages/api`. Tidak ada `fetch` mentah tersebar di komponen.

Stack per app: Next.js (App Router) + React + TypeScript + Tailwind. State server/data pakai **TanStack Query**. State lokal UI pakai `useReducer`/`useState`/Zustand bila perlu global ringan.

---

## 3. Design tokens (WAJIB dipakai)

Diambil dari file design. Taruh di `packages/tokens/tailwind-preset.js` dan extend di tiap app.

```js
// packages/tokens/tailwind-preset.js
module.exports = {
  theme: {
    extend: {
      colors: {
        brand:  { light:'#FFB870', DEFAULT:'#FF7A1A', deep:'#E4560A', press:'#C4402F' },
        mint:   { DEFAULT:'#16C784', deep:'#0E9F6E', soft:'#DFF7EC' },
        prio:   { DEFAULT:'#7A3BF5' },   // antrian prioritas / subscription
        danger: { DEFAULT:'#E5484D' },   // batal / refund / peringatan
        ink:   '#23180F',   // teks utama
        muted: '#6B5D50',
        faint: '#9A8A7C',
        line:  '#EDE3D6',   // border/pemisah
        cream: '#FFF8F1',   // background app (dalam)
        sand:  '#E7DCCE',   // background luar
        card:  '#FFFFFF',
      },
      fontFamily: {
        display: ['var(--font-bricolage)','system-ui','sans-serif'], // angka besar & judul
        sans:    ['var(--font-jakarta)','system-ui','sans-serif'],   // body
      },
      borderRadius: { xl:'16px', '2xl':'20px', '3xl':'26px' },
      boxShadow: { soft:'0 14px 34px rgba(35,24,15,.11)' },
    },
  },
};
```

Font via `next/font/google`: **Bricolage Grotesque** (angka antrian, judul besar) dan **Plus Jakarta Sans** (body). Set variabel `--font-bricolage` dan `--font-jakarta` di root layout tiap app.

Animasi keyframes yang dipakai design (screenIn, pop, pulse, floaty, sheetUp, qnum, ringpulse, ripple) → definisikan di `globals.css` masing-masing app, atau map ke plugin Tailwind. Tiru nama & timing dari `<style>` di file design.

---

## 4. Pemetaan screen → route

Layar utama jadi URL asli (penting untuk QR per-gerobak, share link, dan SEO discovery). Overlay/sheet tetap state lokal.

### Customer app (`apps/customer`)
| Screen di design | Route Next.js |
|---|---|
| Splash + Landing + Menu | `/m/[merchantIds]` (QR gerobak mengarah ke sini; splash = state transisi singkat) |
| Cart / Checkout | `/m/[merchantId]/cart` |
| Payment (QRIS) | `/order/[orderId]/pay` |
| Queue Status (hero) | `/order/[orderId]` |
| Pickup Code | `/order/[orderId]` (sub-state "siap diambil") |
| Refund Status | `/order/[orderId]` (sub-state) atau `/order/[orderId]/refund` |
| Discovery "Sekitar Sini" | `/near` (Server Component + SSR untuk SEO) |
| Subscription | `/subscribe` |
| Profile | `/profile` |
| Rating | modal setelah pesanan selesai (state lokal) |

### Vendor app (`apps/vendor`) — semua di balik login, tak butuh SEO
Satu layout dengan bottom nav (tiru dari design):
`/orders` (Papan Pesanan, default) · `/analytics` (Laporan) · `/settlement` (Pencairan) · `/menu` (Kelola Menu) · `/customers` (Pelanggan Setia) · `/settings` (Pengaturan) · `/beranda` (Beranda/ringkasan).

---

## 5. Yang HARUS tetap jadi state lokal (bukan route)

Ini modal/bottom sheet, bukan halaman:
- **Customer:** Cancel Sheet (bottom sheet konfirmasi batal), toast notifikasi, sheet pilih paket saat toggle prioritas.
- **Vendor:** Overlay Verifikasi Kode pengambilan, Overlay Stok Habis, Overlay Tolak Pesanan.

Bangun satu komponen `<BottomSheet>` reusable di `packages/ui` (animasi `sheetUp`, backdrop `fadeIn`, drag-to-dismiss opsional) dan pakai untuk semua sheet di atas.

---

## 6. Lapisan data (siap backend, jalan tanpa backend)

Backend belum tentu siap saat kamu bekerja. Jadi:

1. Definisikan semua tipe domain di `packages/api/types.ts` (`Warung`, `MenuItem`, `Order`, `OrderStatus`, `QueueState`, `Payout`, `LoyalCustomer`, dst) — turunkan dari data konstan di file design.
2. Buat interface client di `packages/api/client.ts` dengan fungsi seperti `getWarung(id)`, `createOrder(...)`, `getOrder(id)`, `cancelOrder(id)`, `subscribeQueue(orderId, cb)`.
3. Sediakan DUA implementasi di balik interface yang sama:
   - **mock** (default sekarang): pakai seed dari `lib/mock/`, dan simulasikan progres antrian/pembayaran dengan timer seperti di design.
   - **http** (nanti): `fetch` ke base URL Elysia (`NEXT_PUBLIC_API_URL`), dan realtime via WebSocket/SSE ke endpoint Elysia.
   Pilih implementasi lewat env (`NEXT_PUBLIC_API_MODE=mock|http`).
4. Untuk realtime antrian, ekspos `subscribeQueue(orderId, cb)`. Implementasi mock memanggil `cb` dengan interval; implementasi http membuka WebSocket. Komponen UI tidak tahu bedanya.

> Jika backend TypeScript memakai Elysia + Eden Treaty, siapkan `packages/api` agar mudah diganti ke Eden client (type-safe end-to-end tanpa codegen). Untuk sekarang, tipe manual + fetch sudah cukup.

Konsumsi semua ini di komponen lewat **TanStack Query** (`useQuery`/`useMutation`) + satu hook realtime tipis untuk `subscribeQueue`.

---

## 7. Rencana build (kerjakan berurutan, commit tiap milestone)

**M0 — Fondasi.** Monorepo pnpm+Turbo, dua app Next kosong, `packages/tokens` + Tailwind preset + font, `packages/ui` dengan Button & Money & BottomSheet, `packages/api` (tipe + interface + mock kosong). Pastikan `pnpm dev` menjalankan kedua app.

**M1 — Alur inti customer (paling penting).** `/m/[merchantId]`: Landing + Menu + keranjang mengambang → `/m/[merchantId]/cart` → `/order/[orderId]/pay` (QRIS + countdown) → `/order/[orderId]` (Queue hero, angka antrian raksasa, progres real-time via `subscribeQueue` mock). Ini tulang punggung; harus mulus dulu.

**M2 — Refund & pickup customer.** Cancel Sheet + status refund + kode pengambilan, sesuai design.

**M3 — Sisa customer.** Discovery `/near` (SSR), Subscription, Profile, Rating modal. Setup PWA (installable, offline shell) + `next/image` untuk foto menu.

**M4 — Vendor app.** Layout + bottom nav, lalu Papan Pesanan (`/orders`) dengan aksi Mulai Masak / Siap Diambil / Tolak, badge prioritas di atas. Lalu Beranda, Settlement, Analytics (dengan banner free trial + kartu premium ter-blur), Pelanggan Setia, Kelola Menu (toggle stok cepat), Pengaturan, plus tiga overlay (verifikasi kode, stok habis, tolak).

**M5 — Sambung backend.** Ganti `NEXT_PUBLIC_API_MODE` ke `http`, implementasikan client HTTP + WebSocket ke Elysia, perbaiki tipe, tangani loading/error/empty state di semua layar.

**M6 (opsional) — Landing/marketing** dari `Antri_Landing_dc.html`.

---

## 8. Definition of done per layar

Sebuah layar dianggap selesai bila:
- Cocok secara visual dengan file design (warna/font/radius/spacing/animasi dari token, bukan inline style).
- Responsive di 360px, tablet, desktop — tidak ada overflow horizontal, tap target ≥ 44px.
- Semua data lewat `packages/api` (mock sekarang), bukan hardcode di JSX.
- Punya loading, empty, dan error state yang wajar (bukan layar kosong/putih).
- Aksesibilitas dasar: elemen interaktif adalah `<button>`/`<a>`, ada `aria-label` untuk tombol ikon, fokus terlihat.
- Tidak ada `console.error`, tidak ada warning React soal key/hydration.

---

## 9. Catatan realistis (jangan overclaim di UI)

Teks seperti "dana kembali 1–3 hari kerja" dan "cair besok ±jam 10.00" bergantung pada payment gateway & jadwal disbursement yang belum final. Untuk sekarang tampilkan sebagai teks yang mudah diubah dari satu tempat (`packages/api` config/const), jangan hardcode tersebar, supaya gampang disesuaikan saat aturan gateway jelas.

---

## Referensi cepat
- File design: `Antri_dc.html` (customer), `Antri_Pedagang_dc.html` (vendor), `Antri_Landing_dc.html` (landing).
- `support.js` HANYA referensi cara DSL bekerja — jangan diimpor ke project.
- Data konstan untuk seed ada di `<script data-dc-script>` tiap file (`MENU`, `PLANS`, `TXNS`, `LOYAL`, `PAYOUTS`, `REJECT_REASONS`, dll).
- Env: `NEXT_PUBLIC_API_MODE` (`mock`|`http`), `NEXT_PUBLIC_API_URL` (base URL Elysia).

Mulai dari **M0**, konfirmasikan struktur berjalan, lalu lanjut **M1**. Tanyakan hanya bila ada keputusan yang benar-benar ambigu; selain itu, ikuti brief ini.
