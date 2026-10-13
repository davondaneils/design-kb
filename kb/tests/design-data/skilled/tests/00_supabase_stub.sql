-- Minimal stand-in for the parts of Supabase that schema.sql relies on, for a scratch PostgreSQL 16.
-- Not part of the deliverable schema: on Supabase these already exist.
--   roles anon, authenticated, service_role (service_role bypasses RLS, like Supabase)
--   schema auth with auth.users and auth.uid() reading the JWT claims PostgREST sets per request
--   extensions schema
do $$ begin
  if not exists (select 1 from pg_roles where rolname = 'anon') then create role anon nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'authenticated') then create role authenticated nologin; end if;
  if not exists (select 1 from pg_roles where rolname = 'service_role') then create role service_role nologin bypassrls; end if;
end $$;

create schema if not exists auth;
create schema if not exists extensions;
grant usage on schema auth to anon, authenticated, service_role;

create table if not exists auth.users (
  id uuid primary key default gen_random_uuid(),
  email text unique,
  created_at timestamptz not null default now()
);

-- Same body as Supabase's auth.uid(): the sub claim of the request JWT, null when absent.
create or replace function auth.uid() returns uuid language sql stable as $$
  select nullif(
    coalesce(current_setting('request.jwt.claim.sub', true),
             (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')),
    '')::uuid
$$;
grant execute on function auth.uid() to anon, authenticated, service_role;

-- Supabase grants schema usage on public to these roles; table privileges come from schema.sql.
grant usage on schema public to anon, authenticated, service_role;
