# Data fundamentals gate, from the catalog: primary keys, RLS on, indexed foreign keys, no float or money types,
# timestamptz for instants, and no function in private callable by anon.
source "$(dirname "$0")/lib.sh"
r=$(q "select coalesce(string_agg(relname, ','), '') from pg_class c join pg_namespace n on n.oid=c.relnamespace where n.nspname='public' and c.relkind='r' and not exists (select 1 from pg_index i where i.indrelid=c.oid and i.indisprimary)")
check "$(q "select t.ok('$r' = '', 'every table has a primary key [$r]')")"
r=$(q "select coalesce(string_agg(tablename, ','), '') from pg_tables where schemaname='public' and not rowsecurity")
check "$(q "select t.ok('$r' = '', 'RLS enabled on every public table [$r]')")"
r=$(q "
  select coalesce(string_agg(conrelid::regclass || '(' || cols || ')', '; '), '') from (
    select con.conrelid, array_to_string(array(select a.attname from unnest(con.conkey) k join pg_attribute a on a.attrelid=con.conrelid and a.attnum=k), ',') cols, con.conkey
    from pg_constraint con join pg_namespace n on n.oid = (select relnamespace from pg_class where oid=con.conrelid)
    where con.contype='f' and n.nspname='public') f
  where not exists (
    select 1 from pg_index i where i.indrelid = f.conrelid
      and (string_to_array(i.indkey::text, ' ')::int2[])[1:array_length(f.conkey,1)] @> f.conkey
      and (string_to_array(i.indkey::text, ' ')::int2[])[1:array_length(f.conkey,1)] <@ f.conkey)")
check "$(q "select t.ok(\$\$$r\$\$ = '', 'every foreign key has an index led by its columns [$r]')")"
r=$(q "select coalesce(string_agg(table_name||'.'||column_name, ','), '') from information_schema.columns where table_schema='public' and data_type in ('real','double precision','money','character','timestamp without time zone') and not (table_name='classes' and column_name in ('starts_local','ends_local'))")
check "$(q "select t.ok('$r' = '', 'no float, money, char(n), and timestamp without zone only for wall-time truth [$r]')")"
r=$(q "select coalesce(string_agg(p.proname, ','), '') from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname in ('private','app') and has_function_privilege('anon', p.oid, 'execute')")
check "$(q "select t.ok('$r' = '', 'anon can execute no private or app function [$r]')")"
r=$(q "select coalesce(string_agg(p.proname, ','), '') from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname='private' and has_function_privilege('authenticated', p.oid, 'execute') and p.proname not in ('my_gym_ids','my_staff_gym_ids','my_owner_gym_ids','can_see_profile')")
check "$(q "select t.ok('$r' = '', 'authenticated can execute only the four policy helpers in private [$r]')")"
r=$(q "select coalesce(string_agg(p.proname, ','), '') from pg_proc p join pg_namespace n on n.oid=p.pronamespace where n.nspname in ('private','app') and p.prosecdef and not coalesce(array_to_string(p.proconfig, ',') like '%search_path=\"\"%', false)")
check "$(q "select t.ok('$r' = '', 'every security definer function pins search_path to empty [$r]')")"
finish
