# Every uniqueness or exclusion rule that spans people is keyed by the gym, so a conflict never tells one gym
# about another (expert move 9c). Behaviour tests, then a catalog audit of every unique index and exclusion.
source "$(dirname "$0")/lib.sh"
q "select t.gym('uq_a'); select t.gym('uq_b'); select t.person('inst');
   select t.join('uq_a','inst','staff','IN01'); select t.join('uq_b','inst','staff','IN01');
   select t.class('uq_a1','uq_a','inst',8, interval '3 days');" >/dev/null
r=$(q "select t.class('uq_b1','uq_b','inst',8, interval '3 days') is not null" 2>&1 || true)
check "$(q "select t.ok('$r' = 't', 'the same instructor teaching at the same hour at another gym: allowed, gym B learns nothing about gym A')")"
r=$(q "select t.class('uq_a2','uq_a','inst',8, interval '3 days 30 minutes')" 2>&1 || true)
check "$(q "select t.ok(\$\$$r\$\$ like '%classes_instructor_no_overlap%', 'overlapping classes for one instructor in one gym: refused')")"
r=$(q "select t.person('cx'); select t.join('uq_a','cx','member','IN01')" 2>&1 || true)
check "$(q "select t.ok(\$\$$r\$\$ like '%gym_members_member_code_unique%', 'duplicate desk code inside one gym: refused')")"
r=$(q "select t.person('cy'); select t.join('uq_b','cy','member','ZZ99'); select t.join('uq_a','cy','member','ZZ99'); select 'ok'" 2>&1 | tail -1)
check "$(q "select t.ok('$r' = 'ok', 'the same desk code in two gyms: allowed')")"
r=$(q "insert into class_types (gym_id, name) values (t.id('uq_a'), 'Lead Climbing Course'), (t.id('uq_b'), 'lead climbing course') returning 'ok'" 2>&1 | head -1)
r2=$(q "insert into class_types (gym_id, name) values (t.id('uq_a'), 'LEAD climbing course')" 2>&1 || true)
check "$(q "select t.ok(\$\$$r2\$\$ like '%class_types_name_unique%', 'the same name again in one gym, other case: refused')")"
check "$(q "select t.ok('$r' = 'ok', 'the same class type name in two gyms: allowed (case-folded per gym)')")"

# audit: on every table with a gym_id, each unique index and exclusion constraint must contain gym_id, or be keyed
# by an id that already belongs to one gym (a primary key, class_id) or by a provider id the server alone writes
audit=$(q "
  with idx as (
    select c.relname as tbl, i.relname as idx,
           array(select a.attname::text from unnest(x.indkey) k join pg_attribute a on a.attrelid = c.oid and a.attnum = k) as cols,
           x.indisprimary as pk
    from pg_index x join pg_class i on i.oid = x.indexrelid join pg_class c on c.oid = x.indrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and x.indisunique
      and exists (select 1 from pg_attribute a where a.attrelid = c.oid and a.attname = 'gym_id')
    union all
    select c.relname, con.conname, array(select a.attname::text from unnest(con.conkey) k join pg_attribute a on a.attrelid = c.oid and a.attnum = k), false
    from pg_constraint con join pg_class c on c.oid = con.conrelid join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and con.contype = 'x')
  select string_agg(tbl || '.' || idx || '(' || array_to_string(cols, ',') || ')', '; ' order by tbl, idx)
  from idx
  where not pk and not ('gym_id' = any(cols)) and not ('class_id' = any(cols))
    and not (cols && array['stripe_subscription_id','stripe_payment_intent_id','stripe_account_id','stripe_customer_id','slug'])")
check "$(q "select t.ok(coalesce(\$\$$audit\$\$, '') = '', 'catalog audit: no people-spanning unique or exclusion rule outside the gym key [' || coalesce(\$\$$audit\$\$, 'none') || ']')")"
q "select 'listed: ' || c.relname || '.' || i.relname from pg_index x join pg_class i on i.oid=x.indexrelid join pg_class c on c.oid=x.indrelid join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and x.indisunique and not x.indisprimary order by 1"
finish
