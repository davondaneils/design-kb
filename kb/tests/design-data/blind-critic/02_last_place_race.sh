#!/bin/bash
# Test: two members race for the last place; then a burst of 10 members on a 3-place class.
source $(dirname $0)/lib.sh
C=e0000000-0000-0000-0000-000000000001; C2=e0000000-0000-0000-0000-000000000002
echo "######## X"
fresh t_x crux_x; mkclass_x t_x $C 1 72; mkclass_x t_x $C2 3 96
# A holds its transaction open 2s after booking; B arrives 0.3s later.
session t_x 10 "select api.book_class('$C', false, gen_random_uuid())->>'status'; select pg_sleep(2);" &
sleep 0.3; session t_x 11 "select api.book_class('$C', false, gen_random_uuid())->>'status';" & wait
$PSQL -d t_x -c "select 'X last place: taken='||count(*) filter (where status='confirmed')||' waitlisted='||count(*) filter (where status='waitlisted') from bookings where class_id='$C'"
for u in 10 11 12 13 14 15 16 17 18 19; do session t_x $u "select api.book_class('$C2', true, gen_random_uuid())->>'status';" & done; wait
$PSQL -d t_x -c "select 'X burst cap 3: confirmed='||count(*) filter (where status='confirmed')||' waitlisted='||count(*) filter (where status='waitlisted') from bookings where class_id='$C2'"
$PSQL -d t_x -c "select 'X ranks: '||string_agg((private.class_view('$C2', user_id)->'my_booking'->>'waitlist_rank'), ',' order by waitlisted_at) from bookings where class_id='$C2' and status='waitlisted'"
echo "######## Y"
fresh t_y crux_y; mkclass_y t_y $C 1 72; mkclass_y t_y $C2 3 96
session t_y 10 "select status from public.book_class('$C'); select pg_sleep(2);" &
sleep 0.3; session t_y 11 "select status from public.book_class('$C');" & wait
$PSQL -d t_y -c "select 'Y last place: booked='||count(*) filter (where status='booked')||' waitlisted='||count(*) filter (where status='waitlisted') from bookings where session_id='$C'"
for u in 10 11 12 13 14 15 16 17 18 19; do session t_y $u "select status from public.book_class('$C2');" & done; wait
$PSQL -d t_y -c "select 'Y burst cap 3: booked='||count(*) filter (where b.status='booked')||' waitlisted='||count(*) filter (where b.status='waitlisted')||' | counters booked_count='||max(s.booked_count)||' waitlist_count='||max(s.waitlist_count) from bookings b join class_sessions s on s.id=b.session_id where session_id='$C2'"
