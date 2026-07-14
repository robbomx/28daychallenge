# The 28 Day Standard

A responsive site for a 28 day military-inspired calisthenics challenge. React + TypeScript + Tailwind on the frontend, a small Node/Express backend for real accounts and Stripe payment gating.

## Architecture

- **`/` (this folder)** — the React frontend. Handles the workout plan, tracker, nutrition, photos, and UI. Day-to-day progress (checklist state, streaks, photos) is stored in the browser's local storage, scoped per logged-in account.
- **`/server`** — a small Express backend that owns two things only: **accounts** (signup/login) and **payment status** (via Stripe). It does not store workout progress — that stays local to the browser by design, same as the original prototype.

Why split it this way: progress data is low-stakes and fine to keep client-side, but "did this person actually pay" cannot be verified client-side — that has to live somewhere a user can't edit, which is what the backend + Stripe webhook are for.

## Database (required — set this up before anything else)

Accounts and payment status are stored in a real Postgres database, not a file — this matters because file-based storage on hosts like Render gets wiped on every redeploy or environment variable change, silently deleting real customers' accounts. Postgres, as a separate hosted service, is completely unaffected by anything happening to the app's own server.

1. Create a free Postgres database at **[neon.tech](https://neon.tech)** or **[supabase.com](https://supabase.com)** (both have generous free tiers, no credit card required)
2. Copy the connection string they give you — looks like:
   ```
   postgresql://user:password@host/dbname?sslmode=require
   ```
3. Set this as `DATABASE_URL` in `server/.env` (locally) and in your host's environment variables (in production, e.g. Render)

The backend creates its own database table automatically the first time it starts up — no manual SQL needed.

## Running it locally

**1. Start the backend**
```bash
cd server
npm install
cp .env.example .env
# edit .env — set DATABASE_URL (see above) and JWT_SECRET at minimum
npm start
```
This runs on `http://localhost:4000` by default.

**2. Start the frontend** (in a separate terminal, from the project root)
```bash
npm install
npm run dev
```
This runs on `http://localhost:5173` and talks to the backend at `http://localhost:4000` by default (override with a `.env` file setting `VITE_API_URL`).

At this point signup/login work for real, but nobody can pay yet until Stripe is connected (next section) — the Pricing page will show "Preparing checkout…" until `PAYMENT_LINK_BASE_URL` is set on the server.

## Connecting Meta Pixel (ad conversion tracking)

1. Go to Meta Events Manager → your Pixel → Settings, and copy your Pixel ID
2. Set `VITE_META_PIXEL_ID` to that value in your frontend host's environment variables (Netlify), then rebuild
3. Leave it unset and the site works exactly the same, just without the pixel loading at all — no errors either way

**Events currently tracked** (fire automatically, no further setup needed once the Pixel ID above is set):

| Event | Fires when |
|---|---|
| `PageView` | Every page load (standard pixel behavior) |
| `Lead` | Any "Start My 28 Day Challenge" / "Join The 28 Day Standard" button is clicked, before signup |
| `CompleteRegistration` | Account creation succeeds |
| `InitiateCheckout` | The personalized Stripe checkout link is ready on the Pricing page |
| `Purchase` | First dashboard load after `paid` becomes true (tracked once per account via a local flag, so revisiting the dashboard doesn't re-fire it) |

Note: `Purchase` fires based on our own `paid` flag, not a Stripe-side webhook-to-pixel bridge — it's accurate to what our system knows, but if you want server-side (Conversions API) tracking for better ad platform accuracy, that's a separate, larger integration.

## Connecting Stripe (real payments)

1. **Create the product & price** — Stripe Dashboard → Product catalog → + Add product → name it "The 28 Day Standard", price **$39.00**, set to **One time** (not recurring).
2. **Create a Payment Link** — Stripe Dashboard → Payment links → + New → select the product → Create link. Copy the URL (`https://buy.stripe.com/...`).
3. **Create a webhook endpoint** — Stripe Dashboard → Developers → Webhooks → + Add endpoint.
   - Endpoint URL: `https://your-deployed-backend.com/api/stripe/webhook`
   - Event to send: `checkout.session.completed`
   - Copy the **signing secret** (`whsec_...`) it gives you.
4. **Set the backend's environment variables** (in `server/.env`, or your host's env var settings):
   ```
   STRIPE_SECRET_KEY=sk_live_... (or sk_test_... while testing)
   STRIPE_WEBHOOK_SECRET=whsec_...
   PAYMENT_LINK_BASE_URL=https://buy.stripe.com/...
   FRONTEND_URL=https://your-deployed-frontend.com
   JWT_SECRET=some-long-random-string
   ```
5. In the Stripe Payment Link's own settings, you can optionally set an "after payment" redirect to `https://your-deployed-frontend.com/dashboard`.

How the payment flow works end to end:
1. Person creates an account (`/signup`) → gets a `paid: false` record.
2. They land on `/pricing`, which asks the backend for **their own personalized checkout link** (`/api/checkout-link`) — this is the Payment Link above with `?client_reference_id=<their user id>` attached.
3. They pay on Stripe's hosted checkout page. Card details never touch this app.
4. Stripe calls the backend's webhook with `client_reference_id`, and the backend marks that exact user as paid.
5. `ProtectedRoute` on the frontend checks `user.paid` before allowing access to the dashboard, tracker, workouts, etc. — unpaid users get redirected to `/pricing`.

## Deploying

**Backend** — needs a host that runs a persistent Node process (Render, Railway, Fly.io — not a static host). Set the environment variables from above, including `DATABASE_URL` pointing at a real Postgres database (see "Database" below) — the backend will refuse to do anything useful without it.

**Frontend** — any static host (Netlify, Vercel, GitHub Pages). Build with:
```bash
npm run build
```
Set `VITE_API_URL` to your deployed backend's URL before building (as a `.env` file or your host's environment variable settings), so the production build points at the right server. A `public/_redirects` file is already included so client-side routing works on Netlify.

