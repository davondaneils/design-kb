# Schema fundamentals

Who this is for: a designer-builder about to create tables for a real app. Facts come from `kb/research/data/01-schema-fundamentals.md` (time-sensitive facts rechecked 2026-10-13). Opinion is marked "Opinion". Defaults assume PostgreSQL 18 (current minor 18.6, 2026-08-13; PostgreSQL 19 is in beta, not released; PostgreSQL 14 stops receiving fixes on 2026-11-12).

## Fundamentals (non-negotiable)
1. Every table has a primary key; join tables use a composite PK or a UNIQUE on the pair. [judged]; Supabase Advisor 0004 flags a missing PK.
2. Every relationship is a declared FOREIGN KEY with a deliberate `ON DELETE`. [judged]
3. Every foreign key column has an index. [judged]; Advisor 0001.
4. Types: `timestamptz` for instants, `date` for calendar dates, `text` plus CHECK, money as integer minor units plus `currency` (or `numeric`), never float, `money`, `serial` or `char(n)`. [judged]
5. NOT NULL by default; nullable only when "unknown" is a designed state with UI for it. [judged]
6. Natural identifiers unique in the database, case-folded where people type them. [judged]
7. Business invariants are constraints (CHECK, UNIQUE, EXCLUDE, FK), named so the API can map them to field errors. [judged]

