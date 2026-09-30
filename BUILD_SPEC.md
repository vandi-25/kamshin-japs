# E-commerce Build Spec — Store + Admin (one Next.js app, split by domain)

Full e-commerce platform inside this Next.js + TypeScript project. Work in phases.
Stop at the end of every phase, report back, and wait for "continue" before starting the next one.
**Never deploy anything.** The owner deploys manually, one at a time.

> **Revision log**
> - Rev 2 (Phase 0 answers): Next 16 → `proxy.ts`; Prisma pinned to stable 7.10.0; Auth.js v5 beta pinned exactly;
>   `bcryptjs`; Vitest; Neon Postgres with `DATABASE_URL` (pooled) + `DIRECT_URL` (migrations); unknown hosts are
>   treated as the store; hosting on Vercel (keep costs minimal); Upstash free tier for rate limiting; seed products
>   have no images (UI placeholder); `STORE_URL` added.
> - Rev 2 (spec change): **Cloudinary replaced by Vercel Blob.**
> - Rev 3: **Design preview** added before Phase 2 (see below). Brand: Kamshin, luxury perfumes, burgundy `#4B0F1A`,
>   gold `#D4AF37`, taupe `#D8C6B4`, luxury + minimal, text logo until a real one exists. Product model gains perfume
>   fields (`sizeMl`, `concentration`, `topNotes`/`heartNotes`/`baseNotes`, `isFeatured`) and Category gains `tagline`.

## Ground rules (apply to every phase)

1. **Diagnose before you change.** Inspect relevant files at the start of each phase and report findings before editing.
2. **Don't guess about infrastructure.** If env values, domains, DB URLs or API keys are unclear, stop and ask.
3. **Every phase ends with a report**: files created/changed, commands to run, step-by-step test instructions,
   decisions and why, known gaps/TODOs.
4. **Validate on the server.** Every mutation (server action or route handler) validates input with Zod and checks
   auth/role on the server. Client-side checks are UX only.
5. **Money is an integer in kobo.** Never floats for prices. Format as NGN (₦) only at display time.
6. **TypeScript strict. No `any`.** `npm run build` and `npm run lint` must pass before a phase is reported done.
7. **Keep secrets out of the client.** Only `NEXT_PUBLIC_*` may reach the browser. Keep `.env.example` current.
8. **Keep running costs minimal** (Vercel + Neon + Upstash + Blob free/hobby tiers).

## Tech stack (as installed)

| Concern | Choice |
|---|---|
| Framework | Next.js **16.3.6** App Router, React 19.2, TypeScript strict. Server Components by default, Server Actions for mutations. Request APIs (`params`, `searchParams`, `cookies()`, `headers()`) are async. |
| Routing guard | **`proxy.ts`** (Next 16 rename of `middleware.ts`; Node.js runtime) |
| Styling/UI | Tailwind CSS v4 + shadcn/ui |
| Database | PostgreSQL on **Neon** + **Prisma 7.10.0** (pinned, stable). `prisma.config.ts`; `prisma-client` generator; `@prisma/adapter-pg` driver adapter. Runtime uses `DATABASE_URL` (pooled); migrations use `DIRECT_URL` (direct). |
| Auth | Auth.js (NextAuth v5, **exact beta pin**), Credentials provider, **bcryptjs**, JWT sessions, `id` + `role` in token/session. `trustHost: true`, no fixed `AUTH_URL` (two hosts). Cookies host-only (default). |
| Validation | Zod (v4), schemas shared between forms and server |
| Forms | react-hook-form + `@hookform/resolvers/zod` |
| Payments | Paystack (NGN). Initialize server-side; verify via webhook (HMAC-SHA512 with secret key) **and** via callback. |
| Image storage | **Vercel Blob** (client uploads from admin only). If `BLOB_READ_WRITE_TOKEN` isn't configured, stop and ask — no silent fallback. |
| Rate limiting | Upstash Redis (free tier), Phase 8 |
| Tests | Vitest |
| Hosting | Vercel (owner deploys manually) |

## Domain split: store vs admin

