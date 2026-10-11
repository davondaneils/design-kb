---
name: design-typography
description: Domain reference loaded by design-director or a design playbook (design-playbook-landing, -dashboard, -mobile, -brand); do not trigger on its own for a page, screen or brand job. Covers type scale and tokens, measure and leading, font selection and pairing, web font loading and licensing, variable fonts, type without a font CDN (system stacks, self-hosted and inlined fonts), type-led landing pages, UI and editorial hierarchy, and typographic detail (numerals, quotes, OpenType features, text-wrap). Load it directly only when the user names it or asks a narrow question inside this domain alone.
---

# Design typography

> **Layer: domain reference.** Loaded after `design-foundations` by `design-director` or a `design-playbook-*` skill. Accessibility floor for every rule here: design-foundations `references/accessibility.md`.

Typography is the voice and the reading experience of every interface. This skill sets type the way Bringhurst, the Apple HIG authors, and the type teams at Stripe, Linear and Klim would sign off on: fundamentals perfect first, then the details a strong generalist misses.

All defaults follow the design-kb shared foundation contract (`kb/FOUNDATIONS.md`): root 16px, ratio 1.25, tokens `--text-xs` to `--text-5xl`, body line height 1.5, headings 1.1 to 1.25, measure 45 to 75 characters (66 ideal), 4px spacing grid, WCAG 2.2 AA floor. Teach deviations explicitly; never silently change a default.

## 1. Fundamentals gate (check first; one miss fails the work)

Run this list on every answer, spec or review before anything else. State any rule you deviate from and why.

| # | Rule | Number |
|---|---|---|
| F1 | Type in `rem`; root font size left at the browser default (never `62.5%` or px on `html`) | 1rem = 16px |
| F2 | Body text size | Web 16px minimum; iOS 17pt (HIG Body); Android 16sp (M3 Body Large) |
| F3 | Smallest text anywhere, labels and captions only | 12px web; 11pt iOS; never for paragraphs |
| F4 | Form input text | 16px or larger (iOS Safari zooms below that) |
| F5 | Paragraph line height, unitless | 1.5 (headings 1.1 to 1.25; display lines of 100px and up may go to 0.95, reference 07) |
| F6 | Measure (characters per line incl. spaces) | 45 to 75, 66 ideal, 80 hard ceiling (WCAG 1.4.8 AAA); 40 to 50 per column in multi-column. CSS: `max-inline-size: 52ch` (measured 63 to 68 in every text face); never `66ch` (81 to 86) |
| F7 | Contrast | 4.5:1 body, 3:1 for large text (24px, or 18.66px bold) (WCAG 1.4.3); muted text is a color token, never `opacity` |
| F8 | Survives user text spacing: line height 1.5, paragraph 2em, letter 0.12em, word 0.16em; and 200% zoom | No fixed heights or clipping on text containers (WCAG 1.4.12, 1.4.4) |
| F9 | Fluid type | max no more than 2.5x min, endpoints in rem |
| F10 | One scale: every size is a token, adjacent levels differ by at least one 1.25 step or two weight steps | No one-off sizes |
| F11 | Semantic headings in order, one h1; visual style chosen separately | WCAG 1.3.1 |
| F12 | Text visible immediately; fonts never block text | `font-display` set; `swap` with metric fallback or `optional` |
| F13 | Real characters: curly quotes, apostrophes, en dash for ranges, minus U+2212, multiply U+00D7, ellipsis U+2026 | `lang` set on `<html>` |
| F14 | Tabular figures on numbers that update or align in columns | `font-variant-numeric: tabular-nums` |
| F15 | No faux bold, italic or small caps; avoid light weights (300 and under) at small sizes (HIG; our threshold, opinion: none below 24px) | Every used style has a real file |
| F16 | License covers each use (web, app, desktop, ePub, ads) | Check before sign-off |

## 2. Default type system (foundation tokens)

| Token | px / rem | UI line height (4px grid) | Heading line height | Tracking start point |
|---|---|---|---|---|
| `--text-xs` | 12 / 0.75 | 16 | n/a | +0.01em; caps labels +0.06 to +0.1em |
| `--text-sm` | 14 / 0.875 | 20 | n/a | 0 |
| `--text-base` | 16 / 1 | 24 | 20 (bold UI titles) | 0 |
| `--text-lg` | 20 / 1.25 | 28 | 24 | -0.005em |
| `--text-xl` | 25 / 1.5625 | n/a | 28 | -0.01em |
| `--text-2xl` | 31 / 1.9375 | n/a | 36 | -0.015em |
| `--text-3xl` | 39 / 2.4375 | n/a | 44 | -0.02em |
| `--text-4xl` | 49 / 3.0625 | n/a | 56 | -0.02em |
| `--text-5xl` | 61 / 3.8125 | n/a | 68 | -0.025em |

