# Review: design-polish v0.1 (critic)

Reviewed: `skills/design-polish/SKILL.md`, `references/01` to `06`, `assets/polish-tokens.css`, `assets/polish-audit.mjs`, against `kb/research/polish/*`, `kb/FOUNDATIONS.md` v0.2, design-foundations, design-color, design-layout, design-typography, design-motion and design-ux. Date 2026-10-09.

**Clean-context note.** This session had no subagent tool; the same agent wrote the drafts and this review. The citation re-fetch below is independent evidence; the rest is a self-review held to the agent file's checklist and should be repeated by a fresh critic before v1.0.

## Verdict
Round 1: **revise** (4 fixes, all applied below). Round 2, after the tester's gaps (see `kb/tests/design-polish.md`): **approve**.

## Citation spot check (before step 1)
Method: every claim row in `kb/research/polish/01` to `05` (84 rows, derived measurement rows included) listed in file order, then `random.seed(20261009); random.sample(rows, 17)` in Python (20 percent, rounded). Each URL re-fetched with WebFetch on 2026-10-09 and the quote checked word for word.

| Row | URL | Result |
|---|---|---|
| 01 S11 | flutter.googlesource.com ... gen_defaults/data/state.json | pass: hover 0.08, focus 0.1, pressed 0.1, dragged 0.16 |
| 01 S13 | carbondesignsystem.com/patterns/disabled-states/ | pass |
| 01 S18 | developer.mozilla.org/.../CSS/outline | pass (border-radius is code-formatted in source) |
| 02 D1 | joshwcomeau.com/css/designing-shadows/ | pass |
| 02 D2 | same | pass |
| 02 D6 | tailwindcss.com/docs/box-shadow | pass |
| 02 D10 | radix-ui.com/colors/docs/palette-composition/understanding-the-scale | pass ("6" code-formatted) |
| 02 D15 | developer.mozilla.org/.../@media/forced-colors | pass |
| 02 D19 | v5.framework7.io/docs/hairlines | pass |
| 02 D20 | developer.mozilla.org/.../Window/devicePixelRatio | pass |
| 03 R4 | developer.apple.com HIG sf-symbols (JSON) | pass |
| 03 R14 | linear.app/now/how-we-redesigned-the-linear-ui | pass |
| 04 T8 | developer.mozilla.org/.../CSS/text-rendering | pass |
| 04 T12 | linear.app/now/how-we-redesigned-the-linear-ui | pass |
| 05 E4 | developer.mozilla.org/.../CSS/overscroll-behavior | pass |
| 05 E5 | w3.org/WAI/WCAG22/Understanding/focus-not-obscured-minimum.html | pass |
| 05 E10 | nngroup.com/articles/empty-state-interface-design/ | pass |

17 of 17 pass. Batch accepted. Derived rows: `measure.mjs`, `hairline.mjs` and `svg-line.mjs` re-run; outputs match the committed `*-output.txt` files.

## 1. Fundamentals gate
| Check | Round 1 | After fixes |
|---|---|---|
| Numbers re-derived | Pass. Alpha border contrasts (1.14 to 1.45:1, 3.36:1 at 45%), Inter stem ratios, hairline rows, SVG line rows all match script output. The 25% teal ring at 1.4:1 recomputed by hand: composite rgb(192, 222, 220), 1.42:1. | Pass |
| Accessibility agrees with design-foundations | Pass: 2px ring and 2px offset, 3:1, 24 and 44 targets, reduced motion, forced colors. | Pass |
| Rule correctness | **Fail.** Fundamental "the focus rule never changes the element's shape" was wrong as written: the audit showed rounding a transparent link's ring is harmless, and the real bug is source-order dependent. | Pass: rule rewritten (anything that paints; global rule ties `.btn` on specificity; scope to `a:not([class])`) |
| Opinion labelled | **Fail.** "Never transition the ring in" stated as fact with no source. | Pass: labelled opinion in SKILL.md and 01 |
| Em dashes | Two research quotes carried the source's own em dashes (Apple, Vercel). | Pass: replaced with `[dash]` and noted |

## 2. Claims vs research
- Shadow recipes: correctly labelled opinion built on Comeau and Tailwind. Keep.
- "Inter Display at 25px and up": the 25px threshold is ours (opinion); Linear only says headings. Labelled in 04 via "opinion" on the Linear pattern line; acceptable.
- Grain values: baseFrequency 0.85 and opacities are ours, source demo uses .97. Labelled opinion (fixed during drafting).
- Material 38% and 12% disabled values: taken from design-color, not re-verified in this domain (stated in research 01).

## 3. Contradictions
- design-color `ui-tokens-themes.md` lists Material focus and pressed overlays at 12%; Material 3 tokens are 10% (verified). Not ours to edit: pipeline notes.
- design-color disabled row (neutral-400 text) vs polish (muted label). Not a contradiction (disabled is exempt); polish prefers the more legible option. Pipeline notes suggest aligning.
- FOUNDATIONS names design-layout as owner of shadow recipes; layout has none. Pipeline notes propose moving the recipes into FOUNDATIONS or naming design-polish.

## 4. Gaps (round 1)
- **Fixed:** `:active` declared before `:hover` never shows (LVHA order, MDN). Added to 01 decision rules and SKILL fundamental 3.
- **Fixed:** removing `-webkit-tap-highlight-color` without a pressed state leaves touch users without feedback (MDN). Added to 01.
- Open, sent to the tester: does the state sheet method scale to a real page without bloating it? (Answered in the test: state sheets are separate files.)

## 5. Expert bar
Things a strong generalist does not know and the skill carries with numbers: `border: 0.5px` renders as 1 CSS px in Chromium; SVG 1px rules on integer y blur at 1x; Inter stem ratios per weight and the icon stroke table; soft glow focus rings fail 1.4.11 (1.4:1); alpha borders cannot be input edges (45% needed); the global focus radius specificity trap; second pixel as inset shadow; LVHA for pressed states; tinted shadows; top highlight as dark elevation. Nod-along material (focus visible, one radius family) is kept because it is the gate.

## 6. Vague, dated, filler
- SKILL.md 116 lines, under the 300 cap. References stand alone.
- Checklist item 28 (squint test) is generic; kept as the last-look item, labelled opinion.

## Round 2 (after tester)
Re-read after the tester's rendered run. `kb/tests/design-polish.md` lists gaps G1 to G6, all found by rendering, linting or the audit, none by reading:
| Gap | Change checked in the skill |
|---|---|
| G1 `scrollbar-gutter` on the root left a strip beside full-bleed bands | 05, SKILL edges table, tokens: scoped to containers whose height changes |
| G2 `a:not([class])` focus radius outranked `.nav a` | 01, SKILL, tokens: `:where(a:focus-visible)` |
| G3 square scroll-shadow covers inside a rounded panel | 05, SKILL: clip the panel |
| G4 `visibility: hidden` loading label deleted the accessible name | 01, 06, SKILL, tokens: `opacity: 0` |
| G5 pressed equal to hover; band ring `currentColor` at 1.02:1 | 01, 06, SKILL: pressed is a further step; ring uses band text color |
| G6 headings orphaned at 390 only | audit checks 390 and 1440; checklist item 19 |

Each fix is stated as a rule with the failure it prevents, so it carries to new pages. Drafts and references are identical. Verdict: **approve**.
