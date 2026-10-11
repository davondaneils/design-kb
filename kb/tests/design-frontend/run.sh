#!/bin/sh
# Reproduces every number in kb/tests/design-frontend.md. Run from the repo root: sh kb/tests/design-frontend/run.sh
# Takes about 25 minutes (vitals runs are throttled). Outputs land in kb/tests/design-frontend/results/.
set -u
T=kb/tests/design-frontend
A=skills/design-frontend/assets
R=$T/results
mkdir -p $R
node $T/build.mjs

DARKFIX="@media (prefers-color-scheme: dark) { .btn-primary:not(:active):not(.is-active) { box-shadow: none !important } }"

echo "== lint (before and after, every state)"
for d in before .; do
  node tools/lint.mjs $T/$d/coffee.html --quiet --states state=added,state=subscribed,state=error,state=sending
  node tools/lint.mjs $T/$d/dashboard.html --quiet --states state=loading,state=empty,state=partial,state=viewer,density=compact,open=palette,open=sheet
  node tools/lint.mjs $T/$d/coffee-states.html --quiet
  node tools/lint.mjs $T/$d/dashboard-states.html --quiet
done
node $T/lintsum.mjs $T/before > $R/lint-before.txt
node $T/lintsum.mjs $T > $R/lint-after.txt

echo "== pixel diff, intended dark-button fix switched off (proves everything else identical)"
node $A/pixel-diff.mjs $T/before/coffee.html $T/coffee.html --queries state=added,state=subscribed,state=error,state=sending --inject-after "$DARKFIX" --json $R/diff-coffee.json --out $T/diffs
node $A/pixel-diff.mjs $T/before/dashboard.html $T/dashboard.html --queries state=loading,state=empty,state=partial,state=viewer,density=compact,open=palette,open=sheet --inject-after "$DARKFIX" --json $R/diff-dashboard.json --out $T/diffs
node $A/pixel-diff.mjs $T/before/coffee-states.html $T/coffee-states.html --inject-after "$DARKFIX" --json $R/diff-coffee-states.json --out $T/diffs
node $A/pixel-diff.mjs $T/before/dashboard-states.html $T/dashboard-states.html --inject-after "$DARKFIX" --json $R/diff-dashboard-states.json --out $T/diffs
echo "== the intended changes, shown on their own"
node $A/pixel-diff.mjs $T/before/coffee.html $T/coffee.html --widths 1440 --schemes dark --json $R/diff-coffee-darkfix.json --out $T/diffs/intended
node $A/pixel-diff.mjs $T/before/dashboard.html $T/dashboard.html --widths 1440 --schemes dark --json $R/diff-dashboard-darkfix.json --out $T/diffs/intended
node $A/pixel-diff.mjs $T/before/dashboard.html $T/dashboard.html --widths 900 --schemes light --inject-after "$DARKFIX" --json $R/diff-dashboard-900.json --out $T/diffs/intended

echo "== CSS architecture audit"
for d in before .; do for p in coffee dashboard; do node $A/css-audit.mjs $T/$d/$p.html --json $R/audit-$(echo $d | tr -d ./)$p.json; done; done

echo "== page weight"
for d in before .; do
  node $A/weight.mjs $T/$d/coffee.html --lcp hero-title --json $R/weight-$(echo $d | tr -d ./)coffee.json
  node $A/weight.mjs $T/$d/dashboard.html --lcp main --json $R/weight-$(echo $d | tr -d ./)dashboard.json
done

echo "== vitals (mobile: Lighthouse slow 4G and 4x CPU; 7 runs, median)"
CI="clickall:.add-btn; type:#email=dana@; press:Enter"
DI="clickall:thead .sort; click:#density label:nth-child(3); click:#density label:nth-child(2); press:Control+k; type:#pal-q=se; press:Escape; hover:#chart-svg; hover:#chart-svg"
for d in before .; do
  n=$(echo $d | tr -d ./)
  node $A/vitals.mjs $T/$d/coffee.html --runs 7 --interact "$CI" --json $R/vitals-${n}coffee-mobile.json
  node $A/vitals.mjs $T/$d/dashboard.html --runs 7 --interact "$DI" --json $R/vitals-${n}dashboard-mobile.json
  node $A/vitals.mjs $T/$d/dashboard.html --runs 7 --profile desktop --interact "$DI" --json $R/vitals-${n}dashboard-desktop.json
  node $A/vitals.mjs "$T/$d/dashboard.html" --runs 5 --profile desktop --storage tally-density=compact --json $R/vitals-${n}dashboard-compact.json
done
