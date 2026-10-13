# Research: Indexes and migrations

Status key: C = consensus, P = practitioner opinion, O = one expert's opinion, Q = contested.

## Findings
| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Postgres does not automatically index the referencing (child) side of a foreign key; "it is often a good idea to index the referencing columns too". The referenced side is always indexed (PK or unique). | PostgreSQL docs, constraints | C |
| 2 | Multicolumn B-tree: equality on leading columns plus an inequality on the first non-equality column limit the scan. More than 3 columns rarely helps. Max 32 columns. | PostgreSQL docs, multicolumn indexes | C |
| 3 | PG 18 adds skip scan so a multicolumn index can serve queries missing the leading column; worthwhile only when that column has few distinct values. | PG docs; PG18 release | C |
| 4 | Partial indexes index a subset (WHERE); a partial UNIQUE index enforces uniqueness over a subset, for example active emails. | PostgreSQL docs, CREATE INDEX | C |
| 5 | Expression indexes (for example `lower(email)`) serve queries using the same expression; functions must be immutable. | CREATE INDEX docs | C |
| 6 | INCLUDE columns enable index-only scans; they enlarge the index. | CREATE INDEX docs | C |
| 7 | CREATE INDEX CONCURRENTLY does not block writes, cannot run in a transaction block, and leaves an INVALID index on failure that must be dropped or reindexed. | CREATE INDEX docs | C |
| 8 | OFFSET pagination reads and discards all skipped rows and drifts when rows are inserted; keyset (seek) pagination filters after the last seen key and needs an index matching the ORDER BY. | Markus Winand, use-the-index-luke.com/no-offset | C (canonical) |
| 9 | ADD COLUMN with a non-volatile DEFAULT is stored in metadata with no rewrite; a volatile default (clock_timestamp(), gen_random_uuid()) rewrites the table and its indexes. | PostgreSQL docs, ALTER TABLE; strong_migrations | C |
| 10 | ADD CONSTRAINT ... NOT VALID skips the scan; VALIDATE CONSTRAINT takes only SHARE UPDATE EXCLUSIVE (plus ROW SHARE on the referenced table for FKs). | ALTER TABLE docs | C |
| 11 | SET NOT NULL skips the scan if a valid CHECK proving no NULLs exists. | ALTER TABLE docs | C |
| 12 | Dangerous operations and safe alternatives: index (concurrently), FK (NOT VALID then VALIDATE), check (same), NOT NULL (check, validate, set, drop check), type change and rename (new column, dual write, backfill, switch reads, drop old), remove column (stop using in code first), unique (concurrent unique index, then attach). | ankane/strong_migrations | C (widely adopted tool) |
| 13 | Set a short lock_timeout (about 10 s) and long statement_timeout (about 1 h) for migrations; app statement_timeout about 15 s. | strong_migrations | P |
| 14 | Backfill in batches, outside the schema-change transaction, throttled. | strong_migrations | C |
| 15 | Firestore: use cursors not offsets (skipped docs are billed reads); an indexed monotonically increasing field caps a collection at about 500 writes/s; 40,000 index entries per document. | Firebase best practices | C |
| 16 | An index on the column an RLS policy filters on took a Supabase test query from 171 ms to under 0.1 ms. | Supabase RLS performance guide | C (vendor benchmark) |

## Sources
- PostgreSQL docs, Constraints: https://www.postgresql.org/docs/current/ddl-constraints.html
- PostgreSQL docs, Multicolumn indexes: https://www.postgresql.org/docs/current/indexes-multicolumn.html
- PostgreSQL docs, CREATE INDEX: https://www.postgresql.org/docs/current/sql-createindex.html
- PostgreSQL docs, ALTER TABLE: https://www.postgresql.org/docs/current/sql-altertable.html
- Markus Winand, No offset: https://use-the-index-luke.com/no-offset
- strong_migrations: https://github.com/ankane/strong_migrations
- Firestore best practices: https://firebase.google.com/docs/firestore/best-practices
- Supabase RLS performance: https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv

## Re-check 2026-10-13
| # | Fact | Result | Quote | URL |
|---|---|---|---|---|
| R1 | Unindexed foreign keys are flagged by Supabase Advisor lint 0001 | Confirmed; level INFO. | "0001_unindexed_foreign_keys ... Level: INFO" | https://supabase.com/docs/guides/database/database-advisors?lint=0001_unindexed_foreign_keys |
| R2 | Index on an RLS policy column: 171 ms to under 0.1 ms | Unchanged (Supabase sample results, 100K row table). | "auth.uid()=user_id | user_id indexed | 171ms | <.1" | https://supabase.com/docs/guides/troubleshooting/rls-performance-and-best-practices-Z5Jjwv |
| R3 | Exact `count(*)` is slow on large tables; `pg_class.reltuples` gives an estimate | New for 07. | "PostgreSQL has to check visibility for all rows, due to the MVCC model." | https://wiki.postgresql.org/wiki/Count_estimate |
| R4 | `FOR UPDATE SKIP LOCKED` skips locked rows and gives an inconsistent view, fit for queues only | New for 07 (waitlist promotion jobs). | "Skipping locked rows provides an inconsistent view of the data, so this is not suitable for general purpose work" | https://www.postgresql.org/docs/current/sql-select.html |
