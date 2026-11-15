# ROSA Beauty — Frontend

Luxury-minimal beauty storefront. React + TypeScript + Vite + Tailwind +
Supabase. Fully multilingual (fa / en / ar, RTL/LTR), with a real cart,
wishlist, checkout and account flow.

---

## Running locally

```bash
npm install
cp .env.example .env.local   # fill in your Supabase values
npm run dev
```

If `.env.local` is missing, the storefront runs on a local demo catalog
(`src/data.ts`) with `localStorage` persistence — every button still works,
but nothing is written to a database.

---

## Connecting to Supabase (goes dynamic)

1. **Create a project** on <https://supabase.com> (or reuse your existing
   ROSA project).
2. **Run the schema** in the Supabase SQL editor — the whole file is in
   [`SUPABASE_SCHEMA.sql`](./SUPABASE_SCHEMA.sql). It creates:
   - `products`, `profiles`, `orders`, `order_items`, `wishlists`,
     `newsletter_subscribers`
   - A `handle_new_user` trigger that auto-creates a `profiles` row on
     sign-up.
   - Row-Level-Security policies (anon can read active products, users can
     read/write only their own data).
3. **Environment variables** — add them to `.env.local` and to your host
   (Vercel → Project Settings → Environment Variables):

   ```
   VITE_SUPABASE_URL=https://<project-ref>.supabase.co
   VITE_SUPABASE_ANON_KEY=<anon-key>
   ```

   Never put the `service_role` key in the frontend. The anon key is
   browser-safe because RLS enforces access.

4. **Products in the admin dashboard** — your existing dashboard writes to
   `public.products`. The storefront reads from the same table and
   subscribes to Realtime, so every price / stock / activation change is
   reflected immediately.

---

## Architecture (files that matter)

| File                       | Purpose                                                  |
| -------------------------- | -------------------------------------------------------- |
| `src/lib/supabase.ts`      | Single Supabase client. Null when env vars are missing.  |
| `src/lib/db.ts`            | All database reads/writes: products, auth, orders, wish. |
| `src/store.ts`             | React context. Products + cart + wishlist + auth + orders. Swaps between Supabase and local fallback. |
| `src/i18n.ts`              | fa / en / ar dictionaries + `<html lang/dir>` effect.   |
| `src/pages/`               | `Home`, `Shop`, `ProductDetail`, `Cart`, `Checkout`, `Account`, `Wishlist`, `Magazine`, `Contact`. |
| `src/components/`          | Header, Footer, LangSwitcher, ProductCard, Hero, etc.    |
| `SUPABASE_SCHEMA.sql`      | DDL + RLS, ready to paste into Supabase.                 |

Realtime subscription is wired in `StoreProvider` → `subscribeProducts`.

---

## Currently functional

- Logo, nav links, mobile drawer, language switcher (persisted).
- Search → `/shop?q=…`, filters (category + max-price), sort, load-more.
- Product cards: real-image gallery, add-to-cart, wishlist toggle, empty
  state, stock badge.
- Product detail: image gallery, qty stepper bounded by stock, add-to-cart,
  buy-now, breadcrumbs, related products.
- Cart: increment/decrement bounded by stock, remove, subtotal + shipping
  (free ≥ 500 000), localStorage persistence.
- Checkout: form validation, order summary, auth-required guard when
  Supabase is live, loading state, success screen with order code.
- Account: sign-up, sign-in, sign-out via Supabase Auth; order history
  pulled from `orders` + `order_items`.
- Wishlist: synced per-user through `wishlists` table when logged in.
- Newsletter: inserts into `newsletter_subscribers`.

## What is NOT implemented (and why)

- **Payment gateway** — intentionally left as "cash on delivery". Hook up
  your Iranian PSP (Zarinpal / IDPay / NextPay) by replacing the `onSubmit`
  branch in `src/pages/Checkout.tsx` with a request to your PSP callback,
  then insert the order on success.
- **Email transactional notifications** — add a Supabase Edge Function
  triggered by `orders` insert, then send via Resend / Postmark.
- **Password reset / OTP** — Supabase Auth supports both; expose them as
  pages when ready.

No fake data is written to Supabase, and no button is left with an empty
click handler.
