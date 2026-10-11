# Tests: design-polish

## Run 1: rendered vertical slice (2026-10-09)

Briefs and rubric: `kb/briefs/polish/slice-test-briefs.md` (the two color pilot briefs, unchanged). Pages, lint and audit JSON, state sheets and screenshots: `kb/tests/design-polish/`.

**Method and clean-context note.** The "before" pages are the color pilot's with-skill pages, copied unchanged to `before/` (they passed the gate; Davon called them "not super special"). The "after" pages were rebuilt from them through design-director and the playbooks with design-polish applied; content and color tokens are unchanged, so the difference is polish. No subagent tool in this session: the same agent wrote the skill and the after pages. The before pages were written in an earlier session, so they are a fair baseline for the gain, not a clean without-skill run.

**Environment limits.** Exemplar hosts and font and image CDNs are blocked. Type is local Inter, Inter Display and the system serif (Charter/Bitstream Charter); imagery is CSS and inline SVG (the coffee bags). Exemplar comparison is from published team writing (Linear blog, Vercel Geist) and memory, not side by side pixels.

### Files
| File | What |
|---|---|
| `before/coffee-before.html`, `before/dashboard-before.html` | Baseline (color pilot with-skill pages) |
| `coffee-after.html`, `dashboard-after.html` | With design-polish |
| `coffee-states.html`, `dashboard-states.html` | State sheets: every control in every state; empty, loading and error panels for the dashboard. Built by `build-state-sheets.py` from the after pages' CSS |
| `*.lint.json`, `*.audit.json` | `tools/lint.mjs` and `skills/design-polish/assets/polish-audit.mjs` output |
| `shots/` | `{coffee,dashboard}-{before,after,states}-{390,1440}-{light,dark}.png` (24 files) |

### Lint (`node tools/lint.mjs`, final versions)
| Page | Result | Fails | Warns | Notes |
|---|---|---|---|---|
| coffee-before | PASS | 0 | 17 | 15 targets under 44 at 390, 2 axe needs-review (bag label) |
| coffee-after | PASS | 0 | 20 | 18 targets under 44 at 390 (nav, small buttons, card title links; all over 24), 2 axe needs-review (text on the gradient band and translucent header; judged below) |
| dashboard-before | PASS | 0 | 16 | |
| dashboard-after | PASS | 0 | 16 | 14 targets under 44 at 390, 2 axe needs-review (translucent sticky top bar) |
| coffee-states | PASS | 0 | 7 | |
| dashboard-states | PASS | 0 | 23 | |

