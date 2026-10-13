-- Crux: class booking for climbing gyms. PostgreSQL 16 or later (Supabase).
-- One migration file for review; in the repo it is split into numbered migrations (see handover.md, "Migration plan").
--
-- Model in one paragraph. A gym is the tenant. Every business row carries gym_id, and every child repeats its
-- parent's gym_id through a composite foreign key, so a row can never point across tenants and every policy is one
-- indexed comparison. A person is one auth user with one profile and a membership row per gym (owner, staff or
-- member); the same person can be a member of two gyms and each gym sees only its own membership, bookings and passes.
-- Classes are future events at a wall, so the wall's local time plus its IANA zone is the truth and the instant is
-- derived. Places left and waitlist positions are computed at read and enforced at write under a lock on the class
-- row. All member and desk writes go through the functions in schema api, which check the caller themselves.
--
-- Schemas: public (tables, exposed read through RLS), api (RPC functions, exposed), private (helpers, NOT exposed).
-- Ids: UUIDv7 from private.uuid_v7() (PostgreSQL 18: replace with the built-in uuidv7()). They are time-ordered and
-- leak no row counts; they do reveal creation time to the millisecond, which is acceptable for these tables.

create extension if not exists btree_gist with schema extensions;

create schema if not exists private;
create schema if not exists api;

-- ---------------------------------------------------------------------------------------------------------------
-- Helpers that tables need
-- ---------------------------------------------------------------------------------------------------------------
create or replace function private.uuid_v7() returns uuid
language sql volatile set search_path = '' as $$
  -- 48-bit Unix millisecond timestamp, then version 7 and variant bits over random bytes (RFC 9562 section 5.7).
  select encode(
    set_bit(set_bit(
      overlay(uuid_send(gen_random_uuid())
              placing substring(int8send(floor(extract(epoch from clock_timestamp()) * 1000)::bigint) from 3)
              from 1 for 6),
      52, 1), 53, 1), 'hex')::uuid
$$;

-- Valid IANA zone name. Declared immutable so a CHECK can use it; the zone list only grows between tz releases.
create or replace function private.is_valid_time_zone(tz text) returns boolean
language sql immutable set search_path = '' as $$
  select exists (select 1 from pg_catalog.pg_timezone_names where name = tz)
$$;

create or replace function private.touch_updated_at() returns trigger
language plpgsql set search_path = '' as $$
begin
  new.updated_at := now();
  return new;
end $$;

