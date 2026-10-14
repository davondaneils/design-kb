#!/bin/bash
# Own tests for entry G. Needs g_seed.sql loaded into crux_g.
. "$(dirname "$0")/lib.sh"; DB=crux_g
s() { printf 'aaaaaaaa-5555-0000-0000-0000000000%02d' "$1"; }
echo "### T1 last place race (cap 2, 1 booked, two parallel bookers; first holds txn 2s)"
as 11 "select status from book_class('$(s 1)');" 
( $PSQL -d $DB -c "begin; set local role authenticated; set local request.jwt.claim.sub = '$(u 12)';
select 'u12', status from book_class('$(s 1)'); select pg_sleep(2); commit;" 2>&1 ) &
sleep 0.5
as 13 "select 'u13', status from book_class('$(s 1)');"
wait
su_sql "select 'counter', booked_count, waitlist_count, (select count(*) from bookings where session_id='$(s 1)' and status='booked') from class_sessions where id='$(s 1)';"

echo "### T1b burst: 20 parallel bookers for capacity 5"
for i in $(seq 21 40); do as $i "select status from book_class('$(s 6)');" > /dev/null & done; wait
su_sql "select 'booked='||count(*) filter (where status='booked')||' waitlisted='||count(*) filter (where status='waitlisted') from bookings where session_id='$(s 6)';"
su_sql "select 'counters', booked_count, waitlist_count, capacity from class_sessions where id='$(s 6)';"

echo "### T2 two simultaneous cancels vs waitlist (cap 2: 11,12 booked; 13,14,15 waiting)"
for i in 11 12 13 14 15; do as $i "select status from book_class('$(s 2)');"; done
B11=$(su_sql "select id from bookings where session_id='$(s 2)' and member_user_id='$(u 11)'")
B12=$(su_sql "select id from bookings where session_id='$(s 2)' and member_user_id='$(u 12)'")
( $PSQL -d $DB -c "begin; set local role authenticated; set local request.jwt.claim.sub = '$(u 11)';
select status from cancel_booking('$B11'); select pg_sleep(1.5); commit;" 2>&1 ) &
sleep 0.3
as 12 "select status from cancel_booking('$B12');"
wait
su_sql "select member_user_id, status from bookings where session_id='$(s 2)' order by waitlisted_at;"
su_sql "select 'counters', booked_count, waitlist_count from class_sessions where id='$(s 2)';"

echo "### T2b booked cancel racing a waitlisted member leaving (cap 1: 11 booked; 12,13 waiting)"
for i in 11 12 13; do as $i "select status from book_class('$(s 9)');" >/dev/null; done
B11=$(su_sql "select id from bookings where session_id='$(s 9)' and member_user_id='$(u 11)'")
B12=$(su_sql "select id from bookings where session_id='$(s 9)' and member_user_id='$(u 12)'")
( $PSQL -d $DB -c "begin; set local role authenticated; set local request.jwt.claim.sub = '$(u 12)';
select status from cancel_booking('$B12'); select pg_sleep(1.5); commit;" 2>&1 ) &
sleep 0.3
as 11 "select status from cancel_booking('$B11');"
wait
su_sql "select member_user_id, status from bookings where session_id='$(s 9)' order by waitlisted_at;"
su_sql "select 'counters', booked_count, waitlist_count from class_sessions where id='$(s 9)';"

echo "### T3 double booking: sequential and parallel same member"
as 18 "select status from book_class('$(s 4)');"
as 18 "select status from book_class('$(s 4)');"
as 19 "select status from book_class('$(s 4)');" & as 19 "select status from book_class('$(s 4)');" & wait
su_sql "select member_user_id, count(*) from bookings where session_id='$(s 4)' and member_user_id in ('$(u 18)','$(u 19)') and status in ('booked','waitlisted') group by 1;"
echo "-- direct insert bypassing function (as table owner):"
su_sql "insert into bookings(tenant_id,session_id,member_user_id,status,booked_at,free_cancel_until,subscription_id) select tenant_id,session_id,member_user_id,'booked',now(),now(),subscription_id from bookings where session_id='$(s 4)' and member_user_id='$(u 18)';"
echo "-- member direct insert through API role:"
as 18 "insert into bookings(tenant_id,session_id,member_user_id,status,waitlisted_at) values ('aaaaaaaa-0000-0000-0000-000000000000','$(s 5)','$(u 18)','waitlisted',now());"

echo "### T4 cross-gym isolation"
echo "-- member of B only (20) reading A:"
as 20 "select 'sessions', count(*) from class_sessions where tenant_id='aaaaaaaa-0000-0000-0000-000000000000'; select 'bookings', count(*) from bookings; select 'tenant_users', count(*) from tenant_users; select 'week_schedule A', count(*) from week_schedule('aaaaaaaa-1111-0000-0000-000000000000', (now()::date - extract(isodow from now())::int + 1));"
echo "-- member 20 books gym A class:"; as 20 "select status from book_class('$(s 4)');"
echo "-- staff of B (3) reading people:"
as 3 "select 'tenant_users visible', tenant_id, count(*) from tenant_users group by 1,2; select 'A bookings', count(*) from bookings where tenant_id='aaaaaaaa-0000-0000-0000-000000000000'; select 'A subs', count(*) from subscriptions where tenant_id='aaaaaaaa-0000-0000-0000-000000000000';"
echo "-- staff B sees m19's A row?"; as 3 "select tenant_id, display_name from tenant_users where user_id='$(u 19)';"
B18=$(su_sql "select id from bookings where session_id='$(s 4)' and member_user_id='$(u 18)' and status='booked'")
echo "-- staff B cancels gym A booking:"; as 3 "select status from cancel_booking('$B18');"
echo "-- staff B checks in gym A booking:"; as 3 "select status from check_in('$B18');"
echo "-- staff B updates gym A class capacity:"; as 3 "update class_sessions set capacity=1 where id='$(s 4)' returning id;"
echo "-- staff B cancels gym A class:"; as 3 "select status from cancel_session('$(s 4)','x');"
echo "-- staff B attendance report on A:"; as 3 "select count(*) from attendance_report('aaaaaaaa-0000-0000-0000-000000000000');"
echo "-- staff B inserts class in B pointing at A location:"; as 3 "insert into class_sessions(tenant_id,location_id,class_type_id,instructor_user_id,starts_at,ends_at,capacity,created_by) values ('bbbbbbbb-0000-0000-0000-000000000000','aaaaaaaa-1111-0000-0000-000000000000','bbbbbbbb-2222-0000-0000-000000000000','$(u 3)',now()+interval '9 days',now()+interval '9 days 1 hour',8,'$(u 3)');"
echo "-- anon reads:"; $PSQL -d $DB -c "set role anon; select count(*) from class_sessions;" 2>&1

echo "### T5 staff lowers capacity below booked (s8 cap 3, book 3, set 2)"
for i in 11 12 13; do as $i "select status from book_class('$(s 8)');" >/dev/null; done
as 2 "update class_sessions set capacity=2 where id='$(s 8)' returning capacity;"
su_sql "select 'after', capacity, booked_count from class_sessions where id='$(s 8)';"
echo "-- staff raises capacity with waitlist (book 14 to waitlist, then cap 4):"
as 14 "select status from book_class('$(s 8)');"; as 2 "update class_sessions set capacity=4 where id='$(s 8)' returning capacity, booked_count, waitlist_count;"
su_sql "select status from bookings where session_id='$(s 8)' and member_user_id='$(u 14)';"
echo "-- staff edits counters directly:"; as 2 "update class_sessions set booked_count=0 where id='$(s 8)';"

echo "### T6 grace: member 16 past_due, grace ends in 2 days"
echo "-- class in 1 day:"; as 16 "select status from book_class('$(s 4)');"
echo "-- class in 5 days (after grace):"; as 16 "select status from book_class('$(s 5)');"
echo "-- member 17 no pass:"; as 17 "select status from book_class('$(s 5)');"

echo "### T7 second open monthly pass same member same gym; same member other gym"
su_sql "insert into subscriptions(tenant_id,member_user_id,plan_id,stripe_subscription_id,status,current_period_end) values ('aaaaaaaa-0000-0000-0000-000000000000','$(u 11)','aaaaaaaa-3333-0000-0000-000000000000','sub_dup','active',now()+interval '1 month');"
su_sql "insert into subscriptions(tenant_id,member_user_id,plan_id,stripe_subscription_id,status,current_period_end) values ('bbbbbbbb-0000-0000-0000-000000000000','$(u 19)','bbbbbbbb-3333-0000-0000-000000000000','sub_b19','active',now()+interval '1 month') returning 'ok other gym';"

echo "### T8 12-hour rule (class s3 starts in 6h)"
echo "-- 11 books now (inside 12h) then cancels at once:"
as 11 "select status, free_cancel_until - now() as free_window from book_class('$(s 3)');"
B=$(su_sql "select id from bookings where session_id='$(s 3)' and member_user_id='$(u 11)'"); as 11 "select status from cancel_booking('$B');"
echo "-- 12 booked 3 days ago (seeded with the normal deadline), cancels now:"
su_sql "insert into bookings(tenant_id,session_id,member_user_id,status,booked_at,free_cancel_until,subscription_id) select 'aaaaaaaa-0000-0000-0000-000000000000','$(s 3)','$(u 12)','booked',now()-interval '3 days',starts_at-interval '12 hours',(select id from subscriptions where member_user_id='$(u 12)') from class_sessions where id='$(s 3)'; update class_sessions set booked_count=booked_count+1 where id='$(s 3)';"
B=$(su_sql "select id from bookings where session_id='$(s 3)' and member_user_id='$(u 12)'"); as 12 "select status from cancel_booking('$B');"
echo "-- retry same cancel:"; as 12 "select status from cancel_booking('$B');"

echo "### T9 cross-gym exclusion leak: dual instructor 5 teaches A s7; staff B schedules overlapping B class"
as 3 "insert into class_sessions(tenant_id,location_id,class_type_id,instructor_user_id,starts_at,ends_at,capacity,created_by) select 'bbbbbbbb-0000-0000-0000-000000000000','bbbbbbbb-1111-0000-0000-000000000000','bbbbbbbb-2222-0000-0000-000000000000','$(u 5)',starts_at,ends_at,8,'$(u 3)' from (select now()+interval '1 day 2 hours' starts_at, now()+interval '1 day 3 hours' ends_at) t returning 'created';"

echo "### T10 pack credits: one credit, two parallel bookings on different classes"
su_sql "insert into plans(id,tenant_id,kind,name,price_amount,currency,class_credits,validity_days,stripe_price_id) values ('aaaaaaaa-3333-0000-0000-000000000001','aaaaaaaa-0000-0000-0000-000000000000','class_pack','10 pack',9000,'GBP',10,180,'price_pack'); insert into class_packs(tenant_id,member_user_id,plan_id,credits_total,purchased_at,expires_at,stripe_payment_intent_id) values ('aaaaaaaa-0000-0000-0000-000000000000','$(u 17)','aaaaaaaa-3333-0000-0000-000000000001',1,now(),now()+interval '90 days','pi_17');"
as 17 "select status from book_class('$(s 4)');" & as 17 "select status from book_class('$(s 5)');" & wait
su_sql "select 'pack bookings', count(*) from bookings where member_user_id='$(u 17)' and status in ('booked','waitlisted'); select 'credits_used', credits_used from class_packs where member_user_id='$(u 17)';"
echo "-- 17 joins a full class waitlist with 0 credits left:"; as 17 "select status from book_class('$(s 1)');"

echo "### T11 week_schedule shape as member 11 (this week and next)"
as 11 "select to_char(starts_at at time zone location_timezone,'Dy HH24:MI') local, capacity, booked_count, waitlist_count, my_status, my_waitlist_position from week_schedule('aaaaaaaa-1111-0000-0000-000000000000', (now() at time zone 'Europe/London')::date - extract(isodow from now() at time zone 'Europe/London')::int + 1);"
