# Notion: product page (and the app UI in its product shots)

- **URL:** https://www.notion.com/product
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/notion-product.json`); headline, sub, button, section-head and quote details from `kb/teardowns/probe.mjs`. Screenshots: `kb/exemplars/shots/notion-product-1440-light.jpg` (4,687px, full page), `notion-product-390-light.jpg` (4,003px). Caveats: in the 1440 capture the logo marquee is painted over the lower half of the hero app shot (a sticky or transform layer frozen mid-scroll); the h1 has a rotating word, so the capture shows "Think" while the DOM held "Create"; the measure found no paragraph long enough for a characters-per-line reading; 1 stylesheet blocked. App UI values are **estimates read from screenshots**, not measured from the app.
- **Strongest in:** product-ui (a real workspace as the hero), type (tight Inter display), color (warm grays plus a tagged color system), UX.
- Everything below is measured unless marked opinion or estimate.

## Measured values

| Area | Value |
|---|---|
| Families | `NotionInter` (Notion's Inter build) for 80% of characters; `Lyon Text` serif only for customer quotes (18/28) |
| Weights | 600 h1, 700 h2 and h3, 500 nav and buttons, 400 body |
| Type steps (1440) | 96 (h1), 72 (rotating word), 54 (h2), 42 (closing h2), 22 (card h2), 20 (sub), 18 (quote), 16, 14, 12 |
| Line height | 96/100 (1.04), 54/56 (1.04), 42/48 (1.14), 22/28 (1.27), 20/28 (1.4), 16/24 (1.5), 14/20 (1.43) |
| Tracking | -4.6px at 96 (-0.048em), -1.875px at 54 (-0.035em), -1.5px at 42 (-0.036em), -0.25px at 22 (-0.011em), -0.125px at 20, 0 at 16 and 14, **+0.125px** at 12 |
| Hero (390) | 42px/48 (1.14), -1.5px (-0.036em), weight 600; a row of seven round doodle avatars sits above it; buttons go full width (280px) |
| Text colors | Black at 95% (19.47:1), 90% (17.4:1), warm gray `#615d59` (6.53:1), black at 54% (4.59:1, small captions); link blue `#097fe8` (4.03:1 on white) |
| Surfaces | `#ffffff`; `#f9f9f8` bento cards; `#f6f5f4` closing CTA band. Token ramp "tatami" gray `#f9f9f8 > #f6f5f4 > #dfdcd9 > #a39e98 > #78736f > #615d59 > #494744 > #31302e > #191918` (warm). |
| Accent | Primary button `#0075de` (white text 4.57:1); demo button `#e6f3fe` fill with `#005bab` text (6.04:1). Customer cards tinted red `#f64932`/`#e32d14`, blue `#097fe8`/`#005bab`, yellow `#ffb110`/`#e89d01` with a `rgba(0,0,0,0) 35%` to `rgba(0,0,0,.55)` bottom scrim. |
| Borders | 1px `rgba(0,0,0,.1)`; transparent 1px borders on buttons so hover can add one without shift |
| Radii | 8px buttons (52), 12px bento cards (6px on phone), 4px nav items, pill for the hero word chip, `12px 12px 0 0` on card images |
| Shadows | Images, four layers: `rgba(0,0,0,.01) 0 .175px 1.041px, rgba(0,0,0,.02) 0 .8px 2.925px, rgba(0,0,0,.027) 0 2.025px 7.847px, rgba(0,0,0,.04) 0 4px 18px`. Hero frame, six layers ending at `rgba(0,0,0,.04) 0 36px 89px`. |
| Buttons | "Get Notion free" 156x38, `#0075de`, white NotionInter 16px/500, padding 6 15, radius 8, 1px transparent border. Nav version 132x36, padding 4 14. "Request a demo" 156x38 pale blue. Phone: 280 and 326px wide. |
| Container | 1252px (hero), 1184 and 1380px; card h2 max 892px |
| Spacing | Gaps 8, 12, 16, 24; padding 6, 3, 8, 24, 15; sections 96/96 and 80/24 at 1440, 32/32 at 390 |
| Motion | Color and background `.2s cubic-bezier(.42,0,1,1)` (ease-in); card image lift `transform .2s cubic-bezier(.645,.045,.355,1)`; hero word pill `inline-size .3s cubic-bezier(.86,0,.07,1)`; logo marquee 60s and 115s linear. **21** `prefers-reduced-motion` rules. Hero video has a visible Pause button. |

## What it does right

