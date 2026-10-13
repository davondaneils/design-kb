-- Measures current_setting(name, true) on a reused connection (v0.2 review, 2026-10-13).
-- Run in ONE psql session; the session stands in for one pooled connection.
-- Result on PostgreSQL 16.15: fresh null; after a set local in an earlier transaction ''; nullif gives null; bare ::uuid raises invalid input syntax for type uuid: "".
select version();
select current_setting('app.current_org', true) is null as fresh_is_null;
begin; set local app.current_org = '7c1e0000-0000-7000-8000-000000000001'; select current_setting('app.current_org', true)::uuid as in_tx; commit;
select current_setting('app.current_org', true) = '' as after_is_empty_string;
select nullif(current_setting('app.current_org', true), '')::uuid as with_nullif;
select current_setting('app.current_org', true)::uuid as bare_cast;
