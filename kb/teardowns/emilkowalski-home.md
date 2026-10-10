# Emil Kowalski: home page (practitioner portfolio)

- **URL:** https://emilkowal.ski (final URL https://emilkowal.ski/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/emilkowalski-home.json`); hover diffs, banner state over time and stylesheet rules from scripted computed-style reads. Screenshots: `kb/exemplars/shots/emilkowalski-home-1440-light.jpg`, `emilkowalski-home-390-light.jpg`.
- **Caveats:** a sticky announcement bar ("My new course called aiforui.dev is in early access!") exists in the DOM but stayed at `opacity: 0; transform: translateY(-100%)` through load, scroll down and scroll up, so it is not in the captures. The stylesheet is shared with the article pages, so many rules (drawers, buy button) are not used on the home page; only rules matched to home elements are reported.
- **Strongest in:** restraint, type (one size), motion judgement (almost none on the index, all of it in the work), copy.
- Everything below is measured unless marked **opinion**.

## Measured values

| Area | Value |
|---|---|
| Families | A self-hosted variable face exposed as `Sans` (weights 100 to 900) with a metric-matched Arial fallback (`size-adjust: 107.89%`, `ascent-override: 89.79%`); root sets `"cv01","ss03"` and `"opsz" auto`. Also loads `Mono`, `Serif` and an italic `serifInline` for articles. |
| Weights | 400 body and descriptions; 500 for name, section labels, project titles and the button |
| Type steps (1440) | 16 for everything; 14 only in the announcement bar. One size on the whole page. |
| Line height | 16/24 (1.5) for titles and rows; 16/26.4 (1.65) for the "Today" paragraph; 14/23.1 (1.65) |
| Tracking | `normal` everywhere |
| Hero (390) | Identical type; the column becomes 342px wide (24px side padding) and section spacing drops from 128px to 64px |
| Text colors | Ink `#21201c` (16.0:1 on `#fdfdfc`); muted `#63635e` (5.93:1 on `#fdfdfc`, 5.5:1 on the `#f5f4f4` hover fill). Both warm grays, not neutral. |
| Surfaces | Page `#fdfdfc` (warm off-white); row hover `#f5f4f4`; input field white; button `#21201c` |
| Accent | None |
| Borders | None. The input is outlined with a shadow ring instead: `0 0 0 1px rgba(0,0,0,.08), 0 2px 2px rgba(0,0,0,.04)` |
| Radii | 6px on list rows (14), 9999px on the email form and Subscribe button |
| Links | Underline `1.28px` in `rgb(188,187,181)`, darkening to `rgb(141,141,134)` on hover |
| Buttons | "Subscribe" 104x38 inside a 644x48 pill form, `#21201c` fill, `#fdfdfc` text, 16px/500, padding 0 14, 5px right margin so the dark pill sits inset 5px from the form edge |
| Container | `max-width: 692px` with 24px padding: a 644px text column, centered |
| Spacing | Section gaps 128px (`mt-32`) desktop, 64px phone; rows padded 12px with -12px margin so the hover fill bleeds past the text edge; 16px between rows |
| Motion | Input `color, background-color, border-color 150ms cubic-bezier(.4,0,.2,1)`. Row hover fill and underline color change have no transition (instant). 1 reduced-motion rule (`motion-reduce:transition-none`). |
| Body measure | 16px "Today" paragraph in 644px: 78 characters per line. Phone: 39. |

## What it does right

**Type.** The entire page is 16px. Hierarchy comes from two weights (500 vs 400) and two warm grays (`#21201c` vs `#63635e`), plus space. Name and role stack as two lines: "Emil Kowalski" in 500 ink, "Design Engineer" in 400 gray. Every row repeats that pattern: title in ink, one-line description in gray ("Sonner / An opinionated toast component for React."). **Opinion:** this is the most transferable lesson here; a page can be fully legible with one size if weight and color steps are clear.

**Color.** Warm neutrals with a yellow cast (`#fdfdfc`, `#f5f4f4`, `#21201c`, `#63635e`, underline `rgb(188,187,181)`). No hue at all. Underlines are a light warm gray at rest, so links read as links without being loud.

**Layout and spacing.** One 644px column, sections labeled "Today", "Projects", "Writing", "Newsletter", "More", separated by 128px. Rows use negative margin plus padding (-12/12) so the 6px hover fill extends past the text, the text column stays aligned, and the whole row is the hit target (668x72).

**Hierarchy.** Order is the hierarchy: who, what now ("I work on the Web team at Linear."), projects (4), writing (11), newsletter, links out.

**Imagery and art direction.** None: 0 images, 1 SVG. The craft is in the linked work.

**Motion.** The index almost does not move: row hover is an instant fill, the input has a 150ms color transition. **Opinion:** this matches his own published rule that frequent interactions should be fast or not animated (see the "You Don't Need Animations" essay below); the home page is a list you scan many times.

**Copy and UX.** Descriptions are one short sentence each: "A natural filter for bad ideas.", "Settling for good enough is not good enough." The newsletter promise: "Exclusive, newsletter-only content once a month. No spam, no nonsense."

**Linked work worth studying (loaded):**
- https://emilkowal.ski/ui/7-practical-animation-tips : seven rules with live demos, including "Don't animate from scale(0)" (start at 0.9 or more), press scale to 0.97, ease-out for anything entering or exiting, "UI animations should generally stay under 300ms", a 180ms versus 400ms dropdown comparison, a 300ms ease-in versus ease-out demo, skipping the delay on subsequent tooltips (`transition-duration: 0ms` via `data-instant`), and adding 2px of `filter: blur()` to mask a crossfade.
- https://emilkowal.ski/ui/you-dont-need-animations : purpose, frequency of use and perceived speed as the test for whether to animate at all.

## Borrow
- One type size for a list-heavy index; weight 500 vs 400 and ink vs gray carry the hierarchy.
- Title plus one-sentence description per row, both 16px, description in a 5.9:1 gray.
- Row hit areas with -12px margin and 12px padding so hover fills bleed past the text edge.
- Input outline as a shadow ring (`0 0 0 1px rgba(0,0,0,.08), 0 2px 2px rgba(0,0,0,.04)`) instead of a border; inset the submit pill 5px inside the field.
- Metric-matched fallback font (`size-adjust`, `ascent-override`) so the swap does not shift layout.
- No transition on high-frequency hovers; reserve motion for things that enter and exit, under 300ms, ease-out, from scale .9 or more.

## Do not borrow
- 78 characters per line in the "Today" paragraph at 1440: over the 75 limit; a 52ch measure would fix it.
- The announcement bar sits at opacity 0 and off screen but has no `aria-hidden`, no `inert`, `visibility: visible` and a focusable link: keyboard and screen-reader users can land on a link sighted users cannot see. Hide off-screen UI with `inert` or `visibility: hidden`.
- One size works because the page is a short list. It does not scale to marketing pages with real sections.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Body line height 1.65 on paragraphs (FOUNDATIONS 1.5); rows at 1.5.
- Measure 78 cpl at 1440 (FOUNDATIONS 45 to 75).
- Radius 6px on rows is off the 0, 4, 8, 12, 16 scale.
- Section gap 128px on desktop (on the scale); padding 14px in the button is off it.
- Motion: 150ms standard Tailwind curve `cubic-bezier(.4,0,.2,1)`, not the FOUNDATIONS standard `cubic-bezier(.2,0,0,1)`.
