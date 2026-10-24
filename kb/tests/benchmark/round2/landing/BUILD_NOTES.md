# Ferry landing page, round 2: build notes

Brief 1 in `kb/tests/benchmark/briefs.md`. This is an independent rebuild: nothing under `kb/tests/benchmark/round1/` or `kb/reviews/benchmark-round1-*` was opened.

**Gate not claimed: self-review only.** No fresh-context critic has judged this page (design-director section 5, step 14). The judged rows I walked are listed under the hand-over list below.

## Files
- `ferry.html`: the page. One self-contained file (164.5 KB raw, 84 KB gzip), light and dark, inline SVG logo, SVG and PNG favicons, inlined font subset.
- `ferry-states.html`: the state sheet (`data-lint-page="state-sheet"`).
- `src/`: `page.html`, `page.css`, `page.js` (sources); `states.html`, `states.js`; `build.mjs` (inlines everything; run `node kb/tests/benchmark/round2/landing/src/build.mjs`); `numbers.mjs` (sample run math); `scenarios.mjs` (motion audit); `firstscreen.mjs` (first-screen positions); `og.html` and `og.png` (1200x630 social card); `wordmark-raw.svg`, `wordmark.svg`, `wordmark.json`; `favicon.svg`, `favicon-32.png`; `bricolage-grotesque-latin-standard-normal.woff2` (source), `bricolage-sub.woff2` (subset), `OFL-bricolage.txt`.
- `shots/`: every render (4 widths x 2 schemes, each `?state=`, the state sheet) and `shots/motion/` frame strips.
- `reports/`: every tool output named below, plus the lint JSON files.

## Read log, in order
1. `CLAUDE.md`
2. `skills/design-director/SKILL.md`
3. `kb/tests/benchmark/briefs.md`
4. `skills/design-foundations/SKILL.md`
5. `kb/FOUNDATIONS.md` (v0.4.5)
6. `skills/design-foundations/references/tokens.md`
7. `skills/design-foundations/references/fundamentals-checklist.md`
8. `skills/design-foundations/references/accessibility.md`
9. `skills/design-playbook-landing/SKILL.md`
10. `skills/design-playbook-landing/references/signature-moves.md`
11. `skills/design-copy/SKILL.md`
12. `skills/design-copy/references/01-page-copy-structure.md`
13. `skills/design-copy/references/03-voice-and-tone.md`
14. `skills/design-copy/references/06-copy-in-context.md`
15. `skills/design-layout/SKILL.md`
16. `skills/design-layout/references/05-page-composition-and-density.md`
17. `skills/design-layout/references/01-grids-and-structure.md`
18. `skills/design-layout/references/04-responsive-and-adaptive.md`
19. `skills/design-layout/references/06-pacing-signature-and-phone-editing.md`
20. `skills/design-typography/SKILL.md`
21. `skills/design-typography/references/02-selection-pairing.md`
22. `skills/design-typography/references/01-scale-measure-leading.md`
23. `skills/design-typography/references/05-typographic-detail.md`
24. `skills/design-typography/references/06-type-without-web-fonts.md`
25. `skills/design-typography/references/07-type-led-pages.md`
26. `skills/design-color/SKILL.md`
27. `skills/design-color/references/palette-building.md`
28. `skills/design-color/references/ui-tokens-themes.md`
29. `skills/design-art-direction/SKILL.md`
30. `skills/design-art-direction/references/01-concept-and-consistency.md`
31. `skills/design-art-direction/references/04-visuals-without-image-hosts.md`
32. `skills/design-art-direction/references/05-requesting-photography.md` (first 80 lines)
33. `skills/design-graphic/SKILL.md`
34. `skills/design-graphic/references/01-logo-identity.md`
35. `skills/design-graphic/references/04-illustration.md` (first 60 lines)
36. `skills/design-conversion/SKILL.md`
37. `skills/design-conversion/references/01-cta-hierarchy.md`
38. `skills/design-conversion/references/02-proof-and-trust.md`
39. `skills/design-conversion/references/03-pricing-and-plans.md`
40. `skills/design-conversion/references/04-checkout-and-forms.md` (first 60 lines)
41. `skills/design-ux/SKILL.md`
42. `skills/design-ux/references/02-navigation-ia.md`
43. `skills/design-ux/references/07-commerce-flows.md` (first 40 lines)
44. `skills/design-ux/references/03-forms.md` (first 40 lines)
45. `skills/design-motion/SKILL.md`
46. `skills/design-motion/references/01-purpose-restraint.md`
47. `skills/design-motion/references/04-micro-interactions.md`
48. `skills/design-motion/references/03-choreography-transitions.md`
49. `skills/design-motion/references/07-motion-on-real-pages.md`
50. `skills/design-motion/assets/motion-audit.mjs` (header)
51. `kb/tests/design-motion/scenarios.mjs` (example scenarios)
52. `skills/design-frontend/SKILL.md` (first 80 lines)
53. `skills/design-frontend/references/05-images-fonts.md`
54. `skills/design-frontend/references/07-measured-build-quality.md`
55. `skills/design-search/references/07-page-build.md`
56. `skills/design-search/SKILL.md` (head)
57. `skills/design-search/references/02-on-page-content.md`
58. `skills/design-search/references/03-structured-data.md`
59. `skills/design-polish/SKILL.md`
60. `skills/design-polish/references/06-polish-checklist.md`
61. `skills/design-polish/references/01-interactive-states.md`
62. `kb/teardowns/INDEX.md`
63. `kb/teardowns/stripe-home.md`
64. `kb/teardowns/linear-home.md`
65. `kb/teardowns/ramp-home.md` (with its live capture)
66. `kb/teardowns/mercury-home.md`
67. Screenshots in `kb/exemplars/shots/`: stripe-home, linear-home, ramp-home and mercury-home, each at 1440 and 390
68. Tool headers: `tools/render.mjs`, `tools/lint.mjs`, `tools/browser.mjs`
69. `skills/design-typography/assets/font_kit.py` (header)
70. `skills/design-graphic/assets/wordmark.py` (header)
71. `kb/tests/benchmark/score.py`
72. Tool headers: `search-check.mjs`, `conversion-audit.mjs` (and its sub-terms check body), `polish-audit.mjs`, `skills/design-polish/assets/polish-tokens.css`, `css-audit.mjs`, `weight.mjs`, `vitals.mjs`, `pixel-diff.mjs`, `kb/tests/design-layout/measure-layout.mjs`
73. `skills/design-director/SKILL.md` section 5 again, for the hand-over list

