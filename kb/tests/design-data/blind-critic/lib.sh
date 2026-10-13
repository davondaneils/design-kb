# Shared helpers for the concurrency tests.
T=/tmp/claude-0/-home-user-design-kb/6a58f026-c577-5c8c-9a9c-b604a01965c1/scratchpad/blind-data-tests
B=/usr/lib/postgresql/16/bin; D=$(cat $T/pgdir)
PSQL="$B/psql -h $D -p 54329 -U postgres -X -q -A -t"
fresh() { $B/dropdb -h $D -p 54329 -U postgres --if-exists $1 ; $B/createdb -h $D -p 54329 -U postgres -T ${2}_base $1; }
uid() { printf '00000000-0000-0000-0000-0000000000%02d' $1; }
# session <db> <user> <sql...>: one transaction as that member
session() { local db=$1 u=$2; shift 2; $PSQL -d $db -c "begin; set local role authenticated; set local request.jwt.claim.sub='$(uid $u)'; $* commit;" 2>&1 | sed "s/^/[u$u] /"; }
# class creators (superuser; capacity, hours from now)
mkclass_x() { $PSQL -d $1 -c "insert into public.classes(id,gym_id,location_id,class_type_id,instructor_id,starts_local,ends_local,capacity,created_by)
  values ('$2','a0000000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','$(uid 2)',
  (now() + interval '$4 hours') at time zone 'America/Denver', (now() + interval '$4 hours 90 minutes') at time zone 'America/Denver', $3, '$(uid 2)')" ; }
mkclass_y() { $PSQL -d $1 -c "insert into public.class_sessions(id,tenant_id,location_id,class_type_id,instructor_user_id,starts_at,ends_at,capacity,created_by)
  values ('$2','a0000000-0000-0000-0000-000000000001','b0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001','$(uid 2)',
  now() + interval '$4 hours', now() + interval '$4 hours 90 minutes', $3, '$(uid 2)')" ; }
