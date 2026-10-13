# Crux API

The member app and the staff desk talk to one HTTP API (`/v1`). Each route is a thin handler over one Postgres function in `schema.sql` (`api.*`), called with the caller's Supabase JWT, so row level security and the function's own checks decide what the caller may see and do. No route trusts a gym id from the body: the tenant always comes from the row being touched.

## Conventions

- **Auth**: `Authorization: Bearer <Supabase access token>`. The client holds only the Supabase anon key and the Stripe publishable key. The service role key, the Stripe secret key and the webhook signing secret live in the server only.
- **Ids**: UUID v7 strings. **Times**: instants as RFC 3339 UTC (`2026-10-13T12:30:00Z`); class times also as wall-clock local (`starts_local: "2026-10-13T18:30:00"`) with the location's IANA `time_zone`. The client formats both in the location's zone, never the device's.
- **Money**: integer minor units plus ISO 4217 code (`price_minor: 7900, currency: "usd"`).
- **Lists**: keyset pagination. `limit` default 50, max 100. The response carries `has_more` and `next_cursor` (opaque, base64url of `{starts_at, id}`); pass it back as `cursor`. No offsets.
- **Retries**: every POST that creates something takes `Idempotency-Key: <uuid>`. The key is claimed in the same transaction as the work: a second request with the same key waits on the first and then reads its stored response, so two taps never make two bookings (tests 3). The same key with the same body returns the stored response with `Idempotent-Replay: true`; the same key with a different body or route is `422 idempotency_key_reused`. Keys are scoped per user and kept 24 hours. Cancel and check-in are idempotent by state, so they need no key.
- **Concurrency on staff edits**: class responses carry `ETag: "<version>"`; `PATCH` needs `If-Match`, else `428`; a stale version is `412`.
- **Errors**: RFC 9457 `application/problem+json`, always with a stable `code`:

```json
{
  "type": "https://crux.app/problems/class_full",
  "title": "This class is full",
  "status": 409,
  "code": "class_full",
  "detail": "No places left. You can join the waitlist.",
  "places_left": 0,
  "waiting_count": 3,
  "request_id": "req_01J9..."
}
```

Clients branch on `code`, never on `title` or `detail` (those are for people and may change).

## Member routes

| Method and path | Function | Success | Errors |
|---|---|---|---|
| `GET /v1/me` | RLS reads of profiles, gyms, locations | 200 `{profile, gyms[{id, name, locations[{id, name, time_zone}]}]}` | 401 |
| `GET /v1/locations/{id}/schedule?week=YYYY-MM-DD&limit=&cursor=` | `api.location_schedule` | 200 schedule (below) | 401, 404 `not_found` (no such wall, or not one of your gyms), 400 `invalid_request` (handler: `week` not a date). Any date snaps to its Monday in the wall's calendar |
| `POST /v1/classes/{id}/bookings` body `{join_waitlist: bool}` + `Idempotency-Key` | `api.book_class` | 201 `{booking_id, status: confirmed or waitlisted, class, as_of}` | 400 `idempotency_key_missing`, 401, 403 `no_access` (with `reason`), 404, 409 `class_full` / `already_booked` / `class_started` / `class_cancelled`, 422 `idempotency_key_reused` |
| `POST /v1/bookings/{id}/cancel` body `{acknowledge_late: bool}` | `api.cancel_booking` | 200 `{booking_id, status, class, as_of}` | 401, 404, 409 `late_cancel_unconfirmed` (with `free_cancel_until`) / `not_cancellable` / `class_started` |
| `GET /v1/me/bookings?from=&limit=&cursor=` | RLS read of bookings | 200 page of bookings with class summary | 401 |
| `POST /v1/gyms/{id}/checkout-sessions` body `{kind: monthly or pack}` + `Idempotency-Key` | server, Stripe Checkout on the gym's connected account | 201 `{url}` | 401, 404, 409 `pass_already_active` |
| `POST /v1/gyms/{id}/billing-portal-sessions` | server, Stripe Billing Portal | 201 `{url}` | 401, 404 |

`DELETE` is not used for cancel: a cancel is a state change with a rule (late or not), it keeps the row, and it returns the class as it now stands.

### The schedule response

One call draws the whole screen. Every field the screen shows is here; the screen computes nothing the server did not send except formatting.

```json
{
  "location": {"id": "...", "name": "Eastside", "time_zone": "America/Denver", "gym": {"id": "...", "name": "Basalt Climbing"}},
  "period": {"start_date": "2026-10-12", "end_date": "2026-10-18", "today": "2026-10-13", "time_zone": "America/Denver"},
  "data": [{
    "id": "...", "status": "scheduled", "has_ended": false,
    "class_type": {"id": "...", "name": "Lead Climbing Course"},
    "instructor": {"id": "...", "display_name": "Priya"},
    "starts_local": "2026-10-13T18:30:00", "ends_local": "2026-10-13T20:30:00",
    "starts_at": "2026-10-14T00:30:00Z", "ends_at": "2026-10-14T02:30:00Z",
    "capacity": 8, "taken_count": 8, "places_left": 0, "waiting_count": 2,
    "free_cancel_until_if_booked": "2026-10-13T12:30:00Z",
    "my_booking": {"id": "...", "status": "confirmed", "waitlist_rank": null, "promoted": false,
                   "free_cancel_until": "2026-10-13T12:30:00Z", "cancel_reason": null},
    "can": {"book": {"allowed": false, "reason": "already_booked"},
            "join_waitlist": {"allowed": false, "reason": "already_booked"},
            "cancel": {"allowed": true, "late": true},
            "leave_waitlist": {"allowed": false, "reason": "not_waitlisted"}}
  }],
  "has_more": false, "next_cursor": null,
  "summary": {"as_of": "2026-10-13T20:46:34Z", "class_count": 7, "my_booked_count": 3, "my_waitlisted_count": 1,
              "next_week_with_classes": null},
  "me": {"access": {"status": "active", "pass_kind": "monthly", "reason": null, "grace_ends_at": null,
                    "credits_left": null, "renews_at": "2026-11-03T06:00:00Z"}}
}
```

