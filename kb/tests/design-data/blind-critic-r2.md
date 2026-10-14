# Blind critic: Crux class booking, entries G and H (round 2)

| Rubric area | G | H |
|---|---|---|
| 1. Data fundamentals gate | **5** (capped: 2 gate fails) | **9** |
| 2. Correctness under concurrency | 8 | 9 |
| 3. Data and screen agree | 6 | 9 |
| 4. Screen fundamentals | **5** (capped: lint FAIL incl. axe) | 8 |
| 5. Expert moves | 7 | 9 |
| **Mean** | **6.2** | **8.8** |

**Verdict: H is clearly better, by about 2.5 points on average.** It is ahead in every area. The biggest gaps are the gate and the screen. G fails two data gate items and fails the lint in every state. H passes every test I wrote and passes the lint in all 11 states.

Method: I loaded both schemas into a scratch PostgreSQL 16.15 with a minimal Supabase stand-in (`auth.users`, `auth.uid()` from `request.jwt.claim.sub`, and the `anon`, `authenticated` and `service_role` roles). Both entries got the same people and classes, seeded relative to `now()`. Every member and staff call ran as `authenticated` with a JWT subject, so RLS applied. My own tests, seeds and raw results are in `scratchpad/blind-data-r2-tests/`: `g_tests.sh`, `h_tests.sh`, `g_results.txt`, `h_results.txt`, `catalog.sql`, the lint JSON and text in `lint/`, and the screenshots in `shots/`. The cluster has been stopped and deleted. `reset.sh` recreates it, but only once a cluster is running on `/tmp/pgr2crit:55491`.

## 1. Schema tests (exact results)

Both schemas load cleanly with no errors.

| Test | G | H |
|---|---|---|
| Last place race: capacity 2 with 1 booked; two parallel bookers, the first holds its transaction 2 s | u12 `booked`, u13 `waitlisted` (G auto-waitlists). Counters 2/1, matching the real rows | u12 `booked`, u13 `class_full` 409 (`remaining: 0`). Retrying with `intent=waitlist` gives `waitlisted`. Taken 2 |
| Burst: 20 parallel bookers, capacity 5 | 5 booked, 15 waitlisted. Counters agree | 5 booked, 15 waitlisted |
| Two simultaneous cancels against a waitlist (capacity 2: 2 booked, 3 waiting) | Both cancelled; waiters 1 and 2 promoted, waiter 3 still waiting; counters 2/1 | Same result |
| A booked cancel racing a waitlisted member who leaves (capacity 1) | Correct: the next waiter is promoted | Correct (no skipped promotion from `FOR UPDATE ... LIMIT 1`) |
| Double booking, sequential | `already_booked` (raised as 23505) | `bookings_one_live_per_member` 23505, mapped to 409 `already-booked` |
| Double booking, parallel, same member | 1 live row | 1 live row |
| Direct insert as table owner (bypassing functions) | Blocked by the partial unique index | Blocked by the partial unique index; a trigger guard also runs for the service role |
| Member inserts into `bookings` directly | permission denied | permission denied |
| Idempotent retry with the same client id | n/a (handled at the API layer only) | Sequential retry returns the same booking. Another user reusing the id gets an error. **Parallel** retries with the same id: the second gets a `bookings_pkey` 23505, which the api.md mapping table does not list |
| Member of gym B only, reading gym A | 0 sessions, 0 bookings, own `tenant_users` row only; `week_schedule(A)` returns 0 rows; booking an A class gives `session_not_found` | 0 classes, 0 bookings, own rows only; `schedule(A)` gives `location_not_found`; booking gives `class_not_found` |
| Staff of gym B vs gym A | Sees only B `tenant_users` (the A row of a person in both gyms is invisible). Cancel, check-in, `cancel_session` and attendance on A all return not found or 0. A capacity UPDATE touches 0 rows. A class pointing at A's location is rejected by the composite FK | Same results on every probe. Staff B cannot add people (RLS). **Owner** B can insert any known user id into gym B, after which the global `profiles.display_name` becomes visible (minor) |
| `anon` reads | permission denied | permission denied |
| Staff lower capacity below the booked count | Blocked by an **unnamed** CHECK `class_sessions_check1`. api.md promises `409 capacity_below_booked`, but its own mapping sends 23514 to a generic `conflict` | Blocked by named `classes_capacity_not_below_taken` with detail `{"taken":3}`; mapped in api.md |
| Raise capacity with a waitlist | Promotes in the same transaction | Promotes in the same transaction |
| Staff edit counters or derived columns | `booked_count`: permission denied (column grants) | `starts_at`: permission denied |
| Grace: past_due, grace ends in 2 days. Class in 1 day / class in 5 days | booked / `no_entitlement` (402) | booked / `grace_ends_before_class` with `reason_at` = grace end. The schedule flag `can_book=false` gives the same reason |
| No pass | `no_entitlement` | `no_pass` |
| Pack with 1 credit, two parallel bookings on different classes | 1 booked, 1 `no_entitlement`; `credits_used=1` | 1 booked, 1 `no_credits_left` |
| Second open monthly pass, same member and gym | unique violation `subscriptions_one_open_idx` | unique violation `passes_one_open_subscription` |
| Open pass for the same person at the other gym | allowed | allowed |
| 12-hour rule: class starts in 6 h; member books now, then cancels at once | **`cancelled` (free).** G gives any booking made inside 12 h a 1-hour free window (`free_cancel_window = 01:00:00`). The brief says late cancels count as no-shows | 409 `free_cancel_closed` with `free_cancel_until`; with `accept_late` it becomes `late_cancelled` |
| 12-hour rule: booked 3 days ago, cancelling inside 12 h | `late_cancelled`; a retry returns the same | (covered above); a retry returns `late_cancelled` |
| Cross-gym exclusion: one person is staff at A and B; staff B schedules them over their gym A class | **Rejected**: `class_sessions_instructor_no_overlap` (the key is `instructor_user_id` alone). Gym B learns the person is busy at another gym and cannot schedule them; by probing times they can map gym A's rota | `created in B` (key includes `gym_id`). A same-gym overlap is still caught |
| Skipped DST wall time (2027-03-28 01:30, London) | n/a (stores instants) | Rejected with `classes_wall_time_exists` |
| Late-cancel then rebook the same class, then read the schedule | **`week_schedule` returns the class twice** (`late_cancelled` and `booked` rows). The left join is not reduced to one row | `distinct on` gives one row |
| FK index catalog (FK columns as the leading columns of a non-partial index, or a partial index whose predicate is NOT NULL) | **3 not covered:** `class_sessions (tenant_id, location_id)` has no index leading with those columns (only `(location_id, starts_at)`); `subscriptions (tenant_id, member_user_id)` and `class_packs (tenant_id, member_user_id)` have only status- or credit-filtered partial indexes, so FK checks on a `tenant_users` delete scan the table | All covered |
| Money and time types | `bigint` minor units plus `char(3)` currency; `timestamptz` plus IANA zone, checked | `bigint` minor units plus currency; wall time `timestamp` as the truth, `timestamptz` derived by a trigger and recomputed when the zone changes |

