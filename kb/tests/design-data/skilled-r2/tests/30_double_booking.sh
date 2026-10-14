# Double booking: a member cannot hold two live places in one class, by retry, by a second tap, or concurrently.
source "$(dirname "$0")/lib.sh"
q "select t.gym('dbl'); select t.person('dbl_coach'); select t.join('dbl','dbl_coach','staff','DC01');
   select t.class('dbl_class','dbl','dbl_coach',10, interval '3 days'); select t.class('dbl_race','dbl','dbl_coach',10, interval '4 days');
   select t.person('dm'); select t.join('dbl','dm','member','DM01'); select t.monthly('dbl','dm');" >/dev/null
bid=$(q "select gen_random_uuid()")
r1=$(as dm "select status from app.book_class(t.id('dbl_class'), '$bid')")
r2=$(as dm "select status from app.book_class(t.id('dbl_class'), '$bid')")
check "$(q "select t.ok('$r1' = 'booked' and '$r2' = 'booked' and (select count(*) from bookings where class_id=t.id('dbl_class')) = 1, 'retry with the same client id returns the same booking (one row)')")"
r3=$(as dm "select status from app.book_class(t.id('dbl_class'), gen_random_uuid())")
check "$(q "select t.ok(\$\$$r3\$\$ like '%bookings_one_live_per_member%', 'a second booking with a new id is refused by the partial unique index')")"
# concurrent: two devices, two ids, same instant
( as dm "select status from app.book_class(t.id('dbl_race'), gen_random_uuid())" >/tmp/d1.out ) & ( as dm "select status from app.book_class(t.id('dbl_race'), gen_random_uuid())" >/tmp/d2.out ) & wait
check "$(q "select t.ok((select count(*) from bookings where class_id=t.id('dbl_race') and user_id=t.id('dm')) = 1, 'two concurrent bookings from two devices: one row')")"
# cancel then book again is allowed (uniqueness covers live rows only)
as dm "select app.cancel_booking((select id from bookings where class_id=t.id('dbl_class') and user_id=t.id('dm')))" >/dev/null
r4=$(as dm "select status from app.book_class(t.id('dbl_class'), gen_random_uuid())")
check "$(q "select t.ok('$r4' = 'booked', 'after an on-time cancel the member can book the class again')")"
# the service role cannot bypass it either
r5=$(q "set role service_role; insert into public.bookings (gym_id, class_id, user_id, pass_id, status) select gym_id, class_id, user_id, pass_id, 'booked' from public.bookings where class_id=t.id('dbl_class') and status='booked' limit 1;" 2>&1 || true)
check "$(q "select t.ok(\$\$$r5\$\$ like '%bookings_one_live_per_member%', 'service role direct insert of a duplicate is refused')")"
finish
