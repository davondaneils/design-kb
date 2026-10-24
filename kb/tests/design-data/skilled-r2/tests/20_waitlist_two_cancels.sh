# Two cancels against a waitlist: two booked members cancel at the same time; the first two waiting members are
# promoted, each into one place, in queue order; the third keeps rank 1.
source "$(dirname "$0")/lib.sh"
q "select t.gym('wl'); select t.person('wl_coach'); select t.join('wl','wl_coach','staff','WC01');
   select t.class('wl_class','wl','wl_coach',8, interval '3 days');
   select t.person('wb'||i), t.join('wl','wb'||i,'member','WB0'||i), t.monthly('wl','wb'||i), t.book_as('wb'||i,'wl_class')
     from generate_series(1,8) i;" >/dev/null
for i in 1 2 3; do q "select t.person('ww$i'), t.join('wl','ww$i','member','WW0$i'), t.monthly('wl','ww$i'), t.book_as('ww$i','wl_class','waitlist')" >/dev/null; sleep 0.05; done
check "$(q "select t.ok(t.count('wl_class','booked') = 8 and t.count('wl_class','waitlisted') = 3, 'seed: 8 of 8 booked, 3 waiting')")"

cancel() { "$PSQL" -X -q -tA -c "begin; select set_config('request.jwt.claim.sub', t.id('$1')::text, true); set local role authenticated;
  select status from app.cancel_booking((select id from bookings where class_id = t.id('wl_class') and user_id = t.id('$1') and status='booked'));
  select pg_sleep(1); commit;" ; }
cancel wb1 >/tmp/c1.out 2>&1 & cancel wb2 >/tmp/c2.out 2>&1 & wait
check "$(q "select t.ok(t.count('wl_class','booked') = 8, 'after two concurrent cancels: still exactly 8 booked, got ' || t.count('wl_class','booked'))")"
check "$(q "select t.ok((select array_agg(p.display_name order by p.display_name) from bookings b join profiles p on p.id=b.user_id where b.class_id=t.id('wl_class') and b.promoted_from_waitlist) = array['Ww1','Ww2'], 'promoted: the first two in the queue (Ww1, Ww2), each once')")"
check "$(q "select t.ok((select status from bookings where class_id=t.id('wl_class') and user_id=t.id('ww3')) = 'waitlisted', 'third in queue still waiting')")"
pos=$(as ww3 "select my_waitlist_position from app.schedule(t.id('wl:loc'), (select starts_local::date from classes where id = t.id('wl_class'))) where class_id = t.id('wl_class')")
check "$(q "select t.ok('$pos' = '1', 'third member now reads rank 1 (computed at read, never stored), got $pos')")"

# late cancel: inside the 12 hour window, a cancel without accept_late is refused; with it, the place still goes
# to the waitlist and the canceller is marked late_cancelled (a no-show for attendance and pack credits)
q "select t.class('wl_late','wl','wl_coach',1, interval '6 hours'); select t.book_as('wb3','wl_late'); select t.book_as('wb4','wl_late','waitlist');" >/dev/null
r=$(as wb3 "select status from app.cancel_booking((select id from bookings where class_id=t.id('wl_late') and user_id=t.id('wb3')))")
check "$(q "select t.ok(\$\$$r\$\$ like '%free_cancel_closed%', 'late cancel without accept_late is refused (409 free-cancel-closed)')")"
r=$(as wb3 "select status from app.cancel_booking((select id from bookings where class_id=t.id('wl_late') and user_id=t.id('wb3')), true)")
check "$(q "select t.ok('$r' = 'late_cancelled' and (select status from bookings where class_id=t.id('wl_late') and user_id=t.id('wb4')) = 'booked', 'late cancel with accept_late: late_cancelled, and the waiting member got the place')")"
r=$(as wb3 "select status from app.cancel_booking((select id from bookings where class_id=t.id('wl_late') and user_id=t.id('wb3')), true)")
check "$(q "select t.ok('$r' = 'late_cancelled', 'cancelling twice is idempotent')")"
finish
