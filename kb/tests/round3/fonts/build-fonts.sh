#!/bin/sh
# Self-hosted font subsets for the round 3 pages (run from the repo root: sh kb/tests/round3/fonts/build-fonts.sh <scratch-dir>).
# Sources: Google Fonts CSS2 API latin files, downloaded 2026-10-10 (OFL 1.1):
#   Newsreader v26 roman and italic (opsz 6..72, wght 200..800), Inter v20 roman (opsz 14..32, wght 100..900), Geist Mono v6.
# Newsreader is pinned to wght 400 (the pages set every serif at 400) and keeps its optical-size axis, so 96px display
# lines and 20px notes each get their own drawing. Inter keeps wght 400..700 and opsz. Layout features are kept (kern,
# liga, tnum, lnum, onum, case, ss01..ss08, cv01..cv11, frac, zero).
set -e
W=${1:-/tmp}
F=kb/tests/round3/fonts
U="U+0020-007E,U+00A0,U+00A9,U+00B0,U+00B7,U+00D7,U+00E9,U+00ED,U+00F1,U+00F3,U+2009,U+2011,U+2013,U+2018,U+2019,U+201C,U+201D,U+2022,U+2026,U+202F,U+2122,U+2190-2193,U+2212,U+2318,U+21E7,U+2325"
FEAT="kern,liga,clig,calt,tnum,lnum,onum,pnum,case,frac,zero,ss01,ss02,ss03,ss04,ss05,ss06,ss07,ss08,cv01,cv02,cv03,cv04,cv05,cv06,cv07,cv08,cv09,cv10,cv11,locl,mark,mkmk,ccmp"
fonttools varLib.instancer $W/newsreader-roman.woff2 wght=400 -o $W/nr.ttf
fonttools varLib.instancer $W/newsreader-italic.woff2 wght=400 -o $W/nri.ttf
fonttools varLib.instancer $W/inter-roman.woff2 wght=400:700 -o $W/inter.ttf
pyftsubset $W/nr.ttf --unicodes="$U" --layout-features="$FEAT" --flavor=woff2 --output-file=$F/newsreader-400.woff2
pyftsubset $W/nri.ttf --unicodes="$U" --layout-features="$FEAT" --flavor=woff2 --output-file=$F/newsreader-400-italic.woff2
pyftsubset $W/inter.ttf --unicodes="$U" --layout-features="$FEAT" --flavor=woff2 --output-file=$F/inter-var.woff2
pyftsubset $W/geist-mono.woff2 --unicodes="$U" --layout-features="$FEAT" --flavor=woff2 --output-file=$F/geist-mono.woff2
ls -la $F/*.woff2
