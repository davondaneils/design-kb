-- Crux: class booking for climbing gyms. PostgreSQL 15+ (Supabase). Tested on PostgreSQL 16.
-- Ownership: every business row is owned by a gym (the tenant) through gym_id, copied onto children and
-- pinned by composite foreign keys so the copy cannot be wrong (design-data expert move 3).
-- Ids: gen_random_uuid() here because the test cluster is PostgreSQL 16; on PostgreSQL 18 swap in uuidv7().
-- Invariants live in the database (constraints and triggers that also run for the service role), not only in
-- the API: capacity, waitlist order, one live booking per member per class, one open subscription per member
-- per gym, pack credits, pass coverage at the time of the class, and the free cancellation window.
--
-- Production delivery: this file is the first migration. Later changes follow design-data reference 02
-- (lock_timeout, create index concurrently in its own file, not valid then validate, expand and contract).

set lock_timeout = '10s';

create extension if not exists btree_gist;   -- "=" inside the instructor EXCLUDE constraint

create schema if not exists private;          -- helpers; never in the API's exposed schemas
create schema if not exists app;              -- RPC functions the API server calls with the caller's JWT

-- ---------------------------------------------------------------------------------------------------------
-- Shared trigger: updated_at
-- ---------------------------------------------------------------------------------------------------------
create or replace function private.set_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------------------------------------------------------------------------------------------------------
-- Gyms (tenants), people, memberships
-- ---------------------------------------------------------------------------------------------------------
create table public.gyms (
  id uuid primary key default gen_random_uuid(),
  name text not null constraint gyms_name_length check (char_length(name) between 1 and 120),
  slug text not null constraint gyms_slug_format check (slug ~ '^[a-z0-9-]{2,48}$'),
  free_cancel_hours integer not null default 12
    constraint gyms_free_cancel_hours_range check (free_cancel_hours between 0 and 168),
  grace_hours integer not null default 168            -- 7 days after a failed payment (brief)
    constraint gyms_grace_hours_range check (grace_hours between 0 and 720),
  stripe_account_id text,                              -- Stripe Connect account; null until the gym connects
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gyms_slug_unique unique (slug),           -- public URL; gym names are public, so no leak
  constraint gyms_stripe_account_unique unique (stripe_account_id)
);
create trigger gyms_updated_at before update on public.gyms
  for each row execute function private.set_updated_at();

-- Product data about a person. The auth provider owns credentials and email (design-data reference 03).
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null constraint profiles_display_name_length check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function private.set_updated_at();

