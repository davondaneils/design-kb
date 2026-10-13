#!/usr/bin/env bash
# Crux data layer tests: static gate checks, concurrency, idempotency and cross-gym isolation.
# Runs against a scratch PostgreSQL 16 with tests/00_supabase_stub.sql standing in for Supabase.
#
#   PGHOST=/tmp/crux-pg PGPORT=55432 bash tests/run_tests.sh
#
# Concurrency method: a controller session holds advisory lock 1; every worker transaction first waits for a shared
# lock on 1, so when the controller lets go all workers call the API at the same instant. Workers then sleep inside
# their transaction to widen the race window. A negative control runs the same race against a booking function
# without the class lock (and without the capacity guard) to prove the test can see an oversell.
set -u
HERE="$(cd "$(dirname "$0")" && pwd)"
ROOT="$(cd "$HERE/.." && pwd)"
PGBIN="${PGBIN:-/usr/lib/postgresql/16/bin}"
export PGHOST="${PGHOST:-/tmp/crux-pg}" PGPORT="${PGPORT:-55432}" PGUSER="${PGUSER:-postgres}"
DB=crux_test
OUT="$(mktemp -d)"
pass=0; fail=0

psql_db() { "$PGBIN/psql" -d "$1" -v ON_ERROR_STOP=1 -qAt "${@:2}"; }
q() { psql_db "$DB" -c "$1"; }
# Run SQL as an authenticated user, the way PostgREST does: role authenticated plus the JWT claims for this request.
as() { local uid="$1"; shift
  "$PGBIN/psql" -d "$DB" -v ON_ERROR_STOP=1 -qAt -c "begin; set local role authenticated; select set_config('request.jwt.claims', '{\"sub\":\"$uid\"}', true) is not null as _; $1; commit;" 2>&1 | grep -v '^t$'; }
as_anon() { "$PGBIN/psql" -d "$DB" -qAt -c "begin; set local role anon; $1; commit;" 2>&1; }
check() { local name="$1" got="$2" want="$3"
  if [[ "$got" == "$want" ]]; then echo "PASS  $name"; pass=$((pass+1)); else echo "FAIL  $name"; echo "      want: $want"; echo "      got:  $got"; fail=$((fail+1)); fi; }
code_of() { grep -o 'crux:[a-z_]*' <<<"$1" | head -1; }

# Barrier helpers
barrier_hold() { "$PGBIN/psql" -d "$1" -qAt -c "select pg_advisory_lock(1); select pg_sleep(${2:-1.5});" >/dev/null 2>&1 & }
worker() { # db uid sql outfile
  "$PGBIN/psql" -d "$1" -v ON_ERROR_STOP=1 -qAt -c "begin; set local role authenticated; select set_config('request.jwt.claims', '{\"sub\":\"$2\"}', true) is not null as _; select pg_advisory_xact_lock_shared(1) is not null as _; $3; select pg_sleep(0.3) is not null as _; commit;" 2>&1 | grep -v '^t$' >"$4" &
}

M() { printf 'd0000000-0000-7000-8000-0000000000%02d' "$1"; }
MAYA=c0000000-0000-7000-8000-0000000000aa; LEE=c0000000-0000-7000-8000-0000000000bb
PRIYA=c0000000-0000-7000-8000-000000000002; GYM_A=a0000000-0000-7000-8000-000000000001; GYM_B=b0000000-0000-7000-8000-000000000001
EAST=a1000000-0000-7000-8000-000000000001

fresh_db() {
  psql_db postgres -c "drop database if exists $1" -c "create database $1" >/dev/null
  psql_db "$1" -f "$HERE/00_supabase_stub.sql" -f "$ROOT/schema.sql" -f "$HERE/01_seed.sql" -o /dev/null
}
new_class() { # id starts_local capacity instructor_n (2,3,4)
  q "insert into public.classes (id, gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity)
     values ('$1', '$GYM_A', '$EAST', 'a2000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-00000000000$4',
             '$2', timestamp '$2' + interval '90 minutes', $3)"
}

