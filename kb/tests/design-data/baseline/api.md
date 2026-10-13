# Crux API surface

Version 1. JSON over HTTPS. Base URL `https://api.crux.app/v1`.

The API is a thin layer (Supabase Edge Functions) in front of the Postgres functions in `schema.sql`. It forwards the member's or staff member's own JWT to Postgres, so row level security and the `SECURITY DEFINER` booking functions make every access decision. Only two places use the service role key: the Stripe webhook handler and the scheduled jobs. Neither runs in a client.

## Conventions

**Auth.** `Authorization: Bearer <Supabase access token>`. Missing or expired: `401`. Valid token but not a member or staff of the gym that owns the resource: `404`, never `403`, so the API does not confirm that another gym's class or member exists.

**Tenancy.** Every gym-scoped path starts with `/gyms/{gym_id}`. The gym in the path is checked against the caller's `tenant_users` row in the database, not trusted from the client.

**Times.** All instants are RFC 3339 in UTC (`2026-10-15T17:30:00Z`). Every response that carries class times also carries the location's IANA zone (`"timezone": "Europe/London"`). Clients format in that zone, never the device zone. Week queries take a local date (`week_start=2026-10-12`) that the server resolves in the location's zone.

**Money.** `{ "amount": 5500, "currency": "GBP" }`, integer minor units. Never floats, never formatted strings.

**IDs.** UUIDs. Stripe IDs never leave the server except the Checkout and Billing Portal URLs.

**Pagination.** Every list is cursor paginated: `?limit=` (default 25, max 100) and `?cursor=`. Responses: `{ "data": [...], "next_cursor": "opaque" | null }`. Cursors encode the sort key (`starts_at, id` or `created_at, id`), so inserts during paging never duplicate or skip a row. The week schedule is bounded by its date range and also returns `next_cursor` (null in practice; a week at one wall holds well under 100 classes).

**Idempotency.** Every `POST` that creates or changes something (booking, cancel, check-in, checkout) requires `Idempotency-Key: <uuid v4>`. The first response is stored for 24 hours against (user, key). A retry with the same key and body returns the stored response with `Idempotent-Replayed: true`. Same key with a different body: `422 idempotency_key_reused`. A retry while the first request is still running: `409 request_in_progress` with `Retry-After: 1`. Underneath, the database also makes the operations naturally safe: one live booking per member per class is a unique index, and cancelling an already cancelled booking returns it unchanged.

