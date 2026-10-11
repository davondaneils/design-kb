#!/bin/bash
# Outline the Set in Stone words with design-graphic wordmark.py, then compose.
B=/tmp/claude-0/-home-claude-design-kb/7d54560a-30fa-5288-8002-e57a005c7126/scratchpad/heldout-build
W=/home/claude/design-kb/.claude/worktrees/agent-aa29ecdbbd5b910ef/skills/design-graphic/assets/wordmark.py
cd "$B" || exit 1
R=npmfonts/bodoni/package/files/bodoni-moda-latin-opsz-normal.woff2
I=npmfonts/bodoni/package/files/bodoni-moda-latin-opsz-italic.woff2
python3 "$W" "$R" "Set" --axes wght=${WGHT:-800},opsz=${OPSZ:-28} --track -12 --json sfonts/w-set.json > sfonts/w-set.svg
python3 "$W" "$I" "in" --axes wght=${IWGHT:-600},opsz=${OPSZ:-28} --track -8 --json sfonts/w-in.json > sfonts/w-in.svg
python3 "$W" "$R" "Stone" --axes wght=${WGHT:-800},opsz=${OPSZ:-28} --track -12 --json sfonts/w-stone.json > sfonts/w-stone.svg
python3 compose_wordmark.py
