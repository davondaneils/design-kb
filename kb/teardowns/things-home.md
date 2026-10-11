# Things 3: home page and app screenshots

- **URL:** https://culturedcode.com/things/
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/things-home.json`); hero, section heads and cards probed live. App values read from the page's own screenshot collage (`whatsnew-collage-io60.png`, 2000x2000, shown at 1000x1000; alt "Screenshots of Things running on Mac, iPhone, iPad, and Apple Watch"). Screenshots: `kb/exemplars/shots/things-home-1440-light.jpg`, `things-home-390-light.jpg`.
- **Caveats:** the page uses `ui-sans-serif, -apple-system` and loads no web font, so on Apple devices it renders in SF Pro and this Linux capture shows a fallback. The app is native (Mac, iOS, visionOS), so every app value is an **estimate** from the collage: colors are pixel samples, sizes are given as ratios because the device frames are scaled.
- **Strongest in:** product-ui (calm density), color (one hue per list type), copy, imagery.
- Everything below is measured unless marked **opinion** or **estimate**.

## Measured values

| Area | Value |
|---|---|
| Families | System UI stack only (`ui-sans-serif, -apple-system`) |
| Weights | 400 body, 600 links and nav, 700 section heads and card titles, 800 award labels |
| Type steps (1440) | 36 (h2), 24 (hero description and video link, 23.994 computed), 20.25 (section copy, card titles), 18 (base), 15.3 and 15.2 (card meta, tweets), 13.5 and 13 (names, dates). Every size is a multiple of an 18px base (0.72 to 2.0). |
| Line height | 36/36 (1.0) on h2, 24/30 (1.25), 20.25/26.3 (1.3), 18/24.3 (1.35), 15.3/18.4 (1.2) |
| Tracking | 0 everywhere |
| Hero | The app icon and "Things" wordmark are one 250x301 image; the real `h1` "Things" is visually hidden (1x1). Description 24/30 `#44474b` in a 440px column; "Watch Introduction Video" 24px/600 `#5c9cf5` with padding `6 8.4`, radius 9.6 |
| Hero (390) | Same structure; description wraps to 5 lines; measure for section copy is 28 characters per line at 20.25px |
| Text colors | Ink `#303336` (11.6:1 on `#f2f5f7`); body `#44474b` (8.5:1); secondary `#55606e` (5.8 to 6.4:1); captions `rgba(0,7,18,.44)` and `rgba(0,15,36,.46)` (**3.1:1**); `#9299a4` (**2.6:1**); link blue `#5c9cf5` (**2.55:1** on `#f2f5f7`) |
| Surfaces | Page `#f2f5f7`; white bands `#ffffff`; tinted band `#fbfcfe`; product and quote cards `#f2f5f7` on white |
| Borders | Almost none: nav underline 1px `#dfe3e8`; one `rgba(0,28,70,.12)` hairline |
| Radii | 18 (product cards, quote bubbles), 12.8 (tweet cards), 10.8 (award pill), 6 (nav buttons, links), 3 to 5 (marks, small chips) |
| Shadows | Tweet cards `rgba(0,0,0,.1) 0 2px 8px, rgba(0,0,0,.1) 0 0 2px`; screenshots `rgba(0,0,0,.1) 0 2px 10px, rgba(0,0,0,.05) 0 0 0 1px`; nav `rgba(38,52,74,.15) 0 1px 0` |
| Buttons | No text buttons above the fold. Product cards 211x331, padding 18, radius 18. "Show More Posts" (390) 155x32, `#cfd8e6`, 14.7px/600, radius 6.6 |
| Container | 900px max (rendered 1015 with 57.6px side padding); text column 440px |
| Spacing | Section padding 81px top and bottom (4.5 x 18); card padding 18 and 27; gaps 16, 18, 24 |
| Motion | Images `transform .1s ease-out`; one `background .2s ease-out`; 1 `prefers-reduced-motion` rule; one intro video |
| App sidebar (estimate) | Sidebar about 315 image px wide; list rows at a 36px pitch; each fixed list has its own icon color: Inbox `#469ffc`, Today star `#fdd314`, Upcoming and the due badge `#f94876`, Anytime and Logbook `#47b378`, Someday `#b9ca83`; counts in gray `#989b9e` (2.6:1 on `#f6f7f9`) |
| App lists (estimate) | To-do rows at a 42px pitch (1.17 x the sidebar pitch); sidebar `#f6f7f9`, content `#ffffff`; selected project row `#dfe2e7` with rounded corners and no accent; heading sections in `#1368c4` (5.5:1) with a hairline under them; task ink `#0c0d10`; project subtitles under tasks in `#adb0b3` (2.2:1); tags as outlined pills; date chip ("Nov 13") on `#e8e9eb` |

