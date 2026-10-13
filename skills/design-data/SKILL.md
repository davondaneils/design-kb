---
name: design-data
description: Domain reference loaded by design-director or a design playbook (mainly design-playbook-dashboard and design-playbook-mobile, also design-playbook-landing for sites with accounts, shops or bookings); do not trigger on its own for a page, screen or brand job. Covers the data layer behind a screen: schema and data modeling (keys, types, constraints, indexes, migrations), common app models (orgs, memberships, roles, Stripe billing and entitlements, files, audit, deletion), platform choice, REST API design (errors, pagination, idempotency, webhooks), auth, Supabase RLS and Firebase rules, privacy and GDPR, and what each data decision lets a screen truthfully show (states, time zones, money, counts, freshness, capability flags). Load it directly only when the user names it or asks a narrow question inside this domain alone (a schema, RLS policy, migration, API, webhook or auth question with no screen to design). Not for layout, visual design or copy (design-product-ui, design-ux, design-copy).
---

# design-data

> **Layer: domain reference.** Loaded after `design-foundations` by `design-director` or a `design-playbook-*` skill whenever a screen is drawn over real data, or directly for a narrow data question. Accessibility floor for anything that reaches a screen: design-foundations `references/accessibility.md`. State visuals: design-product-ui `references/05-states-bulk.md`.

Version 0.2.3. Facts current to **2026-10-13** (every time-sensitive fact rechecked against primary sources that day; dates per fact in `kb/research/data/`). Platform facts move: PostgreSQL 19 is in beta, Supabase legacy keys are deprecated by the end of 2026, the GDPR Digital Omnibus is pending. Before advice that depends on a platform behavior, check the fact's date in `references/` and say how old it is. Review due 2027-01-13.

The bar: a schema, policy set, API and data-to-screen contract that a senior engineer at Stripe or Supabase and a senior product designer at Linear would approve without comments. Correct first, then fast, then pleasant to evolve, and never a screen that shows something the data cannot supply.

## How to use this skill
1. Pass the fundamentals gate below. Report any failure first and fix it first; nothing else earns credit until the gate passes.
2. Apply the decision rules for the task.
3. Add the expert moves that fit.
4. Read the matching reference when the task goes deeper than this page.
5. Deliver in the output format at the end.

## 1. Fundamentals gate (non-negotiable, check first)

Every answer that proposes or reviews a schema, policy, endpoint or a screen over data passes all of these. One miss is a failure, whatever else is good.

**Schema**
1. Every table has a primary key. Join tables use a composite PK or a UNIQUE on the pair.
2. Every relationship is a declared FOREIGN KEY with a deliberate `ON DELETE` (CASCADE for owned children, RESTRICT for records with money or legal weight, SET NULL when the child survives).
3. Every foreign key column has an index. Postgres does not create it for you.
4. Types: `timestamptz` for instants, `date` for calendar dates, `text` (plus CHECK if a limit is a rule), money as integer minor units plus a `currency` column (or `numeric`), never float or the `money` type, never `serial` (use identity or UUID), never `char(n)`.
5. NOT NULL by default; nullable only when "unknown" is a designed state.
6. Uniqueness of natural identifiers (email, slug, handle) enforced by the database, case-folded where humans type it (`unique index on lower(email)`).
7. Business invariants enforced by named constraints (CHECK, UNIQUE, EXCLUDE, FK), not only in app code.

**Access**
8. Authorization lives at the data layer: RLS enabled on every exposed table, grants revoked and granted back per role, one policy per operation (UPDATE has both `using` and `with check`); or a server check that scopes every object lookup by the caller's tenant or user. Logged in is not authorized.
9. No secret, service-role or admin key in client code, public env vars or mobile bundles. Never authorize on user-editable metadata or client-supplied flags.
10. Multi-user business data carries an owner key (`org_id` or `user_id`) on every row, indexed, used by every policy and query.

**Change and API**
11. Schema changes are versioned migration files, run first on a non-production database, and safe under live traffic (no blocking index builds, no table rewrites, no renames under running code). Production has backups and one tested restore.
12. Every list endpoint is paginated with a cap; every create or charge endpoint accepts an `Idempotency-Key`; errors are RFC 9457 problem+json with correct status codes.
13. Personal data is minimized, has an export and a deletion path, and is never logged in plain text with secrets.

