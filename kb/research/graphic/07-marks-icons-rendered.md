# Research 07: Marks and icon sets on rendered pages (wave 2)

Brief: `kb/briefs/graphic/07-wave2-render-test.md`. Researcher, 2026-10-10. Status key: **C** consensus, **X** contested, **O** opinion, **M** measured here.

Network note: font files download (Google Fonts, github.com/google/fonts, npm Fontsource); exemplar hosts and photo hosts are blocked (`kb/exemplars.md`). No exemplar was measured; every exemplar statement below is from published text.

## Key findings

| # | Claim | Quote (under 40 words) | Source | Accessed | Tier | Status |
|---|---|---|---|---|---|---|
| G1 | OFL fonts may be used for logos and other design work with no extra permission. | "Authors of fonts released under the OFL allow you to use their font software as such for any kind of design work." (FAQ 1.1; logos are in its list) | https://openfontlicense.org/ofl-faq/ | 2026-10-10 | 1 | C |
| G2 | Artwork made with an OFL font is not itself under the OFL, so an outlined wordmark is the brand's artwork. | "creating any kind of graphic using a font under the OFL does not make the resulting artwork subject to the OFL" (FAQ 1.13) | https://openfontlicense.org/ofl-faq/ | 2026-10-10 | 1 | C |
| G3 | In display settings use the best ampersand the family has; the italic one is often the better form. | "In heads and titles, use the best available ampersand." (Bringhurst, Elements of Typographic Style, 5.1.3, as quoted) | https://retro.simplebits.com/posts/ampersands-2.html | 2026-10-10 | 3 (book, via secondary) | C |
| G4 | Same point, second source: designers use the most expressive italic ampersand inside upright text. | "Bringhurst advises to choose the most beautiful form" (display sizes); designers "sometimes also use the most expressive italic in an upright context" (paraphrase checked against the page) | https://typefacts.com/en/articles/the-ampersand | 2026-10-10 | 4 | C |
| G5 | Logos are exempt from WCAG contrast (1.4.3 and 1.4.11), because brand rules fix their colors. | "Logos are exempted from contrast requirements, under the assumption that they must comply with stricter color choices" | https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html | 2026-10-10 | 1 | C |
| G6 | An SVG favicon can carry its own dark-mode CSS. | "As with any CSS, it can contain media queries like `@media (prefers-color-scheme: dark)`." | https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs | 2026-10-10 | 4 (widely adopted) | C |
| G7 | Inside an SVG image, prefers-color-scheme follows the OS or the embedding element's color-scheme, not the actual color a browser paints behind it. | "The first circle inherits the `color-scheme` from the OS and can be toggled using the system OS's theme switcher." | https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme | 2026-10-10 | 1 | C (the tab-strip consequence is O) |
| G8 | Lucide's pixel-perfect rule is stated for its own 24px grid with a 2px stroke. | "Icons must have a stroke width of 2 pixels." / "Icons should aim to be pixel perfect so that they will be sharp on low DPI displays." | https://lucide.dev/guide/design/icon-design-guide | 2026-10-10 | 1 (published spec) | C |
| G9 | `vector-effect: non-scaling-stroke` keeps the stroke width independent of the icon's scale. | "the stroke width is not dependent on the transformations of the element (including non-uniform scaling and shear transformations) and zoom level" | https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/vector-effect | 2026-10-10 | 1 | C |
| G10 | Icon weight should match the text weight beside it; Apple pairs each SF Symbol weight with a text weight. | (already sourced in design-polish research 03: Apple HIG SF Symbols) | `kb/research/polish/03-shape-alignment-icons.md` | 2026-10-09 | 1 | C |

## Measured here (tier M)

**M1. Where a stroke lands on device pixels** (`kb/research/graphic/scripts/stroke-snap.mjs`, Chromium via `tools/browser.mjs`, vertical line, 2026-10-10). Partial columns = device-pixel columns with coverage under 95 percent.

| Stroke | Centre x.0 | x.25 | x.5 | x.75 | DPR |
|---|---|---|---|---|---|
| 1px | 2 partial | 2 | **0** | 2 | 1 |
| 1.5px | 2 | 1 | 2 | 1 | 1 |
| 2px | **0** | 2 | 2 | 2 | 1 |
| 1px | **0** | 2 | **0** | 2 | 2 |
| 1.5px | 2 | **0** | 2 | **0** | 2 |
| 2px | **0** | 2 | **0** | 2 | 2 |

Rule: a straight stem is crisp when both edges (centre plus and minus half the stroke) fall on device-pixel boundaries. So 1.5px stems belong on .25 or .75 (crisp at 2x, one soft column at 1x), 1px stems on .5, 2px stems on whole pixels. A Lucide icon (2px on whole pixels at 24) drawn at 16px renders 1.33px on 0.67px steps: no stem is crisp at any density.

**M2. Baseline icon audit** (`skills/design-graphic/assets/icon_audit.mjs`, combined Tally page, 2026-10-10): 17 distinct icons, mixed caps (round and butt) and joins (round and miter), two hard-coded colors (`#ffffff`, `#000000` marks inside status icons), one hard-coded brand-mark stroke, three icons with ink touching the box edge (pad under 1px), soft (partial) pixels 39 to 51 percent of ink at 2x. The fundamentals lint and the polish audit both passed this set: neither looks at caps, joins, hard-coded colors or pixel snapping.

**M3. Wordmark outlining**: Newsreader variable (opsz 72, wght 480) instanced with fontTools; OS/2 cap height describes the default instance only: the instancer keeps 1340 units while the H of the opsz 72, wght 480 instance measures 1430 (7 percent taller), so cap and x height must be measured from H and x of the instance (`skills/design-graphic/assets/wordmark.py`).

**M4. Favicon against tab strips** (`skills/design-graphic/assets/tab_contrast.py`, WCAG 2 ratio, 2026-10-10). Strips are typical light, gray and dark browser chrome grays (opinion: sampled from common default themes, not a spec). Ember & Oak orange `#f26b21`: 3.04 on `#ffffff`, 2.73 on `#f1f3f4`, 2.32 on `#dee1e6`, 3.97 on `#35363a`, 5.29 on `#202124`, 5.48 on `#1e1e1e`. Tally teal `#14b8a6`: 2.49, 2.24, 1.90, 4.85, 6.47, 6.70. Neither bare brand color clears 3:1 on every strip; inside a warm 950 field the ring measures 14.92 and the ember 5.28.

## Conflicting views
- Sprite (`<use href>`) vs inline SVG for icon sets: sprites are smaller, but the shapes sit in a shadow tree, so `tools/lint.mjs` icon-stroke and any DOM-based audit cannot see them (observed here). Inline per icon from one source module keeps them auditable. (X; tooling-driven)
- Two-tone favicon with a dark-mode media query (Evil Martians, G6) vs a mark on its own field (this round): the media query follows the OS scheme, which can disagree with a themed tab strip (G7), and a bare mid-lightness color fails gray strips (M4). (O)

## Exemplar notes (published text only, not measured)
- Linear 2024 and 2026 redesign posts and Apple's SF Symbols weight pairing are already in `kb/research/polish/03-shape-alignment-icons.md`; reused, not re-quoted.
- Teardowns: none possible (hosts blocked).

## Likely to change
- SVG favicon support and how browsers resolve `prefers-color-scheme` inside favicons; recheck yearly.