echo "Crux data layer tests, $(date -u +%Y-%m-%dT%H:%M:%SZ), $("$PGBIN/postgres" --version)"
fresh_db "$DB"

echo; echo "== 0. Static gate checks =="
check "every public table has a primary key" \
  "$(q "select count(*) from pg_class c join pg_namespace n on n.oid = c.relnamespace where n.nspname = 'public' and c.relkind = 'r' and not exists (select 1 from pg_constraint k where k.conrelid = c.oid and k.contype = 'p')")" "0"
check "row level security enabled on every public table" \
  "$(q "select count(*) from pg_tables where schemaname = 'public' and not rowsecurity")" "0"
check "every foreign key's leading column leads a full (non-partial) index" \
  "$(q "select count(*) from pg_constraint k where k.contype = 'f' and k.connamespace = 'public'::regnamespace and not exists (
          select 1 from pg_index i where i.indrelid = k.conrelid and i.indpred is null and i.indkey[0] = k.conkey[1])")" "0"
check "no float, money, serial, char(n) or timestamp-without-zone columns except wall-clock class times" \
  "$(q "select coalesce(string_agg(table_name || '.' || column_name, ','), '') from information_schema.columns where table_schema = 'public'
         and (data_type in ('real', 'double precision', 'money', 'character') or column_default like 'nextval%'
              or (data_type = 'timestamp without time zone' and column_name not in ('starts_local', 'ends_local')))")" ""
check "security definer functions pin search_path" \
  "$(q "select count(*) from pg_proc p where p.pronamespace in ('private'::regnamespace, 'api'::regnamespace) and p.prosecdef
         and not exists (select 1 from unnest(coalesce(p.proconfig, '{}')) c where c like 'search_path=%')")" "0"
check "anon can execute no api function" \
  "$(q "select count(*) from pg_proc where pronamespace = 'api'::regnamespace and has_function_privilege('anon', oid, 'execute')")" "0"
check "schedule query uses the (location_id, starts_at, id) index" \
  "$(q "set enable_seqscan = off; explain select id from public.classes where location_id = '$EAST' and starts_at >= '2026-10-12T06:00Z' and starts_at < '2026-10-19T06:00Z' order by starts_at, id limit 51" | grep -c classes_location_week_idx)" "1"

echo; echo "== 1. Two members take the last place at once =="
X1=a3100000-0000-7000-8000-000000000001
new_class "$X1" "2026-10-20 18:00" 8 3
for i in 1 2 3 4 5 6 7; do as "$(M $i)" "select api.book_class('$X1', false, gen_random_uuid()) is not null" >/dev/null; done
barrier_hold "$DB"; sleep 0.4
worker "$DB" "$(M 8)" "select api.book_class('$X1', false, gen_random_uuid())->>'status'" "$OUT/w8"
worker "$DB" "$(M 9)" "select api.book_class('$X1', false, gen_random_uuid())->>'status'" "$OUT/w9"
wait
r8="$(grep -o 'confirmed\|crux:[a-z_]*' "$OUT/w8" | head -1)"; r9="$(grep -o 'confirmed\|crux:[a-z_]*' "$OUT/w9" | head -1)"
check "one gets the place, the other is told the class is full" "$(printf '%s\n%s\n' "$r8" "$r9" | sort | tr '\n' ' ')" "confirmed crux:class_full "
check "places taken equals capacity (8 of 8)" "$(q "select count(*) from bookings where class_id = '$X1' and status = 'confirmed'")" "8"

