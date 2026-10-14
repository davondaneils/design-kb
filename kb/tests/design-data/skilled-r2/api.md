# Crux API v1

The member app and the staff desk talk to one HTTP API (Supabase Edge Functions or any server). The server verifies the Supabase JWT, then calls Postgres **as the caller** (role `authenticated`, JWT subject set), so RLS and the `app.*` functions in `schema.sql` decide every row. The secret key (`sb_secret_...`) is used only by the Stripe webhook and the scheduled jobs, never in the app bundle; the app holds the publishable key only.

## Conventions
- JSON, snake_case. Ids are opaque UUIDs. Version in the path: `/v1/`.
- **Instants** are UTC ISO 8601 (`"2026-10-13T23:00:00Z"`). **Class times** also travel as the wall time at the location (`"starts_local": "2026-10-13T19:00:00"`) plus its IANA zone (`"time_zone": "America/New_York"`): the wall time is the truth, the instant is derived. The app formats once, at the edge, with `Intl` in the page locale and `timeZone` set to the location zone.
- **Calendar dates** (`week_start`) are `"YYYY-MM-DD"` and never pass through `new Date()`.
- **Money** is `amount_minor` (integer, minor units of the source system) plus lowercase `currency`.
- **Lists** are cursor paginated: `?limit=` (default 50, max 100, larger values clamped) and `?cursor=`; responses carry `data`, `has_more`, `next_cursor`. No list returns a page count.
- **Freshness**: every read carries `as_of` (database transaction time); the app computes "as of" text from it and the `Date` header, never from the device clock.
- **Writes that take places or money** accept `Idempotency-Key` (a UUIDv4 per user intent, reused on retries). Keys are stored per user for 24 hours: same key and body replays the stored response; same key and different body is 422 `idempotency-key-reused`; same key still running is 409 `request-in-progress`. Bookings are also idempotent in the database: the app generates the booking `id` (`crypto.randomUUID()`), and a retry with that id returns the same booking.
- **Not found versus forbidden**: an object in a gym the caller does not belong to is 404, never 403, so ids cannot be probed. 403 is only for an action on an object the caller can see (a member calling a staff route in their own gym).
- **Errors** are RFC 9457 `application/problem+json` with a stable `type`, and `errors[]` items with `pointer` and `code` for fields. The app maps `code` to its own copy and never parses `detail`.

## Status codes
200 read or action, 201 created (with `Location`), 204 delete, 400 malformed, 401 no or expired token, 403 not allowed, 404 not found (including other gyms), 409 conflict with current state, 412 `If-Match` failed, 422 validation, 428 edit without `If-Match` (staff class edits), 429 with `Retry-After`.

## Member app
| Method and path | What | Codes |
|---|---|---|
| `GET /v1/me/gyms` | Gyms the caller belongs to, with role and locations | 200 |
| `GET /v1/schedule?location_id=&week_start=YYYY-MM-DD&limit=&cursor=` | One location, one week of wall time. Rows from `app.schedule`, pass from `app.my_pass`, `summary`, `can` flags. `week_start` is any date; the app sends the Monday in the location zone | 200, 404, 422 |
| `POST /v1/bookings` body `{ "id", "class_id", "intent": "book" or "waitlist" }`, `Idempotency-Key` | Take a place (or join the waitlist). Server locks the class row, recounts, inserts | 201 `booked` or `waitlisted`, 404, 409 `class-full` (`remaining: 0`, `waitlist_open: true`), 409 `already-booked`, 409 `class-started`, 409 `not-covered` (`reason`, `reason_at`), 422 |
| `POST /v1/bookings/{id}/cancel` body `{ "accept_late": false }` | Cancel or leave the waitlist. Free until `free_cancel_until`; later needs `accept_late: true` and records a no-show | 200, 404, 409 `free-cancel-closed` (`free_cancel_until`), 409 `class-started` |
| `GET /v1/me/bookings?gym_id=&limit=&cursor=` | My bookings, newest first, keyset on `(created_at, id)` | 200 |
| `GET /v1/me/pass?gym_id=` | Current pass (`app.my_pass`) | 200, 404 |
| `POST /v1/checkout-sessions` body `{ "gym_id", "product": "monthly" or "pack" }`, `Idempotency-Key` | Stripe Checkout on the gym's connected account; returns `url` | 201, 409 `subscription-open` |
| `POST /v1/billing-portal-sessions` body `{ "gym_id" }`, `Idempotency-Key` | Stripe Billing portal to update a failed payment; returns `url` | 201, 404 |

