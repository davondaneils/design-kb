# Indexes and migrations

Facts from `kb/research/data/02-indexes-and-migrations.md` (rechecked 2026-10-13). Opinion is marked "Opinion".

## Fundamentals (non-negotiable)
1. Every foreign key column and every column an RLS policy filters on has an index. [judged]; Supabase Advisor 0001.
2. Every hot list query has an index that matches its WHERE and ORDER BY, checked with `explain (analyze, buffers)`. [judged]
3. Lists that can grow use keyset pagination with a unique tie-breaker. [judged]
4. Schema changes are versioned migration files, run first on a non-production database with production-sized data. [judged]
5. No migration blocks writes on a large table: concurrent index builds, `not valid` then `validate`, expand and contract for renames and type changes, `lock_timeout` set. [judged]
6. Production has backups and one tested restore. [judged]

## Principles
1. **Indexes come from queries, not from columns.** Write the query, then build the index that serves its WHERE and ORDER BY. An index nobody's query uses is pure write cost.
2. **A migration is a deploy, not a script.** It runs against live traffic, takes locks, and can take the app down. Every schema change is planned as a sequence the old and new app versions can both survive.
3. **Measure before and after.** `EXPLAIN (ANALYZE, BUFFERS)` the query. A "Seq Scan" on a large table in a hot path is the signal; on a 2,000-row table it is fine.

## Decision rules: what to index
1. **Primary keys and UNIQUE constraints** are indexed automatically.
2. **Every foreign key column** gets an index (Postgres does not create one; constraints docs). Without it, deleting a parent scans the whole child table and every "children of X" query is a sequential scan.
3. **Every column an RLS policy filters on** (`user_id`, `org_id`). Supabase measured 171 ms to under 0.1 ms from this one index.
4. **Composite index for each hot list query**: equality columns first, then the range or sort column. Query `WHERE org_id = $1 AND status = 'open' ORDER BY created_at DESC` gets `(org_id, status, created_at DESC)`. Rule from the docs: equality on leading columns plus one range on the next column limit the scan. Rarely go past 3 columns.
5. **Partial index** when the query always filters on a constant: `create index on tasks (org_id, due_at) where completed_at is null;` (small, fast, ignores finished rows).
6. **Expression index** when you query an expression: `create unique index on users (lower(email));` and query `where lower(email) = lower($1)`.
7. **GIN** for jsonb containment (`jsonb_path_ops` when you only use `@>`), arrays, and full-text `tsvector`. Text search UX itself: design-search.
8. **Do not index** low-cardinality columns alone (`is_active`), tiny tables, or columns only ever written.

## Decision rules: query shapes
- **Pagination: keyset, not OFFSET**, for any list that can grow past a few thousand rows or uses infinite scroll. OFFSET reads and discards every skipped row and shows duplicates when new rows arrive (Winand, No offset).
  ```sql
  select id, title, created_at from posts
  where org_id = $1 and (created_at, id) < ($2, $3)      -- last row of previous page
  order by created_at desc, id desc
  limit 50;
  -- index: (org_id, created_at desc, id desc)
  ```
  Always add a unique tie-breaker (`id`) to the sort. With UUIDv7 PKs, `order by id desc` alone is already time-ordered (opinion: convenient, but keep `created_at` for clarity in user-facing sorts).
  OFFSET is fine for admin tables under about 10,000 rows where users need "jump to page 7". Opinion.
- **N+1:** loading a list then querying each row's children one at a time. Fix with a join, `where id = any($1)`, or your ORM's eager loading. Symptom: page time grows linearly with list length.
- **Counts are expensive** on large tables: Postgres checks visibility for every row (PostgreSQL wiki, Count estimate). Show "50+" (fetch `limit + 1`) or an estimate from `pg_class.reltuples` rather than an exact `count(*)` over millions of rows (opinion on the UI; AIP-158 allows `total_size` to be an estimate). What each choice lets the list UI say: `07-data-shapes-the-ui.md`.

## Decision rules: safe migrations (PostgreSQL)
Tooling rule: every schema change is a numbered migration file in version control, applied by a tool (Supabase CLI, Prisma Migrate, Drizzle Kit, Rails, Alembic). Never click-edit production schema in a dashboard. Opinion, universal among senior teams.

Environment rule: never develop or experiment against production. Use a local database (Supabase CLI runs one), a preview branch or staging database, and seed scripts with fake data. Production only ever receives migrations that already ran cleanly elsewhere on production-sized data. Opinion, standard practice.

Set these at the top of each migration session (strong_migrations defaults):
```sql
set lock_timeout = '10s';        -- give up rather than queue behind a long query and block everyone
set statement_timeout = '1h';    -- allow long index builds
```
App connections: `statement_timeout` around 15 s so one runaway query cannot hold locks.