- `yourdomain.com` → customer storefront; `admin.yourdomain.com` → admin dashboard
- Local dev: `localhost:3000` (store) and `admin.localhost:3000` (admin)
- Pages live in `app/(store)/...` and `app/admin/...`.
- `proxy.ts` reads the `host` header:
  - **Admin host** (`ADMIN_HOST`): rewrite to `/admin/*`. Unauthenticated → admin login. Non-ADMIN → 403 page.
  - **Store host** (`STORE_HOST`) **and any unknown host** (e.g. Vercel preview URLs): treated as the store; any direct
    `/admin` path returns 404. The admin opens **only** on `ADMIN_HOST`.
- Hostnames configurable via `STORE_HOST` / `ADMIN_HOST` (include the port locally, since `host` does).
- Auth cookies stay host-only so admin and customer sessions are separate.
- Role checks also happen inside every admin page, layout, server action and route handler. The proxy is not the only guard.

## Data model (Prisma)

- **User**: id, name, email (unique), passwordHash, role (`CUSTOMER` | `ADMIN`, default `CUSTOMER`), createdAt
- **Address**: id, userId, fullName, phone, line1, line2?, city, state, isDefault
- **Category**: id, name, slug (unique)
- **Product**: id, name, slug (unique), description, priceKobo (Int), compareAtPriceKobo (Int?), stock (Int),
  isActive (Boolean), categoryId?, createdAt, updatedAt
- **ProductImage**: id, productId, **url**, **pathname** (Vercel Blob pathname; replaces Cloudinary `publicId`), position
- **Cart**: id, userId? (unique, nullable for guests), createdAt, updatedAt
- **CartItem**: id, cartId, productId, quantity (unique on cartId + productId)
- **Order**: id, orderNumber (human-readable), userId, status (`PENDING` | `PAID` | `PROCESSING` | `SHIPPED` |
  `DELIVERED` | `CANCELLED`), subtotalKobo, shippingKobo, totalKobo, paystackReference (unique), shipping address
  snapshot fields, createdAt
- **OrderItem**: id, orderId, productId, name snapshot, unitPriceKobo snapshot, quantity

Indexes where queries need them (slug, categoryId, isActive, userId, status).

## Environment variables

| Variable | Phase | Notes |
|---|---|---|
| `DATABASE_URL` | 1 | Neon **pooled** URL (runtime) |
| `DIRECT_URL` | 1 | Neon **direct** URL (migrations, via `prisma.config.ts`) |
| `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` | 1 | First admin |
| `AUTH_SECRET` | 2 | `npx auth secret` |
| `STORE_HOST` / `ADMIN_HOST` | 3 | e.g. `localhost:3000` / `admin.localhost:3000` |
| `STORE_URL` | 4/6 | Full store origin; Paystack `callback_url`, `metadataBase` |
| `PAYSTACK_SECRET_KEY` | 6 | `sk_test_…` in dev |
| `SHIPPING_FLAT_FEE_KOBO` | 6 | Integer kobo |
| `BLOB_READ_WRITE_TOKEN` | 7 | Vercel Blob store token |
| `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` | 8 | Rate limiting |

## Design preview (current state)

A client-facing preview of every store and admin screen, built as the real Next.js pages but running on sample data
(`lib/demo/*`) so it deploys to Vercel with **no environment variables**.

- Catalogue reads go through `lib/catalog.ts`; its function bodies swap to Prisma in Phase 4 with the same signatures.
- Cart lives in the browser (`lib/demo/cart-store.ts`) until Phase 5's server cart.
- Sign-in, checkout/Paystack, admin saves, uploads and role changes show a toast and change nothing.
- A gold banner on every page says it is a preview.
- The admin opens at `/admin` on the same site; the `ADMIN_HOST` split and role guards arrive in Phases 2–3.
- Products have no photos yet: an SVG bottle placeholder in each product's colour is shown instead.

## Phases

### Phase 0 — Diagnose (no code changes) ✅
Versions, router type, aliases, Tailwind/ESLint setup, overlaps, conflicts, env vars.

### Phase 1 — Foundation
- Install dependencies; set up shadcn/ui.
- Prisma schema, initial migration, `lib/db.ts` (singleton Prisma client). `prisma.config.ts` uses `DIRECT_URL` for migrations.
- `lib/money.ts`: `formatNaira(kobo)` and helpers.
- `.env.example`.
- Seed: first admin from `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD`; a few categories and ~12 sample products
  (**no images** — UI shows a placeholder).
