# Data shapes the UI

A screen cannot be more truthful than the data behind it. Every state a panel can be in, every number on it, every label and every disabled button is either something the schema stores and the API sends, or something the front end is guessing. This chapter is the contract between the two: which column or response field produces each thing a screen shows. Facts come from `kb/research/data/07-data-shapes-the-ui.md` (claim ids D1 to D37, checked 2026-10-13). Opinion is marked "Opinion".

Who reads this: design-director and design-playbook-dashboard (or -mobile) before drawing any screen over real data, and the tester when it ticks every number and state against its source.

## Floor: fundamentals and standards

### Fundamentals (non-negotiable)
1. **Nothing on screen the data cannot supply.** Every number, label, badge and state traces to a column or a named query. If the schema cannot produce "Paid 3 days early", the screen does not show it. [judged]
2. **Each UI state is a distinct data condition the client can read.** Loading, empty, no results, zero, unknown, not permitted, stale, partial, error and source stopped each have their own signal (table below). Zero is `0`; unknown is `null` plus a reason; never one value for both. [judged]
3. **Instants travel as instants, plus the zone they are shown in.** `timestamptz` in the database, ISO 8601 with `Z` in the API, the venue or viewer IANA zone as its own field, formatted once at the edge with `Intl` in the page's locale (FOUNDATIONS content mechanics). Calendar dates (`date`) travel as `"2026-10-09"` and are never parsed as instants. [judged]
4. **Money travels as an integer in minor units plus its currency**, and is formatted once with `Intl.NumberFormat`. Amounts in different currencies are never added. [judged]
5. **Related numbers are computed in one place and shipped together.** A KPI, its breakdown, its delta and the sentence that quotes them come from one query or one snapshot (`as_of`), never re-added in the client from the rows it happens to hold. On the page they carry the director's state truth contract (`data-sum-of`, `data-derived-from`). [lint] `truth` when the attributes are present; [judged] that they are present.
6. **The list UI shows only what its pagination supports.** Keyset lists show "Load more" or next and previous, never "Page 7 of 20". An exact total appears only when it is cheap and exact, else it is labelled ("50+", "about 12,400"). [judged]
7. **Anything the UI may retry or show optimistically is safe to repeat:** an `Idempotency-Key` per user intent, and a client-generatable id for creates. [judged]
8. **The response says what the viewer may do.** Actions carry capability flags with a reason; the UI never infers permission from a role name. Enforcement stays in RLS or the server (reference 06). [judged]
9. **Field failures come back as problem+json** (RFC 9457) with a JSON Pointer to the field and a stable code the form maps to its message; named database constraints map to those codes. [judged]
10. **Images are stored with width, height and alt text**, and render with `width` and `height` attributes so layout never shifts. Alt text missing fails axe in `tools/lint.mjs` (FOUNDATIONS row 1). [lint] alt; [judged] dimensions.

### Standards
| Standard | What it fixes in the data contract |
|---|---|
| PostgreSQL `timestamptz` (stored as UTC, input zone not kept, D1) | The zone must be its own column |
| ECMA-402 `Intl` (DateTimeFormat, NumberFormat, RelativeTimeFormat; Baseline, D4, D5, D7) | Format at the edge from raw values |
| RFC 9457 Problem Details (D23) | Machine-readable field errors |
| RFC 9110 conditional requests (ETag, If-Match, 412, 304; D17, D18), RFC 6585 428 (D19) | Freshness and lost-update protection |
| Google AIP-158 (D11) | Opaque cursors; totals optional and may be estimates |
| RFC 9562 (D16) | UUIDv7 embeds creation time; v4 where the id plays a security role |
| WCAG 2.2: 1.1.1 alt text (D27); 4.1.3 status messages; 2.2.1 timing for undo | Alt stored with the image; state changes announced; undo windows long enough |
| web.dev CLS 0.1 or less at p75 (D25) | Dimensions stored with every image |

