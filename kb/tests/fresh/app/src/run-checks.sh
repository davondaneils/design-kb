#!/usr/bin/env bash
# Rebuilds the plan screen and runs every director section 5 check, writing each tool's output to reports/.
# Usage (from the repo root): bash kb/tests/fresh/app/src/run-checks.sh
cd "$(dirname "$0")/../../../../.." || exit 1
A=kb/tests/fresh/app; R=$A/reports; mkdir -p $R/motion
node $A/src/build.mjs
run() { local name=$1; shift; "$@" > $R/$name.txt 2>&1; echo "$name exit $?"; }
run lint-plan node tools/lint.mjs $A/plan.html --states state=empty,state=error,state=loading,state=nowindow,state=saved --json $R/lint-plan.json
run lint-states node tools/lint.mjs $A/plan-states.html --json $R/lint-states.json
run claims-default node skills/design-copy/assets/claims_inventory.mjs $A/plan.html --year 2026
for s in default empty error loading nowindow saved; do q=""; [ $s != default ] && q="?state=$s"; run claims-render-$s node skills/design-copy/assets/claims_inventory.mjs "$A/plan.html$q" --year 2026 --render; done
run claims-states node skills/design-copy/assets/claims_inventory.mjs $A/plan-states.html --year 2026
run search-check node skills/design-search/assets/search-check.mjs $A/plan.html --expect private
run icon-audit node skills/design-graphic/assets/icon_audit.mjs $A/plan.html
run icon-audit-states node skills/design-graphic/assets/icon_audit.mjs $A/plan-states.html
run polish-audit node skills/design-polish/assets/polish-audit.mjs $A/plan.html
run polish-audit-states node skills/design-polish/assets/polish-audit.mjs $A/plan-states.html
run css-audit node skills/design-frontend/assets/css-audit.mjs $A/plan.html
run vitals node skills/design-frontend/assets/vitals.mjs $A/plan.html
run weight node skills/design-frontend/assets/weight.mjs $A/plan.html
run motion-audit node skills/design-motion/assets/motion-audit.mjs $A/src/scenarios.mjs $R/motion
run motion-plan-check node skills/design-motion/assets/motion-plan-check.mjs $A/plan.html --no-scene
run motion-plan-check-390 node skills/design-motion/assets/motion-plan-check.mjs $A/plan.html --no-scene --width 390
run measure node kb/teardowns/measure.mjs $A/plan.html $R/measure.json
run operate node $A/src/operate.mjs
run tab-contrast bash -c "python3 skills/design-graphic/assets/tab_contrast.py \"#1b4088\"; python3 skills/design-graphic/assets/tab_contrast.py \"#ffffff\""
