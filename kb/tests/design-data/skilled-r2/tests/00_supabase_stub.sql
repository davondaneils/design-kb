-- Stand-in for the parts of Supabase the schema relies on: the auth schema, auth.users, auth.uid(),
-- and the anon, authenticated and service_role roles (service_role bypasses RLS, as on Supabase).
-- auth.uid() reads the JWT subject the API sets per transaction; nullif makes an unset claim null, never ''::uuid.
create role anon nologin noinherit;
create role authenticated nologin noinherit;
create role service_role nologin noinherit bypassrls;
create schema auth;
create table auth.users (id uuid primary key, email text not null);
create function auth.uid() returns uuid language sql stable as $$
  select nullif(current_setting('request.jwt.claim.sub', true), '')::uuid
$$;
grant usage on schema auth to anon, authenticated, service_role;
grant execute on function auth.uid() to anon, authenticated, service_role;
grant usage on schema public to anon, authenticated, service_role;
-- Supabase's default privileges grant every new table and function in public to anon, authenticated and
-- service_role; the schema must revoke them (it does). Mirrored here so that revoke is tested, not assumed.
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on functions to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;
