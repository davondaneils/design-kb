-- Seed for the concurrency and isolation tests and for the screen fixtures. All names are fictional.
-- Gym A: Basalt Climbing (Denver), walls Eastside and Westside. Gym B: Ridgeline Bouldering (Salt Lake City).
-- Maya Okafor is a member of both gyms. Week shown on the screen: Mon, Oct 12 to Sun, Oct 18, 2026, Eastside.
-- Runs as the database owner (seeding bypasses RLS, as a migration seed would).

create or replace function pg_temp.person(p_id uuid, p_name text) returns uuid language sql as $$
  insert into auth.users (id, email) values (p_id, lower(replace(p_name, ' ', '.')) || '@example.test');
  insert into public.profiles (id, display_name) values (p_id, p_name);
  select p_id
$$;

insert into public.gyms (id, name, slug, stripe_account_id) values
  ('a0000000-0000-7000-8000-000000000001', 'Basalt Climbing', 'basalt', 'acct_basalt01'),
  ('b0000000-0000-7000-8000-000000000001', 'Ridgeline Bouldering', 'ridgeline', 'acct_ridge01');
insert into public.locations (id, gym_id, name, time_zone) values
  ('a1000000-0000-7000-8000-000000000001', 'a0000000-0000-7000-8000-000000000001', 'Eastside', 'America/Denver'),
  ('a1000000-0000-7000-8000-000000000002', 'a0000000-0000-7000-8000-000000000001', 'Westside', 'America/Denver'),
  ('b1000000-0000-7000-8000-000000000001', 'b0000000-0000-7000-8000-000000000001', 'Main hall', 'America/Denver');
insert into public.class_types (id, gym_id, name) values
  ('a2000000-0000-7000-8000-000000000001', 'a0000000-0000-7000-8000-000000000001', 'Intro to Bouldering'),
  ('a2000000-0000-7000-8000-000000000002', 'a0000000-0000-7000-8000-000000000001', 'Lead Climbing Course'),
  ('a2000000-0000-7000-8000-000000000003', 'a0000000-0000-7000-8000-000000000001', 'Youth Club'),
  ('b2000000-0000-7000-8000-000000000001', 'b0000000-0000-7000-8000-000000000001', 'Intro to Bouldering');

-- People. u0..: gym A staff; m01..m40: gym A members; Maya: both; Lee: gym B staff; n01..n05: gym B members.
select pg_temp.person('c0000000-0000-7000-8000-000000000001', 'Dana Ruiz');      -- A owner
select pg_temp.person('c0000000-0000-7000-8000-000000000002', 'Priya');          -- A staff, instructor
select pg_temp.person('c0000000-0000-7000-8000-000000000003', 'Jonah');          -- A staff, instructor
select pg_temp.person('c0000000-0000-7000-8000-000000000004', 'Sam');            -- A staff, instructor
select pg_temp.person('c0000000-0000-7000-8000-0000000000aa', 'Maya Okafor');    -- member of A and B
select pg_temp.person('c0000000-0000-7000-8000-0000000000bb', 'Lee Tran');       -- B staff
select pg_temp.person(('d0000000-0000-7000-8000-0000000000' || lpad(i::text, 2, '0'))::uuid, 'Member A' || i) from generate_series(1, 40) i;
select pg_temp.person(('e0000000-0000-7000-8000-0000000000' || lpad(i::text, 2, '0'))::uuid, 'Member B' || i) from generate_series(1, 5) i;

insert into public.gym_memberships (gym_id, user_id, role) values
  ('a0000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-000000000001', 'owner'),
  ('a0000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-000000000002', 'staff'),
  ('a0000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-000000000003', 'staff'),
  ('a0000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-000000000004', 'staff'),
  ('a0000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-0000000000aa', 'member'),
  ('b0000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-0000000000aa', 'member'),
  ('b0000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-0000000000bb', 'staff');
insert into public.gym_memberships (gym_id, user_id, role)
select 'a0000000-0000-7000-8000-000000000001', ('d0000000-0000-7000-8000-0000000000' || lpad(i::text, 2, '0'))::uuid, 'member' from generate_series(1, 40) i;
insert into public.gym_memberships (gym_id, user_id, role)
select 'b0000000-0000-7000-8000-000000000001', ('e0000000-0000-7000-8000-0000000000' || lpad(i::text, 2, '0'))::uuid, 'member' from generate_series(1, 5) i;

-- Passes. Monthly passes mirror Stripe subscriptions (the sync writes these; here the seed does).
insert into public.passes (id, gym_id, user_id, kind, status, stripe_subscription_id, price_minor, currency, current_period_end)
values ('f0000000-0000-7000-8000-0000000000aa', 'a0000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-0000000000aa',
        'monthly', 'active', 'sub_mayaA', 8900, 'usd', '2026-11-03T06:00:00Z'),
       ('f0000000-0000-7000-8000-0000000000ab', 'b0000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-0000000000aa',
        'monthly', 'active', 'sub_mayaB', 7500, 'usd', '2026-10-28T06:00:00Z');