Not opened, because the playbook marks them "when relevant" and the brief already fixes them: website-strategy (audience and job are given), design-art-direction references 02 and 03.

## Concept
**Concept sentence:** Every Ferry picture is the run itself: one funded balance drawn as one orange line that splits into a lane per currency and lands on payday.

**Reject test:** does it show money leaving one balance and arriving in local currencies, with real amounts and a date? If not, it is cut.

Where the motif is drawn:
- the logo mark (one line forking into three);
- the hero ledger: a trunk with one branch per currency row, revealed row by row on load;
- the three step drawings in "How a run works", which join into one route across the columns at 768 and up;
- the favicon and the social card (one line fanning out to seven currency codes).

The only loud color is the orange of the lanes and the primary button. All other line work is neutral.

**Flatplan** (Q is quiet, M is medium, L is loud):

| # | Section | Weight |
|---|---|---|
| 1 | Nav | Q |
| 2 | Hero: type, plus the October run drawn in HTML | L |
| 3 | Sample quote with three figures | Q |
| 4 | How a run works, with the route drawings | M |
| 5 | "The rate locks when you approve", a dark band with numerals | L |
| 6 | Coverage, a ruled board of 7 currencies and 13 countries | M |
| 7 | Pricing, with a live team-size calculator | M |
| 8 | FAQ | Q |
| 9 | Final call | L |
| 10 | Footer, signed off with the outlined wordmark | Q |

**Phone edits:**
- the card drops the People and Locked rate columns and the country names;
- the step dates are hidden in the card;
- the menu becomes a full-screen panel;
- the coverage board drops the currency name column;
- the footer goes to two columns.

**Photo request:** none. The product is drawn in HTML and CSS, as the brief asks.

