# Last place race: 20 members try to take the last place at the same instant (pgbench, 20 connections).
source "$(dirname "$0")/lib.sh"
q "select t.gym('race'); select t.person('race_coach'); select t.join('race','race_coach','staff','RC01');
   select t.class('race_class','race','race_coach',8, interval '3 days');
   select t.class('race_wait','race','race_coach',8, interval '4 days');
   select t.person('early'||i), t.join('race','early'||i,'member','E00'||i), t.monthly('race','early'||i),
          t.book_as('early'||i,'race_class'), t.book_as('early'||i,'race_wait') from generate_series(1,7) i;
   select t.person('racer'||i), t.join('race','racer'||i,'member','R'||lpad(i::text,3,'0')), t.monthly('race','racer'||i)
     from generate_series(0,19) i;" >/dev/null
check "$(q "select t.ok(t.count('race_class','booked') = 7, 'seed: 7 of 8 places taken before the race')")"

# A: all 20 ask for a place with intent book
echo "select t.book_as('racer' || :client_id, 'race_class');" > /tmp/race_book.sql
"$BIN/pgbench" -n -c 20 -j 20 -t 1 -f /tmp/race_book.sql >/dev/null 2>&1
check "$(q "select t.ok(t.count('race_class','booked') = 8, 'race (book): exactly 8 of 8 places taken after 20 concurrent bookings, got ' || t.count('race_class','booked'))")"
check "$(q "select t.ok((select count(*) from bookings where class_id = t.id('race_class')) = 8, 'race (book): the 19 losers left no rows (they got 409 class_full)')")"

# B: all 20 ask with intent waitlist: one gets the place, 19 queue with distinct ranks 1 to 19
echo "select t.book_as('racer' || :client_id, 'race_wait', 'waitlist');" > /tmp/race_wait.sql
"$BIN/pgbench" -n -c 20 -j 20 -t 1 -f /tmp/race_wait.sql >/dev/null 2>&1
check "$(q "select t.ok(t.count('race_wait','booked') = 8 and t.count('race_wait','waitlisted') = 19, 'race (waitlist): 8 booked and 19 waitlisted, got ' || t.count('race_wait','booked') || ' and ' || t.count('race_wait','waitlisted'))")"
check "$(q "select t.ok((select count(distinct (waitlisted_at, id)) from bookings where class_id = t.id('race_wait') and status='waitlisted') = 19, 'race (waitlist): 19 distinct queue keys, so ranks 1 to 19 are unambiguous')")"

# C: forced interleaving: session 1 takes the last place and holds its transaction; session 2 must wait, then lose
q "select t.class('race_hold','race','race_coach',8, interval '5 days'); select t.book_as('early'||i,'race_hold') from generate_series(1,7) i;" >/dev/null
( "$PSQL" -X -q -tA -c "begin; select t.book_as('racer0','race_hold'); select pg_sleep(2); commit;" >/tmp/hold1.out 2>&1 ) &
sleep 0.5
start=$(date +%s.%N)
second=$(q "select t.book_as('racer1','race_hold')")
waited=$(python3 -c "print(round($(date +%s.%N)-$start,1))")
wait
check "$(q "select t.ok('$second' like 'error:23514:bookings_within_capacity%' and $waited >= 1.0, 'interleaved: second booking waited ${waited}s for the class lock, then got class_full ($second)')")"
check "$(q "select t.ok(t.count('race_hold','booked') = 8, 'interleaved: 8 of 8 taken')")"
finish
