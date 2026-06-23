# Roomly

Meeting room booking app used as a developer tech-test base project.

**Candidates:** see [CANDIDATE.md](./CANDIDATE.md) for the task brief.

## Stack

- **Frontend:** React, Vite, TanStack Router, TanStack Query, Tailwind CSS
- **API:** Node + Hono (`server/`)
- **Storage:** JSON files in `data/` (users, rooms, bookings)

## Getting started

Requires Node 20+. Install dependencies from the `Roomly` project folder, then:

```bash
npm install
npm run db:reset   # optional — re-seed JSON data relative to today
npm run dev        # API on :3001, web on :5173
```

Open http://localhost:5173 and sign in with a seeded email (e.g. `alex@acme.co`). Password is ignored in this demo.

### Demo users

| Email | Role | Notes |
|---|---|---|
| alex@acme.co | Employee | |
| jordan@acme.co | Office Manager | Manages London |
| sam@acme.co | Admin | |
| riley@acme.co | Employee | |

## Project layout

```
data/           JSON persistence (committed seed data)
server/         API routes, business rules, file storage
shared/         Types shared between client and server
src/            React frontend
  lib/api.ts    HTTP client
  lib/auth.tsx  Session state (cookie-based)
  routes/       Pages: dashboard, rooms, bookings
```

## API

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | | Health check |
| GET | `/api/users` | | List users (demo login hints) |
| POST | `/api/auth/login` | | Sign in by email, sets cookie |
| POST | `/api/auth/logout` | | Sign out |
| GET | `/api/auth/me` | | Current user |
| GET | `/api/rooms` | | List/filter rooms |
| GET | `/api/bookings` | | List/filter bookings |
| POST | `/api/bookings` | ✓ | Create booking |
| PATCH | `/api/bookings/:id` | ✓ | Update booking |
| POST | `/api/bookings/:id/cancel` | ✓ | Cancel booking |

Auth uses an `httpOnly` `userId` cookie. Role and permissions are enforced on the server in `server/bookings-logic.ts`.

## Reset data

```bash
npm run db:reset
```

This overwrites `data/*.json` with fresh seed data (bookings relative to the current week).

## Troubleshooting

**Port 3001 already in use** — a previous API process is still running:

```bash
lsof -ti :3001 | xargs kill
```

**Vite / native binding errors** — reinstall dependencies:

```bash
rm -rf node_modules package-lock.json
npm install
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Run API + frontend together |
| `npm run dev:api` | API only |
| `npm run dev:web` | Frontend only |
| `npm run build` | Production frontend build |
| `npm run db:reset` | Re-seed JSON files |
| `npm test` | Run tests (Vitest) |
| `npm run test:watch` | Run tests in watch mode |