## 2. API reading

**G**
- Idempotency: `Idempotency-Key` on every POST, stored per user, 422 on reuse, 409 while in flight. The database is naturally safe on top of that.
- Pagination: cursor on every list.
- Errors: RFC 9457 with a stable `code`.
- Tenancy: other gyms return 404, gym-scoped paths.
- Weaknesses:
  - The SQLSTATE mapping is coarse. A 23514 CHECK becomes `409 conflict` and is "logged as a bug", which contradicts the documented `capacity_below_booked`.
  - 402 for no entitlement is defensible.
  - The schedule response carries `next_scheduled_at`, but no SQL function supplies it.

**H**
- The same idempotency model, plus client-generated booking ids.
- Pagination: cursor with `has_more`.
- Errors: RFC 9457, with an explicit table mapping constraint names to HTTP status and type.
- Status codes: 412 and 428 for staff edits; 404 for other gyms and 403 only for objects the caller can see.
- Every response carries `as_of`, and the server supplies `today` in the location's zone.
- Weaknesses:
  - `GET /gyms/{id}/attendance` has no pagination. It is bounded to 30 days but is still a list.
  - Parallel same-id retries surface `bookings_pkey`, which is not mapped.
  - Check-in takes no Idempotency-Key. It is idempotent by state, which is acceptable.

## 3. Screen

**Lint results** (`node tools/lint.mjs ... --states`)

- **G FAILs in all 8 states**, with 31 to 87 failures each:
  - axe `label-content-name-mismatch` on the day tabs and some Book buttons, 7 to 11 per state. This is a real accessibility failure for voice-control users.
  - Off-scale type (13/15/17/22/28 px), off-scale spacing (1/3/6/7/10/14 px) and off-family radius (6 and 10 px).
  - 6 filled primaries in one view at 1440.
  - Sticky day bar with no `scroll-padding-top`.
  - "Join waitlist" and "Leave waitlist" text running into the button padding at 1024.
  - grid-edge failures.