Lint fails hit during the build and fixed (the loop working):
1. coffee-after round 1: `focus` fail on the three card title links. The ring sits on the card via `:has()`, three levels up, beyond what the lint inspects. Fixed by adding a second cue on the link itself (2px underline), which is better for users anyway.
2. State sheets round 1: axe `button-name` on both loading buttons. The skill said "label `visibility: hidden`", which removes the label from the accessibility tree. Skill corrected to `opacity: 0` (gap G4).
3. dashboard-states: horizontal overflow at 390 (grid track grew to the table's min-width) and `scrollable-region-focusable` on the skeleton table. Fixed.

### Polish audit (`polish-audit.mjs`, advisory)
| Page | Before | After |
|---|---|---|
| coffee | 0 fail, 12 warn: icon strokes 2px beside 1.23 to 1.41px stems (4), 7 headings unbalanced (3 at 1440, 4 more at 390), 1 untabular number | 0 fail, 3 warn: 8 distinct shadows (bag and thumbnail object shadows; accepted), a `:hover` box-shadow on the error input (false positive: it holds the error ring), 1 number |
| dashboard | 0 fail, 1 warn (heading orphan at 390) | 0 fail, 2 warn: alert icons are filled glyphs, stroke check does not apply (false positive) |

Audit fail hit during the build: dashboard-after round 1, `focus-shape` on the sidebar links (8px radius became 4px on focus). Cause: the skill's own recipe `a:not([class]):focus-visible { border-radius }` outranks `.nav a` (0,2,1 vs 0,1,1). Skill corrected to `:where(a:focus-visible)` (gap G2). The audit caught a bug that the lint, the critic and the author all missed.

### Judged items (FOUNDATIONS `[judged]` rows), after pages
| Item | Coffee | Dashboard |
|---|---|---|
| 2 Contrast axe could not decide | Band text on the light pool: lift color `#f7884a` is lighter than the brand, so near-black text rises above 5.28:1; dark pool `#4c1803` with warm 50 text above 14:1. Header: 86% opaque bg over content, text stays above 12:1 on the worst case (text under it) | Top bar 88% opaque bg; title and buttons unchanged contrast |
| 3 Non-text 3:1 | Inputs warm 500 3.20:1; focus rings orange 600 / 300; band CTA ring fixed (below) | Inputs slate 500 3.44:1 / 5.07:1; chart lines as pilot |
| 9 Focus ring 3:1 | **Was failing in the baseline**: band CTA ring used `currentColor`, measured 1.02:1 on the dark band and 2.83:1 on the light one. Found on the state sheet; now band text color, 15.25:1 and 5.28:1 | Inset rings in the sidebar, 2px teal |
| 11 Not color alone | Error: icon, text, inset second pixel; card focus: ring plus underline | As pilot; selected nav weight 600 plus fill |
| 13 Consistency | Radius census 4, 8, 12, 16, full only; one ring; icons 1.5px round caps beside 400 text (1.40px stems) | Radius 4, 8, 12, full; icons 1.5px round beside 500 labels (1.50px stems) |
| 14 Both themes | Dark elevation by surface step, ring and top highlight; no shadows; grain lifted to 18% on the dark band | Same recipe; tooltip uses popover ring plus highlight |
| 15 States | State sheet: primary, secondary, band CTA, input, card in rest, hover, pressed, focus, loading, done, unavailable with reason, error, success | State sheet: buttons, nav, search; KPI loading skeleton, empty table with two exits, chart error with retry, table loading rows |

Gate: **pass** on both after pages and both state sheets.

### Polish rubric (`slice-test-briefs.md`)
| # | Item | Coffee | Dashboard |
|---|---|---|---|
| 1 | Radius audit | pass (thumb flush to card takes its radius by clip) | pass |
| 2 | Depth audit | pass: card is one elevation token (pilot had border plus shadow plus fill), story section separated by surface only (pilot had borders too), all shadows fall down and are tinted warm, dark has none | pass: panels border only, tooltip popover token, no shadows in dark |
| 3 | States | pass (sheet) | pass (sheet; pressed was equal to hover in round 1, gap G5) |
| 4 | Icons | pass (2px to 1.5px, round caps, non-scaling) | pass (labels 400 to 500, round caps throughout; pilot mixed butt caps) |
| 5 | Text rendering | pass: balance, pretty, tabular, narrow no-break spaces in "12 kilo", "2,100 m", "340 g", `color-scheme`, selection, accent | pass: Inter Display on KPI values, balance, crisp gridlines (half-pixel y and crispEdges) |
| 6 | Edges | pass: sticky header plus `scroll-padding-top: 80px` | pass: sticky top bar, table reflows to a labelled list at 390 (playbook rule 6; the pilot scrolled sideways), scroll shadows and contained overscroll above 640, middle-truncated long path with full value in `title` |
| 7 | Surface | pass: stage lit from the top (3% OKLCH), bag with matte grain, side shading, crimp and valve, floor shadow; band light pool plus grain, no banding at 1440 dark | n/a (no large gradients by design) |

7 of 7 on both.

### Exemplar comparison (from published writing and memory; no pixels, see limits)
| Page | Nearest exemplars | Before | After | What is still missing |
|---|---|---|---|---|
| coffee | family.co, mercury.com, apple.com product pages | Clearly below | **Clearly below overall, close on craft details.** Controls, rings, cards, the band and the dark theme now look finished and consistent, and the bag reads as an object with light on it rather than a CSS rectangle. | Photography or a rendered product shot (CSS bag is still an illustration), a chosen display face (system Charter), a signature layout move, motion. These are art direction, typography and imagery; polish cannot supply them. |
| dashboard | Linear app, Stripe and Vercel dashboards | Close on color, clearly below on craft | **Close.** Quiet chrome, one ring, matched icons, designed empty, loading and error states, a phone list instead of a sideways table, crisp chart rules. | A real icon set (hand-drawn 16px glyphs), command palette and shortcut hints in menus, density toggle, a real date picker popover. Product and tool UI domain (planned). |

### Verdict
- **design-polish: pass.** Gate 100 percent on all four pages, polish rubric 7 of 7, and the after pages are clearly better than the before pages on craft, with evidence in the audit numbers, the state sheets and two gate-level bugs in the baseline (band focus ring 1.02:1; pressed equal to hover) that only the polish pass surfaced.
- **Against the exemplar bar:** dashboard close; coffee still clearly below because the bottleneck there is imagery, type and art direction. This matches Davon's ranking note: polish was necessary, not sufficient.
- **Recommend** a blind pair (coffee-before vs coffee-after, 1440 light; dashboard-before vs after, 390 dark) for Davon before v1.0.

### Gaps found and fixed in design-polish (rounds 1 and 2 of 3)
| # | Gap | Found by | Fix |
|---|---|---|---|
| G1 | `scrollbar-gutter: stable` on `html` left a 15px empty strip beside the full-bleed band and cut the top bar border short | screenshots, round 1 | 05, SKILL, tokens: scope to containers whose height changes |
| G2 | `a:not([class]):focus-visible` radius rule still outranks `.nav a` and squared the nav items | polish audit, round 1 | 01, SKILL, tokens: `:where(a:focus-visible)` |
| G3 | Scroll-shadow covers are square and poke out of a rounded panel's corners | screenshot zoom, round 1 | 05, SKILL: clip the panel (`overflow: clip`) |
| G4 | Loading label `visibility: hidden` deletes the accessible name | lint (axe button-name), round 2 | 01, 06, SKILL, tokens: `opacity: 0` |
| G5 | Secondary pressed equal to hover; band CTA ring `currentColor` at 1.02:1 | state sheet, round 2 | 01, 06, SKILL: pressed is a further step; ring uses band text color |
| G6 | Headings fine at 1440 orphaned a word at 390; audit only looked at 1440 | screenshot, round 1 | audit now checks headings at 390 |

Open (not polish): imagery, display type and art direction for the landing page; product UI depth for the dashboard.