## Staff desk and owners
| Method and path | What | Codes |
|---|---|---|
| `POST /v1/classes`, `Idempotency-Key` | Publish a class (staff). Body: `location_id, class_type_id, instructor_id, starts_local, ends_local, capacity` | 201, 409 `instructor-busy` (same gym only), 422 `wall-time-skipped`, 422 field errors |
| `PATCH /v1/classes/{id}`, `If-Match` required | Change time, instructor or capacity; `{ "status": "cancelled" }` cancels and releases every place | 200, 404, 409 `capacity-below-taken` (`taken`), 412 (who changed it, when), 428 |
| `GET /v1/classes/{id}/roster?limit=&cursor=` | Booked and waiting members for the desk (staff of that gym only) | 200, 404 |
| `POST /v1/bookings/{id}/check-in` | Mark attended (idempotent: a second call returns the same booking) | 200, 404 |
| `GET /v1/gyms/{id}/members?q=&limit=&cursor=` | Members of this gym only (staff) | 200, 404 |
| `GET /v1/gyms/{id}/attendance?from=&to=` | Attendance per class; owners only; window limited to the last 30 days by `app.attendance` | 200, 404, 422 |
| `POST /v1/stripe/webhooks/{account}` | Stripe Connect events: raw body signature check, dedupe on `evt_` id in the same transaction as the sync, then `syncStripe(customer)` re-fetches the subscription and writes `passes` | 200 |

## Example: `GET /v1/schedule?location_id=...&week_start=2026-10-12`
One class shown (the rest are the same shape). This is the `ready` fixture the schedule screen renders.
```json
{
  "data": [
    {
      "class_id": "0b9a3c1e-5d7f-4e2a-9c61-7f3e2a1b4c55",
      "class_type": "Intro to Bouldering",
      "instructor_name": "Sam Ortiz",
      "starts_local": "2026-10-15T18:30:00",
      "ends_local": "2026-10-15T20:00:00",
      "starts_at": "2026-10-15T22:30:00Z",
      "ends_at": "2026-10-16T00:00:00Z",
      "class_status": "scheduled",
      "cancelled_at": null,
      "capacity": 10,
      "taken": 6,
      "places_left": 4,
      "waitlist_count": 0,
      "free_cancel_until": "2026-10-15T10:30:00Z",
      "has_started": false,
      "my_booking": null,
      "can": {
        "book": { "allowed": true },
        "cancel_free": { "allowed": false, "reason": "no_booking" }
      }
    }
  ],
  "has_more": false,
  "next_cursor": null,
  "query": { "location_id": "8d1f...", "week_start": "2026-10-12", "week_end": "2026-10-19", "time_zone": "America/New_York" },
  "location": { "id": "8d1f...", "name": "Gowanus", "gym_name": "Northline Climbing", "time_zone": "America/New_York" },
  "pass": {
    "kind": "monthly", "status": "active", "current_period_end": "2026-11-02T14:00:00Z", "cancel_at_period_end": false,
    "price_minor": 13900, "currency": "usd", "credits_left": null, "payment_failed_at": null, "grace_ends_at": null
  },
  "summary": { "has_any": true, "class_count": 10, "my_upcoming_booked": 2, "my_waitlisted": 1, "next_class_starts_local": null },
  "today": "2026-10-13",
  "rules": { "free_cancel_hours": 12, "grace_hours": 168 },
  "as_of": "2026-10-13T19:05:00Z"
}
```
- `my_booking` is `{ "id", "status", "waitlist_position", "covered" }` when the caller has a row for the class; `waitlist_position` is computed at read from `(waitlisted_at, id)` and `covered` is `private.pass_covers` against the class start.
- `can.book` comes from `private.pick_pass` against the class start, the same function the booking trigger enforces, so the flag and the rule cannot disagree. Reasons: `class_started`, `class_cancelled`, `already_booked`, `grace_ends_before_class` (with `reason_at` = grace end), `payment_required`, `no_credits_left`, `no_pass`.
- `places_left` is advisory. The write is the truth: a 409 `class-full` replaces the number on screen.
- `today` is the current date in the location zone, computed on the server (`(now() at time zone l.time_zone)::date`), so "Today" never depends on the phone's zone or clock. `summary` counts come from the same snapshot as the rows.
- Empty week: `data: []`, `summary.has_any: false`, `summary.next_class_starts_local` from `app.next_class_start` (or `null` when nothing is scheduled at all).

