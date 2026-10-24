# Time-bounded rights are checked against the time of the class, not now (expert move 9b).
# A member in payment grace (grace ends in 2 days) books a class tomorrow, but not one in 3 days.
source "$(dirname "$0")/lib.sh"
q "select t.gym('gr'); select t.person('gr_coach'); select t.join('gr','gr_coach','staff','GC01');
   select t.class('gr_soon','gr','gr_coach',8, interval '1 day');
   select t.class('gr_late','gr','gr_coach',8, interval '3 days');
   select t.person('grace'); select t.join('gr','grace','member','GR01'); select t.monthly('gr','grace','past_due', interval '2 days');" >/dev/null
r=$(q "select t.book_as('grace','gr_soon')"); check "$(q "select t.ok('$r' = 'booked', 'past due, class before grace ends: booked')")"
r=$(q "select t.book_as('grace','gr_late')"); check "$(q "select t.ok('$r' like 'error:23514:bookings_pass_covers_class%', 'past due, class after grace ends: refused ($r)')")"
r=$(as grace "select can_book || ',' || can_book_reason || ',' || (can_book_reason_at = (select grace_ends_at from passes where user_id = t.id('grace'))) from app.schedule(t.id('gr:loc'), (select starts_local::date from classes where id = t.id('gr_late'))) where class_id = t.id('gr_late')")
check "$(q "select t.ok('$r' = 'false,grace_ends_before_class,true', 'schedule flag for that class: can_book false, reason grace_ends_before_class, reason_at = grace end ($r)')")"
r=$("$PSQL" -X -q -tA -v VERBOSITY=verbose -c "set role service_role; insert into bookings (gym_id, class_id, user_id, pass_id, status) select t.id('gr'), t.id('gr_late'), t.id('grace'), (select id from passes where user_id=t.id('grace')), 'booked'" 2>&1 || true)
check "$(q "select t.ok(\$\$$r\$\$ like '%bookings_pass_covers_class%', 'service role cannot book it either (trigger)')")"

# waitlisted while active, then payment fails with grace ending before the class: promotion skips them
q "select t.class('gr_full','gr','gr_coach',1, interval '3 days 3 hours');
   select t.person('g1'); select t.join('gr','g1','member','GR02'); select t.monthly('gr','g1');
   select t.person('g2'); select t.join('gr','g2','member','GR03'); select t.monthly('gr','g2');
   select t.person('g3'); select t.join('gr','g3','member','GR04'); select t.monthly('gr','g3');
   select t.book_as('g1','gr_full'); select t.book_as('g2','gr_full','waitlist'); select pg_sleep(0.05); select t.book_as('g3','gr_full','waitlist');
   update passes set status='past_due', payment_failed_at = now() - interval '5 days', grace_ends_at = now() + interval '2 days' where user_id = t.id('g2');" >/dev/null
as g1 "select app.cancel_booking((select id from bookings where class_id=t.id('gr_full') and user_id=t.id('g1')))" >/dev/null
check "$(q "select t.ok((select status from bookings where class_id=t.id('gr_full') and user_id=t.id('g2')) = 'waitlist_lapsed' and (select status from bookings where class_id=t.id('gr_full') and user_id=t.id('g3')) = 'booked', 'promotion skips the member whose grace ends before the class and promotes the next')")"

# pack credits: last credit is spent once, even by two concurrent bookings; an on-time cancel returns it
q "select t.class('pk_a','gr','gr_coach',8, interval '2 days'); select t.class('pk_b','gr','gr_coach',8, interval '4 days'); select t.class('pk_c','gr','gr_coach',8, interval '5 days');
   select t.person('pk'); select t.join('gr','pk','member','PK01'); select t.pack('gr','pk',1);" >/dev/null
( q "select t.book_as('pk','pk_a')" >/tmp/p1.out ) & ( q "select t.book_as('pk','pk_b')" >/tmp/p2.out ) & wait
check "$(q "select t.ok((select count(*) from bookings where user_id=t.id('pk') and status='booked') = 1, 'one credit, two concurrent bookings: one place taken')")"
r=$(as pk "select credits_left from app.my_pass(t.id('gr'))"); check "$(q "select t.ok('$r' = '0', 'credits left reads 0')")"
r=$(as pk "select can_book_reason from app.schedule(t.id('gr:loc'), (select starts_local::date from classes where id = t.id('pk_c'))) where class_id = t.id('pk_c')")
check "$(q "select t.ok('$r' = 'no_credits_left', 'schedule says why: no_credits_left ($r)')")"
as pk "select app.cancel_booking((select id from bookings where user_id=t.id('pk') and status='booked'))" >/dev/null
r=$(as pk "select credits_left from app.my_pass(t.id('gr'))"); check "$(q "select t.ok('$r' = '1', 'an on-time cancel returns the credit')")"

# a booking made while active, for a class after the grace end, reads as not covered; when the sync gives up
# (status unpaid) the place is released free and the waitlist moves
q "select t.class('gr_risk','gr','gr_coach',1, interval '6 days 4 hours'); select t.person('rk'); select t.join('gr','rk','member','RK01'); select t.monthly('gr','rk');
   select t.person('rw'); select t.join('gr','rw','member','RW01'); select t.monthly('gr','rw');
   select t.book_as('rk','gr_risk');" >/dev/null
q "select t.book_as('rw','gr_risk','waitlist')" >/dev/null
q "update passes set status='past_due', payment_failed_at = now() - interval '5 days', grace_ends_at = now() + interval '2 days' where user_id = t.id('rk')" >/dev/null
r=$(as rk "select my_status || ',' || my_booking_covered from app.schedule(t.id('gr:loc'), (select starts_local::date from classes where id = t.id('gr_risk'))) where class_id = t.id('gr_risk')")
check "$(q "select t.ok('$r' = 'booked,false', 'a booking for a class after the grace end reads booked but not covered ($r)')")"
q "update passes set status='unpaid' where user_id = t.id('rk'); select private.release_uncovered_bookings((select id from passes where user_id = t.id('rk')))" >/dev/null
check "$(q "select t.ok((select status from bookings where class_id=t.id('gr_risk') and user_id=t.id('rk')) = 'cancelled' and (select status from bookings where class_id=t.id('gr_risk') and user_id=t.id('rw')) = 'booked', 'unpaid: the uncovered place is released free and the next in line is booked')")"
finish