**Concurrency for staff edits.** `PATCH` takes `If-Match: <etag>` (the row's `updated_at`). Stale: `412 precondition_failed`.

**Errors.** `application/problem+json` (RFC 9457) with a stable machine `code`:

```json
{
  "type": "https://docs.crux.app/errors/class_full",
  "title": "This class is full",
  "status": 409,
  "code": "class_full",
  "detail": "Intro to Bouldering on Thu 15 Oct is full. You can join the waitlist.",
  "request_id": "req_01JA8Q6Y3X2M",
  "errors": []
}
```

`errors` holds field problems on `422`: `[{ "field": "capacity", "code": "out_of_range", "message": "Capacity must be 1 to 60" }]`. Clients switch on `code`, never on `title` or `detail`, which are for people and may be translated.

Mapping from the database: the API reads the error code from Postgres `DETAIL` (`private.fail`) and maps SQLSTATE `P0002` to 404, `23505` to 409, `P0003` to 402, `P0001` to 409 or 422 per code, `23514` (a CHECK firing) to 409 `conflict` and logs it as a bug.

**Rate limits.** `429 rate_limited` with `Retry-After`. Per user: 60 writes a minute. Per IP on auth: 10 a minute.

## Member app

### `GET /me`
The signed-in person and the gyms they belong to (only their own `tenant_users` rows).
`200` `{ "user_id", "gyms": [{ "gym_id", "name", "role", "locations": [{ "id", "name", "timezone" }] }] }`

### `GET /gyms/{gym_id}/locations/{location_id}/schedule?week_start=YYYY-MM-DD`
One week at one location. Backed by `week_schedule()`. `week_start` must be a Monday in the location's zone, otherwise `422 invalid_week_start`. Omitted: the current week.

`200`
```json
{
  "location": { "id": "…", "name": "Kirkstall", "timezone": "Europe/London" },
  "week_start": "2026-10-12",
  "server_time": "2026-10-13T08:40:00Z",
  "entitlement": {
    "kind": "monthly_pass",
    "status": "past_due",
    "grace_until": "2026-10-17T07:15:00Z",
    "credits_left": null,
    "plan_name": "Monthly Unlimited"
  },
  "data": [
    {
      "session_id": "…",
      "class_type": { "name": "Intro to Bouldering", "level": "beginner" },
      "instructor_name": "Priya",
      "starts_at": "2026-10-15T17:30:00Z",
      "ends_at": "2026-10-15T19:00:00Z",
      "status": "scheduled",
      "capacity": 10,
      "places_left": 3,
      "waitlist_count": 0,
      "my_booking": {
        "id": "…",
        "status": "booked",
        "waitlist_position": null,
        "free_cancel_until": "2026-10-15T05:30:00Z"
      }
    }
  ],
  "next_scheduled_at": null,
  "next_cursor": null
}
```
`next_scheduled_at` is filled only when `data` is empty: the start of the next class at this location after the week, so the empty screen can say when classes resume. `server_time` lets the client decide "can I still cancel for free" without trusting the phone clock. `entitlement` is null when the member has no pass and no credits. `404` unknown location or not your gym.

### `POST /gyms/{gym_id}/sessions/{session_id}/bookings`
Book a place, or join the waitlist if the class is full. Requires `Idempotency-Key`. No body.

| Status | When |
|---|---|
| `201` | `{ "booking": { "id", "status": "booked", "free_cancel_until" } }` |
| `201` | `{ "booking": { "id", "status": "waitlisted", "waitlist_position": 3 } }` |
| `402 no_entitlement` | No active pass, past the 7-day grace for this class, or no pack credits |
| `404 session_not_found` | Unknown or another gym's class |
| `409 already_booked` | You already hold a place or waitlist spot (body includes `booking_id`) |
| `409 session_cancelled` | Gym cancelled the class |
| `409 session_started` | Class has started |

Booking and waitlisting share one endpoint on purpose: between the screen loading and the tap, the last place may go. The server decides under a row lock and the response says which happened, so the client never shows "booked" for a waitlist join.

### `POST /gyms/{gym_id}/bookings/{booking_id}/cancel`
Cancel a place or leave a waitlist. Requires `Idempotency-Key`. A second call on a cancelled booking returns `200` with the same body.

`200` `{ "booking": { "id", "status": "cancelled" | "late_cancelled" }, "credit_returned": true | false }`

`late_cancelled` means after `free_cancel_until`: the place is released to the waitlist, it counts as a no-show and a pack credit is not returned. The client must show that consequence and get a confirm before calling. Errors: `404 booking_not_found`, `409 not_cancellable` (class started, attended, or no-show).

### `GET /gyms/{gym_id}/me/bookings?scope=upcoming|past&limit&cursor`
Your bookings at this gym. Upcoming sorts by `starts_at asc`, past by `starts_at desc`. `200` paginated list of the same booking shape plus the class summary.

### `GET /gyms/{gym_id}/me/entitlement`
`200` `{ "pass": { "status", "current_period_end", "grace_until" } | null, "packs": [{ "id", "credits_left", "expires_at" }] }`

### `POST /gyms/{gym_id}/checkout`
Starts Stripe Checkout on the gym's Connect account. Body `{ "plan_id": "…" }`. Requires `Idempotency-Key` (passed through to Stripe). `201` `{ "url": "https://checkout.stripe.com/…" }`. `409 already_subscribed` if a pass is already open. The app never sees card data or a Stripe secret; it only opens the URL. Access is granted by the webhook, not by the redirect.

### `POST /gyms/{gym_id}/billing-portal`
`201` `{ "url": "https://billing.stripe.com/…" }`. The "Update card" action in the past-due banner opens this.

## Staff desk

All staff routes check `role in ('staff','owner')` for that gym in the database; a member token gets `404`.

### `GET /gyms/{gym_id}/sessions?location_id&from&to&limit&cursor`
Classes in a range (max 31 days). Includes counts. `200` paginated.

### `POST /gyms/{gym_id}/sessions`
Publish a class. Body `{ "location_id", "class_type_id", "instructor_user_id", "starts_at", "ends_at", "capacity" }`. Requires `Idempotency-Key`.
`201` the session. `422 validation_failed` (end before start, capacity outside 1 to 60, longer than 8 hours). `409 instructor_double_booked` (exclusion constraint).

### `PATCH /gyms/{gym_id}/sessions/{session_id}`
Edit time, instructor or capacity. `If-Match` required. `409 capacity_below_booked` if capacity would drop under the number already booked. Raising capacity promotes from the waitlist in the same transaction. `412 precondition_failed` on a stale ETag.

### `POST /gyms/{gym_id}/sessions/{session_id}/cancel`
Body `{ "reason": "Instructor ill" }`. Releases every place and waitlist spot and returns pack credits. Idempotent. `200` the session.

### `GET /gyms/{gym_id}/sessions/{session_id}/roster?limit&cursor`
Booked and waitlisted members for one class, waitlist in queue order. `200` `{ "data": [{ "booking_id", "member": { "user_id", "display_name" }, "status", "waitlist_position", "checked_in_at" }], "next_cursor" }`.

### `POST /gyms/{gym_id}/bookings/{booking_id}/check-in`
Requires `Idempotency-Key`. Checking in twice returns `200` with the same row. `409 not_checkin_eligible` (cancelled or waitlisted), `409 outside_checkin_window` (opens 2 hours before start, closes 2 hours after end).

### `GET /gyms/{gym_id}/members?q&limit&cursor`
Search this gym's members by name or email. Only `tenant_users` rows of this gym exist in the result; a person who also belongs to another gym appears with this gym's details only. `200` paginated.

### `GET /gyms/{gym_id}/reports/attendance?days=30`
Owner only (staff get `404`). Per day and location: classes, places booked, attended, no-shows, late cancels. `days` from 1 to 30; more is `422 range_too_large`. `200` `{ "data": [...], "next_cursor": null }`.

## Stripe webhooks (server only)

### `POST /webhooks/stripe`
Verifies `Stripe-Signature` with the endpoint secret, then `insert into stripe_events ... on conflict (id) do nothing`. A duplicate delivery returns `200` without doing anything. Processing is in the same transaction as the insert. Handles:

- `checkout.session.completed` and `invoice.paid`: subscription `active`, clear `payment_failed_at` and `grace_until`; or create the `class_packs` row (unique `stripe_payment_intent_id`).
- `invoice.payment_failed`: subscription `past_due`; set `payment_failed_at` only if empty (the 7 days run from the first failure, not from each retry); `grace_until = payment_failed_at + 7 days`.
- `customer.subscription.updated` / `deleted`: mirror status and `current_period_end`.
- `charge.refunded` for a pack: set `refunded_at`; remaining credits stop working.

Events can arrive out of order, so the handler re-reads the subscription from Stripe (`subscriptions.retrieve`) instead of trusting the event payload's snapshot. Returns `200` fast; a failure returns `500` and Stripe retries.

## Jobs

- Every 15 minutes: `private.mark_no_shows()` turns booked places with no check-in 2 hours after the class ends into `no_show`.
- Hourly: purge `idempotency_keys` older than 24 hours.
- On promotion from the waitlist: an outbox row drives a push notification ("You're in: Intro to Bouldering, Thu 18:30") with the free-cancel deadline.
