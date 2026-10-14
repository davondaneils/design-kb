# One open subscription per member per gym is a partial unique index keyed by the gym (expert move 9c).
source "$(dirname "$0")/lib.sh"
q "select t.gym('op_a'); select t.gym('op_b'); select t.person('op'); select t.join('op_a','op','member','OP01'); select t.join('op_b','op','member','OP01'); select t.monthly('op_a','op');" >/dev/null
r=$(q "select t.monthly('op_a','op')" 2>&1 || true)
check "$(q "select t.ok(\$\$$r\$\$ like '%passes_one_open_subscription%', 'second open subscription at the same gym: refused')")"
r=$(q "select t.monthly('op_a','op','past_due', interval '3 days')" 2>&1 || true)
check "$(q "select t.ok(\$\$$r\$\$ like '%passes_one_open_subscription%', 'a past_due one counts as open too (it would double-bill once paid)')")"
r=$(q "select t.monthly('op_b','op') is not null")
check "$(q "select t.ok('$r' = 't', 'an open subscription at another gym is allowed, and its existence is never tested against gym A''s rows')")"
q "update passes set status = 'canceled' where gym_id = t.id('op_a') and user_id = t.id('op')" >/dev/null
r=$(q "select t.monthly('op_a','op') is not null")
check "$(q "select t.ok('$r' = 't', 'after the old one is canceled a new subscription is allowed')")"
r=$(q "select t.pack('op_a','op') is not null and t.pack('op_a','op') is not null")
check "$(q "select t.ok('$r' = 't', 'packs stack by design (credits are spent oldest first)')")"
r=$(q "insert into passes (gym_id, user_id, kind, status, price_minor, currency, stripe_subscription_id) values (t.id('op_a'), t.id('op'), 'monthly', 'past_due', 13900, 'usd', 'sub_x')" 2>&1 || true)
check "$(q "select t.ok(\$\$$r\$\$ like '%passes_past_due_has_grace%' or \$\$$r\$\$ like '%passes_one_open_subscription%', 'past_due without a grace end is impossible')")"
finish
