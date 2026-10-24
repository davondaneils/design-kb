# Crux class booking: hand-over

Strategy brief: `strategy-brief.md`, depth one page, 600 words, `brief_lint.mjs` PASS. Concept: one dot per place.

## What is here

| File | What it is |
|---|---|
| `schema.sql` | Postgres 16 DDL for Supabase: tables, keys, constraints, indexes, row level security, the `api.*` functions |
| `api.md` | HTTP routes, status codes, problem+json errors, idempotency, pagination, Stripe |
| `schedule.html` | Member schedule, one week at one wall; light and dark; `?state=` loading, empty, error, places-left, full, waitlist, booked, late-cancel, late-cancel-confirm, past-due, lapsed |
| `state-sheet.html` | Every control and panel in every state |
| `tests/run_tests.sh` | Loads the schema into a scratch PG16 with a Supabase auth stub and runs the concurrency and isolation tests |
| `tests/make_fixtures.sh`, `tests/build_page.py` | Capture the screen's data from the real functions, then inject it into the page |
| `shots/`, `lint/` | 104 screenshots (390, 768, 1024, 1440, light and dark, every state, the sheet); lint JSON per state |

## Decisions

1. **Tenant is the gym, carried in every key.** Child tables hold `gym_id` and reference parents by `(id, gym_id)`, so a booking cannot point at another gym's class even by a server bug. RLS reads go through `security definer` helpers (`private.my_gym_ids()` and friends) so policies stay index-friendly. Writes that carry rules (book, cancel, check in) go only through `api.*` functions with `search_path = ''`; members have no INSERT or UPDATE on `bookings`.
2. **Another gym's row is `404`, not `403`.** Staff of gym B cannot learn that a gym A booking exists.
3. **Class time is wall-clock truth.** `starts_local` plus the wall's IANA zone is stored; `starts_at` is derived by trigger and recomputed after a tz data release. "6:30 pm at Eastside" survives a DST rule change.
4. **One bookings table, one status.** `confirmed`, `waitlisted`, `attended`, `no_show`, `cancelled`, `late_cancelled`. A partial unique index allows one live booking per member per class.
5. **Capacity holds for every writer.** Booking locks the class row; a constraint trigger (`bookings_class_capacity`) refuses any write that takes more places than the class has, even from the service role. Places taken are confirmed + attended + no-show, so checking in never frees a place.
6. **Waitlist rank is computed, not stored.** Rank is the order of `(waitlisted_at, id)`. Cancel and promotion run in one transaction, so a place is never free while someone waits and two cancels promote two different people.
7. **Free-cancel deadline lives on each booking** (`free_cancel_until`), set at booking from the gym's window (12 hours by default). A late cancel needs `acknowledge_late`, so a member who saw "free" a second before the deadline is asked rather than charged.
8. **Retries are safe.** Booking claims its `Idempotency-Key` first, in the same transaction; a concurrent retry waits and replays the stored response. Cancel and check-in are idempotent by state.
9. **Access is computed** by `private.member_access`: active pass, or `past_due` within 7 days of `past_due_since` (grace), or none with a reason. Pack credits left = total minus bookings that used the pass, counted under a lock on the pass.
10. **Stripe is the source of truth.** `passes` is a cache written only by the webhook's `syncStripe`; `stripe_events` dedupes replays by event id. The client holds only publishable keys.
11. **The screen renders only server responses.** Every value in the page comes from `api.location_schedule` captured on a seeded database (fixtures as of 2:46 pm MT, Tue Oct 13, 2026). Disabled buttons come from `can.*` flags with the server's reason.
12. **Signature asset: the places rail.** One dot per place, filled when taken; over 16 places it becomes a bar. It answers "is there room" before the number is read.

## Data-to-screen contract

