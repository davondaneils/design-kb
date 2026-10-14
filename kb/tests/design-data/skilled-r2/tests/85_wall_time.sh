# Wall time is the truth for a class; a local time the zone skips is refused, and instants follow the zone.
source "$(dirname "$0")/lib.sh"
q "select t.gym('wt'); select t.person('wt_coach'); select t.join('wt','wt_coach','staff','WT01');" >/dev/null
r=$(q "insert into classes (gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity) values (t.id('wt'), t.id('wt:loc'), t.id('wt:type'), t.id('wt_coach'), '2027-03-14 02:30', '2027-03-14 03:30', 8)" 2>&1 || true)
check "$(q "select t.ok(\$\$$r\$\$ like '%classes_wall_time_exists%', 'a class at 2:30 am on 2027-03-14 (skipped in New York) is refused')")"
r=$(q "insert into classes (gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity) values (t.id('wt'), t.id('wt:loc'), t.id('wt:type'), t.id('wt_coach'), '2027-03-14 18:00', '2027-03-14 19:30', 8) returning to_char(starts_at at time zone 'UTC', 'HH24:MI')")
check "$(q "select t.ok('$r' = '22:00', '6 pm EDT on 2027-03-14 derives 22:00 UTC ($r)')")"
r=$(q "update locations set time_zone = 'America/Chicago' where id = t.id('wt:loc'); select to_char(starts_at at time zone 'UTC', 'HH24:MI') from classes where location_id = t.id('wt:loc')")
check "$(q "select t.ok('$r' = '23:00', 'after the zone changes, re-deriving keeps 6 pm on the wall (23:00 UTC in Chicago) ($r)')")"
r=$(q "update locations set time_zone = 'Mars/Olympus' where id = t.id('wt:loc')" 2>&1 || true)
check "$(q "select t.ok(\$\$$r\$\$ like '%locations_time_zone_valid%', 'an invalid IANA zone is refused')")"
finish