- No public way to create an admin: only the seed or an existing admin promoting a user.

### Phase 2 — Authentication
- Customer sign up / log in / log out; email uniqueness, password min 8, friendly errors.
- Session includes `id` and `role`. Helpers `requireUser()` / `requireAdmin()`.
- Header: user's name + logout, or Login / Sign up.
- Separate admin login page on the admin host; rejects non-admins.

### Phase 3 — Domain routing
- Implement the `proxy.ts` rules above. Document how to test both hosts locally.

### Phase 4 — Storefront (no login required)
- Home: hero, featured/new products, categories.
- `/products`: search by name, filter by category and price range, sort (newest, price ↑, price ↓), paginate via URL search params.
- `/products/[slug]`: image gallery (placeholder when no images), price, compare-at price, stock status, quantity selector, Add to cart.
- Only `isActive` products visible. Loading states, empty states, `not-found`, per-page metadata. Mobile-first.

### Phase 5 — Cart (guests and logged-in users)
- Guests: DB cart identified by httpOnly `cartId` cookie. Logged-in: cart tied to `userId`.
- On login: merge guest cart into user cart (sum quantities, cap at stock), clear cookie.
- Cart page: update quantity, remove, subtotal. Header cart count.
- Re-check stock and current price on the server on every cart change.

### Phase 6 — Checkout & orders
- Checkout requires login (redirect with return URL, keep merged cart).
- Pick/add shipping address, review items; flat shipping fee from env.
- Place order: one DB transaction re-validating stock/prices and creating a `PENDING` order with snapshots;
  initialize Paystack server-side and redirect.
- Webhook `/api/webhooks/paystack`: verify HMAC signature, idempotent; on success mark `PAID`, decrement stock in a
  transaction, clear cart.
- Callback page verifies with Paystack's API, shows success/failure.
- "My orders" list + detail. Never trust client amounts.

### Phase 7 — Admin dashboard (admin host only)
- Sidebar: Overview, Products, Categories, Orders, Customers, admin logout.
- Overview: today's / this month's revenue (PAID and later), order count, low-stock list, recent orders.
- Products: table with search + pagination; create/edit form (name, auto-slug editable, description, price,
  compare-at, stock, category, active); quick inline price/stock edit; soft-deactivate instead of delete when a
  product has orders.
- **Product images — Vercel Blob:**
  - Client uploads via `@vercel/blob/client` `upload()` with a `handleUpload` route handler, so files never pass
    through the serverless function body (avoids the body-size limit).
  - `onBeforeGenerateToken` calls `requireAdmin()`, restricts `allowedContentTypes` to `image/jpeg`, `image/png`,
    `image/webp`, and sets `maximumSizeInBytes` to 5 MB.
  - Keep storage/bandwidth low: resize to max 1600px wide and convert to WebP (browser-side before upload, or a
    server `sharp` step — whichever is simpler; report the choice).
  - Multi-image upload with reorder and delete. When an image is removed or replaced, delete the blob with `del()`.
  - `next.config.ts`: allow the Blob hostname in `images.remotePatterns`; flag any meaningful Vercel image-optimization cost.
- Categories: CRUD; block deletion while products use the category.
- Orders: list filtered by status, detail, valid status transitions only; cancelling a paid order restocks.
- Customers: list, view orders, promote/demote with confirmation dialog.

### Phase 8 — Hardening
- Error boundaries and toast notifications for every action.
- Rate-limit login and signup with Upstash (free tier).
- Accessibility pass: labels, focus states, alt text.
- Tests (Vitest): money helpers, cart merge logic, webhook signature verification, order total calculation.
- README: setup, env vars, seeding, local dev on both hosts, Paystack test flow, deployment checklist. Do not deploy.

## Definition of done
- A guest can browse, search, filter, view a product and add it to the cart.
- A guest can sign up, log in (cart merges), check out with Paystack test mode, and see the order in "My orders".
- A user can log out.
- An admin on the admin host can add/edit products and images, change prices and stock, manage categories, and move
  orders through their statuses.
- A customer can never reach any admin page or action, on either host.
- `npm run build`, `npm run lint` and the tests all pass.