| Change | Dangerous form | Safe sequence |
|---|---|---|
| Add column | `add column x uuid default gen_random_uuid()` (volatile default rewrites table) | Add nullable or with a constant default (no rewrite since PG 11; ALTER TABLE docs), then backfill in batches |
| Add index | `create index` (blocks writes) | `create index concurrently` outside a transaction; if it fails, drop the INVALID index and retry. Migration tools that wrap each file in a transaction make it fail with "cannot run inside a transaction block": give it its own file and use the tool's opt-out (CREATE INDEX docs). The Supabase CLI instead commits the batch before the concurrent statement and runs it alone (`migration up` and `down` since v2.109.0, 2026-06-30; `db push` and `db reset` share that code on the `develop` branch; `drop index concurrently` only since a fix merged 2026-08-19), so atomicity is lost at that point: a later failure leaves the database partly migrated with no history row, and a re-run replays the file from the top. Same rule: its own file, with `if not exists` (Supabase CLI repository, `db push` SIDE_EFFECTS.md; `kb/research/data/02` R6, checked 2026-10-13) |
| Add foreign key | `add foreign key` (locks both tables while scanning) | `add constraint ... foreign key ... not valid;` then in a separate step `validate constraint` (SHARE UPDATE EXCLUSIVE only) |
| Add CHECK | plain add (scans under lock) | `not valid`, then `validate constraint` |
| Set NOT NULL | `alter column set not null` on a big table (full scan under ACCESS EXCLUSIVE) | PostgreSQL 18: `add constraint t_col_nn not null col not valid`, then `validate constraint t_col_nn` (SHARE UPDATE EXCLUSIVE; not-null constraints accept NOT VALID since 18). Older versions: add `check (col is not null) not valid`, validate, then `set not null` (skips the scan because the valid check proves it), then drop the check (ALTER TABLE docs) |
| Add UNIQUE | `add unique` | `create unique index concurrently`, then `add constraint ... unique using index` |
| Rename column or table | `rename` while old code is running | expand and contract: add new, dual write, backfill, move reads, stop writing old, drop old |
| Change type | `alter type` (rewrites, unless widening e.g. to `text`) | same expand and contract |
| Drop column | drop while code still selects it | remove from code and deploy first, then drop |
| Backfill | one giant `update` inside the schema migration | separate job, batches of 1,000 to 10,000 rows by PK range, commit each batch, sleep between (batch size opinion) |

Expand and contract, in deploy order: (1) migration adds the new shape, (2) deploy code that writes both, (3) backfill, (4) deploy code that reads new, (5) deploy code that stops writing old, (6) migration drops old. Each step is independently safe to roll back.

## Do and don't
| Do | Don't |
|---|---|
| Index `bookings(user_id)` the day you add the FK | Wait for the slow-query alert |
| `(org_id, status, created_at desc)` for the inbox query | Three single-column indexes and hope the planner combines them |
| Keyset cursor for the feed | `offset 10000` |
| `not valid` then `validate` | Add a FK to a 20M row table at noon |
| Test every migration against a copy of production data size | Test only on an empty local database |

## Worked example: add a required `timezone` to a 5M row `profiles` table, derived per row
Each row needs its own value (derived from the stored `country`), so a constant default will not do.
1. Migration A: `alter table profiles add column timezone text;` (instant, metadata only).
2. Deploy code that writes `timezone` on signup and on profile save.
3. Backfill job: `update profiles p set timezone = coalesce((select c.default_tz from countries c where c.code = p.country), 'UTC') where p.id > $last_id and p.id <= $next_id and p.timezone is null;` in batches of 5,000 by id range, committing each, short sleep between. The `coalesce` matters: a join (`update ... from countries`) skips rows with no country match, and step 4 then fails on the rows it left null.
4. Migration B (PostgreSQL 18): `alter table profiles add constraint profiles_timezone_nn not null timezone not valid;` then, in its own step, `alter table profiles validate constraint profiles_timezone_nn;`. The column is NOT NULL once the constraint validates.
5. On PostgreSQL 17 and older, step 4 is three steps: `add constraint profiles_timezone_nn check (timezone is not null) not valid`, `validate constraint profiles_timezone_nn`, then `alter column timezone set not null` (no scan, the valid check proves it) and `drop constraint profiles_timezone_nn`.
No step holds a long ACCESS EXCLUSIVE lock. Shortcut worth knowing: when a constant default is correct, `add column x text not null default 'UTC'` is instant on PG 11+ because non-volatile defaults are stored in metadata (ALTER TABLE docs).

## Worked example: "my list page got slow"
1. Capture the exact SQL (ORM logging or `pg_stat_statements`).
2. `explain (analyze, buffers)`. Look for Seq Scan on a big table, a Sort node over many rows, or rows removed by filter in the thousands.
3. Typical fix: composite index matching WHERE plus ORDER BY; switch OFFSET to keyset; remove N+1 by batching.
4. Re-run explain; confirm Index Scan or Index Only Scan and time drop.
5. If behind RLS, also apply the RLS performance rules in `06-auth-rls-privacy.md`.

## Where this domain is usually wrong
- **"Postgres indexes foreign keys automatically."** It indexes the referenced side only (PostgreSQL constraints docs).
- **"OFFSET is fine."** It reads and discards every skipped row and drifts when rows arrive (Winand).
- **"Add the index when it gets slow."** On a big table that is a `create index concurrently` under load, or a blocked table if someone forgets `concurrently`.
- **"A constant default rewrites the table."** Not since PostgreSQL 11; only volatile defaults do (ALTER TABLE docs).

## Hand-offs
- Loading and empty states while data streams in: design-ux. Client caching and optimistic UI: design-frontend.
- Search ranking and full-text UX: design-search.
