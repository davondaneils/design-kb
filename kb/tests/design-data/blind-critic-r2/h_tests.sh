#!/bin/bash
# Own tests for entry H. Needs h_seed.sql loaded into crux_h. Mirrors g_tests.sh.
. "$(dirname "$0")/lib.sh"; DB=crux_h
s() { printf 'aaaaaaaa-5555-0000-0000-0000000000%02d' "$1"; }
bk() { echo "select status from app.book_class('$(s $1)', gen_random_uuid(), '${2:-waitlist}');"; }
bid() { su_sql "select id from bookings where class_id='$(s $1)' and user_id='$(u $2)' order by created_at desc limit 1"; }
echo "### T1 last place race (cap 2, 1 booked, two parallel bookers; first holds txn 2s)"
as 11 "$(bk 1)"
( $PSQL -d $DB -c "begin; set local role authenticated; set local request.jwt.claim.sub = '$(u 12)';
select 'u12', status from app.book_class('$(s 1)', gen_random_uuid(), 'book'); select pg_sleep(2); commit;" 2>&1 ) &
sleep 0.5
as 13 "select 'u13', status from app.book_class('$(s 1)', gen_random_uuid(), 'book');"
wait
as 13 "select 'u13 retry with waitlist intent', status from app.book_class('$(s 1)', gen_random_uuid(), 'waitlist');"
su_sql "select 'taken', count(*) filter (where status='booked'), 'waiting', count(*) filter (where status='waitlisted') from bookings where class_id='$(s 1)';"

echo "### T1b burst: 20 parallel bookers for capacity 5"
for i in $(seq 21 40); do [ $i = 20 ] && continue; as $i "$(bk 6)" > /dev/null & done; wait
su_sql "select 'booked='||count(*) filter (where status='booked')||' waitlisted='||count(*) filter (where status='waitlisted') from bookings where class_id='$(s 6)';"

echo "### T2 two simultaneous cancels vs waitlist (cap 2: 11,12 booked; 13,14,15 waiting)"
for i in 11 12 13 14 15; do as $i "$(bk 2)"; done
B11=$(bid 2 11); B12=$(bid 2 12)
( $PSQL -d $DB -c "begin; set local role authenticated; set local request.jwt.claim.sub = '$(u 11)';
select status from app.cancel_booking('$B11'); select pg_sleep(1.5); commit;" 2>&1 ) &
sleep 0.3
as 12 "select status from app.cancel_booking('$B12');"
wait
su_sql "select user_id, status from bookings where class_id='$(s 2)' order by created_at;"

echo "### T2b booked cancel racing a waitlisted member leaving (cap 1: 11 booked; 12,13 waiting)"
for i in 11 12 13; do as $i "$(bk 9)" >/dev/null; done
B11=$(bid 9 11); B12=$(bid 9 12)
( $PSQL -d $DB -c "begin; set local role authenticated; set local request.jwt.claim.sub = '$(u 12)';
select status from app.cancel_booking('$B12'); select pg_sleep(1.5); commit;" 2>&1 ) &
sleep 0.3
as 11 "select status from app.cancel_booking('$B11');"
wait
su_sql "select user_id, status from bookings where class_id='$(s 9)' order by created_at;"

echo "### T3 double booking: sequential, parallel, idempotent retry with same id"
as 18 "$(bk 4)"; as 18 "$(bk 4)"
as 19 "$(bk 4)" & as 19 "$(bk 4)" & wait
su_sql "select user_id, count(*) from bookings where class_id='$(s 4)' and user_id in ('$(u 18)','$(u 19)') group by 1;"
RID=$(su_sql "select gen_random_uuid()")
as 21 "select 'first', status from app.book_class('$(s 4)','$RID','book');"; as 21 "select 'retry same id', status from app.book_class('$(s 4)','$RID','book');"
as 22 "select 'other user reuses id', status from app.book_class('$(s 4)','$RID','book');"
echo "-- parallel retries with the same id:"; RID2=$(su_sql "select gen_random_uuid()")
as 23 "select status from app.book_class('$(s 4)','$RID2','book');" & as 23 "select status from app.book_class('$(s 4)','$RID2','book');" & wait
echo "-- direct insert bypassing function (as table owner):"
su_sql "insert into bookings(gym_id,class_id,user_id,pass_id,status) select gym_id,class_id,user_id,pass_id,'booked' from bookings where class_id='$(s 4)' and user_id='$(u 18)';"
echo "-- member direct insert through API role:"
as 18 "insert into bookings(gym_id,class_id,user_id,pass_id,status) select gym_id,'$(s 5)',user_id,pass_id,'booked' from bookings where class_id='$(s 4)' and user_id='$(u 18)';"

echo "### T4 cross-gym isolation"
echo "-- member of B only (20) reading A:"
as 20 "select 'classes', count(*) from classes where gym_id='aaaaaaaa-0000-0000-0000-000000000000'; select 'bookings', count(*) from bookings; select 'gym_members', count(*) from gym_members; select 'profiles', count(*) from profiles;"
as 20 "select count(*) from app.schedule('aaaaaaaa-1111-0000-0000-000000000000', current_date);"
echo "-- member 20 books gym A class:"; as 20 "$(bk 4)"
echo "-- staff of B (3) reading people:"
as 3 "select 'gym_members visible', gym_id, count(*) from gym_members group by 1,2; select 'A bookings', count(*) from bookings where gym_id='aaaaaaaa-0000-0000-0000-000000000000'; select 'A passes', count(*) from passes where gym_id='aaaaaaaa-0000-0000-0000-000000000000'; select 'profiles visible', count(*) from profiles;"
echo "-- staff B sees m19's A row?"; as 3 "select gym_id, member_code from gym_members where user_id='$(u 19)';"
echo "-- staff B sees profile of A-only member 11?"; as 3 "select count(*) from profiles where id='$(u 11)';"
B18=$(bid 4 18)
echo "-- staff B cancels gym A booking:"; as 3 "select status from app.cancel_booking('$B18');"
echo "-- staff B checks in gym A booking:"; as 3 "select status from app.check_in('$B18');"
echo "-- staff B updates gym A class capacity:"; as 3 "update classes set capacity=1 where id='$(s 4)' returning id;"
echo "-- staff B cancels gym A class:"; as 3 "update classes set status='cancelled', cancelled_at=now() where id='$(s 4)' returning id;"
echo "-- staff B attendance on A:"; as 3 "select count(*) from app.attendance('aaaaaaaa-0000-0000-0000-000000000000', now()-interval '29 days', now());"
echo "-- staff B inserts class in B pointing at A location:"; as 3 "insert into classes(gym_id,location_id,class_type_id,instructor_id,starts_local,ends_local,capacity,created_by) values ('bbbbbbbb-0000-0000-0000-000000000000','aaaaaaaa-1111-0000-0000-000000000000','bbbbbbbb-2222-0000-0000-000000000000','$(u 3)',(now()+interval '9 days')::timestamp,(now()+interval '9 days 1 hour')::timestamp,8,'$(u 3)');"
echo "-- staff B (not owner) adds member 11 to gym B to see their profile:"; as 3 "insert into gym_members(gym_id,user_id,member_code) values ('bbbbbbbb-0000-0000-0000-000000000000','$(u 11)','B011');"
echo "-- owner B adds member 11 (A only) to gym B, then reads profile:"; as 4 "insert into gym_members(gym_id,user_id,member_code) values ('bbbbbbbb-0000-0000-0000-000000000000','$(u 11)','B011'); select 'profile now visible', display_name from profiles where id='$(u 11)';"
echo "-- anon reads:"; $PSQL -d $DB -c "set role anon; select count(*) from classes;" 2>&1

echo "### T5 staff lowers capacity below booked (s8 cap 3, book 3, set 2)"
for i in 11 12 13; do as $i "$(bk 8)" >/dev/null; done
as 2 "update classes set capacity=2 where id='$(s 8)' returning capacity;"
su_sql "select 'after', capacity from classes where id='$(s 8)';"
echo "-- staff raises capacity with waitlist (14 waits, then cap 4):"
as 14 "$(bk 8)"; as 2 "update classes set capacity=4 where id='$(s 8)' returning capacity;"
su_sql "select status from bookings where class_id='$(s 8)' and user_id='$(u 14)';"
echo "-- staff edits derived starts_at directly:"; as 2 "update classes set starts_at=now() where id='$(s 8)';"

echo "### T6 grace: member 16 past_due, grace ends in 2 days"
echo "-- class in 1 day:"; as 16 "$(bk 4 book)"
echo "-- class in 5 days (after grace):"; as 16 "$(bk 5 book)"
echo "-- member 17 no pass:"; as 17 "$(bk 5 book)"
echo "-- schedule flags for 16 (class 4 and 5):"; as 16 "select class_id, can_book, can_book_reason, can_book_reason_at is not null from app.schedule('aaaaaaaa-1111-0000-0000-000000000000', current_date) where class_id in ('$(s 4)','$(s 5)');"

echo "### T7 second open monthly pass same member same gym; same member other gym"
su_sql "insert into passes(gym_id,user_id,kind,status,price_minor,currency,stripe_subscription_id) values ('aaaaaaaa-0000-0000-0000-000000000000','$(u 11)','monthly','active',5500,'gbp','sub_dup');"
su_sql "insert into passes(gym_id,user_id,kind,status,price_minor,currency,stripe_subscription_id) values ('bbbbbbbb-0000-0000-0000-000000000000','$(u 19)','monthly','active',5500,'gbp','sub_b19') returning 'ok other gym';"

echo "### T8 12-hour rule (class s3 starts in 6h)"
echo "-- 11 books now (inside 12h) then cancels without accept_late:"
as 11 "$(bk 3 book)"; B=$(bid 3 11); as 11 "select status from app.cancel_booking('$B');"
echo "-- with accept_late:"; as 11 "select status from app.cancel_booking('$B', true);"
echo "-- retry:"; as 11 "select status from app.cancel_booking('$B', true);"
echo "-- class 5 days out, free cancel:"; as 12 "$(bk 5 book)"; B=$(bid 5 12); as 12 "select status from app.cancel_booking('$B');"

echo "### T9 cross-gym exclusion: dual instructor 5 teaches A s7; staff B schedules overlapping B class"
ST=$(su_sql "select starts_local from classes where id='$(s 7)'"); EN=$(su_sql "select ends_local from classes where id='$(s 7)'")
as 3 "insert into classes(gym_id,location_id,class_type_id,instructor_id,starts_local,ends_local,capacity,created_by) values ('bbbbbbbb-0000-0000-0000-000000000000','bbbbbbbb-1111-0000-0000-000000000000','bbbbbbbb-2222-0000-0000-000000000000','$(u 5)','$ST','$EN',8,'$(u 3)') returning 'created in B';" 2>&1 | head -3
echo "-- same gym overlap still caught:"; as 1 "insert into classes(gym_id,location_id,class_type_id,instructor_id,starts_local,ends_local,capacity,created_by) select gym_id,location_id,class_type_id,instructor_id,starts_local,ends_local,8,'$(u 1)' from classes where id='$(s 7)';" 2>&1 | head -2

echo "### T10 pack credits: one credit, two parallel bookings on different classes"
su_sql "insert into passes(gym_id,user_id,kind,status,price_minor,currency,credits_total,stripe_payment_intent_id) values ('aaaaaaaa-0000-0000-0000-000000000000','$(u 17)','pack','active',9000,'gbp',1,'pi_17');"
as 17 "$(bk 4 book)" & as 17 "$(bk 5 book)" & wait
su_sql "select 'pack bookings', count(*) from bookings where user_id='$(u 17)' and status in ('booked','waitlisted');"

echo "### T11 DST: skipped wall time"
as 1 "insert into classes(gym_id,location_id,class_type_id,instructor_id,starts_local,ends_local,capacity,created_by) values ('aaaaaaaa-0000-0000-0000-000000000000','aaaaaaaa-1111-0000-0000-000000000000','aaaaaaaa-2222-0000-0000-000000000000','$(u 1)','2027-03-28 01:30','2027-03-28 03:00',8,'$(u 1)');" 2>&1 | head -1

echo "### T12 schedule shape as member 11"
as 11 "select to_char(starts_local,'Dy HH24:MI'), capacity, taken, places_left, waitlist_count, my_status, my_waitlist_position, can_book, can_book_reason from app.schedule('aaaaaaaa-1111-0000-0000-000000000000', (now() at time zone 'Europe/London')::date - extract(isodow from now() at time zone 'Europe/London')::int + 1);"
