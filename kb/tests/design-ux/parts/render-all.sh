#!/bin/sh
# Renders the final shots for kb/tests/design-ux.md. Run from the repo root.
set -e
O=kb/tests/design-ux/shots
T=kb/tests/design-ux
mkdir -p $O
node tools/render.mjs $T/coffee.html $O --name coffee --jpeg 75
node tools/render.mjs $T/dashboard.html $O --name dashboard --jpeg 75
for s in menu quick cart cart-empty removed checkout; do
  node tools/render.mjs "$T/coffee.html?state=$s" $O --name coffee-$s --jpeg 75 --viewport-only
done
for s in sub-error error sending subscribed; do  # in-page states: full page
  node tools/render.mjs "$T/coffee.html?state=$s" $O --name coffee-$s --jpeg 75
done
for s in first-run listening check-failed first-data; do
  node tools/render.mjs "$T/dashboard.html?state=$s" $O --name dashboard-$s --jpeg 75
done
node tools/render.mjs $T/coffee-states.html $O --name coffee-states --jpeg 75 --widths 1440
node tools/render.mjs $T/dashboard-states.html $O --name dashboard-states --jpeg 75 --widths 1440
