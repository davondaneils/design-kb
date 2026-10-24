-- Crux: class booking for climbing gyms
-- Postgres 15+, written for Supabase (auth.users, auth.uid(), PostgREST roles).
--
-- Design summary
--   * Every tenant-owned row carries tenant_id. Child tables reference parents with
--     composite foreign keys (tenant_id, id) so a row can never point across tenants.
--   * Times are timestamptz (UTC instants). Each location stores an IANA time zone;
--     clients render times in the location's zone, never the device's.
--   * Money is integer minor units (bigint) plus an ISO 4217 currency code.
--   * Booking, cancelling, waitlist promotion and check-in happen only inside
--     SECURITY DEFINER functions that lock the class_sessions row first. That lock
--     serialises everything that changes the seat count for one class, so the last
--     place cannot be sold twice and one freed place cannot promote two people.
--     CHECK constraints and a partial unique index are the backstop if code is wrong.
--   * Clients can read through RLS but cannot insert or update bookings, counters,
--     subscriptions or packs directly. Stripe state is written only by the webhook
--     handler using the service role.

create extension if not exists btree_gist;   -- instructor overlap exclusion
create extension if not exists citext;

create schema if not exists private;         -- not exposed through PostgREST
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to authenticated;  -- policies call helpers here

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------
create type public.member_role as enum ('member', 'staff', 'owner');
create type public.session_status as enum ('scheduled', 'cancelled');
create type public.booking_status as enum (
  'booked',           -- holds a place
  'waitlisted',       -- in the queue, no place, no credit spent
  'cancelled',        -- left freely (booking before the deadline, or left the waitlist)
  'late_cancelled',   -- cancelled after the free deadline; counts as a no-show
  'attended',         -- checked in at the desk
  'no_show',          -- booked, never checked in
  'waitlist_lapsed'   -- skipped at promotion time because the member had no valid entitlement
);
create type public.plan_kind as enum ('monthly_pass', 'class_pack');
create type public.subscription_status as enum ('incomplete', 'active', 'past_due', 'canceled', 'unpaid');

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------
-- Valid IANA zone check. Marked immutable so it can sit in a CHECK; the zone
-- list only changes with a Postgres tzdata upgrade, which never removes zones.
create function private.is_valid_timezone(tz text)
returns boolean language sql immutable strict as $$
  select exists (select 1 from pg_catalog.pg_timezone_names where name = tz)
$$;

-- ---------------------------------------------------------------------------
-- Tenancy
-- ---------------------------------------------------------------------------
create table public.tenants (
  id                uuid primary key default gen_random_uuid(),
  slug              text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and length(slug) <= 40),
  name              text not null check (length(name) between 1 and 120),
  currency          char(3) not null check (currency ~ '^[A-Z]{3}$'),
  stripe_account_id text unique,                    -- Stripe Connect account; null until onboarded
  created_at        timestamptz not null default now()
);

create table public.locations (
  id          uuid primary key default gen_random_uuid(),
  tenant_id   uuid not null references public.tenants (id) on delete restrict,
  name        text not null check (length(name) between 1 and 80),
  address     text not null,
  timezone    text not null check (private.is_valid_timezone(timezone)),
  created_at  timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, name)
);

-- One row per person per gym. Personal details live here, per tenant, so a
-- member who joins two gyms shares nothing between them by default. There is
-- deliberately no global "profiles" table that staff could read.
create table public.tenant_users (
  tenant_id          uuid not null references public.tenants (id) on delete restrict,
  user_id            uuid not null references auth.users (id) on delete restrict,
  role               public.member_role not null default 'member',
  display_name       text not null check (length(display_name) between 1 and 80),
  email              citext not null,
  phone              text,
  stripe_customer_id text unique,                   -- customer on the tenant's Connect account
  joined_at          timestamptz not null default now(),
  primary key (tenant_id, user_id)
);
create index tenant_users_user_idx on public.tenant_users (user_id);
create index tenant_users_staff_idx on public.tenant_users (tenant_id) where role in ('staff', 'owner');

