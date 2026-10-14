# Crux: hand-over (design-data v0.2.3, skilled build round 2)

Strategy brief: `brief.md`, depth inherit, 248 words, `brief_lint.mjs` PASS. Weakest field: the member's words are a stand-in (the brief's own rules restated); no research held. No public claims, so no claims ledger rows.
Playbook: design-playbook-mobile (member screen used on a phone), with the dashboard reflex of a two-column layout from 1024. Type: system stack, no web font. Gate not claimed: self-review only, until the blind critic's pass.

## Model in one paragraph
Gym-owned (pool tenancy): every business row carries `gym_id`, and the composite foreign keys pin each child's `gym_id` to its parent's: `(location_id, gym_id)`, `(class_id, gym_id)`, `(pass_id, gym_id, user_id)`, `(gym_id, user_id)` to `gym_members`. A person is one `profiles` row and one `gym_members` row per gym, so a member of two gyms is two memberships, and staff of one gym can reach that person only through their own gym's rows. Class time is stored as wall time at the location plus the location's IANA zone, and the instant is derived. Places left, waitlist rank and pack credits are computed at read and enforced at write under the class row lock (or the pass row lock for credits). Passes are a cache of Stripe written only by the sync.

## Files
| File | What |
|---|---|
| `schema.sql` | DDL, named constraints, indexes (each commented with its query), triggers, `app.*` RPC functions, grants and RLS |
| `api.md` | Endpoints, codes, idempotency, example response, problem+json, constraint-to-error mapping, Stripe sync |
| `schedule.html` | Member schedule screen, self-contained, light and dark, 11 `?state=` URLs |
| `state-sheet.html` | Every control in every state, plus empty, loading, error and partial panels |
| `tests/run.sh` | Scratch PostgreSQL 16 cluster (own temp dir, free port), loads the Supabase stand-in, the schema and the helpers, runs every test, stops and removes the cluster |
| `tests/results.txt` | Last run: 83 PASS, 0 FAIL |
| `lint/` | Lint JSON per state and for the state sheet |
| `shots/` | 96 renders: 11 states and the state sheet at 390, 768, 1024 and 1440, light and dark |

## Decisions
- **Invariants in the database, on every write path (expert move 9a).** The booking guard and the capacity guard are triggers, so they hold for the API, the staff UI, the waitlist promotion, the Stripe sync and the service role alike. Every writer that can take a place locks the class row first. Lowering capacity below the places taken is refused (`classes_capacity_not_below_taken`), including while a booking is in flight: the update waits for the lock and then counts it.
- **Coverage is checked against the class start, not now (9b).** `private.pass_covers` is the one rule: `past_due` covers classes that start before `grace_ends_at`. The same function feeds the schedule's `can.book` flag, so the flag and the rule cannot drift. A booking made while active for a class after the grace end shows as "Booked, at risk", and a job at grace end calls `private.release_uncovered_bookings`, which releases the place free of charge and promotes the waitlist.
- **Uniqueness keyed by the gym (9c).** One open subscription per member per gym (`passes_one_open_subscription`, a partial unique index), instructor overlap per gym (EXCLUDE), desk codes, class type and location names per gym. A catalog audit test fails if any unique or exclusion rule on a gym-owned table spans people without `gym_id`. Stripe ids and gym slugs stay global on purpose: they are public or written only by the server.
- **Waitlist order is lock order.** `waitlisted_at` is `clock_timestamp()` taken under the class lock (not `now()`, which ties within one transaction), with `id` as the tie-breaker; rank is computed at read. A waitlist entry holds a pack credit so promotion never fails on credits, and a member whose coverage lapses is skipped (`waitlist_lapsed`), not promoted.
- **Late cancel needs consent in the request.** Inside the window, `cancel` without `accept_late: true` returns 409 `free-cancel-closed`, so a stale page can never turn a free cancel into a no-show. The screen asks twice.
- **Wall time is the truth.** A local time the zone skips (2:30 am on a spring-forward night) is refused (`classes_wall_time_exists`; found by the volume test, which hit 2026-03-08). A location zone change re-derives its classes' instants in the same transaction.
- **Packs stack; subscriptions do not.** Two packs are allowed (oldest is spent first); two open subscriptions would double-bill. "Open" includes `past_due` and `unpaid`.

