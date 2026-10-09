# Tests: design-typography

## Run 1: rendered slice, type pass on the pilot pages (2026-10-09)

Briefs and rubric: `kb/briefs/typography/06-type-without-web-fonts.md` (test briefs 1 to 3), on top of the color pilot briefs in `kb/briefs/color/slice-test-briefs.md`. Skills used: design-director, design-foundations, design-playbook-landing or -dashboard, design-typography (SKILL.md plus references 01, 02, 04, 05, 06, 07), design-color unchanged.

**Baseline.** The baseline is each design-color with-skill page (`kb/tests/design-color/coffee-with.html`, `dashboard-with.html`): the best pages the kb produced before this skill, which Davon ranked better but "not super special". Content and color tokens were kept, so differences come from type and the layout moves type needs. The same agent built baseline and new pages (no subagent tool in this session); the baseline was written in an earlier session.

**Network limit.** Font CDNs and exemplar hosts are blocked here. Fonts were self-hosted: Newsreader and Inter (both OFL) from the Fontsource npm packages, subset and axis-pinned with `skills/design-typography/assets/font_kit.py`, inlined as base64 (`kb/tests/design-typography/fonts/build.sh`). Body text on the coffee page is the visitor's system sans; in these screenshots that resolves to Inter (installed on this machine), on a Mac it is SF, on Windows Segoe UI. No exemplar screenshot could be rendered, so the comparison is from the judge's memory of those sites and says so.

### Files
- Pages: `kb/tests/design-typography/coffee-type.html`, `dashboard-type.html` (built from `*.src.html` with `fonts/inline.mjs`).
- Lint JSON: `coffee-type.lint.json`, `dashboard-type.lint.json`.
- Screenshots: `kb/tests/design-typography/shots/{coffee,dashboard}-type-{390,1440}-{light,dark}.png`. Copies of desktop light and phone dark in `/mnt/project-files/design-kb/wave/typography/`.

### Lint (`node tools/lint.mjs`)
| Page | Before (design-color with-skill) | After (this run) |
|---|---|---|
| Coffee | PASS, 0 fail, 17 warn | PASS, 0 fail, 21 warn (15 targets under 44px at 390, as before; 3 fluid display sizes, intended; 2 axe "review" on the illustrated bag, judged 5.28:1; 1 short line at 390 on the 31px manifesto) |
| Dashboard | PASS, 0 fail, 16 warn | PASS, 0 fail, 16 warn |

The lint passes both before and after, so it cannot see the type gain. It also missed real type defects in the baseline: straight apostrophes ("This week's", "can't"), a doubled list marker ("1. 01") in the roast steps, `66ch`-style measures that only pass because the lines were short. Proposed lint additions are in `kb/reviews/design-typography-pipeline-notes.md`.

### Judged gate (type checks from brief 06 plus the FOUNDATIONS `[judged]` rows)
| Check | Coffee | Dashboard |
|---|---|---|
| Real characters (’ “ ” – × U+202F) | Pass: curly apostrophes, × in the ledger, narrow no-break space in 2,100 m, 340 g, 12 kg | Pass: en dash date range with thin spaces, U+202F inside dates |
| Units keep their case | Pass after fix: the bag label first rendered "340 G" under `text-transform`; units now sit in `text-transform: none` | Pass: units muted, not uppercased |
| Tabular figures where numbers align or change | Pass: prices, ledger; display numerals proportional on purpose | Pass: KPIs, table, deltas, dates; global `tnum` removed from prose |
| No faux styles | Pass: `font-synthesis: none`, real roman and italic, italic fallback face added after the fallback render showed upright italics | Pass |
| Measure 45 to 75 at 1440 | Pass (`52ch` on body) | Pass |
| Fallback reflow (brief 06 test 3) | 0px in every section at 390 and 1440 with metric overrides; 75px shift at 1440 without them | 1px at 1440; 13px at 390 (one alert line rewraps on the Arial-metric fallback). Residual, reported, not hidden |
| Contrast, focus, one primary action, both themes | Pass; bag wordmark changed from warm 50 (3:1 at 20px) to warm 950 (5.28:1) after the axe review flag | Pass, unchanged from the color pilot |

Gate: **pass** on both pages.