-- ---------------------------------------------------------------------------
-- Catalogue and schedule
-- ---------------------------------------------------------------------------
create table public.class_types (
  id                uuid primary key default gen_random_uuid(),
  tenant_id         uuid not null references public.tenants (id) on delete restrict,
  name              text not null check (length(name) between 1 and 60),
  description       text not null default '',
  level             text check (level in ('beginner', 'intermediate', 'advanced', 'youth')),
  default_capacity  smallint not null default 10 check (default_capacity between 1 and 60),
  default_minutes   smallint not null default 90 check (default_minutes between 15 and 480),
  archived_at       timestamptz,
  created_at        timestamptz not null default now(),
  unique (tenant_id, id),
  unique (tenant_id, name)
);

create table public.class_sessions (
  id                  uuid primary key default gen_random_uuid(),
  tenant_id           uuid not null,
  location_id         uuid not null,
  class_type_id       uuid not null,
  instructor_user_id  uuid not null,
  starts_at           timestamptz not null,
  ends_at             timestamptz not null,
  capacity            smallint not null check (capacity between 1 and 60),
  booked_count        smallint not null default 0,  -- maintained only by booking functions
  waitlist_count      smallint not null default 0,  -- maintained only by booking functions
  status              public.session_status not null default 'scheduled',
  cancelled_at        timestamptz,
  cancel_reason       text,
  created_by          uuid not null,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique (tenant_id, id),
  foreign key (tenant_id) references public.tenants (id) on delete restrict,
  foreign key (tenant_id, location_id) references public.locations (tenant_id, id) on delete restrict,
  foreign key (tenant_id, class_type_id) references public.class_types (tenant_id, id) on delete restrict,
  foreign key (tenant_id, instructor_user_id) references public.tenant_users (tenant_id, user_id) on delete restrict,
  foreign key (tenant_id, created_by) references public.tenant_users (tenant_id, user_id) on delete restrict,
  check (ends_at > starts_at and ends_at <= starts_at + interval '8 hours'),
  check (booked_count between 0 and capacity),       -- last line of defence against overbooking
  check (waitlist_count >= 0),
  check ((status = 'cancelled') = (cancelled_at is not null)),
  -- one instructor cannot teach two overlapping live classes
  constraint class_sessions_instructor_no_overlap
    exclude using gist (instructor_user_id with =, tstzrange(starts_at, ends_at) with &&)
    where (status = 'scheduled')
);
create index class_sessions_location_week_idx on public.class_sessions (location_id, starts_at);
create index class_sessions_tenant_start_idx  on public.class_sessions (tenant_id, starts_at);
create index class_sessions_type_idx          on public.class_sessions (tenant_id, class_type_id);
create index class_sessions_instructor_idx    on public.class_sessions (tenant_id, instructor_user_id, starts_at);
create index class_sessions_created_by_idx    on public.class_sessions (tenant_id, created_by);

-- ---------------------------------------------------------------------------
-- Billing (Stripe is the source of truth; these rows mirror it via webhooks)
-- ---------------------------------------------------------------------------
create table public.plans (
  id               uuid primary key default gen_random_uuid(),
  tenant_id        uuid not null references public.tenants (id) on delete restrict,
  kind             public.plan_kind not null,
  name             text not null,
  price_amount     bigint not null check (price_amount > 0),   -- minor units, e.g. 5500 = 55.00
  currency         char(3) not null check (currency ~ '^[A-Z]{3}$'),
  class_credits    smallint check (class_credits between 1 and 100),
  validity_days    smallint check (validity_days between 1 and 730),
  stripe_price_id  text not null unique,
  active           boolean not null default true,
  created_at       timestamptz not null default now(),
  unique (tenant_id, id),
  check ((kind = 'class_pack') = (class_credits is not null)),
  check ((kind = 'class_pack') = (validity_days is not null))
);
create index plans_tenant_idx on public.plans (tenant_id) where active;

create table public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  tenant_id               uuid not null,
  member_user_id          uuid not null,
  plan_id                 uuid not null,
  stripe_subscription_id  text not null unique,
  status                  public.subscription_status not null,
  current_period_end      timestamptz not null,
  payment_failed_at       timestamptz,        -- first failed charge of the current dunning cycle
  grace_until             timestamptz,        -- payment_failed_at + 7 days, set by the webhook handler
  canceled_at             timestamptz,
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now(),
  unique (tenant_id, id),
  foreign key (tenant_id, member_user_id) references public.tenant_users (tenant_id, user_id) on delete restrict,
  foreign key (tenant_id, plan_id) references public.plans (tenant_id, id) on delete restrict,
  check (status <> 'past_due' or (payment_failed_at is not null and grace_until is not null)),
  check (grace_until is null or grace_until > payment_failed_at)
);
-- at most one open pass per member per gym
create unique index subscriptions_one_open_idx on public.subscriptions (tenant_id, member_user_id)
  where status in ('incomplete', 'active', 'past_due');
