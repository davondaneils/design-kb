# Research: Schema fundamentals

Status key: C = consensus, P = practitioner opinion, O = one expert's opinion, Q = contested.

## Findings
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Use `timestamptz`, not `timestamp`, for points in time; `timestamp` cannot represent an instant and breaks across zones and DST. | PostgreSQL wiki, Don't Do This | C |
| 2 | Do not use `char(n)`; do not default to `varchar(n)`; use `text` plus a CHECK when you need a limit. | Don't Do This | C |
| 3 | Do not use the `money` type (locale dependent, no currency); use `numeric` or integer with a currency column. | Don't Do This | C |
| 4 | `numeric` is exact and recommended for money; `real` and `double precision` are inexact. | PostgreSQL docs, numeric types | C |
| 5 | Stripe expresses every amount as an integer in the currency's minor unit (1099 = 10.99 USD; 500 = 500 JPY, a zero-decimal currency). | Stripe docs, currencies | C |
| 6 | Do not use `serial`; use identity columns (PG 10+). | Don't Do This | C |
| 7 | `integer` max is 2,147,483,647; `bigint` max is about 9.22e18. | PostgreSQL docs, numeric types | C |
| 8 | PostgreSQL 18 (released 25 Sep 2025) ships `uuidv7()`, timestamp-ordered UUIDs with better index locality; `uuidv4()` aliases `gen_random_uuid()`. | postgresql.org PG18 release note | C |
| 9 | "Use them [UUIDv7], especially for new projects." ULID can be retired. | Brandur Leach, Nanoglyph 045 | O (respected practitioner, ex-Stripe and Heroku) |
| 10 | Lowercase snake_case identifiers; unquoted names fold to lowercase. | Don't Do This | C |
| 11 | Use `NOT EXISTS`, not `NOT IN` (NULL trap). Use `>= start AND < end`, not BETWEEN, for timestamps. | Don't Do This | C |
| 12 | CHECK passes when the expression is NULL, so CHECK does not replace NOT NULL; CHECK cannot reference other rows or tables. | PostgreSQL docs, constraints | C |
| 13 | UNIQUE treats NULLs as distinct by default; `NULLS NOT DISTINCT` (PG 15+) changes that. | PostgreSQL docs, constraints | C |
| 14 | ON DELETE options: NO ACTION (default, deferrable), RESTRICT, CASCADE, SET NULL, SET DEFAULT; SET NULL can take a column list. | PostgreSQL docs, constraints | C |
| 15 | Exclusion constraints guarantee no two rows conflict (for example overlapping bookings) using GiST. | PostgreSQL docs, constraints | C |
| 16 | Prefer `jsonb` over `json`; keep JSON documents small (any update locks the whole row) and with a "somewhat fixed structure"; each document should be an atomic datum. | PostgreSQL docs, JSON types | C |
| 17 | Document model wins on locality and one-to-many trees; relational wins on many-to-many and joins; schema-on-read moves validation into app code. | Kleppmann, Designing Data-Intensive Applications ch. 2 (summary) | C (canonical book) |
| 18 | Do not use table inheritance or rules. | Don't Do This | C |
| 19 | PG 18 generated columns are virtual by default. | PG18 release note | C |

## Numbers
- integer 4 bytes, max 2,147,483,647. bigint 8 bytes. uuid 16 bytes.
- Stripe minor units: two-decimal default; zero-decimal currencies such as JPY and KRW; ISK and UGX special-cased.

## Conflicting views
- bigint identity vs UUID primary keys: bigint is smaller and fastest; UUIDs avoid enumeration of public IDs, allow client or offline generation, and merge across databases. UUIDv4 scatters inserts across the B-tree; UUIDv7 restores locality. Opinion is shifting toward UUIDv7 for new public-facing apps (Brandur; PG 18 adding it natively). Q.
- Postgres enum types vs CHECK vs lookup table: enum values can be added but not easily removed. Practitioner opinion favors `text` plus CHECK for small fixed sets and a lookup table when the set has attributes or is admin-edited. P.

## Recent changes to watch
- PG 18 (uuidv7, virtual generated columns, OLD and NEW in RETURNING, skip scan). PG 19 expected around September 2026.

## Sources
- PostgreSQL wiki, Don't Do This: https://wiki.postgresql.org/wiki/Don't_Do_This
- PostgreSQL docs, Constraints: https://www.postgresql.org/docs/current/ddl-constraints.html
- PostgreSQL docs, Numeric types: https://www.postgresql.org/docs/current/datatype-numeric.html
- PostgreSQL docs, JSON types: https://www.postgresql.org/docs/current/datatype-json.html
- PostgreSQL 18 released: https://www.postgresql.org/about/news/postgresql-18-released-3142/
- Brandur Leach, Postgres 18 notes: https://brandur.org/nanoglyphs/045-postgres-18
- Stripe, Supported currencies and minor units: https://docs.stripe.com/currencies
- Kleppmann, DDIA ch. 2 summary: https://candost.blog/books/data-models-and-query-languages/

## Re-check 2026-10-13 (time-sensitive facts, primary sources)
| # | Fact | Result on 2026-10-13 | Quote | URL |
|---|---|---|---|---|
| R1 | `uuidv7()` is built into PostgreSQL 18 | Unchanged. The PG 18 docs list `uuidv7 ( [ shift interval ] ) → uuid` and `uuidv4()`. | "`uuidv7` ( [ _`shift`_ `interval` ] ) → `uuid`" | https://www.postgresql.org/docs/current/functions-uuid.html |
| R2 | Current release | **Changed since the archive.** Current minor is 18.6 (2026-08-13). PostgreSQL 19 is in beta (Beta 4, 2026-09-24), not released; the archive's "PG 19 expected around September 2026" did not happen on time. PostgreSQL 14 stops receiving fixes on 2026-11-12. | "PostgreSQL 19 Beta 4 Released!"; "PostgreSQL 14 will stop receiving fixes on November 12, 2026." | https://www.postgresql.org/ |
| R3 | UUIDv7 layout: 48-bit Unix millisecond timestamp, then random bits | Confirmed (RFC 9562, May 2024). | "allocating a Unix timestamp in milliseconds in the most significant 48 bits" | https://www.rfc-editor.org/rfc/rfc9562.html |
| R4 | RFC 9562 security note on time-based UUIDs | New source for the archive's "UUIDv7 reveals creation time" caveat. | "If UUIDs are required for use with any security operation within an application context in any shape or form, then UUIDv4 (Section 5.4) SHOULD be utilized." | https://www.rfc-editor.org/rfc/rfc9562.html#name-security-considerations |
| R5 | `timestamptz` is stored as UTC and the input zone is not kept | Confirmed. This is why the venue or user IANA zone needs its own column. | "the value is stored internally as UTC, and the originally stated or assumed time zone is not retained." | https://www.postgresql.org/docs/current/datatype-datetime.html |
| R6 | Stripe minor units, special cases | Confirmed and sharpened: ISK and UGX are zero-decimal in practice but Stripe requires them as two-decimal values ending in 00; HUF and TWD are zero-decimal for payouts only. | "to charge 5 ISK, provide an `amount` value of `500`" | https://docs.stripe.com/currencies |
