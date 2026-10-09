# Tests: design-color

## Run 2: rendered vertical slice (2026-10-09)

Briefs and rubric: `kb/briefs/color/slice-test-briefs.md` (editor-in-chief). Skills used for the with-skill pages: design-director, design-color, `kb/FOUNDATIONS.md` v0.2 defaults for layout and type, and the dataviz skill for the chart (routed by the director). Pages, lint JSON and screenshots: `kb/tests/design-color/`.

**Clean-context note.** This session had no subagent tool, so the same agent wrote all four pages. The two without-skill pages were written first, before the with-skill work, in the style of a strong generic answer (common Tailwind-like values, hex colors, no contrast tool), but by an agent that had already read the skill earlier in the session. Treat the without-skill pages as a fair stand-in, not a clean baseline. Re-run them with a fresh subagent that cannot read `skills/` before v1.0.

### Lint results (`node tools/lint.mjs`, final versions)

| Page | Result | axe (WCAG 2.2 AA) | targets | measure | type scale | spacing | overflow | focus | motion |
|---|---|---|---|---|---|---|---|---|---|
| `coffee-without.html` | **FAIL** (123 fail, 19 warn) | 15 fail: white on brand orange 3.04:1 on every button, orange outline button 2.88:1, `#777` on cream 4.25:1 | 15 fail (nav and footer links under 24px tall) | 1 fail | 16 fail (13, 15, 17, 18, 22, 36, 40, 48, 56px) | 75 fail (20, 30, 40, 60, 80px) | pass | pass (18 warn: browser default 1px ring) | fail (card lift, no reduced-motion rule) |
| `coffee-with.html` | **PASS** (0 fail, 17 warn) | pass (2 warn: bag label, judged 14.9:1 and 4.95:1) | pass (15 warn under 44px at 390) | pass | pass | pass | pass | pass | pass |
| `dashboard-without.html` | **FAIL** (64 fail, 9 warn) | 18 fail: `#94a3b8` labels 2.56:1, green deltas 2.27:1, red 3.76:1, white on teal nav 2.48:1, dark labels 3.07:1 | pass | pass | 6 fail (13, 22, 28px) | 40 fail (10, 14, 20, 30px) | pass | pass (8 warn) | pass |
| `dashboard-with.html` | **PASS** (0 fail, 16 warn) | pass (2 warn: SVG axis text, judged 5.29:1 light, 9.65:1 dark) | pass (14 warn under 44px at 390) | pass | pass | pass | pass | pass | pass |

Lint fails caught on the with-skill pages during the build, and fixed (the self-critique loop working):
1. Muted text on the hero image stage (warm 600 on warm 100) at 4.38:1. Traced to a fundamentals error in the skill (see gaps, G1).
2. "How we roast" step text at 24 to 27 characters per line in a 3 column grid inside an 8/12 column. Relaid out at full width.
3. Dashboard: `<li role=alert>` invalid list; table link "/" only 5px wide; input with 1px UA padding; page overflow at 390 from a grid track that would not shrink; SVG chart axis text rendering at 6px on phones (scaled viewBox). The last one was invisible to the lint until a check was added (tools section below).

### Judged items (`[judged]` rows of the checklist), with-skill pages
| Item | Coffee | Dashboard |
|---|---|---|
| Non-text contrast 3:1 | Input border warm 500 3.20:1 on bg, 5.10:1 dark; focus ring orange 600 / 300 | Input border slate 500 3.44:1 / 5.07:1; chart lines teal 700 and gray 500 at 3:1+ in both themes |
| Not color alone | Error has icon, text, 2px border, `aria-invalid`; links underlined | Deltas have arrow, sign, the word "worse" on churn; alerts have icon and "Error:" / "Warning:"; benchmark line dashed and labelled |
| One primary action | Subscription (orange 600 pill in hero, the one big CTA in the band); cards use secondary buttons | "Share report" only |
| Consistency | One radius family (pill controls, 12px cards, 16px stage), one serif plus Inter | 8px controls, 12px panels, one icon stroke weight |
| Both themes designed | Dark is a remap: warm 990/975/950 surfaces, orange 300 accents, band drops to orange 950, brand orange returns as the band CTA | Brand teal returns exact as the dark primary fill with a near-black label (7.54:1); quiet status tints |
| States | Hover, focus, error shown; no loading state (not needed) | Hover rows, hover chart crosshair and tooltip, selected nav; empty and loading states not built (gap for design-ux) |

