# Cross-gym isolation: two gyms, a member of both, staff of each. Staff of one gym never see or touch the other's
# members, bookings, passes or classes, through tables or through the RPC functions.
source "$(dirname "$0")/lib.sh"
q "select t.gym('iso_a'); select t.gym('iso_b');
   select t.person('sa'); select t.join('iso_a','sa','staff','SA01');
   select t.person('sb'); select t.join('iso_b','sb','staff','SB01');
   select t.person('both'); select t.join('iso_a','both','member','BO01'); select t.join('iso_b','both','member','BO02');
   select t.monthly('iso_a','both'); select t.monthly('iso_b','both');
   select t.person('onlyb'); select t.join('iso_b','onlyb','member','OB01'); select t.monthly('iso_b','onlyb');
   select t.person('onlya'); select t.join('iso_a','onlya','member','OA01'); select t.monthly('iso_a','onlya');
   select t.class('iso_a_class','iso_a','sa',10, interval '3 days'); select t.class('iso_b_class','iso_b','sb',10, interval '3 days');
   select t.book_as('both','iso_a_class'); select t.book_as('both','iso_b_class'); select t.book_as('onlyb','iso_b_class'); select t.book_as('onlya','iso_a_class');" >/dev/null

n() { as "$1" "select count(*) from $2"; }
check "$(q "select t.ok($(n sa "gym_members where gym_id = t.id('iso_b')") = 0, 'staff A reads 0 of gym B''s member rows')")"
check "$(q "select t.ok($(n sa "bookings where gym_id = t.id('iso_b')") = 0, 'staff A reads 0 of gym B''s bookings (the shared member''s gym B booking included)')")"
check "$(q "select t.ok($(n sa "passes where gym_id = t.id('iso_b')") = 0, 'staff A reads 0 of gym B''s passes')")"
check "$(q "select t.ok($(n sa "profiles where id = t.id('onlyb')") = 0, 'staff A cannot read the profile of a person who belongs only to gym B')")"
check "$(q "select t.ok($(n sa "classes where gym_id = t.id('iso_b')") = 0, 'staff A reads 0 of gym B''s classes')")"
check "$(q "select t.ok($(n sa "bookings where gym_id = t.id('iso_a')") = 2, 'staff A does read its own gym''s 2 bookings (the deny is not an empty table)')")"
check "$(q "select t.ok($(n onlya "bookings") = 1, 'a member reads only their own booking, not other members''')")"
check "$(q "select t.ok($(n onlyb "classes where gym_id = t.id('iso_a')") = 0, 'a gym B member reads 0 of gym A''s classes')")"

bb=$(q "select id from bookings where class_id = t.id('iso_b_class') and user_id = t.id('onlyb')")
r=$(as sa "select app.check_in('$bb')"); check "$(q "select t.ok(\$\$$r\$\$ like '%booking_not_found%', 'staff A checking in a gym B booking gets not found (404, no probe)')")"
r=$(as sa "select app.cancel_booking('$bb')"); check "$(q "select t.ok(\$\$$r\$\$ like '%booking_not_found%', 'staff A cancelling a gym B booking gets not found')")"
r=$(as sa "select count(*) from app.schedule(t.id('iso_b:loc'), current_date)"); check "$(q "select t.ok(\$\$$r\$\$ like '%location_not_found%', 'staff A reading gym B''s schedule gets not found')")"
r=$(as sa "select app.attendance(t.id('iso_b'), now() - interval '7 days', now())"); check "$(q "select t.ok(\$\$$r\$\$ like '%gym_not_found%', 'attendance of another gym: not found')")"
r=$(as sa "insert into classes (gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity) values (t.id('iso_b'), t.id('iso_b:loc'), t.id('iso_b:type'), t.id('sb'), '2030-01-01 10:00', '2030-01-01 11:00', 8)")
check "$(q "select t.ok(\$\$$r\$\$ like '%row-level security%', 'staff A inserting a class into gym B is refused by RLS')")"
as sa "update classes set capacity = 99 where id = t.id('iso_b_class')" >/dev/null
check "$(q "select t.ok((select capacity from classes where id = t.id('iso_b_class')) = 10, 'staff A updating gym B''s class changes nothing (read back as owner)')")"
r=$(as sa "insert into gym_members (gym_id, user_id, role, member_code) values (t.id('iso_b'), t.id('sa'), 'owner', 'HACK')")
check "$(q "select t.ok(\$\$$r\$\$ like '%row-level security%' or \$\$$r\$\$ like '%permission denied%', 'staff A cannot add themselves to gym B')")"
r=$(as sa "update gym_members set role = 'owner' where gym_id = t.id('iso_a') and user_id = t.id('sa')")
check "$(q "select t.ok((select role from gym_members where gym_id = t.id('iso_a') and user_id = t.id('sa')) = 'staff', 'staff cannot promote themselves to owner (owners only)')")"
r=$(as onlya "update bookings set status = 'attended' where user_id = t.id('onlya')")
check "$(q "select t.ok(\$\$$r\$\$ like '%permission denied%', 'a member cannot write a booking row directly (no grant; writes go through app functions)')")"
r=$(as onlya "update passes set status = 'active'")
check "$(q "select t.ok(\$\$$r\$\$ like '%permission denied%', 'a member cannot write their pass (the Stripe sync owns it)')")"
r=$("$PSQL" -X -q -tA -v VERBOSITY=verbose -c "set role anon; select count(*) from classes" 2>&1 || true)
check "$(q "select t.ok(\$\$$r\$\$ like '%permission denied%', 'anon reads nothing (grants revoked)')")"
r=$(as both "select status from app.book_class(t.id('iso_b_class'), gen_random_uuid())")
check "$(q "select t.ok(\$\$$r\$\$ like '%bookings_one_live_per_member%', 'the shared member acts in gym B with their gym B pass (already booked there)')")"
finish
