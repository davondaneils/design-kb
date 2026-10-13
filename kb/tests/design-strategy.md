# design-strategy test: Halden Hearing (2026-10-13)

Brief: `kb/tests/design-strategy/briefs.md`, committed (`35770aa`) before any build or any skill file existed. Fresh brief, never used before. Fictional facts.

## Method
- **Baseline:** a clean-context subagent allowed to read only the brief and the `render.mjs` usage line; no skills, no `kb/`, no lint. One honest fix round on its own renders. Committed (`0f72d7e`) before design-strategy was written. Output: `baseline/`.
- **With skill:** a separate subagent following design-director (foundations, design-strategy at full depth with website-strategy stages 2 to 5, design-playbook-brand, design-playbook-landing and the references they name), forbidden to open `baseline/`. Output: `skilled/` (brief, discovery, home page, mark, social card, hand-over).
- **Blind critic:** a third subagent got both entries as P and Q (labels drawn at random, key below), with skill names stripped from the files, and the rubric in the brief. It ran the lint and renders itself. Full report: `blind-critic.md`.
- **Five-second test:** two further fresh subagents, one per entry, each shown only the 390 light first screen in role ("you are 68, your daughter sent you this link"). The critic had no subagent tool, so these were run separately and are recorded below verbatim in substance.

Key: **P = with skill, Q = baseline.**

## Scores (blind critic)
| Rubric area | With skill | Baseline |
|---|---|---|
| 1. Strategy rigor | 7 | 7 |
| 2. Strategy to design | 8 | 6 |
| 3. Voice | 7 | 6 |
| 4. Screen fundamentals | 8 | 5 (capped: lint FAIL 42, axe label-in-name fail) |
| 5. Expert moves | 7 | 6 |
| **Total /50** | **37** | **30** |

Lint: with skill PASS (0 fail, 1 warn); baseline FAIL (42 fails: axe 2.5.3 label-content-name mismatch on the logo link, focus-shape, measure, off-scale type and spacing). Contrast passes in both, mostly AAA.

## Five-second test (fresh viewers)
- **With skill:** read as "a local hearing clinic in Clifton, free test, not paid commission"; would ring the number. **Flagged as wrong:** the heard/said sentence "has little yellow dashes where letters are missing, and it looks broken until you realise it's meant to show what muffled hearing sounds like", and the ochre crossbar on the H "looks like a smudge". Reminded them of "an independent local practice, a bit smarter than Specsavers or Boots".
- **Baseline:** read as "a free 90-minute hearing test"; "You've waited long enough" spoke to them; would ring. Nothing looked wrong. Reminded them of "a family-run opticians, the opposite of a chain".

## Verdict
**Skilled clearly better (37 vs 30), but not a pass.** Fundamentals pass and the concept carries the page without photography, which the baseline could not do (its first screen at 768 and 1440 is a grey "Photo to come" box). On strategy writing alone the two are level.

Two failures the skills already had rules for, missed because the builder had no fresh viewer:
1. **Concept legibility (design-playbook-brand 2a).** A viewer read the missing-letter device and the H crossbar as errors. By rule 2a that fails: drop it or make it unmistakably intentional and retest. The builder skipped the five-second test ("no fresh-context viewer") and shipped anyway.
2. **The one true fact is asserted, not shown.** "90 minutes" appears four times; the page never says what the time is for. The baseline's four-step "what happens in your 90 minutes" timeline was the best single idea in either entry.

Other gaps: no people or proof (the 40 percent referral fact is unused); dark mode loses the damson field and the button turns pink, off-system; brief written in shorthand (CEP, O/C/E) and cites a competitor wall not shipped with it; brief at 756 words against the 600 target.

## Gaps for the next round (domain-specialist)
1. design-strategy `references/06` and design-director step 13: when no fresh viewer is available, the hand-over must say "concept legibility not tested" and the device stays off the first screen until tested; never ship an untested reversible-looking device (ties to playbook-brand 2a).
2. design-strategy `references/05`: "show the true fact" rule: when the fact is a quantity (90 minutes, 4 years), the page shows what it buys, step by step.
3. design-strategy `references/05`: proof is an identity input; when proof is the weakest field, the page uses the strongest fact available (here the referral share) rather than leaving proof empty.
4. Dark mode for a brand-color field: remap the field to a role that keeps the identity, check the button stays in system (design-color `ui-tokens-themes.md` has the rule; the playbook-brand done list should name dark renders of brand fields).
