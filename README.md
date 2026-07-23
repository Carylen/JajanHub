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

## Deployment (Vercel)

Each app deploys as its **own Vercel project** — separate domains, separate
release cycles, separate env vars. Both `apps/customer/vercel.json` and
`apps/vendor/vercel.json` are already committed with the build/install commands
needed for a pnpm+Turborepo monorepo (`cd` to repo root so workspace deps
resolve, then build only that app via `turbo run build --filter=...`).

For each app, create a separate Vercel project pointing at this repo:

1. **Root Directory** → `apps/customer` (or `apps/vendor`). Vercel picks up
   that folder's `vercel.json` automatically — no other settings needed.
2. **Environment variables** (Project Settings → Environment Variables):
   - `NEXT_PUBLIC_API_MODE` — `mock` until the Elysia backend is ready, then `http`.
   - `NEXT_PUBLIC_API_URL` — the Elysia backend base URL (only used in `http` mode).
3. Push to `main` → Vercel builds and deploys. Preview deployments work the
   same way per-PR, scoped to whichever app's files changed
   (`ignoreCommand: npx turbo-ignore` skips a build if that app is unaffected).

Recommended domain layout: customer app on the apex/public domain (it's the
one that needs SEO for `/near`), vendor app on a subdomain like
`pedagang.jajanhub.com` (it's login-gated, no SEO concerns).

## Design source

Visual truth lives in the `Antre/*.dc.html` design files. Components are a
faithful **port** (tokens, not inline styles), not a copy.