## Fonts
- **Family:** Bricolage Grotesque, variable, one family for everything. Sources: `npm pack @fontsource-variable/bricolage-grotesque@5.3.0`, file `latin-standard-normal`, axes opsz 12 to 96, wght 200 to 800, wdth 75 to 100.
- **License:** SIL OFL with no Reserved Font Name (copyright "The Bricolage Grotesque Project Authors"). So the subset may keep the name. The license is in `src/OFL-bricolage.txt`.
- **Subset:** made with `font_kit.py subset ... --axes wght=400:640,opsz=14:96,wdth=100`. It is 64.6 KB of WOFF2, inlined as base64.
- **Optical size:** `font-optical-sizing: auto`, so the 72px H1 gets the display cut and the 16px text gets the text cut from one file.
- **Weights in use:** 400 for text, 500 for display and links, 600 for headings and labels.
- **Fallback:** a metric face "Bricolage Fallback" on local Arial, Liberation Sans or Helvetica, with size-adjust 97.83%, ascent 95.06%, descent 27.60% and line gap 0 (from `font_kit.py fallback`).
- **Why this family (opinion):** a grotesque with a little ink-trap character reads as a confident fintech, not a bank. It also keeps us from borrowing Söhne (Stripe) or Inter (Linear).
- **Path:** self-hosted and inlined (design-typography reference 06, path for a one-file page).
- **Production note:** move the font to an external hashed WOFF2 with `<link rel=preload>` so the HTML stays small and the font caches across pages.
- **Glyph limits:**
  - The font has no U+202F, so no narrow no-break spaces are used.
  - The rupee sign is only in latin-ext, so amounts are written with currency codes (INR 310,000.00).

## Sample content
Everything on the page is sample content: Lumen Studio, Dana Ortiz, the quote, all amounts and rates, and the 0.4% FX margin. Each is labelled on the page with "Sample", "Sample quote", "sample data", "Rates are examples, not quotes", and a footer line.

**Stand-ins to confirm before launch:**
- the FX margin "mid-market rate plus 0.4%" and "no transfer fees" (invented to make the rate story concrete);
- "billed monthly from day 15";
- "ACH or wire";
- the employer-of-record answer;
- "Money left in your balance goes back to your bank".

**Run math:** `src/numbers.mjs`. It uses assumed mid-market rates per USD (CAD 1.38, GBP 0.75, EUR 0.86, MXN 18.40, BRL 5.40, INR 88.0) less the 0.4% margin. The result is 12 people and $74,537.54 in total, and every row cost is shown to 2 decimals.

**Dates:**
- Thu, Oct 29, 2026 and Fri, Oct 30, 2026 were checked with `Date`.
- The one time is 9:14 am ET (EDT, which still applies on Oct 30). The zone is named once.

**Promise ledger, one wording each:**
- "the same day"
- "The rate locks when you approve"
- "$12 per person per month, first 3 people free"
- "14 days free, no card needed"
- "Cancel online any time"

## Final tool results (after round 3)

