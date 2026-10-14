-- FKs whose columns are not the leading columns of some index (strict: partial indexes do not count unless the predicate is just NOT NULL on an FK column)
with fk as (
  select c.conrelid::regclass tbl, c.conname, c.conkey from pg_constraint c
  join pg_namespace n on n.oid = (select relnamespace from pg_class where oid=c.conrelid)
  where c.contype='f' and n.nspname='public')
select fk.tbl, fk.conname,
  (select string_agg(attname, ',') from pg_attribute a where a.attrelid=fk.tbl and a.attnum = any(fk.conkey)) cols,
  coalesce((select string_agg(i.indexrelid::regclass::text || case when i.indpred is not null then ' (partial: '||pg_get_expr(i.indpred,i.indrelid)||')' else '' end, '; ')
     from pg_index i where i.indrelid=fk.tbl
       and (select array_agg(x order by x) from unnest(i.indkey[0:array_length(fk.conkey,1)-1]) x) = (select array_agg(x order by x) from unnest(fk.conkey) x)), 'NONE') covering_index
from fk order by 1,2;
-- types
select 'TYPE', table_name, column_name, data_type from information_schema.columns
 where table_schema='public' and (data_type in ('timestamp without time zone','numeric','money','real','double precision','date','time without time zone','integer','bigint')
   and (column_name ~ '(price|amount|minor|_at$|_local$|starts|ends|credits)'))
 order by 2,3;
select 'NULLABLE', table_name, column_name from information_schema.columns c where table_schema='public' and is_nullable='YES' order by 2,3;
