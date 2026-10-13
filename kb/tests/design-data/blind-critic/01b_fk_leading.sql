-- FKs with no index whose FIRST column is one of the FK columns (lenient check: a unique id column leading is enough)
select c.conrelid::regclass, c.conname from pg_constraint c
where c.contype='f' and c.connamespace='public'::regnamespace
  and not exists (select 1 from pg_index i where i.indrelid=c.conrelid and i.indkey[0] = any(c.conkey));
