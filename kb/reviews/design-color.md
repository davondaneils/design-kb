# Review: design-color (v0.1 draft)

Reviewer: critic. Date: 2026-10-09. Checked: `skills/design-color/SKILL.md`, all five references, `assets/oklch_scale.py`, against `kb/research/color/*`, `kb/FOUNDATIONS.md` and the quality bar in CLAUDE.md.

## Verdict
**Revise** on first pass (one fundamentals miss, fix 1). **Approve** after the fixes below, all applied.

## Step 1: Fundamentals gate
Method: re-ran every contrast number quoted in SKILL.md and the references with `assets/oklch_scale.py check` (37 pairs), and re-ran the ladder sweep (all hues, chroma 0 to 0.26). All quoted ratios reproduce to two decimals. Checked each worked example's own advice for contrast, focus, color-alone and state coverage.

| # | Finding | Severity | Status |
|---|---|---|---|
| 1 | `contrast-accessibility.md` said inline links distinguished by color need "3:1 against surrounding text plus a non-color cue on focus and hover". Technique G183 requires only the 3:1; the extra cue is not part of it. Wrong rule stated as a requirement. | Fundamentals miss (correctness) | Fixed: rule now says 3:1 (G183), underline recommended |
| 2 | Fintech example used "amber 500 as a fill" for a highlight with no text color named. Amber-500 against amber-950 can drop to 4.21:1 worst case on the ladder, so a dark label could fail. | Fundamentals miss (contrast in own example) | Fixed: amber-400 fill with amber-950 text (6.38:1) |
| 3 | Yellow example: hover "to the 400 step" passes (6.45:1) but turns the button bronze. Not a contrast miss, but a hierarchy/brand miss. | Craft | Fixed: hover to 300 (8.88:1), still clearly yellow |
| 4 | "Tailwind blue-500 with white text is 3.71:1": 3.71 is our gamut-clipped conversion of the v4 OKLCH value; v3's `#3b82f6` is 3.68:1. | Precision | Fixed: "about 3.7:1" |

## Step 2: Claims vs research
| # | Finding | Status |
|---|---|---|
| 5 | SC 2.4.7 (Focus Visible, AA) and `prefers-contrast` were used but not in the research notes. | Fixed: added to research 03 with W3C and MDN sources |
| 6 | "Interpolate gradients in Oklab to avoid gray middles" was stated close to fact. MDN says Oklab is the default interpolation space; we could not fetch the CSS Color 4 text on legacy sRGB handling. | Fixed: now "write `in oklab` explicitly rather than rely on defaults", gray middle reasoning labelled opinion |
| 7 | APCA everywhere labelled draft, never as WCAG 3. WCAG 3 status matches Roselli April 2026. | OK |
| 8 | Psychology claims match Elliot (2015), Singh (2006), Labrecque and Milne (2012). Inferences labelled. | OK |

## Step 3: Contradictions
| # | Finding | Status |
|---|---|---|
| 9 | FOUNDATIONS: token names, role set, 50 to 950 ramps, WCAG 2.2 AA floor, dark elevation by lighter surfaces, 25px and 20px bold type sizes all match. Deviation taught and justified: neutral 975 and 990 steps for dark surfaces. | OK (deviation documented in ui-tokens-themes.md) |
| 10 | No other shipped skills yet. dataviz, website-strategy, copywriting referenced, not duplicated. | OK |

## Step 4: Gaps a designer would hit
| # | Gap | Status |
|---|---|---|
| 11 | Alpha (transparent) colors: text or borders as `rgb(255 255 255 / 0.6)` change contrast with every surface. Not covered. | Fixed: decision rule added (SKILL and ui-tokens-themes.md) |
| 12 | Brand color as a button fill on white: no note that the fill itself does not need 3:1 when the label identifies the control (1.4.11 boundary rule). Designers over-correct here. | Fixed: added to yellow example |
| 13 | Email and older embeds: OKLCH not safe everywhere. | Fixed: "hex only for email" rule, marked opinion with a pointer to check support |
| 14 | References cited `kb/research/...` only, so a standalone install of the skill had no sources. | Fixed: each reference now ends with a Sources list |

## Step 5: Expert bar ("would the best person in the field learn something?")
Section by section verdict after fixes:
- Fundamentals: correct and complete; expected to be familiar (that is the point of a gate).
- Pass lines and the sqrt(21) limit: non-obvious; most practitioners check contrast after choosing, not before.
- Contrast-locked ladder with measured worst cases and "five steps apart": Stripe-level practice, rarely written down with numbers.
- "The 500 is not your button", "change the role, not the color", brand color as token: these are the moves that separate studio work from template work.
- WCAG 2 vs APCA disagreement in dark mode with measured pairs: expert level.
- Psychology: the 62 to 90 percent source check is something even senior designers get wrong.
- Weakest section: harmony schemes. They are convention and the text says so; kept short on purpose.

## Step 6: Filler and house rules
- Em dash grep (U+2014): none.
- SKILL.md is 140 lines (limit about 300).
- Removed nothing material; the references overlap the drafts by design.
