# usage: DB=crux_g; as <user-number> "<sql>"
PSQL="psql -h /tmp/pgr2crit -p 55491 -U postgres -X -At -q"
u() { printf '00000000-0000-0000-0000-0000000000%02d' "$1"; }
as() { $PSQL -d "$DB" -c "begin; set local role authenticated; set local request.jwt.claim.sub = '$(u $1)';
$2
commit;" 2>&1; }
su_sql() { $PSQL -d "$DB" -c "$1" 2>&1; }
