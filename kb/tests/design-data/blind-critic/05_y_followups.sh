#!/bin/bash
# Follow-ups for Y: service-role backstop with Supabase's default grants, booking deadline inside 12h, late-cancel rebook.
source $(dirname $0)/lib.sh
C=e0000000-0000-0000-0000-000000000004
echo "#### Y: grant service_role as Supabase's default privileges would, then insert a 6th booked row directly"
fresh t_y crux_y; mkclass_y t_y $C 5 72
$PSQL -d t_y -c "grant all on all tables in schema public to service_role;"
for u in 10 11 12 13 14; do session t_y $u "select status from public.book_class('$C');" >/dev/null; done
$PSQL -d t_y -c "set role service_role; insert into public.bookings(tenant_id,session_id,member_user_id,status,booked_at,free_cancel_until,subscription_id) select tenant_id,'$C',member_user_id,'booked',now(),now()+interval '1 day',id from subscriptions where member_user_id='$(uid 15)' and tenant_id='a0000000-0000-0000-0000-000000000001' returning 'inserted';" 2>&1 | head -1
$PSQL -d t_y -c "select 'Y after: capacity='||s.capacity||' booked_count='||s.booked_count||' actual booked='||(select count(*) from bookings where session_id=s.id and status='booked') from class_sessions s where id='$C'"
echo "#### Free-cancel deadline for a fresh booking made 6h before start (brief: 12h rule)"
fresh t_y crux_y; mkclass_y t_y $C 5 6
session t_y 10 "select 'Y status='||status||' free_cancel_until - now = '||date_trunc('minute', free_cancel_until - now())||' (starts in 6h)' from public.book_class('$C');"
fresh t_x crux_x; mkclass_x t_x $C 5 6
session t_x 10 "select 'X status='||(r->>'status')||' can.cancel='||(r->'class'->'can'->'cancel')::text from (select api.book_class('$C', false, gen_random_uuid()) r) s;"
echo "#### Y: late cancel (deadline forced into the past) then rebook; count rows in week_schedule"
fresh t_y crux_y; mkclass_y t_y $C 5 6
session t_y 10 "select status from public.book_class('$C');" >/dev/null
$PSQL -d t_y -c "update bookings set free_cancel_until = now() - interval '1 minute' where session_id='$C'"
session t_y 10 "select 'cancel -> '||status from public.cancel_booking((select id from public.bookings where session_id='$C' and member_user_id=auth.uid() and status='booked'));"
session t_y 10 "select 'rebook -> '||status from public.book_class('$C');"
session t_y 10 "select 'rows for this class in week_schedule: '||count(*)||' statuses='||string_agg(my_status::text, ',') from public.week_schedule('b0000000-0000-0000-0000-000000000001', date_trunc('week', (now()+interval '6 hours') at time zone 'America/Denver')::date) where session_id='$C';"
echo "#### Pack: one credit left, two classes booked in parallel"
C2=e0000000-0000-0000-0000-000000000006
fresh t_y crux_y; mkclass_y t_y $C 5 72; mkclass_y t_y $C2 5 30
$PSQL -d t_y -c "update subscriptions set status='canceled' where member_user_id='$(uid 12)'; insert into plans(id,tenant_id,kind,name,price_amount,currency,class_credits,validity_days,stripe_price_id) values ('d0000000-0000-0000-0000-000000000009','a0000000-0000-0000-0000-000000000001','class_pack','10 pack',15000,'USD',10,365,'price_9'); insert into class_packs(tenant_id,member_user_id,plan_id,credits_total,credits_used,purchased_at,expires_at,stripe_payment_intent_id) values ('a0000000-0000-0000-0000-000000000001','$(uid 12)','d0000000-0000-0000-0000-000000000009',10,9,now(),now()+interval '1 year','pi_1');"
session t_y 12 "select status from public.book_class('$C'); select pg_sleep(1.5);" & sleep 0.2; session t_y 12 "select status from public.book_class('$C2');" 2>&1 | head -2 & wait
$PSQL -d t_y -c "select 'Y pack credits_used='||credits_used||'/'||credits_total||' bookings='||(select count(*) from bookings where member_user_id='$(uid 12)' and status='booked') from class_packs where member_user_id='$(uid 12)'"
fresh t_x crux_x; mkclass_x t_x $C 5 72; mkclass_x t_x $C2 5 30
$PSQL -d t_x -c "update passes set status='canceled' where user_id='$(uid 12)'; insert into passes(gym_id,user_id,kind,status,stripe_checkout_session_id,credits_total,price_minor,currency) values ('a0000000-0000-0000-0000-000000000001','$(uid 12)','pack','active','cs_1',1,15000,'usd');"
session t_x 12 "select api.book_class('$C', false, gen_random_uuid())->>'status'; select pg_sleep(1.5);" & sleep 0.2; session t_x 12 "select api.book_class('$C2', false, gen_random_uuid())->>'status';" 2>&1 | head -2 & wait
$PSQL -d t_x -c "select 'X pack credits_left='||private.pack_credits_left(id)||' bookings='||(select count(*) from bookings where user_id='$(uid 12)' and status='confirmed') from passes where user_id='$(uid 12)' and kind='pack'"