## Principles
1. **States are data, not decoration.** If a designer can draw a state the API cannot signal, the state will be faked with a guess (a spinner that never ends, a 0 that means "we don't know").
2. **One computation, many renderings.** Totals, deltas, "places left", "overdue" and positions are computed once, where the data and its locks live, and rendered many times.
3. **Raw out, formatted at the edge.** The API sends values (instants, minor units, counts, codes); the edge turns them into words in the viewer's locale.
4. **The server knows the clock, the zone and the permissions.** The client knows the viewer's locale. Each side decides only what it knows.

## The state matrix: UI state to data condition
| UI state | Data condition | Field or signal that tells it apart | Screen shows | Never |
|---|---|---|---|---|
| Loading (first) | No response and no cache for this query | Client request in flight; no field | Skeleton in the final geometry (design-product-ui 05) | "No results" |
| Refreshing | Cached data on screen, request in flight | Client state; `aria-busy` on the panel | Old data plus "Updating..." in the header | A second skeleton |
| Empty, first use | Scope has never had a row | `summary.has_any: false` (or `total_ever = 0`), no filters echoed | What will appear here, one action, optional labelled sample data | A zero KPI row |
| No results | Rows exist, none match | `data: []` with `filters` echoed back non-empty | "No invoices match Overdue + Northwind" and Clear filters | First-use copy |
| Zero | The computed value is truly 0 | `overdue_count: 0` (number, not null) | "0" or "None overdue" | A dash |
| Unknown | The value cannot be computed yet or is not tracked | `null` plus `reason`: `not_enough_data`, `not_tracked`, `source_unavailable`, and `available_after` when known | Muted dash, sr-only "No value", and when it will exist | 0 |
| Not permitted | Viewer lacks the right | Whole resource: 403 problem+json (or 404 for another tenant's object). Action: `can.void = { allowed: false, reason: "role", who: "Owner or Admin" }` | Frame plus who can grant access; action disabled with visible reason | A silently missing section |
| Stale | Data older than its freshness budget | `as_of` (server time) on the payload, `updated_at` per row, `ETag`; compared with server time from the `Date` header | "Updated 12 min ago" with a warning icon and Refresh past the threshold | Client fetch time as "Updated" |
| Partial | Part of the payload failed | `partial: true` and `errors[]` naming the missing part, or one panel's request failed | That panel's body: icon, cause, Retry; rest stays live | A page-level error |
| Error | The request failed | Network failure or 5xx with problem+json `type` | Last good data kept with an error line, or the error state with Retry | A blank screen |
| Source stopped | An upstream feed stopped sending | `sources.payments = { status: "stopped", last_event_at, reason }` | Alert naming the source and the time; numbers fed by it frozen (`data-source`, `data-source-stopped`) | Numbers still ticking |

Stale and source stopped differ: stale means we have not fetched lately; stopped means the upstream has not sent since `last_event_at`. A fresh fetch of a stopped source is still stopped.

## Decision rules

### Time
- **Past and system instants** (`created_at`, `paid_at`, `sent_at`): `timestamptz`; API sends `"2026-10-13T14:02:11Z"`; the edge formats with `timeZone` set to the zone the screen is about.
- **Which zone?** A screen about a place (a venue, a store, a class) uses the place's zone and says so once ("times in ET"); a screen about the viewer's own activity uses the viewer's zone. Store both as IANA names (`America/Toronto`), never offsets or abbreviations (offsets do not carry daylight rules; Postgres docs, D2).
- **Future events at a place** (a class next month, an opening): store the local wall time and the zone as the truth (`starts_local timestamp`, `time_zone text`), plus a derived `starts_at timestamptz` you recompute when tz data changes. Opinion, from D3: IANA tz 2026e (2026-09-29) moved Manitoba to permanent UTC-05 on 2026-10-31, so a Winnipeg event stored only as an instant under the old rule now shows an hour off.
- **Calendar dates** (due dates, birthdays): `date`, sent as `"2026-10-09"`, formatted with `timeZone: 'UTC'` or from its parts. `new Date("2026-10-09")` is UTC midnight and prints "Thu, Oct 8" in Toronto (measured, D36, D37).
- **"Overdue", "today", "this week"** depend on a zone: compute them on the server in the org's zone and send the boolean or the boundaries (`is_overdue: true`, `period: { start, end, time_zone }`).
- **Relative time** ("12 min ago") from server time, not the device clock: compute the offset from the response `Date` header once. Opinion: "Updated just now" under 60 s, minutes under 1 h, then hours, then an absolute date after 7 days; money and deadlines are always absolute (FOUNDATIONS).

### Money
- Column `amount_minor bigint` plus `currency text` (lowercase ISO 4217, as Stripe). The API sends both; the edge divides by the exponent of **the system the integer came from** and formats with `Intl.NumberFormat(lang, { style: 'currency', currency })`.
- Exponents are not always ISO's: Stripe sends ISK and UGX as two-decimal values that always end in 00, while ISO 4217 and `Intl` treat them as zero-decimal (D8). Converting a Stripe ISK amount with the ISO exponent shows 100 times the price. Keep a per-provider exponent table, or store `amount_exponent` with the amount.
- Totals are per currency: `[{ currency: "usd", amount_minor: 482500 }, { currency: "cad", amount_minor: 90000 }]`. A combined figure needs a stated rate and date, computed on the server, and labelled as converted.
- Precision: a table column keeps one precision ("$1,250.00" next to "$75.50"; design-product-ui fundamental 2). Running copy and KPIs follow FOUNDATIONS ("$1,250"): `trailingZeroDisplay: 'stripIfInteger'` (D7, D37).

### Lists and counts
| Need on screen | Pagination | What the API returns |
|---|---|---|
| Feed, activity, inbox, anything that grows | Keyset (cursor) | `data`, `has_more`, `next_cursor` |
| "Load more" with "Showing 50" | Keyset | Same; the UI counts what it has |
| "50+ invoices" | Keyset, fetch `limit + 1` | `has_more` is the extra row; no count query |
| An exact total on a big table | A maintained counter (trigger or summary table) or an estimate | `total: 12408` or `total_estimate: 12400` with `total_is_estimate: true` |
| "Page 7 of 20", jump to page | Offset, only for small admin tables (under about 10,000 rows, opinion, reference 02) | `total`, `page`, `page_size` |

Exact `count(*)` checks every row's visibility (D12); Stripe's own search total is opt-in and "only accurate up to 10,000" (D10); AIP-158 lets totals be estimates if documented (D11).

### Derived numbers
- Compute every total, share and delta in one SQL statement (or one view) in the same transaction as the page of rows, and stamp it with `as_of`.
- Never compute a total from the rows on screen unless the screen holds the whole set; a paginated table's total comes from the server's `summary`.
- On the page: a total of shown parts carries `data-sum-of="#a, #b"`; a delta or a sentence carries `data-derived-from="pct-change #now #prev"`; an open-window count carries `data-monotonic="up"`; numbers fed by a source carry `data-source="payments"`; empty and setup states carry `data-data="none"` (design-director section 4; `tools/lint-truth.mjs`).

### Writes the UI shows before the server confirms
- Optimistic only for high-success reversible actions (design-ux 04): rename, archive, reorder, mark read. Never payments or sends to others.
- The client generates the id for a create (`crypto.randomUUID()`, Baseline since 2022, D15) so the optimistic row and the saved row are the same row, with no temporary id to swap. The server accepts a client id only for creates, checks it is a UUID, and relies on the primary key for uniqueness.
- One `Idempotency-Key` per user intent, reused on retries, new for a new intent (Stripe, D14); no personal data in the key.
- Failure reverts visibly, in place, with the reason and Retry.

### Capability flags
Send what the viewer may do with each object, computed by the same function the policy uses:
```json
"can": {
  "send_reminder": { "allowed": true },
  "edit": { "allowed": false, "reason": "status_open", "message_key": "invoice.edit.locked_after_send" },
  "void": { "allowed": false, "reason": "role", "who": "Owner or Admin" }
}
```
The UI disables with the visible reason, or hides only when the action's existence is sensitive (design-product-ui 05). The flag is a hint; RLS or the server check still enforces (reference 06).

### Computed values that race
- **"Places left", "12 left", seats.** Compute `capacity - taken` at read time and send it with `as_of`; treat it as advisory. The commit is the truth: the write locks the parent row (`select ... for update`), recounts and inserts in one transaction (references 01 and 03); if nothing is left it returns 409 problem+json (`type: .../sold-out`, `remaining: 0`) and the UI replaces the number. Opinion: below about 5 left, say "Last few" or show the number only with its `as_of`, because two tabs can both read "1 left".
- **Waitlist position.** Never store the position; store `joined_at` and `id` and compute the rank at read (`count(*)` of earlier waiting rows by `(joined_at, id)`). A stored position goes stale every time someone ahead leaves. Show "You're 3rd in line" with when it was checked. Promotion runs in one transaction that locks the parent and takes the first waiting row by `(joined_at, id)`; a worker draining many queues may use `for update skip locked`, which is meant for queue-like tables (D24).
- **Counts that cannot fall** (sign-ups this week) come from append-only events and carry `data-monotonic="up"`.

### Freshness
- Every row has `updated_at` (trigger-maintained); every payload has `as_of` from the server clock. Note `now()` is the transaction start (D20): rows written in one transaction share it, so sort ties break by `id`.
- Reads send `ETag`; the client revalidates with `If-None-Match` and gets 304 when nothing changed (D18).
- Edits send `If-Match` with the ETag (or a `version` column); a changed row returns 412 and the form says "Priya changed this invoice at 2:41 pm. Review her changes" instead of overwriting (D17). Require it with 428 on resources people edit together (D19).

### Undo window versus soft delete
| Need | Data pattern |
|---|---|
| "Archived. Undo" for 5 s or more (design-ux) | Commit at once and keep the inverse operation; Undo calls it. Or delay the commit in a job queue for sends ("Undo send") |
| A Trash people restore from for 30 days | `deleted_at`, partial unique indexes, every policy filters it, a purge job (reference 03) |
| Neither | Hard delete plus a `deleted_records` archive (reference 03) |
An undo window is UI time; a trash is a retention policy. Do not build `deleted_at` everywhere to get a 5 second toast.

### Images
Store per image: `storage_path`, `width`, `height`, `alt` (empty string for decorative, never null by accident), `focal_x` and `focal_y` (0 to 1), `placeholder` (dominant color hex or a tiny blurred preview), `content_type`, `bytes`. Read dimensions on upload, not from the client. The edge renders:
```html
<img src="..." width="1600" height="900" alt="Kiln at 1,240 °C, door open"
     style="object-position: 62% 30%" loading="lazy">
```
```css
.media { background: var(--color-surface-sunken); border-radius: var(--radius-md); object-fit: cover; }
```
The `width`, `height` and `object-position` values come from the row (data, not design values); `object-position` turns the stored focal point into the crop (D26).

### Slugs and stable URLs
- The id is the identity; the slug is decoration: `/posts/0199d3a2-7c1e/how-we-fire` or `/posts/how-we-fire-7c1e`. Resolve by id, 301 to the current slug when it differs (design-search: one hop, stable URLs).
- If the slug is the whole key (public marketing pages), keep `slug_redirects` so every old slug 301s (reference 03).

### Activity feeds
Build the feed as a read model over `audit_events` (reference 03): store `action`, `actor_id`, `target_type`, `target_id`, `metadata` (the parameters), never a finished sentence. Render the sentence at the edge from a message key, so locale, renamed projects and deleted people ("Former member") render correctly. Filter by what the viewer may see now (RLS on the view with `security_invoker = true`).

### Field errors
Name every constraint and map it to a pointer and a code:
| Constraint | Postgres code (D21) | API (RFC 9457) | Form shows (design-copy writes it) |
|---|---|---|---|
| `invoices_number_unique` | 23505 | 409, `pointer: "#/number"`, `code: "taken"` | "INV-0142 is already used. Try INV-0143." |
| `invoices_due_after_issue` | 23514 | 422, `pointer: "#/due_on"`, `code: "before_issue_date"` | "Due date must be on or after the issue date." |
| `invoices_client_fk` | 23503 | 422, `pointer: "#/client_id"`, `code: "not_found"` | "Choose a client from the list." |
Supabase's Data API (PostgREST) returns 409 for 23505 and 23503 with the code and message (D22); a server layer translates those into this shape. The form maps `code`, never parses `detail` (RFC 9457, D23).

## Numbers
| Thing | Value | Source |
|---|---|---|
| Good CLS | 0.1 or less at p75 | web.dev (D25) |
| Page size | default 20 to 50, max 100, clamp above | Stripe 10 and 100 (D9); band is opinion |
| "N+" counts | fetch `limit + 1` | opinion |
| Exact total ceiling at Stripe search | accurate to 10,000, opt-in | Stripe (D10) |
| Idempotency key retention | at least 24 h | Stripe (D14) |
| Undo toast | at least 5 s, pauses on hover and focus | design-ux (opinion on length; WCAG 2.2.1) |
| Stale threshold | operational 5 to 15 min; analytical 24 h | design-product-ui 06 (opinion) |
| "Updated just now" | under 60 s | opinion |
| Relative to absolute | after 7 days; money and deadlines always absolute | opinion; FOUNDATIONS |
| Focal point | `focal_x`, `focal_y` in 0 to 1, default 0.5 | opinion; `object-position` default `50% 50%` (D26) |
| UUIDv7 timestamp | 48-bit, millisecond | RFC 9562 (D16) |
| Page token expiry | about 3 days | AIP-158 (D11) |

## Exemplar patterns (from published API contracts)
- **Stripe lists have no total.** `{ object: "list", data, has_more, url }`, limit default 10, max 100 (D9); the search total is opt-in and capped at 10,000 (D10). Screens built on it say "Load more", not "Page 7 of 20".
- **Stripe money is integers plus a lowercase currency**, with documented exponent exceptions (D8).
- **Stripe idempotency keys** are client-generated per intent, 24 h retention, mismatch errors (D14).
- **Stripe Entitlements** are capability flags at the billing layer: features listed per customer, a webhook on change, and a list API to reconcile (D28). Gate features on entitlements, not on plan names.
- **Google AIP-158**: totals optional and may be estimates; opaque cursors that never authorize (D11).

## Expert moves
1. **Echo the query.** The response repeats the filters, sort, period and time zone it used. Empty versus no results, and "this week" boundaries, stop being guesses.
2. **Ship the summary with the page.** One request returns rows plus `summary` from the same snapshot and `as_of`; the KPI and the table cannot disagree after a refresh.
3. **Capabilities with reasons, from the policy function.** `can.void.reason = "role"` plus `who` lets the UI say "Only Owners or Admins can void invoices"; one function feeds both RLS and the flag, so they cannot drift.
4. **Future events are wall-clock promises.** Local time plus zone is the truth; the instant is derived (tz 2026e, D3). Opinion.
5. **The provider owns the exponent.** ISK at Stripe is 100 times its ISO value (D8); keep the exponent with the integer.
6. **"50+" is the honest cheap count.** Fetch one extra row; skip `count(*)`.
7. **Freshness from the server clock.** `as_of` plus the `Date` header; a phone with a wrong clock never says "Updated in 3 minutes".
8. **Lost updates become a conversation.** ETag plus `If-Match`, 412 names who changed what, the form shows both versions.
9. **Client ids end the temp-id dance.** `crypto.randomUUID()` for creates; the optimistic row is the real row.
10. **Positions and "left" are computed, never stored.** Store the order key; compute rank and remainder at read; let the locked write be the truth.
11. **Sentences are rendered, not stored.** Activity rows store parameters and a message key.
12. **Dimensions are data.** Width, height, focal point and placeholder captured on upload; CLS is solved in the schema, not in CSS.
13. **A stopped source is its own state.** `sources.x.last_event_at` lets the UI freeze those numbers and say since when, separately from staleness.
14. **Date-only values never meet `new Date()`.** Format with `timeZone: 'UTC'` or from parts (D36, D37).

## Do and don't
| Do | Don't |
|---|---|
| `"due_on": "2026-10-09"`, formatted with `timeZone: 'UTC'` | `new Date("2026-10-09")` shown in Toronto as "Thu, Oct 8" |
| `"amount_minor": 125000, "currency": "usd"` | `"amount": "$1,250.00"` |
| Two outstanding totals, USD and CAD | One "$5,725" made by adding them |
| `"overdue_count": 0` and `"avg_days_to_pay": null, "reason": "not_enough_data"` | `0` for both |
| `has_more` and "Load more" | "Page 7 of 20" over a cursor |
| `can.void.allowed: false` with `who` | `if (user.role !== 'admin')` in the component |
| `rank()` at read for waitlist position | `waitlist.position` column |
| 412 on a stale edit, with who changed it | Last write wins silently |
| `width`, `height`, `alt`, `focal_x`, `focal_y` on the image row | An image URL alone |

## Worked example 1: the invoices screen
Brief: a small studio's billing tool (fictional "Quill", for "Harbor Studio", en-US, org zone `America/Toronto`). The screen lists invoices with an outstanding summary, overdue flags, a payments feed from Stripe, and actions per role.

Schema (excerpt; full patterns in references 01 to 03):
```sql
create table invoices (
  id uuid primary key default uuidv7(),          -- the client may send a v4 for optimistic create
  org_id uuid not null references orgs(id) on delete restrict,
  client_id uuid not null,
  number text not null,
  status text not null default 'draft'
    check (status in ('draft','open','paid','void','uncollectible')),
  currency text not null check (currency ~ '^[a-z]{3}$'),
  total_minor bigint not null check (total_minor >= 0),
  amount_paid_minor bigint not null default 0 check (amount_paid_minor >= 0),
  issued_on date,
  due_on date,
  sent_at timestamptz,
  paid_at timestamptz,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint invoices_client_fk foreign key (client_id, org_id) references clients (id, org_id), -- clients has unique (id, org_id)
  constraint invoices_number_unique unique (org_id, number),
  constraint invoices_due_after_issue check (due_on is null or issued_on is null or due_on >= issued_on),
  constraint invoices_paid_has_time check (status <> 'paid' or paid_at is not null)
);
create index on invoices (org_id, status, due_on);          -- outstanding and overdue
create index on invoices (org_id, created_at desc, id desc); -- keyset list
create index on invoices (client_id, org_id);                -- FK index
```
`is_overdue` and the summary are computed in one view, in the org's zone:
```sql
-- status = 'open' and due_on < (now() at time zone o.time_zone)::date
```

Rows (three of the 8 outstanding invoices; weekdays checked against 2026):
| number | status | currency | total_minor | due_on | is_overdue |
|---|---|---|---|---|---|
| INV-0142 | open | usd | 125000 | 2026-10-09 (Fri) | true |
| INV-0147 | open | usd | 87500 | 2026-10-30 (Fri) | false |
| INV-0149 | open | cad | 90000 | 2026-11-02 (Mon) | false |

Response to `GET /v1/invoices?status=outstanding&limit=50` (one of the 8 rows shown; the other 7 are omitted here, so `has_more` is false because all 8 fit in one page):
```json
{
  "data": [
    {
      "id": "0199d3a2-7c1e-7b55-9a40-2f6c1d0e8a11",
      "number": "INV-0142",
      "client": { "id": "0199c0f4-...", "name": "Northwind Press" },
      "status": "open",
      "is_overdue": true,
      "currency": "usd",
      "total_minor": 125000,
      "amount_due_minor": 125000,
      "due_on": "2026-10-09",
      "sent_at": "2026-09-25T15:04:00Z",
      "updated_at": "2026-10-13T14:02:11Z",
      "can": {
        "send_reminder": { "allowed": true },
        "edit": { "allowed": false, "reason": "status_open" },
        "void": { "allowed": false, "reason": "role", "who": "Owner or Admin" }
      }
    }
  ],
  "has_more": false,
  "next_cursor": null,
  "filters": { "status": "outstanding" },
  "summary": {
    "as_of": "2026-10-13T14:05:00Z",
    "has_any": true,
    "outstanding": [
      { "currency": "usd", "amount_minor": 482500, "count": 7, "overdue_count": 2 },
      { "currency": "cad", "amount_minor": 90000, "count": 1, "overdue_count": 0 }
    ],
    "avg_days_to_pay": { "value": null, "reason": "not_enough_data", "available_after_paid_count": 5 }
  },
  "sources": {
    "payments": { "status": "stopped", "last_event_at": "2026-10-13T11:40:00Z", "reason": "webhook_failing" }
  },
  "time_zone": "America/Toronto"
}
```
Screen, state by state (each reachable by `?state=` per design-director):
| State | What the data says | What the screen shows |
|---|---|---|
| Ready | as above | "Outstanding $4,825 · 7 invoices, 2 overdue" and "CA$900 · 1 invoice" as two lines, never summed; INV-0142 row "Due Fri, Oct 9" with an overdue badge (icon plus text) |
| Unknown | `avg_days_to_pay.value: null`, `not_enough_data` | "Avg. days to pay" with a muted dash, sr-only "No value yet", hint "Shows after 5 paid invoices" |
| Zero | CAD `overdue_count: 0` | "None overdue" |
| Not permitted | `can.void.allowed: false`, `who` | Void item disabled, visible line "Only an Owner or Admin can void invoices" |
| Source stopped | `sources.payments.status: "stopped"` | Alert: "Stripe payments stopped arriving at 7:40 am ET. Paid status may be behind." Numbers fed by payments stop changing (`data-source="payments"`, alert `data-source-stopped="payments"`) |
| Stale | `as_of` 12 min behind server time | "Updated 12 min ago" with warning icon and Refresh |
| No results | `data: []`, `filters` non-empty | "No outstanding invoices match Northwind Press." Clear filters |
| Empty first use | `has_any: false` | "Invoices you send appear here." Create invoice. No summary numbers (`data-data="none"`) |
| Edit conflict | PATCH with `If-Match` gets 412 | "Priya changed this invoice at 2:41 pm. Review her changes." |
| Field error | 409 `#/number` `taken` | Inline under Number: "INV-0142 is already used. Try INV-0143." |

Truth contract on the page (the USD count line):
```html
<p>USD outstanding:
  <span id="usd-count" data-num data-sum-of="#usd-due, #usd-overdue">7</span> invoices,
  <span id="usd-due" data-num>5</span> not yet due,
  <span id="usd-overdue" data-num>2</span> overdue</p>
```
Reasoning: totals come from `summary`, never from the 3 rows on screen; two currencies stay two lines; "7:40 am ET" is `last_event_at` formatted in the org zone with the house lowercase am/pm (Intl prints "AM", D37); the due date is a `date`, formatted with `timeZone: 'UTC'` so it stays Fri, Oct 9.

## Worked example 2: "12 left" on a limited edition
Brief: a print studio sells 50 numbered copies of a print; the product page shows how many are left; checkout holds a copy for 10 minutes (opinion on the hold length).

Data: `editions(id, capacity int not null check (capacity > 0))`, `holds(id, edition_id, buyer_id, expires_at timestamptz, order_id uuid null)`. "Left" = `capacity - count(holds where order_id is not null or expires_at > now())`, sent as `{ "remaining": 12, "as_of": "..." }`.

Choices:
1. The page shows "12 left" with no promise attached; it refreshes on focus and after any 409.
2. Checkout `POST /v1/editions/{id}/holds` (Idempotency-Key) locks the edition row with `for update`, recounts, inserts the hold or returns 409 `{ "type": ".../sold-out", "remaining": 0 }`. Two buyers cannot both take the last copy.
3. The held copy shows "Held for you until 3:25 pm" from `expires_at` in the viewer's zone, absolute, not a ticking countdown (opinion: a countdown pressures; the absolute time informs).
4. Below 5 left the page says "Last few" plus the number with its `as_of` (opinion).
Reasoning: the read is advisory, the locked write is the truth, and the UI has a designed answer for the moment they disagree.

## Worked example 3: unknown is not zero (a dashboard KPI)
Brief: an analytics tile "Conversion this week" on Monday 9:05 am, with 3 sessions so far.
Choice: the query returns `{ "value": null, "reason": "not_enough_data", "min_sample": 100, "sample": 3 }`; the tile shows a dash and "Shows after 100 sessions". The week boundary comes from the server in the account zone (`period.start`, `period.end`, `time_zone`), so a viewer in another zone sees the same week. A 0.0% would have been a false number on gate item 16.

## Where this domain is usually wrong
- **"Store everything in UTC and you're done."** True for past instants; wrong for future events at a place. tz 2026e moved Manitoba's rule with about a month's notice (D3). Correction: wall time plus zone for future local events; derive the instant.
- **"Divide by 100 to get dollars."** JPY has no minor unit; ISK at Stripe is sent times 100 although ISO says zero decimals (D8). Correction: the exponent of the source system.
- **"Show total pages."** Exact counts cost a full visibility check (D12) and drift; Stripe's own search total stops being accurate past 10,000 (D10). Correction: "Load more", "50+", or a labelled estimate.
- **"Disable the button if the user is not an admin."** Roles drift from policies; custom roles break it. Correction: capability flags from the policy function.
- **"Soft delete gives you undo."** An undo toast is a window of seconds; soft delete is a retention model that leaks into every query (reference 03). Correction: inverse operation or delayed commit for undo; `deleted_at` only for a real trash.
- **"Optimistic UI is just updating the cache."** Without idempotency keys a retried create makes two rows. Correction: client id plus `Idempotency-Key`.
- **"null and 0 are the same on screen."** A 0% conversion and an uncomputable conversion lead to different decisions. Correction: `null` plus reason renders as a dash plus when.
- **"Last updated is when we fetched."** The client clock and the fetch time are not the data's time. Correction: server `as_of` and per-row `updated_at`.
- **"Date strings are dates."** `new Date("2026-10-09")` is an instant at UTC midnight (D36).
- **"Temporal fixes this now."** Not Baseline on 2026-10-13 (D6); use `Intl` and explicit zones today.

## Hand-offs
- **design-product-ui**: the visual state matrix, skeletons, partial failure, permission panels, KPI tiles (`references/05-states-bulk.md`, `06-dashboards.md`). This chapter supplies the data condition for each.
- **design-ux**: forms, error summary and inline errors from the problem+json pointers (`references/03-forms.md`); undo timing and optimistic rules (`references/04-states-feedback.md`).
- **design-copy**: the words for every reason code and error code (`references/02-ux-microcopy.md`); dates and money in copy (`references/06-copy-in-context.md`).
- **design-frontend**: `Intl` formatting, the `Date` header offset, ETag revalidation, image markup and CLS (`references/05-images-fonts.md`).
- **design-search**: slugs, stable URLs and 301s (`references/04-architecture-linking.md`).
- **design-director**: the state truth contract attributes and `?state=` URLs.
- **dataviz**: charts over these numbers; `null` points are gaps, not zeros.
- **design-conversion**: "places left" and scarcity claims must be true at read and enforced at write.
- **website-strategy, sales-funnels**: what the product sells and the funnel steps that create these rows.
