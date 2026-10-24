# Blind critic: Crux class booking, entries X and Y

| Rubric area | X | Y | Gate fails |
|---|---|---|---|
| 1. Data fundamentals gate | 8 | 7 | none hard in either. Y: owners cannot create locations through the granted path (permission denied); schedule and attendance not paginated in SQL |
| 2. Correctness under concurrency | 8 | 7 | none: both passed every race I ran |
| 3. Data and screen agree | 9 | **5 (capped)** | Y: the screen shows values the model cannot store or return |
| 4. Screen fundamentals | 9 | **5 (capped)** | Y: lint FAILs in all 8 states |
| 5. Expert moves | 8 | 7 | n/a |
| **Total (of 50)** | **42** | **31** | |

**Verdict: X wins clearly, by about 11 points out of 50.** Both schemas load, isolate tenants and survive every race. Y loses on the screen layer: the lint fails in every state, and the screen shows data the schema cannot supply. Y also has three real data bugs that X does not have. X's remaining gaps are smaller and fewer.

Test scripts and outputs: `scratchpad/blind-data-tests/` (`lib.sh`, `02` to `06b` `.sh` and `.out`, `seed_*.sql`, `supabase_stub.sql`). Lint reports: `blind-data-tests/lint/{X,Y}.txt`. Screenshots: `blind-data-tests/shots/{X,Y}/`.

## Setup

- PostgreSQL 16.15, a scratch cluster on port 54329.
- Supabase stand-in (`supabase_stub.sql`): the roles `anon`, `authenticated` and `service_role` (with bypassrls), `auth.users`, `auth.uid()` read from `request.jwt.claim.sub`, and an `extensions` schema.
- **Both schemas load with no errors.**
- Seed data:
  - Gym 1 (America/Denver): owner u01, staff u02, members u10 to u19.
  - Gym 2 (Europe/London): staff u03, owner u04, members u19 and u20.
  - u19 belongs to both gyms.
  - Every member has an active monthly pass.
- Each test ran on a fresh copy of a template database.
- The cluster was stopped at the end.

## 1. Data fundamentals

Catalog output is in `01_catalog.out` and `01b.out`.

| Check | X | Y |
|---|---|---|
| Keys, composite FKs that carry the tenant | yes: `(id, gym_id)` throughout | yes: `(tenant_id, id)` throughout |
| FK indexes | Strict check (the index must cover every FK column): 3 composite FKs lack one, but each has an index led by the unique id column, so in practice all are indexed. Planner confirmed. | Strict check: 1 composite FK lacks one, with the same caveat. Lenient check: 0 missing. |
| Money | `price_minor bigint`, `currency` text checked to 3 lowercase letters | `price_amount bigint > 0`, `char(3)` uppercase |
| Time | timestamptz instants, plus `starts_local` (timestamp) and the location's IANA zone as the truth. The instants are derived by trigger and there is a function to recompute them after a tz data release. | timestamptz plus the location's IANA zone |
| No float, money or json types | pass | pass |
| RLS on every table, no anon grants, security definer functions pin search_path | pass | pass |
| One live booking per member per class | partial unique index | partial unique index |
| One open monthly pass per member per gym | **missing**: only `stripe_subscription_id` is unique (schema.sql:183) | `subscriptions_one_open_idx` |
| Safe-to-retry booking | Idempotency key claimed in the same transaction, in SQL. Tested: parallel same key gives one row and `replay=true`; same key with a different class gives `idempotency_key_reused`. | API-layer key store (described only, not in SQL), plus the unique index |
| Secrets | only the anon and publishable keys on the client | same |

**Bug in Y: owners cannot add a location through the granted path.**
- The `locations` CHECK calls `private.is_valid_timezone`, but schema.sql:666 revokes execute on it from `authenticated`.
- Result as owner u01: `ERROR: permission denied for function is_valid_timezone`.
- X saw the same trap and grants the function (schema.sql:822).

**Pagination.**
- X uses real keyset cursors on the schedule (schema.sql:703-762) and on attendance.
- Y's `week_schedule` and `attendance_report` return unpaged sets. api.md:19 admits `next_cursor` is "null in practice". That is a soft fail of "paginated lists".

## 2. Concurrency

All results are copied from the `.out` files.