All hold. Gate: **pass** on both with-skill pages. Both without-skill pages fail the gate on lint alone.

### Exemplar comparison
**Limit: no exemplar screenshot could be rendered.** The environment's egress policy denied every exemplar host (see `kb/exemplars.md`). WebFetch returns text only. The comparison below is from the judge's memory of those sites' public pages, not side by side pixels, and must be repeated with real screenshots.

| Page | Nearest exemplar | Rating | Why |
|---|---|---|---|
| coffee-with | family.co, mercury.com (restraint, warmth) | **Clearly below** | Color is close: neutrals carry the page, one orange moment per view, a designed dark mode. The gap is outside color: no photography or real product imagery (a CSS bag stands in), a fallback serif instead of a commissioned or licensed face, no motion, a conventional section stack with no signature layout move. A top studio would not ship the hero as is. |
| dashboard-with | Vercel and Linear dashboards (from memory) | **Close** on color and layout discipline, **clearly below** on craft depth | Quiet neutral chrome, one accent, status colors kept apart from brand, a calm KPI strip, a chart with a real benchmark. Missing: real icon set, density options, empty and loading states, keyboard shortcut layer, table that reflows on phones instead of scrolling. |
| coffee-without | | Far below | Template look: brand orange on everything (buttons, eyebrow, pills, step circles, price), white labels that fail contrast, dark mode that keeps the light-mode orange and inverts surfaces. |
| dashboard-without | | Clearly below | Competent layout, but failing gray labels, colored deltas without words, a dark slab sidebar that fights the content, teal used for nav, bars and chart alike. |

### Verdict
- **design-color inside a page: pass on the color rubric** (items 3 and 5: restraint, dark mode, roles, contrast) and clearly better than the without-skill pages, with zero lint fails against 123 and 64.
- **Against the exemplar bar: not yet.** The dashboard rates close on color; the landing page rates clearly below because of imagery, typography and art direction, which are other domains. This is the pilot's main finding: color is not the bottleneck; layout, typography and graphic (art direction, imagery) are. The director routed to them, but they are not on this branch.
- **Ship decision: hold at testing.** design-color moves to v0.2 with the fixes below. It does not ship until Davon's blind ranking agrees with this judge and the exemplar comparison is redone with real screenshots.

### Gaps found and fixed in design-color (2 rounds of 3)
| # | Gap | Fix |
|---|---|---|
| G1 | **Fundamentals error**: "five steps apart passes body text" was off by one. 600 on 100 measures 4.37 to 4.39:1 on every hue. Six positions apart is the true body text rule (worst 4.64:1), five apart passes 3:1 (worst 3.01:1). The text-only test and the critic both missed it; the rendered page caught it. | SKILL.md core numbers and `references/palette-building.md`, with the measurement method. New decision rule: muted text on tinted surfaces uses 700. |
| G2 | Dark `*-subtle` status backgrounds at the 950 step (chroma .05 to .1) glow on near-black. | Low-chroma tint at L .25, chroma .03 to .035. SKILL.md and `references/ui-tokens-themes.md`. |
| G3 | No rule for a light brand color in dark mode. | Decision rule: it can return exact as the dark primary fill with a near-black label. |
| G4 | No rule for full-bleed brand bands in dark mode. | Decision rule: drop the band to the 950 step; the exact brand color returns as the one bright fill. |
| G5 | Chart series against a gray benchmark: teal 500 vs gray 500 measured deutan Delta E 0.3 (dataviz validator). | Decision rule: separate by at least .15 lightness, dash and label the benchmark. |

