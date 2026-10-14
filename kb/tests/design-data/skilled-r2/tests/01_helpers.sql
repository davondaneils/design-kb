-- Test helpers (schema t, superuser only). Seeds are relative to now() so every test runs on any day.
create schema t;
create table t.ids (name text primary key, id uuid not null);

create function t.id(p_name text) returns uuid language sql stable as $$ select id from t.ids where name = p_name $$;

create function t.person(p_name text) returns uuid language plpgsql as $$
declare u uuid := gen_random_uuid();
begin
  insert into auth.users (id, email) values (u, p_name || '@example.test');
  insert into public.profiles (id, display_name) values (u, initcap(p_name));
  insert into t.ids values (p_name, u);
  return u;
end $$;

-- a gym with one location in p_tz and one class type
create function t.gym(p_slug text, p_tz text default 'America/New_York') returns uuid language plpgsql as $$
declare g uuid; l uuid; ct uuid;
begin
  insert into public.gyms (name, slug) values (initcap(p_slug), replace(p_slug, '_', '-')) returning id into g;
  insert into public.locations (gym_id, name, time_zone) values (g, 'Main wall', p_tz) returning id into l;
  insert into public.class_types (gym_id, name) values (g, 'Intro to Bouldering') returning id into ct;
  insert into t.ids values (p_slug, g), (p_slug || ':loc', l), (p_slug || ':type', ct);
  return g;
end $$;

create function t.join(p_gym text, p_person text, p_role text, p_code text) returns void language sql as $$
  insert into public.gym_members (gym_id, user_id, role, member_code) values (t.id(p_gym), t.id(p_person), p_role, p_code)
$$;

create function t.monthly(p_gym text, p_person text, p_status text default 'active',
  p_grace_ends_in interval default null) returns uuid language plpgsql as $$
declare p uuid;
begin
  insert into public.passes (gym_id, user_id, kind, status, price_minor, currency, stripe_subscription_id,
    current_period_end, payment_failed_at, grace_ends_at)
  values (t.id(p_gym), t.id(p_person), 'monthly', p_status, 13900, 'usd', 'sub_' || replace(gen_random_uuid()::text, '-', ''),
    now() + interval '20 days',
    case when p_status = 'past_due' then now() + p_grace_ends_in - interval '168 hours' end,
    case when p_status = 'past_due' then now() + p_grace_ends_in end)
  returning id into p;
  return p;
end $$;

create function t.pack(p_gym text, p_person text, p_credits integer default 10) returns uuid language plpgsql as $$
declare p uuid;
begin
  insert into public.passes (gym_id, user_id, kind, status, price_minor, currency, credits_total, stripe_payment_intent_id)
  values (t.id(p_gym), t.id(p_person), 'pack', 'active', 22000, 'usd', p_credits, 'pi_' || replace(gen_random_uuid()::text, '-', ''))
  returning id into p;
  return p;
end $$;

-- a class starting p_in from now, wall time computed in the location's zone, 90 minutes long
create function t.class(p_name text, p_gym text, p_instructor text, p_capacity integer, p_in interval)
returns uuid language plpgsql as $$
declare c uuid; tz text;
begin
  select time_zone into tz from public.locations where id = t.id(p_gym || ':loc');
  insert into public.classes (gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity)
  values (t.id(p_gym), t.id(p_gym || ':loc'), t.id(p_gym || ':type'), t.id(p_instructor),
    date_trunc('minute', (now() + p_in) at time zone tz),
    date_trunc('minute', (now() + p_in + interval '90 minutes') at time zone tz), p_capacity)
  returning id into c;
  insert into t.ids values (p_name, c);
  return c;
end $$;

-- book as the member, the way the API does (role authenticated, JWT subject set)
create function t.book_as(p_person text, p_class text, p_intent text default 'book') returns text
language plpgsql as $$
declare b public.bookings;
begin
  perform set_config('request.jwt.claim.sub', t.id(p_person)::text, true);
  set local role authenticated;
  b := app.book_class(t.id(p_class), gen_random_uuid(), p_intent);
  reset role;
  return b.status;
exception when others then
  declare con text; st text;
  begin
    get stacked diagnostics con = constraint_name, st = returned_sqlstate;
    return 'error:' || st || ':' || coalesce(nullif(con, ''), sqlerrm);
  end;
end $$;

create function t.count(p_class text, p_status text) returns integer language sql stable as $$
  select count(*)::integer from public.bookings where class_id = t.id(p_class) and status = p_status
$$;

-- assertions print PASS or FAIL lines; the runner greps for FAIL
create function t.ok(p_cond boolean, p_label text) returns text language sql as $$
  select case when p_cond then 'PASS ' else 'FAIL ' end || p_label
$$;

-- tests call t.id() while acting as authenticated or service_role
grant usage on schema t to authenticated, service_role;
grant select on t.ids to authenticated, service_role;
grant execute on all functions in schema t to authenticated, service_role;
