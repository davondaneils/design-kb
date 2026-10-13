---
name: design-data
description: Data and backend structure for websites and apps, at senior backend engineer level. Use when designing or reviewing a database schema or data model, tables, columns, keys, indexes, constraints or migrations; modeling users, auth, profiles, teams, organizations, workspaces, roles, invitations, multi-tenancy, billing and Stripe subscriptions, content, audit logs or deletion; choosing between Postgres, SQLite, Supabase, Firebase/Firestore, Convex or Neon; designing a REST API, endpoints, status codes, errors, pagination, idempotency or webhooks; writing Supabase row level security (RLS) policies or Firebase security rules; handling secrets, sessions, passwords, privacy, GDPR, data retention, export or account deletion. Triggers on phrases like "schema for", "what tables", "ERD", "Supabase", "RLS", "policy", "migration", "slow query", "index", "API endpoints", "webhook", "multi-tenant", "teams and seats", "store prices", "delete my account". Not for UI layout, visual design or copy (see design-ux, design-copy).
---

# design-data

Make the data layer of a real app correct first, then fast, then pleasant to evolve. The bar: a schema, policy set and API a senior engineer at Stripe or Supabase would approve without comments.

Defaults assume PostgreSQL 18 (Supabase-compatible). On older Postgres, swap `uuidv7()` for `gen_random_uuid()`.

## 1. Fundamentals gate (non-negotiable, check first)

Every answer that proposes or reviews a schema, policy or endpoint must pass all of these. One miss is a failure, whatever else is good. When reviewing someone's work, report gate misses before anything else.

**Schema**
1. Every table has a primary key. Join tables use a composite PK or a UNIQUE on the pair.
2. Every relationship is a declared FOREIGN KEY with a deliberate `ON DELETE` (CASCADE for owned children, RESTRICT for records with money or legal weight, SET NULL when the child survives).
3. Every foreign key column has an index. Postgres does not create it for you.
4. Types: `timestamptz` for instants, `date` for calendar dates, `text` (plus CHECK if a limit is a rule), money as integer minor units plus a `currency` column (or `numeric`), never float or the `money` type, never `serial` (use identity or UUID), never `char(n)`.
5. NOT NULL by default; nullable only when "unknown" is a designed state.
6. Uniqueness of natural identifiers (email, slug, handle) enforced by the database, case-folded where humans type it (`unique index on lower(email)`).
7. Business invariants enforced by constraints (CHECK, UNIQUE, EXCLUDE, FK), not only in app code.

**Access**
8. Authorization lives at the data layer: RLS enabled on every exposed table with per-operation policies (UPDATE has both `using` and `with check`), or a server check that scopes every object lookup by the caller's tenant or user. Logged in is not authorized.
9. No secret, service-role or admin key in client code, public env vars or mobile bundles. Never authorize on user-editable metadata or client-supplied flags.
10. Multi-user business data carries an owner key (`org_id` or `user_id`) on every row, indexed, used by every policy and query.

**Change and API**
11. Schema changes are versioned migration files, run first on a non-production database, and safe under live traffic (no blocking index builds, no table rewrites, no renames under running code). Production has backups and one tested restore.
12. Every list endpoint is paginated with a cap; every create or charge endpoint is safe to retry; errors are machine-readable with correct status codes.
13. Personal data is minimized, has a deletion path and is never logged in plain text with secrets.

## 2. How to work a data request

1. **Restate the domain** in nouns, verbs and invariants ("a class has capacity; a member cannot book twice").
2. **Pick the platform** only if not given (section 4). Default: Postgres.
3. **Draw the model**: tables, keys, relationships with cardinality, then columns with types and constraints. Output real SQL DDL, not prose, unless the user asked for a diagram.
4. **Write the top queries** the screens need and derive indexes from them.
5. **Write access rules** (RLS policies or server checks) in the same answer as the tables. A table without its policy is half a deliverable.
6. **State the expert decisions** you made and why, in 3 to 6 bullets (ownership model, ID type, deletion pattern, billing sync, pagination).
7. **Run the gate** (section 1) against your own output before sending. Say what you would test (cross-tenant test, explain plan, migration on production-sized data).