- 12 and 14 are hand-tuned UI steps; the pure 1.25 ratio below 16 gives 12.8 and 10.24.
- UI and heading line heights snap to the 4px grid (Material 3 does the same). Prose (any paragraph, at any size) uses unitless `line-height: 1.5` on the container instead, so 20px lead text gets 30.
- Tracking is a starting point (opinion) shaped like Inter's published formula and Material's tokens; tune per typeface. Display cuts need less.
- Fluid display, 360 to 1280px viewport: `--text-5xl: clamp(2.4375rem, 1.9rem + 2.39vw, 3.8125rem)`; full set in `references/01-scale-measure-leading.md`.

## 3. Decision procedure (in this order)

1. **Roles.** List the jobs: text (long reading), display (voice), functional (UI, data, forms), code. Note platforms, languages, and whether numbers matter.
2. **Faces.** Default to one family (superfamily or variable with `opsz`). Add a second only for a job the first cannot do. Max two families plus an optional mono. For product UI, consider `system-ui` first. Run the selection checks in reference 02. If a font CDN is blocked or the page must be self-contained, choose the path in reference 06 before choosing faces.
3. **Measure, then size, then leading.** Fix the text column width first (`52ch`), then body size, then line height.
4. **Scale and ramp.** Map every role to a token, weight and line height. Six to eight styles cover a product screen.
5. **Hierarchy.** Rank what the reader sees first. Pull levers in this order: space and position, size, weight, color (still passing contrast), case and tracking, typeface.
6. **Detail.** Numerals, characters, caps, OpenType features, wrapping.
7. **Delivery.** Loading strategy, fallback metrics, subsetting, license.
8. **Gate.** Run section 1 again on the final spec.

## 4. Decision rules that come up every time

- **Product UI** (dense): 1.25 scale, absolute grid-snapped line heights paired with size in one token, weights 400/500/600 (700 sparingly).
- **Long-read on desktop:** body `--text-lg` 20px or fluid `clamp(1rem, 0.9rem + 0.45vw, 1.25rem)`; measure about 66 characters; `text-wrap: pretty`.
- **Dense dashboards:** keep tokens, use a 1.2 feel by skipping `--text-xl` and leaning on weight; numbers tabular and right-aligned; values emphasized, labels quiet.
- **Marketing hero:** add drama with a separate display ramp built on top of the tokens (`--text-display` 49 to 112px, `--text-display-2` 39 to 76px, fluid), not by changing base tokens. With no photography, the headline is the hero image: reference 07.
- **No font CDN** (blocked network, offline, one self-contained file): system stack only for product UI; one self-hosted text face for data UI that must align on every OS; for brand pages one self-hosted display face pinned to the instance you use (about 21 KB per style) with the system sans for everything else. Metric fallbacks for every style, italic included. Reference 06.
- **Under 640px:** cap headings at `--text-3xl` or use fluid tokens; a 61px headline on a 360px screen fits about 8 to 10 characters per line.
- **Caps:** labels under one line only, +0.06 to +0.12em, `text-transform`, `case` feature on.
- **Pairing:** match x-height and construction, contrast on one axis (serif vs sans, width or weight). Similar-but-different faces conflict; use one family in two weights instead.
- **High-contrast serifs (Didones: Bodoni, Didot, Bodoni Moda, Playfair; any face over about 8:1 stem to hairline):** size the hairline, not the font. Hairline seen = hairline per em x size x display scale (1 on a page, view / canvas on a poster: 0.361 for a 1080 post in a 390 feed). Floors: 0.5 CSS px seen on screen (1 CSS px for 1x desktop and for reversed type, opinion), 0.25 pt in print (0.5 pt reversed; prepress shops). Pick opsz by the size seen, not the canvas or the CSS size: about a third to a quarter of the font size on screen for Didones, the point size in print. Bodoni Moda measured: opsz 48 needs 139px on a page and 388px on a 1080 canvas; opsz 24 needs 56 and 156; opsz 11 needs 26 and 72. Run `assets/hairline.py`; reference 08.
- **Condensed faces:** headlines only; never for numbers people glance at (condensed read about 11% slower, NN/g).
- **Non-Latin scripts:** pick faces with native script support, raise line height for scripts with tall marks (Vietnamese, Thai, Devanagari, CJK; opinion: 1.6 to 1.8), never letter-space connected scripts such as Arabic, and do not fake italics in scripts that have none.

