#!/bin/bash
# reset.sh g|h : recreate crux_<x>, stub auth, load entry schema and own seed
x=$1; X=$(echo $x | tr a-z A-Z); T=$(dirname "$0")
P="psql -h /tmp/pgr2crit -p 55491 -U postgres -X -v ON_ERROR_STOP=1 -q"
$P -c "drop database if exists crux_$x" -c "create database crux_$x"
$P -d crux_$x -f $T/00_auth_stub.sql
$P -d crux_$x -f "${ENTRIES:-/tmp/claude-0/-home-user-design-kb/6a58f026-c577-5c8c-9a9c-b604a01965c1/scratchpad/blind-data-r2}/$X/schema.sql"
$P -d crux_$x -f $T/${x}_seed.sql