## 3. Expert moves (what separates a top practitioner from a strong generalist)

**Modeling**
- Org-owned data from day one in anything that might have teams; create a personal org at signup so solo and team users share one code path. Retrofitting tenancy touches every table, query and policy.
- Facts that belong to an event live on the event: the price paid lives on `bookings` or `order_items`, not read back from the product later.
- Duplicate `org_id` onto child tables for cheap RLS, and make the copy impossible to get wrong with a composite FK: `foreign key (project_id, org_id) references projects (id, org_id)` plus `unique (id, org_id)` on the parent.
- Status as one CHECKed text column plus cross-column CHECKs (`check (status <> 'published' or published_at is not null)`), never several booleans.
- "No overlapping bookings" is an `EXCLUDE USING gist (room_id with =, tstzrange(starts_at, ends_at) with &&)` constraint (needs the `btree_gist` extension), not app code.
- UUIDv7 primary keys for public-facing apps (time-ordered, no row-count leaks, PG 18 native); bigint identity for internal high-volume tables. A UUIDv7 reveals its creation time to the millisecond, so use UUIDv4 for public ids where signup or creation time is sensitive.
- Limits that depend on counting rows (seats, class capacity) are checked after locking the parent row (`select ... for update`) in the same transaction; a bare count is a race.
- Name constraints (`constraint price_non_negative check (...)`) so the API maps violations to field errors.
- Default to hard delete plus a `deleted_records` jsonb archive; use `deleted_at` only for a real user-facing trash with partial unique indexes and a purge job.
- Audit log is append-only, has no foreign keys on purpose, and is written in the same transaction as the action.

**Performance**
- Composite index order: equality columns, then the range or sort column; `(org_id, status, created_at desc)`. Rarely more than 3 columns.
- Partial indexes for hot subsets (`where completed_at is null`) and partial unique indexes for conditional uniqueness (one pending invite per email per org).
- Keyset pagination with a unique tie-breaker: `where (created_at, id) < ($1, $2) order by created_at desc, id desc`.
- RLS speed: wrap auth calls `(select auth.uid())`, index policy columns, resolve memberships in a `security definer` function in a private schema called as `org_id = any (array(select private.my_org_ids()))`, add `to authenticated`, and also filter in the client query. Supabase measured 179 ms to 9 ms, 171 ms to under 0.1 ms, and 173,000 ms to 16 ms for these.

**Safe change**
- Migration sessions set `lock_timeout = '10s'` and a long `statement_timeout`.
- `create index concurrently`; constraints added `not valid` then `validate constraint`; NOT NULL via a validated CHECK first; renames and type changes by expand and contract (add, dual write, backfill in batches, switch reads, drop).

**Billing**
- Stripe is the source of truth; your tables are a cache. One `syncStripe(customerId)` function re-fetches current state, called from every relevant webhook and from the checkout success page. Never apply webhook payloads as deltas (unordered, duplicated).
- Dedupe on event id, and make the business effect idempotent too (`unique (org_id, stripe_invoice_id)` on credit grants).
- Access: `active` and `trialing` grant; `past_due` is a grace period you choose; `unpaid`, `canceled`, `incomplete_expired` revoke. Or check Stripe Entitlements.

**API**
- 404, not 403, for other tenants' objects so ids cannot be probed (common practice, opinion).
- RFC 9457 problem+json with an `errors[]` extension carrying field, code and message.
- `Idempotency-Key` on creating POSTs, stored per caller with the request fingerprint; same key and different body is 422, still running is 409; keep keys at least 24 h.
- Cursor tokens are opaque and never grant access; re-authorize on every page.

