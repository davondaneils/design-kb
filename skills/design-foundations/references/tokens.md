# Tokens and scales

Mirror of `kb/FOUNDATIONS.md` v0.5 (token sections, icons, sizes and content mechanics). FOUNDATIONS is the source of truth: if this file and FOUNDATIONS differ, FOUNDATIONS wins and the librarian re-syncs this file. Only the editor-in-chief changes the values.

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
Durations: instant 0 to 100ms, fast 150ms, base 200 to 250ms, slow 300 to 400ms, page 400ms (`--duration-page`; 600ms is the ceiling, not the token). Hover is `--duration-instant` (100ms; Linear hover `.1s`, `kb/teardowns/linear-home.md`). Easing: standard `cubic-bezier(0.2, 0, 0, 1)`, enter (decelerate) `cubic-bezier(0, 0, 0, 1)`, exit (accelerate) `cubic-bezier(0.3, 0, 1, 1)`. Always honor `prefers-reduced-motion`.

- **Semantic pairs** (a duration plus a curve, for transition shorthands; design-motion `assets/motion-tokens.css`): `--motion-hover: var(--duration-instant) var(--ease-standard)`, `--motion-enter: var(--duration-base) var(--ease-enter)`, `--motion-exit: var(--duration-fast) var(--ease-exit)`. Use: `transition: background-color var(--motion-hover)`.
- **`linear` is allowed** for loops (spinners, marquees), scroll-linked motion (the scroll is the easing) and reveals whose x axis is time (a chart drawing on along a date axis). Never on an object that starts and stops (design-motion SKILL.md fundamental 6 and signature move 17).
- **Marketing reveal ceiling (opinion).** Anything a person triggers stays at 600ms or less. A marketing page may give **one hero reveal per page** up to **800ms**, on `--ease-enter` or a strong ease-out, played once on load and removed under reduced motion. Measured exemplars do this: Stripe reveal transforms `.8s cubic-bezier(.165,.84,.44,1)` (`kb/teardowns/stripe-home.md`) and Raycast extension cards `.7s cubic-bezier(.215,.61,.355,1)` (`kb/teardowns/raycast-home.md`). NN/g puts most UI animation at 100 to 500ms and says about 500ms starts to "feel like a drag" (`kb/research/motion/02-timing-easing.md`), which is why the exception covers one unprompted entrance only. Everywhere else, 600ms is the ceiling.
- **Reduced motion** (`prefers-reduced-motion: reduce`): nothing moves, scales, rotates or resizes. Opacity and color changes may stay at `--duration-fast` (150ms) or less, played once; loops stop. The lint fails any animation whose keyframes change position, size or transform under reduce, and warns on opacity or color animations over 150ms or looping. This replaces the v0.3 lint's flat 100ms threshold, which failed the 150ms fades that `accessibility.md` allows.
- Scripts read motion tokens from CSS (`getComputedStyle`); no millisecond literals in JS (design-motion).
- **Motion ladder (v0.5).** A page that moves uses three to five duration bands, one per job, and names them in its motion plan: hover and press (`--duration-instant` 100ms or `--duration-fast` 150ms, one choice per page, held everywhere), UI change (`--duration-base` to `--duration-slow`, 200 to 400ms), entrance (`--duration-page` 400ms, or the one hero reveal up to 800ms), reveal on scroll (`--duration-reveal` 600ms; may run to 1000ms on text that blurs in, as Linear does), and **product scenes** (below). Measured: every exemplar that moves uses three or more bands; the benchmark's Ferry page used one (`kb/teardowns/motion-imagery.md` section 2).
- **Stagger and travel.** Stagger gaps 20 to 80ms (`--stagger` 40ms default); total spread of one group at most 500ms for text and 800ms for cards. Entrance travel 8 to 50px (`--travel` 16px default) or a full-line mask (`translateY(100%)` inside `overflow: hidden`); nothing slides in from off-screen. Measured: Stripe 50ms over 22 words, Linear 33ms, Apple 20ms, Raycast 80ms on cards; travel 16, 20, 30, 50px (same file).
- **Product scenes** (the one exception to the 600ms ceiling, alongside the hero reveal). A scene is a scripted timeline inside a product mock-up that acts out the product's core state change: beats of 1200 to 4500ms, each state held at least 1000ms so it can be read, a loop of at most 12s with a rest of at least 2s between plays, and pause on hover, focus or tab-hidden. A scene runs only while on screen, never on a control, and under reduced motion it is replaced by its most informative frame as a still. Anything that runs longer than 5 seconds beside other content gets a visible pause control (WCAG 2.2.2). Measured: Stripe's mock-ups run 1.42s, 2.26s, 4.48s and 11.95s timelines with holds and a 4s rest; Raycast presses keys at 1 to 1.5s beats (same file). Tooling: `kb/teardowns/choreo-probe.mjs` records them; design-motion `assets/scene.js` builds them.
- **Visual plan (v0.5, owner design-art-direction).** A marketing page puts a visual with a named job on at least 70% of its screen-height slices at 1440 and at 390 (type-only beats such as a quote or pricing are allowed, and named); a product page shows the product as at least three distinct fragments at different scales or crops, each showing the feature its section names; and every visual shares one stated treatment (a fill, a chrome, a grade or a line weight). Measured: Stripe 14 of 17 screens, 12 fragments; Linear 10 of 12, 5 fragments; Framer 12 of 12; the benchmark's Ferry 1 of 7, one card (same file). Check: `choreo-probe.mjs` `screensWithVisual` and `counts.productMock`; label each visual `data-visual="product|photo|illustration|chart"`.

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

