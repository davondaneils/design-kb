# Crux hand-over: class schedule, booking and billing

Files: `schema.sql` (Postgres / Supabase), `api.md` (HTTP surface), `schedule.html` (member week schedule, every state via `?state=loading|empty|available|waitlist|booked|late|past_due`; no parameter shows a mixed week).

## Decisions

**Data model**

1. **Tenant on every row, enforced by composite foreign keys.** Child tables reference `(tenant_id, id)`, so a booking cannot point at another gym's class or member even if application code is wrong. RLS is the second wall, not the only one.
2. **People are per gym.** `tenant_users` holds name, email and phone per gym. There is no global profile table, so staff of gym A cannot read anything a member gave gym B, and cannot learn that B exists.
3. **Waitlist and bookings are one table.** A waitlist entry is a booking row with status `waitlisted` and an order key (`waitlisted_at, id`). Promotion is a status change, so a person can never be on the waitlist and booked for the same class at once. A partial unique index enforces one live row per member per class.
4. **All seat changes lock the class row.** `book_class`, `cancel_booking`, promotion, check-in, cancelling a class and capacity edits all start with `SELECT ... FOR UPDATE` on `class_sessions`. That serialises the last place and the promotion. `CHECK (booked_count between 0 and capacity)` is the backstop: a bug would raise an error rather than overbook. Verified on Postgres 16 locally: three members booking a 1-place class at the same moment gave one booked and two waitlisted; two simultaneous cancels of the same booking promoted exactly one person.
5. **Counters are stored, not counted.** `booked_count` and `waitlist_count` sit on the class row so the schedule shows "3 of 10 places left" without exposing other members' bookings to RLS. Clients cannot write them (column grants).
6. **The free-cancel deadline is stored per booking** (`free_cancel_until`), not derived from the start time. Normally it is start minus 12 hours. A member promoted from the waitlist inside that window gets one hour to decline without penalty (opinion: otherwise the waitlist punishes people for a place they did not choose at that hour). If staff move a class, booked members get a fresh window of at least 24 hours.
7. **Late cancel is its own status** (`late_cancelled`) rather than `no_show`. It still counts as a no-show for reporting, but the place is released to the waitlist and the gym can tell the two apart.
8. **Billing mirrors Stripe, never leads it.** Webhooks write `subscriptions` and `class_packs`; the redirect after Checkout grants nothing. The 7-day grace runs from the first failed payment (`payment_failed_at`), not from each retry, and a past-due member can only book classes that start before `grace_until`. Pass beats pack; packs spend the soonest-expiring first. Late cancels and no-shows keep the pack credit; free cancels and gym cancellations return it.
9. **Times are `timestamptz`; each location stores an IANA zone.** "This week" is computed in the location's zone, so a member travelling abroad still sees the gym's Monday and the gym's clock. Money is integer minor units plus currency.

**API**

10. Book and join-waitlist are one endpoint; the server decides under the lock and says which happened. All writes take an `Idempotency-Key`, and the underlying operations are also naturally idempotent. Errors are RFC 9457 problem+json with a stable `code`. Another gym's resources return 404, never 403. The phone clock is never trusted: the schedule returns `server_time`.

**Screen**

11. Mobile shows a 7-day strip with dots for your bookings (green) and waitlist spots (indigo), then one day of cards. Desktop shows the full week as seven columns. Today is marked; past classes fade.
12. Every value on a card comes from a column or a simple computation: time range and duration (`starts_at`, `ends_at` in the location zone), class type, level, instructor first name, places left (`capacity - booked_count`), waitlist size and your position, your booking status, the free-cancel deadline. Nothing else (no ratings, no photos, no "popular" tags) because the model does not store it.
13. The late state warns on the card before the tap ("Free cancellation ended today 06:30. Cancelling now counts as a no-show.") and again in the confirm dialog, whose destructive button reads "Cancel anyway". The past-due state uses one banner with the exact pause time and an "Update card" action (Stripe Billing Portal); classes after the grace period show a disabled Book button.
14. Status is never colour alone: every state has a text label. Buttons are at least 44px tall on mobile. Light and dark come from `prefers-color-scheme` with one token set.

## Known gaps (chosen, not missed)

- No pg_cron wiring shown; `mark_no_shows()` and the idempotency purge need scheduling.
- The notification outbox for promotions is described, not modelled.
- A member can book two overlapping classes at different walls. Probably fine (parents booking for kids is a later feature), but worth a product call.
- Location picker and week navigation are drawn but not wired in the prototype.

## Test before launch

**Concurrency (run against real Postgres, not mocks)**
- 50 parallel `book_class` calls on a class with 1 place: exactly 1 booked, 49 waitlisted, `booked_count = 1`.
- Cancel and book on the same full class at the same moment, 1,000 times: never more booked than capacity; waitlist order respected.
- Two parallel cancels of the same booking: one promotion only.
- Raise capacity by 2 with 5 waiting: the first 2 by `waitlisted_at` are promoted, positions of the other 3 become 1 to 3.
- Same `Idempotency-Key` sent twice in parallel: one booking, second request gets 409 `request_in_progress` or the replay.

**Rules**
- Cancel at deadline minus 1 second (free) and plus 1 second (late), using `server_time`, not the device clock.
- Promotion inside the 12-hour window gives a 1-hour free window; promotion after the class starts never happens.
- A member with an exhausted pack on the waitlist is skipped (`waitlist_lapsed`) and the next person is promoted.
- Past-due: booking a class before `grace_until` works, after it returns 402; a successful retry payment clears grace immediately.

**Isolation**
- With a staff token for gym A, try every endpoint and every table through PostgREST with gym B ids: all 404 or empty. Include a person who is staff at A and member at B.
- Call every `private.*` function as `authenticated`: permission denied.
- Grep the shipped app bundle for `sk_live`, `sk_test`, `service_role` and the webhook secret.

**Stripe**
- Replay every webhook twice and out of order (`invoice.paid` before `invoice.payment_failed`): final state matches Stripe.
- Test clocks: a failed renewal, 7 days pass, access ends; card updated on day 5, access continues.

**Time zones**
- A class at 01:30 on the night the clocks change (25 Oct 2026 in the UK) shows the right local time and stays in the right week.
- Device set to New York: the schedule still shows Leeds times and Leeds days.

**Screen**
- Each `?state=` at 390 and 1440, light and dark; axe-core run with zero violations; VoiceOver pass on the day strip, booking and the cancel dialog; 200% text zoom on mobile without clipped buttons.
