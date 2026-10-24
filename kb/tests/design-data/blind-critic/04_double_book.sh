#!/bin/bash
# Test: one member books the same class twice at once (different keys, same key), and direct-write backstops.
source $(dirname $0)/lib.sh
C=e0000000-0000-0000-0000-000000000004; K=11111111-2222-4333-8444-555555555555
echo "#### X: same member, two different idempotency keys, in parallel"
fresh t_x crux_x; mkclass_x t_x $C 5 72
session t_x 10 "select api.book_class('$C', false, gen_random_uuid())->>'status'; select pg_sleep(1.5);" & sleep 0.2
session t_x 10 "select api.book_class('$C', false, gen_random_uuid())->>'status';" & wait
$PSQL -d t_x -c "select 'X rows for u10: '||count(*) from bookings where class_id='$C' and user_id='$(uid 10)'"
echo "#### X: same member, same idempotency key, in parallel (expect one booking, second is a replay)"
fresh t_x crux_x; mkclass_x t_x $C 5 72
session t_x 10 "select api.book_class('$C', false, '$K')->>'booking_id'; select pg_sleep(1.5);" & sleep 0.2
session t_x 10 "select (r->>'booking_id')||' replay='||coalesce(r->>'idempotent_replay','false') from (select api.book_class('$C', false, '$K') r) s;" & wait
$PSQL -d t_x -c "select 'X rows for u10: '||count(*) from bookings where class_id='$C' and user_id='$(uid 10)'"
echo "#### X: same key reused for a different class (expect idempotency_key_reused)"
mkclass_x t_x e0000000-0000-0000-0000-000000000005 5 80
session t_x 10 "select api.book_class('e0000000-0000-0000-0000-000000000005', false, '$K')->>'status';" | head -2
echo "#### X: service role inserts a 6th confirmed booking directly into a 5-place class (capacity trigger backstop)"
for u in 11 12 13 14; do session t_x $u "select api.book_class('$C', false, gen_random_uuid())->>'status';" >/dev/null; done
$PSQL -d t_x -c "set role service_role; insert into public.bookings(gym_id,class_id,user_id,pass_id,status,confirmed_at,free_cancel_until) select gym_id,'$C',user_id,id,'confirmed',now(),now()+interval '1 day' from passes where user_id='$(uid 15)' and gym_id='a0000000-0000-0000-0000-000000000001';" 2>&1 | head -1
echo "#### X: staff lowers capacity below places taken (api.md promises 409 capacity_below_taken)"
session t_x 2 "update public.classes set capacity=2 where id='$C' returning capacity;"
$PSQL -d t_x -c "select 'X after: capacity='||c.capacity||' taken='||count(b.*) from classes c join bookings b on b.class_id=c.id and b.status='confirmed' where c.id='$C' group by c.capacity"

echo "#### Y: same member books twice in parallel"
fresh t_y crux_y; mkclass_y t_y $C 5 72
session t_y 10 "select status from public.book_class('$C'); select pg_sleep(1.5);" & sleep 0.2
session t_y 10 "select status from public.book_class('$C');" & wait
$PSQL -d t_y -c "select 'Y rows for u10: '||count(*) from bookings where session_id='$C' and member_user_id='$(uid 10)'"
echo "#### Y: service role inserts a booked row directly (counter backstop?)"
for u in 11 12 13 14; do session t_y $u "select status from public.book_class('$C');" >/dev/null; done
$PSQL -d t_y -c "set role service_role; insert into public.bookings(tenant_id,session_id,member_user_id,status,booked_at,free_cancel_until,subscription_id) select tenant_id,'$C',member_user_id,'booked',now(),now()+interval '1 day',id from subscriptions where member_user_id='$(uid 15)' and tenant_id='a0000000-0000-0000-0000-000000000001' returning 'inserted';" 2>&1 | head -1
$PSQL -d t_y -c "select 'Y after: capacity='||s.capacity||' booked_count='||s.booked_count||' actual booked='||(select count(*) from bookings where session_id=s.id and status='booked') from class_sessions s where id='$C'"
echo "#### Y: staff lowers capacity below booked"
session t_y 2 "update public.class_sessions set capacity=2 where id='$C' returning capacity;" | head -1
echo "#### Y: late-cancel then rebook -> duplicate rows in week_schedule?"
fresh t_y crux_y; mkclass_y t_y $C 5 6
session t_y 10 "select status from public.book_class('$C');"
session t_y 10 "select status from public.cancel_booking((select id from public.bookings where session_id='$C' and member_user_id=auth.uid() and status='booked'));"
session t_y 10 "select status from public.book_class('$C');"
session t_y 10 "select 'rows for this class in week_schedule: '||count(*)||' statuses='||string_agg(my_status::text, ',') from public.week_schedule('b0000000-0000-0000-0000-000000000001', date_trunc('week', (now()+interval '6 hours') at time zone 'America/Denver')::date) where session_id='$C';"
echo "#### X: same scenario via class_view"
fresh t_x crux_x; mkclass_x t_x $C 5 6
session t_x 10 "select api.book_class('$C', false, gen_random_uuid())->>'status';"
session t_x 10 "select api.cancel_booking((select id from public.bookings where class_id='$C' and user_id=auth.uid() and status='confirmed'), true)->>'status';"
session t_x 10 "select api.book_class('$C', false, gen_random_uuid())->>'status';"
session t_x 10 "select 'rows: '||jsonb_array_length(r->'data')||' my_status='||(r->'data'->0->'my_booking'->>'status')||' can_cancel='||(r->'data'->0->'can'->'cancel')::text from (select api.location_schedule('b0000000-0000-0000-0000-000000000001', ((now()+interval '6 hours') at time zone 'America/Denver')::date) r) s;"
