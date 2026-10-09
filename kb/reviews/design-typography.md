# Review: design-typography v0.1 (critic)

**Verdict: revise, then approve.** All fixes below were applied before testing (status column).

## Fundamentals gate check
| Area | Result |
|---|---|
| Correctness against sources | Pass after fixes 1, 2, 6, 7 |
| Accessibility (WCAG 1.3.1, 1.4.3, 1.4.4, 1.4.8, 1.4.12, iOS zoom) | Pass |
| Consistency with FOUNDATIONS.md (tokens, 1.25 scale, 1.5 body, 1.1 to 1.25 headings, 4px grid, measure) | Fail before fix 1 (line heights 30 on a "4px grid" column); pass after |
| Hierarchy and clarity of the skill itself | Pass; SKILL.md leads with the gate, then defaults, procedure, expert moves |
| Em dashes | None found (grep U+2014) |

## Expert-depth check ("would the best person in the field learn something?")
Non-obvious moves present and sourced: `ch` vs em measure error; metric-matched fallbacks; opsz px vs pt mapping (CSSWG thread); GRAD instead of wght for dark mode and hover; text-box trim; Chromium vs WebKit `pretty` difference; OFL subsetting and Reserved Font Names; letter spacing disabling ligatures; `system-ui` metric differences across OSes; NN/g condensed-glance penalty applied to sports numbers. A senior type director would still nod at the basics but would find at least five of these useful. Pass.

## Fix list
| # | File | Change | Status |
|---|---|---|---|
| 1 | SKILL.md section 2; references/01 table | Line height column mixed 4px-grid UI values with prose values (30 for 20px, 28 to 30 for 25px). Split into "UI line height (4px grid)" and "Prose (unitless 1.5)"; set `--text-xl` heading to 28. | Done |
| 2 | references/05 | `font-kerning` default is `auto`, which lets browsers skip kerning (MDN); the draft called `normal` the default. State: set `font-kerning: normal` explicitly. | Done |
| 3 | references/05 character table | Ranges were written as "10 to 20", which hides the very character being taught. Show the real en dash (10–20, 3–2). | Done |
| 4 | references/03 subsetting | The Latin `unicode-range` string was presented as Google's exact subset; Google's list changes. Say "copy the current latin block from the Google Fonts CSS response", keep the must-keep characters list. | Done |
| 5 | references/05 caps | Screen reader claim about typed caps stated too strongly. Mark as opinion; lead with the reusability reason. | Done |
| 6 | SKILL.md F15, expert move 5; references/02 | "No light weights below 24px" and "drop wght about 50" are our thresholds, not Apple's. Label as opinion; cite HIG only for "avoid light weights". | Done |
| 7 | SKILL.md expert move 2 | "72 to 80 characters" for 66ch is an estimate from the ch definition; label it as an estimate to verify per font. | Done |
| 8 | references/01, 02 | Gap: non-Latin scripts only in SKILL.md. Add script notes (line height, no letter spacing for connected scripts, native script faces, WCAG 1.4.12 script exception). | Done |
| 9 | references/01 | Gap: Android `sp` scales with user font size; say to always use sp for text and test at 200% font scale. | Done |
| 10 | references/05 | Gap: superscripts and footnote markers break line spacing. Add `sup, sub { line-height: 0; }` or `font-variant-position`. | Done |
| 11 | references/01 worked example 1 | Conversational "14px? No:" phrasing is filler. Rewrite as a decision. | Done |
| 12 | references/02 hockey example | "Slashed zero off since scores have no letter O" is noise. Remove. | Done |
| 13 | references/02 fintech example | "system-ui renders different widths" is reasoning, not a cited fact. Mark as opinion with the mechanism (different fonts per OS). | Done |

## Contradictions with other skills
None possible to check yet (parallel build). Risk noted for design-color: muted text must be a token at 4.5:1, never opacity. Risk for design-layout: section spacing examples use `--space-48` and `--space-16`, consistent with the foundation scale.