## Token schema
One schema for every domain. Primitives hold raw values; semantic tokens point at primitives; components use semantic tokens only.

| Category | Primitive tokens | Semantic tokens | Owner domain |
|---|---|---|---|
| Color | `--color-{hue}-{50..950}`, neutrals add `975`, `990`; `--color-brand` (exact brand value) | `--color-{role}` and `--color-{role}-{variant}` for the roles above, for example `--color-text-muted`, `--color-text-muted-on-tint`, `--color-surface-sunken`, `--color-primary-hover`, `--color-primary-active` (pressed: one step past hover, never equal to it), `--color-danger-subtle` | design-color |
| Visual (v0.5) | (uses the color, shadow and radius primitives) | `--visual-treatment` (a keyword naming the page's one treatment: `echo-fill`, `chrome`, `grade`, `line`), `--visual-fill` (the echoed hero fill behind every product fragment), `--elevation-fragment` (below-only stacked shadow: negative spread equals the y offset, as Stripe's `0 30px 45px -30px`), `--fragment-scale` (0.6 to 1, the transform scale of a mock-up crop) | design-art-direction |
| Illustration | (uses the color primitives) | `--color-illustration-surface`, `--color-illustration-line`, `--color-illustration-accent`, `--color-illustration-accent-fill`; remapped per theme like any role | design-art-direction with design-color |
| Space | `--space-0` to `--space-11` (0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128) | `--space-gap-{sm,md,lg}`, `--space-section` (map to steps, never raw px) | design-layout |
| Type size | `--text-xs` to `--text-5xl` (12 to 61) | `--text-body`, `--text-label`, `--text-heading-{1..4}`, `--text-display`, `--text-display-2` (fluid, may exceed 61, max at most 2.5x min) | design-typography |
| Type other | `--font-{sans,serif,mono}`, `--weight-{regular,medium,semibold,bold}`, `--leading-{tight,snug,normal}` (1.1, 1.25, 1.5) | | design-typography |
| Radius | `--radius-{none,sm,md,lg,xl,full}` (0, 4, 8, 12, 16, 9999px) | `--radius-control`, `--radius-card` | design-layout |
| State | (uses the text color) | `--state-{hover,focus,pressed,dragged}`: `color-mix(in oklch, var(--color-text) 8% / 10% / 10% / 16%, transparent)`, the state layers above; filled controls use `--color-primary-hover` and `--color-primary-active` instead | design-color with design-polish |
| Elevation | `--shadow-{0..4}`, `--shadow-rgb` (tint, as space-separated RGB) | `--elevation-{card,popover,modal}` (ring plus shadow), `--ring` (1px edge), `--highlight` (dark-theme top edge) | design-layout with design-polish (recipe above) |
| Motion | `--duration-{instant,fast,base,slow,page,reveal}`, `--ease-{standard,enter,exit}`, `--stagger` (40ms), `--travel` (16px); the `linear` keyword for loops, scroll-linked and time-axis motion; `steps(1)` for cursors and pixel-grid figures | `--motion-{hover,enter,exit}` (values in Motion above); scene beats are set per scene in `data-beats`, never as tokens | design-motion |
| Icon | `--size-icon-{sm,md,lg,xl}` (12, 16, 20, 24) | `--icon-stroke` (1.5px) | design-graphic with design-polish |
| Size | `--size-control-{sm,md,lg}` (32, 40, 48) | `--size-measure` (52ch) | design-layout; measure: design-typography |
| Breakpoint | sm 640, md 768, lg 1024, xl 1280, 2xl 1536 (media and container queries cannot read custom properties, so use the numbers; container conditions in `rem`: 40rem, 48rem, 64rem, 80rem, 96rem) | | design-layout |