create index subscriptions_plan_idx on public.subscriptions (tenant_id, plan_id);

create table public.class_packs (
  id                        uuid primary key default gen_random_uuid(),
  tenant_id                 uuid not null,
  member_user_id            uuid not null,
  plan_id                   uuid not null,
  credits_total             smallint not null check (credits_total between 1 and 100),
  credits_used              smallint not null default 0,
  purchased_at              timestamptz not null,
  expires_at                timestamptz not null,
  stripe_payment_intent_id  text not null unique,   -- webhook replays cannot create a second pack
  refunded_at               timestamptz,
  created_at                timestamptz not null default now(),
  unique (tenant_id, id),
  foreign key (tenant_id, member_user_id) references public.tenant_users (tenant_id, user_id) on delete restrict,
  foreign key (tenant_id, plan_id) references public.plans (tenant_id, id) on delete restrict,
  check (credits_used between 0 and credits_total),
  check (expires_at > purchased_at)
);
create index class_packs_member_open_idx on public.class_packs (tenant_id, member_user_id, expires_at)
  where credits_used < credits_total and refunded_at is null;
create index class_packs_plan_idx on public.class_packs (tenant_id, plan_id);

-- ---------------------------------------------------------------------------
-- Bookings and waitlist (one table: a waitlist entry is a booking without a place)
-- ---------------------------------------------------------------------------
create table public.bookings (
  id                 uuid primary key default gen_random_uuid(),
  tenant_id          uuid not null,
  session_id         uuid not null,
  member_user_id     uuid not null,
  status             public.booking_status not null,
  subscription_id    uuid,             -- what paid for the place (exactly one once booked)
  class_pack_id      uuid,
  waitlisted_at      timestamptz,      -- queue order key; kept after promotion for audit
  booked_at          timestamptz,
  free_cancel_until  timestamptz,      -- usually starts_at - 12h; later if promoted inside the window
  cancelled_at       timestamptz,
  checked_in_at      timestamptz,
  checked_in_by      uuid,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now(),
  unique (tenant_id, id),
  foreign key (tenant_id, session_id) references public.class_sessions (tenant_id, id) on delete restrict,
  foreign key (tenant_id, member_user_id) references public.tenant_users (tenant_id, user_id) on delete restrict,
  foreign key (tenant_id, checked_in_by) references public.tenant_users (tenant_id, user_id) on delete restrict,
  foreign key (tenant_id, subscription_id) references public.subscriptions (tenant_id, id) on delete restrict,
  foreign key (tenant_id, class_pack_id) references public.class_packs (tenant_id, id) on delete restrict,
  check (status <> 'waitlisted' or (waitlisted_at is not null and booked_at is null
                                    and subscription_id is null and class_pack_id is null)),
  check (status not in ('booked', 'attended', 'no_show', 'late_cancelled')
         or (booked_at is not null and free_cancel_until is not null
             and num_nonnulls(subscription_id, class_pack_id) = 1)),
  check ((status = 'attended') = (checked_in_at is not null)),
  check ((checked_in_at is null) = (checked_in_by is null)),
  check (status not in ('cancelled', 'late_cancelled') or cancelled_at is not null)
);
-- a member holds at most one live entry (place or queue slot) per class
create unique index bookings_one_live_idx on public.bookings (session_id, member_user_id)
  where status in ('booked', 'waitlisted', 'attended', 'no_show');
create index bookings_waitlist_order_idx on public.bookings (session_id, waitlisted_at, id)
  where status = 'waitlisted';
