# Brief 02: Indexes and migrations

Question: what do I index, and how do I change a live schema without downtime or data loss?
After reading, the designer can: derive indexes from query shapes, order composite index columns, use partial and expression indexes, avoid OFFSET pagination at scale, and write expand/contract migrations with safe lock settings.
Must cover: FK columns are not auto-indexed in Postgres; leading-column rule; partial unique index; lower(email) expression index; EXPLAIN basics; N+1; keyset pagination; CREATE INDEX CONCURRENTLY; NOT VALID then VALIDATE; volatile default rewrite; rename and type change via expand/contract; lock_timeout and statement_timeout numbers; backfills in batches; migrations in version control.
Test briefs: "Add a required column to a 5M row table"; "My list page got slow".