echo; echo "== 1b. Thirty members book an empty class of 10 at once (waitlist on) =="
X2=a3100000-0000-7000-8000-000000000002
new_class "$X2" "2026-10-21 18:00" 10 3
barrier_hold "$DB" 2; sleep 0.4
for i in $(seq 1 30); do worker "$DB" "$(M "$i")" "select api.book_class('$X2', true, gen_random_uuid())->>'status'" "$OUT/s$i"; done
wait
check "exactly 10 confirmed" "$(q "select count(*) from bookings where class_id = '$X2' and status = 'confirmed'")" "10"
check "exactly 20 waitlisted" "$(q "select count(*) from bookings where class_id = '$X2' and status = 'waitlisted'")" "20"
check "no request failed" "$(cat "$OUT"/s* | grep -c ERROR)" "0"
check "waitlist order is total (20 distinct positions)" "$(q "select count(distinct (waitlisted_at, id)) from bookings where class_id = '$X2' and status = 'waitlisted'")" "20"

echo; echo "== 1c. Negative control: same race without the class lock oversells =="
fresh_db crux_naive
psql_db crux_naive -c "alter table public.bookings disable trigger bookings_class_capacity;
  create function public.naive_book(p_class uuid, p_user uuid) returns text language plpgsql as \$\$
  declare taken int; cap int; begin
    select capacity into cap from classes where id = p_class;                       -- no FOR UPDATE
    select count(*) into taken from bookings where class_id = p_class and status = 'confirmed';
    perform pg_sleep(0.3);
    if taken >= cap then return 'full'; end if;
    insert into bookings (gym_id, class_id, user_id, pass_id, status, confirmed_at, free_cancel_until)
    select gym_id, id, p_user, (select id from passes where user_id = p_user and gym_id = classes.gym_id limit 1), 'confirmed', now(), starts_at
      from classes where id = p_class;
    return 'confirmed'; end \$\$;" >/dev/null
psql_db crux_naive -c "insert into classes (id, gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity)
  values ('$X1', '$GYM_A', '$EAST', 'a2000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-000000000003', '2026-10-20 18:00', '2026-10-20 19:30', 1)" >/dev/null
barrier_hold crux_naive; sleep 0.4
for i in 8 9; do "$PGBIN/psql" -d crux_naive -qAt -c "begin; select pg_advisory_xact_lock_shared(1) is not null as _; select public.naive_book('$X1', '$(M $i)'); commit;" >"$OUT/n$i" 2>&1 & done
wait
check "control: 2 confirmed in a class of 1 (the test can see an oversell)" "$(psql_db crux_naive -c "select count(*) from bookings where class_id = '$X1' and status = 'confirmed'")" "2"

echo; echo "== 2. Two cancels promote from the waitlist at once =="
X3=a3100000-0000-7000-8000-000000000003
new_class "$X3" "2026-10-22 18:00" 8 3
for i in 1 2 3 4 5 6 7 8 9 10 11; do as "$(M $i)" "select api.book_class('$X3', true, gen_random_uuid()) is not null" >/dev/null; done
B1="$(q "select id from bookings where class_id = '$X3' and user_id = '$(M 1)'")"; B2="$(q "select id from bookings where class_id = '$X3' and user_id = '$(M 2)'")"
barrier_hold "$DB"; sleep 0.4
worker "$DB" "$(M 1)" "select api.cancel_booking('$B1', false)->>'status'" "$OUT/c1"
worker "$DB" "$(M 2)" "select api.cancel_booking('$B2', false)->>'status'" "$OUT/c2"
wait
check "both cancels succeed" "$(cat "$OUT/c1" "$OUT/c2" | sort | tr '\n' ' ')" "cancelled cancelled "
check "the first two in line are promoted, in order" "$(q "select string_agg(right(user_id::text, 2), ',' order by user_id) from bookings where class_id = '$X3' and promoted_at is not null")" "09,10"
check "places taken still equals capacity (8 of 8)" "$(q "select count(*) from bookings where class_id = '$X3' and status = 'confirmed'")" "8"
check "the third in line is now first" "$(q "select private.class_view('$X3', '$(M 11)')->'my_booking'->>'waitlist_rank'")" "1"

