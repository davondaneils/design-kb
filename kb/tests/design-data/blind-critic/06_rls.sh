#!/bin/bash
# Test: cross-gym isolation through RLS and the API functions.
# Gym 1 (Basalt): owner u01, staff u02, members u10..u19. Gym 2 (Granite): staff u03, owner u04, members u19 (both gyms) and u20.
source $(dirname $0)/lib.sh
C1=e0000000-0000-0000-0000-000000000011; C2=e0000000-0000-0000-0000-000000000012
G1=a0000000-0000-0000-0000-000000000001; L1=b0000000-0000-0000-0000-000000000001
echo "################ X"
fresh t_x crux_x; mkclass_x t_x $C1 5 72
$PSQL -d t_x -c "insert into public.classes(id,gym_id,location_id,class_type_id,instructor_id,starts_local,ends_local,capacity,created_by) values ('$C2','a0000000-0000-0000-0000-000000000002','b0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000002','$(uid 3)', (now()+interval '3 days') at time zone 'Europe/London', (now()+interval '3 days 1 hour') at time zone 'Europe/London', 5, '$(uid 3)')"
for u in 10 19; do session t_x $u "select api.book_class('$C1', false, gen_random_uuid())->>'status';" >/dev/null; done
for u in 19 20; do session t_x $u "select api.book_class('$C2', false, gen_random_uuid())->>'status';" >/dev/null; done
B1=$($PSQL -d t_x -c "select id from bookings where class_id='$C1' and user_id='$(uid 10)'")
q='select (select count(*) from public.classes where gym_id='"'$G1'"')||'"'"' classes, '"'"'||(select count(*) from public.bookings where gym_id='"'$G1'"')||'"'"' bookings, '"'"'||(select count(*) from public.gym_memberships where gym_id='"'$G1'"')||'"'"' memberships, '"'"'||(select count(*) from public.passes where gym_id='"'$G1'"')||'"'"' passes, '"'"'||(select count(*) from public.profiles)||'"'"' profiles visible, '"'"'||(select count(*) from public.locations where gym_id='"'$G1'"')||'"'"' locations, '"'"'||(select count(*) from public.audit_events)||'"'"' audit;'
echo "-- member of gym2 only (u20) reading gym1:"; session t_x 20 "$q"
echo "-- staff of gym2 (u03) reading gym1:"; session t_x 3 "$q"
echo "-- staff of gym1 (u02) reading gym1 (control):"; session t_x 2 "$q"
echo "-- member u10 of gym1 reading gym1 (sees only own bookings):"; session t_x 10 "$q"
echo "-- staff of gym2 sees u19 (member of both): memberships and bookings rows"; session t_x 3 "select count(*)||' memberships of u19, gyms='||string_agg(gym_id::text,',') from public.gym_memberships where user_id='$(uid 19)'; select count(*)||' bookings of u19 visible (should be gym2 only: 1)' from public.bookings where user_id='$(uid 19)';"
echo "-- staff of gym2 check-in on a gym1 booking:"; session t_x 3 "select api.check_in('$B1');" | head -1
echo "-- staff of gym2 cancels a gym1 booking:"; session t_x 3 "select api.cancel_booking('$B1', true);" | head -1
echo "-- staff of gym2 reads gym1 schedule:"; session t_x 3 "select api.location_schedule('$L1', current_date);" | head -1
echo "-- staff of gym2 attendance for gym1:"; session t_x 4 "select api.gym_attendance('$G1');" | head -1
echo "-- member u20 books gym1 class:"; session t_x 20 "select api.book_class('$C1', false, gen_random_uuid());" | head -1
echo "-- member u10 checks themself in:"; session t_x 10 "select api.check_in('$B1');" | head -1
echo "-- member u10 updates own booking directly:"; session t_x 10 "update public.bookings set status='attended', checked_in_at=now() where id='$B1';" | head -1
echo "-- member u10 makes self staff:"; session t_x 10 "update public.gym_memberships set role='owner' where user_id=auth.uid() returning role;" | head -1
echo "-- staff u02 reads idempotency_keys / stripe_events:"; session t_x 2 "select count(*) from public.idempotency_keys;" | head -1
echo "-- anon reads classes:"; $PSQL -d t_x -c "begin; set local role anon; select count(*) from public.classes; commit;" 2>&1 | head -1
echo "-- anon calls schedule:"; $PSQL -d t_x -c "begin; set local role anon; select api.location_schedule('$L1', current_date); commit;" 2>&1 | head -1
echo "-- gym2 staff updates a gym1 class:"; session t_x 3 "update public.classes set capacity=50 where id='$C1' returning 1;" | head -1
echo "-- gym2 staff reschedules own instructor to overlap... (instructor exclusion leaks across gyms?) skip"