## What's included

- **Landing page** (`/`) — hero, challenge overview, 4-phase preview, testimonials, real photography, CTA
- **Pricing** (`/pricing`) — $39 one-time Stripe checkout, personalized per account
- **Signup / Login** (`/signup`, `/login`) — single-step account creation via the backend
- **Dashboard** (`/dashboard`) — streak, total completed, today's workout, automatic completion status
- **Daily workout** (`/workout/:dayNumber`) — full exercise detail, scaled by fitness level, form-video links
- **28 day tracker** (`/tracker`) — grouped by week/phase, missed/recovered/restart handling
- **Nutrition** (`/nutrition`) — daily non-negotiables, nutrition rules, allowed food list with portion guides
- **Photos** (`/photos`) — Day 1/14/28 uploads with side-by-side comparison
- **Settings** (`/settings`) — notification preferences, reset-challenge flow
- **Admin dashboard** (`/admin`, login at `/admin/login`) — every signup, paid status, current day, completion count, streak, and days-since-last-active, plus a "stalled" flag for paid users who've gone quiet mid-program, with search and sortable columns. Protected by a separate admin password (`ADMIN_PASSWORD` in the server's environment variables) — set this to something long and random before deploying, since it's the only thing guarding this data.

The signup form asks only for what's needed to run an account: name, email, password, fitness level, and goal. Age is not collected as data — signup just requires a client-side checkbox confirming the person is 16 or older, matching the fitness/payment nature of the product without storing anything.

## Known limitations (prototype-level)

- Day-by-day workout progress, streaks, and start date now sync fully to the backend and follow a person across any device they log into — not just a summary for the admin dashboard. Local storage is still used as a fast, offline-friendly cache, but the server is the source of truth once at least one sync has happened. Before/after photos remain local-only (per-device), since syncing base64 images at scale would be a meaningfully bigger, separate change.
- Profile fields (name, email, fitness level, goal) aren't editable after signup yet — that would need a backend "update profile" endpoint.
- No automated password reset email yet — the "Forgot password" link currently points people to a support email instead.
- The admin dashboard shares the same page layout/nav as the public site — it works, but a dedicated admin layout (no public nav) would be cleaner.