| Check | Command | Result |
|---|---|---|
| Render | `node tools/render.mjs ferry.html shots --widths 390,768,1024,1440` (light and dark), each `?state=` (sent, error, busy, menu at all four widths, viewport only; faq full page), and the state sheet | 48 PNGs in `shots/` plus 7 motion strips. Read by eye: 390, 768, 1024 and 1440 light; 390 and 1440 dark; every state at 390 in both themes; the state sheet in both themes; the hero and FAQ strips. Not read one by one: the 768 and 1024 dark renders and the 768 and 1024 state renders (lint covered them) |
| Lint | `node tools/lint.mjs ferry.html --states state=error,state=busy,state=sent,state=menu,state=faq` | PASS, 0 fail in all 6 runs (30 warnings, read below) |
| Lint, state sheet | `node tools/lint.mjs ferry-states.html` | PASS, 0 fail |
| Claims | `claims_inventory.mjs ferry.html --year 2026`, `--render`, and `--render` per `?state=` sent, error, busy, menu | exit 0, "No mechanical flags" in all 6; every line ticked against `numbers.mjs` and the brief |
| Search | `search-check.mjs ferry.html --base https://ferry.example/ --assets src` | PASS, 0 fail, 0 warn |
| Conversion | `conversion-audit.mjs` on the default, `?state=error` and `?state=sent` | no fails |
| Icons | `icon_audit.mjs ferry.html` | PASS: 8 distinct icons, one 1.5px stroke, round caps and joins |
| Motion | `motion-audit.mjs src/scenarios.mjs shots/motion` | PASS, 7 scenarios. The hero reveal settles by 640 ms; keyboard menu and keyboard stepper show no motion; nothing moves under reduce |
| Polish | `polish-audit.mjs` on the page and the state sheet | PASS (page: 3 warnings) |
| CSS | `css-audit.mjs` | PASS: 7 layers, 0 unlayered rules, 0 raw spacing |
| Weight | `weight.mjs --lcp "#hero-title"` | 164.5 KB raw, 84 KB gzip; the font is 65 KB gzip of that |
| Vitals | `vitals.mjs --runs 3` (mobile) | LCP 1068 ms, CLS 0.000, TBT 14 ms |
| Pixel diff | `pixel-diff.mjs before after` after the round 2 markup change | 8 of 8 differ, all explained by the longer term line re-centering the hero copy and the rate column hidden at 1024; card and sections below unchanged |
| First screen | `src/firstscreen.mjs` | see the next table |
| Measured | `kb/teardowns/measure.mjs` and `score.py landing` | see `reports/score.md` and the summary below |

**First screen** (`src/firstscreen.mjs`):

| Viewport | H1 bottom | CTA bottom | Price line bottom | Card top | First lane | Next section |
|---|---|---|---|---|---|---|
| 390x844 | 226 | 435 | 523 | 599 | 809 | 1278 |
| 1440x900 | 369 | 602 | 690 | 129 | 359 | 804 (under 900) |

**Score summary.** All gate rows pass at 1440 and 390:
- 0% of text under 4.5:1;
- lowest main pair 4.91;
- 100% of spacing on the 4px grid;
- body 16/1.5 at 50 characters per line (1440) and 40 (390).

Craft rows inside the exemplar range: type steps 7, median step ratio 1.25, display tracking -0.018em, display line height 1.1, H1 line height and tracking, families 1. These rows are out of range:
- **H1 and largest size, 72px against 64:** `--text-display-2` resolves to 72px at 1440.
- **Fewer spacing values, radii, durations and curves than any exemplar:** the token system is tighter. Opinion: this is not a defect.

**Lint warnings, read and decided:**
- **44px touch targets at 390:** the 40px controls sit inside 48px fields and get a 48px hit area through `::after`. AA 24px passes.
- **"Fluid display size":** a token, as FOUNDATIONS allows.
- **"01 Fund" on its own line:** a step number plus a one-word title, which is intended.
- **sticky-focus on the skip link:** the skip link is fixed at z-index 100 above the header; I believe this is a false positive, see skill problems.
- **Font fallback moves layout (-161px at 390):** not fixed, see gaps.

## Hand-over list (design-director section 5, step 13)
- [x] **Every primary action clicked and rendered as its own state.** `?state=error`, `?state=busy` and `?state=sent` are rendered at four widths, linted and claim-checked. The sent panel says "Check dana@lumen.studio for your sign-in link. Your 14-day trial starts when you open it", so nothing in it promises a later step. The lower calls to action scroll to the hero field and focus it.
- [x] **KPI labels true in every state.** The card is a post-approval run: "4 of 7 currencies paid", with rows marked Paid or Sending and steps Funded, Approved and Paying. The proof figures say "people in 7 countries", not "paid".
- [x] **Selected controls 3:1 against their neighbors.** The page has no selected controls. The state sheet's "current page" nav link uses a 2px underline plus text color (rule: underline).
- [x] **Rest, pressed and disabled side by side on the state sheet.** Pressed is orange-800 #7a2301 and disabled is neutral-100 #e6eaef, far beyond delta E 15. Disabled is a sunken fill with a muted label, never `opacity` on the brand fill.
- [x] **Most common text size is 16px.** Body measured at 16.0 by `score.py`. Term lines were raised from 14px to body size in round 2.
- [x] **One time zone, named once.** The one time is "9:14 am ET", in the card at all widths.
- [x] **Tall tables.** The coverage board is shorter than the viewport, and no rows are links. The hero ledger is a figure, not a scrolling table.
- [x] **Commit screen.** Not applicable: there is no checkout. The pricing card's figure ($108 a month) is its largest number, and the term line sits under the button.
- [x] **Phone menu shows the top links and the primary action; the trigger reads Close.** It is a full-screen panel under the header with Product, Coverage, Pricing, Customers, Sign in and a filled "Start free trial", with the page inert behind it. The trigger flips Menu to Close with `aria-expanded`, and Escape closes it. See `shots/ferry-state-menu-390-*.png`.
- [x] **KPIs 2x2 at 768.** The three proof figures sit in one row of three at 768, not stacked.
- [x] **Opened menu text on the logo's edge.** Fixed in round 2: the menu list has negative inline margin, so link text lines up with the logo at 16px.
- [x] **Control borders 3.3:1 on raised and tinted dark surfaces.**
  - `--color-border-strong` neutral-500 #7f8c9d: 4.68:1 on #1d2229 (raised), 5.11:1 on #151a20 (surface).
  - In light: 3.42:1 on white. Controls only sit on white.

