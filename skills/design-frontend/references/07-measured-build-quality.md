# 07 Measured build quality

How to prove a build: lint it, measure it, diff it. Sources: research `kb/research/frontend/07-measured-build-quality.md` (claims C1 to C34, measurements M1 to M8, all accessed 2026-10-10). Numbers marked M are from the two design-kb test pages (`kb/tests/design-frontend.md`); they are evidence for the rule, not universal constants. Opinion is marked as opinion.

## Tools (in `assets/`, run with Node and the repo's playwright-core; Chromium at `/opt/pw-browsers`)

| Tool | Answers | Run |
|---|---|---|
| `pixel-diff.mjs` | Did the refactor change any pixel? | `node pixel-diff.mjs before.html after.html --widths 390,768,1024,1440 --schemes light,dark --queries "state=empty,open=palette" --out diffs` |
| `vitals.mjs` | LCP and its element, CLS, INP proxy, TBT, TTFB, wire bytes, throttled | `node vitals.mjs page.html --runs 7 --interact "clickall:thead .sort; press:Control+k; type:#q=se; hover:#chart" --json out.json` (`--profile desktop`, `--repeat` for a warm cache, `--storage key=value` for a returning user) |
| `weight.mjs` | Bytes by part (fonts, data URLs, CSS, SVG, script, HTML), before first paint and before LCP | `node weight.mjs page.html --lcp hero-title` |
| `css-audit.mjs` | Layers, token discipline, hover guards, logical properties, `:has` and container query use | `node css-audit.mjs page.html` (exit 1 on any fail) |
| `tools/lint.mjs` (repo) | Contrast, targets, focus, fallback fonts, overflow, type scale | `node tools/lint.mjs page.html --states state=a,state=b` |

Order: lint, then css-audit, then pixel diff, then weight, then vitals. A page that fails lint is not measured further.

## Part 1. The floor (fails the build)

### 1.1 Proof of no visual change
A refactor that is meant to change code and not look is proven by a pixel diff, not by eye.
- Diff before and after at 390, 768, 1024 and 1440 px, light and dark, plus every review state (`?state=`, `?open=`, `?density=`). Pass is 0 differing pixels (`pixel-diff.mjs`, tolerance 0).
- A deliberate change (a bug fix that becomes visible) is switched off on the after page with `--inject-after "<css>"`, so the rest still has to diff at 0. Then show the change on its own and list it with its reason.
- When a diff appears, bisect it: `--inject "<css>"` adds the same rule to both pages until the diff disappears, and a computed-style diff of the element (every property, before against after) names the property. Do not guess. (Measured: the three non-obvious diffs in this test were found this way, M6 to M8.)

### 1.2 Lab vitals with a stated profile
- Report LCP (and its element), CLS, an INP proxy, TBT, TTFB and wire bytes; median of at least 5 runs (7 for LCP, which is noisy in the lab: coffee first-view LCP ranged 848 to 1080 ms across sessions on the same file).
- Mobile profile is Lighthouse's: 150 ms RTT, 1.6 Mbps down, 750 Kbps up, 4x CPU, 412x823 at DPR 1.75 (C1 to C3). Say when you add latency yourself: CDP's latency setting was not applied to `127.0.0.1` in this Chromium, so `vitals.mjs` delays responses in its own server (research finding 1).
- Thresholds: LCP 2.5 s or less, CLS 0.1 or less, INP 200 ms or less (C5, C12, C14). Lab numbers are a regression check, not a field p75. Say so in the report.
- INP proxy: script the interactions people actually make (sorting, toggles, opening the palette, typing), observe Event Timing with `durationThreshold: 16` and group by `interactionId` (C8, C9). Hover and scroll do not count for INP (C7), but they do count for CLS, which is why the script also hovers. Run the interactions after load: a tap, scroll or key press stops LCP reporting (C11).

### 1.3 Gate items the lint does not catch
`tools/lint.mjs` checks contrast, targets, focus, fallback fonts, overflow and the type scale. It does not check the following, so the build checks them on the markup:
- a skip link to `main`, and `main` with `tabindex="-1"` so the jump moves focus (the combined coffee page had none: a gate miss the lint passed);
- one `h1`, landmark set, `nav` names;
- every form has a real `action` and `method` and every input a `name`, so it works before JavaScript;
- `theme-color` for both schemes and a favicon (an inline SVG data URL keeps the page self-contained);
- a sync inline script that applies saved layout state (density, theme) before the first paint, placed by measurement (move 10).