| On screen | Source field | Computed where |
|---|---|---|
| Week label "Oct 12 to 18", day strip, Today tag | `period.start_date`, `end_date`, `today` | server (week in the wall's calendar) |
| "Times are Eastside local time (MT)" | `location.name`, `location.time_zone` | client formats zone name |
| Class time "6:30 pm to 8:30 pm" | `starts_local`, `ends_local` | stored wall clock; client formats parts, never the device zone |
| Class name, instructor | `class_type.name`, `instructor.display_name` | stored |
| Places rail, "4 places left", "Full, 3 waiting" | `capacity`, `taken_count`, `places_left`, `waiting_count` | server counts |
| "Booked", "2nd in line", "Attended", "Cancelled" chips | `my_booking.status`, `my_booking.waitlist_rank`, `status` | server (rank computed) |
| "Free cancellation until Sat, Oct 17, 10 pm" | `my_booking.free_cancel_until` | stored per booking; client formats in the wall's zone |
| "Free cancellation until ... if you book now" | `free_cancel_until_if_booked` | server |
| "Free cancellation ended" flag and confirm dialog | `can.cancel.late` | server clock |
| "You'd be 1st in line" (Sat 1 pm, full, nobody waiting) | `can.join_waitlist.would_be_rank` | server |
| Disabled button and its reason | `can.book.reason`, `me.access.reason` | server |
| "3 classes booked, 1 waitlist" | `summary.my_booked_count`, `my_waitlisted_count` | server |
| "Places as of 2:46 pm" | `summary.as_of` | server clock |
| Pass card "Monthly pass, Renews Mon, Nov 2" | `me.access.pass_kind`, `renews_at` | Stripe via `passes` |
| Payment banner "You can keep booking until Sun, Oct 18, 9:14 am" | `me.access.status = grace`, `grace_ends_at` | `past_due_since` + 7 days |
| "Booking is paused" | `me.access.status = none`, `reason = payment_past_due_grace_ended` | server |
| Empty week and "Show week of Oct 26" | `summary.class_count = 0`, `next_week_with_classes` | server |
| "Load more classes" | `has_more`, `next_cursor` | server keyset |
| Picker error "That wall isn't available to you any more" | `404 not_found` from the schedule route | API |

Nothing on the screen lacks a source. Not shown because the data does not hold it: room or level, price per class, other members' names.

## Concurrency and isolation tests

`PGHOST=/tmp/crux-pg PGPORT=55432 bash tests/run_tests.sh` on PostgreSQL 16 with `tests/00_supabase_stub.sql` (roles anon, authenticated, service_role; `auth.uid()` from `request.jwt.claims`). Concurrent cases run as parallel `psql` sessions released together. **Result: 68 passed, 0 failed** (`tests/results.txt`, run 2026-10-13).

| Section | What it proves |
|---|---|
| 0. Static gate (7) | primary keys everywhere, RLS on every table, every FK indexed, no float or money types, definer functions pin `search_path`, anon cannot call `api.*`, the schedule query uses its index |
| 1. Last place race (2), 1b. 30 members for 10 places (4), 1c. negative control (1) | one winner; exactly 10 confirmed and 20 waitlisted in total order; the same race without the lock oversells, so the test can see a failure |
| 2. Two cancels at once (4), 2b. cancel plus new booker (3) | the first two in line promoted in order; nobody jumps the queue |
| 3. Double booking (8) | two taps, same-key replay, key reuse, double cancel, rebook after cancel, unique index backstop |
| 4. Cross-gym isolation (22) | staff of one gym see nothing of the other, the shared member sees both, anon reads nothing, writes refused by policy |
| 5. Capacity invariant (4) | server insert over capacity refused; check-in keeps the class full; check-in idempotent |
| 6. Late cancel and grace (7) | confirm required; promotion inside the window cancels free until the start; 7-day grace; one gym's failed payment does not touch another |
| 7. Pack credit race (2) | one credit cannot pay for two classes |
| 8. Moved or cancelled class (4) | moved class extends free cancel; If-Match version bump; gym cancel cancels bookings; instructor overlap refused |

Section 6 builds its late-cancel case from the clock; run it between 12:30 and 00:30 UTC on the seeded date, or re-seed relative to `now()` before CI.

## Screen checks

- `node tools/lint.mjs` PASS, 0 fail, 0 warn on the default and every state (loading, empty, error, places-left, full, waitlist, booked, late-cancel, late-cancel-confirm, past-due, lapsed) and on the state sheet. JSON in `lint/`.
- `claims_inventory.mjs --render` exit 0 on every state; the 44 claims on the default view ticked against `tests/fixtures/ready.json`.
- `search-check.mjs --expect private` PASS (noindex, no structured data). `icon_audit.mjs` PASS on the page and the sheet. `polish-audit.mjs` PASS.
- Round fixes: muted text moved from neutral 600 to 650 so it holds 4.5:1 under the pressed layer; a focused row no longer changes radius.
- Type: Inter named first in a system stack and installed in the render environment. Production self-hosts Inter as hashed WOFF2 with a preload; nothing is fetched from a network font host.
- **Gate not claimed.** This is self-review only; the judged fundamentals and the exemplar comparison wait for the blind critic.

## Test before launch

1. Run the race tests against a real Supabase project through PostgREST and the pooler (transaction mode), not only psql, at 50 concurrent bookers.
2. Stripe in test mode: failed renewal to `past_due`, recovery inside 7 days, recovery after 7 days, a replayed and an out-of-order webhook, a refunded pack.
3. A DST week (Nov 1, 2026 in Denver): a 1:30 am class, deadlines across the change, `recompute_class_instants()` after a tz data update.
4. `mark_no_shows()` on a schedule (pg_cron), and a desk check-in that corrects a no-show.
5. Screen on a real phone at 200 percent text and with VoiceOver: the rail's label, the dialog's focus return, live announcements after booking.
6. Load: the schedule call at a 200-class week with `has_more`, and the attendance report at 90 days.

## Open decisions for the gym owner

- Promotion inside the 12-hour window gives free cancel until the start (implemented). Alternative: no free cancel once promoted late.
- A class the gym moves gives free cancel until the new start (implemented).
- Youth Club books like any class; a guardian booking for a child is not modelled.
- A member on a class pack sees credits left on the pass card; the seeded member holds a monthly pass, so the pack card is in the code but not in a screenshot.
