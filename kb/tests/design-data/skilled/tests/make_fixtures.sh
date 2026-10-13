#!/usr/bin/env bash
# Builds the screen's fixtures from the real schema: each one is the exact response of api.location_schedule for
# Maya Okafor on a freshly seeded database. The page renders only these responses, so every number, label and state
# on screen is something the model returned.
#   PGHOST=/tmp/crux-pg PGPORT=55432 bash tests/make_fixtures.sh   (run on 2026-10-13 between 12:30Z and 00:30Z)
set -eu
HERE="$(cd "$(dirname "$0")" && pwd)"; ROOT="$(cd "$HERE/.." && pwd)"
PGBIN="${PGBIN:-/usr/lib/postgresql/16/bin}"
export PGHOST="${PGHOST:-/tmp/crux-pg}" PGPORT="${PGPORT:-55432}" PGUSER="${PGUSER:-postgres}"
DB=crux_fixtures; OUT="$HERE/fixtures"; mkdir -p "$OUT"
MAYA=c0000000-0000-7000-8000-0000000000aa
"$PGBIN/psql" -d postgres -qAt -c "drop database if exists $DB" -c "create database $DB" >/dev/null
"$PGBIN/psql" -d "$DB" -v ON_ERROR_STOP=1 -qAt -f "$HERE/00_supabase_stub.sql" -f "$ROOT/schema.sql" -f "$HERE/01_seed.sql" -o /dev/null
as_maya() { "$PGBIN/psql" -d "$DB" -v ON_ERROR_STOP=1 -qAt -c "begin; set local role authenticated; select set_config('request.jwt.claims', '{\"sub\":\"$MAYA\"}', true) is not null as _; $1; commit;" | grep -v '^t$'; }
q() { "$PGBIN/psql" -d "$DB" -v ON_ERROR_STOP=1 -qAt -c "$1" >/dev/null; }

as_maya "select api.location_schedule('a1000000-0000-7000-8000-000000000001', '2026-10-12')" > "$OUT/ready.json"
as_maya "select api.location_schedule('a1000000-0000-7000-8000-000000000002', '2026-10-12')" > "$OUT/empty.json"
as_maya "select api.location_schedule('a1000000-0000-7000-8000-000000000001', '2026-10-05')" > "$OUT/east-2026-10-05.json"
as_maya "select api.location_schedule('a1000000-0000-7000-8000-000000000001', '2026-10-19')" > "$OUT/east-2026-10-19.json"
as_maya "select api.location_schedule('b1000000-0000-7000-8000-000000000001', '2026-10-12')" > "$OUT/ridgeline-2026-10-12.json"
# GET /v1/me: the caller's gyms and walls, read through RLS (only what Maya may see).
as_maya "select jsonb_build_object('profile', (select jsonb_build_object('id', id, 'display_name', display_name) from profiles where id = '$MAYA'),
  'gyms', (select jsonb_agg(jsonb_build_object('id', g.id, 'name', g.name, 'locations',
     (select jsonb_agg(jsonb_build_object('id', l.id, 'name', l.name, 'time_zone', l.time_zone) order by l.name) from locations l where l.gym_id = g.id)) order by g.name)
     from gyms g))" > "$OUT/me.json"
q "update passes set status = 'past_due', past_due_since = '2026-10-11T15:14:00Z' where id = 'f0000000-0000-7000-8000-0000000000aa'"
as_maya "select api.location_schedule('a1000000-0000-7000-8000-000000000001', '2026-10-12')" > "$OUT/past-due.json"
q "update passes set past_due_since = '2026-10-04T15:14:00Z' where id = 'f0000000-0000-7000-8000-0000000000aa'"
as_maya "select api.location_schedule('a1000000-0000-7000-8000-000000000001', '2026-10-12')" > "$OUT/lapsed.json"
ls -l "$OUT"