**Data to screen** (reference 07)
14. Nothing on screen the data cannot supply: every number, label, badge and state traces to a column or a named query.
15. Each UI state is a distinct data condition the client can read (state matrix below). Zero is `0`; unknown is `null` plus a reason; never one value for both.
16. Instants travel as UTC ISO strings plus the IANA zone the screen is about; calendar dates travel as `"YYYY-MM-DD"` and never pass through `new Date()`; formatting happens once, at the edge, with `Intl` in the page's locale (FOUNDATIONS content mechanics).
17. Money travels as integer minor units plus currency, formatted with `Intl.NumberFormat`; different currencies are never added.
18. Related numbers come from one query or snapshot (`as_of`) and ship together; the page carries the director's state truth contract (`data-sum-of`, `data-derived-from`, `data-source-stopped`, `data-data="none"`). A paginated table's total comes from the server, never from the rows on screen.
19. The list UI shows only what its pagination supports: no "Page 7 of 20" over a cursor; totals exact only when cheap, else "50+" or a labelled estimate.
20. Actions carry capability flags with a reason from the same function the policy uses; the UI never infers permission from a role name.
21. Field failures map from named constraints to problem+json items with a JSON Pointer and a stable code; images are stored with width, height and alt text.

Automated checks: Supabase Advisors (`supabase db advisors`, Studio, MCP `get_advisors`) cover gate items 1, 3, 8 and 9 in part: 0004 no primary key, 0001 unindexed foreign keys, 0013 RLS disabled in public, 0023 sensitive columns exposed, 0008 RLS enabled with no policy, 0015 RLS references user metadata, 0024 permissive RLS policy, 0003 unwrapped `auth.uid()`, 0010 security definer view, 0011 mutable search path, 0028 and 0029 security definer functions callable by `anon` or `authenticated` (ids confirmed 2026-10-13; the list runs 0001 to 0030). Run them against the linked project as well as locally, because production drifts from the migrations; CLI versions from before the fix for supabase/cli issue 5868 (closed 2026-07-16) gave `--local` a false all-clear on the API-exposure lints. On a built page, gate 18 is `[lint]` through `tools/lint.mjs` `truth`; gate 21's alt text is `[lint]` through axe.

## 2. How to work a data request
1. **Restate the domain** in nouns, verbs and invariants ("an invoice belongs to one client; a number is unique per org").
2. **Pick the platform** only if not given (section 5). Default: Postgres.
3. **Draw the model**: tables, keys, cardinality, then columns with types and named constraints. Real SQL DDL, not prose, unless a diagram was asked for.
4. **Write the top queries** the screens need and derive indexes from them.
5. **Write access rules** (grants plus RLS policies, Firebase rules, or server checks) in the same answer as the tables. A table without its policy is half a deliverable.
6. **Write the data-to-screen contract** for every screen in scope: each state's data condition and field, where each number is computed, the response shape (reference 07).
7. **State the expert decisions** in 3 to 6 bullets (ownership, id type, deletion, billing sync, pagination, time zones).
8. **Run the gate** against your own output. Say what you would test (cross-tenant pgTAP test, `explain`, migration on production-sized data, every `?state=` URL).

## 3. Decision rules

