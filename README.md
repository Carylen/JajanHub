# JajanHub

Frontend for **JajanHub** — a queue-aware ordering platform for street-food vendors.
Two Next.js apps in a pnpm + Turborepo monorepo. Backend (ElysiaJS) is separate;
this repo only talks to it over HTTP/WebSocket via `packages/api`.

## Structure

```
apps/
  customer/   Next.js App Router — PWA, mobile-first, SEO discovery
  vendor/     Next.js App Router — app-like dashboard behind (future) login
packages/
  ui/         Shared components: Button, BottomSheet, Money, Icon, QrCode, …
  tokens/     Tailwind preset (colors/fonts/radius/animations) — one source
  api/        Client interface to Elysia + domain types + TanStack Query hooks
```

## Getting started

```bash
pnpm install
pnpm dev            # runs both apps via turbo
```

- Customer app → http://localhost:3000
- Vendor app → http://localhost:3001

`pnpm build`, `pnpm typecheck`, and `pnpm lint` run across the whole workspace.

## Data layer

All backend access goes through `packages/api` — never raw `fetch` in components.
Two implementations sit behind one `JajanhubClient` interface, chosen by env:

| `NEXT_PUBLIC_API_MODE` | Behaviour |
| ---------------------- | --------- |
| `mock` (default)       | In-memory seed data + timer-simulated queue/payment/refund. Runs with no backend. |
| `http`                 | `fetch` + WebSocket to `NEXT_PUBLIC_API_URL` (Elysia). |

Realtime queue/refund updates are exposed as `subscribeQueue` / `subscribeRefund`
so the UI is identical in both modes. See `apps/customer/.env.example`.

## Design source

Visual truth lives in the `Antre/*.dc.html` design files. Components are a
faithful **port** (tokens, not inline styles), not a copy — see `BRIEF.md`.
