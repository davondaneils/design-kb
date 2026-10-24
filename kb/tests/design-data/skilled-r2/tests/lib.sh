# Shared by the test scripts. q runs SQL as the superuser; as runs SQL as an authenticated user
# (role authenticated plus the JWT subject, which is how the API server talks to the database).
q() { "$PSQL" -X -q -tA -v ON_ERROR_STOP=1 -v VERBOSITY=verbose -c "$1"; }
as() {  # as <person> <sql>
  "$PSQL" -X -q -tA -v VERBOSITY=verbose -c "begin; select set_config('request.jwt.claim.sub', t.id('$1')::text, true); set local role authenticated; $2; commit;" 2>&1 | sed '/^$/d' | grep -v '^set_config\|^[0-9a-f-]\{36\}$' || true
}
uid() { q "select t.id('$1')"; }
results=""
check() { echo "$1"; results+="$1"$'\n'; }
finish() { if grep -q '^FAIL' <<<"$results"; then exit 1; fi; }
