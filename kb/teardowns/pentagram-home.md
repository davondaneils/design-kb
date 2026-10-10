# Pentagram: home page

- **URL:** https://www.pentagram.com (final URL https://www.pentagram.com/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/pentagram-home.json`); headline, filter and card details from `kb/teardowns/probe.mjs` plus computed-style and stylesheet reads. Screenshots: `kb/exemplars/shots/pentagram-home-1440-light.jpg`, `pentagram-home-390-light.jpg` (capped at 6000px tall; the page is 25,615px at 1440 and 34,640px at 390).
- **Caveats:** a cookie banner was open during measurement, so the most common 16px text sample and the 4px button radius are partly banner. Several lazy images had not painted in the capture (flat `#e3e4e5` boxes). The hero caption sits on a photo; its measured 1.27:1 pair is against the placeholder gray, not the photo.
- **Strongest in:** brand (one plain face, zero ornament, the work is the color), editorial layout, imagery, a sentence-shaped filter as navigation.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | `Plain` (fallback Arial) for every character; only `Plain 400` is loaded. The wordmark is drawn, not set. |
| Weights | 400 everywhere. Tokens declare 350 (display) and 375 (heading 2), 500 on the nav "Site navigation" label. No bold except the cookie banner. |
| Type steps (1440) | 52 (section and project heads, `f-heading-1`), 32 (pull quote), 19 (wordmark link), 16 (body, captions, nav), 13 (category tags, `f-caption`) |
| Type tokens (root vars) | display-1 131px (8.1875rem) / 1.0 / -0.04em / 350; heading-2 65px / 1.05 / 375; heading-1 52px / 1.05; heading-3 41px / 1.2; heading-4 32px / 1.2; heading-5 24px / 1.2; body 16px / 1.25; caption 13px / 1.25. All set `font-feature-settings: "case" on`. |
| Line height | 52/54.6 (1.05), 32/38.4 (1.2), 16/20 (1.25), 13/16.25 (1.25) |
| Tracking | -1.04px at 52 (-0.02em), -0.32px at 32 (-0.01em), 0 at 16 and below |
| Hero (390) | Section heads drop to 36px/37.8 (1.05), -0.36px; quote to 24px/28.8. Body stays 16px. |
| Text colors | Ink `#1a1a1a` (17.4:1 on white); secondary `#767676` (4.54:1 on white); tertiary `rgba(0,0,0,.56)` (4.94:1); on dark `#222`: white (15.9:1) and `rgba(255,255,255,.56)` (5.92:1); `#8c8c8c` on black (6.25:1) |
| Surfaces | White main; `#222222` dark feature bands (10,874 area units at 1440); black `#000` blocks; `#e3e4e5` image placeholders |
| Accent | None in chrome. Link hover underline in `rgb(230,20,40)` red, drawn as a 1px background gradient at 98% of the line box. |
| Filter bar | `rgba(232,232,232,.8)` with `backdrop-filter: blur(7.5px)`, radius 8px, padding 0 8 3; becomes `position: fixed; bottom: 24px` once you scroll. Chips: active black with white text and an inline x icon, inactive at opacity .3. |
| Radii | 0 on all imagery and cards; 4px buttons; 8px on the filter bar and one inverse panel |
| Shadows | None. Only a caption `text-shadow: rgba(0,0,0,.5) -1px 1px 4px` over hero media. |
| Buttons | "Show more" 133x34, `rgba(255,255,255,.12)` on `#222`, 16px/400, padding 7 8 7 12, radius 4, `background-color .2s cubic-bezier(.25,.46,.45,.94)` |
| Container | `--container-width: 1792px`, 12 columns, inner gutter 16px, outer gutter 32px; content renders 1392px at 1440 (24px side margin) |
| Spacing | Named scale 4, 8, 12, 18, 24, 32, 48, 64, 96, 128, 160, 196 (`--spacing-spacing-1..12`). Most used: padding 8, 4, 24, 48; gaps 8, 12; row gaps 96 and 48 between card rows. |
| Motion | Images `all .3s cubic-bezier(.4,0,.2,1)` (96 uses); card tags slide up from `translateY(var(--h))` with opacity 0 to 1 in 400ms on hover or focus; filter chevron rotates 180deg in .3s ease-in-out; filter modal fades .5s; page transform .5s `cubic-bezier(.59,.01,.28,1)`. 2 reduced-motion rules. |
| Body measure | 16px intro on the dark band in a 573px column: 59 characters per line. Phone: 42. |

