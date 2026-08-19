# Repair Capability Tracker

Next.js (App Router) + Tailwind + MongoDB + NextAuth. Two roles:
**manager** (add/archive employees, see everyone's stats, approve requests)
and **employee** (mark devices complete, see only their own stats).

## 1. MongoDB

Use a MongoDB Atlas cluster (same pattern as news.lapisforge.com). Grab the
connection string — you'll need it for `MONGODB_URI`.

## 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `MONGODB_URI` — your Atlas connection string
- `NEXTAUTH_SECRET` — generate with `openssl rand -base64 32`
- `NEXTAUTH_URL` — `http://localhost:3000` for local dev
- `SEED_MANAGER_EMAIL` / `SEED_MANAGER_PASSWORD` — the login the seed script creates for you

## 3. Install and seed

```bash
npm install
npm run seed
```

The seed script populates the device catalog (116 devices) and creates one
manager account using `SEED_MANAGER_EMAIL` / `SEED_MANAGER_PASSWORD`. Log in
with that, then use **+ Add Employee** in the manager dashboard to create
real accounts for yourself, your other manager, and the pilot group — after
that you can archive the seed account if you want.

## 4. Run locally

```bash
npm run dev
```

Opens at `http://localhost:3000`, redirects to `/login` until you sign in.

## Structure

```
src/
  app/
    layout.jsx                 root layout, wraps app in SessionProvider
    page.jsx                   main dashboard — fetches from the API, renders
                                 AdminDashboard or TechnicianDashboard by role
    login/page.jsx              credentials login form
    globals.css                 Tailwind directives + dark theme base
    api/
      auth/[...nextauth]/       NextAuth route handler
      devices/                  GET the device catalog
      employees/                GET roster + POST add employee (manager only)
      employees/[id]/archive/   PATCH archive/unarchive (manager only)
      capabilities/             GET (scoped by role) + POST request verification
      capabilities/[id]/approve/ PATCH approve (manager only)
  components/                  DeviceCard, StatusBadge, TechnicianDashboard, AdminDashboard
  models/                      User, Device, Capability (Mongoose schemas)
  lib/
    mongodb.js                  cached DB connection
    auth.js                     NextAuth config (credentials provider, JWT session)
  data/deviceCatalog.js         device catalog source, used only by the seed script
  middleware.js                 redirects unauthenticated requests to /login
scripts/seed.mjs                seeds devices + first manager account
```

## Roles, enforced server-side (not just hidden in the UI)

- `GET /api/capabilities` — employees only ever get their own records, even
  if they pass a different `employeeId` in the query string
- `POST /api/employees`, `PATCH /api/employees/:id/archive`,
  `PATCH /api/capabilities/:id/approve` — all reject non-managers with a 403
- `middleware.js` redirects anyone without a session to `/login` for every
  route except the login page and NextAuth's own endpoints

## Deploying on Hostinger

1. Push this repo to GitHub.
2. Point Hostinger's Next.js hosting at the repo, same as your other Next.js apps.
3. In Hostinger's environment variable settings, add `MONGODB_URI`,
   `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` (set this to your real deployed URL,
   e.g. `https://repairs.lapisforge.com`).
4. Hostinger runs `npm run build` / `npm run start` automatically.
5. Run `npm run seed` once against production `MONGODB_URI` (locally, pointed
   at the prod database) to create the device catalog and your first login —
   or run it against the same Atlas cluster you tested with locally, since
   it's the same database either way.