**Type.** Inter tracked hard: -0.048em at 96px with line height 1.04, so "Where teams and agents ... together." sits as two tight lines. Tracking relaxes as size drops and turns positive at 12px. The one rotating word sits in a pale blue pill with a blue dot ("Think", "Create") at 72px/500, lighter and smaller than the 600 h1 around it, and the pill animates its width (300ms) so the line does not jump. Quotes switch to Lyon Text serif, the only serif on the page. `text-wrap: balance` on h1, sub and h2.

**Color.** Warm grays, not cool: `#615d59` secondary text, `#f9f9f8` cards, `#f6f5f4` CTA band. Black is used at alpha (95%, 90%, 54%). Blue is reserved for the two actions. Color appears in tags and in three duotone customer portraits (red Cursor, blue Faire, yellow Ramp).

**Layout and spacing.** Centered hero with two 38px buttons, the app frame directly below, logos in a marquee. Then a bento of three `#f9f9f8` cards, each with a 14px eyebrow ("Capture knowledge"), a 22px/700 heading and a round black arrow button, over a cropped product view. Use cases follow as five equal tiles with a colored icon and one line ("Triage product feedback"). Short page: 4,687px.

**Hierarchy.** h1 96, h2 54, card heads 22: big jumps, few levels. The bento card head at 22px with a 14px eyebrow is the workhorse pattern.

**Imagery and art direction.** The hero is a real-looking workspace ("Ramp HQ"), not a mock-up collage. Hand-drawn black line doodle faces peek over the frame edges. Customer portraits are flooded with one brand color each.

**Motion.** Mostly 200ms. Hover color uses an ease-in curve, unusual but barely visible at 200ms. Full reduced-motion coverage (21 rules) and a Pause control on the hero video.

**Copy and UX.** Headings end with periods: "AI where your team works.", "Trusted by teams that ship.", "Get started today." Proof strip with numbers: "100M users in over 50 countries", "Over 50% of YC companies", "62% of Fortune 100".

## App UI in the published product shots (estimates read from screenshots)
- **Shell:** macOS window, workspace name and globe icon top left; tabs in the title bar ("Ramp HQ"); top-right Share, comment, star, more. Sidebar about 18% of the frame width (estimate), on a faint warm gray.
- **Sidebar:** icon row (Home pill selected, chat, inbox with red badge, search); sections with small gray labels ("Upcoming events", "Agents", "Teamspaces"); events with colored squares and right-aligned gray time ranges; agents with round colored avatars ("Task routing agent", "Q&A agent").
- **Page:** large circular page icon (about 40px at the shot's scale) beside a bold title; view tabs with icons ("Company tasks", "My tasks", "Current sprint", "Timeline", +); right side icon toolbar and a blue split "New" button.
- **Board:** four columns, each tinted to its status with a pill and count ("To-do 10", "In progress 5", "In review 3", "Complete 34"); white cards with one or two line titles and no metadata.
- **Databases:** table rows with page icons and colored tag chips ("Growth", "Infra", "Design", "Mobile", "Product Ops"); priority chips in red ("High priority"); an AI meeting recorder bar with waveform, pause and stop.
- **Type in shots:** UI text reads about 13 to 14px at app scale (estimate); the shots render it at 9 to 11px.

## Borrow
- Display Inter at -0.048em and line height 1.04; tracking that relaxes with size and goes slightly positive at 12px.
- A rotating word in a pill that animates width, so the headline never reflows.
- Bento card recipe: `#f9f9f8`, radius 12, 14px eyebrow, 22px/700 head, round arrow button.
- Warm gray ramp and black-at-alpha text.
- Status-tinted board columns with pill plus count.
- Transparent 1px borders on buttons so a hover border causes no layout shift.
- 21 reduced-motion rules and a Pause control on any autoplay video.

## Do not borrow
- "Request a demo" text `#097fe8` on white (4.03:1 at 16px/500) on the closing CTA: fails AA.
- White on `#0075de` at 4.57:1 is just over the line; any lighter blue fails.
- Black at 54% (4.59:1) for anything longer than a caption.
- Duotone portraits with white quote text over a 55% scrim: legible here, fragile on lighter photos.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type steps 18, 22, 42, 54, 72, 96 are off the 1.25 scale.
- h1 line height 1.04 at 96px and h2 1.04 at 54px (FOUNDATIONS: 1.1 to 1.25 under 100px).
- Hover easing is ease-in `cubic-bezier(.42,0,1,1)`; FOUNDATIONS uses standard or enter curves for hover.
- Button height 36 to 38px is below a 44px target size.
- Phone bento radius 6px is outside 0, 4, 8, 12, 16.
