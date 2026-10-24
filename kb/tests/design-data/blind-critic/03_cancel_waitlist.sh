#!/bin/bash
# Test: simultaneous cancels against a waitlist; double-tap cancel; cancel racing a fresh booking.
source $(dirname $0)/lib.sh
C=e0000000-0000-0000-0000-000000000003
xb() { session t_x $1 "select api.book_class('$C', true, gen_random_uuid())->>'status';" >/dev/null; }
xc() { session t_x $1 "select api.cancel_booking((select id from public.bookings where class_id='$C' and user_id=auth.uid() and status in ('confirmed','waitlisted')), false)->>'status'; $2"; }
yb() { session t_y $1 "select status from public.book_class('$C');" >/dev/null; }
yc() { session t_y $1 "select status from public.cancel_booking((select id from public.bookings where session_id='$C' and member_user_id=auth.uid() and status in ('booked','waitlisted') limit 1)); $2"; }
xstate() { $PSQL -d t_x -c "select '$1 X: '||string_agg(right(user_id::text,2)||'='||status, ' ' order by right(user_id::text,2)) from bookings where class_id='$C'"; }
ystate() { $PSQL -d t_y -c "select '$1 Y: '||string_agg(right(member_user_id::text,2)||'='||b.status::text, ' ' order by right(member_user_id::text,2))||' | booked_count='||max(s.booked_count)||' waitlist_count='||max(s.waitlist_count) from bookings b join class_sessions s on s.id=b.session_id where session_id='$C'"; }

echo "#### A: cap 2, booked u10 u11, waitlist u12 u13 u14; u10 and u11 cancel at once"
fresh t_x crux_x; mkclass_x t_x $C 2 72; for u in 10 11 12 13 14; do xb $u; done
xc 10 "select pg_sleep(1.5);" & sleep 0.2; xc 11 "" & wait; xstate A
fresh t_y crux_y; mkclass_y t_y $C 2 72; for u in 10 11 12 13 14; do yb $u; done
yc 10 "select pg_sleep(1.5);" & sleep 0.2; yc 11 "" & wait; ystate A

echo "#### B: cap 1, booked u10, waitlist u12 u13; u10 double-taps cancel"
fresh t_x crux_x; mkclass_x t_x $C 1 72; for u in 10 12 13; do xb $u; done
xc 10 "select pg_sleep(1.5);" & sleep 0.2; xc 10 "" & wait; xstate B
fresh t_y crux_y; mkclass_y t_y $C 1 72; for u in 10 12 13; do yb $u; done
yc 10 "select pg_sleep(1.5);" & sleep 0.2; yc 10 "" & wait; ystate B

echo "#### C: cap 1, booked u10, waitlist u12; u10 cancels while u15 books"
fresh t_x crux_x; mkclass_x t_x $C 1 72; for u in 10 12; do xb $u; done
xc 10 "select pg_sleep(1.5);" & sleep 0.2; session t_x 15 "select api.book_class('$C', false, gen_random_uuid())->>'status';" & wait; xstate C
fresh t_y crux_y; mkclass_y t_y $C 1 72; for u in 10 12; do yb $u; done
yc 10 "select pg_sleep(1.5);" & sleep 0.2; session t_y 15 "select status from public.book_class('$C');" & wait; ystate C

echo "#### D: cap 1, booked u10, waitlist u12 u13; staff raises capacity to 2 while u10 cancels"
fresh t_x crux_x; mkclass_x t_x $C 1 72; for u in 10 12 13; do xb $u; done
xc 10 "select pg_sleep(1.5);" & sleep 0.2; session t_x 2 "update public.classes set capacity=2 where id='$C';" & wait; xstate D
fresh t_y crux_y; mkclass_y t_y $C 1 72; for u in 10 12 13; do yb $u; done
yc 10 "select pg_sleep(1.5);" & sleep 0.2; session t_y 2 "update public.class_sessions set capacity=2 where id='$C';" & wait; ystate D