### What changed, and the gain (side by side with the baseline screenshots in `kb/tests/design-color/shots/`)
**Coffee.** Baseline: a 61px fallback serif headline in a 7/12 column, small facts in 14px sans, a stock-looking card grid, a numbered three-column story. Now: a 49 to 112px Newsreader headline with the stress in its italic ("*roasted Tuesday*") as the hero image, optical margin corrected; tasting notes as an italic serif lead; facts as display numerals with muted units; the bag beside the headline, labelled in the page's own face; the $18 price at 61 to 152px on the orange band; a manifesto paragraph and a "What we paid" ledger replacing the generic steps grid; italic-ampersand wordmark at the foot. Font cost 44 KB.
**Dashboard.** Baseline: Inter (installed, not shipped), global `tnum` on prose, 31px KPIs with units at full size, "Jul 21 to Oct 12". Now: Inter self-hosted (27 KB) so figures align on every OS; KPIs at 39px with muted units ($, %, k); tabular figures only on numbers; paths in the mono stack with x-heights matched through `font-size-adjust` on `body`; real en dash range; button labels trimmed with `text-box`. The gain is real but small; this page's gaps are product UI, not type.

### Exemplar comparison (memory, not pixels)
| Page | Closest exemplars | Rating | Why |
|---|---|---|---|
| coffee-type | apple.com product pages, family.co, mercury.com | **Close on type, clearly below overall** | The type now carries the page the way Apple's product heroes and editorial features do: one dominant display moment, italic voice, numerals as graphics, calm body. With the logo hidden it reads as a specialty roaster. Still short: no photography (a CSS bag stands in), no motion, the shop cards remain a conventional three-up grid, and the hero would want a real product shot at Apple's level. Those belong to design-graphic, art direction and design-motion. |
| dashboard-type | Stripe Dashboard, Vercel Dashboard | **Close on type, clearly below on craft depth** | Numbers as typography now matches the Stripe Dashboard pattern (big tabular values, muted units, monospace identifiers). Remaining gaps are unchanged from the color pilot: icon set, density options, empty and loading states, command palette, table reflow at 390. |

### Verdict
- **design-typography: pass** for the type rubric on both briefs (gate 100 percent, close on type as voice, scale contrast and detail, clearly better than the baseline on type). Davon has not yet blind-ranked these; until he does, treat "close" as the judge's call.
- **Against the Jordan bar for the whole page: not yet**, for reasons outside this domain (imagery, art direction, product UI states).

### Gaps found by the rendered test, fixed in the skill
| # | Gap | Fix |
|---|---|---|
| T1 | Measure rule wrong: the skill said `34em` or about `60ch` and "em, not ch"; layout says `66ch`; FOUNDATIONS says `32em`. Measured: 66ch gives 81 to 86 characters in every face, 32em gives 61 to 77 depending on the face, 52ch gives 63 to 68 in every text face. | SKILL F6, expert move 2, procedure step 3; reference 01 rewritten with the table; reference 04. Contract change proposed in pipeline notes. |
| T2 | `font-size-adjust: ex-height from-font` on inline code is a no-op (resolves against the mono itself). Works when declared on the parent. | SKILL expert move 8, references 02 and 04. |
| T3 | No rule set for type without a font CDN. | New reference 06, `assets/font_kit.py`, decision rule in SKILL section 4. |
| T4 | Metric fallbacks cover the roman only; italics render upright on fallback. | Reference 06 rule 5 and move 4; `font_kit.py fallback --style italic`. |
| T5 | CDN-style font builds strip OpenType features the skill tells designers to use (`ss01`, `case`, `zero`). | SKILL move 19, references 03 and 06. |
| T6 | Caps labels uppercase unit symbols (`340 G`). | SKILL move 22, reference 07 move 7. |
| T7 | Nothing on making type carry a page with no photography. | New reference 07. |
| T8 | Display headings looked indented next to small labels (side bearings scale with size). | SKILL move 20, reference 07 move 4. |
| T9 | `font-weight: 350` on a static stack snaps to Light 300. | SKILL move 21, reference 06. |

Rounds used: 2 of 3 (critic round 1 failed the citation check on two unfetchable X posts; fixed; round 2 passed. Tester round 1 found T1, T2, T4, T6, T8 on rendered pages; fixed; round 2 rendered clean).

### Blind pairs for Davon
Three pairs in `kb/tests/design-typography/blind/` (instructions in `blind/README.md`), each the design-color pilot page against this run, order randomised (seed 7). Key: `kb/tests/design-typography/blind-key.md`.