### 1.4 CSS architecture, checked by `css-audit.mjs`
Fail checks (exit 1): a raw color outside the token layer, a primitive token used in a component, raw px spacing, `font-size` in px, a type token in px, `transition: all`, a `:hover` rule outside `(hover: hover)`. Warn checks: physical inline-axis properties, `vh`, motion not guarded by reduced motion, `min-width` and `max-width` media syntax, ID selectors.

Rules behind those checks:
1. **One layer order, declared once.** `@layer reset, tokens, base, layout, components, states, utilities;` Unlayered CSS beats every layer (C23), so leave only what must win on purpose outside a layer, and say why in a comment.
2. **Important user preferences go in the first layer.** Important declarations reverse the layer order (C24), so `prefers-reduced-motion` and `forced-colors` overrides with `!important` in `reset` beat every later layer. Put them in `utilities` and they lose to `reset` and win only over nothing.
3. **Colors through `light-dark()`**, with `color-scheme: light dark` on `:root` (C21; Baseline 2024, C22). Only colors (and images in newer engines) can go through it. Opacity, blend modes and other non-color theme values stay in one `@media (prefers-color-scheme: dark)` block in the tokens layer.
4. **Components read roles, not primitives.** Illustration and chart colors are roles too (`--color-illustration-object`, `--color-on-danger-mark`). A primitive in a component is a theme bug waiting for the second scheme.
5. **Range media syntax in em**: `(width >= 48em)`, `(40em <= width < 48em)` (C30, C31). No `max-width: 767px` pairs.

## Part 2. The ceiling (what a top build team knows)

Each move has a number from these two pages or a source.

1. **An illustrated hero's LCP is its text.** Inline `<svg>` is not an LCP candidate (C10; an SVG file in `<img>` and an `<image>` inside an SVG are), so on both pages LCP is the `h1` (coffee) or the answer paragraph (dashboard) (M1). The hero's speed then depends on HTML bytes and font delivery, not on image work. Optimising the SVG does nothing for LCP; it only helps total weight (coffee SVG is 35.0 KB gzip).

2. **Know where the head ends.** The browser needs everything for first paint in the head; the first round trip carries about 14 KB (C17, a rule of thumb). Coffee ships 53.1 KB gzip before first paint, 43.8 KB of it two base64 Newsreader files (M2). Measure it with `weight.mjs`, which splits bytes into fonts, data URLs, CSS, SVG, script and HTML, before first paint and before the LCP element.

3. **Font delivery is a first-view versus repeat-view trade, so pick by audience** (M3, medians, mobile profile):

   | Variant | Coffee first / repeat LCP | Dashboard first / repeat LCP |
   |---|---|---|
   | Fonts inlined in head | 1036 / 832 ms | 968 / 912 ms |
   | Inline data at end of body | 792 ms / not run | not run |
   | External hashed woff2 + preload, cached 1 year | 1160 / 612 ms | 1020 / 624 ms |

   Decision rule (opinion, from these numbers): a page most people see once (a campaign landing page) inlines its fonts or ships them as early, preloaded files from the same origin; an app people return to daily ships external, hashed, immutable files, which win every repeat view by 220 to 290 ms and cut repeat bytes from 46.3 to 17.7 KB. web.dev says not to inline font files and to inline the declarations (C18, C19); the numbers say that is right for repeat visits and slightly wrong for a single first visit. Moving inline font data to the end of the body paints 244 ms sooner but shows the fallback first: a visible swap of a 96 px headline, which is a design change, so it fails "no visual change".

4. **Composed shadows die on `none`.** A token set to `none` and composed into a list (`box-shadow: var(--highlight), var(--shadow-1)`) makes the whole declaration invalid at computed-value time, so nothing paints (M4). FOUNDATIONS' dark `--shadow-1: none` did this on both combined pages: the dark primary-button highlight never rendered. Write "no shadow" as a transparent shadow: `0 1px 2px light-dark(rgb(var(--shadow-rgb) / 0.06), transparent)`. It stays valid, paints nothing and lets the shadow live in `light-dark()`. For whole overlay recipes (popover, modal) swap the recipe in the dark scheme block instead: a transparent blurred layer is not quite free, it changed the rasterised rounded corners of the dashboard dialogs by up to 7/255 on about 40 pixels (pixel diff, then bisected with `--inject-after`).