echo; echo "== 2b. A cancel and a new booking at once: nobody jumps the queue =="
X4=a3100000-0000-7000-8000-000000000004
new_class "$X4" "2026-10-23 18:00" 8 3
for i in 1 2 3 4 5 6 7 8 9; do as "$(M $i)" "select api.book_class('$X4', true, gen_random_uuid()) is not null" >/dev/null; done
B1="$(q "select id from bookings where class_id = '$X4' and user_id = '$(M 1)'")"
barrier_hold "$DB"; sleep 0.4
worker "$DB" "$(M 1)" "select api.cancel_booking('$B1', false)->>'status'" "$OUT/q1"
worker "$DB" "$(M 12)" "select api.book_class('$X4', true, gen_random_uuid())->>'status'" "$OUT/q12"
wait
check "the waiting member got the place" "$(q "select status from bookings where class_id = '$X4' and user_id = '$(M 9)'")" "confirmed"
check "the new booker joined the waitlist" "$(q "select status from bookings where class_id = '$X4' and user_id = '$(M 12)'")" "waitlisted"
check "places taken equals capacity (8 of 8)" "$(q "select count(*) from bookings where class_id = '$X4' and status = 'confirmed'")" "8"

echo; echo "== 3. A member cannot book twice =="
X5=a3100000-0000-7000-8000-000000000005
new_class "$X5" "2026-10-24 10:00" 10 2
barrier_hold "$DB"; sleep 0.4
worker "$DB" "$(M 1)" "select api.book_class('$X5', true, gen_random_uuid())->>'status'" "$OUT/d1"
worker "$DB" "$(M 1)" "select api.book_class('$X5', true, gen_random_uuid())->>'status'" "$OUT/d2"
wait
check "two taps with different keys: one booking, one already_booked" \
  "$(printf '%s\n%s\n' "$(grep -o 'confirmed\|crux:[a-z_]*' "$OUT/d1" | head -1)" "$(grep -o 'confirmed\|crux:[a-z_]*' "$OUT/d2" | head -1)" | sort | tr '\n' ' ')" "confirmed crux:already_booked "
check "one live booking for that member" "$(q "select count(*) from bookings where class_id = '$X5' and user_id = '$(M 1)' and status <> 'cancelled'")" "1"
K=11111111-1111-4111-8111-111111111111
barrier_hold "$DB"; sleep 0.4
worker "$DB" "$(M 2)" "select api.book_class('$X5', true, '$K')->>'booking_id'" "$OUT/k1"
worker "$DB" "$(M 2)" "select api.book_class('$X5', true, '$K')->>'booking_id'" "$OUT/k2"
wait
check "a retry with the same key at the same time replays the same booking" "$(cat "$OUT/k1" "$OUT/k2" | sort -u | grep -c .)" "1"
check "...and created one row" "$(q "select count(*) from bookings where class_id = '$X5' and user_id = '$(M 2)'")" "1"
check "same key, different request: idempotency_key_reused" "$(code_of "$(as "$(M 2)" "select api.book_class('$X1', true, '$K')")")" "crux:idempotency_key_reused"
B="$(q "select id from bookings where class_id = '$X5' and user_id = '$(M 1)' and status = 'confirmed'")"
as "$(M 1)" "select api.cancel_booking('$B', false) is not null" >/dev/null
check "cancelling twice is safe (state unchanged)" "$(as "$(M 1)" "select api.cancel_booking('$B', false)->>'status'")" "cancelled"
check "a member who cancelled may book again" "$(as "$(M 1)" "select api.book_class('$X5', true, gen_random_uuid())->>'status'")" "confirmed"
check "the database refuses a second live booking even from the server" \
  "$(q "insert into bookings (gym_id, class_id, user_id, pass_id, status, confirmed_at, free_cancel_until) select gym_id, class_id, user_id, pass_id, 'confirmed', now(), now() from bookings where class_id = '$X5' and user_id = '$(M 1)' and status = 'confirmed'" 2>&1 | grep -o 'bookings_one_live_per_member')" "bookings_one_live_per_member"

