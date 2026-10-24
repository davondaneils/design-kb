# Shared foundation contract (v0.4.6)

Every design-kb skill builds on this. Skills may teach when and how to deviate, but every default, example, token name and cross-reference uses these values so the skills never contradict each other.

**Owner: the editor-in-chief.** Changing any value, name or checklist item here is an editor-in-chief decision, recorded in the change log at the bottom. Domains propose changes; they never edit this file on their own branch. `tools/lint.mjs` reads its scales from this file's numbers, so a change here is also a change to the lint.

## Token naming
`--{category}-{role}-{variant}`, for example `--color-text-muted`, `--space-4`, `--text-lg`, `--radius-md`, `--duration-fast`. Semantic tokens reference primitive tokens; components only use semantic tokens.

## Spacing
4px base unit. Scale: 0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128 (tokens `--space-0` to `--space-11` in that order, or named by pixel value in examples). Layout gaps use 16 and up; component padding uses 4 to 24.

## Type
Root 16px. Default UI scale ratio 1.25 (major third): 12, 14, 16, 20, 25, 31, 39, 49, 61. Tokens `--text-xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl`. Body line-height 1.5, headings 1.1 to 1.25; display lines of 100px and up may go to 0.95. Measure 45 to 75 characters, 66 ideal; at 390px 35 to 75 (a two-column grid kept on a phone measured 33, exemplars 34 to 50, `kb/reviews/benchmark-round1-landing.md` gap 7). Display sizes may use fluid `clamp()`.

Display ramp above `--text-5xl`: `--text-display` and `--text-display-2` are fluid `clamp()` values that may exceed 61px. Rules: the maximum is no more than 2.5 times the minimum, the minimum sits on the scale (39, 49 or 61), and the lint accepts any fluid size of 39px and up. Typical pair: `--text-display: clamp(49px, 7vw, 112px)` for one hero line, `--text-display-2: clamp(39px, 5vw, 80px)` for a second display moment (design-typography reference 07).

Measure in CSS: `max-inline-size: 52ch` (63 to 68 characters in every one of the eight text faces measured); keep body between about `40ch` and `56ch`; never `66ch`, which renders 81 to 86 characters in every face. `em` does not track the face: `32em` gives 61 to 77 characters depending on the face (Inter 66, Times-width serifs 77). Source: `kb/research/typography/measure-cpl.mjs`, counted the same way as the lint; design-typography `references/01-scale-measure-leading.md`. Confirm with the lint. Optional token: `--size-measure: 52ch`.

## Color roles (semantic)
`bg`, `surface`, `surface-raised`, `surface-sunken`, `text`, `text-muted`, `text-muted-on-tint`, `border`, `primary`, `on-primary`, `accent`, `success`, `warning`, `danger`, `info`, `focus-ring`. Primitives are 50 to 950 ramps per hue. Light and dark themes map the same roles. Minimums: WCAG 2.2 AA (4.5:1 body text, 3:1 large text and UI components and focus indicators).

- `surface-sunken`: a well below the page (inputs on a surface, code blocks, table zebra, disabled fills, the track of a meter). One step darker than `bg` in light, one step darker than `surface` in dark.
- `text-muted-on-tint`: muted text on any tinted or sunken surface (`surface-sunken`, every `*-subtle` status fill, feature bands, and hover, pressed and selected state layers: `text-muted` on an 8% hover layer measured 4.23:1, on pressed 4.07:1, `kb/tests/benchmark/round1/app/BUILD_NOTES.md` skill problem 1). `text-muted` is tuned for `bg` and `surface` only and often fails on a tint: the combined pages measured 4.38:1 and 4.24:1 there (`kb/tests/design-conversion.md`). Rule: measure every muted-text and tint pair in both themes; it reaches 4.5:1, or the text uses `text-muted-on-tint` (one ramp step darker in light, lighter in dark) or `text`.
- Borders and selected states on raised and tinted surfaces: the 3:1 for control borders (inputs, secondary buttons, steppers) is measured against every surface the control sits on (`surface-raised`, every `*-subtle` fill, feature bands) in dark as well as light, and keeps **3.3:1** or more as margin. Round 1 passed at 3.02:1 on a dark raised card and 3.04:1 on a dark amber tint by luck (`kb/reviews/benchmark-round1-landing.md` section 1, `kb/reviews/benchmark-round1-app.md` gate 3). A selected control differs from its unselected neighbor by 3:1 in fill, ink or border, or by +200 weight, or by an underline or 2px indicator; a selected segment measured 1.21:1 light and 1.08:1 dark against its track (lint `selected-state`).

## Breakpoints (mobile first, min-width)
sm 640, md 768, lg 1024, xl 1280, 2xl 1536. Prefer container queries for components.

Container query conditions are written in `rem` (40rem = 640px at the 16px root), never `em`: the spec evaluates relative units in a container condition against the query container's own computed values (W3C css-contain-3), so `44em` inside a 14px dashboard content area fired at 616px, not 704px (`kb/research/frontend/07-measured-build-quality.md` finding 7). `px` is allowed; `rem` is the default so media and container numbers read the same.

## Radius and elevation
Radius: 0, 4, 8, 12, 16, full. Elevation: 0 to 4 shadow levels; dark themes express elevation with lighter surfaces, not darker shadows.