create index bookings_session_idx       on public.bookings (tenant_id, session_id, status);
create index bookings_member_idx        on public.bookings (tenant_id, member_user_id, created_at desc);
create index bookings_member_global_idx on public.bookings (member_user_id, created_at desc);
create index bookings_subscription_idx  on public.bookings (tenant_id, subscription_id) where subscription_id is not null;
create index bookings_pack_idx          on public.bookings (tenant_id, class_pack_id) where class_pack_id is not null;
create index bookings_checked_in_by_idx on public.bookings (tenant_id, checked_in_by) where checked_in_by is not null;

-- ---------------------------------------------------------------------------
-- Infrastructure: idempotency and webhook dedupe (service role only)
-- ---------------------------------------------------------------------------
create table public.idempotency_keys (
  user_id          uuid not null references auth.users (id) on delete cascade,
  key              text not null check (length(key) between 8 and 255),
  method_path      text not null,              -- e.g. 'POST /v1/sessions/{id}/bookings'
  request_sha256   bytea not null,             -- same key, different body => 422
  response_status  smallint,                   -- null while the first request is in flight
  response_body    jsonb,
  created_at       timestamptz not null default now(),
  primary key (user_id, key)
);
create index idempotency_keys_created_idx on public.idempotency_keys (created_at);  -- purge after 24h

create table public.stripe_events (
  id            text primary key,              -- Stripe evt_ id; insert ... on conflict do nothing
  account_id    text,                          -- Connect account the event came from
  type          text not null,
  payload       jsonb not null,
  received_at   timestamptz not null default now(),
  processed_at  timestamptz
);
create index stripe_events_unprocessed_idx on public.stripe_events (received_at) where processed_at is null;

-- ---------------------------------------------------------------------------
-- Access helpers (SECURITY DEFINER so RLS policies can call them without recursion)
-- ---------------------------------------------------------------------------
create function private.my_role(p_tenant uuid)
returns public.member_role language sql stable security definer set search_path = '' as $$
  select tu.role from public.tenant_users tu
  where tu.tenant_id = p_tenant and tu.user_id = (select auth.uid())
$$;