5. **Pointer-driven UI positioned with `left` is layout shift.** Hover is not "recent input" (only discrete input is, C15), so a chart tooltip moved with `style.left` scored four shifts during a 0.6 s hover (dashboard CLS 0.006, M5). Move it with `translate` (C16), batch the pointer handler into `requestAnimationFrame`, and it scores 0.

6. **`em` in a container query is the container's em.** Relative units in container conditions resolve against the query container (C29). The dashboard content is 14 px, so `@container (width >= 44em)` fired at 616 px, not 704 px: four KPI columns at a 768 px viewport and a 158 px shorter page (M6). Media queries resolve `em` against the initial 16 px. Use rem in container queries.

7. **A viewport breakpoint can invert available width.** At 1023 px the dashboard sidebar is a 56 px rail and the content is 934 px wide; at 1024 px the sidebar is 240 px and the content is 719 px (research finding 13). A viewport rule shows two KPI columns in the wider space and four in the narrower. A container query on the content (`container: content / inline-size`, C27, Baseline 2023, C28) follows the space the component actually has. This changes the look between 793 and 1023 px; say so and show it, as this test does.

8. **`:is()` is not a free shorthand.** It takes its most specific argument's specificity (C32). `:is(.num, td, kbd, time)` gave `kbd` class weight, so it beat a later `kbd { font: ... }` reset and changed glyph widths (98 pixels per screenshot, M7). Use a plain selector list, or `:where()` when you want 0 specificity.

9. **Logical properties on the inline axis only** (opinion, measured cost). `padding: 0 X` is already writing-mode safe. Converting it to `padding-inline: X` drops the 0 on the block axis and the UA button `padding-block` (1 px in Chromium) comes back, so the button grows 2 px (M8). Convert asymmetric inline values (`margin-left`, `text-align: left`, `left`); leave symmetric shorthands and the block axis alone. Art and chart coordinates are physical by nature and stay physical.

10. **A head script for saved state is worth its cost only when the state changes layout.** Measured on the dashboard (desktop profile, 7 runs each, interleaved; M9): with a saved compact density, the 8-line state script at the end of body let Chromium paint the default density first in 4 of 7 runs and then shift the page head (CLS 0.005 to 0.074); merging it into the top of the app script was no better (5 of 7). In the head it gave CLS 0 in 7 of 7. The price: first paint and LCP about 40 ms later for every visitor (dashboard 192 to 236 ms; coffee about 244 to 278 ms with its `js` class in the head), and the same when the script sat after the `<style>` or at the start of `<body>` (268 to 288 ms). Rule: state that changes layout (density, theme) goes in the head and pays; state that only changes paint off screen (coffee's `js` class gates a below-the-fold chart animation) goes at the end of body. Check both with `vitals.mjs --storage key=value` (CLS) and a plain run (LCP). Note the trap in testing this: the combined dashboard never read the saved density at all, so its "CLS 0 with a saved compact density" proved nothing. Seed storage and confirm the state applied before trusting a 0. Mechanism not isolated (opinion: a parser-blocking script before the content changes when Chromium schedules its first frame).

11. **`:has()` and container queries are Baseline; scope `:has()` tightly** (C26). `:has()` anchored on `body`, `:root` or `*` re-evaluates on every DOM change; anchor it on the component.

## Part 3. What done looks like
- Pixel diff 0 at 4 widths, 2 schemes and every state, with intended changes listed and shown.
- Lint 0 fails before and after, every state.
- `css-audit.mjs` 0 fails; remaining warnings explained.
- Vitals good on the mobile profile and not worse than before beyond noise.
- A weight table (before first paint, before LCP, total, by part) and a stated font delivery choice with its reason.

## Out of scope
Accessibility rules (design-foundations `references/accessibility.md`); image pipelines (`references/05-images-fonts.md`); visual design changes.