## What it does right

**Type.** The whole page is sized in multiples of one 18px base: 13.5, 15.3, 18, 20.25, 24, 36; section padding 81 and card padding 27 follow the same base. **Opinion:** it is an em-based layout from before design tokens, and it still holds together because every value shares one root. The system font means the marketing page looks like the app on a Mac.

**Color.** The page is gray-blue `#f2f5f7` and white; color comes from the app. In the app every built-in list owns one hue (Inbox blue, Today yellow star, Upcoming red calendar, Anytime green layers, Someday khaki box, Logbook green), and the hue is the icon only. Project headings use one deep blue `#1368c4`. The only red is reserved for urgency: the due-today count badge and the "today" flag.

**Layout and spacing.** Centered single column at 440px for all copy, 900px for media. Each section is the same unit: a colored emoji-style icon, a 36px bold head, a 20px paragraph, one text link ("See features >"), then a large image. In the app the to-do row is about 17% taller than a sidebar row because it holds two lines (title plus project name in light gray).

**Hierarchy.** The app avoids lines between rows; only headings get a hairline. Secondary information (project of a task, counts) is set lighter and smaller, so a list of 5 items with metadata reads as 5 items.

**Imagery and art direction.** Screenshots are crisp light-mode renders with real-sounding data ("Borrow Sarah's travel guide", "Vacation in Rome", "Prepare Presentation"). One tilted, perspective view of the sidebar acts as a section divider. Devices are shown together (Mac, iPhone, iPad, Watch) to make the sync promise without copy.

**Motion.** Almost none on the page: 100ms ease-out on image hovers. The video carries the motion story.

**Copy and UX.** Plain promises in the user's terms: "plan your day, manage your projects, and make real progress toward your goals." Prices and OS minimums sit on every product card ("macOS 13.3 or later", "$49.99 (US)") with a "view in your currency" link. Social proof is press quotes plus customer posts, each with a name and date.

## Borrow
- One color per object type, applied to the icon only; red only for due and overdue.
- Two-line rows (title plus muted context) at about 1.17 x the height of single-line navigation rows.
- Section headings in the accent color with a hairline, instead of row dividers.
- Selected item as a soft gray rounded fill (`#dfe2e7` on `#f6f7f9`), no accent bar.
- A single base unit (here 18px) that every size and space derives from.
- Price, platform requirements and currency link on every purchase card.

## Do not borrow
- Link blue `#5c9cf5` on `#f2f5f7` (2.55:1), including the 24px/600 "Watch Introduction Video" (fails even the 3:1 large-text rule).
- Caption grays at 2.6 to 3.1:1 for dates, OS requirements and names.
- In the app screenshots, subtitles `#adb0b3` on white (2.2:1) and counts `#989b9e` (2.6:1): fine on a Retina Mac at a glance, not AA.
- A visually hidden `h1` with the visible title baked into an image.
- Fractional sizes like 23.994px and 4.05px padding; round to the grid.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type built on an 18px base with steps 13.5, 15.3, 18, 20.25, 24, 36; none sit on the 1.25 scale except 20.25 near 20.
- Spacing 9, 18, 27, 81 (multiples of 9), not the 4px base.
- Radii 18 and 12.8 are off the radius scale.
- h2 line height 1.0 at 36px, below the 1.1 heading floor.
- No `--color-*` or spacing custom properties at all: values are hard-coded, so the page has no token layer to compare.