Shadow recipe (design-polish `assets/polish-tokens.css`, adopted here; the values are design-polish's recommendation, opinion built on layered shadows and the Tailwind v4 scale): shadows are tinted with the darkest neutral through `--shadow-rgb` (never pure black), stack a tight contact layer and a soft ambient layer, fall straight down (x = 0, y >= 0; a negative spread is fine), and keep every layer's alpha at 0.25 or under. Elevation tokens are a ring plus a shadow. In dark themes elevation is a lighter surface step, the ring and a top highlight, with no drop shadow.

| Token | Light | Dark |
|---|---|---|
| `--shadow-rgb` | the neutral 950 as an RGB triplet, for example `31 34 36` | same |
| `--shadow-0` | `0 0 0 0 transparent` | `0 0 0 0 transparent` |
| `--shadow-1` | `0 1px 2px rgb(var(--shadow-rgb) / 0.06)` | `0 0 0 0 transparent` |
| `--shadow-2` | `0 1px 2px rgb(var(--shadow-rgb) / 0.06), 0 4px 12px -2px rgb(var(--shadow-rgb) / 0.08)` | `0 0 0 0 transparent` |
| `--shadow-3` | `0 2px 4px -1px rgb(var(--shadow-rgb) / 0.08), 0 12px 24px -6px rgb(var(--shadow-rgb) / 0.16)` | `0 0 0 0 transparent` |
| `--shadow-4` | `0 4px 8px -2px rgb(var(--shadow-rgb) / 0.10), 0 24px 48px -12px rgb(var(--shadow-rgb) / 0.24)` | `0 0 0 0 transparent` |
| `--ring` | `0 0 0 1px rgb(var(--shadow-rgb) / 0.08)` | `0 0 0 1px rgb(255 255 255 / 0.08)` |
| `--highlight` | `inset 0 1px 0 rgb(255 255 255 / 0.12)` (filled buttons) | `inset 0 1px 0 rgb(255 255 255 / 0.06)` |
| `--elevation-card` | `var(--ring), var(--shadow-1)` | `var(--ring)` |
| `--elevation-popover` | `var(--ring), var(--shadow-3)` | `var(--ring), var(--highlight)` |
| `--elevation-modal` | `var(--ring), var(--shadow-4)` | `var(--ring), var(--highlight)` |

Never `none` inside a shadow token: tokens get composed into lists (`box-shadow: var(--highlight), var(--shadow-1)`), a list that contains `none` is invalid, so the whole declaration computes to `none` and the dark-theme highlight never renders (measured with getComputedStyle on both combined pages; `kb/research/frontend/07-measured-build-quality.md` finding 5). A transparent zero layer composes and paints nothing; the lint ignores it.

State layers on neutral surfaces (Material 3, m3.material.io "States", accessed 2026-10-09): hover 8 percent, focus 10 percent, pressed 10 percent, dragged 16 percent of the content color. Pressed must still differ from hover: on filled controls use `--color-primary-active`, one ramp step past hover.

## Motion
Durations: instant 0 to 100ms, fast 150ms, base 200 to 250ms, slow 300 to 400ms, page 400ms (`--duration-page`; 600ms is the ceiling, not the token). Hover is `--duration-instant` (100ms; Linear hover `.1s`, `kb/teardowns/linear-home.md`). Easing: standard `cubic-bezier(0.2, 0, 0, 1)`, enter (decelerate) `cubic-bezier(0, 0, 0, 1)`, exit (accelerate) `cubic-bezier(0.3, 0, 1, 1)`, reveal (marketing only) `cubic-bezier(0.22, 1, 0.36, 1)`. Always honor `prefers-reduced-motion`.

- **`--ease-reveal` is for marketing pages only:** below-the-fold section reveals and the one hero reveal, at 400 to 800ms. It is easeOutQuint (easings.net): 97% settled at half its duration against 89% for `--ease-enter`, so a screen goes still sooner on long reveals; Scrolltide runs its whole homepage on it (249 elements, measured 2026-10-23, `kb/research/motion/08-cinematic-scroll.md`). Product UI, menus, dialogs and anything a person triggers keep `--ease-enter`.

- **Semantic pairs** (a duration plus a curve, for transition shorthands; design-motion `assets/motion-tokens.css`): `--motion-hover: var(--duration-instant) var(--ease-standard)`, `--motion-enter: var(--duration-base) var(--ease-enter)`, `--motion-exit: var(--duration-fast) var(--ease-exit)`. Use: `transition: background-color var(--motion-hover)`.
- **`linear` is allowed** for loops (spinners, marquees), scroll-linked motion (the scroll is the easing) and reveals whose x axis is time (a chart drawing on along a date axis). Never on an object that starts and stops (design-motion SKILL.md fundamental 6 and signature move 17).
- **Marketing reveal ceiling (opinion).** Anything a person triggers stays at 600ms or less. A marketing page may give **one hero reveal per page** up to **800ms**, on `--ease-reveal`, played once on load and removed under reduced motion. Measured exemplars do this: Stripe reveal transforms `.8s cubic-bezier(.165,.84,.44,1)` (`kb/teardowns/stripe-home.md`) and Raycast extension cards `.7s cubic-bezier(.215,.61,.355,1)` (`kb/teardowns/raycast-home.md`). NN/g puts most UI animation at 100 to 500ms and says about 500ms starts to "feel like a drag" (`kb/research/motion/02-timing-easing.md`), which is why the exception covers one unprompted entrance only. Everywhere else, 600ms is the ceiling.
- **Reduced motion** (`prefers-reduced-motion: reduce`): nothing moves, scales, rotates or resizes. Opacity and color changes may stay at `--duration-fast` (150ms) or less, played once; loops stop. The lint fails any animation whose keyframes change position, size or transform under reduce, and warns on opacity or color animations over 150ms or looping. This replaces the v0.3 lint's flat 100ms threshold, which failed the 150ms fades that `accessibility.md` allows.
- Scripts read motion tokens from CSS (`getComputedStyle`); no millisecond literals in JS (design-motion).

## Icons
Owner: design-graphic with design-polish. One icon set per product: one grid, one stroke width, one cap, one join, `currentColor` for ink.

| Token | Value | Use |
|---|---|---|
| `--size-icon-sm` | 12px | inline with `--text-xs` meta text |
| `--size-icon-md` | 16px | default, beside 14 and 16px text |
| `--size-icon-lg` | 20px | beside 20px text, list leading icons |
| `--size-icon-xl` | 24px | toolbars, tab bars, touch-first screens |
| `--icon-stroke` | 1.5px | set beside font weight: heavier text gets a heavier stroke; keep it constant across sizes with `vector-effect: non-scaling-stroke` or redraw per size (design-graphic `references/02-icon-systems.md`) |

Rules: one `stroke-linecap` and one `stroke-linejoin` per page; no hard-coded `fill` or `stroke` colors inside icons (use `currentColor` or a token); ink stays at least 1px inside a 16px box. The lint checks caps, joins and colors (`icons`); `skills/design-graphic/assets/icon_audit.mjs` adds ink volume and pixel blur as prompts to look. Measured case for the rule: the combined dashboard passed the v0.3 lint with round and butt caps, round and miter joins, and `#ffffff` inside status icons (design-graphic pipeline notes).

## Sizes
Control and row heights (design-layout, design-product-ui): `--size-control-sm` 32px, `--size-control-md` 40px, `--size-control-lg` 48px. 40 is a size, not a spacing step; padding and gaps still come from the spacing scale. Touch: 44px minimum on iOS and the web, 48dp on native Android (Material).

## Content mechanics
One sheet for every skill's examples and every test page (design-copy `references/06-copy-in-context.md`; quotes and dates in `kb/research/copy/06-copy-in-context.md`):
- **Locale first.** The audience picks the locale, never the house default: a Glasgow festival is en-GB, a US freelancer app is en-US. Set it on `<html lang>` (`en-US`, `en-GB`); that attribute picks the row below for dates, clock, currency and spelling, and `claims_inventory.mjs` reads it (no `lang`, or plain `en`, reads as en-US). One locale per page. The held-out test built a Glasgow festival with US-only rules and nudged a UK budgeting app into US quarterly tax for no design reason (`kb/tests/heldout.md` section 6).
- **Clock:** one clock per page, in the locale's style (table below). US English: "2:05 pm", "3 pm" (no ":00"). Polaris: "Use the 12-hour clock, followed by am or pm"; Mailchimp: "Use numerals and am or pm, with a space in between."
- **Dates:** absolute dates for money, shipping and deadlines, never "this Friday". Check every weekday against the year the date is in: a year written in the date wins ("Fri, Jan 15, 2027" is right on a 2026 page); `claims_inventory.mjs` flags a wrong weekday in either order and a date in the other locale's order (`LOCALE`).

| Locale (`lang`) | Date in UI | Date in running copy | Range | Clock | Money |
|---|---|---|---|---|---|
| en-US (default) | "Tue, Oct 13" | "Tuesday, October 13, 2026" | "Oct 13 to 15" | 12-hour, space: "2:05 pm", "3 pm" (Polaris, Mailchimp) | "$1,250", "$75.50" |
| en-GB | "Tue 13 Oct" | "Friday 15 January 2027": day before month, no comma after the weekday or before the year, no ordinals | "17 to 18 April 2027", "Sat 17 to Sun 18 April" | 12-hour, no space: "10am", "5:30pm", "midday", "midnight" (GOV.UK); 24-hour "17:30" only for timetables, transport and columns of times scanned at a glance (opinion; CLDR's en-GB default) | "£1,250", "£75.50", never "£75.00" (GOV.UK) |
| any other | `Intl.DateTimeFormat(lang)` output, house rules on top | same | "to" or the locale's word | `Intl` default: 24-hour in de, fr, es, it, nl and the Nordic locales ("14:05") | `Intl.NumberFormat(lang, { style: 'currency' })`: "1.250,00 €" (de-DE), "1 250,00 €" (fr-FR) |

Sources: GOV.UK A to Z style guide (Dates: "do not use ordinal numbers", "do not use a comma between the month and year", "use 'to' in date ranges"; Times: "5:30pm (not 1730hrs)", "midday (not 12 noon, noon or 12pm)", "by 11:59pm on Tuesday 14 June"; money: "£75.50 but not £75.00"), https://guidance.publishing.service.gov.uk/writing-to-gov-uk-standards/style-guides/a-to-z-style-guide; ONS content style guide, dates and time ("Do not use the 24-hour clock": "9am 10:30am midday"); CLDR 47 through Node 22 ICU 77: `Intl.DateTimeFormat('en-GB', { hour: 'numeric', minute: '2-digit' })` gives "14:05", and with weekday and year it gives "Fri, 15 January 2027": drop that comma by hand. Currency: the symbol comes from the currency, the format from the locale; when the symbol is ambiguous on the page write the code or the prefixed symbol `Intl` prints ("US$1,250.00" under en-GB, "CA$" under en-US).
- **Time zones:** a page that shows times in more than one zone labels every time with its zone or place ("6:48 pm IST", "9:18 am ET"), at every width: a layout that collapses a column keeps the zone. A page in one zone may name it once. Round 1 printed "lands 6:48 pm" (India time) under "Rates locked 8:52 am ET" at 390 to 1023 (`kb/reviews/benchmark-round1-landing.md` gap 1); `claims_inventory.mjs` warns `ZONE`.
- **No line breaks inside** a date, a time, a price, a range, a number and its unit, or a number and its count noun: no-break spaces inside "Tue,&nbsp;Oct&nbsp;13", "2:05&nbsp;pm", "1,100&nbsp;to&nbsp;2,100", "12&nbsp;people", "7&nbsp;currencies"; a narrow no-break space before units ("340&#8239;g"). Round 1 broke "12 / people" at 390 (`kb/reviews/benchmark-round1-landing.md` gap 2).
- **Numbers:** numerals, commas from 1,000, spelled out only at the start of a sentence (Polaris, Mailchimp); a true minus for negatives in data.
- **Case and spelling:** sentence case for headings, buttons, menus and tabs (Microsoft, GOV.UK); spelling follows the locale: US for en-US ("meters", "program"), UK for en-GB ("metres", "programme", "colour").
- **Truth:** every number in copy matches the data or source it summarises; each promise has one wording; one verb per action across the page. The combined pages carried three false numbers past the critic, the tester and a blind rank (design-copy pipeline notes); only a claim-by-claim check catches them.

## Accessibility (cross-cutting)
WCAG 2.2 AA is the floor in every skill: contrast as above, visible focus, 24x24 CSS px minimum target (44x44 preferred for touch), keyboard operable, no information by color alone, reduced motion respected.

Findings every domain must know (details in design-foundations `references/accessibility.md`):
- Safari drops table semantics when a table's `display` changes (for example to `grid` or `block` for a phone reflow): restate `role="table"`, `row`, `columnheader` and `cell` (design-product-ui `references/01-tables.md`).
- Single-key shortcuts include `/` and `?`, not only letters: WCAG 2.1.4 needs a way to turn them off or remap them (design-product-ui `references/02-find-and-command.md`).
- `aria-label` on a generic `span` or `div` is prohibited; use visible `aria-hidden` text plus an sr-only full value.
- Text over images, textures and art: judge the worst pixel on a render with the text hidden, not the average (design-art-direction `references/03-composition-and-overlays.md`; `tools/lint.mjs` overlay check).
- Pages with a dark theme set `color-scheme` on `:root` so native controls and scrollbars follow.
- Logos and logotypes are exempt from contrast (WCAG 2.2, 1.4.3: "Text that is part of a logo or brand name has no contrast requirement"; W3C Understanding 1.4.11). The exemption ends where the logo is a link or control (it needs a contrasting variant), and it does not cover a favicon's job: **favicon ink reaches 3:1 against light, gray and dark tab strips, or the mark sits on its own field** (opinion; design-graphic SKILL.md fundamental 11, measured with `assets/tab_contrast.py`: a mid-orange mark measured 3.04:1 on white and 2.32:1 on a gray tab).
- WCAG 2.2.2 covers auto-updating content too: a live KPI or ticker beside other content needs pause, stop, hide or a frequency control (W3C Understanding 2.2.2, quoted in `kb/research/motion/07-motion-on-real-pages.md`).
- Announcements while a modal is open come from a live region inside the dialog; a page-level region is inert and silent (design-ux wave 2 test).
- Skip link (2.4.1): when anything focusable sits before `main`, the first Tab lands on a same-page link to `main` that is visible on focus. The lint checks it.

Delivery findings every page must know (design-search `references/07-page-build.md`, facts checked 2026-10-10):
- Googlebot reads only the first 2 MB of uncompressed HTML; self-contained pages with inlined fonts stay well under it (warn at 1 MB).
- Google Search's favicon formats exclude SVG: ship a PNG (larger than 48px) beside any SVG icon.
- Raster assets (social cards, icons) are outside the type scale gate; a 104px wordmark on a social card is deliberate.

## Token schema
One schema for every domain. Primitives hold raw values; semantic tokens point at primitives; components use semantic tokens only.

| Category | Primitive tokens | Semantic tokens | Owner domain |
|---|---|---|---|
| Color | `--color-{hue}-{50..950}`, neutrals add `975`, `990`; `--color-brand` (exact brand value) | `--color-{role}` and `--color-{role}-{variant}` for the roles above, for example `--color-text-muted`, `--color-text-muted-on-tint`, `--color-surface-sunken`, `--color-primary-hover`, `--color-primary-active` (pressed: one step past hover, never equal to it), `--color-danger-subtle` | design-color |
| Illustration | (uses the color primitives) | `--color-illustration-surface`, `--color-illustration-line`, `--color-illustration-accent`, `--color-illustration-accent-fill`; remapped per theme like any role | design-art-direction with design-color |
| Space | `--space-0` to `--space-11` (0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128) | `--space-gap-{sm,md,lg}`, `--space-section` (map to steps, never raw px) | design-layout |
| Type size | `--text-xs` to `--text-5xl` (12 to 61) | `--text-body`, `--text-label`, `--text-heading-{1..4}`, `--text-display`, `--text-display-2` (fluid, may exceed 61, max at most 2.5x min) | design-typography |
| Type other | `--font-{sans,serif,mono}`, `--weight-{regular,medium,semibold,bold}`, `--leading-{tight,snug,normal}` (1.1, 1.25, 1.5) | | design-typography |
| Radius | `--radius-{none,sm,md,lg,xl,full}` (0, 4, 8, 12, 16, 9999px) | `--radius-control`, `--radius-card` | design-layout |
| State | (uses the text color) | `--state-{hover,focus,pressed,dragged}`: `color-mix(in oklch, var(--color-text) 8% / 10% / 10% / 16%, transparent)`, the state layers above; filled controls use `--color-primary-hover` and `--color-primary-active` instead | design-color with design-polish |
| Elevation | `--shadow-{0..4}`, `--shadow-rgb` (tint, as space-separated RGB) | `--elevation-{card,popover,modal}` (ring plus shadow), `--ring` (1px edge), `--highlight` (dark-theme top edge) | design-layout with design-polish (recipe above) |
| Motion | `--duration-{instant,fast,base,slow,page}`, `--ease-{standard,enter,exit,reveal}`; the `linear` keyword for loops, scroll-linked and time-axis motion | `--motion-{hover,enter,exit}` (values in Motion above) | design-motion |
| Icon | `--size-icon-{sm,md,lg,xl}` (12, 16, 20, 24) | `--icon-stroke` (1.5px) | design-graphic with design-polish |
| Size | `--size-control-{sm,md,lg}` (32, 40, 48) | `--size-measure` (52ch) | design-layout; measure: design-typography |
| Breakpoint | sm 640, md 768, lg 1024, xl 1280, 2xl 1536 (media and container queries cannot read custom properties, so use the numbers; container conditions in `rem`: 40rem, 48rem, 64rem, 80rem, 96rem) | | design-layout |

Rules: light and dark themes remap the same semantic names; a component never names a primitive; a new token needs a role no existing token covers.

## Chapter template
Every domain chapter (draft and reference file) uses two layers, in this order.

**Floor: fundamentals and standards (non-negotiable)**
1. Fundamentals: numbered, testable rules. Mark each one `[lint]` if `tools/lint.mjs` checks it, `[judged]` if a person or the tester judges it.
2. Standards: the WCAG criteria, platform rules and numbers that apply, with sources.
3. Decision rules: "if X, do Y", using the token schema above.
4. Numbers: scales, ranges and defaults, matching this file.

**Ceiling: exemplar patterns and signature moves**
5. Exemplar patterns: what the sites in `kb/exemplars.md` share in this domain, with the measured value or a screenshot path for each pattern.
6. Signature moves: named, specific moves a top practitioner makes that a generalist misses, each with its reason and a shipped example.
7. Do and don't, worked examples (brief to finished choice), hand-offs to other domains.

Opinion is labelled opinion. Facts carry a source with a short quote, URL and access date (see the researcher's source policy).

## Fundamentals checklist
Every rendered test page must pass every item. One miss fails the page, however good the rest is. `[lint]` items are hard gates enforced by `node tools/lint.mjs <page.html>` (nonzero exit on any fail); `[judged]` items are checked by the tester on the screenshots from `node tools/render.mjs` at 390, 768, 1024 and 1440px.

| # | Item | How |
|---|---|---|
| 1 | WCAG 2.2 AA automated rules (axe-core tags wcag2a, wcag2aa, wcag21a, wcag21aa, wcag22aa), light and dark scheme, 390 and 1440px | [lint] |
| 2 | Text contrast 4.5:1 body, 3:1 large; contrast cases axe cannot decide (text on images, gradients, overlaps) | [lint] for decidable pairs and, for axe "needs review" nodes, the worst pixel measured on a render with the text hidden (`overlay` check); [judged] only where the overlay check cannot isolate the text |
| 3 | Non-text contrast 3:1 for input borders, icons, focus indicators and selected states, against every surface they sit on in both themes (3.3:1 on raised and tinted surfaces) | [lint] `selected-state` (a selected control against its unselected peer: 3:1 in fill, ink or border, +200 weight, or an underline); [judged] the rest (axe does not measure it); measure with `skills/design-color/assets/oklch_scale.py check` |
| 4 | Targets at least 24x24 CSS px (inline text links exempt); 44x44 preferred on touch | [lint] fail under 24, warn under 44 at 390px |
| 5 | Body line length 45 to 75 characters at 1440px, 35 to 75 at 390px | [lint] `measure` |
| 6 | Every font size on the type scale (fluid display sizes of 39px and up allowed with `clamp()`); reading text at reading size (running text on a marketing page mostly 16px; on an app screen at 390 at most a third of text under 14px; nothing under 12px). Fixed canvases (posters, social images, OG cards) instead keep every text at 14 CSS px or more at the size they are seen (40px on a 1080 canvas in a 390px feed), and in print at 7pt or more, 7pt x distance / 40cm at the viewing distance | [lint] `type-scale`, `reading-size`; on a canvas page (`data-canvas="1080x1350"` or `--canvas`) `canvas-text`, with the responsive checks (measure, type-scale, heading-wrap, nav-parity, 390 overflow) skipped |
| 7 | Every margin, padding and gap on the spacing scale | [lint] |
| 8 | No horizontal scroll at 390px (or at any lint width) | [lint] at 390, 768, 1024 and 1440 (`overflow`) |
| 9 | Visible focus on every element in the tab order (2px ring, 2px offset by default); focus never changes an element's shape or size; a skip link when anything focusable precedes `main`; a sticky header never taller than `scroll-padding-top` | [lint] presence and shape (`focus`, `focus-shape`), skip link (`skip-link`), sticky bar height against `scroll-padding-top` at every lint width, Tab walked on the loaded page and after every control that opens a panel or dialog with no focused element entirely covered (`focus-obscured`, WCAG 2.4.11) (`sticky-header`); [judged] 3:1 contrast of the ring, on the state sheet |
| 10 | If anything moves, `prefers-reduced-motion: reduce` removes the movement (opacity and color up to 150ms may stay); keyboard shortcuts do not animate | [lint] moving keyframes under reduce (`motion`); [judged] keyboard paths, filmed with design-motion `motion-audit.mjs` (`expect: 'none'`) |
| 11 | No information by color alone (errors have icon plus text, links underlined in body copy, charts labelled) | [lint] every visible field error (`[role=alert]`, an `aria-errormessage` target, or the `aria-describedby` target of an `aria-invalid` control) carries an icon or a non-color marker beside its text (`error-icon`); [judged] the rest |
| 12 | Hierarchy: one clear primary action per view, headings in order, scan path obvious; nothing covers a control and no line of text is crushed to one word per line, at 390, 768, 1024 and 1440 | [lint] one filled call to action per screen height (`primary`); controls hit-tested for anything covering them (`occlusion`); squashed flex children and one-word-per-line text (`squash`); [judged] the rest (heading order partly by axe) |
| 13 | Consistency: tokens from the schema, one radius family, one icon style, aligned edges; separate items never run together; words never break inside a control | [lint] radius family (`radius`); one icon style as one cap, one join and no hard-coded icon colors (`icons`, ported from `skills/design-graphic/assets/icon_audit.mjs`); sibling columns sharing top and left edges within 2px (`grid-edge`); text in separate boxes touching (`run-together`); words broken or text in the padding inside controls, labels and cells (`word-break`); every `var()` resolves to a declared token (`undefined-var`); hover and pressed layers use the `--state-*` tokens (`state-layer`); no doubled spaces from a flex gap plus a space (`double-space`); no declaration outside a `:root` or theme token block reads a color primitive `--color-{hue}-{n}` (`primitive-in-component`); [judged] the rest (token names) |
| 14 | Both themes designed (not inverted) when the brief asks for dark mode; `color-scheme` set | [lint] `color-scheme`; [judged] the design |
| 15 | States: hover, focus, active, disabled, error, empty and loading exist where the page needs them; no state shifts layout; no state rule hides a control's content | [lint] every control operated by `tools/operate.mjs`: controls that do nothing when pressed (`dead-control`), a held button that looks like rest or like its disabled fill (`press-state`), an opened control that looks closed with or without reduced motion (`disclosure`), steppers that do not step or disable the wrong button at a bound (`stepper`), layout shift (`state-shift`), every `?state=` URL linted, blank controls measured on pixels (`hidden-content`), a state sheet shows disabled, busy and invalid controls (`state-sheet`; panels warn); [judged] on the state sheet (every control in every state) |
| 16 | Copy is true and consistent: every number matches its source, in every state and after every live update; each promise has one wording; one verb per action; one comparison basis, named; shares and bars proportional; content mechanics as above (the page's locale from `lang`, one clock, every time zoned when the page has more than one zone, weekday-checked dates, no breaks inside dates, prices, ranges, units and counts); true after every primary action (each one has a post-action `?state=` URL) | `node skills/design-copy/assets/claims_inventory.mjs page.html --year <year>` exits 0 (its WEEKDAY, LOCALE, CLOCK and RELATIVE flags) and its STYLE and ZONE warnings are fixed and its PROMISE and PERIOD warnings are fixed or named; [lint] after every action `tools/operate.mjs` re-reads the page: a countdown that grows (`countdown`), one label with two numbers (`label-number`), commit copy still in the future tense after the commit (`stale-commit`), a universal beside its exception or "nobody" beside a count (`contradiction`); `phone-facts` (a number, rate or time shown at 1440 is shown or behind a disclosure at 390), `truth` (repeated numbers change together over 3 live updates, empty states carry no default-state numbers, stopped sources do not tick, the data-attribute contract in `tools/lint-truth.mjs` holds) `proportion` (share columns, 0 to 100 bars, meters that paint a fill) and `explained-by` (a caveat never shows without its alert); [judged] every listed claim ticked against its data, price list or log, then a fresh-context critic's judged pass |

## Change log
- v0.4.6 (2026-10-13, editor-in-chief, from benchmark round 1, `kb/tests/benchmark/round1/RANKED.md` and the critic reviews `kb/reviews/benchmark-round1-landing.md` and `kb/reviews/benchmark-round1-app.md`):
  - Content mechanics: **time zones** (a page with times in more than one zone labels every time, at every width; `claims_inventory.mjs` warns `ZONE`); the no-break list adds a number and its count noun ("12&nbsp;people").
  - Type and checklist row 5: a measure floor of 35 characters at 390 (lint `measure`). Row 6 names `reading-size` (marketing running text mostly 16px; app text at 390 at most a third under 14px).
  - Color roles and checklist row 3: control borders measured on raised and tinted surfaces in dark, 3.3:1 margin; selected states 3:1 against the unselected neighbor or +200 weight or an underline (lint `selected-state`); `text-muted-on-tint` covers hover, pressed and selected layers.
  - Row 16: true after every primary action, each with a post-action `?state=` URL; ZONE warning fixed.
  - Motion: `--duration-page` is 400ms (design-motion reference 07 said 600 "until the editor decides"; decided); hover is `--duration-instant` 100ms everywhere (design-polish said 150).
  - After the round 2 rebuild (`kb/reviews/benchmark-round2-*.md`): checklist rows 15 and 16 name two new lint checks, `dead-control` (every control changes the page when pressed) and `phone-facts` (no number, rate or time shown at 1440 is cut at 390).
  - Operated checks (2026-10-24, Davon chose this round): `tools/operate.mjs`, run by `tools/lint.mjs` on every target, presses every control at 1440 and 390 and re-reads what it leaves behind. Rows 9, 15 and 16 name its checks (`focus-obscured`, `press-state`, `disclosure`, `stepper`, `countdown`, `label-number`, `stale-commit`, `contradiction`; `dead-control` moves into it). On the four benchmark pages it fails 12 of the 14 misses the critics found by operating the page or reading a state, warns on 1 and misses 1 (`kb/tests/benchmark/operate/TALLY.md`).
  - Not a FOUNDATIONS value, settled in skill text: the content box is `min(1280px, 100% - 2 * var(--space-7))` (design-layout reference 06 said 1136 inside 1232), which closes the v0.4 open item without a token.
- v0.4.5 (2026-10-23, approved by Davon in the "Reference sites for the landing page" thread, from `kb/research/motion/08-cinematic-scroll.md`): new curve `--ease-reveal: cubic-bezier(0.22, 1, 0.36, 1)` (easeOutQuint), marketing reveals only; the hero reveal exception now names it. `motion-audit.mjs` accepts it as a token curve. No other value changes.
- v0.4.4 (2026-10-11, editor-in-chief, from the held-out test, `kb/tests/heldout.md` sections 6 and 7): content mechanics were US-only, so a Glasgow festival and a UK budgeting app were written to US rules.
  - Content mechanics: **Locale first**. `<html lang>` picks the row of a new locale table (en-US, en-GB, any other through `Intl`) for dates, clock, ranges, money and spelling. en-GB: "Friday 15 January 2027", no comma, day before month, no ordinals, "to" in ranges, "10am" and "5:30pm" (24-hour only for timetables), "£75.50" never "£75.00" (GOV.UK, ONS, CLDR). The en-US defaults are unchanged.
  - Weekday checks honour a year written in the date. `claims_inventory.mjs` reads en-GB dates and weekday ranges ("Sat 17 & Sun 18 April 2027"), flags `LOCALE` (a date in the other locale's order, an ordinal on en-GB) and warns `STYLE` (am/pm spacing or a weekday comma in the other locale's style); `--self-test` runs its date cases.
  - Checklist row 6: fixed canvases are judged by `canvas-text` at the size they are seen, not by the UI type scale; `tools/lint.mjs` gains a canvas mode (`data-canvas` or `--canvas`) that renders one size and skips the responsive checks, and exempts rotated, mirrored and vertical text from the geometry checks. Row 16 names `LOCALE` and `STYLE`.
  - No token, scale or color value changes.
- v0.4.3 (2026-10-11, editor-in-chief, from the round 4.1 clean-context critic, `kb/reviews/round4.1-critic.md`): two judged fails per page sat in classes a lint can see, so they move into it. Checklist row 11 gains `error-icon` (a field error that is text and color only fails; the dashboard invite error) and row 13 gains `primitive-in-component` (a component that reads `--color-{hue}-{n}` fails; the coffee label curve and the dashboard tooltip and logo), both in `tools/lint-tokens.mjs`. `claims_inventory.mjs` PROMISE now compares subscription rights lists ("Skip, swap or cancel" against "Skip, pause or cancel"). No token, value or default changes.
- v0.4.2 (2026-10-11, editor-in-chief, from the round 4 clean-context critics, `kb/reviews/round4-critic.md` and `kb/reviews/round4.1-critic.md`): checklist row 13 names three new lint checks (`undefined-var`, `state-layer`, `double-space`) and row 16 names `explained-by` and meter fills, all in `tools/lint-tokens.mjs`, `tools/lint-layout.mjs` and `tools/lint-truth.mjs`. The token schema gains the `--state-*` row the `state-layer` check requires, with the Material 3 values already set above. No value or default changes.
- v0.4.1 (2026-10-10, editor-in-chief, from the round 3 clean-context critic, `kb/reviews/round3-critic.md`): every lint check passed on both round 3 pages while the critic found 7 judged gate fails, so the classes it caught by eye move into the lint. No token, value or default changes.
  - Item 8: overflow is checked at every lint width (390, 768, 1024, 1440), not only 390.
  - Item 9: a sticky top bar taller than `scroll-padding-top` at any width fails (`sticky-header`; the dashboard header grew to 142px against 80px at 768 and 1024).
  - Item 12: controls are hit-tested for occlusion and flex children for squashing at 390, 768, 1024 and 1440 (`occlusion`, `squash`; the search field covered "Pause updates", the live dot rendered 2x8).
  - Item 13: sibling-column edges (`grid-edge`), text running together across boxes (`run-together`, "Sep 30$2.62") and words broken inside controls (`word-break`, "Pour-" / "over") are linted.
  - Item 15: blank controls are measured on pixels (`hidden-content`, the state sheet's transparent "Sending" pill) and state sheets must show disabled, busy and invalid controls (`state-sheet`).
  - Item 16: numbers must hold in every state and after live updates (`truth`), shares and bars must be proportional (`proportion`), with a data-attribute contract pages follow (`tools/lint-truth.mjs`); `claims_inventory.mjs` warns `PROMISE` (one promise, two values) and `PERIOD` (two comparison bases). The gate is claimed only after a fresh-context critic's judged pass.
- v0.4 (2026-10-10, editor-in-chief, from the wave 2 pipeline notes of all twelve domains, PR #6 patterns and PR #7 teardowns):
  - Color roles added: `surface-sunken`, `text-muted-on-tint`, with the rule that every muted-text and tint pair is measured (conversion found 4.38:1 and 4.24:1).
  - Dark shadow tokens are `0 0 0 0 transparent`, not `none`, so composed lists keep the highlight (frontend finding 5); `--shadow-0` likewise.
  - Container query conditions in `rem`, never `em` (frontend finding 7).
  - Motion: `--motion-{hover,enter,exit}` values adopted from design-motion; `linear` allowed for loops, scroll-linked and time-axis motion; one hero reveal per marketing page may run to 800ms (opinion; Stripe 800ms and Raycast 700ms measured), 600ms elsewhere; the reduced-motion rule is now precise (no movement; opacity and color up to 150ms), which resolves the conflict between the v0.3 lint (100ms) and `accessibility.md` (150ms).
  - Icons: `--size-icon-{sm,md,lg,xl}` (12, 16, 20, 24) and `--icon-stroke` (1.5px); one cap, one join, no hard-coded colors, linted.
  - Sizes: `--size-control-{sm,md,lg}` (32, 40, 48); 48dp touch on native Android.
  - Content mechanics section: US 12-hour clock, weekday-checked dates, no line breaks inside dates, times, prices, ranges and number-unit pairs, numerals, sentence case, US spelling for US brands, copy matches its data.
  - Accessibility findings: the logo contrast exemption and its limits, favicon contrast (opinion), 2.2.2 for auto-updating content, live regions inside modals, skip link; delivery findings (2 MB Googlebot limit, PNG favicon, raster assets outside the type scale).
  - Checklist: item 16 "copy is true and consistent" (claims inventory plus judged); item 13 backs "one icon style" with the lint `icons` check; item 12 gains the `primary` lint; item 9 gains `skip-link`; item 10 states the reduce rule and the keyboard-path rule; judged rows are read at 390, 768, 1024 and 1440.
  - Not adopted, still open: `--space-12` 160 and `--size-container` (design-layout; the combined pages disagree on 1232 and 1280), a `states` cascade layer (design-frontend), the search gate as a checklist row (kept in the director's loop).
- v0.3 (2026-10-09, editor-in-chief, from the typography, product UI, art direction and polish waves' pipeline notes):
  - Measure default `32em` replaced by `max-inline-size: 52ch` (typography measured eight faces: 66ch gives 81 to 86 characters, 32em gives 61 to 77, 52ch gives 63 to 68). Optional `--size-measure`.
  - Display ramp named above `--text-5xl`: `--text-display`, `--text-display-2`, fluid, max at most 2.5x min; display lines of 100px and up may use leading 0.95.
  - State layers: hover 8, focus 10, pressed 10, dragged 16 percent (design-color said 12 for focus and pressed; aligned to Material 3 and design-polish).
  - Tokens added: `--color-primary-active`, `--color-illustration-{surface,line,accent,accent-fill}`, `--ring`, `--highlight`, `--shadow-rgb`; shadow recipe and `--shadow-0..4` values adopted from design-polish.
  - Accessibility: Safari table semantics, `/` and `?` shortcuts under 2.1.4, `aria-label` on generic elements, worst-pixel rule for text over art, `color-scheme`.
  - Checklist: item 2 gains the lint overlay check; items 9, 13, 14 and 15 gain lint rows (focus shape, radius family, `color-scheme`, state layout shift); item 15 requires a state sheet.
- v0.2 (2026-10-09, editor-in-chief): added owner note, CSS measure default (`32em`), token schema, chapter template and fundamentals checklist. Values unchanged from v0.1.
- v0.1 (2026-10-09): first contract.
