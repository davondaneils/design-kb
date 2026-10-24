# design-director changelog

## 2026-10-24 (findability)
- New `references/preflight.md`: the mandatory load order, a trigger table (work touches X, read Y first), the `design-log.md` read log, the hand-over gate and closing the loop on corrections. From threads that skipped design-typography when picking fonts and missed design-motion 08's components.
- New `references/resource-index.md`: where each in-repo source, mined outside resource and tool lives.
- Section 0 points at both; section 5 starts with `tools/check.mjs`, which runs the automated loop in one command and writes a report.
- `.claude/skills/` symlinks to every skill: before this, a fresh session in the repo listed none of the design skills.

## 2026-10-10 (editor-in-chief, round 3 lessons, from `kb/reviews/round3-critic.md`)
- Build rules: the state truth data-attribute contract (`data-sum-of`, `data-derived-from`, `data-monotonic`, `data-source` and `data-source-stopped`, `data-data="none"`, `data-bar`, `data-share-base`) and headers in a shell (content container, one row, `flex: none` on dots).
- Self-critique loop: lint runs its layout checks at 390, 768, 1024 and 1440 by default and drives 3 live updates; claims inventory with `--render` per state, PROMISE and PERIOD warnings; judged rows read at 768, 1024 and every state; proportion honesty; new step 13, a fresh-context critic's judged pass is required before claiming the gate.

## 2026-10-10 (editor-in-chief, wave 2 integration)
- Every domain reference listed with what it is for, design-conversion included; UI pattern examples in `kb/references/patterns/`.
- Exemplars named from `kb/teardowns/INDEX.md` (landing: Stripe, Linear, Vercel, Ramp; dashboard: Linear app, Stripe and Vercel dashboards), with the exemplar contrast failures not to copy.
- Build rules: production delivery vs self-contained test pages, logo as outlined SVG, a favicon on every page, social card and icons on public pages, flatplan and phone edit list, conversion, motion tokens in scripts, live regions inside modals, build proof.
- Self-critique loop: renders at 390, 768, 1024, 1440; fact check (claims inventory), search check, conversion audit, icon audit, motion filming, pixel diff after markup changes, exemplar comparison by measured numbers.
