# The schedule read uses its index at volume: 40 locations x 300 classes, then EXPLAIN the week query.
source "$(dirname "$0")/lib.sh"
q "select t.gym('vol'); select t.person('vol_coach'); select t.join('vol','vol_coach','staff','VC01');
   insert into locations (gym_id, name, time_zone) select t.id('vol'), 'Wall ' || i, 'America/New_York' from generate_series(1,40) i;
   insert into classes (gym_id, location_id, class_type_id, instructor_id, starts_local, ends_local, capacity)
   select t.id('vol'), l.id, t.id('vol:type'), t.id('vol_coach'), s, s + interval '50 minutes', 10
   from (select id, row_number() over (order by id) rn from locations where gym_id = t.id('vol') and name like 'Wall %') l,
        generate_series(0, 299) h,
        lateral (select (h * 40 + l.rn::int) k) kk,
        lateral (select timestamp '2026-01-05 06:00' + make_interval(days => k / 16, hours => k % 16)) x(s);
   analyze classes; analyze bookings;" >/dev/null
loc=$(q "select id from locations where gym_id = t.id('vol') and name = 'Wall 7'"); gym=$(uid vol)
plan=$(q "explain select c.id from classes c where c.location_id = '$loc' and c.gym_id = '$gym' and c.starts_local >= '2026-03-02' and c.starts_local < '2026-03-09'")
echo "$plan" | sed 's/^/  /'
check "$(q "select t.ok(\$\$$plan\$\$ like '%classes_location_week_idx%', 'week query on 12,000 classes uses classes_location_week_idx')")"
finish