Rules: light and dark themes remap the same semantic names; a component never names a primitive; a new token needs a role no existing token covers.

## Starter token file (non-color)
Paste into `@layer tokens`. Values are the contract above; color primitives and roles come from design-color (`references/ui-tokens-themes.md`), the shadow recipe is in Radius and elevation above (dark levels are `0 0 0 0 transparent`, never `none`).

```css
:root {
  --space-0: 0; --space-1: 2px; --space-2: 4px; --space-3: 8px; --space-4: 12px; --space-5: 16px;
  --space-6: 24px; --space-7: 32px; --space-8: 48px; --space-9: 64px; --space-10: 96px; --space-11: 128px;

  --text-xs: 0.75rem; --text-sm: 0.875rem; --text-base: 1rem; --text-lg: 1.25rem; --text-xl: 1.5625rem;
  --text-2xl: 1.9375rem; --text-3xl: 2.4375rem; --text-4xl: 3.0625rem; --text-5xl: 3.8125rem;
  --leading-tight: 1.1; --leading-snug: 1.25; --leading-normal: 1.5;
  --weight-regular: 400; --weight-medium: 500; --weight-semibold: 600; --weight-bold: 700;
  --size-measure: 52ch;

  --radius-none: 0; --radius-sm: 4px; --radius-md: 8px; --radius-lg: 12px; --radius-xl: 16px; --radius-full: 9999px;

  --size-control-sm: 32px; --size-control-md: 40px; --size-control-lg: 48px;
  --size-icon-sm: 12px; --size-icon-md: 16px; --size-icon-lg: 20px; --size-icon-xl: 24px; --icon-stroke: 1.5px;

  --duration-instant: 100ms; --duration-fast: 150ms; --duration-base: 200ms; --duration-slow: 300ms; --duration-page: 400ms; --duration-reveal: 600ms; --stagger: 40ms; --travel: 16px;
  --ease-standard: cubic-bezier(0.2, 0, 0, 1); --ease-enter: cubic-bezier(0, 0, 0, 1); --ease-exit: cubic-bezier(0.3, 0, 1, 1);
  --motion-hover: var(--duration-instant) var(--ease-standard);
  --motion-enter: var(--duration-base) var(--ease-enter);
  --motion-exit: var(--duration-fast) var(--ease-exit);
}
```