**Security and privacy**
- Two-user, two-org cross-tenant test through the public API before launch. Automate the gate with Supabase Advisors (`supabase db advisors`): lints 0013 RLS disabled in public, 0015 RLS references user metadata, 0001 unindexed foreign keys, 0003 auth RLS initplan (unwrapped `auth.uid()`), 0011 mutable function search path.
- Files: private bucket by default, path prefixed by `org_id` or user id, storage policies on `storage.objects` mirroring the table policies, signed URLs for reads, a job that deletes objects when rows go (cascades do not reach storage).
- Views get `security_invoker = true`; security definer functions get `set search_path = ''` and live outside exposed schemas; revoke function execute from `anon` where it reaches the network or secrets.
- Keep personal data in few tables so export and erasure touch few places; write the purpose of each personal column in the migration.

## 4. Platform decision (short form)

| If | Then |
|---|---|
| Users, teams, orders, permissions (most apps) | Postgres. Supabase if you want auth, storage, realtime and auto API together; any Postgres host otherwise |
| One server, one writer, under about 100K hits/day | SQLite (WAL, continuous backup) is enough |
| Offline-first mobile with per-user document trees | Firestore or a local-first sync engine; accept denormalization and 1 MiB documents |
| Live collaborative payload | Postgres for accounts and permissions, CRDT or reactive store for the live document |

Before committing: backups and a tested restore, region next to your functions, connection pooler for serverless, free-tier pausing, and the exit path. Supabase: use `sb_publishable_` keys in clients and `sb_secret_` only on servers (legacy anon and service_role keys are deprecated by end of 2026). Details and numbers: `references/04-platform-choice.md`.

## 5. Output format

For a new model, deliver in this order:
1. One-paragraph model summary with the ownership decision (user-owned or org-owned) and why.
2. SQL DDL: tables, constraints, indexes (each index commented with the query it serves).
3. Access: RLS policies (or Firebase rules, or server checks) for every table.
4. Key queries (2 to 5) including the paginated list.
5. API surface if relevant (method, path, status codes).
6. Decisions and trade-offs (3 to 6 bullets), then "Test before launch" (cross-tenant test, migration plan, restore test).

For a review of existing work: gate misses first (numbered, with the fix as code), then expert-level improvements, then optional polish.

Keep prose short. Show code. Use real numbers. Mark opinion as opinion.

## 6. Reference map (read the file when the task needs depth)

| Task | Read |
|---|---|
| Tables, types, keys, constraints, jsonb, naming, worked booking schema | `references/01-schema-fundamentals.md` |
| Indexes, query shapes, pagination SQL, safe migration recipes | `references/02-indexes-and-migrations.md` |
| Profiles, orgs, memberships, invitations, Stripe billing, content, files, audit, deletion | `references/03-app-data-models.md` |
| Postgres vs SQLite vs Firestore vs Convex, hosting checks, Firestore rules of thumb | `references/04-platform-choice.md` |
| REST conventions, status codes, problem+json, pagination, idempotency, webhooks | `references/05-api-design.md` |
| Auth rules, RLS policy set and performance, Firebase rules, privacy and deletion | `references/06-auth-rls-privacy.md` |

## 7. Hand-offs to other skills

- Positioning, audience and what the product is: website-strategy. Checkout, pricing and upsell flow: sales-funnels. Paywall and plan copy: copywriting.
- Forms, validation UX, empty, loading and error states, account deletion flow: design-ux. Error and confirmation wording: design-copy.
- Client data fetching, caching, optimistic UI, formatting money and dates with `Intl`: design-frontend. Full-text search and slugs for SEO: design-search. Dashboards over this data: dataviz.
- Stored UI preferences follow the shared foundation contract: `theme` in (`light`, `dark`, `system`, where `system` follows `prefers-color-scheme`) and a `reduced_motion` boolean, so design-frontend maps them straight to the contract's light and dark roles.