## Example error: the class filled between read and tap
```http
HTTP/1.1 409 Conflict
Content-Type: application/problem+json
```
```json
{
  "type": "https://api.crux.example/problems/class-full",
  "title": "This class is full",
  "status": 409,
  "detail": "All 10 places were taken before your booking arrived.",
  "class_id": "0b9a3c1e-5d7f-4e2a-9c61-7f3e2a1b4c55",
  "remaining": 0,
  "waitlist_open": true,
  "as_of": "2026-10-13T19:06:02Z"
}
```

## Database error to problem mapping
The server maps the SQLSTATE and the constraint name (both raised by name in `schema.sql`); never SQL text.
| Constraint or condition | SQLSTATE | HTTP and `type` | Pointer and `code` |
|---|---|---|---|
| `bookings_within_capacity` | 23514 | 409 `class-full` (`remaining: 0`) | |
| `bookings_one_live_per_member` | 23505 | 409 `already-booked` | `#/class_id` `already_booked` |
| `bookings_pass_covers_class` | 23514 | 409 `not-covered` (`reason`, `reason_at`) | |
| `bookings_pack_has_credit` | 23514 | 409 `not-covered` (`reason: no_credits_left`) | |
| `bookings_class_not_started` | 23514 | 409 `class-started` | |
| `bookings_class_scheduled` | 23514 | 409 `class-cancelled` | |
| `bookings_free_cancel_window` | 23514 | 409 `free-cancel-closed` (`free_cancel_until`) | `#/accept_late` `required` |
| `classes_capacity_not_below_taken` | 23514 | 409 `capacity-below-taken` (`taken`) | `#/capacity` `below_taken` |
| `classes_instructor_no_overlap` | 23P01 | 409 `instructor-busy` | `#/instructor_id` `busy` |
| `classes_wall_time_exists` | 23514 | 422 `validation` | `#/starts_local` `skipped_by_dst` |
| `classes_ends_after_start` | 23514 | 422 `validation` | `#/ends_local` `before_start` |
| `classes_capacity_range` | 23514 | 422 `validation` | `#/capacity` `out_of_range` |
| `gym_members_member_code_unique` | 23505 | 409 `validation` | `#/member_code` `taken` |
| `passes_one_open_subscription` | 23505 | 409 `subscription-open` | |
| no row in the caller's gyms (`P0002`) | P0002 | 404 `not-found` | |

Every uniqueness or exclusion rule that spans people is keyed by `gym_id` (tested by a catalog audit in `tests/80_tenant_keyed_uniqueness.sh`), so `instructor-busy`, `taken` and `subscription-open` can only ever describe the caller's own gym.

## Billing sync (Stripe)
- Each gym is a Stripe Connect account (`gyms.stripe_account_id`); each member has one customer per gym (`stripe_customers`).
- One `syncStripe(account, customer)` runs on every relevant webhook and on the checkout return page: it re-fetches the subscription and writes `passes.status`, `current_period_end` (from the subscription item), `cancel_at_period_end`, and on the first failed attempt `payment_failed_at` and `grace_ends_at = payment_failed_at + gyms.grace_hours`. Payloads are never applied as deltas.
- Access: `active` and `trialing` cover any class; `past_due` covers classes that **start** before `grace_ends_at`; every other status covers nothing. When a pass stops covering, the sync calls `private.release_uncovered_bookings`, which cancels future places free of charge and promotes the waitlist.
- Packs: `checkout.session.completed` inserts a `pack` pass (unique on `stripe_payment_intent_id`, so a duplicate event cannot grant twice). Credits are computed, never stored: `credits_total` minus bookings in `booked, waitlisted, attended, no_show, late_cancelled`.