| Test | X | Y |
|---|---|---|
| Last place (capacity 1). A books and holds its transaction 2s; B arrives 0.3s later. | A confirmed, B `crux:class_full` (taken=1) | A booked, B auto-waitlisted (booked=1) |
| Burst: 10 members on 3 places | 3 confirmed, 7 waitlisted, ranks 1..7 | 3 booked, 7 waitlisted, counters 3/7 agree |
| Two cancels at once (capacity 2, queue u12, u13, u14) | u12 and u13 confirmed, u14 waiting | same, counters 2/1 |
| Double-tap cancel against a waitlist | one promotion only | one promotion only |
| A cancel races a new booking | the new booker gets `class_full`; u12 (head of queue) promoted | the new booker is waitlisted behind u12 |
| A cancel races a staff capacity increase | both waiters promoted | both waiters promoted |
| Same member books twice in parallel | 1 row, `already_booked` | 1 row, `already_booked` |
| Last pack credit, two classes in parallel | 1 booking, `no_credits_left` | 1 booking, `no_entitlement`, credits 10/10 |
| Service role writes a 6th confirmed booking directly into 5 places | **blocked** by the constraint trigger (`bookings_class_capacity ... 6 of 5`) | **accepted**: 6 rows booked, `booked_count` still 5. The counters drift and nothing guards the rows. |
| Staff lowers capacity to 2 with 5 taken | **accepted** (capacity=2, taken=5). This breaks the promise in api.md:85 (`409 capacity_below_taken`); the guard trigger only fires on bookings (schema.sql:359). | rejected by `CHECK (booked_count between 0 and capacity)` |

**Y business-rule bug: the 12-hour cancel rule is broken.**
- `grant_place` (schema.sql:365) gives every booking `free_cancel_until = greatest(start - 12h, now() + 1h)`. That includes fresh bookings made inside the 12-hour window.
- Tested: a booking made 6 hours before the start got a free-cancel deadline 1 hour away.
- The brief says cancellations later than 12 hours before the start count as a no-show. The comment says the extra hour is meant only for waitlist promotions.
- X marks such a booking late at once (`can.cancel.late=true`).

**Y data bug: duplicate schedule rows.**
- `week_schedule` joins the member's bookings including `late_cancelled` (schema.sql:607-608).
- Sequence: late-cancel, then rebook (allowed). The result is two rows for one class (`statuses=late_cancelled,booked`).
- X's `class_view` picks the live booking first, so it returns one row.

## Tenant isolation

From `06_rls.out` and `06b_rls_counts.out`.

**Both pass.**
- A member of gym 2 only, and staff and the owner of gym 2, see 0 classes, bookings, memberships, passes and locations of gym 1.
- Gym 2 staff see only u19's gym 2 membership and booking.
- Every cross-gym call returns not found: check-in, cancel, schedule, attendance and booking.
- Members cannot update bookings, cannot promote their own role, and cannot read `idempotency_keys`.
- Anon is denied.

Small differences:
- Y returns 0 rows, not a 404, for another gym's schedule, so the handler cannot tell "empty week" from "not your gym".
- Y keeps member PII per tenant with no global profile. X has a global `profiles.display_name` that every gym the person joins can see.
- Both have a cross-tenant leak in the instructor overlap exclusion (X schema.sql:140, Y schema.sql:138). It is keyed on the person, not the gym, so gym B's staff learn that an instructor is busy at gym A.

## API (api.md)

**X**
- RFC 9457 errors with a stable `code`.
- Clear status mapping: 401, 403 `no_access`, 404 for any other gym's row, 409 for conflicts, 412 and 428 for `If-Match`, 422 for key reuse.
- Constraint name mapped to code.
- Keyset cursors.
- Cancel is idempotent by state, plus `acknowledge_late`.
- Weakness: the documented 409 `capacity_below_taken` does not exist in the schema.

**Y**
- RFC 9457 errors, a 404 for tenant misses, an `Idempotency-Key` on every POST, `409 request_in_progress`, and 402 for no entitlement.
- Weakness: it maps plpgsql's own SQLSTATEs as app codes (`P0002` = no_data_found, `P0003` = too_many_rows, `23505`) at api.md:41. A genuine `INTO STRICT` miss or an unrelated unique violation would surface as a 404 or a 409.
- The schedule example returns `places_left`, but the screen reads `booked_count`.

## 3. Data and screen agree

**X**
- Every value comes from `class_view` or `location_schedule`:
  - the dot rail from `taken_count`
  - "Full, 2 waiting"
  - "2nd in line" from `waitlist_rank`
  - "Places as of 2:46 pm" from `summary.as_of`
  - "Next: Lead Climbing Course" from the summary
  - the empty state's "week of Oct 26" from `next_week_with_classes`
  - the pass card from `renews_at` and `grace_ends_at`
