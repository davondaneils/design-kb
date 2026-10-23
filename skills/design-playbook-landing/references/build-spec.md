# Build spec: decide in values before the first line

A landing page drifts toward the average when its decisions are adjectives ("premium", "clean", "more whitespace"). The fix the scroll-driven template libraries sell is a spec where every decision is a value, a negative or a mechanism, written once in a file and re-read on every edit. Research and sources: `kb/research/motion/08-cinematic-scroll.md` sections A and B (Scrolltide build prompts, eBook samples, accessed 2026-10-23; tier 5 practitioner material, so the values below are ours from FOUNDATIONS unless credited).

## 1. Rules (non-negotiable)
1. **Values, not adjectives.** Every line of the spec is a number, a hex, a token, a named mechanism or a "do not". "Feel premium" is not a line; "display tracking -0.02em, one accent on 3 elements or fewer per screen" is (Scrolltide: "name a mechanism and it gets copied; name an appearance and it gets averaged").
2. **The spec lives in a file in the project**, next to the strategy brief, and is read before every edit pass. Chat instructions stop being seen once a session is long and the page drifts back one edit at a time (Scrolltide eBook p61). The file doubles as the scope the client signs (same source).
3. **Negatives are written down.** A "never-list" for the project, plus the house never-list in section 3. Negatives leave nothing to interpret (Scrolltide eBook p25).
4. **Tokens come from FOUNDATIONS.** The spec picks from the scales; it never invents a value between steps ("a closed spacing scale, nothing between": Scrolltide p25; our scale is FOUNDATIONS Spacing).

## 2. The sixteen decisions (fill every row before layout)
From Scrolltide's "decided before you paste" list, mapped to where our skills answer each one.
| # | Decision | Answered by |
|---|---|---|
| 1 | Grid and measure | design-layout 01; measure `52ch` (FOUNDATIONS) |
| 2 | Type scale and the display ramp | design-typography 01, 07; `--text-display` |
| 3 | Tracking at display size, as a number | design-typography 05 |
| 4 | Colour ratios: ground, one accent and how many elements it may touch per screen | design-color; opinion: accent on 3 elements or fewer per screen (Scrolltide uses 4 or fewer) |
| 5 | Section order | design-layout 06 flatplan; design-copy 01 |
| 6 | Easing curve(s) | FOUNDATIONS Motion; design-motion 08 for cinematic pages |
| 7 | Stagger timing | design-motion expert move 8 |
| 8 | Scroll triggers: which three moments move | design-motion 08 rule 2 |
| 9 | Hover behaviour, per control | design-polish 01 |
| 10 | Depth and grain: radius family, hairline or shadow, grain opacity | FOUNDATIONS Radius and elevation; design-polish 02, 04 |
| 11 | Breakpoints and the phone edit list | design-layout 04, 06 |
| 12 | Focus states | design-foundations accessibility |
| 13 | Reduced-motion fallback, per animation | design-motion 05 |
| 14 | Image loading: LCP image, lazy, poster frames | design-frontend 05 |
| 15 | Copy tone | design-strategy 04; design-copy 03 |
| 16 | What not to do: the never-list | section 3 |

## 3. House never-list (copy into every spec, then add the project's own)
- No gradient text, no glass cards, no floating 3D blobs, no purple-to-blue gradients (Scrolltide's standing list, the four tells of generated sites).
- No card strokes and fills at once, no section dividers when space can separate, no overlays on video unless the overlay check needs one (Scrolltide p25; design-art-direction 03).
- No italic or colour emphasis on more than one phrase per screen; on the page, at most three (opinion, from the Flagship desktop clutter review of 23 October 2026, where about 20 italic H2 words had stopped meaning anything).
- No countdowns, pop-ups mid-scroll or count-up numbers (design-copy; design-motion rule 10).
- Do not change the colour scheme, type or spacing scale during an edit pass unless the spec changes first (Scrolltide p25: "do not change the colour scheme unless I ask").

## 4. Spec skeleton
Six blocks, about a page. Values here are examples on our tokens.
```text
ART DIRECTION
Ground --color-bg #F6F3EE. Accent --color-primary #0F5132, on 3 elements or fewer per screen.
States: success, warning, danger from the palette; never a new green.
Grain 3% overlay on dark sections only. Never-list: section 3 plus <project items>.

TYPOGRAPHY
Display: <face> 400, tracking -0.02em, --text-display, leading 0.95 on one line, 1.05 on two.
H2 --text-3xl, leading 1.1. Body --text-base, leading 1.5, max-inline-size 52ch.
Labels: --text-xs, uppercase, +0.08em, only when they carry a fact.

SPACE AND SURFACES
Section padding --space-10 desktop, --space-8 phone, identical between sections.
Radius family 12. Hairline 1px --color-border; shadow --shadow-1 on raised cards only.

MOTION
Moving moments: <1. hero clip plays once, holds last frame> <2. pinned how-it-works stage> <3. none>.
Reveals below the fold: opacity + 12px rise, 600ms, --ease-enter, once.
Hero H1 never starts at opacity 0. Reduced motion: stills and crossfades.

SECTIONS (one block each, in order)
01 Hero: H1 (value line), one supporting line, one filled action, one proof line.
02 Proof: one ruled row of three numbers with sources.
...

ACCESSIBILITY
Focus ring 2px, offset 2px, --color-focus-ring. Contrast 4.5:1 body, 3:1 display and UI.
```

## 5. Expert moves
1. **Spec the section shape once and repeat it.** One header pattern (label with a fact, H2 left, one short paragraph top right, one picture) used by every section reads as a system and lets the eye learn the page once (Scrolltide catalogue pages, measured 2026-10-23). Vary the picture, never the frame.
2. **Withhold from the first build.** Specify ground, type, sections and the never-list first; add motion and depth after the static page passes the gate (Scrolltide stage 4: "what to withhold from the first prompt"). Motion added to a page that fails fundamentals hides the failure.
3. **Plan where the empty third goes** before any image is made: which side of each hero or chapter image stays empty and unlit for type (Scrolltide stage 3; design-motion 08, "make the frames").
4. **Log two columns in the critique loop**: what the build got right on its own, and what a person had to decide. Count turns, not hours (Scrolltide eBook p296). The second column is the material for the next skill update.
5. **Versions in one place.** Tool and model names live in one dated line of the spec; everything else is mechanism, so the spec survives a tool change (Scrolltide eBook p6).
