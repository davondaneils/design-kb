# Round 1: fixes written into the skills

Source: `RANKED.md` (the "Fix in this PR" column, "Above the gate" and "Tool defects"), the critic reviews `kb/reviews/benchmark-round1-landing.md` and `kb/reviews/benchmark-round1-app.md`, and the builders' skill-problem lists in `landing/BUILD_NOTES.md` and `app/BUILD_NOTES.md`. Editor-in-chief, 2026-10-13. Lint and claims-inventory code changes (`selected-state`, `reading-size`, the 35 floor in `measure`, closed `<details>`, `ZONE`) are a separate change by another contributor; the skill text below names those checks.

| RANKED item | File | What changed |
|---|---|---|
| 1 | `skills/design-playbook-dashboard/SKILL.md` | Done means 2: a post-action `?state=` URL for every primary action, rendered, linted and claim-checked; non-negotiable 10: true after the screen's own action |
| 1 | `skills/design-copy/references/02-ux-microcopy.md` | KPI and column labels true in every state ("People in this run") |
| 1 | `skills/design-product-ui/references/06-dashboards.md` | KPI labels true in every state; after commit the screen changes state everywhere |
| 1, 3, 5, 9, 12, 13, Both rows | `skills/design-director/SKILL.md` | New section 5 step 13, an 11-line hand-over list of checks on the renders, each naming its rule's home; critic is step 14 |
| 1 to 16 (FOUNDATIONS) | `kb/FOUNDATIONS.md` | v0.4.5 with change-log entry: zones, count noun no-break, 35 floor at 390, `reading-size`, borders at 3.3:1 on raised and tinted dark surfaces, selected states, post-action states, `--duration-page` 400ms, hover 100ms |
| FOUNDATIONS mirror | `skills/design-foundations/SKILL.md`, `references/tokens.md`, `references/fundamentals-checklist.md`, `CHANGELOG.md` | Mirrors v0.4.5 (rows 3, 5, 6, 16; color roles; content mechanics; motion) |
| 2 | `kb/FOUNDATIONS.md` Content mechanics, `skills/design-copy/references/06-copy-in-context.md` | A page with times in more than one zone labels every time, at every width; `ZONE` named |
| 3 | `skills/design-product-ui/SKILL.md` rule 14, `references/04-shells-density.md` fundamental 2 | A selected surface counts only at 3:1 against its neighbor, else +200 weight, a 3:1 border or a 2px indicator |
| 3 | `skills/design-foundations/references/accessibility.md` | 1.4.11 row names selected states and the 3.3:1 margin |
| 3 | `skills/design-color/references/ui-tokens-themes.md`, `skills/design-polish/SKILL.md` | Selected row of the states tables gets the number |
| 4 | `skills/design-color/SKILL.md` section 4, `references/ui-tokens-themes.md` States | Pressed moves away from disabled (delta E 15 or more), either direction on dark-ink fills; never `opacity` on a brand fill |
| 4 | `skills/design-polish/SKILL.md`, `references/01-interactive-states.md` | Same rule in fundamental 3, the states table and a dark-ink decision rule |
| 5 | `skills/design-product-ui/SKILL.md` rule 15 and core numbers | Contradiction resolved: 14px UI text on phones too (line 2 of a row); 12px only for headers and timestamps |
| 5 | `skills/design-typography/SKILL.md` F2 | 16px is the most common size on a marketing page; lint `reading-size` |
| 5, 9 | `skills/design-product-ui/references/01-tables.md` | Phone list item type sizes (line 2 at 14px) |
| 6 | `skills/design-typography/references/01-scale-measure-leading.md` | Phone floor 35 characters at 390, with the cause and the fix |
| 7 | `kb/FOUNDATIONS.md`, `skills/design-copy/SKILL.md` rule 16, `references/06-copy-in-context.md` fundamental 5 | Number plus count noun on the no-break list ("12&nbsp;people") |
| 8 | `skills/design-product-ui/references/06-dashboards.md`, `SKILL.md` dashboards rules | Review-and-commit screens: committed amount the single largest figure (39, counts 20), amount on the button, sticky commit on long pages |
| 8 | `skills/design-layout/references/05-page-composition-and-density.md` | KPI "largest text" rule gains the review-and-commit exception |
| 8 | `skills/design-playbook-dashboard/SKILL.md` | Loads design-conversion 04 ("the summary never leaves") for any money-commit screen; new non-negotiable 14 |
| 8 | `skills/design-copy/references/02-ux-microcopy.md` | The commit dialog's confirm button carries the amount |
| 9 | `skills/design-product-ui/references/01-tables.md` signature move 3, Do and don't; `SKILL.md` expert move 3 | Row link stretched over the row (`::after { inset: 0 }`) replaces "the target feels large" |
| 9 | `skills/design-product-ui/references/01-tables.md`, `SKILL.md` | Sticky header rule carries the round 1 evidence |
| 10 | `kb/FOUNDATIONS.md` Color roles, `skills/design-color/SKILL.md`, `references/ui-tokens-themes.md` | Borders measured on raised and tinted dark surfaces at 3.3:1; default dark `border-strong` on raised remapped to neutral-500 (4.65:1, was teaching 3.02:1) |
| 11 | `skills/design-layout/SKILL.md` gate rule 4 | Menu and drawer hit-area padding hangs outside the text edge |
| 11 | `skills/design-polish/references/01-interactive-states.md`, `skills/design-foundations/references/accessibility.md` | Never `min-block-size` on a class that can sit in a sentence |
| 12 | `skills/design-ux/SKILL.md` section 3, `references/02-navigation-ia.md` | Opened phone menu repeats the primary action; trigger reads "Close" with `aria-expanded` |
| 13 | `skills/design-product-ui/SKILL.md` core numbers, `references/06-dashboards.md` numbers, `skills/design-layout/references/04-responsive-and-adaptive.md` | KPIs 2x2 at 768 restated where builders read |
| 14 | `skills/design-layout/references/06-pacing-signature-and-phone-editing.md` move 8 | Contradiction resolved: tinted alert rows only inside the alert panel |
| 14 | `skills/design-product-ui/references/01-tables.md`, `SKILL.md` tables rules | Status in tables is a glyph plus a word, never a tinted row (Linear "Status colors") |
| Above: no ownable image | `skills/design-playbook-landing/references/signature-moves.md` | First-screen reject test: hide the logo, the motif is drawn in the first screen |
| Above: no ownable image | `skills/design-art-direction/SKILL.md` step 5, `skills/design-director/SKILL.md` step 11, `skills/design-playbook-landing/SKILL.md` Done 6 | Point at the reject test |
| Above: motion has no voice | `skills/design-motion/SKILL.md` moves 9 and 10, `references/03-choreography-transitions.md`, `references/07-motion-on-real-pages.md` fundamental 4 | Hero contradiction resolved for FOUNDATIONS: one hero reveal up to 800ms on the artifact, headline never fades from opacity 0 |
| Above: motion has no voice | `skills/design-motion/references/06-implementation.md`, `04-micro-interactions.md`, `SKILL.md` table | Native `<details>` animation with `::details-content` and `interpolate-size: allow-keywords`, off under reduce |
| Above: motion has no voice | `skills/design-playbook-landing/SKILL.md` load step 9 | The hero reveal plays on the artifact; no motion is not restraint |
| Above: dark is a remap | `skills/design-color/SKILL.md`, `references/ui-tokens-themes.md` | Dark retune: white-alpha hairlines (Linear `.05` to `.12`), low chroma on large brand fields |
| Above: tablet is a stretched phone | `skills/design-layout/references/04-responsive-and-adaptive.md`, `skills/design-playbook-landing/SKILL.md` Done 4 | Marketing tablet pattern for 640 to 1023 with a one-third empty-space check (opinion) |
| Above: commit dialog, rate lock | `skills/design-product-ui/references/05-states-bulk.md`, `SKILL.md` states rules | Commit dialog restates every open warning with its effect; time-boxed locks show the end time and a countdown |
| Above: FX direction (critic item 13) | `skills/design-copy/references/06-copy-in-context.md` | Comparison words agree with the direction of the number beside them |
| Above: FAQ hover dims (critic item 17) | `skills/design-color/references/ui-tokens-themes.md`, `skills/design-polish/SKILL.md`, `references/01-interactive-states.md` | Hover adds emphasis, never lowers text contrast |
| Tool defects: hover 150 vs 100 | `skills/design-polish/SKILL.md`, `references/01-interactive-states.md` | Hover is `--motion-hover` 100ms; examples updated |
| Tool defects: `--duration-page` 600 vs 400 | `kb/FOUNDATIONS.md`, `skills/design-motion/references/07-motion-on-real-pages.md`, `02-timing-easing.md`, `SKILL.md`, `assets/motion-tokens.css` | Token is 400ms; 600ms is the ceiling, 800ms the one hero reveal |
| Tool defects: content width 1280 vs 1136 | `skills/design-layout/references/06-pacing-signature-and-phone-editing.md` | Content box `min(1280px, 100% - 2 * var(--space-7))`, as SKILL and reference 01 |
| Tool defects: container queries em vs rem | `skills/design-frontend/SKILL.md`, `references/02-modern-css.md`, `06-design-to-code.md`, `07-measured-build-quality.md` | Breakpoints in rem with range syntax in media and container queries |
| Tool defects: `none` in shadow tokens | `skills/design-polish/assets/polish-tokens.css`, `SKILL.md` | `0 0 0 0 transparent`; dark popover and modal use `--highlight` |
| Tool defects: typography duplicate item 6 | `skills/design-typography/SKILL.md` section 6 | Merged into one Loading item, renumbered |
| Builder notes: display-2 76 vs 80 | `skills/design-typography/references/07-type-led-pages.md` | `--text-display-2` 39 to 80px, as FOUNDATIONS |
| Builder notes: font_kit | `skills/design-typography/assets/font_kit.py`, `references/06-type-without-web-fonts.md` | Rupee in `LATIN_CORE`; `--family` does not rename the name table; adding a glyph from latin-ext with `unicode-range` |
| Builder notes: role names drift | `skills/design-color/references/ui-tokens-themes.md` | `-active` not `-pressed`; role list adds `surface-sunken`, `text-muted-on-tint`, `border-strong` |
| Builder notes: muted text on state layers | `kb/FOUNDATIONS.md`, `skills/design-foundations/references/tokens.md` | `text-muted-on-tint` covers hover, pressed and selected layers |
| Version | `skills/design-foundations/SKILL.md`, `references/tokens.md`, `references/fundamentals-checklist.md` | v0.4.4 citations moved to v0.4.5 (`tools/lint.mjs` line 2 still says v0.4.4; left to its owner) |
| All touched skills | each `CHANGELOG.md` | Dated 2026-10-13 entry |