### State matrix (reference 07)
| UI state | Data condition and field |
|---|---|
| Loading, refreshing | No response yet; or cached data plus a request in flight (`aria-busy`) |
| Empty, first use | `summary.has_any: false`, no filters echoed |
| No results | `data: []` with the applied `filters` echoed back |
| Zero | the number `0` |
| Unknown | `null` plus `reason` (`not_enough_data`, `not_tracked`, `source_unavailable`) and when it will exist |
| Not permitted | 403 problem+json (404 for another tenant's object); per action `can.x = { allowed: false, reason, who }` |
| Stale | server `as_of` and row `updated_at` older than the budget, measured on server time |
| Partial | `partial: true` with the missing part named, or one panel's request failed |
| Error | network failure or 5xx problem+json; keep last good data |
| Source stopped | `sources.x = { status: "stopped", last_event_at }`; numbers fed by it freeze |

### Time and money
- Past instants: `timestamptz`. Future events at a place: local wall time plus IANA zone as truth, derived `timestamptz` recomputed when tz data changes (opinion; IANA 2026e moved Manitoba to permanent UTC-05 on 2026-10-31).
- "Overdue", "today", "this week": computed on the server in the org or venue zone; the API sends the boolean or the period with its zone.
- Money: `amount_minor` plus `currency`; divide by the exponent of the system the integer came from (Stripe sends ISK and UGX as two-decimal values ending in 00, unlike ISO 4217). Totals per currency.

### Lists
| Screen needs | Use |
|---|---|
| Feed, inbox, growing list | Keyset: `data`, `has_more`, `next_cursor`; "Load more" |
| "50+ invoices" | Keyset with `limit + 1` |
| Exact total on a big table | Maintained counter or a labelled estimate |
| Jump to page 7 | Offset, small admin tables only (under about 10,000 rows, opinion) |
Page size default 20 to 50, max 100, clamped (Stripe 10 and 100; band is opinion).

### Billing access
`active` and `trialing` grant; `past_due` is a grace period you configure; revoke on `unpaid`, `canceled`, `incomplete_expired`; `incomplete` has 23 hours; `paused` means a trial ended without a payment method; `active` does not mean every invoice is paid (Stripe, 2026-10-13). Since API version 2025-03-31.basil the billing period (`current_period_end`) lives on subscription items, not the subscription. Better when plans bundle features: gate on Stripe Entitlements and turn them into capability flags.

### API
Plural nouns, one level of nesting, POST create (201 plus `Location`), PATCH partial update, DELETE 204, 401 unauthenticated, 403 forbidden, 404 for other tenants' objects (common practice, opinion), 409 conflict, 412 failed `If-Match`, 422 validation, 429 with `Retry-After`. Idempotency: same key and payload replays; different payload 422; still running 409 (convention from the IETF draft, which expired 2026-04-18; Stripe practice is the reference). Keep keys at least 24 hours.

## 4. Expert moves (what separates a top practitioner from a strong generalist)

**Modeling**
1. Org-owned data from day one in anything that might have teams; a personal org at signup gives solo and team users one code path (opinion; Makerkit and WorkOS model it this way).
2. Facts of an event live on the event: the price paid lives on the order line, not read back from the product.
3. Duplicate `org_id` onto children for cheap RLS and make the copy impossible to get wrong: `foreign key (project_id, org_id) references projects (id, org_id)` plus `unique (id, org_id)` on the parent.
4. Status as one CHECKed text column plus cross-column CHECKs, never several booleans.
5. "No overlaps" is `EXCLUDE USING gist (room_id with =, tstzrange(starts_at, ends_at) with &&)` (needs `btree_gist`).
6. UUIDv7 keys for public-facing apps (time-ordered, no row-count leak, built into PostgreSQL 18); bigint identity for internal high-volume tables. UUIDv7 reveals creation time to the millisecond, so use UUIDv4 where that is sensitive (RFC 9562: v4 for any security role).
7. Limits that count rows (seats, capacity) are checked after locking a parent row that always exists (`select ... from orgs where id = $1 for update` for seats, the class row for capacity); a bare count is a race, and locking a subscription row fails when the org has none or two.
8. Default to hard delete plus a `deleted_records` jsonb archive; `deleted_at` only for a real trash with partial unique indexes and a purge job (opinion, after Brandur Leach). Uniqueness that must survive a cancel or a delete is a partial unique index (a member who cancelled a booking can book again).
9. Audit log append-only, no foreign keys on purpose, written in the same transaction as the action.
9a. An invariant holds on every write path, not only the one you tested: "taken never exceeds capacity" is guarded when bookings change and when staff lower the capacity, and by a constraint or trigger the service role cannot bypass. The Crux test's skilled schema guarded bookings and let staff set capacity 2 under 5 taken (`kb/tests/design-data.md`).
9b. Time-bounded rights are checked against the time of the thing, not now: a 7-day grace that ends Tuesday cannot book a Thursday class. Same for trial ends, pack expiry, cancellation windows (Crux test).
9c. "One open X per person per tenant" (one active pass, one pending invite) is a partial unique index, and every uniqueness or exclusion rule that spans people is keyed by the tenant too, or its conflict error tells one tenant about another (an instructor-overlap rule keyed on the person told one gym the instructor was busy at another; Crux test).

**Performance**
10. Composite index order: equality columns, then the range or sort column; rarely more than 3.
11. Partial indexes for hot subsets and partial unique indexes for conditional uniqueness (one pending invite per email per org).
12. Keyset pagination with a unique tie-breaker: `where (created_at, id) < ($1, $2) order by created_at desc, id desc`.
13. RLS speed (Supabase measured, 100K rows): index policy columns (171 ms to under 0.1 ms), wrap `(select auth.uid())` (179 to 9), membership in a wrapped security definer function `org_id = any (array(select private.my_org_ids()))` (173,000 to 16), `to authenticated` (anon 170 to under 0.1), and also filter in the client query (171 to 9).

**Safe change**
14. Migration sessions set `lock_timeout = '10s'` and a long `statement_timeout`; `create index concurrently` in its own non-transactional migration file; constraints `not valid` then `validate`; NOT NULL on PostgreSQL 18 is `add constraint x_nn not null col not valid` then `validate constraint x_nn` (older versions: a validated CHECK, then `set not null`); renames and type changes by expand and contract.

**Billing**
15. Stripe is the source of truth; one `syncStripe(customerId)` re-fetches state from every relevant webhook and the success page. Never apply payloads as deltas. Dedupe on event id in the same transaction as the effect (recording the id first and working after the commit loses the event on a crash), and make the business effect idempotent (`unique (org_id, stripe_invoice_id)` on credit grants).

**Security and privacy**
16. Two-user, two-org cross-tenant tests as pgTAP files run by `supabase test db`; a read test checks rows, because `lives_ok` passes on an empty result, and an allowed write is proved by reading the row back (`lives_ok` also passes when the write matched zero rows).
17. Security definer helpers in an unexposed `private` schema with `set search_path = ''`, `grant usage on schema private to authenticated`, execute revoked from `anon`; they skip RLS only because their owner can.
18. Files: private bucket, path prefixed by the owner key, storage policies mirroring the tables, signed URLs, a job that deletes objects when rows go.
19. Roles in `app_metadata` ride in the JWT, which is stale until it refreshes (Supabase RLS docs); removing a member or demoting an owner takes effect at once only when policies read your tables.

**Data to screen** (reference 07)
20. **Echo the query.** The response repeats filters, sort, period and zone, so empty versus no results is never a guess.
21. **Ship the summary with the page**, same snapshot, stamped `as_of`; KPI and table cannot disagree.
22. **Capabilities with reasons** (`can.void = { allowed: false, reason: "role", who: "Owner or Admin" }`) from the policy function; the UI says who can change it.
23. **"50+" is the honest cheap count**: fetch one extra row. Stripe's own search total is opt-in and accurate only to 10,000.
24. **Freshness from the server clock**: `as_of` plus the `Date` header, never the device clock or the fetch time.
25. **Lost updates become a conversation**: `ETag` plus `If-Match`, 412 names who changed what; 428 where people edit together.
26. **Client ids end the temp-id dance**: `crypto.randomUUID()` for optimistic creates plus one `Idempotency-Key` per intent.
27. **Positions and "places left" are computed, never stored**: store the order key, compute rank and remainder at read, let the locked write be the truth and return 409 with `remaining: 0`.
28. **Sentences are rendered, not stored**: activity rows keep action, actor, target and parameters; the edge renders them in the locale.
29. **Dimensions are data**: width, height, alt, focal point and placeholder captured on upload; CLS is solved in the schema.
30. **Date-only values never meet `new Date()`**: `new Date("2026-10-09")` prints "Thu, Oct 8" in Toronto (measured); format with `timeZone: 'UTC'`.
31. **A sortable header is an index**: on a big list only columns an index serves in keyset order `(filters, column, id)` sort; the API allowlists them and a sort change drops the cursor.
32. **Manual order is a fraction**: drag to reorder writes one order key between the neighbours (Figma fractional indexing); string keys, because a float key runs out after 52 drops between 1 and 2 (measured).

## 5. Platform decision (short form)
| If | Then |
|---|---|
| Users, teams, orders, permissions (most apps) | Postgres. Supabase for auth, storage, realtime and an auto API together; any Postgres host otherwise |
| One server, one writer, under about 100K hits/day | SQLite (WAL, continuous backup) |
| Offline-first mobile with per-user document trees | Firestore or a local-first sync engine; accept denormalization and 1 MiB documents |
| Live collaborative payload | Postgres for accounts and permissions, CRDT or a reactive store for the live document |

Before committing: backups and a tested restore, region next to your functions, a pooler for serverless, free-tier pausing (Supabase Free pauses after 1 week inactive and has no automatic backups), and the exit path. PostgreSQL 18 is current (18.6, 2026-08-13; 19 in beta; 14 end of life 2026-11-12); on older Postgres swap `uuidv7()` for `gen_random_uuid()`. Supabase keys: `sb_publishable_` in clients, `sb_secret_` only on servers, both on the `apikey` header; legacy `anon` and `service_role` deprecated by the end of 2026, working until you deactivate them. Details: `references/04-platform-choice.md`.

## 6. Output format (deliverable)
For a new model, in this order:
1. One paragraph: the model and the ownership decision (user-owned or org-owned) and why.
2. SQL DDL: tables, named constraints, indexes (each index commented with the query it serves).
3. Access: grants and RLS policies (or Firebase rules, or server checks) for every table, plus the cross-tenant test.
4. Key queries (2 to 5), including the paginated list and every summary a screen shows.
5. API surface: method, path, status codes, one example response with `data`, pagination, `summary` and `as_of`, `can` flags, and one problem+json error.
6. **Data-to-screen contract** for each screen in scope:

| UI state or element | Data condition | Field or query | Format at the edge |
|---|---|---|---|
| e.g. Overdue badge | `status = 'open'` and due date before today in the org zone | `is_overdue` (server) | icon plus "Overdue" |
| e.g. Outstanding total | sum of open `amount_due_minor` per currency | `summary.outstanding[]` | `Intl.NumberFormat(lang, { style: 'currency', currency })` |

7. Decisions and trade-offs (3 to 6 bullets), then "Test before launch" (cross-tenant test, migration plan, restore test, every `?state=` URL).

For a review: gate misses first (numbered, with the fix as code), then expert-level improvements, then optional polish. Keep prose short, show code, use real numbers, mark opinion as opinion.

## 7. Reference map
| Task | Read |
|---|---|
| Tables, types, keys, constraints, jsonb, naming, worked booking schema | `references/01-schema-fundamentals.md` |
| Indexes, query shapes, pagination SQL, counts, safe migration recipes | `references/02-indexes-and-migrations.md` |
| Profiles, orgs, memberships, invitations, Stripe billing and entitlements, content, files, audit, deletion | `references/03-app-data-models.md` |
| Postgres vs SQLite vs Firestore vs Convex, hosting checks, Supabase keys | `references/04-platform-choice.md` |
| REST conventions, status codes, problem+json, pagination, idempotency, conditional requests, webhooks | `references/05-api-design.md` |
| Auth rules, grants and RLS policy set, performance, Advisors, pgTAP tests, Firebase rules, privacy and GDPR | `references/06-auth-rls-privacy.md` |
| What a screen can truthfully show: state matrix, time zones, money, counts, totals, optimistic writes, capability flags, races, freshness, undo, images, slugs, activity, field errors; worked invoices screen | `references/07-data-shapes-the-ui.md` |
| Sources and the date each fact was checked | `kb/research/data/01` to `07` |

## 8. Hand-offs
- **design-product-ui**: state visuals (skeletons, partial failure, permission panels), tables, KPI tiles, settings save models. This skill supplies each state's data condition.
- **design-ux**: forms, error summary and inline errors from the problem+json pointers, undo timing, optimistic rules, account deletion flow.
- **design-frontend**: `Intl` formatting, ETag revalidation, client caching, image markup and CLS, where queries run.
- **design-copy**: words for every reason and error code, dates and money in running copy.
- **design-search**: slugs, stable URLs and 301s, full-text search UX, what app pages keep out of search.
- **design-conversion**: pricing, plans, upgrade prompts and scarcity claims; "places left" must be true at read and enforced at write.
- **dataviz**: charts over these numbers; `null` points are gaps, not zeros.
- **website-strategy**: what the product is and who it serves. **sales-funnels**: checkout and upsell flow. **copywriting**: paywall and plan copy on sales pages.
- **design-director**: the state truth contract attributes and `?state=` URLs on every built screen.
- Stored UI preferences follow the shared foundation contract: `theme` in (`light`, `dark`, `system`, where `system` follows `prefers-color-scheme`) and a `reduced_motion` boolean, mapped straight to the contract's light and dark roles.

## 9. Where defaults may change
PostgreSQL 19 release (beta on 2026-10-13); Supabase legacy key shutoff (end of 2026); Supabase Advisor lint list (grows; 0001 to 0030 on 2026-10-13); Stripe statuses and Entitlements; the IETF Idempotency-Key draft (expired, may be revived); the GDPR Digital Omnibus (would set breach notice to 96 hours if adopted); Temporal reaching Baseline (it would simplify reference 07's time rules); IANA tz releases (2026e on 2026-09-29). Recheck every 3 months.