- **H PASSes in all 11 states** (ready, loading, error, open, full, booked, late, past-due, pack, no-pass, empty) with 0 fails and 0 warnings.

**Screenshots** (390 and 1440, light and dark, every state)

- **G** has the better 1440 layout: a real 7-column week grid in which every card shows time, duration, level, instructor, a capacity bar and its action. That is the strongest scanning view of the two. At 390 it uses day tabs with booking dots, which is a good pattern.
- **G's states** are all present and well written:
  - late: "Free cancellation ended today 06:30. Cancelling now counts as a no-show."
  - past due: a banner giving the grace end, plus Book disabled with "After your pass pauses" on classes after the grace.
  - empty: gives the next class date.
- **H at 390** reads well: tight, honest copy and "Places as of 3:05 pm" freshness.
  - The full and waitlist detail explains that a promotion after the cutoff makes cancelling a no-show, which matches its database.
  - Past due marks a booked class after the grace as "Booked, at risk", backed by `covered` and `release_uncovered_bookings`.
- **H at 1440** is weaker: a single collapsed list in a wide column next to a summary sidebar, with no week grid. Actions sit behind a disclosure. At 390, a "Your week" card and a "Your pass" card push the schedule about 500 px down.
- **H's "Full · 0 waiting"** reads as odd copy for a full class with an empty waitlist.

**Data and screen agreement**

G puts things on screen that its data cannot supply:
1. A level of "Ages 8 to 14": `class_types.level` is CHECKed to `beginner|intermediate|advanced|youth`, so this cannot be stored.
2. "By the gym: instructor unwell": `cancel_reason` is stored, but neither `week_schedule()` nor the documented schedule response returns it.
3. The fixture sets `free_cancel_until = starts - 12h` for every booking, which ignores the 1-hour window its own `grant_place` writes.
4. `week_schedule` duplicates a class after a late-cancel and rebook, so the real screen would draw that card twice.

Both entries format times in the location's zone: G in `Europe/London` with "Times in Leeds time (BST)", H in `America/New_York` with "Times in Eastern Time". H also formats calendar dates in UTC so they never shift.

H: every number and label maps to `app.schedule` or `app.my_pass` columns (`taken`, `places_left`, `waitlist_position`, `covered`, `can_book_reason`, `reason_at`, `as_of`). I found nothing on screen that the data cannot supply.

## 4. Gate fails

**G**
1. Tenant isolation and uniqueness: the instructor exclusion constraint is keyed on the person without the gym, so a gym A booking blocks and reveals to gym B (test T9).
2. FKs with indexes: 3 composite FKs are not covered by a usable index (catalog query).
3. Screen fundamentals: the lint FAILs in every state, including axe accessibility violations.

**H**: none found.

## 5. Expert-move notes

**G does well:**
- A deliberate 1-hour "say no" window for people promoted from the waitlist.
- One endpoint for book or waitlist, decided under the lock.
- `server_time` in the response so the client never trusts the phone clock.
- Grace runs from the first failure, not each retry.
- Column grants that keep counters out of staff hands.

**A Stripe or Supabase reviewer would object to G's:**
- applying the 1-hour window to direct bookings, which breaks the stated 12-hour rule;
- unnamed CHECKs that the API cannot map;
- denormalized counters with no reconciliation job;
- no release of future bookings when a pass stops paying.

**H's moves a strong generalist would miss:**
- Wall time as the truth, with DST-gap rejection and re-derivation when the zone changes.
- Every uniqueness and exclusion rule keyed by gym.
- Waitlist entries hold a pack credit, so promotion never fails on credits.
- `accept_late`, so a stale client cannot turn a free cancel into a no-show.
- The `can` flags come from the same `pick_pass` the trigger enforces.
- `release_uncovered_bookings` when the grace lapses.
- `as_of` freshness on every read.

**A Linear-level designer would object to H's:**
- 1440 layout;
- disclosure-hidden primary actions.

## 3 biggest gaps left in H (the better entry)

1. **Desktop schedule.** At 1440, H is a single disclosure list beside a summary sidebar. It needs a 7-column week grid, or at least an always-visible action and capacity on each row. At 390 the summary and pass cards should not push the schedule below the fold.
2. **Idempotency edges.** Parallel retries with the same booking id return a raw `bookings_pkey` 23505 that is not in the problem mapping. They should replay the existing row (`on conflict (id) do nothing` then re-select).
3. **Member and profile scope.** `profiles.display_name` is global. Any gym owner who inserts a known user id into `gym_members` (no consent step) can read it, and it is shared across gyms. Also, the attendance list endpoint is not paginated. A per-gym display name, or an invite and accept flow, plus a cursor on attendance would close both.