**Judged rows of the fundamentals checklist.** Walked on the 390, 768, 1024 and 1440 renders and every state:
- **Hierarchy:** one filled primary per screen. The nav button is outlined, and the pricing and final buttons are a full screen apart.
- **Headings:** in order: H1, then H2 per section; the footer column titles are H2.
- **No color-only meaning:** errors use an icon plus words, links are underlined in body copy, and status uses an icon plus a word.
- **Both themes designed, not inverted:**
  - the band lifts to neutral-950 in dark;
  - the card becomes a raised dark surface with ring and highlight instead of shadow;
  - accent text moves to orange-300.

## Rounds
1. **Round 1.** Fixed:
   - lanes drawn from the header cell across the whole card;
   - the lane column collapsing at 390;
   - dots hidden by the phone rule;
   - sections with zero top padding after the band;
   - 768 numerals colliding in the band;
   - lint fails: link target size, measure (container widened from 1184 to 1232), 1px and 3px paddings from UA defaults, and raw spacing;
   - the sub-terms fail (term line moved inside the form);
   - the missing og.png.
2. **Round 2.** Fixed:
   - the phone menu pushing the page and putting two filled buttons in one screen (a `backdrop-filter` on the sticky header trapped the fixed panel);
   - term lines at 14px raised to body size, with a first-charge date added;
   - the state sheet hiding the menu triggers (`!important` in a lower layer);
   - "Change it" target size;
   - the rate column crowding the card at 1024;
   - the H1 at weight 600 dropped to 500.
3. **Round 3.** Fixed reduced-motion transitions (my global reduce rule had added `transition: all` timing to elements, which made the header animate). Re-ran every tool.

## Top 3 gaps against the exemplars (opinion)
1. **The product shot is a single static ledger.** Stripe and Linear show product depth in a layered, slightly dimensional UI with several panes. Mercury puts a crafted light product inside a dark page. Ferry's card is honest and on concept, but it is one table. Next:
   - an approval pane overlapping the ledger;
   - a live-feeling rate tick before approval;
   - a phone receipt, showing what one employee sees.
2. **No real proof.** The quote and figures are labelled samples. Ramp and Mercury carry named logos, counts and security proof (SOC 2, bank partner, insured deposits). A finance lead needs who holds the money, licensing, and payout partners. These need real facts, so they are left out, not faked.
3. **Type and fallback finish.**
   - The 72px H1 is bigger than any exemplar's 48 to 64. A display line of 64px with a lighter 400 weight would be closer to Stripe's restraint; FOUNDATIONS' `--text-display-2` gives 72 at 1440.
   - The metric fallback still shifts layout by 161px at 390 when the font fails, because one fallback face cannot match every optical size.
   - The footer's full-width outlined wordmark is a trend move that a strict critic may call decoration.