insert into public.passes (gym_id, user_id, kind, status, stripe_subscription_id, price_minor, currency, current_period_end)
select 'a0000000-0000-7000-8000-000000000001', ('d0000000-0000-7000-8000-0000000000' || lpad(i::text, 2, '0'))::uuid,
       'monthly', 'active', 'sub_a' || i, 8900, 'usd', '2026-11-10T06:00:00Z' from generate_series(1, 40) i;
insert into public.passes (gym_id, user_id, kind, status, stripe_subscription_id, price_minor, currency, current_period_end)
select 'b0000000-0000-7000-8000-000000000001', ('e0000000-0000-7000-8000-0000000000' || lpad(i::text, 2, '0'))::uuid,
       'monthly', 'active', 'sub_b' || i, 7500, 'usd', '2026-11-10T06:00:00Z' from generate_series(1, 5) i;

-- The screen week at Eastside (wall-clock times; instants are derived by trigger).
insert into public.classes (id, gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity) values
  ('a3000000-0000-7000-8000-000000000001', 'a0000000-0000-7000-8000-000000000001', 'a1000000-0000-7000-8000-000000000001', 'a2000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-000000000003', '2026-10-12 18:00', '2026-10-12 19:30', 10),
  ('a3000000-0000-7000-8000-000000000002', 'a0000000-0000-7000-8000-000000000001', 'a1000000-0000-7000-8000-000000000001', 'a2000000-0000-7000-8000-000000000002', 'c0000000-0000-7000-8000-000000000002', '2026-10-13 18:30', '2026-10-13 20:30', 8),
  ('a3000000-0000-7000-8000-000000000003', 'a0000000-0000-7000-8000-000000000001', 'a1000000-0000-7000-8000-000000000001', 'a2000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-000000000004', '2026-10-14 07:00', '2026-10-14 08:30', 10),
  ('a3000000-0000-7000-8000-000000000004', 'a0000000-0000-7000-8000-000000000001', 'a1000000-0000-7000-8000-000000000001', 'a2000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-000000000003', '2026-10-15 18:00', '2026-10-15 19:30', 10),
  ('a3000000-0000-7000-8000-000000000005', 'a0000000-0000-7000-8000-000000000001', 'a1000000-0000-7000-8000-000000000001', 'a2000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-000000000004', '2026-10-16 18:00', '2026-10-16 19:30', 10),
  ('a3000000-0000-7000-8000-000000000006', 'a0000000-0000-7000-8000-000000000001', 'a1000000-0000-7000-8000-000000000001', 'a2000000-0000-7000-8000-000000000003', 'c0000000-0000-7000-8000-000000000004', '2026-10-17 09:00', '2026-10-17 10:30', 12),
  ('a3000000-0000-7000-8000-000000000007', 'a0000000-0000-7000-8000-000000000001', 'a1000000-0000-7000-8000-000000000001', 'a2000000-0000-7000-8000-000000000002', 'c0000000-0000-7000-8000-000000000002', '2026-10-17 13:00', '2026-10-17 15:00', 8),
  ('a3000000-0000-7000-8000-000000000008', 'a0000000-0000-7000-8000-000000000001', 'a1000000-0000-7000-8000-000000000001', 'a2000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-000000000003', '2026-10-18 10:00', '2026-10-18 11:30', 10),
  -- Westside opens later: nothing this week, first class the week of Oct 26.
  ('a3000000-0000-7000-8000-000000000009', 'a0000000-0000-7000-8000-000000000001', 'a1000000-0000-7000-8000-000000000002', 'a2000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-000000000004', '2026-10-27 18:00', '2026-10-27 19:30', 10);
-- Gym B: one class this week (Maya is booked there too).
insert into public.classes (id, gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity) values
  ('b3000000-0000-7000-8000-000000000001', 'b0000000-0000-7000-8000-000000000001', 'b1000000-0000-7000-8000-000000000001', 'b2000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-0000000000bb', '2026-10-16 18:00', '2026-10-16 19:30', 10);

-- Bookings for the screen week. m(i) = member A i. Fixed timestamps so the fixtures are stable.
create or replace function pg_temp.m(i integer) returns uuid language sql immutable as $$
  select ('d0000000-0000-7000-8000-0000000000' || lpad(i::text, 2, '0'))::uuid $$;
create or replace function pg_temp.pass_of(u uuid, g uuid) returns uuid language sql stable as $$
  select id from public.passes where user_id = u and gym_id = g and kind = 'monthly' limit 1 $$;
create or replace function pg_temp.book(cls uuid, u uuid, st text, at timestamptz) returns void language sql as $$
  insert into public.bookings (gym_id, class_id, user_id, pass_id, status, confirmed_at, waitlisted_at, free_cancel_until,
                               checked_in_at, created_at)
  select c.gym_id, c.id, u, pg_temp.pass_of(u, c.gym_id), st,
         case when st <> 'waitlisted' then at end,
         case when st = 'waitlisted' then at end,
         case when st <> 'waitlisted' then c.starts_at - interval '12 hours' end,
         case when st = 'attended' then c.starts_at - interval '10 minutes' end,
         at
    from public.classes c where c.id = cls
