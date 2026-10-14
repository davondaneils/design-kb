# Staff lowering capacity below the places taken (expert move 9a): refused on every path, including a booking in
# flight and the service role; raising capacity promotes the waitlist.
source "$(dirname "$0")/lib.sh"
q "select t.gym('cap'); select t.person('cap_staff'); select t.join('cap','cap_staff','staff','CS01');
   select t.class('cap_class','cap','cap_staff',8, interval '3 days');
   select t.person('cm'||i), t.join('cap','cm'||i,'member','CM0'||i), t.monthly('cap','cm'||i) from generate_series(1,9) i;
   select t.book_as('cm'||i,'cap_class') from generate_series(1,5) i;" >/dev/null
r=$(as cap_staff "update classes set capacity = 2 where id = t.id('cap_class')")
check "$(q "select t.ok(\$\$$r\$\$ like '%classes_capacity_not_below_taken%' and (select capacity from classes where id=t.id('cap_class')) = 8, 'staff set capacity 2 under 5 taken: refused, capacity stays 8')")"
r=$(as cap_staff "update classes set capacity = 5 where id = t.id('cap_class')")
check "$(q "select t.ok((select capacity from classes where id=t.id('cap_class')) = 5, 'capacity 5 with 5 taken: allowed (full, not over)')")"
r=$("$PSQL" -X -q -tA -v VERBOSITY=verbose -c "set role service_role; update classes set capacity = 4 where id = t.id('cap_class')" 2>&1 || true)
check "$(q "select t.ok(\$\$$r\$\$ like '%classes_capacity_not_below_taken%', 'service role cannot lower it either (trigger, not app code)')")"
r=$(q "update classes set capacity = 8 where id = t.id('cap_class')")

# a booking in flight holds the class lock; the capacity change waits for it and counts it
( "$PSQL" -X -q -tA -c "begin; select t.book_as('cm6','cap_class'); select t.book_as('cm7','cap_class'); select pg_sleep(2); commit;" >/dev/null 2>&1 ) &
sleep 0.5
r=$(as cap_staff "update classes set capacity = 6 where id = t.id('cap_class')")
wait
check "$(q "select t.ok(\$\$$r\$\$ like '%classes_capacity_not_below_taken%' and t.count('cap_class','booked') = 7 and (select capacity from classes where id=t.id('cap_class')) = 8, 'capacity 6 sent while 2 bookings were in flight: waited, counted 7, refused')")"

# service role inserting a booked row past capacity is refused by the booking trigger
q "update classes set capacity = 7 where id = t.id('cap_class')" >/dev/null
r=$("$PSQL" -X -q -tA -v VERBOSITY=verbose -c "set role service_role; insert into bookings (gym_id, class_id, user_id, pass_id, status) select t.id('cap'), t.id('cap_class'), t.id('cm8'), (select id from passes where user_id = t.id('cm8')), 'booked'" 2>&1 || true)
check "$(q "select t.ok(\$\$$r\$\$ like '%bookings_within_capacity%', 'service role insert past capacity: refused')")"

# raising capacity promotes the queue in order
q "select t.book_as('cm8','cap_class','waitlist')" >/dev/null; q "select t.book_as('cm9','cap_class','waitlist')" >/dev/null
as cap_staff "update classes set capacity = 8 where id = t.id('cap_class')" >/dev/null
check "$(q "select t.ok((select status from bookings where class_id=t.id('cap_class') and user_id=t.id('cm8')) = 'booked' and (select status from bookings where class_id=t.id('cap_class') and user_id=t.id('cm9')) = 'waitlisted', 'raising capacity by 1 promotes the first in line only')")"
# cancelling the class refunds every place and queue entry
as cap_staff "update classes set status = 'cancelled', cancelled_at = now() where id = t.id('cap_class')" >/dev/null
check "$(q "select t.ok(t.count('cap_class','booked') = 0 and t.count('cap_class','waitlisted') = 0, 'a cancelled class releases every booking and queue entry')")"
finish