## Skill problems (file and line)
1. **`kb/tests/design-layout/measure-layout.mjs` lines 13 and 24 are tied to old test pages.** The tool hard-codes `.btn-primary` and landmark ids from those pages (`#shop`, `#subscribe`...), so on any other page it reports `cta: null` and an empty fold. Yet `skills/design-playbook-landing/SKILL.md` line 59 says to measure the 390 first screen and the 1440 peek with it. I wrote `src/firstscreen.mjs` instead. Fix: take selectors as arguments, or detect the filled primary the way `tools/lint.mjs` line 549 does.
2. **`skills/design-typography/assets/font_kit.py` line 40 puts U+2014 (em dash) in the default subset (LATIN_CORE),** although CLAUDE.md bans em dashes. Harmless, but it wastes glyphs and suggests the character is expected.
3. **`skills/design-typography/assets/font_kit.py fallback` computes one set of overrides from the default instance.** For a variable font with an opsz axis, display sizes and text sizes have different widths, so the lint's `fallback` check still reports -161px at 390. Reference 06 should say to compute a second fallback face for display sizes, or to accept the shift on display lines.
4. **`skills/design-graphic/assets/icon_audit.mjs` misreads `<use>` icons.** Icons drawn from an SVG sprite report 0% ink and "solid" stroke, so the audit cannot see them. Meanwhile the lint warns "icons drawn with <use> ... run icon_audit". Neither tool nor skill says to inline icons. I inline them at build time (`src/build.mjs`).
5. **`skills/design-motion/assets/motion-audit.mjs` cannot film the accordion it recommends.** It does not capture transitions on `::details-content`, so the FAQ opening films as an instant open. A manual check showed the height easing 58, 68, 128, 142, 152, 154px over 240 ms. But `skills/design-motion/references/04-micro-interactions.md` line 20 recommends exactly this technique. The audit should read pseudo-element animations, or the skill should say it is not filmable.
6. **`skills/design-graphic/assets/wordmark.py` header, line 27: the viewBox clips descenders by default.** Any lowercase wordmark with g, j, p, q or y is clipped. The `--json` output has no descender value to raise the box with. I computed the y descender with fontTools and set the viewBox by hand.
7. **`tools/lint.mjs` line 1032 (`sticky-focus`) still warns on a skip link at z-index 100 that paints above the sticky header.** I believe this is a false positive. The fix text "add scroll-padding-top" does not apply to an element that is already fixed at the top.
8. **Missing: `backdrop-filter` and fixed menus.** No skill warns that `backdrop-filter` (or `transform` or `filter`) on a sticky header makes it the containing block for a `position: fixed` menu inside it. The menu then collapses behind the page. design-ux `references/02-navigation-ia.md` or design-frontend should carry this, because the frosted sticky header is the exemplar default.
9. **Missing: `!important` and cascade layers.** The polish recipe for reduced motion (`*{transition-duration:...!important}`) and any `display:none !important` inside a lower `@layer` behave in reverse:
   - layered `!important` beats later layers;
   - a duration set on `*` turns the default `transition-property: all` into real transitions, which made the header animate its `backdrop-filter`.

   design-motion (reduced motion section) and design-frontend (layers) should say: under reduce, list the moving properties to switch off, never set a global duration.
10. **`skills/design-conversion/SKILL.md` line 20 and `conversion-audit.mjs` (sub-terms) do not say what "beside the button" means for the audit.** It means the closest `form`, `section` or `article`. A term line placed after a `</form>` fails even when it sits directly under the button.
11. **Tension between `kb/FOUNDATIONS.md` line 16 and the exemplars.** The typical pair puts `--text-display-2` at `clamp(39px, 5vw, 80px)`, which is 72px at 1440. That is above every landing exemplar's H1 (48 to 64, `score.py`). FOUNDATIONS should say whether a 1440 hero H1 should cap at 64 (for example `clamp(39px, 4.4vw, 64px)` as a third display token), or that 72 is intended.
12. **`skills/design-playbook-landing/SKILL.md` line 59 and the 390 first screen.** It requires the category word, the primary action and, when selling, the price in the first 844px. The signature-moves reject test also requires the motif drawn there. These four plus a 15 to 30 word sub (design-copy) only fit if the product art starts high. I hid secondary card lines on phones to bring the first lane to 809px. A worked budget (header, H1 lines, sub lines, field, term line, art) in pixels would help.
