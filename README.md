# The 28 Day Standard

A responsive site for a 28 day military-inspired calisthenics challenge. React + TypeScript + Tailwind on the frontend, a small Node/Express backend for real accounts and Stripe payment gating.

## Architecture

- **`/` (this folder)** — the React frontend. Handles the workout plan, tracker, nutrition, photos, and UI. Day-to-day progress (checklist state, streaks, photos) is stored in the browser's local storage, scoped per logged-in account.
- **`/server`** — a small Express backend that owns two things only: **accounts** (signup/login) and **payment status** (via Stripe). It does not store workout progress — that stays local to the browser by design, same as the original prototype.

Why split it this way: progress data is low-stakes and fine to keep client-side, but "did this person actually pay" cannot be verified client-side — that has to live somewhere a user can't edit, which is what the backend + Stripe webhook are for.

## Running it locally

**1. Start the backend**
```bash
cd server
npm install
cp .env.example .env
# edit .env — at minimum set JWT_SECRET to a random string
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

**Backend** — needs a host that runs a persistent Node process (Render, Railway, Fly.io — not a static host). Set the environment variables from above. Note the included `data/users.json` file storage works for a small prototype but isn't built for concurrent production traffic; swap in a real database (Postgres, etc.) if this needs to scale.

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

- **The server's "database" is a JSON file stored on local disk.** This is the most important limitation to fix before relying on this for real customers: on hosts like Render's free tier, this file is wiped on every redeploy (including just saving a new environment variable). If you get real signups, changing any server setting afterward can silently delete their accounts. Before running paid traffic at any real volume, swap this for a real hosted database (Neon and Supabase both have generous free Postgres tiers) — happy to walk through that migration.
- Workout progress/photos are per-browser (local storage) for the person using the app — only a lightweight summary (current day, total completed, streak, last active) is mirrored to the backend for the admin dashboard.
- Profile fields (name, email, fitness level, goal) aren't editable after signup yet — that would need a backend "update profile" endpoint.
- No automated password reset email yet — the "Forgot password" link currently points people to a support email instead.
- The admin dashboard shares the same page layout/nav as the public site — it works, but a dedicated admin layout (no public nav) would be cleaner.