$$;

-- 1. Mon 6:00 pm Intro (ended): Maya and 8 others attended, 1 no-show.
select pg_temp.book('a3000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-0000000000aa', 'attended', '2026-10-05T15:00:00Z');
select pg_temp.book('a3000000-0000-7000-8000-000000000001', pg_temp.m(i), 'attended', '2026-10-06T15:00:00Z'::timestamptz + i * interval '1 minute') from generate_series(1, 8) i;
select pg_temp.book('a3000000-0000-7000-8000-000000000001', pg_temp.m(9), 'no_show', '2026-10-06T16:00:00Z');
-- 2. Tue 6:30 pm Lead: full (Maya + 7), 2 waiting. Maya booked Oct 6.
select pg_temp.book('a3000000-0000-7000-8000-000000000002', 'c0000000-0000-7000-8000-0000000000aa', 'confirmed', '2026-10-06T14:00:00Z');
select pg_temp.book('a3000000-0000-7000-8000-000000000002', pg_temp.m(10 + i), 'confirmed', '2026-10-07T15:00:00Z'::timestamptz + i * interval '1 minute') from generate_series(1, 7) i;
select pg_temp.book('a3000000-0000-7000-8000-000000000002', pg_temp.m(20 + i), 'waitlisted', '2026-10-09T15:00:00Z'::timestamptz + i * interval '1 minute') from generate_series(1, 2) i;
-- 3. Wed 7:00 am Intro: 6 of 10.
select pg_temp.book('a3000000-0000-7000-8000-000000000003', pg_temp.m(i), 'confirmed', '2026-10-08T15:00:00Z'::timestamptz + i * interval '1 minute') from generate_series(1, 6) i;
-- 4. Thu 6:00 pm Intro: full, 3 waiting, Maya 2nd.
select pg_temp.book('a3000000-0000-7000-8000-000000000004', pg_temp.m(i), 'confirmed', '2026-10-08T15:00:00Z'::timestamptz + i * interval '1 minute') from generate_series(11, 20) i;
select pg_temp.book('a3000000-0000-7000-8000-000000000004', pg_temp.m(31), 'waitlisted', '2026-10-10T15:00:00Z');
select pg_temp.book('a3000000-0000-7000-8000-000000000004', 'c0000000-0000-7000-8000-0000000000aa', 'waitlisted', '2026-10-11T02:12:00Z');
select pg_temp.book('a3000000-0000-7000-8000-000000000004', pg_temp.m(32), 'waitlisted', '2026-10-12T15:00:00Z');
-- 5. Fri 6:00 pm Intro: Maya and 4 booked, then the gym cancels the class (trigger cancels the bookings).
select pg_temp.book('a3000000-0000-7000-8000-000000000005', 'c0000000-0000-7000-8000-0000000000aa', 'confirmed', '2026-10-09T15:00:00Z');
select pg_temp.book('a3000000-0000-7000-8000-000000000005', pg_temp.m(i), 'confirmed', '2026-10-09T16:00:00Z'::timestamptz + i * interval '1 minute') from generate_series(1, 4) i;
update public.classes set status = 'cancelled', cancelled_at = '2026-10-12T18:20:00Z' where id = 'a3000000-0000-7000-8000-000000000005';
-- 6. Sat 9:00 am Youth Club: 9 of 12.
select pg_temp.book('a3000000-0000-7000-8000-000000000006', pg_temp.m(i), 'confirmed', '2026-10-08T15:00:00Z'::timestamptz + i * interval '1 minute') from generate_series(21, 29) i;
-- 7. Sat 1:00 pm Lead: full, nobody waiting.
select pg_temp.book('a3000000-0000-7000-8000-000000000007', pg_temp.m(i), 'confirmed', '2026-10-08T15:00:00Z'::timestamptz + i * interval '1 minute') from generate_series(1, 8) i;
-- 8. Sun 10:00 am Intro: Maya and 6 others.
select pg_temp.book('a3000000-0000-7000-8000-000000000008', 'c0000000-0000-7000-8000-0000000000aa', 'confirmed', '2026-10-12T03:40:00Z');
select pg_temp.book('a3000000-0000-7000-8000-000000000008', pg_temp.m(i), 'confirmed', '2026-10-10T15:00:00Z'::timestamptz + i * interval '1 minute') from generate_series(33, 38) i;
-- Gym B: Maya booked at Ridgeline on Friday.
select pg_temp.book('b3000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-0000000000aa', 'confirmed', '2026-10-10T15:00:00Z');
select pg_temp.book('b3000000-0000-7000-8000-000000000001', ('e0000000-0000-7000-8000-00000000000' || i)::uuid, 'confirmed', '2026-10-10T16:00:00Z') from generate_series(1, 3) i;