Open gaps for other stages: page level art direction and imagery (design-graphic), type pairing without web fonts (design-typography), empty and loading states (design-ux), responsive tables (design-layout or design-frontend).

### Tooling changes made during this run
- `tools/lint.mjs` now checks SVG text at its rendered size (min 12px), counts `:focus-within` rings on a wrapper as visible focus, and measures real characters per line by grouping words per rendered line.
- Measured in the lint: `max-width: 66ch` renders about 80 characters in Inter; FOUNDATIONS v0.2 now defaults to `32em`.

### Screenshots
`kb/tests/design-color/shots/{coffee,dashboard}-{with,without}-{390,1440}-{light,dark}.png` (16 files).

### Blind ranking for Davon
Three pairs in `kb/tests/design-color/blind/` (`pair-1-A.png` to `pair-3-B.png`, instructions in `blind/README.md`). Key in `kb/tests/design-color/blind-key.md`, kept outside the folder. If Davon's picks disagree with this judge on any pair, fix the judge before scaling (editor-in-chief).

---

## Run 1: text-only test (v0.1, 2026-10-09)

Kept for history. Superseded by run 2: it judged prose, not pixels, and the rubric came from the skill itself.


Tester run, 2026-10-09. Rubric from CLAUDE.md quality bar and `.claude/agents/tester.md`.

**Honesty note.** The same agent wrote both answers and had already read the skill. To limit leakage, each "without" answer was written first, as a strong generic assistant would answer: competent, sensible, no contrast tool, no ladder, no APCA cross-check. All numbers in the "with" answers were measured with `assets/oklch_scale.py`; numbers quoted against the "without" answers were measured afterwards, for scoring only. A fresh agent without the skill should repeat the "without" runs before v1.0.

**Rubric.** Fundamentals gate (pass/fail): correctness, contrast and accessibility, hierarchy, consistency, clarity. Then 1 to 5 on: Specificity, Expert layer, Fit to brief, Studio-ship ("would a top studio ship this as is"). Pass = with-skill passes the gate and scores 4+ on every criterion and clearly beats without.

None of the three briefs is one of the skill's own worked examples.

---

## Brief 1: Coffee roaster site, brand orange, with dark mode
"I'm building a site for a specialty coffee roaster. Their brand orange is #F26B21. I need a full palette for the site (shop, blog, subscription signup) and a dark mode."

### Without the skill
Palette: primary orange `#F26B21` for buttons and links; background cream `#FFF8F0`; text espresso `#3E2723`; secondary latte `#C8A27A`; accent sage `#7A9E7E` for success. Buttons: orange with white text, darker orange on hover. Links in orange. Dark mode: background `#121212`, cards `#1E1E1E`, text `#EDEDED`, keep orange for buttons and links so the brand carries over. "Make sure your text meets WCAG AA (4.5:1)."

### With the skill
1. Read the brand: `#F26B21` = oklch(68.4% 0.184 44.4). L .68 is above the 0.55 line, so it cannot be small text on white, and white labels on it are 3.04:1 (fail for 16px labels).
2. Ramps: orange hue 45, chroma 0.19, `--shift -10` (dark steps lean red so they read rust, not mud). Neutrals warm, hue 55, chroma 0.012, `--neutral` (opinion: warm paper suits coffee).
3. Roles (light / dark):
   - `bg` neutral-50 `#f7f6f6` / neutral-990 `#131110`; `surface` white / neutral-975 `#1b1917`; `surface-raised` white plus shadow / neutral-950 `#24211f`.
   - `text` neutral-900 / neutral-50; `text-muted` neutral-600 `#726a65` (5.30:1 on white) / neutral-300.
   - `primary` orange-600 `#b14500` with white label (5.64:1, APCA Lc 83) in both themes; hover orange-700 `#933701` (7.53:1).
   - `accent` links: orange-600 underlined (light) / orange-300 `#ffa97e` underlined (dark, 10.07:1, Lc 67). Not brand orange in dark mode: it passes WCAG at 6.19:1 but scores only Lc 45.
   - `--color-brand` `#F26B21` kept exact for logo, illustration, section rules and headlines at `--text-2xl` (31px) and up (3.04:1 on white passes the large text line, narrowly; check on the cream tints too).
   - `success` green-600, `danger` red-600 shifted to crimson (hue about 20 to 25) so errors never look like the brand.
   - `focus-ring` orange-600 (light), orange-300 (dark), 2px, 2px offset.