-- One row per person per gym. A person can be a member of several gyms; staff of one gym never see another's.
create table public.gym_members (
  gym_id uuid not null references public.gyms (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member'
    constraint gym_members_role_valid check (role in ('owner', 'staff', 'member')),
  member_code text not null                            -- typed or scanned at the desk
    constraint gym_members_member_code_format check (member_code ~ '^[A-Z0-9]{4,8}$'),
  joined_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (gym_id, user_id),
  -- keyed by gym: the same code in another gym is allowed, and a clash never tells one gym about another
  constraint gym_members_member_code_unique unique (gym_id, member_code)
);
create index gym_members_user_idx on public.gym_members (user_id);   -- "which gyms am I in"; RLS helpers
create trigger gym_members_updated_at before update on public.gym_members
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------------------------------------
-- Locations (walls) and class types
-- ---------------------------------------------------------------------------------------------------------
create table public.locations (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  name text not null constraint locations_name_length check (char_length(name) between 1 and 80),
  time_zone text not null,                             -- IANA name, checked by trigger; times on screen use it
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locations_id_gym_unique unique (id, gym_id)            -- target of composite FKs
);
create unique index locations_name_unique on public.locations (gym_id, lower(name));  -- also the gym_id FK index

create or replace function private.check_time_zone() returns trigger
language plpgsql set search_path = '' as $$
begin
  if not exists (select 1 from pg_catalog.pg_timezone_names where name = new.time_zone) then
    raise exception using errcode = '23514', constraint = 'locations_time_zone_valid',
      message = 'time_zone must be an IANA zone name';
  end if;
  return new;
end $$;
create trigger locations_time_zone before insert or update of time_zone on public.locations
  for each row execute function private.check_time_zone();
create trigger locations_updated_at before update on public.locations
  for each row execute function private.set_updated_at();

create table public.class_types (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  name text not null constraint class_types_name_length check (char_length(name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint class_types_id_gym_unique unique (id, gym_id)
);
create unique index class_types_name_unique on public.class_types (gym_id, lower(name));  -- also the FK index
create trigger class_types_updated_at before update on public.class_types
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------------------------------------
-- Classes. Truth is the wall time at the location (a class is a promise about a clock on the wall);
-- starts_at and ends_at are derived from the location's zone and recomputed when tz data changes.
-- ---------------------------------------------------------------------------------------------------------
create table public.classes (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null,
  location_id uuid not null,
  class_type_id uuid not null,
  instructor_id uuid not null,
  starts_local timestamp not null,
  ends_local timestamp not null,
  starts_at timestamptz not null,                      -- derived by trigger, never written by the API
  ends_at timestamptz not null,
  capacity integer not null constraint classes_capacity_range check (capacity between 1 and 100),
  status text not null default 'scheduled'
    constraint classes_status_valid check (status in ('scheduled', 'cancelled')),
  cancelled_at timestamptz,                            -- set exactly when status = 'cancelled'
  created_by uuid,
  version integer not null default 1,                  -- If-Match on staff edits
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classes_id_gym_unique unique (id, gym_id),
  constraint classes_location_fk foreign key (location_id, gym_id)
    references public.locations (id, gym_id) on delete restrict,
  constraint classes_class_type_fk foreign key (class_type_id, gym_id)
    references public.class_types (id, gym_id) on delete restrict,
  constraint classes_instructor_fk foreign key (gym_id, instructor_id)
    references public.gym_members (gym_id, user_id) on delete restrict,
  constraint classes_created_by_fk foreign key (gym_id, created_by)
    references public.gym_members (gym_id, user_id) on delete set null (created_by),
  constraint classes_ends_after_start check (ends_local > starts_local),
  constraint classes_length_limit check (ends_local - starts_local <= interval '12 hours'),
  constraint classes_cancelled_has_time check ((status = 'cancelled') = (cancelled_at is not null)),
  -- an instructor cannot teach two overlapping classes in the same gym. Keyed by gym on purpose: keyed on the
  -- person alone, the conflict error would tell one gym the instructor is busy at another (expert move 9c).
  constraint classes_instructor_no_overlap exclude using gist
    (gym_id with =, instructor_id with =, tstzrange(starts_at, ends_at) with &&) where (status = 'scheduled')
);
-- schedule screen: one location, one week of wall time (the query also pins gym_id); also the
-- (location_id, gym_id) FK index
create index classes_location_week_idx on public.classes (location_id, gym_id, starts_local);
create index classes_class_type_idx on public.classes (class_type_id, gym_id);      -- FK index
create index classes_instructor_idx on public.classes (gym_id, instructor_id, starts_at);  -- FK; instructor rota
create index classes_created_by_idx on public.classes (gym_id, created_by);          -- FK index
create index classes_gym_starts_idx on public.classes (gym_id, starts_at);          -- owner attendance, 30 days

-- ---------------------------------------------------------------------------------------------------------
-- Passes: a monthly subscription or a 10-class pack, a cache of Stripe written only by the server's sync.
-- ---------------------------------------------------------------------------------------------------------
create table public.passes (
  id uuid primary key default gen_random_uuid(),
  gym_id uuid not null,
  user_id uuid not null,
  kind text not null constraint passes_kind_valid check (kind in ('monthly', 'pack')),
  -- monthly mirrors Stripe subscription statuses exactly; a pack is 'active' or 'refunded'
  status text not null constraint passes_status_valid check (status in
    ('incomplete', 'incomplete_expired', 'trialing', 'active', 'past_due', 'canceled', 'unpaid', 'paused', 'refunded')),
  price_minor bigint not null constraint passes_price_non_negative check (price_minor >= 0),  -- price paid
  currency text not null constraint passes_currency_format check (currency ~ '^[a-z]{3}$'),
  credits_total integer,                               -- packs only (10); null for monthly
  stripe_subscription_id text,                         -- monthly only
  stripe_payment_intent_id text,                       -- packs only
  current_period_end timestamptz,                      -- monthly: from the subscription item (API 2025-03-31.basil)
  cancel_at_period_end boolean not null default false, -- monthly: "Renews" versus "Ends" on screen
  payment_failed_at timestamptz,                       -- monthly: first failed attempt of the open invoice
  grace_ends_at timestamptz,                           -- payment_failed_at + gyms.grace_hours, set by the sync
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint passes_id_member_unique unique (id, gym_id, user_id),
  constraint passes_member_fk foreign key (gym_id, user_id)
    references public.gym_members (gym_id, user_id) on delete restrict,   -- money: never cascade away
  constraint passes_subscription_unique unique (stripe_subscription_id),
  constraint passes_payment_intent_unique unique (stripe_payment_intent_id),
  constraint passes_monthly_shape check (kind <> 'monthly' or (
    stripe_subscription_id is not null and credits_total is null and stripe_payment_intent_id is null
    and status <> 'refunded')),
  constraint passes_pack_shape check (kind <> 'pack' or (
    stripe_payment_intent_id is not null and credits_total is not null and credits_total > 0
    and stripe_subscription_id is null and status in ('active', 'refunded')
    and payment_failed_at is null and grace_ends_at is null)),
  constraint passes_past_due_has_grace check (status <> 'past_due' or (
    payment_failed_at is not null and grace_ends_at is not null and grace_ends_at > payment_failed_at))
);
-- one open subscription per member per gym (a second one double-bills); keyed by gym, so a member's
-- subscription at another gym never blocks or reveals anything here (expert move 9c)
create unique index passes_one_open_subscription on public.passes (gym_id, user_id)
  where kind = 'monthly' and status not in ('canceled', 'incomplete_expired');
create index passes_member_idx on public.passes (gym_id, user_id, created_at);   -- FK index; "my passes"
create trigger passes_updated_at before update on public.passes
  for each row execute function private.set_updated_at();

create table public.stripe_customers (
  gym_id uuid not null,
  user_id uuid not null,
  stripe_customer_id text not null constraint stripe_customers_customer_unique unique,
  created_at timestamptz not null default now(),
  primary key (gym_id, user_id),                       -- one customer per member on the gym's connected account
  constraint stripe_customers_member_fk foreign key (gym_id, user_id)
    references public.gym_members (gym_id, user_id) on delete restrict
);

-- webhook dedupe; the event id is inserted in the same transaction as the sync it triggers
create table public.stripe_events (
  id text primary key,                                 -- evt_...
  stripe_account_id text not null,
  type text not null,
  received_at timestamptz not null default now()
);
create index stripe_events_received_idx on public.stripe_events (received_at);     -- retention purge

-- ---------------------------------------------------------------------------------------------------------
-- Bookings: one row per member per class attempt. Status is one CHECKed column (expert move 4).
-- Waitlist position and places left are computed at read, never stored (expert move 27).
-- ---------------------------------------------------------------------------------------------------------
create table public.bookings (
  id uuid primary key default gen_random_uuid(),       -- the app sends crypto.randomUUID(): retries are no-ops
  gym_id uuid not null,
  class_id uuid not null,
  user_id uuid not null,
  pass_id uuid not null,                               -- what pays for this place
  status text not null constraint bookings_status_valid check (status in
    ('booked', 'waitlisted', 'cancelled', 'late_cancelled', 'attended', 'no_show', 'waitlist_lapsed')),
  waitlisted_at timestamptz,                           -- queue order key with id; null if never waitlisted
  booked_at timestamptz,                               -- when the place was taken (booking or promotion)
  promoted_from_waitlist boolean not null default false,
  cancelled_at timestamptz,
  checked_in_at timestamptz,
  checked_in_by uuid,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_class_fk foreign key (class_id, gym_id)
    references public.classes (id, gym_id) on delete restrict,
  constraint bookings_member_fk foreign key (gym_id, user_id)
    references public.gym_members (gym_id, user_id) on delete restrict,
  constraint bookings_pass_fk foreign key (pass_id, gym_id, user_id)
    references public.passes (id, gym_id, user_id) on delete restrict,
  constraint bookings_checked_in_by_fk foreign key (gym_id, checked_in_by)
    references public.gym_members (gym_id, user_id) on delete set null (checked_in_by),
  constraint bookings_booked_has_time check (status not in ('booked', 'attended', 'no_show') or booked_at is not null),
  constraint bookings_waitlisted_has_time check (status <> 'waitlisted' or waitlisted_at is not null),
  constraint bookings_cancel_has_time check (status not in ('cancelled', 'late_cancelled') or cancelled_at is not null),
  constraint bookings_attended_has_check_in check (status <> 'attended' or (checked_in_at is not null and checked_in_by is not null))
);
-- one live booking per member per class; cancelled rows do not count, so a member who cancelled can book again
create unique index bookings_one_live_per_member on public.bookings (class_id, user_id)
  where status in ('booked', 'waitlisted', 'attended', 'no_show');
create index bookings_class_status_idx on public.bookings (class_id, gym_id, status);  -- FK index; places taken
create index bookings_waitlist_idx on public.bookings (class_id, waitlisted_at, id)
  where status = 'waitlisted';                                                       -- promotion order, rank
create index bookings_member_idx on public.bookings (gym_id, user_id, created_at desc, id desc);  -- FK; my bookings
create index bookings_pass_idx on public.bookings (pass_id, gym_id, user_id);      -- FK index; pack credits
create index bookings_checked_in_by_idx on public.bookings (gym_id, checked_in_by); -- FK index
create trigger bookings_updated_at before update on public.bookings
  for each row execute function private.set_updated_at();

-- ---------------------------------------------------------------------------------------------------------
-- API support: idempotency keys and the append-only audit log
-- ---------------------------------------------------------------------------------------------------------
create table public.idempotency_keys (
  user_id uuid not null references public.profiles (id) on delete cascade,
  key uuid not null,                                   -- one per user intent, reused on retries
  request_fingerprint text not null,                   -- sha256 of method, path and body
  state text not null default 'running' constraint idempotency_keys_state_valid check (state in ('running', 'done')),
  response_status integer,
  response_body jsonb,
  created_at timestamptz not null default now(),
  primary key (user_id, key),
  constraint idempotency_keys_done_has_response check (state <> 'done' or response_status is not null)
);
create index idempotency_keys_created_idx on public.idempotency_keys (created_at);  -- prune after 24 h

create table public.audit_events (                    -- append only, no FKs on purpose (expert move 9)
  id bigint generated always as identity primary key,
  gym_id uuid not null,
  actor_id uuid,                                       -- null for system jobs and webhooks
  action text not null,                                -- 'booking.cancelled_late', 'class.capacity_changed'
  target_type text not null,
  target_id text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_events_gym_idx on public.audit_events (gym_id, created_at desc);

-- ---------------------------------------------------------------------------------------------------------
-- Membership helpers for policies (security definer in an unexposed schema, expert move 17)
-- ---------------------------------------------------------------------------------------------------------
create or replace function private.my_gym_ids() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select gym_id from public.gym_members where user_id = (select auth.uid())
$$;
create or replace function private.my_staff_gym_ids() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select gym_id from public.gym_members where user_id = (select auth.uid()) and role in ('owner', 'staff')
$$;
create or replace function private.my_owner_gym_ids() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select gym_id from public.gym_members where user_id = (select auth.uid()) and role = 'owner'
$$;
-- a profile is visible to its owner and to staff of a gym the person belongs to (never across gyms:
-- staff see a person only because that person joined their gym)
create or replace function private.can_see_profile(p_user_id uuid) returns boolean
language sql stable security definer set search_path = '' as $$
  select p_user_id = (select auth.uid()) or exists (
    select 1 from public.gym_members m
    where m.user_id = p_user_id
      and m.gym_id in (select g from private.my_staff_gym_ids() g))
$$;

-- ---------------------------------------------------------------------------------------------------------
-- Entitlement: one function decides coverage, used by the booking trigger (enforcement) and by the schedule
-- read (capability flags), so the flag and the rule cannot drift (expert move 22).
-- Coverage is checked against the class start, never against now (expert move 9b).
-- ---------------------------------------------------------------------------------------------------------
create or replace function private.pass_covers(p_pass_id uuid, p_starts_at timestamptz) returns boolean
language sql stable security definer set search_path = '' as $$
  select coalesce((
    select case
      when p.kind = 'monthly' and p.status in ('active', 'trialing') then true
      when p.kind = 'monthly' and p.status = 'past_due' then p_starts_at < p.grace_ends_at
      when p.kind = 'pack' and p.status = 'active' then true
      else false end
    from public.passes p where p.id = p_pass_id), false)
$$;

-- statuses that hold a pack credit (a waitlist place holds one so promotion never fails on credits)
create or replace function private.pack_credits_used(p_pass_id uuid, p_except uuid default null) returns integer
language sql stable security definer set search_path = '' as $$
  select count(*)::integer from public.bookings b
  where b.pass_id = p_pass_id
    and b.status in ('booked', 'waitlisted', 'attended', 'no_show', 'late_cancelled')
    and (p_except is null or b.id <> p_except)
$$;

-- the pass a booking would use, or the reason there is none (with the instant that explains it)
create or replace function private.pick_pass(p_gym_id uuid, p_user_id uuid, p_starts_at timestamptz,
  out pass_id uuid, out reason text, out reason_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
declare
  m public.passes;
begin
  select * into m from public.passes p
  where p.gym_id = p_gym_id and p.user_id = p_user_id and p.kind = 'monthly'
    and p.status not in ('canceled', 'incomplete_expired');
  if found and private.pass_covers(m.id, p_starts_at) then
    pass_id := m.id; return;
  end if;
  select p.id into pass_id from public.passes p
  where p.gym_id = p_gym_id and p.user_id = p_user_id and p.kind = 'pack' and p.status = 'active'
    and private.pack_credits_used(p.id) < p.credits_total
  order by p.created_at, p.id limit 1;
  if pass_id is not null then return; end if;
  if m.id is not null and m.status = 'past_due' then
    reason := 'grace_ends_before_class'; reason_at := m.grace_ends_at;
  elsif m.id is not null then
    reason := 'payment_required';
  elsif exists (select 1 from public.passes p where p.gym_id = p_gym_id and p.user_id = p_user_id
                and p.kind = 'pack' and p.status = 'active') then
    reason := 'no_credits_left';
  else
    reason := 'no_pass';
  end if;
end $$;

-- ---------------------------------------------------------------------------------------------------------
-- Class triggers: derived instants, instructor role, capacity never below the places taken (expert move 9a)
-- ---------------------------------------------------------------------------------------------------------
create or replace function private.classes_before_write() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  tz text;
  taken integer;
begin
  select l.time_zone into tz from public.locations l where l.id = new.location_id;
  new.starts_at := new.starts_local at time zone tz;
  new.ends_at := new.ends_local at time zone tz;
  -- a wall time the zone skips (2:30 am on a spring-forward night) silently becomes another hour; refuse it.
  -- A repeated fall-back hour is ambiguous; PostgreSQL takes the later (standard time) instant, documented in the API.
  if (new.starts_at at time zone tz) <> new.starts_local or (new.ends_at at time zone tz) <> new.ends_local then
    raise exception using errcode = '23514', constraint = 'classes_wall_time_exists',
      message = 'that local time does not exist at this location (a daylight saving change skips it)';
  end if;

  if not exists (select 1 from public.gym_members m where m.gym_id = new.gym_id
                 and m.user_id = new.instructor_id and m.role in ('owner', 'staff')) then
    raise exception using errcode = '23514', constraint = 'classes_instructor_is_staff',
      message = 'the instructor must be staff of this gym';
  end if;

  if tg_op = 'UPDATE' then
    if new.capacity < old.capacity then
      -- the UPDATE already holds this class row's lock, which every booking write also takes first,
      -- so this count cannot race a booking (it waits for it, then counts it)
      select count(*) into taken from public.bookings b
      where b.class_id = new.id and b.status in ('booked', 'attended', 'no_show');
      if new.capacity < taken then
        raise exception using errcode = '23514', constraint = 'classes_capacity_not_below_taken',
          message = format('capacity %s is below the %s places already taken', new.capacity, taken),
          detail = json_build_object('taken', taken)::text;
      end if;
    end if;
    if new.starts_local is distinct from old.starts_local or new.ends_local is distinct from old.ends_local
       or new.capacity is distinct from old.capacity or new.status is distinct from old.status then
      new.version := old.version + 1;
    end if;
  end if;
  return new;
end $$;
create trigger classes_before_write before insert or update on public.classes
  for each row execute function private.classes_before_write();
create trigger classes_updated_at before update on public.classes
  for each row execute function private.set_updated_at();

-- a location's zone changes: its classes keep their wall time and re-derive their instants in the same transaction
create or replace function private.locations_rederive() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  update public.classes set starts_local = starts_local where location_id = new.id;
  return null;
end $$;
create trigger locations_rederive after update of time_zone on public.locations
  for each row when (old.time_zone is distinct from new.time_zone)
  execute function private.locations_rederive();

-- ---------------------------------------------------------------------------------------------------------
-- Waitlist promotion: lock the class, fill free places with the first waiting rows by (waitlisted_at, id).
-- Runs from the booking trigger on every path that frees a place and from a capacity raise.
-- ---------------------------------------------------------------------------------------------------------
create or replace function private.promote_waitlist(p_class_id uuid) returns integer
language plpgsql security definer set search_path = '' as $$
declare
  c public.classes;
  free_places integer;
  w public.bookings;
  promoted integer := 0;
begin
  select * into c from public.classes where id = p_class_id for update;
  if c.status <> 'scheduled' or c.starts_at <= now() then
    return 0;
  end if;
  loop
    -- a fresh count each turn: in READ COMMITTED each statement sees the latest committed rows
    select c.capacity - count(*) into free_places from public.bookings b
    where b.class_id = p_class_id and b.status in ('booked', 'attended', 'no_show');
    exit when free_places <= 0;
    select * into w from public.bookings b
    where b.class_id = p_class_id and b.status = 'waitlisted'
    order by b.waitlisted_at, b.id
    limit 1 for update;
    exit when not found;
    if private.pass_covers(w.pass_id, c.starts_at) then
      update public.bookings set status = 'booked', booked_at = now(), promoted_from_waitlist = true
      where id = w.id;
      promoted := promoted + 1;
    else
      update public.bookings set status = 'waitlist_lapsed' where id = w.id;
    end if;
  end loop;
  return promoted;
end $$;

create or replace function private.classes_after_update() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.status = 'cancelled' and old.status = 'scheduled' then
    -- a class the gym cancels refunds every place and waitlist entry (no promotion: the class is cancelled)
    update public.bookings set status = 'cancelled', cancelled_at = now()
    where class_id = new.id and status in ('booked', 'waitlisted');
  elsif new.capacity > old.capacity then
    perform private.promote_waitlist(new.id);
  end if;
  return null;
end $$;
create trigger classes_after_update after update of capacity, status on public.classes
  for each row execute function private.classes_after_update();

-- ---------------------------------------------------------------------------------------------------------
-- Booking guard: holds on every write path, including the service role and the promotion function.
-- ---------------------------------------------------------------------------------------------------------
create or replace function private.bookings_before_write() returns trigger
language plpgsql security definer set search_path = '' as $$
declare
  c public.classes;
  p public.passes;
  taken integer;
  entering_place boolean;
  entering_hold boolean;
begin
  if tg_op = 'UPDATE' then
    if new.class_id <> old.class_id or new.user_id <> old.user_id or new.gym_id <> old.gym_id
       or new.pass_id <> old.pass_id then
      raise exception using errcode = '23514', constraint = 'bookings_identity_immutable',
        message = 'class, member and pass of a booking cannot change';
    end if;
    if new.status <> old.status and not (
         (old.status = 'waitlisted' and new.status in ('booked', 'cancelled', 'waitlist_lapsed'))
      or (old.status = 'booked' and new.status in ('cancelled', 'late_cancelled', 'attended', 'no_show'))
      or (old.status = 'attended' and new.status in ('booked', 'no_show'))
      or (old.status = 'no_show' and new.status = 'attended')) then
      raise exception using errcode = '23514', constraint = 'bookings_status_transition',
        message = format('a booking cannot go from %s to %s', old.status, new.status);
    end if;
  end if;

  entering_place := new.status = 'booked' and (tg_op = 'INSERT' or old.status = 'waitlisted');
  entering_hold := new.status in ('booked', 'waitlisted') and tg_op = 'INSERT';

  if tg_op = 'INSERT' and new.status not in ('booked', 'waitlisted') then
    raise exception using errcode = '23514', constraint = 'bookings_insert_status',
      message = 'a new booking is booked or waitlisted';
  end if;

  if entering_place or entering_hold then
    -- the class row lock serializes every writer that can take a place (expert move 7)
    select * into c from public.classes where id = new.class_id for update;
    if c.status <> 'scheduled' then
      raise exception using errcode = '23514', constraint = 'bookings_class_scheduled', message = 'class_cancelled';
    end if;
    if c.starts_at <= now() then
      raise exception using errcode = '23514', constraint = 'bookings_class_not_started', message = 'class_started';
    end if;
    if not private.pass_covers(new.pass_id, c.starts_at) then
      raise exception using errcode = '23514', constraint = 'bookings_pass_covers_class',
        message = 'the pass does not cover the time of this class';
    end if;
  end if;

  if entering_place then
    select count(*) into taken from public.bookings b
    where b.class_id = new.class_id and b.status in ('booked', 'attended', 'no_show') and b.id <> new.id;
    if taken >= c.capacity then
      raise exception using errcode = '23514', constraint = 'bookings_within_capacity', message = 'class_full';
    end if;
    new.booked_at := coalesce(new.booked_at, now());
  end if;

  if entering_hold then
    select * into p from public.passes where id = new.pass_id for update;   -- serializes credit spending
    if p.kind = 'pack' and private.pack_credits_used(p.id, new.id) >= p.credits_total then
      raise exception using errcode = '23514', constraint = 'bookings_pack_has_credit', message = 'no_credits_left';
    end if;
    if new.status = 'waitlisted' then
      -- taken while holding the class lock, so queue order is lock order; now() is the transaction start and
      -- two joins in one transaction would tie (the id tie-breaker then decides)
      new.waitlisted_at := coalesce(new.waitlisted_at, clock_timestamp());
    end if;
  end if;
  return new;
end $$;
create trigger bookings_before_write before insert or update on public.bookings
  for each row execute function private.bookings_before_write();

create or replace function private.bookings_after_update() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if old.status = 'booked' and new.status in ('cancelled', 'late_cancelled') then
    perform private.promote_waitlist(new.class_id);
  end if;
  return null;
end $$;
create trigger bookings_after_update after update of status on public.bookings
  for each row execute function private.bookings_after_update();

-- ---------------------------------------------------------------------------------------------------------
-- RPC functions (app schema). Security definer because a member must count places taken by other members
-- without reading their rows; each one checks the caller itself and scopes every lookup by the caller's gyms.
-- An object in a gym the caller does not belong to raises P0002 (404 at the API), never 403.
-- ---------------------------------------------------------------------------------------------------------
create or replace function app.book_class(p_class_id uuid, p_booking_id uuid, p_intent text default 'book')
returns public.bookings
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := (select auth.uid());
  c public.classes;
  b public.bookings;
  pick record;
  taken integer;
begin
  if me is null then
    raise exception using errcode = '28000', message = 'not_authenticated';
  end if;
  if p_intent not in ('book', 'waitlist') then
    raise exception using errcode = '22023', message = 'intent must be book or waitlist';
  end if;
  -- idempotent retry: the same client-generated id returns the same booking
  select * into b from public.bookings where id = p_booking_id;
  if found then
    if b.user_id <> me or b.class_id <> p_class_id then
      raise exception using errcode = '23505', constraint = 'bookings_pkey', message = 'booking id already used';
    end if;
    return b;
  end if;

  select * into c from public.classes
  where id = p_class_id and gym_id in (select private.my_gym_ids())
  for update;                                          -- lock first: the count below is the truth
  if not found then
    raise exception using errcode = 'P0002', message = 'class_not_found';
  end if;

  select * into pick from private.pick_pass(c.gym_id, me, c.starts_at);
  if pick.pass_id is null then
    raise exception using errcode = '23514', constraint = 'bookings_pass_covers_class', message = pick.reason,
      detail = json_build_object('reason', pick.reason, 'reason_at', pick.reason_at)::text;
  end if;

  select count(*) into taken from public.bookings
  where class_id = c.id and status in ('booked', 'attended', 'no_show');

  if taken < c.capacity then
    insert into public.bookings (id, gym_id, class_id, user_id, pass_id, status)
    values (p_booking_id, c.gym_id, c.id, me, pick.pass_id, 'booked') returning * into b;
  elsif p_intent = 'waitlist' then
    insert into public.bookings (id, gym_id, class_id, user_id, pass_id, status)
    values (p_booking_id, c.gym_id, c.id, me, pick.pass_id, 'waitlisted') returning * into b;
  else
    raise exception using errcode = '23514', constraint = 'bookings_within_capacity', message = 'class_full',
      detail = json_build_object('remaining', 0)::text;
  end if;
  return b;
end $$;

-- cancel: free up to the gym's window before the start; later counts as a no-show and needs p_accept_late,
-- so a client whose clock or page is stale can never turn a free cancel into a charged one by surprise
create or replace function app.cancel_booking(p_booking_id uuid, p_accept_late boolean default false)
returns public.bookings
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := (select auth.uid());
  b public.bookings;
  c public.classes;
  window_hours integer;
begin
  select * into b from public.bookings
  where id = p_booking_id and (user_id = me or gym_id in (select private.my_staff_gym_ids()))
  for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'booking_not_found';
  end if;
  select * into c from public.classes where id = b.class_id;
  select g.free_cancel_hours into window_hours from public.gyms g where g.id = b.gym_id;
  if c.starts_at <= now() then
    raise exception using errcode = '23514', constraint = 'bookings_class_not_started', message = 'class_started';
  end if;
  if b.status = 'waitlisted' then
    update public.bookings set status = 'cancelled', cancelled_at = now() where id = b.id returning * into b;
  elsif b.status = 'booked' then
    if now() < c.starts_at - make_interval(hours => window_hours) then
      update public.bookings set status = 'cancelled', cancelled_at = now() where id = b.id returning * into b;
    elsif p_accept_late then
      update public.bookings set status = 'late_cancelled', cancelled_at = now() where id = b.id returning * into b;
    else
      raise exception using errcode = '23514', constraint = 'bookings_free_cancel_window',
        message = 'free_cancel_closed',
        detail = json_build_object('free_cancel_until', c.starts_at - make_interval(hours => window_hours))::text;
    end if;
  elsif b.status in ('cancelled', 'late_cancelled') then
    return b;                                           -- idempotent: cancelling twice is not an error
  else
    raise exception using errcode = '23514', constraint = 'bookings_status_transition',
      message = format('a %s booking cannot be cancelled', b.status);
  end if;
  return b;
end $$;

create or replace function app.check_in(p_booking_id uuid) returns public.bookings
language plpgsql security definer set search_path = '' as $$
declare
  me uuid := (select auth.uid());
  b public.bookings;
begin
  select * into b from public.bookings
  where id = p_booking_id and gym_id in (select private.my_staff_gym_ids()) for update;
  if not found then
    raise exception using errcode = 'P0002', message = 'booking_not_found';
  end if;
  if b.status = 'attended' then return b; end if;      -- idempotent
  update public.bookings set status = 'attended', checked_in_at = now(), checked_in_by = me
  where id = b.id returning * into b;
  return b;
end $$;

-- marks places nobody checked into as no-shows; run by a job after each class ends
create or replace function private.close_class(p_class_id uuid) returns integer
language sql security definer set search_path = '' as $$
  with done as (
    update public.bookings b set status = 'no_show'
    from public.classes c
    where c.id = b.class_id and b.class_id = p_class_id and c.ends_at <= now() and b.status = 'booked'
    returning b.id)
  select count(*)::integer from done
$$;
-- waitlist entries for a class that started return their held credit
create or replace function private.lapse_waitlist(p_class_id uuid) returns integer
language sql security definer set search_path = '' as $$
  with done as (
    update public.bookings b set status = 'waitlist_lapsed'
    from public.classes c
    where c.id = b.class_id and b.class_id = p_class_id and c.starts_at <= now() and b.status = 'waitlisted'
    returning b.id)
  select count(*)::integer from done
$$;
-- tz data changed: re-derive future instants from the wall-time truth (the trigger recomputes them)
create or replace function private.recompute_class_instants() returns integer
language sql security definer set search_path = '' as $$
  with done as (
    update public.classes set starts_local = starts_local where starts_at > now() - interval '1 day'
    returning id)
  select count(*)::integer from done
$$;

-- ---------------------------------------------------------------------------------------------------------
-- Schedule read for the member screen: one location, one week of wall time at that location.
-- Every number and state on the screen comes from these columns (hand-over, data-to-screen table).
-- ---------------------------------------------------------------------------------------------------------
create or replace function app.schedule(p_location_id uuid, p_week_start date)
returns table (
  class_id uuid, class_type text, instructor_name text,
  starts_local timestamp, ends_local timestamp, starts_at timestamptz, ends_at timestamptz,
  class_status text, cancelled_at timestamptz, capacity integer, taken integer, places_left integer,
  waitlist_count integer,
  my_booking_id uuid, my_status text, my_waitlist_position integer, my_pass_kind text,
  my_booking_covered boolean, free_cancel_until timestamptz, has_started boolean,
  can_book boolean, can_book_reason text, can_book_reason_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
declare
  me uuid := (select auth.uid());
  loc public.locations;
  window_hours integer;
begin
  select l.* into loc from public.locations l
  where l.id = p_location_id and l.gym_id in (select private.my_gym_ids());
  if not found then
    raise exception using errcode = 'P0002', message = 'location_not_found';
  end if;
  select g.free_cancel_hours into window_hours from public.gyms g where g.id = loc.gym_id;
  return query
  with wk as (
    select c.* from public.classes c
    where c.location_id = loc.id and c.gym_id = loc.gym_id
      and c.starts_local >= p_week_start::timestamp
      and c.starts_local < (p_week_start + 7)::timestamp
  ), counts as (
    select b.class_id,
      count(*) filter (where b.status in ('booked', 'attended', 'no_show'))::integer as taken,
      count(*) filter (where b.status = 'waitlisted')::integer as waiting
    from public.bookings b where b.class_id in (select id from wk)
    group by b.class_id
  ), mine as (
    select distinct on (b.class_id) b.* from public.bookings b
    where b.user_id = me and b.class_id in (select id from wk)
    order by b.class_id, b.created_at desc, b.id desc
  )
  select w.id, t.name, pr.display_name,
    w.starts_local, w.ends_local, w.starts_at, w.ends_at,
    w.status, w.cancelled_at, w.capacity, coalesce(n.taken, 0),
    greatest(w.capacity - coalesce(n.taken, 0), 0),
    coalesce(n.waiting, 0),
    m.id, m.status,
    case when m.status = 'waitlisted' then (
      select count(*)::integer from public.bookings q
      where q.class_id = w.id and q.status = 'waitlisted'
        and (q.waitlisted_at, q.id) <= (m.waitlisted_at, m.id)) end,
    (select p.kind from public.passes p where p.id = m.pass_id),
    case when m.id is not null then private.pass_covers(m.pass_id, w.starts_at) end,
    w.starts_at - make_interval(hours => window_hours),
    w.starts_at <= now(),
    pk.pass_id is not null and w.status = 'scheduled' and w.starts_at > now()
      and (m.status is null or m.status in ('cancelled', 'late_cancelled', 'waitlist_lapsed')),
    case when w.status <> 'scheduled' then 'class_cancelled'
         when w.starts_at <= now() then 'class_started'
         when m.status in ('booked', 'waitlisted', 'attended', 'no_show') then 'already_booked'
         else pk.reason end,
    pk.reason_at
  from wk w
  join public.class_types t on t.id = w.class_type_id
  join public.profiles pr on pr.id = w.instructor_id
  left join counts n on n.class_id = w.id
  left join mine m on m.class_id = w.id
  left join lateral private.pick_pass(w.gym_id, me, w.starts_at) pk on true
  order by w.starts_local, w.id;
end $$;

-- the member's pass at a gym, for the account line and the past-due banner
create or replace function app.my_pass(p_gym_id uuid)
returns table (pass_id uuid, kind text, status text, price_minor bigint, currency text, credits_total integer,
  credits_left integer, current_period_end timestamptz, cancel_at_period_end boolean,
  payment_failed_at timestamptz, grace_ends_at timestamptz)
language sql stable security definer set search_path = '' as $$
  select p.id, p.kind, p.status, p.price_minor, p.currency, p.credits_total,
    case when p.kind = 'pack' then p.credits_total - private.pack_credits_used(p.id) end,
    p.current_period_end, p.cancel_at_period_end, p.payment_failed_at, p.grace_ends_at
  from public.passes p
  where p.gym_id = p_gym_id and p.user_id = (select auth.uid())
    and p_gym_id in (select private.my_gym_ids())
    and p.status not in ('canceled', 'incomplete_expired', 'refunded')
  order by (p.kind = 'monthly') desc, p.created_at
$$;

-- empty week: when the next class at this location starts (wall time), so the screen can offer that week
create or replace function app.next_class_start(p_location_id uuid, p_after_local timestamp) returns timestamp
language sql stable security definer set search_path = '' as $$
  select min(c.starts_local) from public.classes c
  join public.locations l on l.id = c.location_id
  where c.location_id = p_location_id and c.gym_id = l.gym_id and l.gym_id in (select private.my_gym_ids())
    and c.status = 'scheduled' and c.starts_local >= p_after_local
$$;

-- called by the Stripe sync when a pass stops covering (unpaid, canceled, refunded, or grace passed): future
-- places it no longer covers are released free of charge, which promotes the waitlist through the trigger
create or replace function private.release_uncovered_bookings(p_pass_id uuid) returns integer
language sql security definer set search_path = '' as $$
  with done as (
    update public.bookings b set status = 'cancelled', cancelled_at = now()
    from public.classes c
    where c.id = b.class_id and b.pass_id = p_pass_id and b.status in ('booked', 'waitlisted')
      and c.starts_at > now() and not private.pass_covers(b.pass_id, c.starts_at)
    returning b.id)
  select count(*)::integer from done
$$;

-- owners: attendance per class for the last 30 days (the window is enforced here, not in the client)
create or replace function app.attendance(p_gym_id uuid, p_from timestamptz, p_to timestamptz)
returns table (class_id uuid, class_type text, starts_at timestamptz, capacity integer,
  attended integer, no_show integer, late_cancelled integer)
language plpgsql stable security definer set search_path = '' as $$
begin
  if p_gym_id not in (select private.my_owner_gym_ids()) then
    raise exception using errcode = 'P0002', message = 'gym_not_found';
  end if;
  if p_from < now() - interval '30 days' or p_to <= p_from then
    raise exception using errcode = '22023', message = 'period must lie within the last 30 days';
  end if;
  return query
  select c.id, t.name, c.starts_at, c.capacity,
    count(*) filter (where b.status = 'attended')::integer,
    count(*) filter (where b.status = 'no_show')::integer,
    count(*) filter (where b.status = 'late_cancelled')::integer
  from public.classes c
  join public.class_types t on t.id = c.class_type_id
  left join public.bookings b on b.class_id = c.id
  where c.gym_id = p_gym_id and c.starts_at >= p_from and c.starts_at < least(p_to, now())
  group by c.id, t.name
  order by c.starts_at;
end $$;

-- ---------------------------------------------------------------------------------------------------------
-- Grants and row level security. Default deny; grants revoked and given back per role; one policy per
-- operation; writes that move money or places go through the app functions above.
-- ---------------------------------------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema private from public, anon, authenticated;
revoke all on all functions in schema app from public, anon;
grant usage on schema private to authenticated;
grant usage on schema app to authenticated;
grant execute on function private.my_gym_ids(), private.my_staff_gym_ids(), private.my_owner_gym_ids(),
  private.can_see_profile(uuid) to authenticated;
grant execute on function app.book_class(uuid, uuid, text), app.cancel_booking(uuid, boolean),
  app.check_in(uuid), app.schedule(uuid, date), app.my_pass(uuid), app.next_class_start(uuid, timestamp),
  app.attendance(uuid, timestamptz, timestamptz) to authenticated;

alter table public.gyms enable row level security;
alter table public.profiles enable row level security;
alter table public.gym_members enable row level security;
alter table public.locations enable row level security;
alter table public.class_types enable row level security;
alter table public.classes enable row level security;
alter table public.passes enable row level security;
alter table public.stripe_customers enable row level security;   -- server only: no grants, no policies
alter table public.stripe_events enable row level security;      -- server only
alter table public.bookings enable row level security;
alter table public.idempotency_keys enable row level security;   -- server only
alter table public.audit_events enable row level security;       -- server only

grant select on public.gyms to authenticated;
create policy gyms_select on public.gyms for select to authenticated
  using (id in (select private.my_gym_ids()));

grant select, update (display_name) on public.profiles to authenticated;
create policy profiles_select on public.profiles for select to authenticated
  using (private.can_see_profile(id));
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

grant select, insert, update (role), delete on public.gym_members to authenticated;
create policy gym_members_select on public.gym_members for select to authenticated
  using (user_id = (select auth.uid()) or gym_id in (select private.my_staff_gym_ids()));
create policy gym_members_insert on public.gym_members for insert to authenticated
  with check (gym_id in (select private.my_owner_gym_ids()));
create policy gym_members_update on public.gym_members for update to authenticated
  using (gym_id in (select private.my_owner_gym_ids()))
  with check (gym_id in (select private.my_owner_gym_ids()));
create policy gym_members_delete on public.gym_members for delete to authenticated
  using (gym_id in (select private.my_owner_gym_ids()));

grant select, insert, update (name, time_zone) on public.locations to authenticated;
create policy locations_select on public.locations for select to authenticated
  using (gym_id in (select private.my_gym_ids()));
create policy locations_insert on public.locations for insert to authenticated
  with check (gym_id in (select private.my_owner_gym_ids()));
create policy locations_update on public.locations for update to authenticated
  using (gym_id in (select private.my_owner_gym_ids()))
  with check (gym_id in (select private.my_owner_gym_ids()));

grant select, insert, update (name) on public.class_types to authenticated;
create policy class_types_select on public.class_types for select to authenticated
  using (gym_id in (select private.my_gym_ids()));
create policy class_types_insert on public.class_types for insert to authenticated
  with check (gym_id in (select private.my_staff_gym_ids()));
create policy class_types_update on public.class_types for update to authenticated
  using (gym_id in (select private.my_staff_gym_ids()))
  with check (gym_id in (select private.my_staff_gym_ids()));

-- staff publish and edit classes; derived columns (starts_at, ends_at, version) are not grantable
grant select on public.classes to authenticated;
grant insert (id, gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity, created_by)
  on public.classes to authenticated;
grant update (location_id, class_type_id, instructor_id, starts_local, ends_local, capacity, status, cancelled_at)
  on public.classes to authenticated;
create policy classes_select on public.classes for select to authenticated
  using (gym_id in (select private.my_gym_ids()));
create policy classes_insert on public.classes for insert to authenticated
  with check (gym_id in (select private.my_staff_gym_ids()));
create policy classes_update on public.classes for update to authenticated
  using (gym_id in (select private.my_staff_gym_ids()))
  with check (gym_id in (select private.my_staff_gym_ids()));

grant select on public.passes to authenticated;
create policy passes_select on public.passes for select to authenticated
  using (user_id = (select auth.uid()) or gym_id in (select private.my_staff_gym_ids()));

grant select on public.bookings to authenticated;
create policy bookings_select on public.bookings for select to authenticated
  using (user_id = (select auth.uid()) or gym_id in (select private.my_staff_gym_ids()));