echo "################ Y"
fresh t_y crux_y; mkclass_y t_y $C1 5 72
$PSQL -d t_y -c "insert into public.class_sessions(id,tenant_id,location_id,class_type_id,instructor_user_id,starts_at,ends_at,capacity,created_by) values ('$C2','a0000000-0000-0000-0000-000000000002','b0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000002','$(uid 3)', now()+interval '3 days', now()+interval '3 days 1 hour', 5, '$(uid 3)')"
for u in 10 19; do session t_y $u "select status from public.book_class('$C1');" >/dev/null; done
for u in 19 20; do session t_y $u "select status from public.book_class('$C2');" >/dev/null; done
B1=$($PSQL -d t_y -c "select id from bookings where session_id='$C1' and member_user_id='$(uid 10)'")
q='select (select count(*) from public.class_sessions where tenant_id='"'$G1'"')||'"'"' classes, '"'"'||(select count(*) from public.bookings where tenant_id='"'$G1'"')||'"'"' bookings, '"'"'||(select count(*) from public.tenant_users where tenant_id='"'$G1'"')||'"'"' memberships, '"'"'||(select count(*) from public.subscriptions where tenant_id='"'$G1'"')||'"'"' passes, '"'"'||(select count(*) from public.locations where tenant_id='"'$G1'"')||'"'"' locations;'
echo "-- member of gym2 only (u20) reading gym1:"; session t_y 20 "$q"
echo "-- staff of gym2 (u03) reading gym1:"; session t_y 3 "$q"
echo "-- staff of gym1 (u02) reading gym1 (control):"; session t_y 2 "$q"
echo "-- member u10 of gym1 reading gym1:"; session t_y 10 "$q"
echo "-- staff of gym2 sees u19:"; session t_y 3 "select count(*)||' memberships of u19, gyms='||string_agg(tenant_id::text,',') from public.tenant_users where user_id='$(uid 19)'; select count(*)||' bookings of u19 visible (should be 1)' from public.bookings where member_user_id='$(uid 19)';"
echo "-- member u10 sees instructor/other members' emails?"; session t_y 10 "select count(*)||' tenant_users rows visible to a plain member' from public.tenant_users;"
echo "-- staff of gym2 check-in on gym1 booking:"; session t_y 3 "select public.check_in('$B1');" | head -1
echo "-- staff of gym2 cancels gym1 booking:"; session t_y 3 "select public.cancel_booking('$B1');" | head -1
echo "-- staff of gym2 reads gym1 schedule:"; session t_y 3 "select count(*)||' rows' from public.week_schedule('$L1', current_date);" | head -1
echo "-- owner of gym2 attendance for gym1:"; session t_y 4 "select count(*)||' rows' from public.attendance_report('$G1');" | head -1
echo "-- member u20 books gym1 class:"; session t_y 20 "select public.book_class('$C1');" | head -1
echo "-- member u10 checks themself in:"; session t_y 10 "select public.check_in('$B1');" | head -1
echo "-- member u10 updates own booking directly:"; session t_y 10 "update public.bookings set status='attended' where id='$B1';" | head -1
echo "-- member u10 makes self staff:"; session t_y 10 "update public.tenant_users set role='owner' where user_id=auth.uid() returning role;" | head -1
echo "-- staff u02 reads idempotency_keys:"; session t_y 2 "select count(*) from public.idempotency_keys;" | head -1
echo "-- anon reads classes:"; $PSQL -d t_y -c "begin; set local role anon; select count(*) from public.class_sessions; commit;" 2>&1 | head -1
echo "-- anon calls week_schedule:"; $PSQL -d t_y -c "begin; set local role anon; select * from public.week_schedule('$L1', current_date); commit;" 2>&1 | head -1
echo "-- gym2 staff updates gym1 class:"; session t_y 3 "update public.class_sessions set capacity=50 where id='$C1' returning 1;" | head -1
echo "-- staff u02 edits a class's booked_count directly:"; session t_y 2 "update public.class_sessions set booked_count=0 where id='$C1' returning 1;" | head -1
echo "-- staff u02 in gym1 creates a class in gym1 with instructor from gym2 (u03):"; session t_y 2 "insert into public.class_sessions(tenant_id,location_id,class_type_id,instructor_user_id,starts_at,ends_at,capacity,created_by) values ('$G1','$L1','c0000000-0000-0000-0000-000000000001','$(uid 3)', now()+interval '9 days', now()+interval '9 days 1 hour', 5, '$(uid 2)');" | head -1
