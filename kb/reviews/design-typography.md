# Review: design-typography v0.2 (critic, 2026-10-09)

**Verdict: approve after fixes** (round 1 revise, round 2 approve). Scope: the whole skill, plus new reference 06 (type without a font CDN), reference 07 (type-led pages), `assets/font_kit.py`, and the measure rule.

## Citation spot check
Method: all unique URLs in `kb/research/typography/01` to `05` (50), `random.seed(20261009)`, `random.sample(urls, 10)` (20 percent). Re-fetched 2026-10-09.

| # | URL | Claim checked | Result |
|---|---|---|---|
| 1 | w3.org/WAI/WCAG22/Understanding/text-spacing | 1.5, 2, 0.12, 0.16 x font size | Confirmed, verbatim |
| 2 | developer.mozilla.org .../Guides/Fonts/Variable_fonts | registered axes to properties; redeclare every axis; custom axes uppercase; `font-weight` range in `@font-face` | Confirmed |
| 3 | practicaltypography.com/summary-of-key-rules.html | 15 to 25px web, 120 to 145%, 45 to 90 characters, 5 to 12% caps spacing, bold or italic not together | Confirmed, verbatim |
| 4 | developer.apple.com HIG typography | Body 17/22, Headline 17/22 semibold, Title 2 22/28, Caption 2 11/13; avoid light weights; iOS default 17, min 11 | Confirmed |
| 5 | fonts.google.com/knowledge ... superfamily | "shared consistency across every variation" | Confirmed |
| 6 | chriscoyier.net ... hanging-punctuation | Safari only | Confirmed (a commenter's line, reported by the author) |
| 7 | x.com/sorenblank/status/2028520200417706017 | tabular-nums default | **Not fetchable** (robots disallowed) |
| 8 | x.com/wesbos/status/1380612489201717254 | tabular numbers | **Not fetchable** (robots disallowed) |
| 9 | w3.org/WAI/WCAG22/Understanding/resize-text | 200 percent without loss | Confirmed |
| 10 | webkit.org/blog/16547 | WebKit whole paragraph, Chromium last four lines, no balance on long passages | Confirmed, verbatim |

Round 1: **batch fails** (7 and 8 cannot be confirmed). Sent back to the researcher. Fix: research 04 claim 9 and 05 claim 5 now rest on MDN font-variant-numeric (re-fetched, quote recorded); the X posts are listed as leads, not support. Reference 05 reworded to cite MDN and label the "default for changing numbers" practice as opinion.
Round 2: re-fetched MDN font-variant-numeric (confirmed) plus 3 of the new research 06 citations: Microsoft Learn Segoe UI Variable sentence (verbatim), MDN `@font-face` src "user agents may ignore user-installed fonts" (verbatim), caniuse `ui-serif` Safari-only (confirmed). **Pass.**

## Fundamentals gate
| Area | Result |
|---|---|
| Measure rule | **Fail in v0.1**: "Start at `max-width: 34em` (about 66 characters)" and "measure in em, not ch" are wrong for most faces. Measured (research 06 M1): 34em gives 66 to 83, 66ch gives 81 to 86, 52ch gives 63 to 68. Fixed. |
| `font-size-adjust: from-font` | **Fail in v0.1**: "on inline code" is a no-op (M4). Fixed in SKILL, 02, 04. |
| Citations | Fail round 1 (X posts); fixed. |
| Accessibility, contrast, headings, zoom, text spacing | Pass. Reference 07 keeps the CTA-in-first-screen rule, `aria-hidden` on decorative wordmarks, 4.5:1 on brand fills. |
| FOUNDATIONS conformance | Display leading 0.95 and the display ramp above `--text-5xl` are taught deviations (F5, reference 07), within the contract's "skills may teach when to deviate" and the lint's fluid display allowance. `52ch` conflicts with FOUNDATIONS `32em` and design-layout `66ch`; both proposed for change in `design-typography-pipeline-notes.md`, not edited here. |
| Em dashes | None (grep U+2014 on every changed file). |

## Expert bar
New material a top type director would not already have written down: measured CPL per unit across eight faces; axis pinning as the main size lever (132 to 21 KB); CDN builds stripping 33 of 40 Inter features; `from-font` resolving where declared; italic metric fallbacks; side bearings at display size with the correction; static weight snapping on 350; units under caps labels. Reference 07 is opinion and says so; its moves are concrete and were tested on a render. Pass.

## Fix list (round 1)
| # | File | Change | Status |
|---|---|---|---|
| 1 | SKILL.md F6, move 2, step 3; references 01, 04 | Measure rule to `52ch` with the measured table | Done |
| 2 | SKILL.md move 8; references 02, 04 | `from-font` on the parent, measured | Done |
| 3 | research 04, 05; reference 05 | Replace unfetchable X support with MDN | Done (researcher) |
| 4 | SKILL.md section 4, map; references 03, 06; assets | No-CDN rule set and tool | Done |
| 5 | reference 06 | Label the "resolves to" column as inferred from stack order | Done |
| 6 | SKILL.md F5 | Name the display leading deviation and point to 07 | Done |
| 7 | reference 07 | Mark the moves as opinion, tested on renders, exemplars unmeasured | Done |

---

# Review: design-typography v0.1 (critic, earlier round, kept for history)

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