4. Optional loud CTA for the subscription hero: brand orange fill with neutral-950 label (5.26:1). Passes WCAG, but APCA scores it Lc 45, so use it only with a 20px bold label (`--text-lg` bold).
5. Proportion: neutrals dominate; orange marks actions and one hero moment per page.
6. Checklist run: every text role on every surface, both themes, all pass 4.5:1; borders (neutral-500 / neutral-600) pass 3:1.

### Scores
| Criterion | Without | With |
|---|---|---|
| Fundamentals gate | **Fail**: white on `#F26B21` 3.04:1 for button labels; orange links on cream 2.89:1; no states beyond hover; no non-color link cue | Pass |
| Specificity | 3 | 5 |
| Expert layer | 1 | 5 |
| Fit to brief | 3 | 5 |
| Studio-ship | 1 | 4 |

Notes: the with-skill answer chose rust (600) for small CTAs, which the client may resist. The skill gives the loud option with its trade-off, which is what a studio would do. Studio-ship 4 not 5: it should show the hero mock, which text cannot.

---

## Brief 2: Audit an existing UI
"Can you review the colors in my app? Light mode: placeholder text #9CA3AF on white inputs, secondary text #64748B on #F1F5F9 panels, errors are shown with a #EF4444 border. Dark mode: background #0F172A, links #3B82F6, secondary text #94A3B8."

### Without the skill
- Placeholder `#9CA3AF` is light; placeholders are often exempt as hints, but consider darkening to `#6B7280` for readability.
- `#64748B` on `#F1F5F9` looks fine; slate gray is a standard secondary color.
- Error border: add an error message and icon so it does not rely on color alone.
- Dark mode: `#3B82F6` links on `#0F172A` have good contrast; `#94A3B8` secondary text is fine.

### With the skill
| Pair | WCAG | Verdict | Fix |
|---|---|---|---|
| Placeholder `#9CA3AF` on white | 2.54:1 | **Fails 1.4.3.** Placeholders are not exempt ("applies to ... placeholder text") | `#6B7280` (4.83:1) and keep a visible label above the field |
| `#64748B` on `#F1F5F9` | 4.34:1 | **Fails** body text (no rounding) | Use slate-600 `#475569` (6.92:1 on the panel), or keep `#64748B` only on white (4.76:1) |
| Error `#EF4444` border | 3.76:1 | Border passes 3:1 (1.4.11) but color alone (1.4.1) fails | Add icon and message; error text in red-600 class (`#DC2626`, 4.83:1) |
| Links `#3B82F6` on `#0F172A` | 4.85:1 | Passes WCAG, but APCA Lc 37: dim in reading | `#93C5FD` (9.90:1, Lc 68), underlined |
| `#94A3B8` on `#0F172A` | 6.96:1 | Passes; Lc 51, slightly weak for long secondary text | Fine for metadata; for paragraphs use L 0.80 or higher |
Also checked: focus ring not specified, so ask for it; recommend 2px `--color-focus-ring` with 2px offset. And the sqrt(21) note: the light-mode secondary gray cannot be reused in dark mode; each needs its own token.

### Scores
| Criterion | Without | With |
|---|---|---|
| Fundamentals gate | **Fail**: called the 4.34:1 pair fine; called placeholders exempt | Pass |
| Specificity | 2 | 5 |
| Expert layer | 2 | 5 |
| Fit to brief | 3 | 5 |
| Studio-ship | 2 | 5 |