echo; echo "== 4. Cross-gym isolation (Maya is a member of both gyms) =="
check "staff B sees none of gym A's bookings" "$(as "$LEE" "select count(*) from bookings where gym_id = '$GYM_A'")" "0"
check "staff B sees only gym B bookings of the shared member" "$(as "$LEE" "select string_agg(distinct gym_id::text, ',') from bookings where user_id = '$MAYA'")" "$GYM_B"
check "staff B sees no gym A memberships, passes or classes" "$(as "$LEE" "select (select count(*) from gym_memberships where gym_id = '$GYM_A') + (select count(*) from passes where gym_id = '$GYM_A') + (select count(*) from classes where gym_id = '$GYM_A')")" "0"
check "staff B cannot read a gym A member's profile" "$(as "$LEE" "select count(*) from profiles where id = '$(M 1)'")" "0"
check "staff A sees only gym A bookings of the shared member" "$(as "$PRIYA" "select string_agg(distinct gym_id::text, ',') from bookings where user_id = '$MAYA'")" "$GYM_A"
check "the member sees her own bookings in both gyms" "$(as "$MAYA" "select count(distinct gym_id) from bookings")" "2"
check "a member sees only her own bookings" "$(as "$(M 1)" "select count(*) from bookings where user_id <> '$(M 1)'")" "0"
check "a member sees only her own membership rows" "$(as "$(M 1)" "select count(*) from gym_memberships where user_id <> '$(M 1)'")" "0"
MB="$(q "select id from bookings where user_id = '$MAYA' and class_id = 'a3000000-0000-7000-8000-000000000008'")"
check "staff B checking in a gym A booking: not_found" "$(code_of "$(as "$LEE" "select api.check_in('$MB')")")" "crux:not_found"
check "staff B reading gym A's schedule: not_found" "$(code_of "$(as "$LEE" "select api.location_schedule('$EAST', '2026-10-12')")")" "crux:not_found"
check "staff A can publish a class in gym A" "$(as "$PRIYA" "insert into classes (gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity, created_by) values ('$GYM_A', '$EAST', 'a2000000-0000-7000-8000-000000000002', '$PRIYA', '2026-10-30 10:00', '2026-10-30 11:00', 8, '$PRIYA') returning status")" "scheduled"
check "staff B inserting a class into gym A: refused by policy" "$(as "$LEE" "insert into classes (gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity, created_by) values ('$GYM_A', '$EAST', 'a2000000-0000-7000-8000-000000000001', '$LEE', '2026-10-30 10:00', '2026-10-30 11:00', 8, '$LEE')" | grep -o 'row-level security\|classes_location_fk' | head -1)" "classes_location_fk"
check "a gym A member (not staff) inserting a class: refused by row-level security" "$(as "$(M 1)" "insert into classes (gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity, created_by) values ('$GYM_A', '$EAST', 'a2000000-0000-7000-8000-000000000001', '$PRIYA', '2026-10-31 10:00', '2026-10-31 11:00', 8, '$(M 1)')" | grep -o 'row-level security' | head -1)" "row-level security"
check "owner A changes the free-cancel window (read back)" "$(as c0000000-0000-7000-8000-000000000001 "update gyms set free_cancel_window = interval '12 hours' where id = '$GYM_A' returning free_cancel_window::text")" "12:00:00"
check "staff A updating gym settings: 0 rows" "$(as "$PRIYA" "with u as (update gyms set free_cancel_window = interval '1 hour' where id = '$GYM_A' returning 1) select count(*) from u")" "0"
check "staff B reads gym B's bookings" "$(as "$LEE" "select (count(*) > 0)::text from bookings where gym_id = '$GYM_B'")" "true"
check "staff B updating a gym A class: 0 rows" "$(as "$LEE" "with u as (update classes set capacity = 1 where gym_id = '$GYM_A' returning 1) select count(*) from u")" "0"
check "a member cancelling someone else's booking: not_found" "$(code_of "$(as "$(M 1)" "select api.cancel_booking('$MB', true)")")" "crux:not_found"
check "a member cannot write bookings directly" "$(as "$(M 1)" "update bookings set status = 'attended' where user_id = '$(M 1)'" | grep -o 'permission denied')" "permission denied"
check "a member cannot check in (staff only)" "$(code_of "$(as "$(M 1)" "select api.check_in((select id from bookings where user_id = '$(M 1)' limit 1))")")" "crux:not_found"
check "anon reads nothing" "$(as_anon "select count(*) from classes" | grep -o 'permission denied')" "permission denied"
check "anon cannot call the api" "$(as_anon "select api.location_schedule('$EAST', '2026-10-12')" | grep -o 'permission denied')" "permission denied"