## 5. Expert moves (what separates top-studio work)

1. **Optics scale inversely with size.** As size grows, line height ratio falls (1.5 body to 1.1 display) and tracking goes negative (about -0.02 to -0.025em at 40px and up); as size shrinks, both open. Inter's designer publishes the curve: tracking(em) = -0.0223 + 0.185 x e^(-0.1745 x px).
2. **Measure in ch, with the lower number.** `ch` (the zero's width) overstates the average character by a steady 21 to 31 percent, so `66ch` gave 81 to 86 characters in all eight faces measured, while `52ch` gave 63 to 68. `em` drifts with the face: `32em` is 66 characters in Inter and 77 in a Times-width serif. Default `max-inline-size: 52ch`; the lint confirms (reference 01).
3. **Metric-matched fallbacks.** `size-adjust` plus `ascent-override`, `descent-override`, `line-gap-override` on a local fallback, generated by next/font, Fontaine or Capsize, makes the font swap invisible and font CLS near zero.
4. **Optical size is real, and the web maps it in px.** Prefer faces with `opsz` (Inter, Source Serif 4, Newsreader, Fraunces) or separate Text and Display cuts. Browsers map opsz to CSS px, not points; if body looks spindly versus the design tool, pin `"opsz"` for the role.
5. **Grade, not weight, for dark mode and hover.** Light text on dark reads heavier (practitioner opinion); lower `GRAD` (no reflow) or, opinion, drop wght about 50 units. Animating wght without GRAD shifts layout.
6. **Trim the half-leading.** `text-box: trim-both cap alphabetic` (Baseline 2026) centers labels optically in buttons and aligns text to the grid; Capsize for older browsers.
7. **Wrap like an editor.** `text-wrap: balance` on headings (up to 6 lines in Chromium), `pretty` on paragraphs (whole paragraph in Safari, last 4 lines in Chromium); never manual `<br>` in headlines.
8. **Normalize x-heights across mixed fonts, on the parent.** `font-size-adjust: ex-height from-font` resolves against the font where it is declared: on `body` it captures the text face's ratio and children inherit it; on `code` it measures the mono and does nothing (measured in Chromium).
9. **Numbers are typography.** Tabular lining figures in data and anything that ticks; oldstyle proportional in serif prose; slashed zero for codes; true minus U+2212 so columns align; units joined with U+202F.
10. **Same size, different weight beats a new size.** Apple separates Headline and Body at 17pt by weight alone. Promote by contrast between few styles, not by adding styles.
11. **Never stack three demotions** (small and gray and caps): the element disappears. Pick two at most.
12. **Subsetting is a license event.** Under the OFL, a subset is a modification and may not keep a Reserved Font Name unless functionally equivalent; commercial EULAs often forbid it. Keep curly quotes, dashes, U+2212 and the euro sign in every Latin subset.
13. **The default fonts read as default.** Roboto, Open Sans and Poppins top the Web Almanac; fine for UI, weak for brand voice. Put personality in display only.
14. **`system-ui` is not one font.** It is SF on Apple, Segoe UI on Windows, Roboto on Android, with different widths and figures. For cross-platform data layouts, a shipped face gives identical metrics.
15. **Letter spacing kills optional ligatures** and is wrong for body text; reserve it for caps, tiny labels and display tightening.
16. **Set `font-kerning: normal` explicitly.** The default `auto` lets browsers skip kerning on small text (MDN).
17. **Footnote markers wreck leading.** `sup, sub { line-height: 0; }`, or `font-variant-position: super` when the font has superior figures.
18. **Pin the variable axes you do not animate.** A variable font's weight is in its axes: Newsreader went 132 KB to 47 KB by pinning `opsz`, 21 KB by pinning `wght` too. Character subsetting saves far less once you keep typographic punctuation (`assets/font_kit.py`).
19. **CDN builds strip OpenType features.** Fontsource and Google Fonts Inter keep 7 features; the designer's release keeps 40 (`case`, `zero`, `ss01`, small caps). `font-feature-settings: "ss01"` on the CDN build does nothing. Check the file you ship.
20. **Side bearings grow with size.** At 112px a serif E sits 5px inside the margin while the 12px label above it sits 1px in; pull display lines out by the first glyph's bearing (`translate: -0.04em 0`).
21. **In-between weights snap down on static fonts.** `font-weight: 350` on a stack that resolves to a static family with a Light cut renders Light 300 (CSS weight fallback). Use 350 or 450 only on faces whose `@font-face` declares a weight range.
22. **Units keep their case.** A caps label turns `340 g` into `340 G` (a different unit). Wrap units in `text-transform: none`; join number and unit with U+202F.
23. **Weight does not save a hairline; optical size does.** In Bodoni Moda the hairline is identical at wght 400 and 700 (3.6/1000 em at opsz 48) while the stem grows 50 percent, so bolding a Didone raises contrast and dazzle. Lower `opsz` instead: the hairline grows 18 times from opsz 96 to 6. On a canvas, `font-optical-sizing: auto` maps opsz to canvas px, so a 200px poster line seen at 72px gets opsz 96: pin it by hand (reference 08).

## 6. Output format for type specs

When delivering a type system, give, in this order:
1. Faces and roles, with the reason each face is there and the license type.
2. Token table: token, size, line height, weight, tracking, use.
3. Measure and container widths.
4. Hierarchy map for the key screens (which token each element uses).
6. Loading: the path (system, self-hosted or mixed) and total font KB; `@font-face` with ranges, `font-display`, metric fallback per style, preload, subset; what the page looks like with the font blocked.
6. Loading: `@font-face` with ranges, `font-display`, fallback, preload, subset.
7. Gate result: F1 to F16 pass, or the documented deviation.

Write CSS with foundation token names (`--text-*`, `--space-*`, `--color-text`, `--color-text-muted`).

## 7. Reference map

| Read | When |
|---|---|
| `references/01-scale-measure-leading.md` | Sizes, scales, line height, measure, fluid clamp values, vertical rhythm, iOS and Android sizes |
| `references/02-selection-pairing.md` | Choosing faces, pairing methods, selection checks, starting points by brief, how to test a pairing |
| `references/03-web-fonts-variable-licensing.md` | font-display, fallbacks, preload, self-hosting, subsetting, variable axes, licensing table |
| `references/04-hierarchy-ui-editorial.md` | UI ramp, editorial ramp, label and value patterns, text-wrap, text-box trim |
| `references/05-typographic-detail.md` | Character table, numerals, caps and small caps, OpenType CSS, alignment, links |
| `references/06-type-without-web-fonts.md` | Font CDN blocked or one self-contained file: system stacks by classification, self-hosting from local files or npm, axis pinning, inlining, metric fallbacks with italics, testing with the font blocked |
| `references/07-type-led-pages.md` | Making the type carry a landing or brand page with no photography: display ramp, roman and italic headline, numerals as graphics, optical margins, editorial set pieces |
| `references/08-high-contrast-faces.md` | Didones and other high-contrast faces: hairline at the seen size, screen and print floors, opsz by viewing size, Bodoni Moda measured, outlined wordmarks, the held-out poster worked through |
| `assets/hairline.py` | Measures a face's thinnest stroke per opsz and prints the smallest safe size on a page, a canvas or in print; exits 1 when your size is too thin. Example: `python3 hairline.py BodoniModa.woff2 --axes wght=700 --size 200 --canvas 1080` |
| `assets/font_kit.py` | `subset` (subset, pin axes, WOFF2, print `@font-face`, optional `--inline` base64) and `fallback` (size-adjust and metric overrides against a local font). Needs `pip install fonttools brotli`. Example: `python3 font_kit.py subset Newsreader.woff2 out.woff2 --axes wght=400,opsz=48 --inline` |

## 8. Related skills
- design-color: text and link contrast, muted tokens, dark theme surfaces.
- design-layout: grids, spacing scale, section rhythm, container widths.
- design-frontend: token plumbing, build and preload setup, Core Web Vitals.
- design-product-ui: tables and numeric display. dataviz: charts. design-ux: forms and readability in flows. design-copy: wording, headlines, microcopy. design-motion: animated type and reduced motion. design-graphic: logos, posters and lettering.
- The user's existing skills: website-strategy (brand positioning that should drive font mood), copywriting (headline and sales copy), sales-funnels (conversion page structure).