- `taken_count` counts confirmed, attended and no-show bookings: checking in does not free a place.
- `waitlist_rank` is computed (order of `waitlisted_at`, then id), never stored, so two cancels can never leave two people holding rank 1.
- `can.*` flags are the server's decision with a machine reason. The screen disables a button only from a flag and shows the reason's words; it never re-derives a rule.
- `me.access.status` is `active`, `grace` (payment failed, within 7 days of `past_due_since`, `grace_ends_at` set) or `none` with `reason` (`no_pass`, `payment_past_due_grace_ended`, `no_credits_left`).

## Staff and owner routes

| Method and path | Function | Success | Errors |
|---|---|---|---|
| `POST /v1/locations/{id}/classes` + `Idempotency-Key` | RLS insert on classes (staff of that gym) | 201 class, `ETag` | 401, 404, 409 `instructor_busy` (`classes_instructor_no_overlap`), 422 `invalid_class` (check constraints) |
| `PATCH /v1/classes/{id}` + `If-Match` | RLS update; trigger moves free-cancel deadlines and promotes on more capacity | 200 class, new `ETag` | 401, 404, 409 `instructor_busy` / `capacity_below_taken` (`bookings_class_capacity`), 412 `version_mismatch`, 428 `if_match_required` |
| `POST /v1/classes/{id}/cancel` | RLS update to `cancelled`; trigger cancels every live booking | 200 class | 401, 404; repeat returns 200 unchanged |
| `GET /v1/classes/{id}/roster?limit=&cursor=` | RLS read (staff of that gym) | 200 page of bookings with member display names | 401, 404 |
| `POST /v1/bookings/{id}/check-in` | `api.check_in` | 200 `{booking_id, status: attended, checked_in_at}`; repeat returns the first check-in | 401, 404, 409 `not_checkable` / `outside_check_in_window` |
| `GET /v1/gyms/{id}/attendance?days=30&limit=&cursor=` | `api.gym_attendance` (owners only) | 200 page of past classes with attended, no-show and late-cancel counts, plus totals | 401, 404 |

A staff member of another gym gets `404`, not `403`: another tenant's rows do not exist for them (tests 4).

## Stripe

- `POST /v1/webhooks/stripe`: verifies the signature with the raw body, inserts `event.id` into `stripe_events` (a replay hits the primary key and returns 200 at once), then calls `syncStripe(customer)` which re-reads the subscription or checkout session from Stripe and writes `passes`. Events are treated as "something changed", never as the data, so order does not matter. Returns 200 within 10 seconds; slow work runs after the insert commits.
- `passes` rows are written only by the service role through `syncStripe`. `past_due_since` is set when the status first becomes `past_due` and cleared when it leaves it (constraint `passes_past_due_has_time`).
- Each gym is a Stripe Connect account (`gyms.stripe_account_id`); Checkout and the portal run on it, so money goes to the gym.

## Error codes

| `code` | Status | Raised by | Client does |
|---|---|---|---|
| `unauthenticated` | 401 | every function | sign in again |
| `not_found` | 404 | every function; also any other gym's row | show "not available" and refresh |
| `no_access` | 403 | `book_class`; body `reason`: `no_pass`, `payment_past_due_grace_ended`, `no_credits_left` | show the reason; link to billing |
| `class_full` | 409 | `book_class` without `join_waitlist`; body `places_left`, `waiting_count` | offer the waitlist with the new count |
| `already_booked` | 409 | `book_class`; body is the class as the caller sees it | redraw the row from the body |
| `class_started`, `class_cancelled` | 409 | `book_class`, `cancel_booking` | redraw the row |
| `late_cancel_unconfirmed` | 409 | `cancel_booking` past the deadline without `acknowledge_late`; body `free_cancel_until` | open the late-cancel dialog |
| `not_cancellable`, `not_checkable` | 409 | wrong booking status; body `status` | redraw |
| `outside_check_in_window` | 409 | `check_in` earlier than 2 hours before or later than 12 hours after | show the window |
| `idempotency_key_missing` | 400 | create routes | client bug |
| `idempotency_key_reused` | 422 | same key, different request | client bug; new key |
| `version_mismatch` | 412 | `PATCH` with a stale `If-Match` | reload the class, re-apply |
| `invalid_request` | 400 | handler input validation; `errors[]` lists fields | client bug |
| `rate_limited` | 429 | gateway, not the database; `Retry-After` | back off |

Constraint violations map by constraint name, not by message text: `bookings_one_live_per_member` to `already_booked`, `bookings_class_capacity` to `class_full` (or `capacity_below_taken` on a staff edit), `classes_instructor_no_overlap` to `instructor_busy`, `classes_location_fk` and other `*_fk` to `not_found`, any other check constraint to `422 invalid_<table>` with the constraint name in `errors[]`. Anything unmapped is `500` with `request_id` and no SQL in the body.
