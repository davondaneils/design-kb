# Responsive and adaptive layout

Sources: research/layout/04. Breakpoints are the foundation set: sm 640, md 768, lg 1024, xl 1280, 2xl 1536, mobile first, `min-width`.

## Principles
1. **Two layers, two mechanisms.** The page shell (navigation, columns, panes) changes at viewport breakpoints. Components change with their container (container queries or intrinsic algorithms). A card should not know how wide the phone is.
2. **Design the smallest and the largest first.** Apple HIG advises testing the smallest and largest layouts first; most bugs live at the extremes (320px and 1920px plus).
3. **Reflow is a law, not a nicety.** 320 CSS px wide with no horizontal scrolling and no lost content (WCAG 1.4.10, AA).
4. **Groups must survive stacking.** When columns collapse, proximity changes (NN/g). Check that what belonged together still sits together.

## Decision rules

### Page shell by width
| Width | Columns | Navigation (app) | Navigation (site) | Panes |
|---|---|---|---|---|
| under 640 | 4 | bottom bar (3 to 5 destinations) or top bar + menu | top bar + menu button | 1 |
| 640 to 1023 | 8 | navigation rail (icons + short labels) | top bar, menu or condensed links | 1, or list-detail at 768 and up if content is dense |
| 1024 to 1279 | 12 | rail or sidebar | full top nav | 2 (list-detail, supporting pane) |
| 1280 and up | 12 | persistent sidebar 240 to 280px | full top nav, centered 1280 container | 2 to 3 |
Cross-check for native and Android apps: Material compact under 600dp uses a bottom bar, medium and expanded use a rail, and two panes are impractical when height is compact (landscape phone, under 480dp).

### Component rules
- Default to intrinsic: `repeat(auto-fit, minmax(min(16rem, 100%), 1fr))` for card grids, the Sidebar pattern for media plus text, `flex-wrap` clusters for tags and buttons. The `min(16rem, 100%)` stops overflow below 16rem.
- Use `@container (inline-size > 30rem)` when a component needs a different arrangement (stacked vs side-by-side), not just reflow. Name containers for clarity.
- Breakpoints where content breaks: if a component looks wrong at 700px, add a container query at the width where it breaks, not the nearest device size (content-out, opinion widely held).

### Hard minimums
| Requirement | Value | Source |
|---|---|---|
| Reflow width | 320 CSS px, no 2D scroll (data tables, maps, video excepted, but their headings, search and pagination still reflow) | WCAG 1.4.10 |
| Pointer target | 24x24 CSS px or 24px-circle spacing | WCAG 2.5.8 |
| Touch target preferred | 44x44 (pt on iOS, CSS px on web); 48dp on Android is the Material convention | Apple HIG, foundation |
| Sticky elements | must not fully hide focused items; use `scroll-padding-top` equal to sticky header height; consider un-sticking on short viewports | WCAG 2.4.11, C34, C43 |
| Text spacing and zoom | layouts survive 1.4.12 overrides and 200% text resize | WCAG 1.4.12, 1.4.4 |
| Safe areas | keep controls inside `env(safe-area-inset-*)`; backgrounds may extend | Apple HIG |

### Very wide screens (1536 and up)
- Keep text containers capped (66ch body, 1280 content box). Let backgrounds, media and data regions grow.
- Apps: add a third pane (inspector, preview) rather than stretching the main column. Dashboards: allow more columns of cards, not wider cards.
- Do not scale type with the viewport beyond display headings; fluid type belongs to display sizes only (foundation).

### Short viewports
- Landscape phones and laptops with browser chrome often have 360 to 700px of height. Sticky headers above 64px plus a sticky footer can eat a third of the screen; collapse or un-stick them under about 500px of height (`@media (max-height: 500px)`, opinion consistent with WCAG C34).

## Do and don't
- Do switch a three-column feature row to `auto-fit` cards. Don't hand-code 3, 2, 1 columns at three breakpoints.
- Do keep "Save" and "Cancel" adjacent when stacked. Don't let the primary button drop below a 600px-tall preview.
- Do test 320, 375, 768, 1024, 1280, 1440, 1920 and 400% zoom. Don't only test the design tool's frames.
- Do keep a table horizontally scrollable inside its own region with a visible cue and a sticky first column. Don't let the whole page scroll sideways.

## Worked examples
**Three-column feature grid on mobile.** Replace the 3-column grid with `repeat(auto-fit, minmax(min(18rem, 100%), 1fr))`, gap `--space-6`. At 320 to 640 each feature stacks; the icon sits beside the title (Sidebar pattern, small icon basis) instead of above it to save height. Order: most important feature first because on mobile there is no side-by-side parity.

**App with a sidebar on tablet and phone.** 1280 and up: sidebar 264px, persistent. 768 to 1279: collapse to a 72 to 80px rail with icons and short labels, sidebar available as an overlay. Under 768: bottom bar with the top 4 destinations plus "More", or top bar plus drawer if there are more than 5 peers. Focus moves into the overlay when opened and returns on close. List-detail becomes list then pushed detail with a back button under 768.

## Hand-offs
- Navigation patterns and IA: design-ux.
- Container query and CSS implementation, performance (CLS): design-frontend.
- Responsive images and art direction: design-graphic.
