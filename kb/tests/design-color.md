# Tests: design-color v0.1

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
