# Roomly — Candidate Brief

Welcome. Roomly is a meeting-room booking app used daily by employees across multiple offices. You are joining the team to deliver a new feature and help resolve production issues.

Read [README.md](./README.md) for setup (`npm install`, `npm run db:reset`, `npm run dev`). Sign in with any seeded email (e.g. `alex@acme.co`); password is ignored in this demo.

---

## What already exists

Before you start, explore the running app and codebase:

| Area | Notes |
|------|-------|
| **Authentication** | Login/logout via cookie session (`server/index.ts`, `src/lib/auth.tsx`) |
| **Roles** | `employee`, `office_manager`, `admin` — office managers have a `managedOffice` |
| **Rooms** | Name, capacity, office, equipment (projector, whiteboard, video conferencing) |
| **Bookings** | Create, edit, cancel; weekly calendar for one room at a time on `/bookings` |
| **Room discovery** | Search, filters (office, capacity, equipment), pagination, and per-room booking counts on `/rooms` |
| **Dashboard** | Upcoming bookings, recently cancelled, room utilisation |

Key files to orient yourself:

- `shared/types.ts` — shared domain types
- `server/bookings-logic.ts` — booking rules and permissions
- `server/storage.ts` — JSON persistence and file locking
- `src/lib/api.ts` / `src/lib/queries.ts` — client HTTP layer
- `src/routes/` — dashboard, rooms, bookings pages

Demo users:

| Email | Role | Notes |
|-------|------|-------|
| alex@acme.co | Employee | |
| jordan@acme.co | Office Manager | Manages **London** |
| sam@acme.co | Admin | |
| riley@acme.co | Employee | |

### Finding rooms vs viewing the calendar

Filtering is split on purpose:

- **`/rooms`** — find a room: search by name, filter by office, capacity, and equipment. Use **Book this room** to jump to the calendar with that room selected.
- **`/bookings`** — view and manage bookings for **one room** at a time (room dropdown + week view).

You do not need to duplicate room filters on the bookings page unless you choose to extend the product that way.

---

## Phase 1 — Feature: Room approval workflow

A new business requirement: **some rooms now require approval before a booking becomes active.**

### Data model

Extend rooms so each can have:

```
requiresApproval: true | false
```

Mark at least two rooms in seed data as requiring approval (e.g. large boardrooms). Update `server/seed.ts` and `npm run db:reset` so fresh seeds include them.

### Booking statuses

Extend booking statuses to:

| Status | Meaning |
|--------|---------|
| `pending` | Awaiting office manager approval; slot is **reserved** |
| `confirmed` | Active booking |
| `rejected` | Declined by office manager; slot is **not** reserved |
| `cancelled` | Cancelled by user or manager (existing behaviour) |

### Behaviour

**When booking a room with `requiresApproval: true`:**

1. Booking is created with status `pending` (not `confirmed`).
2. The time slot is reserved — other users must not be able to book over it.
3. The booking does not count as confirmed until approved.

**When booking a room with `requiresApproval: false`:**

- Behaviour stays as today — booking is `confirmed` immediately.

**Office managers can:**

- Approve a pending booking → status becomes `confirmed`.
- Reject a pending booking → status becomes `rejected`.
- Only act on bookings for rooms in offices they manage (`managedOffice`), unless they are an admin.

**Employees should:**

- See the current status of their bookings.
- Receive clear feedback when a booking is pending, approved, or rejected (UI messaging is enough — no email integration required).

### API

Add authenticated endpoints, for example:

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/bookings/:id/approve` | Approve a pending booking |
| `POST` | `/api/bookings/:id/reject` | Reject a pending booking |
| `GET` | `/api/bookings/pending` | List pending bookings (scoped by role) |

Exact paths and response shapes are up to you, but permissions must be enforced **on the server**, not only in the UI. Reuse patterns from `canModifyBooking` in `server/bookings-logic.ts`.

Update `GET /api/bookings` filtering as needed so clients can query by status.

### UI

Add or extend pages so the app supports:

1. **Approval queue** — office managers can see pending bookings for their office(s) and approve or reject them.
2. **Status indicators** — bookings show pending / confirmed / rejected / cancelled clearly (calendar, dashboard, lists).
3. **Approval actions** — approve and reject controls with appropriate permission gating.

Show `requiresApproval` on room cards or booking flows so users know when approval is needed.

### Tests

Vitest is already configured. Run `npm test` (or `npm run test:watch` while developing). See `server/bookings-logic.test.ts` for examples.

Add tests covering at least:

- Approval flow (pending → confirmed, pending → rejected)
- Permissions (office manager cannot approve outside their office; employee cannot approve)
- Rejection behaviour (rejected booking does not block the slot)

### Phase 1 — Definition of done

- [ ] `requiresApproval` on rooms; seed data includes approval-required rooms
- [ ] Four booking statuses with correct create/approve/reject/cancel behaviour
- [ ] Pending bookings reserve slots; rejected bookings do not
- [ ] Approve, reject, and list-pending API endpoints with server-side auth
- [ ] Approval queue, status badges, and approval actions in the UI
- [ ] Tests for approval flow, permissions, and rejections
- [ ] `npm test` passes after `npm run db:reset`

---

## Phase 2 — Production incidents (follow-up)

Complete and submit Phase 1 first. We will then send you a short set of **production incident reports** (symptoms only — like real tickets). Investigate each issue, fix it, and be ready to explain the root cause in a follow-up session.

---

## What we evaluate

| Phase | Signals |
|-------|---------|
| **Feature** | Can you work in an existing codebase? Structure code sensibly? Handle permissions and UI state? Use tooling (including AI) productively without shipping sloppy glue? |
| **Debugging** | Can you diagnose issues, understand business rules, and avoid superficial fixes? Can you explain root causes clearly? |

We care more about **correct reasoning and fit with existing patterns** than about matching one exact API shape or folder layout.

---

## Submission

Unless your interviewer specifies otherwise:

1. Push your work to a branch or fork and share the link.
2. Include brief notes: how to run the app and tests, what you built, and what you would do next with more time.
3. Be prepared to walk through your changes in a follow-up session. If you progress to Phase 2, we will share incident reports separately.

Good luck.