echo; echo "== 5. Capacity is a database invariant, and check-in never frees a place =="
check "server insert over capacity is refused by bookings_class_capacity" \
  "$(q "insert into bookings (gym_id, class_id, user_id, pass_id, status, confirmed_at, free_cancel_until) select c.gym_id, c.id, '$(M 40)', (select id from passes where user_id = '$(M 40)'), 'confirmed', now(), now() from classes c where c.id = '$X1'" 2>&1 | grep -o 'bookings_class_capacity')" "bookings_class_capacity"
q "update bookings set status = 'attended', checked_in_at = now() where class_id = '$X1' and user_id in ('$(M 1)', '$(M 2)')" >/dev/null
check "after two check-ins the class is still full" "$(code_of "$(as "$(M 40)" "select api.book_class('$X1', false, gen_random_uuid())")")" "crux:class_full"

X9=a3100000-0000-7000-8000-000000000009
q "insert into public.classes (id, gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity)
   values ('$X9', '$GYM_A', '$EAST', 'a2000000-0000-7000-8000-000000000001', 'c0000000-0000-7000-8000-000000000004',
           date_trunc('minute', (now() + interval '1 hour') at time zone 'America/Denver'),
           date_trunc('minute', (now() + interval '150 minutes') at time zone 'America/Denver'), 4)" >/dev/null
as "$(M 5)" "select api.book_class('$X9', false, gen_random_uuid()) is not null" >/dev/null
CB="$(q "select id from bookings where class_id = '$X9' and user_id = '$(M 5)'")"
check "staff A checks a member in" "$(as "$PRIYA" "select api.check_in('$CB')->>'status'")" "attended"
check "checking in twice is safe" "$(as "$PRIYA" "select api.check_in('$CB')->>'status'") $(q "select count(*) from audit_events where target_id = '$CB' and action = 'booking.checked_in'")" "attended 1"

echo; echo "== 6. Late cancel, promotion inside the window, payment grace =="
TUE=a3000000-0000-7000-8000-000000000002
TB="$(q "select id from bookings where class_id = '$TUE' and user_id = '$MAYA'")"
if [[ "$(q "select now() >= free_cancel_until and now() < (select starts_at from classes where id = '$TUE') from bookings where id = '$TB'")" == "t" ]]; then
  check "late cancel without confirmation: late_cancel_unconfirmed" "$(code_of "$(as "$MAYA" "select api.cancel_booking('$TB', false)")")" "crux:late_cancel_unconfirmed"
  check "late cancel with confirmation: late_cancelled" "$(as "$MAYA" "select api.cancel_booking('$TB', true)->>'status'")" "late_cancelled"
  check "first in line promoted, may cancel free until the start" "$(q "select (status = 'confirmed' and free_cancel_until = (select starts_at from classes where id = '$TUE'))::text from bookings where class_id = '$TUE' and user_id = '$(M 21)'")" "true"
else
  echo "SKIP  late-cancel checks: run between 12:30Z and 00:30Z on 2026-10-13, or move the class"