## Principles
1. **The schema is the product's truth model.** Screens change monthly; the schema outlives them. Design it from the nouns and rules of the business, not from the first screen.
2. **Make bad data impossible, not unlikely.** Every rule the database can enforce (NOT NULL, UNIQUE, CHECK, FOREIGN KEY, EXCLUDE) is a rule no bug, script, AI agent or admin panel can break. App-side validation is for nice error messages; database constraints are for truth.
3. **One fact, one place.** If a value can be derived or looked up, do not store a second copy unless you have a measured reason and a mechanism that keeps the copies in sync. This is normalization in one sentence.
4. **Name for the reader in two years.** Lowercase snake_case, plural table names, singular column names, `<table_singular>_id` for foreign keys (PostgreSQL folds unquoted names to lowercase, so mixed case forces quoting forever; Don't Do This).

## The modeling routine (do this every time)
1. Write the nouns (user, studio, class, booking) and verbs (books, teaches, pays) from the brief.
2. For each pair of nouns, write the cardinality in words: "a studio has many classes; a class belongs to one studio"; "a user can book many classes; a class has many users" (many-to-many becomes a join table, here `bookings`).
3. For each noun, list the facts that depend on that noun alone. A fact that depends on two nouns belongs to the join table (the price a user paid belongs on `bookings`, not on `users` or `classes`).
4. Write the invariants as sentences ("a class cannot be double booked past capacity", "an email belongs to at most one account", "a booking cannot start before it is created"). Each sentence becomes a constraint, a unique index, an exclusion constraint, or (last resort) a trigger.
5. Write the top 5 queries the screens will run. These drive indexes (see `02-indexes-and-migrations.md`).

Normalization in plain words: one value per cell (1NF), every non-key column depends on the whole key (2NF), and on nothing but the key (3NF). If changing one real-world fact requires updating more than one row, you are denormalized.

## Decision rules: keys
- **Every table gets a primary key.** No exceptions, including join tables (use a composite PK on the two foreign keys, or a surrogate PK plus a UNIQUE on the pair).
- **Surrogate keys for entities, natural keys as UNIQUE constraints.** Email, slug, SKU and handle change; keep them UNIQUE but not the PK.
- **Choosing the PK type:**
  - If IDs will appear in URLs, are generated on the client or offline, or rows may merge across databases: `uuid` with `default uuidv7()` on PostgreSQL 18+ (time-ordered, good index locality; PG 18 release notes). On older Postgres, generate UUIDv7 in the app or use `gen_random_uuid()` (v4) and accept scattered inserts.
  - If the table is internal, high volume and never exposed (event logs, line items): `bigint generated always as identity`.
  - Never `serial` (use identity; Don't Do This). Never `integer` for a table that might pass 2.1 billion rows (integer max 2,147,483,647).
  - Opinion: for a new public-facing app, default to UUIDv7 everywhere so you never leak row counts ("/invoices/1042" tells a competitor your volume) and never need a second public ID column.
  - Caveat: a UUIDv7 embeds its creation time to the millisecond (that is what makes it sortable). If creation time is sensitive (signup date in a dating, health or whistleblower app), use UUIDv4 for that table's public id. RFC 9562 says the same for any id with a security role: "UUIDv4 ... SHOULD be utilized".
- **Foreign keys always declared**, with an explicit `ON DELETE`:
  - `CASCADE` when the child cannot exist without the parent (order_items of an order, memberships of an org).
  - `RESTRICT` when deleting the parent must be a deliberate decision (a product referenced by paid invoices).
  - `SET NULL` when the child survives and loses the link (a post whose author account was deleted).
  - Default `NO ACTION` is fine only if you thought about it.
- **Index every foreign key column** (Postgres does not do it for you; PostgreSQL constraints docs). This is the single most common performance bug in hand-made schemas.

## Decision rules: column types (PostgreSQL)
| Data | Use | Never |
|---|---|---|
| Point in time that has happened (created, paid, sent) | `timestamptz` (stored as UTC; the input zone is not kept, so store the IANA zone separately when the screen needs it) | `timestamp` (no zone), `timetz` |
| Future event at a place (a class next month) | local wall time `timestamp` plus `time_zone text` (IANA) as truth, with a derived `timestamptz` recomputed when tz data changes (opinion; `07-data-shapes-the-ui.md`) | an instant alone |
| Calendar date (birthday, due date) | `date` | `timestamptz` at midnight |
| Text of any length | `text`, plus `CHECK (char_length(x) <= n)` if a limit is a business rule | `char(n)`, `varchar(n)` by habit |
| Money | `bigint` in minor units (cents) plus `currency text` (ISO 4217, lowercase like Stripe), or `numeric(19,4)` for fractional pricing | `float`, `real`, `double precision`, `money` |
| Yes or no | `boolean NOT NULL DEFAULT false` | nullable booleans (three states nobody designed) |
| Small fixed set (status) | `text` + `CHECK (status IN (...))` | free text |
| Set with attributes or admin-edited (plans, categories) | lookup table + FK | hard-coded enum |
| Flexible, rarely queried attributes | `jsonb` with a fixed-ish shape | `json`; jsonb for core relational facts |
| Email | `text` + unique index on `lower(email)` (or `citext`) | case-sensitive unique |
| Percent, rating | `numeric(5,2)` or integer basis points, with CHECK range | float |

Sources: Don't Do This; PostgreSQL numeric and JSON docs; Stripe currencies (amounts as integers in the minor unit: 1099 = 10.99 USD; 500 = 500 JPY because JPY has no minor unit).

Money rule detail: store the currency next to every amount. Never assume 2 decimals (JPY has 0). Do arithmetic in integers; format only at the edge.

## Decision rules: constraints
- **NOT NULL by default.** Make a column nullable only when "unknown" is a real state you will design UI for. A CHECK does not block NULL (a CHECK passes when its expression is NULL; constraints docs).
- **UNIQUE for every natural identifier**, case-folded where humans type it. Remember UNIQUE treats NULLs as distinct; use `NULLS NOT DISTINCT` (PG 15+) when a NULL should count as a value.
- **CHECK for ranges and shapes:** `CHECK (quantity > 0)`, `CHECK (ends_at > starts_at)`, `CHECK (slug ~ '^[a-z0-9-]+$')`. CHECK cannot look at other rows; use UNIQUE, EXCLUDE or FK for those.
- **EXCLUDE for "no overlaps":** bookings of the same room cannot overlap: `EXCLUDE USING gist (room_id WITH =, tstzrange(starts_at, ends_at) WITH &&)` (requires the `btree_gist` extension for the `=` part).
- **Standard columns on every table:** `id`, `created_at timestamptz NOT NULL DEFAULT now()`, `updated_at timestamptz NOT NULL DEFAULT now()` maintained by a trigger. Add `created_by` where accountability matters.

## Decision rules: jsonb
Use jsonb when all three are true: the shape varies per row, you rarely filter or join on the inside, and no other row needs to reference the inside. Examples: third-party webhook payloads, per-integration settings, form builder answers. Keep documents small and "somewhat fixed" in structure (PostgreSQL JSON docs: an update locks the whole row). If you find yourself writing `WHERE data->>'status' = ...` in a hot path, promote that key to a real column.

## Do and don't
| Do | Don't |
|---|---|
| `price_cents bigint NOT NULL CHECK (price_cents >= 0), currency text NOT NULL` | `price float` |
| `starts_at timestamptz` and store the venue's IANA time zone (`America/Toronto`) separately when local wall time matters | `timestamp` plus a UTC offset string |
| `memberships(org_id, user_id, role)` with `UNIQUE (org_id, user_id)` | `users.org_ids uuid[]` |
| `WHERE created_at >= '2026-10-01' AND created_at < '2026-11-01'` | `BETWEEN '2026-10-01' AND '2026-10-31'` (misses most of the last day, double counts boundaries) |
| `NOT EXISTS (subquery)` | `NOT IN (subquery)` (a single NULL returns zero rows) |
| `status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','published','archived'))` | `is_draft boolean, is_published boolean, is_archived boolean` (impossible combos) |

## Worked example: yoga studio booking app
Brief: studios run classes; members book spots; classes have capacity; members pay per class or with a pack.

```sql
create table studios (
  id uuid primary key default uuidv7(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  time_zone text not null,                 -- IANA name, e.g. 'America/Toronto'
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table classes (
  id uuid primary key default uuidv7(),
  studio_id uuid not null references studios(id) on delete cascade,
  title text not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null check (capacity > 0),
  price_cents bigint not null check (price_cents >= 0),
  currency text not null default 'cad',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (ends_at > starts_at)
);
create index on classes (studio_id, starts_at);   -- FK index that also serves "this studio's schedule"

create table bookings (
  id uuid primary key default uuidv7(),
  class_id uuid not null references classes(id) on delete restrict,
  user_id uuid not null references profiles(id) on delete cascade,
  status text not null default 'confirmed' check (status in ('confirmed','cancelled','attended','no_show')),
  amount_paid_cents bigint not null check (amount_paid_cents >= 0),   -- price at time of booking
  currency text not null,
  created_at timestamptz not null default now(),
  unique (class_id, user_id)
);
create index on bookings (user_id, created_at desc);
```
Reasoning (updated 2026-10-13): if classes are booked weeks ahead, also store `starts_local timestamp` with the studio zone as the truth, because tz rules change (IANA 2026e moved Manitoba to permanent UTC-05 on 2026-10-31; `07-data-shapes-the-ui.md`). Price paid lives on `bookings` because it is a fact about the booking (the class price can change later). `on delete restrict` on `class_id` stops someone deleting a class that has paid bookings; the UI must cancel and refund first. Capacity is enforced in the booking transaction with `select ... for update` on the class row and a count, because a CHECK cannot count rows (constraints docs). The studio time zone is stored so "7:00 am class" stays 7:00 am across DST.

## Worked example: "I store prices as float, is that ok?"
No. `0.1 + 0.2` is `0.30000000000000004` in binary floating point, and Postgres documents `real` and `double precision` as inexact; use `numeric` for exact money (numeric types docs). Migration: add `price_cents bigint`, backfill `round(price * 100)`, switch reads, drop the float (expand and contract, see `02-indexes-and-migrations.md`). Store `currency` next to it.

## Where this domain is usually wrong
- **"UUID keys are slow."** UUIDv4 scatters inserts across the index; UUIDv7 is time-ordered and built into PostgreSQL 18 (research 01 claim 8). The trade-off now is the timestamp leak, not speed.
- **"`varchar(255)` is best practice."** A habit from other engines; Postgres says `text` plus a CHECK when the limit is a business rule (Don't Do This).
- **"Use the `money` type for money."** It is locale dependent and carries no currency (Don't Do This).
- **"`BETWEEN` for date ranges."** It includes both ends and misses most of the last day for timestamps; use `>= start and < end` (Don't Do This).
- **"Store everything in UTC and you are done."** Right for past instants; future local events need wall time plus zone (`07-data-shapes-the-ui.md`, IANA 2026e).

## Hand-offs
- Screens that edit these records: design-ux (forms, validation messaging), design-copy (error text). Database CHECK names become the hook for friendly messages: name constraints (`constraint price_non_negative check (...)`) so the API can map them to field errors.
- What the screen can show from these columns (states, time, money, totals): `07-data-shapes-the-ui.md`.
- Rendering dates in the user's zone and formatting money: design-frontend (use `Intl.DateTimeFormat` and `Intl.NumberFormat` at the edge).
- Preference columns that drive theming (`theme text check (theme in ('light','dark','system'))`, `reduced_motion boolean`) mirror the shared foundation contract (light and dark themes mapping the same roles; reduced motion always honored). `system` means follow the OS `prefers-color-scheme`, so design-frontend maps all three straight to tokens.

## Sources
- PostgreSQL wiki, Don't Do This: https://wiki.postgresql.org/wiki/Don't_Do_This (accessed 2026-10-09)
- PostgreSQL 18 docs, Constraints: https://www.postgresql.org/docs/current/ddl-constraints.html (accessed 2026-10-09)
- PostgreSQL 18 docs, Numeric types: https://www.postgresql.org/docs/current/datatype-numeric.html (accessed 2026-10-09)
- PostgreSQL 18 docs, JSON types: https://www.postgresql.org/docs/current/datatype-json.html (accessed 2026-10-09)
- PostgreSQL 18 docs, Date/Time types: https://www.postgresql.org/docs/current/datatype-datetime.html (accessed 2026-10-13)
- PostgreSQL 18 docs, UUID functions: https://www.postgresql.org/docs/current/functions-uuid.html (accessed 2026-10-13)
- PostgreSQL home page (current releases, PG 19 beta, PG 14 end of life): https://www.postgresql.org/ (accessed 2026-10-13)
- RFC 9562, UUIDs: https://www.rfc-editor.org/rfc/rfc9562.html (accessed 2026-10-13)
- IANA Time Zone Database (2026e): https://www.iana.org/time-zones (accessed 2026-10-13)
- Brandur Leach, Postgres 18 notes: https://brandur.org/nanoglyphs/045-postgres-18 (accessed 2026-10-09)
- Stripe, Supported currencies: https://docs.stripe.com/currencies (accessed 2026-10-13)
- Kleppmann, DDIA ch. 2 summary: https://candost.blog/books/data-models-and-query-languages/ (accessed 2026-10-09)
