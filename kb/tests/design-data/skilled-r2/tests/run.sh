#!/usr/bin/env bash
# Loads schema.sql into a scratch PostgreSQL 16 cluster (own temp dir, free port) and runs every test.
# Usage: bash tests/run.sh   (from skilled-r2/). The cluster is stopped and removed on exit.
set -euo pipefail
here="$(cd "$(dirname "$0")" && pwd)"
root="$(dirname "$here")"
bin=/usr/lib/postgresql/16/bin
work="$(mktemp -d)"
port="$(python3 -c 'import socket; s=socket.socket(); s.bind(("127.0.0.1",0)); print(s.getsockname()[1])')"
export PGHOST="$work" PGPORT="$port" PGUSER=postgres PGDATABASE=crux
cleanup() { "$bin/pg_ctl" -D "$work/data" -m fast stop >/dev/null 2>&1 || true; rm -rf "$work"; }
trap cleanup EXIT
run_pg() { if [ "$(id -u)" = 0 ]; then chown -R postgres "$work"; su postgres -s /bin/bash -c "$*"; else bash -c "$*"; fi; }
run_pg "$bin/initdb -D $work/data -U postgres -A trust --no-sync >/dev/null"
run_pg "$bin/pg_ctl -D $work/data -o '-p $port -k $work -c listen_addresses= -c max_connections=60' -l $work/log -w start >/dev/null"
psql_() { "$bin/psql" -X -v ON_ERROR_STOP=1 -q "$@"; }
"$bin/createdb" -h "$work" -p "$port" -U postgres crux
psql_ -f "$here/00_supabase_stub.sql"
psql_ -f "$root/schema.sql"
psql_ -f "$here/01_helpers.sql"
echo "schema loaded on PostgreSQL $("$bin/psql" -X -tAc 'show server_version')"
fail=0
for t in "$here"/[1-9]*.sh; do
  echo "== $(basename "$t")"
  if ! PSQL="$bin/psql" BIN="$bin" bash "$t"; then fail=1; echo "FAILED: $(basename "$t")"; fi
done
exit $fail