-- ---------------------------------------------------------------------------------------------------------------
-- Tenancy and people
-- ---------------------------------------------------------------------------------------------------------------
create table public.gyms (
  id uuid primary key default private.uuid_v7(),
  name text not null constraint gyms_name_length check (char_length(name) between 1 and 80),
  slug text not null constraint gyms_slug_format check (slug ~ '^[a-z0-9-]{2,48}$'),
  -- Policy values live on the gym; each booking copies the deadline it was promised (bookings.free_cancel_until).
  free_cancel_window interval not null default interval '12 hours'
    constraint gyms_free_cancel_window_range check (free_cancel_window >= interval '0' and free_cancel_window <= interval '7 days'),
  past_due_grace interval not null default interval '7 days'
    constraint gyms_past_due_grace_range check (past_due_grace >= interval '0' and past_due_grace <= interval '30 days'),
  -- Stripe Connect account that receives this gym's payments. Null is a designed state: payments not set up yet.
  stripe_account_id text constraint gyms_stripe_account_format check (stripe_account_id ~ '^acct_[A-Za-z0-9]+$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint gyms_slug_unique unique (slug),
  constraint gyms_stripe_account_unique unique (stripe_account_id)
);

create table public.locations (
  id uuid primary key default private.uuid_v7(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  name text not null constraint locations_name_length check (char_length(name) between 1 and 80),
  time_zone text not null constraint locations_time_zone_valid check (private.is_valid_time_zone(time_zone)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint locations_id_gym_unique unique (id, gym_id),          -- target of composite FKs
  constraint locations_name_unique unique (gym_id, name)            -- also the FK index on gym_id (leading column)
);

-- Product data about a person. Email stays in auth.users (the provider owns it); nothing here is gym-specific.
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text not null constraint profiles_display_name_length check (char_length(display_name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.gym_memberships (
  gym_id uuid not null references public.gyms (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null default 'member' constraint gym_memberships_role_valid check (role in ('owner', 'staff', 'member')),
  -- A person who leaves keeps their history (bookings restrict deletion); ended_at null means current.
  ended_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (gym_id, user_id)
);
create index gym_memberships_user_idx on public.gym_memberships (user_id) where ended_at is null; -- "my gyms", every policy
create index gym_memberships_user_all_idx on public.gym_memberships (user_id);                   -- FK index

-- ---------------------------------------------------------------------------------------------------------------
-- Classes
-- ---------------------------------------------------------------------------------------------------------------
create table public.class_types (
  id uuid primary key default private.uuid_v7(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  name text not null constraint class_types_name_length check (char_length(name) between 1 and 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint class_types_id_gym_unique unique (id, gym_id)
);
create unique index class_types_name_unique on public.class_types (gym_id, lower(name)); -- also the gym_id FK index

create table public.classes (
  id uuid primary key default private.uuid_v7(),
  gym_id uuid not null references public.gyms (id) on delete cascade,
  location_id uuid not null,
  class_type_id uuid not null,
  instructor_id uuid not null,
  -- Truth: wall-clock time at the location. Derived: the instants, recomputed by trigger on change and by
  -- private.recompute_class_instants() after a tz data release.
  starts_local timestamp not null,
  ends_local timestamp not null,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  capacity integer not null constraint classes_capacity_range check (capacity between 1 and 200),
  status text not null default 'scheduled' constraint classes_status_valid check (status in ('scheduled', 'cancelled')),
  cancelled_at timestamptz,
  version integer not null default 1,                              -- If-Match on staff edits
  created_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint classes_id_gym_unique unique (id, gym_id),
  constraint classes_location_fk foreign key (location_id, gym_id) references public.locations (id, gym_id) on delete restrict,
  constraint classes_class_type_fk foreign key (class_type_id, gym_id) references public.class_types (id, gym_id) on delete restrict,
  constraint classes_instructor_fk foreign key (gym_id, instructor_id) references public.gym_memberships (gym_id, user_id) on delete restrict,
  constraint classes_ends_after_start check (ends_local > starts_local),
  constraint classes_length_max check (ends_local - starts_local <= interval '12 hours'),
  constraint classes_cancelled_has_time check ((status = 'cancelled') = (cancelled_at is not null)),
  -- One instructor cannot teach two scheduled classes that overlap.
  constraint classes_instructor_no_overlap exclude using gist (
    instructor_id with =, tstzrange(starts_at, ends_at) with &&) where (status = 'scheduled')
);
create index classes_location_week_idx on public.classes (location_id, starts_at, id); -- schedule week, keyset; FK index
create index classes_gym_starts_idx on public.classes (gym_id, starts_at desc);        -- owner attendance, last 30 days
create index classes_class_type_idx on public.classes (class_type_id);                 -- FK index
create index classes_instructor_idx on public.classes (gym_id, instructor_id);         -- FK index
create index classes_created_by_idx on public.classes (created_by);                    -- FK index

-- ---------------------------------------------------------------------------------------------------------------
-- Passes (Stripe is the source of truth; these rows are a cache written only by the server's syncStripe)
-- ---------------------------------------------------------------------------------------------------------------
create table public.stripe_customers (
  gym_id uuid not null,
  user_id uuid not null,
  stripe_customer_id text not null constraint stripe_customers_id_format check (stripe_customer_id ~ '^cus_[A-Za-z0-9]+$'),
  created_at timestamptz not null default now(),
  primary key (gym_id, user_id),
  constraint stripe_customers_membership_fk foreign key (gym_id, user_id) references public.gym_memberships (gym_id, user_id) on delete restrict,
  constraint stripe_customers_id_unique unique (stripe_customer_id)
);
create index stripe_customers_user_idx on public.stripe_customers (user_id);

create table public.passes (
  id uuid primary key default private.uuid_v7(),
  gym_id uuid not null,
  user_id uuid not null,
  kind text not null constraint passes_kind_valid check (kind in ('monthly', 'pack')),
  -- Monthly: Stripe subscription status, mirrored exactly. Pack: 'active' or 'refunded'.
  status text not null constraint passes_status_valid check (status in (
    'active', 'trialing', 'past_due', 'unpaid', 'canceled', 'incomplete', 'incomplete_expired', 'paused', 'refunded')),
  stripe_subscription_id text,
  stripe_checkout_session_id text,
  credits_total integer,                                            -- pack only (10); credits left are computed
  price_minor bigint not null constraint passes_price_non_negative check (price_minor >= 0),
  currency text not null constraint passes_currency_format check (currency ~ '^[a-z]{3}$'),
  current_period_end timestamptz,                                   -- monthly: from the subscription item (Stripe API 2025-03-31.basil)
  past_due_since timestamptz,                                       -- set by sync when status first becomes past_due
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint passes_owner_unique unique (id, gym_id, user_id),
  constraint passes_membership_fk foreign key (gym_id, user_id) references public.gym_memberships (gym_id, user_id) on delete restrict,
  constraint passes_subscription_unique unique (stripe_subscription_id),
  constraint passes_checkout_unique unique (stripe_checkout_session_id),   -- a replayed webhook cannot create a second pack
  constraint passes_monthly_shape check (kind <> 'monthly' or (stripe_subscription_id is not null and credits_total is null)),
  constraint passes_pack_shape check (kind <> 'pack' or (stripe_checkout_session_id is not null and credits_total between 1 and 100
                                                         and status in ('active', 'refunded'))),
  constraint passes_past_due_has_time check ((status = 'past_due') = (past_due_since is not null))
);
create index passes_member_idx on public.passes (gym_id, user_id, created_at desc); -- access check; FK index
create index passes_user_idx on public.passes (user_id);                           -- RLS "my passes"

-- ---------------------------------------------------------------------------------------------------------------
-- Bookings and waitlist: one table, one status column
-- ---------------------------------------------------------------------------------------------------------------
create table public.bookings (
  id uuid primary key default private.uuid_v7(),
  gym_id uuid not null,
  class_id uuid not null,
  user_id uuid not null,
  pass_id uuid not null,                                            -- the pass that granted this booking (fact of the event)
  status text not null constraint bookings_status_valid check (status in (
    'waitlisted', 'confirmed', 'cancelled', 'late_cancelled', 'attended', 'no_show')),
  waitlisted_at timestamptz,                                        -- queue order: (waitlisted_at, id); position is computed
  confirmed_at timestamptz,
  promoted_at timestamptz,                                          -- set when the waitlist gave this member a place
  free_cancel_until timestamptz,                                    -- the deadline this booking was promised
  cancelled_at timestamptz,
  cancel_reason text constraint bookings_cancel_reason_valid check (cancel_reason in (
    'member', 'member_late', 'class_cancelled', 'access_lapsed')),
  checked_in_at timestamptz,
  checked_in_by uuid references public.profiles (id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint bookings_class_fk foreign key (class_id, gym_id) references public.classes (id, gym_id) on delete restrict,
  constraint bookings_membership_fk foreign key (gym_id, user_id) references public.gym_memberships (gym_id, user_id) on delete restrict,
  constraint bookings_pass_fk foreign key (pass_id, gym_id, user_id) references public.passes (id, gym_id, user_id) on delete restrict,
  constraint bookings_waitlist_has_time check (waitlisted_at is not null or status <> 'waitlisted'),
  constraint bookings_place_has_deadline check (
    status not in ('confirmed', 'attended', 'no_show', 'late_cancelled') or (confirmed_at is not null and free_cancel_until is not null)),
  constraint bookings_cancel_has_time check ((status in ('cancelled', 'late_cancelled')) = (cancelled_at is not null and cancel_reason is not null)),
  constraint bookings_late_reason check (status <> 'late_cancelled' or cancel_reason = 'member_late'),
  constraint bookings_attended_has_checkin check ((status = 'attended') = (checked_in_at is not null))
);
-- A member holds at most one live booking per class. Partial, so a member who cancelled can book again.
create unique index bookings_one_live_per_member on public.bookings (class_id, user_id)
  where status in ('waitlisted', 'confirmed', 'attended', 'no_show');
-- A place is taken by a confirmed, attended or no-show booking: checking someone in at the desk never frees a place.
create index bookings_class_taken_idx on public.bookings (class_id) where status in ('confirmed', 'attended', 'no_show'); -- places taken
create index bookings_class_queue_idx on public.bookings (class_id, waitlisted_at, id) where status = 'waitlisted'; -- queue order, rank
create index bookings_class_idx on public.bookings (class_id, gym_id);                                      -- FK index, roster
create index bookings_member_idx on public.bookings (gym_id, user_id, created_at desc);                     -- FK index, my bookings
create index bookings_user_idx on public.bookings (user_id, created_at desc, id);                            -- RLS, keyset "my bookings"
create index bookings_pass_idx on public.bookings (pass_id);                                                -- FK index, pack credits used
create index bookings_checked_in_by_idx on public.bookings (checked_in_by);                                 -- FK index

-- ---------------------------------------------------------------------------------------------------------------
-- Server-only tables
-- ---------------------------------------------------------------------------------------------------------------
create table public.idempotency_keys (
  user_id uuid not null references public.profiles (id) on delete cascade,
  key uuid not null,
  endpoint text not null,
  request_hash text not null,                                       -- sha256 of the canonical request body
  response_status integer not null,
  response_body jsonb not null,
  created_at timestamptz not null default now(),
  primary key (user_id, key)
);
create index idempotency_keys_created_idx on public.idempotency_keys (created_at); -- prune after 24 hours

create table public.stripe_events (
  id text primary key constraint stripe_events_id_format check (id ~ '^evt_[A-Za-z0-9]+$'),
  type text not null,
  stripe_account_id text,
  received_at timestamptz not null default now()
);

-- Append-only, no foreign keys on purpose: history survives deletes. Written in the same transaction as the action.
create table public.audit_events (
  id bigint generated always as identity primary key,
  gym_id uuid not null,
  actor_id uuid,
  action text not null,                                             -- 'booking.created', 'booking.promoted', 'booking.checked_in'
  target_type text not null,
  target_id uuid not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_events_gym_idx on public.audit_events (gym_id, created_at desc);

-- updated_at triggers
create trigger gyms_touch before update on public.gyms for each row execute function private.touch_updated_at();
create trigger locations_touch before update on public.locations for each row execute function private.touch_updated_at();
create trigger profiles_touch before update on public.profiles for each row execute function private.touch_updated_at();
create trigger gym_memberships_touch before update on public.gym_memberships for each row execute function private.touch_updated_at();
create trigger class_types_touch before update on public.class_types for each row execute function private.touch_updated_at();
create trigger classes_touch before update on public.classes for each row execute function private.touch_updated_at();
create trigger passes_touch before update on public.passes for each row execute function private.touch_updated_at();
create trigger bookings_touch before update on public.bookings for each row execute function private.touch_updated_at();

-- ---------------------------------------------------------------------------------------------------------------
-- Class time: derive instants from wall time and zone; keep bookings' promises when a class moves or is cancelled
-- ---------------------------------------------------------------------------------------------------------------
create or replace function private.classes_derive_instants() returns trigger
language plpgsql set search_path = '' as $$
declare tz text;
begin
  -- Runs as the caller, so RLS applies: staff of another gym find no location here.
  select l.time_zone into tz from public.locations l where l.id = new.location_id and l.gym_id = new.gym_id;
  if tz is null then
    raise exception 'classes_location_fk: location % is not in gym %', new.location_id, new.gym_id
      using errcode = '23503', constraint = 'classes_location_fk';
  end if;
  new.starts_at := new.starts_local at time zone tz;
  new.ends_at := new.ends_local at time zone tz;
  if tg_op = 'UPDATE' and (new.starts_local, new.ends_local, new.location_id, new.capacity, new.status)
                         is distinct from (old.starts_local, old.ends_local, old.location_id, old.capacity, old.status) then
    new.version := old.version + 1;
  end if;
  return new;
end $$;
create trigger classes_derive_instants before insert or update of starts_local, ends_local, location_id, capacity, status
  on public.classes for each row execute function private.classes_derive_instants();

create or replace function private.classes_after_change() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  -- Gym cancels the class: every live booking is cancelled, which also returns pack credits.
  if new.status = 'cancelled' and old.status = 'scheduled' then
    update public.bookings
       set status = 'cancelled', cancelled_at = now(), cancel_reason = 'class_cancelled'
     where class_id = new.id and status in ('waitlisted', 'confirmed');
  -- The class moved: members booked for the old time may cancel free until the new start (decision, handover.md).
  elsif new.starts_at is distinct from old.starts_at then
    update public.bookings set free_cancel_until = new.starts_at
     where class_id = new.id and status = 'confirmed';
  end if;
  -- More places: the queue moves up at once, so a place is never free while people wait.
  if new.status = 'scheduled' and new.capacity > old.capacity then
    perform private.promote_waitlist(new.id);
  end if;
  return null;
end $$;
create trigger classes_after_change after update on public.classes
  for each row execute function private.classes_after_change();

-- Run after a tz data release: wall time stays the promise, instants follow the new rules.
create or replace function private.recompute_class_instants() returns integer
language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  update public.classes c set starts_local = c.starts_local    -- fires classes_derive_instants
   where c.starts_at > now() and c.starts_at is distinct from (c.starts_local at time zone
         (select l.time_zone from public.locations l where l.id = c.location_id));
  get diagnostics n = row_count;
  return n;
end $$;

-- ---------------------------------------------------------------------------------------------------------------
-- Capacity guard: the invariant holds for every writer (desk tools, scripts, service role), not only api.*
-- ---------------------------------------------------------------------------------------------------------------
create or replace function private.bookings_capacity_guard() returns trigger
language plpgsql security definer set search_path = '' as $$
declare cap integer; taken integer;
begin
  if new.status <> 'confirmed' or (tg_op = 'UPDATE' and old.status in ('confirmed', 'attended', 'no_show')) then
    return null;
  end if;
  -- Lock the parent row that always exists, then count with a fresh snapshot (READ COMMITTED, new statement).
  select c.capacity into strict cap from public.classes c where c.id = new.class_id for update;
  select count(*) into taken from public.bookings b where b.class_id = new.class_id and b.status in ('confirmed', 'attended', 'no_show');
  if taken > cap then
    raise exception 'bookings_class_capacity: class % is over capacity (% of %)', new.class_id, taken, cap
      using errcode = '23514', constraint = 'bookings_class_capacity';
  end if;
  return null;
end $$;
create constraint trigger bookings_class_capacity after insert or update of status on public.bookings
  for each row execute function private.bookings_capacity_guard();

-- ---------------------------------------------------------------------------------------------------------------
-- Access: who may book, computed by one function that the API, the capability flags and the screen all read
-- ---------------------------------------------------------------------------------------------------------------
create or replace function private.my_gym_ids() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select gym_id from public.gym_memberships where user_id = (select auth.uid()) and ended_at is null
$$;
create or replace function private.my_staff_gym_ids() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select gym_id from public.gym_memberships
   where user_id = (select auth.uid()) and ended_at is null and role in ('owner', 'staff')
$$;
create or replace function private.my_owner_gym_ids() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select gym_id from public.gym_memberships
   where user_id = (select auth.uid()) and ended_at is null and role = 'owner'
$$;

-- Pack credits used: every booking that holds or spent a credit. A free cancel returns it.
create or replace function private.pack_credits_left(p_pass_id uuid) returns integer
language sql stable security definer set search_path = '' as $$
  select p.credits_total - (select count(*)::integer from public.bookings b
                             where b.pass_id = p.id
                               and b.status in ('waitlisted', 'confirmed', 'attended', 'no_show', 'late_cancelled'))
    from public.passes p where p.id = p_pass_id and p.kind = 'pack'
$$;

-- The one access rule. status: 'active' (monthly active or trialing, or a pack with credits), 'grace' (monthly past_due
-- inside the gym's grace period), 'none'. Picks the pass a new booking is charged to: monthly first, then the oldest pack.
create or replace function private.member_access(p_gym_id uuid, p_user_id uuid, p_at timestamptz default now())
returns table (status text, pass_id uuid, pass_kind text, reason text, grace_ends_at timestamptz,
               credits_left integer, renews_at timestamptz)
language plpgsql stable security definer set search_path = '' as $$
declare m record; pk record; g interval;
begin
  select gy.past_due_grace into strict g from public.gyms gy where gy.id = p_gym_id;
  select p.* into m from public.passes p
   where p.gym_id = p_gym_id and p.user_id = p_user_id and p.kind = 'monthly'
     and p.status in ('active', 'trialing', 'past_due')
   order by p.created_at desc limit 1;
  if found and m.status in ('active', 'trialing') then
    return query select 'active', m.id, 'monthly', null::text, null::timestamptz, null::integer, m.current_period_end;
    return;
  end if;
  if found and m.status = 'past_due' and p_at < m.past_due_since + g then
    return query select 'grace', m.id, 'monthly', 'payment_past_due', m.past_due_since + g, null::integer, m.current_period_end;
    return;
  end if;
  select p.id, private.pack_credits_left(p.id) as left_ into pk from public.passes p
   where p.gym_id = p_gym_id and p.user_id = p_user_id and p.kind = 'pack' and p.status = 'active'
     and private.pack_credits_left(p.id) > 0
   order by p.created_at limit 1;
  if found then
    return query select 'active', pk.id, 'pack', null::text, null::timestamptz, pk.left_, null::timestamptz;
    return;
  end if;
  return query select 'none', null::uuid, null::text,
    case when m.id is not null then 'payment_past_due_grace_ended' else 'no_pass' end,
    case when m.id is not null then m.past_due_since + g end, null::integer, null::timestamptz;
end $$;

-- ---------------------------------------------------------------------------------------------------------------
-- Waitlist promotion. Caller holds the class row lock. Takes waiting rows in (waitlisted_at, id) order while places
-- are free; a member whose access has lapsed is skipped and told why.
-- ---------------------------------------------------------------------------------------------------------------
create or replace function private.promote_waitlist(p_class_id uuid) returns integer
language plpgsql security definer set search_path = '' as $$
declare c record; w record; taken integer; acc record; promoted integer := 0;
begin
  select cl.*, gy.free_cancel_window into strict c
    from public.classes cl join public.gyms gy on gy.id = cl.gym_id
   where cl.id = p_class_id for update of cl;
  if c.status <> 'scheduled' or c.starts_at <= now() then return 0; end if;
  loop
    select count(*) into taken from public.bookings where class_id = p_class_id and status in ('confirmed', 'attended', 'no_show');
    exit when taken >= c.capacity;
    select b.* into w from public.bookings b
     where b.class_id = p_class_id and b.status = 'waitlisted'
     order by b.waitlisted_at, b.id limit 1 for update;   -- every writer locks the class row first, so no waits here
    exit when not found;
    select * into acc from private.member_access(c.gym_id, w.user_id);
    if acc.status = 'none' then
      update public.bookings set status = 'cancelled', cancelled_at = now(), cancel_reason = 'access_lapsed' where id = w.id;
      continue;
    end if;
    -- Promoted inside the free-cancel window: free cancellation until the start (decision, handover.md).
    update public.bookings
       set status = 'confirmed', confirmed_at = now(), promoted_at = now(),
           free_cancel_until = case when now() >= c.starts_at - c.free_cancel_window then c.starts_at
                                    else c.starts_at - c.free_cancel_window end
     where id = w.id;
    insert into public.audit_events (gym_id, actor_id, action, target_type, target_id, metadata)
    values (c.gym_id, null, 'booking.promoted', 'booking', w.id, jsonb_build_object('class_id', p_class_id));
    promoted := promoted + 1;
  end loop;
  return promoted;
end $$;

-- ---------------------------------------------------------------------------------------------------------------
-- Errors: every refusal raises SQLSTATE P0001 with message 'crux:<code>' and a JSON detail. The API maps the code
-- to an RFC 9457 problem (api.md, "Error codes"); constraint violations map by constraint name.
-- ---------------------------------------------------------------------------------------------------------------
create or replace function private.refuse(p_code text, p_detail jsonb default '{}'::jsonb) returns void
language plpgsql set search_path = '' as $$
begin
  raise exception 'crux:%', p_code using errcode = 'P0001', detail = p_detail::text;
end $$;

-- Idempotency: claim the key first, in the same transaction as the work. A concurrent request with the same key
-- waits on the primary key until this one commits, then reads the stored response. A failed request rolls the
-- claim back, so its retry runs again.
create or replace function private.claim_idempotency_key(p_user uuid, p_key uuid, p_endpoint text, p_hash text)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare r record;
begin
  if p_key is null then
    perform private.refuse('idempotency_key_missing');
  end if;
  insert into public.idempotency_keys (user_id, key, endpoint, request_hash, response_status, response_body)
  values (p_user, p_key, p_endpoint, p_hash, 0, '{}'::jsonb)
  on conflict (user_id, key) do nothing;
  if found then return null; end if;                                -- claimed: do the work
  select * into strict r from public.idempotency_keys where user_id = p_user and key = p_key;
  if r.endpoint <> p_endpoint or r.request_hash <> p_hash then
    perform private.refuse('idempotency_key_reused', jsonb_build_object('endpoint', r.endpoint));
  end if;
  return r.response_body || jsonb_build_object('idempotent_replay', true);
end $$;

create or replace function private.store_idempotent_response(p_user uuid, p_key uuid, p_status integer, p_body jsonb)
returns jsonb language sql security definer set search_path = '' as $$
  update public.idempotency_keys set response_status = p_status, response_body = p_body
   where user_id = p_user and key = p_key
  returning response_body
$$;

-- ---------------------------------------------------------------------------------------------------------------
-- One class as the member sees it: computed counts, the caller's booking, waitlist rank and capability flags.
-- Shared by the schedule read and every write's response, so the list and the write can never disagree.
-- ---------------------------------------------------------------------------------------------------------------
create or replace function private.class_view(p_class_id uuid, p_user uuid, p_at timestamptz default now())
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare c record; taken integer; waiting integer; mine record; rank_ integer; acc record; started boolean;
        live boolean; base_reason text; j jsonb;
begin
  select cl.*, ct.name as type_name, pr.display_name as instructor_name, gy.free_cancel_window, l.time_zone
    into strict c
    from public.classes cl
    join public.class_types ct on ct.id = cl.class_type_id
    join public.profiles pr on pr.id = cl.instructor_id
    join public.gyms gy on gy.id = cl.gym_id
    join public.locations l on l.id = cl.location_id
   where cl.id = p_class_id;
  select count(*) filter (where b.status in ('confirmed', 'attended', 'no_show')), count(*) filter (where b.status = 'waitlisted')
    into taken, waiting from public.bookings b where b.class_id = p_class_id;
  select b.* into mine from public.bookings b
   where b.class_id = p_class_id and b.user_id = p_user
   order by (b.status in ('waitlisted', 'confirmed', 'attended', 'no_show')) desc, b.created_at desc limit 1;
  if found and mine.status = 'waitlisted' then
    select count(*) + 1 into rank_ from public.bookings b
     where b.class_id = p_class_id and b.status = 'waitlisted' and (b.waitlisted_at, b.id) < (mine.waitlisted_at, mine.id);
  end if;
  select * into acc from private.member_access(c.gym_id, p_user, p_at);
  started := c.starts_at <= p_at;
  live := mine.id is not null and mine.status in ('waitlisted', 'confirmed', 'attended', 'no_show');
  base_reason := case when c.status = 'cancelled' then 'class_cancelled'
                      when started then 'class_started'
                      when live then 'already_booked'
                      when acc.status = 'none' then acc.reason end;
  j := jsonb_build_object(
    'id', c.id,
    'class_type', jsonb_build_object('id', c.class_type_id, 'name', c.type_name),
    'instructor', jsonb_build_object('id', c.instructor_id, 'display_name', c.instructor_name),
    'location_id', c.location_id,
    'time_zone', c.time_zone,
    'starts_local', to_char(c.starts_local, 'YYYY-MM-DD"T"HH24:MI:SS'),
    'ends_local', to_char(c.ends_local, 'YYYY-MM-DD"T"HH24:MI:SS'),
    'starts_at', to_char(c.starts_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'ends_at', to_char(c.ends_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'status', c.status,
    'has_ended', c.ends_at <= p_at,
    'capacity', c.capacity,
    'taken_count', taken,
    'places_left', greatest(c.capacity - taken, 0),
    'waiting_count', waiting,
    'free_cancel_until_if_booked', to_char((c.starts_at - c.free_cancel_window) at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
    'my_booking', case when mine.id is null then null else jsonb_build_object(
        'id', mine.id,
        'status', mine.status,
        'waitlist_rank', rank_,
        'promoted', mine.promoted_at is not null,
        'free_cancel_until', to_char(mine.free_cancel_until at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
        'cancel_reason', mine.cancel_reason) end,
    'can', jsonb_build_object(
      'book', case when base_reason is not null then jsonb_build_object('allowed', false, 'reason', base_reason)
                   when taken >= c.capacity or waiting > 0 then jsonb_build_object('allowed', false, 'reason', 'class_full')
                   else jsonb_build_object('allowed', true) end,
      'join_waitlist', case when base_reason is not null then jsonb_build_object('allowed', false, 'reason', base_reason)
                   when taken < c.capacity and waiting = 0 then jsonb_build_object('allowed', false, 'reason', 'places_available')
                   else jsonb_build_object('allowed', true, 'would_be_rank', waiting + 1) end,
      'cancel', case when mine.status = 'confirmed' and not started and c.status = 'scheduled'
                   then jsonb_build_object('allowed', true, 'late', p_at >= mine.free_cancel_until)
                   else jsonb_build_object('allowed', false, 'reason', coalesce(case when started then 'class_started' end, 'no_booking')) end,
      'leave_waitlist', case when mine.status = 'waitlisted' and not started
                   then jsonb_build_object('allowed', true)
                   else jsonb_build_object('allowed', false, 'reason', 'not_waitlisted') end));
  return j;
end $$;

-- ---------------------------------------------------------------------------------------------------------------
-- api: the write path and the screen reads. security definer, search_path empty, each checks the caller itself.
-- ---------------------------------------------------------------------------------------------------------------
create or replace function api.book_class(p_class_id uuid, p_join_waitlist boolean, p_idempotency_key uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); replay jsonb; c record; acc record; taken integer; waiting integer;
        bid uuid; st text; body jsonb;
begin
  if uid is null then perform private.refuse('unauthenticated'); end if;
  replay := private.claim_idempotency_key(uid, p_idempotency_key, 'book_class',
              encode(sha256(convert_to(p_class_id::text || '|' || coalesce(p_join_waitlist, false)::text, 'UTF8')), 'hex'));
  if replay is not null then return replay; end if;

  -- Lock the class row: every write that changes places or the queue for this class runs one at a time.
  select cl.*, gy.free_cancel_window into c
    from public.classes cl join public.gyms gy on gy.id = cl.gym_id
   where cl.id = p_class_id and cl.gym_id in (select private.my_gym_ids())
   for update of cl;
  if not found then perform private.refuse('not_found'); end if;   -- another gym's class looks like no class
  if c.status = 'cancelled' then perform private.refuse('class_cancelled'); end if;
  if c.starts_at <= now() then perform private.refuse('class_started'); end if;
  if exists (select 1 from public.bookings b where b.class_id = p_class_id and b.user_id = uid
              and b.status in ('waitlisted', 'confirmed', 'attended', 'no_show')) then
    perform private.refuse('already_booked', private.class_view(p_class_id, uid));
  end if;

  select * into acc from private.member_access(c.gym_id, uid);
  if acc.status = 'none' then
    perform private.refuse('no_access', jsonb_build_object('reason', acc.reason, 'grace_ended_at', acc.grace_ends_at));
  end if;
  if acc.pass_kind = 'pack' then
    perform 1 from public.passes where id = acc.pass_id for update;   -- two classes at once cannot spend one credit
    if private.pack_credits_left(acc.pass_id) < 1 then
      perform private.refuse('no_access', jsonb_build_object('reason', 'no_credits_left'));
    end if;
  end if;

  select count(*) filter (where b.status in ('confirmed', 'attended', 'no_show')), count(*) filter (where b.status = 'waitlisted')
    into taken, waiting from public.bookings b where b.class_id = p_class_id;

  if taken < c.capacity and waiting = 0 then
    st := 'confirmed';
    insert into public.bookings (gym_id, class_id, user_id, pass_id, status, confirmed_at, free_cancel_until)
    values (c.gym_id, p_class_id, uid, acc.pass_id, 'confirmed', now(), c.starts_at - c.free_cancel_window)
    returning id into bid;
  elsif coalesce(p_join_waitlist, false) then
    st := 'waitlisted';
    insert into public.bookings (gym_id, class_id, user_id, pass_id, status, waitlisted_at)
    values (c.gym_id, p_class_id, uid, acc.pass_id, 'waitlisted', clock_timestamp())  -- clock time: ties inside one transaction
    returning id into bid;
  else
    perform private.refuse('class_full', jsonb_build_object('places_left', 0, 'waiting_count', waiting));
  end if;

  insert into public.audit_events (gym_id, actor_id, action, target_type, target_id, metadata)
  values (c.gym_id, uid, 'booking.' || st, 'booking', bid, jsonb_build_object('class_id', p_class_id));

  body := jsonb_build_object('booking_id', bid, 'status', st, 'class', private.class_view(p_class_id, uid),
                             'as_of', to_char(now() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'));
  perform private.store_idempotent_response(uid, p_idempotency_key, 201, body);
  return body;
end $$;

-- Cancel a place or leave the waitlist. Idempotent by state: cancelling a cancelled booking returns it unchanged.
-- Lateness is decided on the server clock against the deadline stored on the booking; a late cancel needs
-- p_acknowledge_late, so a member who saw "free" at 11:59:58 is asked again instead of being charged silently.
create or replace function api.cancel_booking(p_booking_id uuid, p_acknowledge_late boolean default false)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); cid uuid; c record; b record; late boolean;
begin
  if uid is null then perform private.refuse('unauthenticated'); end if;
  select class_id into cid from public.bookings where id = p_booking_id and user_id = uid;
  if not found then perform private.refuse('not_found'); end if;
  select * into strict c from public.classes where id = cid for update;          -- lock order: class, then booking
  select * into strict b from public.bookings where id = p_booking_id for update;

  if b.status in ('cancelled', 'late_cancelled') then
    return jsonb_build_object('booking_id', b.id, 'status', b.status, 'class', private.class_view(cid, uid),
                              'as_of', to_char(now() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'));
  end if;
  if b.status not in ('confirmed', 'waitlisted') then perform private.refuse('not_cancellable', jsonb_build_object('status', b.status)); end if;
  if c.starts_at <= now() then perform private.refuse('class_started'); end if;

  if b.status = 'waitlisted' then
    update public.bookings set status = 'cancelled', cancelled_at = now(), cancel_reason = 'member' where id = b.id;
  else
    late := now() >= b.free_cancel_until;
    if late and not coalesce(p_acknowledge_late, false) then
      perform private.refuse('late_cancel_unconfirmed', jsonb_build_object(
        'free_cancel_until', to_char(b.free_cancel_until at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')));
    end if;
    update public.bookings
       set status = case when late then 'late_cancelled' else 'cancelled' end,
           cancelled_at = now(), cancel_reason = case when late then 'member_late' else 'member' end
     where id = b.id;
    perform private.promote_waitlist(cid);                            -- same transaction: the place is never free while people wait
  end if;

  insert into public.audit_events (gym_id, actor_id, action, target_type, target_id, metadata)
  values (c.gym_id, uid, 'booking.cancelled', 'booking', b.id, jsonb_build_object('class_id', cid, 'late', coalesce(late, false)));
  return jsonb_build_object('booking_id', b.id,
    'status', (select status from public.bookings where id = b.id),
    'class', private.class_view(cid, uid),
    'as_of', to_char(now() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'));
end $$;

-- Desk check-in. Staff of the booking's gym only; idempotent (attended stays attended); fixes a no-show marked by the job.
create or replace function api.check_in(p_booking_id uuid)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); b record; c record;
begin
  if uid is null then perform private.refuse('unauthenticated'); end if;
  select bk.* into b from public.bookings bk
   where bk.id = p_booking_id and bk.gym_id in (select private.my_staff_gym_ids())
   for update;
  if not found then perform private.refuse('not_found'); end if;   -- other gyms' bookings do not exist for this caller
  select * into strict c from public.classes where id = b.class_id;
  if b.status = 'attended' then
    return jsonb_build_object('booking_id', b.id, 'status', 'attended', 'checked_in_at', b.checked_in_at);
  end if;
  if b.status not in ('confirmed', 'no_show') then perform private.refuse('not_checkable', jsonb_build_object('status', b.status)); end if;
  if now() < c.starts_at - interval '2 hours' or now() > c.ends_at + interval '12 hours' then
    perform private.refuse('outside_check_in_window');
  end if;
  update public.bookings set status = 'attended', checked_in_at = now(), checked_in_by = uid where id = b.id;
  insert into public.audit_events (gym_id, actor_id, action, target_type, target_id, metadata)
  values (b.gym_id, uid, 'booking.checked_in', 'booking', b.id, '{}'::jsonb);
  return jsonb_build_object('booking_id', b.id, 'status', 'attended', 'checked_in_at', now());
end $$;

-- The member's schedule screen: one week at one location, in the location's zone, one snapshot.
-- Keyset pagination over (starts_at, id); limit default 50, clamped to 100.
create or replace function api.location_schedule(p_location_id uuid, p_week date, p_limit integer default 50,
                                                 p_after_starts_at timestamptz default null, p_after_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); l record; wk date; lo timestamptz; hi timestamptz; lim integer;
        rows_ jsonb; ids uuid[]; more boolean; last_starts timestamptz; last_id uuid; acc record; nxt date; today_ date; booked integer; waitl integer; total integer;
begin
  if uid is null then perform private.refuse('unauthenticated'); end if;
  select lo_.*, gy.name as gym_name into l from public.locations lo_ join public.gyms gy on gy.id = lo_.gym_id
   where lo_.id = p_location_id and lo_.gym_id in (select private.my_gym_ids());
  if not found then perform private.refuse('not_found'); end if;
  wk := date_trunc('week', p_week)::date;                            -- weeks start Monday, in the location's calendar
  lo := wk::timestamp at time zone l.time_zone;
  hi := (wk + 7)::timestamp at time zone l.time_zone;
  lim := least(greatest(coalesce(p_limit, 50), 1), 100);
  today_ := (now() at time zone l.time_zone)::date;

  select array_agg(id order by starts_at, id) into ids from (
    select c.id, c.starts_at from public.classes c
     where c.location_id = p_location_id and c.starts_at >= lo and c.starts_at < hi
       and (p_after_starts_at is null or (c.starts_at, c.id) > (p_after_starts_at, p_after_id))
     order by c.starts_at, c.id limit lim + 1) s;
  ids := coalesce(ids, '{}');
  more := cardinality(ids) > lim;
  if more then ids := ids[1:lim]; end if;
  select coalesce(jsonb_agg(private.class_view(x, uid) order by o), '[]'::jsonb) into rows_
    from unnest(ids) with ordinality as t(x, o);
  if more then select starts_at, id into last_starts, last_id from public.classes where id = ids[lim]; end if;

  -- Summary over the whole week, not the page.
  select count(*) filter (where c.status = 'scheduled') into total from public.classes c
   where c.location_id = p_location_id and c.starts_at >= lo and c.starts_at < hi;
  select count(*) filter (where b.status in ('confirmed', 'attended', 'no_show')),
         count(*) filter (where b.status = 'waitlisted')
    into booked, waitl
    from public.bookings b join public.classes c on c.id = b.class_id
   where b.user_id = uid and c.location_id = p_location_id and c.starts_at >= lo and c.starts_at < hi;
  select (date_trunc('week', min(c.starts_local)))::date into nxt from public.classes c
   where c.location_id = p_location_id and c.status = 'scheduled' and c.starts_at >= hi;
  select * into acc from private.member_access(l.gym_id, uid);

  return jsonb_build_object(
    'location', jsonb_build_object('id', l.id, 'name', l.name, 'time_zone', l.time_zone,
                                   'gym', jsonb_build_object('id', l.gym_id, 'name', l.gym_name)),
    'period', jsonb_build_object('start_date', wk, 'end_date', wk + 6, 'today', today_, 'time_zone', l.time_zone),
    'filters', jsonb_build_object('location_id', p_location_id, 'week', wk),
    'data', rows_,
    'has_more', more,
    'next_cursor', case when more then jsonb_build_object('starts_at', last_starts, 'id', last_id) end,
    'summary', jsonb_build_object(
      'as_of', to_char(now() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      'class_count', total,
      'my_booked_count', booked,
      'my_waitlisted_count', waitl,
      'next_week_with_classes', nxt),
    'me', jsonb_build_object('access', jsonb_build_object(
      'status', acc.status, 'pass_kind', acc.pass_kind, 'reason', acc.reason,
      'grace_ends_at', to_char(acc.grace_ends_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'),
      'credits_left', acc.credits_left,
      'renews_at', to_char(acc.renews_at at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"'))));
end $$;

-- Owner view: attendance per class over the last N days (default 30), newest first, keyset paginated.
create or replace function api.gym_attendance(p_gym_id uuid, p_days integer default 30, p_limit integer default 50,
                                              p_before_starts_at timestamptz default null, p_before_id uuid default null)
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare uid uuid := (select auth.uid()); lim integer; lo timestamptz; rows_ jsonb; n integer; s jsonb;
begin
  if uid is null then perform private.refuse('unauthenticated'); end if;
  if p_gym_id not in (select private.my_owner_gym_ids()) then perform private.refuse('not_found'); end if;
  lim := least(greatest(coalesce(p_limit, 50), 1), 100);
  lo := now() - make_interval(days => least(greatest(coalesce(p_days, 30), 1), 90));
  with page as (
    select c.id, c.starts_at, c.starts_local, c.capacity, ct.name, l.name as location_name
      from public.classes c join public.class_types ct on ct.id = c.class_type_id join public.locations l on l.id = c.location_id
     where c.gym_id = p_gym_id and c.status = 'scheduled' and c.starts_at >= lo and c.ends_at <= now()
       and (p_before_starts_at is null or (c.starts_at, c.id) < (p_before_starts_at, p_before_id))
     order by c.starts_at desc, c.id desc limit lim + 1)
  select jsonb_agg(jsonb_build_object(
           'class_id', p.id, 'class_type', p.name, 'location', p.location_name,
           'starts_local', to_char(p.starts_local, 'YYYY-MM-DD"T"HH24:MI:SS'), 'capacity', p.capacity,
           'attended', (select count(*) from public.bookings b where b.class_id = p.id and b.status = 'attended'),
           'no_show', (select count(*) from public.bookings b where b.class_id = p.id and b.status = 'no_show'),
           'late_cancelled', (select count(*) from public.bookings b where b.class_id = p.id and b.status = 'late_cancelled'))
         order by p.starts_at desc, p.id desc), count(*)
    into rows_, n from page p;
  select jsonb_build_object('attended', count(*) filter (where b.status = 'attended'),
                            'no_show', count(*) filter (where b.status = 'no_show'),
                            'late_cancelled', count(*) filter (where b.status = 'late_cancelled'))
    into s from public.bookings b join public.classes c on c.id = b.class_id
   where c.gym_id = p_gym_id and c.status = 'scheduled' and c.starts_at >= lo and c.ends_at <= now();
  return jsonb_build_object(
    'data', coalesce(case when n > lim then rows_ - lim else rows_ end, '[]'::jsonb),
    'has_more', coalesce(n > lim, false),
    'period', jsonb_build_object('from', lo, 'to', now()),
    'summary', s || jsonb_build_object('as_of', to_char(now() at time zone 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS"Z"')));
end $$;

-- Job (pg_cron every 15 minutes): places nobody checked into become no-shows once the class has ended.
create or replace function private.mark_no_shows() returns integer
language plpgsql security definer set search_path = '' as $$
declare n integer;
begin
  update public.bookings b set status = 'no_show'
    from public.classes c
   where c.id = b.class_id and b.status = 'confirmed' and c.ends_at <= now();
  get diagnostics n = row_count;
  return n;
end $$;

-- ---------------------------------------------------------------------------------------------------------------
-- Grants and row level security. Default deny: revoke everything, grant back per role, one policy per operation.
-- ---------------------------------------------------------------------------------------------------------------
revoke all on all tables in schema public from anon, authenticated;
revoke all on all functions in schema private from public, anon, authenticated;
revoke all on all functions in schema api from public, anon;
grant usage on schema private to authenticated;
grant usage on schema api to authenticated;
grant execute on function private.my_gym_ids(), private.my_staff_gym_ids(), private.my_owner_gym_ids() to authenticated;
-- Column defaults and CHECKs on tables staff write through the Data API.
grant execute on function private.uuid_v7(), private.is_valid_time_zone(text) to authenticated;
grant execute on function api.book_class(uuid, boolean, uuid), api.cancel_booking(uuid, boolean), api.check_in(uuid),
  api.location_schedule(uuid, date, integer, timestamptz, uuid),
  api.gym_attendance(uuid, integer, integer, timestamptz, uuid) to authenticated;

alter table public.gyms enable row level security;
alter table public.locations enable row level security;
alter table public.profiles enable row level security;
alter table public.gym_memberships enable row level security;
alter table public.class_types enable row level security;
alter table public.classes enable row level security;
alter table public.stripe_customers enable row level security;
alter table public.passes enable row level security;
alter table public.bookings enable row level security;
alter table public.idempotency_keys enable row level security;   -- no policies: server functions only
alter table public.stripe_events enable row level security;      -- no policies: webhook handler (service role) only
alter table public.audit_events enable row level security;

grant select on public.gyms, public.locations, public.class_types, public.classes, public.gym_memberships,
  public.profiles, public.passes, public.bookings, public.audit_events to authenticated;
grant update (name, slug, free_cancel_window, past_due_grace) on public.gyms to authenticated;
grant insert (gym_id, name, time_zone), update (name, time_zone) on public.locations to authenticated;
grant insert (gym_id, name), update (name) on public.class_types to authenticated;
grant insert (gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity, created_by),
      update (location_id, class_type_id, instructor_id, starts_local, ends_local, capacity, status, cancelled_at)
  on public.classes to authenticated;
grant insert (gym_id, user_id, role), update (role, ended_at) on public.gym_memberships to authenticated;
grant update (display_name) on public.profiles to authenticated;

-- gyms
create policy gyms_select on public.gyms for select to authenticated
  using (id = any (array(select private.my_gym_ids())));
create policy gyms_update on public.gyms for update to authenticated
  using (id = any (array(select private.my_owner_gym_ids())))
  with check (id = any (array(select private.my_owner_gym_ids())));

-- locations: every member reads; owners write
create policy locations_select on public.locations for select to authenticated
  using (gym_id = any (array(select private.my_gym_ids())));
create policy locations_insert on public.locations for insert to authenticated
  with check (gym_id = any (array(select private.my_owner_gym_ids())));
create policy locations_update on public.locations for update to authenticated
  using (gym_id = any (array(select private.my_owner_gym_ids())))
  with check (gym_id = any (array(select private.my_owner_gym_ids())));

-- class types: every member reads; staff write
create policy class_types_select on public.class_types for select to authenticated
  using (gym_id = any (array(select private.my_gym_ids())));
create policy class_types_insert on public.class_types for insert to authenticated
  with check (gym_id = any (array(select private.my_staff_gym_ids())));
create policy class_types_update on public.class_types for update to authenticated
  using (gym_id = any (array(select private.my_staff_gym_ids())))
  with check (gym_id = any (array(select private.my_staff_gym_ids())));

-- classes: every member reads the schedule; staff publish, edit and cancel (no delete: cancel instead)
create policy classes_select on public.classes for select to authenticated
  using (gym_id = any (array(select private.my_gym_ids())));
create policy classes_insert on public.classes for insert to authenticated
  with check (gym_id = any (array(select private.my_staff_gym_ids())) and created_by = (select auth.uid()));
create policy classes_update on public.classes for update to authenticated
  using (gym_id = any (array(select private.my_staff_gym_ids())))
  with check (gym_id = any (array(select private.my_staff_gym_ids())));

-- memberships: you see your own rows; staff see their gym's; owners manage their gym's
create policy gym_memberships_select on public.gym_memberships for select to authenticated
  using (user_id = (select auth.uid()) or gym_id = any (array(select private.my_staff_gym_ids())));
create policy gym_memberships_insert on public.gym_memberships for insert to authenticated
  with check (gym_id = any (array(select private.my_owner_gym_ids())));
create policy gym_memberships_update on public.gym_memberships for update to authenticated
  using (gym_id = any (array(select private.my_owner_gym_ids())))
  with check (gym_id = any (array(select private.my_owner_gym_ids())));

-- profiles: yourself; staff see people in their gyms; members see the staff of their gyms (instructor names)
create or replace function private.visible_profile_ids() returns setof uuid
language sql stable security definer set search_path = '' as $$
  select m.user_id from public.gym_memberships m
   where m.ended_at is null and (
         m.gym_id in (select private.my_staff_gym_ids())
      or (m.gym_id in (select private.my_gym_ids()) and m.role in ('owner', 'staff')))
$$;
revoke all on function private.visible_profile_ids() from public, anon;
grant execute on function private.visible_profile_ids() to authenticated;
create policy profiles_select on public.profiles for select to authenticated
  using (id = (select auth.uid()) or id = any (array(select private.visible_profile_ids())));
create policy profiles_update on public.profiles for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));

-- passes and bookings: your own, or staff of that gym. Writes only through api.* and the Stripe sync (service role).
create policy passes_select on public.passes for select to authenticated
  using (user_id = (select auth.uid()) or gym_id = any (array(select private.my_staff_gym_ids())));
create policy bookings_select on public.bookings for select to authenticated
  using (user_id = (select auth.uid()) or gym_id = any (array(select private.my_staff_gym_ids())));

-- audit: owners read their gym's history
create policy audit_events_select on public.audit_events for select to authenticated
  using (gym_id = any (array(select private.my_owner_gym_ids())));

-- Service role (server only: Stripe sync, webhooks, jobs) keeps full access and bypasses RLS.
grant all on all tables in schema public to service_role;
grant usage on schema private, api to service_role;
grant execute on all functions in schema private to service_role;
grant execute on all functions in schema api to service_role;
