# TeamPulse v2

HR management PWA for Thai SMEs. React + Vite + Tailwind + Supabase + Stripe.

## Stack

| Layer | Tech |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS |
| Backend / Auth | Supabase (Postgres + Auth + RLS) |
| Payments | Stripe Checkout |
| Maps | Leaflet + OpenStreetMap |
| Hosting | Vercel |

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Create `.env` file

```bash
cp .env.example .env
```

Fill in your values:

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 3. Run the Supabase migration

1. Go to your Supabase project → SQL Editor
2. Paste the entire contents of `supabase/migrations/001_initial.sql`
3. Click **Run**

This creates all tables, indexes, RLS policies, and the trigger that auto-creates a company + owner record when a new user signs up.

### 4. Start dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## Deploy to Vercel

1. Push to GitHub
2. Import repo in Vercel
3. Add env vars in Vercel project settings
4. Deploy

---

## Stripe webhooks (for subscription upgrades)

Create a Supabase Edge Function at `supabase/functions/stripe-webhook/index.ts` that:
1. Verifies the Stripe webhook signature
2. On `checkout.session.completed` → updates `companies.plan`

Then register the webhook endpoint in Stripe dashboard.

---

## Project structure

```
src/
├── context/AuthContext.jsx   ← Supabase session + profile
├── lib/
│   ├── supabase.js           ← Supabase client
│   └── utils.js              ← Helpers (haversine, dates, CSV export)
├── components/ui/            ← Toast, BottomSheet, Modal, Skeleton
├── pages/
│   ├── Landing.jsx           ← Public landing page
│   ├── auth/                 ← SignUp, AdminLogin, EmployeeLogin, etc.
│   ├── admin/                ← Home, Team, LeaveRequests, Attendance, Settings
│   └── employee/             ← Home, CheckIn, MyLeave, Profile
supabase/migrations/
└── 001_initial.sql           ← Full DB schema + RLS
```
