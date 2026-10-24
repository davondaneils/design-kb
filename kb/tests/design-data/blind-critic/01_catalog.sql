\echo '--- FKs without an index whose leading columns cover the FK columns (any order)'
select c.conrelid::regclass as tbl, c.conname,
       (select array_agg(a.attname order by a.attnum) from pg_attribute a where a.attrelid=c.conrelid and a.attnum = any(c.conkey)) cols
from pg_constraint c
where c.contype='f' and c.connamespace='public'::regnamespace
  and not exists (
    select 1 from pg_index i
    where i.indrelid=c.conrelid
      and (select array_agg(x order by x) from unnest((i.indkey::int2[])[0:cardinality(c.conkey)-1]) x)
        = (select array_agg(x order by x) from unnest(c.conkey) x));
\echo '--- columns typed money/float/numeric-without-scale, timestamp without tz, json'
select table_name, column_name, data_type from information_schema.columns
where table_schema='public' and (data_type in ('money','real','double precision','timestamp without time zone','json')
   or (data_type='numeric'));
\echo '--- nullable columns (review)'
select table_name, string_agg(column_name, ', ') from information_schema.columns
where table_schema='public' and is_nullable='YES' group by 1 order by 1;
\echo '--- tables without RLS'
select relname from pg_class where relnamespace='public'::regnamespace and relkind='r' and not relrowsecurity;
\echo '--- security definer functions without pinned search_path'
select p.oid::regprocedure from pg_proc p where prosecdef and pronamespace not in ('pg_catalog'::regnamespace)
 and not exists (select 1 from unnest(coalesce(proconfig,'{}')) c where c like 'search_path=%');
\echo '--- functions executable by anon'
select p.oid::regprocedure from pg_proc p join pg_namespace n on n.oid=p.pronamespace
 where n.nspname in ('public','api','private') and has_function_privilege('anon', p.oid, 'execute')
   and p.oid not in (select objid from pg_depend where deptype='e');
\echo '--- table privileges for anon'
select table_name, privilege_type from information_schema.role_table_grants where grantee='anon' and table_schema='public';