create function private.is_member(p_tenant uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select private.my_role(p_tenant) is not null
$$;

create function private.is_staff(p_tenant uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(private.my_role(p_tenant) in ('staff', 'owner'), false)
$$;

create function private.is_owner(p_tenant uuid)
returns boolean language sql stable security definer set search_path = '' as $$
  select coalesce(private.my_role(p_tenant) = 'owner', false)
$$;

-- Raise a machine-readable error. The API maps the SQLSTATE and the code in
-- DETAIL to the problem+json body (see api.md).
create function private.fail(p_code text, p_message text, p_state text default 'P0001')
returns void language plpgsql as $$
begin
  raise exception using errcode = p_state, message = p_message, detail = p_code;
end $$;

-- What would pay for a place in this class right now. Pass beats pack.
-- Returns (kind, id) or no row.
create function private.pick_entitlement(p_tenant uuid, p_member uuid, p_starts_at timestamptz)
returns table (kind public.plan_kind, ref_id uuid)
language sql stable security definer set search_path = '' as $$
  (select 'monthly_pass'::public.plan_kind, s.id
     from public.subscriptions s
    where s.tenant_id = p_tenant and s.member_user_id = p_member
      and (s.status = 'active'
           or (s.status = 'past_due' and now() < s.grace_until and p_starts_at < s.grace_until))
    limit 1)
  union all
  (select 'class_pack'::public.plan_kind, p.id
     from public.class_packs p
    where p.tenant_id = p_tenant and p.member_user_id = p_member
      and p.refunded_at is null and p.credits_used < p.credits_total
      and p.expires_at > p_starts_at
    order by p.expires_at, p.id          -- spend the pack that expires first
    limit 1)
  limit 1
$$;

-- ---------------------------------------------------------------------------
-- Write path. All seat-changing work locks the class_sessions row first.
-- ---------------------------------------------------------------------------

-- Gives a place to p_booking (a waitlisted or new row) using an entitlement.
-- Caller must already hold the session lock. Returns false if no entitlement.
create function private.grant_place(p_booking uuid, p_session public.class_sessions)
returns boolean language plpgsql security definer set search_path = '' as $$
declare
  b public.bookings;
  e record;
  v_deadline timestamptz;
begin
  select * into b from public.bookings where id = p_booking for update;
  select * into e from private.pick_entitlement(b.tenant_id, b.member_user_id, p_session.starts_at);
  if e.kind is null then
    return false;
  end if;
  if e.kind = 'class_pack' then
    update public.class_packs set credits_used = credits_used + 1
     where id = e.ref_id and credits_used < credits_total;
    if not found then return false; end if;
  end if;
  -- Normal rule: free cancellation until 12h before start. Someone promoted from
  -- the waitlist inside that window gets one hour to say no, never past the start.
  v_deadline := greatest(p_session.starts_at - interval '12 hours',
                         least(now() + interval '1 hour', p_session.starts_at));
  update public.bookings
     set status = 'booked', booked_at = now(), free_cancel_until = v_deadline,
         subscription_id = case when e.kind = 'monthly_pass' then e.ref_id end,
         class_pack_id   = case when e.kind = 'class_pack'   then e.ref_id end,
         updated_at = now()
   where id = p_booking;
  update public.class_sessions set booked_count = booked_count + 1, updated_at = now()
   where id = p_session.id;
  return true;
end $$;

-- Fill free places from the head of the waitlist. Caller holds the session lock.
create function private.promote_waitlist(p_session_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare
  s public.class_sessions;
  w record;
begin
  loop
    select * into s from public.class_sessions where id = p_session_id;   -- fresh counts, already locked
    exit when s.status <> 'scheduled' or s.starts_at <= now() or s.booked_count >= s.capacity;
    select id into w from public.bookings
     where session_id = p_session_id and status = 'waitlisted'
     order by waitlisted_at, id limit 1;
    exit when w.id is null;
    update public.class_sessions set waitlist_count = waitlist_count - 1 where id = p_session_id;
    if not private.grant_place(w.id, s) then
      update public.bookings set status = 'waitlist_lapsed', updated_at = now() where id = w.id;
    end if;
    -- a notification row / outbox event would be written here (see handover.md)
  end loop;
end $$;

-- Book a class, or join its waitlist if it is full.
create function public.book_class(p_session_id uuid)
returns public.bookings language plpgsql security definer set search_path = '' as $$
declare
  s public.class_sessions;
  b public.bookings;
  e record;
  v_me uuid := (select auth.uid());
begin
  select * into s from public.class_sessions where id = p_session_id for update;   -- the lock
  if not found or not private.is_member(s.tenant_id) then
    perform private.fail('session_not_found', 'Class not found', 'P0002');
  end if;
  if s.status = 'cancelled' then
    perform private.fail('session_cancelled', 'This class has been cancelled');
  end if;
  if s.starts_at <= now() then
    perform private.fail('session_started', 'This class has already started');
  end if;
  select * into b from public.bookings
   where session_id = s.id and member_user_id = v_me
     and status in ('booked', 'waitlisted', 'attended', 'no_show');
  if found then
    perform private.fail('already_booked', 'You already have a place or a waitlist spot in this class', '23505');
  end if;
  select * into e from private.pick_entitlement(s.tenant_id, v_me, s.starts_at);
  if e.kind is null then
    perform private.fail('no_entitlement', 'You need an active pass or class credits to book', 'P0003');
  end if;

  insert into public.bookings (tenant_id, session_id, member_user_id, status, waitlisted_at)
  values (s.tenant_id, s.id, v_me, 'waitlisted', now())
  returning * into b;

  if s.booked_count < s.capacity and s.waitlist_count = 0 then
    if not private.grant_place(b.id, s) then          -- pack spent by a parallel booking
      perform private.fail('no_entitlement', 'You need an active pass or class credits to book', 'P0003');
    end if;
  else
    update public.class_sessions set waitlist_count = waitlist_count + 1, updated_at = now()
     where id = s.id;
  end if;
  select * into b from public.bookings where id = b.id;
  return b;
end $$;

-- Cancel a place or leave a waitlist. Late cancellations keep the credit.
create function public.cancel_booking(p_booking_id uuid)
returns public.bookings language plpgsql security definer set search_path = '' as $$
declare
  b public.bookings;
  s public.class_sessions;
  v_me uuid := (select auth.uid());
begin
  select * into b from public.bookings where id = p_booking_id;
  if not found or (b.member_user_id <> v_me and not private.is_staff(b.tenant_id)) then
    perform private.fail('booking_not_found', 'Booking not found', 'P0002');
  end if;
  select * into s from public.class_sessions where id = b.session_id for update;   -- the lock
  select * into b from public.bookings where id = p_booking_id for update;          -- re-read under lock

  if b.status in ('cancelled', 'late_cancelled') then
    return b;                                                   -- already done: safe to retry
  end if;
  if b.status not in ('booked', 'waitlisted') or s.starts_at <= now() then
    perform private.fail('not_cancellable', 'This booking can no longer be cancelled');
  end if;

  if b.status = 'waitlisted' then
    update public.bookings set status = 'cancelled', cancelled_at = now(), updated_at = now()
     where id = b.id returning * into b;
    update public.class_sessions set waitlist_count = waitlist_count - 1, updated_at = now()
     where id = s.id;
    return b;
  end if;

  if now() <= b.free_cancel_until then
    update public.bookings set status = 'cancelled', cancelled_at = now(), updated_at = now()
     where id = b.id returning * into b;
    if b.class_pack_id is not null then
      update public.class_packs set credits_used = credits_used - 1 where id = b.class_pack_id;
    end if;
  else
    update public.bookings set status = 'late_cancelled', cancelled_at = now(), updated_at = now()
     where id = b.id returning * into b;
  end if;
  update public.class_sessions set booked_count = booked_count - 1, updated_at = now() where id = s.id;
  perform private.promote_waitlist(s.id);
  return b;
end $$;

-- Desk check-in. Idempotent: checking in twice returns the same row.
create function public.check_in(p_booking_id uuid)
returns public.bookings language plpgsql security definer set search_path = '' as $$
declare
  b public.bookings;
  s public.class_sessions;
begin
  select * into b from public.bookings where id = p_booking_id;
  if not found or not private.is_staff(b.tenant_id) then
    perform private.fail('booking_not_found', 'Booking not found', 'P0002');
  end if;
  select * into s from public.class_sessions where id = b.session_id for update;
  select * into b from public.bookings where id = p_booking_id for update;
  if b.status = 'attended' then return b; end if;
  if b.status not in ('booked', 'no_show') then
    perform private.fail('not_checkin_eligible', 'Only booked members can be checked in');
  end if;
  if now() < s.starts_at - interval '2 hours' or now() > s.ends_at + interval '2 hours' then
    perform private.fail('outside_checkin_window', 'Check-in opens 2 hours before the class');
  end if;
  update public.bookings
     set status = 'attended', checked_in_at = now(), checked_in_by = (select auth.uid()), updated_at = now()
   where id = b.id returning * into b;
  return b;
end $$;

-- Staff cancel a whole class: everyone is released and pack credits are returned.
create function public.cancel_session(p_session_id uuid, p_reason text)
returns public.class_sessions language plpgsql security definer set search_path = '' as $$
declare
  s public.class_sessions;
begin
  select * into s from public.class_sessions where id = p_session_id for update;
  if not found or not private.is_staff(s.tenant_id) then
    perform private.fail('session_not_found', 'Class not found', 'P0002');
  end if;
  if s.status = 'cancelled' then return s; end if;
  update public.class_packs p set credits_used = credits_used - 1
    from public.bookings b
   where b.session_id = s.id and b.status = 'booked' and b.class_pack_id = p.id;
  update public.bookings set status = 'cancelled', cancelled_at = now(), updated_at = now()
   where session_id = s.id and status in ('booked', 'waitlisted');
  update public.class_sessions
     set status = 'cancelled', cancelled_at = now(), cancel_reason = p_reason,
         booked_count = 0, waitlist_count = 0, updated_at = now()
   where id = s.id returning * into s;
  return s;
end $$;

-- Staff edits to a class go through plain UPDATE (column grants below). This
-- trigger keeps the waitlist and the cancel deadlines honest when they do:
--   * more capacity promotes from the waitlist in the same transaction
--   * a moved class gives booked members a fresh free-cancel window (at least 24h,
--     never past the new start), because the time they agreed to has changed
create function private.on_session_edit()
returns trigger language plpgsql security definer set search_path = '' as $$
begin
  if new.starts_at <> old.starts_at then
    update public.bookings
       set free_cancel_until = greatest(new.starts_at - interval '12 hours',
                                        least(now() + interval '24 hours', new.starts_at)),
           updated_at = now()
     where session_id = new.id and status = 'booked';
  end if;
  if new.capacity > old.capacity then
    perform private.promote_waitlist(new.id);
  end if;
  return null;
end $$;

create trigger class_sessions_after_edit
  after update of capacity, starts_at on public.class_sessions
  for each row execute function private.on_session_edit();

-- Cron (pg_cron, every 15 min): booked places with no check-in 2h after the end become no-shows.
create function private.mark_no_shows()
returns integer language sql security definer set search_path = '' as $$
  with done as (
    update public.bookings b set status = 'no_show', updated_at = now()
      from public.class_sessions s
     where b.session_id = s.id and b.status = 'booked'
       and s.ends_at < now() - interval '2 hours'
    returning 1)
  select count(*)::int from done
$$;

-- ---------------------------------------------------------------------------
-- Read path
-- ---------------------------------------------------------------------------

-- Member week schedule for one location. Week bounds are computed in the
-- location's zone, so "Monday" is the gym's Monday. Returns only fields the
-- screen uses; others' bookings are reduced to counts.
create function public.week_schedule(p_location_id uuid, p_week_start date)
returns table (
  session_id uuid, starts_at timestamptz, ends_at timestamptz, location_timezone text,
  class_type_name text, class_level text, instructor_name text,
  capacity smallint, booked_count smallint, waitlist_count smallint,
  session_status public.session_status,
  my_booking_id uuid, my_status public.booking_status, my_waitlist_position integer,
  my_free_cancel_until timestamptz
)
language sql stable security definer set search_path = '' as $$
  select cs.id, cs.starts_at, cs.ends_at, l.timezone,
         ct.name, ct.level, ins.display_name,
         cs.capacity, cs.booked_count, cs.waitlist_count, cs.status,
         mb.id, mb.status,
         case when mb.status = 'waitlisted' then (
           select count(*)::int from public.bookings w
            where w.session_id = cs.id and w.status = 'waitlisted'
              and (w.waitlisted_at, w.id) <= (mb.waitlisted_at, mb.id)) end,
         mb.free_cancel_until
    from public.locations l
    join public.class_sessions cs on cs.location_id = l.id
    join public.class_types ct on ct.id = cs.class_type_id
    join public.tenant_users ins on ins.tenant_id = cs.tenant_id and ins.user_id = cs.instructor_user_id
    left join public.bookings mb on mb.session_id = cs.id and mb.member_user_id = (select auth.uid())
         and mb.status in ('booked', 'waitlisted', 'attended', 'no_show', 'late_cancelled')
   where l.id = p_location_id
     and private.is_member(l.tenant_id)
     and cs.starts_at >= (p_week_start::timestamp at time zone l.timezone)
     and cs.starts_at <  ((p_week_start + 7)::timestamp at time zone l.timezone)
   order by cs.starts_at, cs.id
$$;

-- Owner report: attendance per day for the last N days (max 30).
create function public.attendance_report(p_tenant uuid, p_days integer default 30)
returns table (day date, location_id uuid, classes integer, places_booked integer,
               attended integer, no_shows integer, late_cancels integer)
language sql stable security definer set search_path = '' as $$
  select (cs.starts_at at time zone l.timezone)::date, l.id,
         count(distinct cs.id)::int,
         count(b.id) filter (where b.status in ('attended', 'no_show', 'booked'))::int,
         count(b.id) filter (where b.status = 'attended')::int,
         count(b.id) filter (where b.status = 'no_show')::int,
         count(b.id) filter (where b.status = 'late_cancelled')::int
    from public.class_sessions cs
    join public.locations l on l.id = cs.location_id
    left join public.bookings b on b.session_id = cs.id
   where cs.tenant_id = p_tenant and private.is_owner(p_tenant)
     and cs.status = 'scheduled'
     and cs.starts_at >= now() - make_interval(days => least(greatest(p_days, 1), 30))
     and cs.starts_at < now()
   group by 1, 2
   order by 1 desc, 2
$$;

-- ---------------------------------------------------------------------------
-- Row level security
-- ---------------------------------------------------------------------------
alter table public.tenants          enable row level security;
alter table public.locations        enable row level security;
alter table public.tenant_users     enable row level security;
alter table public.class_types      enable row level security;
alter table public.class_sessions   enable row level security;
alter table public.plans            enable row level security;
alter table public.subscriptions    enable row level security;
alter table public.class_packs      enable row level security;
alter table public.bookings         enable row level security;
alter table public.idempotency_keys enable row level security;   -- no policies: service role only
alter table public.stripe_events    enable row level security;   -- no policies: service role only

-- Default deny for the browser roles, then grant back exactly what policies allow.
revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema public from public, anon;
grant select on public.tenants, public.locations, public.tenant_users, public.class_types,
                public.class_sessions, public.plans, public.subscriptions, public.class_packs,
                public.bookings to authenticated;
grant insert, update on public.locations, public.class_types, public.plans to authenticated;
grant insert on public.class_sessions to authenticated;
-- staff may edit schedule fields, never the counters or status (cancel via cancel_session)
grant update (class_type_id, instructor_user_id, starts_at, ends_at, capacity, location_id, updated_at)
  on public.class_sessions to authenticated;
grant update (display_name, phone) on public.tenant_users to authenticated;
-- private helpers are SECURITY DEFINER: only the policy predicates are callable by clients
revoke execute on all functions in schema private from public, anon, authenticated;
grant execute on function private.my_role(uuid), private.is_member(uuid), private.is_staff(uuid),
  private.is_owner(uuid) to authenticated;
grant execute on function public.book_class(uuid), public.cancel_booking(uuid), public.check_in(uuid),
  public.cancel_session(uuid, text), public.week_schedule(uuid, date), public.attendance_report(uuid, integer)
  to authenticated;

-- tenants: you see the gyms you belong to
create policy tenants_read on public.tenants for select to authenticated
  using (private.is_member(id));

-- locations, class types, plans: any member of the gym reads; staff (owners for plans) write
create policy locations_read  on public.locations for select to authenticated using (private.is_member(tenant_id));
create policy locations_write on public.locations for insert to authenticated with check (private.is_owner(tenant_id));
create policy locations_edit  on public.locations for update to authenticated
  using (private.is_owner(tenant_id)) with check (private.is_owner(tenant_id));

create policy class_types_read  on public.class_types for select to authenticated using (private.is_member(tenant_id));
create policy class_types_write on public.class_types for insert to authenticated with check (private.is_staff(tenant_id));
create policy class_types_edit  on public.class_types for update to authenticated
  using (private.is_staff(tenant_id)) with check (private.is_staff(tenant_id));

create policy plans_read  on public.plans for select to authenticated using (private.is_member(tenant_id));
create policy plans_write on public.plans for insert to authenticated with check (private.is_owner(tenant_id));
create policy plans_edit  on public.plans for update to authenticated
  using (private.is_owner(tenant_id)) with check (private.is_owner(tenant_id));

-- schedule: members read their gym's classes; staff create and edit
create policy sessions_read  on public.class_sessions for select to authenticated using (private.is_member(tenant_id));
create policy sessions_write on public.class_sessions for insert to authenticated
  with check (private.is_staff(tenant_id) and booked_count = 0 and waitlist_count = 0 and status = 'scheduled');
create policy sessions_edit  on public.class_sessions for update to authenticated
  using (private.is_staff(tenant_id)) with check (private.is_staff(tenant_id));

-- people: you see your own row in each gym; staff see their own gym's rows only.
-- A member of gyms A and B is two rows; staff of A can never select the B row.
create policy tenant_users_read on public.tenant_users for select to authenticated
  using (user_id = (select auth.uid()) or private.is_staff(tenant_id));
create policy tenant_users_edit_self on public.tenant_users for update to authenticated
  using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

-- billing mirrors: own rows, or staff of that gym. Writes only from the webhook (service role).
create policy subscriptions_read on public.subscriptions for select to authenticated
  using (member_user_id = (select auth.uid()) or private.is_staff(tenant_id));
create policy class_packs_read on public.class_packs for select to authenticated
  using (member_user_id = (select auth.uid()) or private.is_staff(tenant_id));

-- bookings: own rows, or staff of that gym. No insert/update/delete policy:
-- every write goes through book_class, cancel_booking, check_in, cancel_session.
create policy bookings_read on public.bookings for select to authenticated
  using (member_user_id = (select auth.uid()) or private.is_staff(tenant_id));
