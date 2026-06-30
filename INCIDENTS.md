# Roomly — Phase 2 incident reports


We've had several production reports come in since the approval workflow shipped. For each incident below:

1. Reproduce the issue locally
2. Find the root cause in the codebase
3. Apply a minimal fix
4. Be ready to explain what went wrong and why your fix is correct

Add regression tests where practical. Run `npm test` before your follow-up.

---

### Incident 1 — Bookings vanish from the calendar

**Symptom:** Users occasionally see bookings disappear from the calendar after requesting approval.

---

### Incident 2 — Double booking

**Symptom:** Two users can book the same room at the same time.

---

### Incident 3 — Rejected slot still blocked

**Symptom:** After rejecting a booking, availability still shows the slot as occupied.

---

### Incident 4 — Pagination after filters

**Symptom:** Pagination behaves strangely after applying filters on the room list (empty pages, wrong results).

---

### Incident 5 — Slow room list

**Symptom:** The room list page becomes extremely slow with many bookings.

---

## Definition of done

- [ ] Each incident reproduced and root cause identified
- [ ] Fix applied with minimal, targeted changes
- [ ] You can explain the bug and why your fix is correct
- [ ] Regression covered by tests where practical