- Times use the wall clock in the location's zone ("Times are Eastside local time (MT)").
- It covers every brief state, plus error, lapsed and a late-cancel confirm dialog.
- Minor: the past-due banner says "keep booking until Oct 18", but the model also lets the member book classes that start after that date.

**Y (gate fail)**
- The screen shows a level of "Ages 8 to 14" (schedule.html:303). The CHECK on `class_types.level` only allows beginner, intermediate, advanced or youth (schema.sql:101).
- It shows "By the gym: instructor unwell" from `cancel_reason`, which `week_schedule` does not return (schema.sql:585-592).
- It shows "Times in Leeds time" (schedule.html:493). No city is stored; only `Europe/London` and a free-text address.
- The duplicate-row bug above would render a class twice.
- All brief states are designed (loading, empty, available, waitlist, booked, late, past_due). The past-due state disables classes that start after `grace_until`, which correctly mirrors `pick_entitlement`.

## 4. Screen fundamentals

**X**
- `lint.mjs` PASS with 0 fail and 0 warn in all 12 variants: default, loading, error, empty, past-due, lapsed, places-left, full, waitlist, booked, late-cancel, late-cancel-confirm.
- Renders at 390 and 1440, light and dark, are clean. There is a clear hierarchy (time / title / meta / status chip) and calm density.
- Nits:
  - "Basalt Climbing, Eastside" repeats in both the picker and the subtitle.
  - At 1440 the list is one narrow column with dead space on the right. It is not a week grid.
  - The late-cancel dialog is anchored over the card rather than a true modal sheet.

**Y (gate fail)**
- The lint fails in all 8 variants: 80, 31, 37, 75, 83, 83, 82 and 87 fails.
- Fails that hold under any design system, not only this KB's own scale and radius rules:
  - axe `label-content-name-mismatch` on every day tab
  - a 44px touch-target warning on the location button
  - a sticky 79px day bar with no `scroll-padding-top` (WCAG 2.4.11)
  - "Join waitlist" and "Leave waitlist" text running into the button padding at 1024
  - 6 filled primary buttons in one view at 1440
  - the 7 columns missing a shared left edge by 12px
- Visually the 1440 layout is a good 7-column week, and the 390 day-tab layout is strong. The fundamentals still fail.

## 5. Expert moves

**X: what a senior Stripe, Supabase or Linear reviewer would learn**
- Wall-clock truth with derived instants, and recompute after a tz data release.
- The server sends `can.*` capability flags with machine reasons, so the client never re-derives a rule.
- `acknowledge_late`: no silent charge for a member who saw "free" at 11:59:58.
- An idempotency claim in the same transaction, which serialises same-key retries.
- A capacity guard that holds for every writer.
- `free_cancel_until` stored per booking as the promise made.
- UUIDv7, `ETag` versions and an audit trail.

**X: what they would object to**
- Lowering capacity below taken is allowed (tested).
- No unique open pass per member per gym.
- Grace is not limited to classes that start before it ends.
- A waitlist entry holds a pack credit.
- The global profile.

**Y: what they would learn**
- Grace limited to classes that start before `grace_until`.
- A 1-hour accept window for late promotions.
- Per-tenant PII.
- The webhook re-retrieves the object from Stripe instead of trusting the event.
- An open-pass unique index.
- The CHECK on the counters.

**Y: what they would object to**
- Denormalised counters with no backstop on the rows (drift shown above).
- Joining the waitlist automatically, without consent.
- Reuse of built-in SQLSTATEs as app codes.
- The location permission bug.
- The 12-hour rule bug.
- The duplicate rows.

## The 3 biggest gaps in X (the winner)

1. **Staff can overbook by lowering capacity below places taken.**
   - Tested: capacity 2 with 5 taken was accepted.
   - `places_left` then clamps to 0 and hides the fact.
   - Fix: a guard on `classes` UPDATE, or a CHECK through the class lock, so api.md's `409 capacity_below_taken` is real.
2. **Past-due grace only checks "now".**
   - A member 6 days into the grace period can book a class that starts 3 weeks later, after access has lapsed (schema.sql:406).
   - The banner's "keep booking until" is therefore half true.
   - Fix: pass the class start into `member_access`, as Y does.
3. **Missing database uniqueness and a cross-tenant leak.**
   - Missing: a unique open monthly pass per member per gym.
   - Leak: the instructor overlap exclusion leaks across gyms (key it on `gym_id` too, or accept it and document it).
   - Weaker point: the single global `profiles.display_name` is shared across gyms. Opinion: a per-membership display name, as Y does, is the better privacy default.
