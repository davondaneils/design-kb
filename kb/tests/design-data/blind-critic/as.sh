#!/bin/bash
# usage: as.sh <db> <user-number|service|anon> <sql>   runs SQL as that Supabase role in one transaction
T=$(dirname "$0"); B=/usr/lib/postgresql/16/bin; D=$(cat $T/pgdir)
db=$1; who=$2; shift 2
if [ "$who" = service ]; then pre="set local role service_role;"
elif [ "$who" = anon ]; then pre="set local role anon;"
else pre="set local role authenticated; set local request.jwt.claim.sub = '00000000-0000-0000-0000-0000000000$(printf %02d $who)';"; fi
$B/psql -h $D -p 54329 -U postgres -d $db -X -q -A -t -v ON_ERROR_STOP=1 -c "begin; $pre $* commit;" 2>&1