## Data-to-screen contract (schedule screen)
| UI state or element | Data condition | Field or query | Format at the edge |
|---|---|---|---|
| Loading (`?state=loading`) | No response, no cache | client request in flight | Skeleton in final geometry, `aria-busy` on the week |
| Error (`?state=error`) | Network failure or 5xx, no cached week | problem+json `type` | Panel with Try again; no numbers |
| Nothing scheduled (`?state=empty`) | `data: []`, `summary.has_any: false` | `summary.next_class_starts_local` (`app.next_class_start`) | "No classes at Gowanus from Oct 19 to 25", next class as wall time; `data-data="none"` |
| Places left ("4 left") | `places_left > 0`, `can.book.allowed` | `capacity - taken` in `app.schedule`, same snapshot as `as_of` | Detail: left, capacity, booked, waiting, "as of 3:05 pm"; `data-derived-from="diff cap taken"` |
| Book (`?state=open`) | `can.book.allowed`, places left | `private.pick_pass` against `starts_at` | One filled button; 409 `class-full` replaces the number |
| Starts within the window | `free_cancel_until <= as_of` before booking | `free_cancel_until = starts_at - gyms.free_cancel_hours` | "This class starts within 12 hours. Once you book, cancelling counts as a no-show." |
| Full, join waitlist | `places_left = 0`, `can.book.allowed` | `waitlist_count` | "Full · 0 waiting", Join waitlist |
| Your waitlist position (`?state=full`) | `my_booking.status = 'waitlisted'` | `my_waitlist_position` (rank by `(waitlisted_at, id)`) | "2nd in line", "You’re 2nd of 3 waiting, as of 3:05 pm" |
| Booked, free cancel open (`?state=booked`) | `my_status = 'booked'`, `free_cancel_until > as_of` | `free_cancel_until` | "Free cancellation until Fri, Oct 16, 6 am" in the location zone |
| Booked, free cancel closed (`?state=late`) | `my_status = 'booked'`, `free_cancel_until <= as_of` | same | "closed at 7 am today", Cancel anyway, then a confirm; sends `accept_late` |
| Payment past due (`?state=past-due`) | `pass.status = 'past_due'` | `payment_failed_at`, `grace_ends_at` | Banner with Update payment; Fri booking "Booked, at risk" (`my_booking.covered = false`); Sat classes disabled with reason `grace_ends_before_class` |
| Class pack (`?state=pack`) | `pass.kind = 'pack'` | `credits_left` (computed), `credits_total` | "2 of 10 classes left"; late cancel says it uses a class |
| No pass (`?state=no-pass`) | `pass: null`, `can.book.reason = 'no_pass'` | `app.my_pass` empty | Get a pass card; Book disabled with the reason |
| Attended, ended | `has_started`, `my_status = 'attended'` | `app.schedule` | "Attended" or "Ended" |
| Cancelled by the gym | `class_status = 'cancelled'` | `cancelled_at` | "Cancelled", detail with the time; bookings were released by trigger |
| Your week | upcoming booked and waitlisted rows | `summary.my_upcoming_booked`, `summary.my_waitlisted` | "2 booked, 1 on a waitlist" |
| Today | location date on the server | `today` | "Today" beside the day |
| Times | wall time plus zone | `starts_local`, `ends_local`, `time_zone` | "7 to 8:30 pm", "Times in Eastern Time" (`Intl` longGeneric) |
| Renews | `cancel_at_period_end = false` | `current_period_end` | "Renews Mon, Nov 2" (or "Ends") |

The partial panel (pass request failed while the schedule loaded) is drawn on the state sheet; it has no `?state=` on the page.