## What it does right

**Type.** One family, one weight, one color per surface. Hierarchy is size alone: 52, 32, 16, 13. Every style turns on `"case"` so punctuation sits at cap height next to capitals. Display tokens go to weight 350 and 375, a hair lighter than regular, so very large text does not look heavier than the body. Tracking is -0.02em at 52px, zero at 16.

**Color.** The interface is gray scale: `#1a1a1a`, `#767676`, white, `#222`. All color on the page comes from the client work (Design Doha's blue and coral, the Shakespeare in the Park posters, the Es Devlin red). **Opinion:** this is the correct move for a portfolio of many brands; any house accent would clash with half of them.

**Layout and spacing.** A 12-column grid with 16px gutters and 24px page margins at 1440. Projects run in rows of mixed widths (8 + 4 columns, three 4-column cards, a full-bleed 1440x617 hero). Dark `#222` bands interrupt the white run for themed collections ("The Secret Life of Things", "Retrospective: Shakespeare in the Park" with a "(28)" count and a year timeline 2025 to 2019).

**Hierarchy.** The h1 is just the wordmark. The first thing you read is a caption under the hero ("The Obama Presidential Center" plus one sentence), then a filter written as a sentence: "We design Everything for Everyone", where both nouns are dropdowns. Navigation by sentence instead of by tabs.

**Imagery and art direction.** Square corners, no frames, no shadows, captions below in two colors (title in ink, one-line description in `#767676`). Video loops inside cards (23 videos at 1440). A pull quote at 32px ("Design is about making choices. Sometimes the best solution is the simplest one.") breaks the grid.

**Motion.** Quiet and functional. Hover reveals category tags (for example "Arts & Culture") by sliding them up 33px over 400ms with the Material standard curve; the same reveal fires on keyboard focus. Links get a red 1px underline. The filter bar docks to the bottom of the viewport while scrolling.

**Copy and UX.** Captions are one plain sentence: "A dynamic bilingual identity for Design Doha Biennial, connecting languages, disciplines and voices across the Arab region." Section prompts are literal: "See latest projects" with a down arrow, "8 latest Brand Identity projects". Five nav words: Work, About, News, Contact, Archive.

## Borrow
- A filter written as a sentence with inline dropdowns ("We design [Everything] for [Everyone]"), docked at `bottom: 24px` on a `rgba(232,232,232,.8)` plus `blur(7.5px)` pill.
- Display weights below 400 (350 at 131px, 375 at 65px) so large type does not gain visual weight.
- `font-feature-settings: "case"` on every text style.
- Hover reveals that also fire on `:focus` (`group-focus`), so keyboard users get the same metadata.
- Two-tone captions: title in ink, description in a 4.5:1 gray, same size.
- Underlines drawn with a 1px `linear-gradient` background at `background-position: 0 98%` so you control color and offset.

## Do not borrow
- `#767676` on white is 4.54:1, legal but with no margin; on any tint below white it fails.
- White caption text over photos protected only by a 4px text shadow. Judge the worst pixel; a bright sky behind it would fail.
- A 25,615px home page. It works as an archive for a 24-partner firm, not for a small studio.
- Image placeholders `#e3e4e5` with no aspect hint for slow loads left large blank areas in the capture.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type steps 13, 19, 32, 52 are off the 1.25 scale; tokens 41, 65 and 131 too. Weights 350 and 375 are not in the four-weight set.
- Body line height 1.25 (FOUNDATIONS 1.5). Headings 1.05 (below the 1.1 floor).
- Spacing tokens include 18 and 196, off the 4px scale.
- Page transform easing `cubic-bezier(.59,.01,.28,1)` and .5s modal fades sit outside the named curves but within page duration.
- Radii 0, 4 and 8 only, all on the FOUNDATIONS scale; the 20px cookie panel is third-party.