fi
WED=a3000000-0000-7000-8000-000000000003
q "update passes set status = 'past_due', past_due_since = now() - interval '2 days' where user_id = '$MAYA' and gym_id = '$GYM_A'" >/dev/null
check "past due inside 7 days: access grace" "$(q "select status from private.member_access('$GYM_A', '$MAYA')")" "grace"
check "past due inside 7 days: booking allowed" "$(as "$MAYA" "select api.book_class('$WED', false, gen_random_uuid())->>'status'")" "confirmed"
q "update passes set past_due_since = now() - interval '8 days' where user_id = '$MAYA' and gym_id = '$GYM_A'" >/dev/null
check "past due over 7 days: no_access (grace ended)" "$(as "$MAYA" "select api.book_class('a3000000-0000-7000-8000-000000000006', false, gen_random_uuid())" | grep -o 'crux:no_access\|payment_past_due_grace_ended' | sort -u | tr '\n' ' ')" "crux:no_access payment_past_due_grace_ended "
check "gym B access unaffected by gym A's failed payment" "$(q "select status from private.member_access('$GYM_B', '$MAYA')")" "active"

echo; echo "== 7. One pack credit cannot pay for two classes at once =="
q "update passes set status = 'canceled' where user_id = '$(M 39)' and gym_id = '$GYM_A';
   insert into passes (gym_id, user_id, kind, status, stripe_checkout_session_id, credits_total, price_minor, currency)
   values ('$GYM_A', '$(M 39)', 'pack', 'active', 'cs_test_m39', 1, 15000, 'usd')" >/dev/null
X6=a3100000-0000-7000-8000-000000000006
new_class "$X6" "2026-10-25 10:00" 10 4
barrier_hold "$DB"; sleep 0.4
worker "$DB" "$(M 39)" "select api.book_class('$X5', false, gen_random_uuid())->>'status'" "$OUT/p1"
worker "$DB" "$(M 39)" "select api.book_class('$X6', false, gen_random_uuid())->>'status'" "$OUT/p2"
wait
check "one booking, one no_access" "$(printf '%s\n%s\n' "$(grep -o 'confirmed\|crux:[a-z_]*' "$OUT/p1" | head -1)" "$(grep -o 'confirmed\|crux:[a-z_]*' "$OUT/p2" | head -1)" | sort | tr '\n' ' ')" "confirmed crux:no_access "
check "credits left: 0" "$(q "select private.pack_credits_left(id) from passes where user_id = '$(M 39)' and kind = 'pack'")" "0"

echo; echo "== 8. A class moved or cancelled by the gym keeps its promises =="
X7=a3100000-0000-7000-8000-000000000007
new_class "$X7" "2026-10-26 18:00" 10 2
as "$(M 3)" "select api.book_class('$X7', false, gen_random_uuid()) is not null" >/dev/null
q "update classes set starts_local = '2026-10-26 19:00', ends_local = '2026-10-26 20:30' where id = '$X7'" >/dev/null
check "moved class: free cancellation until the new start" "$(q "select (b.free_cancel_until = c.starts_at)::text from bookings b join classes c on c.id = b.class_id where b.class_id = '$X7'")" "true"
check "moved class: version bumped for If-Match" "$(q "select version from classes where id = '$X7'")" "2"
q "update classes set status = 'cancelled', cancelled_at = now() where id = '$X7'" >/dev/null
check "cancelled class: bookings cancelled with reason class_cancelled" "$(q "select status || ':' || cancel_reason from bookings where class_id = '$X7'")" "cancelled:class_cancelled"
check "instructor double-booked: refused by classes_instructor_no_overlap" "$(new_class a3100000-0000-7000-8000-000000000008 '2026-10-24 10:30' 8 2 2>&1 | grep -o 'classes_instructor_no_overlap')" "classes_instructor_no_overlap"

echo; echo "Result: $pass passed, $fail failed"
rm -rf "$OUT"
[[ $fail -eq 0 ]]