Notes: gap found. SKILL.md had no explicit audit procedure; the answer was assembled from the workflow and rules. Fixed (gap G3).

---

## Brief 3: Lavender wellness brand wants "soft" text
"My client is a meditation app. Brand lavender is #B8A9E8. They want body text in a soft lavender-gray like #8E86A8 because black feels harsh, and lavender buttons."

### Without the skill
Lavender is calming and works for meditation. `#8E86A8` may be too light for body text; use a deeper muted purple such as `#6B5B95` (5.91:1). Buttons: lavender text is too light on white, so use a deeper purple `#7B68C8` with white text (4.51:1, passes AA). Background: soft off-white `#FAF8FF`.

### With the skill
1. `#B8A9E8` = oklch(77% 0.09 295.1): L .77, a fill and illustration color. White on it 2.13:1; near-black on it 9.88:1.
2. Their gray: `#8E86A8` is 3.43:1 on white. Fails body text. Tell the client plainly, with the number and the legal floor (WCAG 2.1 AA in ADA Title II and EN 301 549).
3. Give them "soft" another way: body text `oklch(40% 0.03 295)` = `#494556`, a lavender-tinted near-black (9.26:1 on white, 8.60:1 on the lavender-50 page). It reads soft because it is not black and shares the brand hue, and it has margin for thin weights. Muted text: lavender-neutral-600 `#6c6a76` (5.30:1).
4. Buttons: lavender-600 `#725ca9` with white label (5.50:1, Lc 83), hover lavender-700 `#5d498e`. Brand lavender `#B8A9E8` lives as large background shapes, selected states (with `#2a2533` text, 7.0:1) and illustration, never as text.
5. Note the alternative: `#7B68C8` with white passes at 4.51:1, with almost no margin; any anti-aliasing or a hover lightening breaks it. The ladder's 600 gives real margin.
6. Evidence check: "lavender is calming" is convention, not evidence (Elliot 2015). The case for lavender is category fit and ownability, not psychology.
7. Dark mode: surfaces lavender-neutral 990 to 950 at low chroma, text 50, accent text lavender-300.

### Scores
| Criterion | Without | With |
|---|---|---|
| Fundamentals gate | Pass (narrowly: 4.51:1 button) | Pass |
| Specificity | 3 | 5 |
| Expert layer | 2 | 5 |
| Fit to brief | 3 | 5 |
| Studio-ship | 2 | 4 |

Notes: the strong generic answer passes here. The skill still wins on margin, tinted text as the answer to "soft", evidence labelling and dark mode. Studio-ship 4: a studio would also show a type weight decision (handed to design-typography, planned).

---

## Trigger check
- Fires on: all three briefs ("palette", "brand orange", "dark mode", "review the colors", "brand lavender", "text color").
- Should stay quiet on: "make a bar chart of sales" (dataviz; description says chart palettes alone go to dataviz), "write a tagline for the roaster" (copywriting), "position my client against competitors" (website-strategy). The description's "Not for" line covers these.
- Borderline: "what color should my logo be" fires, correctly, and hands positioning to website-strategy.

## Result
**Pass.** With-skill wins every brief, passes the fundamentals gate on all three, and scores 4 or 5 on every criterion. The without answers failed the gate on briefs 1 and 2.

## Gap list (sent to domain-specialist, fixed in this pilot)
- **G1** Overlapping brand-lightness rules in SKILL.md ("above 0.55" and "0.56 to 0.65" both matched an L 0.68 color). Fixed: three bands (above 0.65, 0.56 to 0.65, 0.55 or below).
- **G2** Dark labels on mid-light fills (L 0.65 to 0.75) pass WCAG but score Lc 45 to 50. Not covered. Fixed: rule added to SKILL.md and palette-building.md.
- **G3** No audit procedure. Fixed: "Reviewing an existing UI" steps added to SKILL.md.
- **G4** Margin: answers should prefer pairs with margin over 4.5:1 exactly (4.51:1 breaks on hover or thin fonts). Fixed: rule added ("aim for 5:1 or more on text you control").