## Proof
**Database** (`bash tests/run.sh`, PostgreSQL 16, 83 PASS, 0 FAIL on every run after the last schema change; 76 to 81 checks were stable over 4 earlier runs):
| Test | Result |
|---|---|
| Last place race (`10`) | 20 concurrent bookings (pgbench, 20 connections) for 1 place: 8 of 8 taken, 19 rows not written. With intent waitlist: 8 booked, 19 waiting, 19 distinct queue keys. Forced interleave: the second booking waited 1.5 s for the class lock, then got `bookings_within_capacity` |
| Two cancels against a waitlist (`20`) | 8 booked plus 3 waiting; two concurrent cancels: still 8 booked, the first two in line promoted once each, the third reads rank 1. Late cancel refused without `accept_late`, accepted with it, place goes to the waitlist, second cancel idempotent |
| Double booking (`30`) | Same id retry returns one row; new id refused by `bookings_one_live_per_member`; two devices at once: one row; rebook after cancel allowed; service role duplicate refused |
| Cross-gym isolation (`40`) | Staff A read 0 rows of gym B members, bookings, passes, classes and B-only profiles (and 2 of its own bookings); check-in, cancel, schedule and attendance across gyms return not found; RLS refuses a class insert and self-join into gym B; an update to B's class changes nothing; members cannot write bookings or passes; anon reads nothing |
| Capacity below taken (`50`) | Staff set 2 under 5 taken: refused; 5 allowed; service role refused; capacity 6 sent with 2 bookings in flight: waited, counted 7, refused; service role insert past capacity refused; raising capacity promotes in order; class cancel releases everything |
| Grace and credits (`60`) | Past due with grace ending in 2 days: class in 1 day booked, class in 3 days refused (also for the service role), schedule flag `grace_ends_before_class` with `reason_at` = grace end; promotion skips the lapsed member; one credit and two concurrent bookings: one place; on-time cancel returns the credit; at-risk booking reads `covered = false` and is released when unpaid, promoting the next |
| Two open passes (`70`) | Second open subscription refused (also when the first is `past_due`); another gym allowed; after cancel allowed; packs stack; `past_due` without grace impossible |
| Tenant-keyed uniqueness (`80`) | Same instructor same hour at another gym allowed, overlap in one gym refused; desk code and class type name per gym; catalog audit: no people-spanning unique or exclusion rule without `gym_id` |
| Wall time (`85`) | Skipped DST time refused; 6 pm EDT derives 22:00 UTC; zone change re-derives to 23:00 UTC; bad zone refused |
| Gate audit (`90`) | Every table has a PK; RLS on all; every FK has an index led by its columns; no float, money, char(n); anon executes no private or app function; definer functions pin `search_path` |
| Index use (`95`) | Week query over 12,000 classes: Index Scan on `classes_location_week_idx` |

**Screen** (`node tools/lint.mjs`, all widths 390, 768, 1024, 1440): default, loading, empty, open, full, booked, late, past-due, pack, no-pass, error and the state sheet all PASS, 0 fail, 0 warn (after fixes: a `-1px` screen-reader margin, button padding, an h2 at 24px, the payment banner moved full width for measure, curly apostrophes, a heading wrap, and a no-pass heading the truth check read as an empty state). `claims_inventory.mjs --render`: exit 0, no flags in all 11 states; claims ticked against the fixtures. `search-check.mjs --expect private`: PASS (noindex, no structured data). `icon_audit.mjs`: PASS, 3 icons at 16 px with a 1.5 px stroke and round caps; the alert triangle carries a volume prompt (17 percent ink), which I looked at and kept.

## What I would test before launch
pgTAP versions of `tests/` under `supabase/tests/` run by `supabase test db`; Supabase Advisors against the linked project; the Stripe sync against test-mode Connect events (out of order and duplicated); the grace-end release job; `explain (analyze, buffers)` on `app.schedule` at production volume; every migration on a production-sized copy; a restore drill; every `?state=` URL on a real phone with 200 percent text.

## Still short of the exemplar (Linear app, Cash App)
1. Week navigation is two tabs (this week, next week); the API takes any `week_start`, but the screen offers no way to jump further.
2. No motion was filmed: the only movement is the chevron turn and hover color, both removed under reduced motion.
3. At 1440 the rows run wide with empty space between the name and the status; a denser list would put instructor and places on one line.
