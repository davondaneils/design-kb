#!/usr/bin/env bash
# Renders the schedule screen: default at 390, 768, 1024, 1440 light and dark; every ?state= at the same widths;
# the dialog state viewport-only; and the state sheet. Run from the design-kb repo root.
set -eu
S=kb/tests/design-data/skilled; OUT=$S/shots
rm -rf "$OUT"; mkdir -p "$OUT"
node tools/render.mjs $S/schedule.html $OUT --widths 390,768,1024,1440 --name default >/dev/null
for st in loading empty error places-left full waitlist booked late-cancel past-due lapsed; do
  node tools/render.mjs "$S/schedule.html?state=$st" $OUT --widths 390,768,1024,1440 --name "$st" >/dev/null
done
node tools/render.mjs "$S/schedule.html?state=late-cancel-confirm" $OUT --widths 390,768,1024,1440 --viewport-only --name late-cancel-confirm >/dev/null
[ -f $S/state-sheet.html ] && node tools/render.mjs $S/state-sheet.html $OUT --widths 390,768,1024,1440 --name state-sheet >/dev/null
ls $OUT | wc -l
