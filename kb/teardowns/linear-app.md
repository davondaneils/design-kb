# Linear: app UI

- **URL:** https://linear.app (the hero and feature sections embed the app as live HTML) and https://linear.app/changelog (app screenshots and recordings). The app itself sits behind a login.
- **Measured:** 2026-10-10, Playwright Chromium, 1440 and 390 wide. The home page hero is real app markup (sidebar `nav.Mmx1Wq_sidebar`, issue view `KFZpfa_panel`, agent chat `GkoSzG_panel`), so its values are computed CSS, not estimates. Method: `kb/teardowns/probe.mjs` style probes walking each element and its ancestors (row, list, sidebar, frame), plus a scan of saturated icon fills. Raw bulk data: `data/linear-home.json`, `data/linear-changelog.json`. Screenshots: `kb/exemplars/shots/linear-home-1440-light.jpg`, `linear-home-390-light.jpg`, `linear-changelog-1440-light.jpg`, `linear-changelog-390-light.jpg`.
- **Caveats:** the embedded app is a marketing build of the real components (same class names as the product, plausible data such as "DRV-8852 Faster app launch"). It is dark theme only. Values from changelog images are **estimates** (images are scaled to a 624px column, native size unknown). Brand and marketing values are in `linear-home.md`; not repeated here.
- **Strongest in:** product-ui, data-density, color (status as the only color), type at 12 to 13px.
- Everything below is measured unless marked **opinion** or **estimate**.

## Measured values

| Area | Value |
|---|---|
| Families | `Inter Variable` for all UI; `Berkeley Mono` for code blocks and diffs |
| Weights | 400 text, **510** for nav items, IDs, names and labels, **590** for the issue title and section heads ("Activity", "Thread") |
| Type steps in the app | 20 (issue title), 16 (section head), 14 (description), 13 (nav, comments, list rows), 12 (meta, activity, breadcrumb, labels), 11 (model tag), 10 (IDs on mini cards) |
| Line height | 20/26.6 (1.33), 16/28 (1.75), 14/21 (1.5), 13/20 (1.54), 12/14 (1.17) for single-line meta, 12/16.8 (1.4) for card titles |
| Tracking | -0.24px at 20 (-0.012em), -0.182px at 14 (-0.013em), -0.13px at 13 (-0.01em), 0 at 12. Root var `--editor-letter-spacing: -.00666667em` for document text |
| Sidebar | `nav` 232px wide incl. padding `8 16 16 8`; items 208x**28**, padding `0 7`, gap 8 (icon to label), radius 8, 2px gap between items |
| Sidebar section label | "Workspace", "Favorites": 208x**24**, 12px/14 weight 510, `#62666d`, with a 16px caret |
| Sidebar active row | `rgba(255,255,255,.04)` fill, no border, no accent bar ("Faster app launch" under Favorites) |
| Location bar | 44px tall, padding `8 12`, bottom border 1px `rgba(255,255,255,.05)`; breadcrumb group 28px tall, padding `6 10`; counter "1 / 84" 12px `#62666d` |
| List row | Issue list row 1310x**40**, padding `0 28 0 36`, ID 13px `#8a8f98` with gap 8 |
| Activity row | 24px tall, 12px/14 text in `#62666d` with actor names at weight 510 |
| Property row | 24px tall, padding `0 8 0 7`, gap 6, 16px icon; property column 286px with 24px between groups |
| Board card | 300x96, padding `8 10 12 12`, radius 9, fill `#0f1011`, border 1px `rgba(255,255,255,.08)`; label pills 24px tall, padding `0 8 0 6`, radius 9999, 1px `rgba(255,255,255,.08)` border, 7px color dot |
| Icon sizes | 14x14 in nav and toolbars, 16x16 in section labels, status and properties, 12x12 in label pills and board cards, 18x18 in panel headers |
| Text colors | Primary `#f7f8f8`; body `#d0d6e0` (13.6:1 on `#090a0b`); secondary `#8a8f98` (5.5:1 on `#161718`); meta `#62666d` (3.4:1 on `#090a0b`, 3.1:1 on `#161718`) |
| Surfaces | App frame `#090a0b`; view `rgba(255,255,255,.01)` over it with 1px `rgba(255,255,255,.05)` border and radius 8; floating chat panel `#161718`, radius 12, border 1px `rgba(255,255,255,.12)`; prompt bubble `#161718` with `rgba(0,0,0,.2) 0 0 0 1px` |
| Status colors | In Progress `#f0bf00` (half-filled ring, 11.5:1); In Review and Performance label `#27a644`; Done and PR icons `#5e6ad2` (4.2:1); project icons `#fc7840`, `#00b8cc`, `#008d2c`; label dots Bug `#eb5757`, Design `#4ea7fc` |
| Radii | 8 (rows, view), 9 (cards), 12 (frame, floating panel), 4 (model tag, code), 9999 (labels) |
| Shadows | Floating panel `rgba(0,0,0,.25) 0 2px 32px`; view edge `rgba(0,0,0,.2) 0 0 0 2px`; thread header `rgba(0,0,0,.4) 0 1px 0` under a `.08` hairline |
| Controls | Input field padding 10, radius 8, transparent 1px border plus `rgba(0,0,0,.2) 0 0 0 1px`; placeholder "Reply…" 13px `#62666d`; model tag "Opus 5" 47x18, 11px, padding `1 4`, radius 4 |
| Root vars | `--focus-ring-width: 1px`, `--scrollbar-width: 12px`, `--editor-line-height: 1.6`, `--editor-block-radius: 6px`, `--editor-block-spacing: 1rem`, `--editor-todolist-checkbox-width: 14px`, `--editor-safe-area: 16px` |
| Motion | Hover color `.1s cubic-bezier(.25,.46,.45,.94)`; row background and left border `.1s` same curve; buttons `.16s` |
| Phone (390) | The app is not reflowed: the same 1320x720 frame is scaled to 50% (660x360) and cropped by the viewport; sidebar renders 116px wide |
| Changelog (estimate) | Usage chart: big figure plus muted unit inline ("573 sessions", "$0.27 average", "$153.34 total spend"), stacked purple bars, "Last 7 days" pill filter. Stack view: numbered PR rows about 25px apart (as displayed) with a "Current" tag |

## What it does right

**Type.** The app runs on three sizes: 13 for anything you read in a list, 12 for meta, 14 to 20 only inside the document. Weight, not size, separates a name from its sentence: "Linear created the issue via Slack on behalf of Karri" is one 12px line where "Linear", "Slack" and "Karri" are 510 and the rest 400, all in `#62666d`. Single-line meta uses a tight 14px line box on 12px text so 24px rows stay calm.

**Color.** Chrome is grayscale in four text steps; every hue on screen is state. The in-progress ring `#f0bf00` appears on the breadcrumb, the favorite and the activity line ("moved from Todo to In Progress"), so status reads the same everywhere. Label pills are neutral outlines with a 7px colored dot: color carries the category without tinting the whole chip.

**Layout and spacing.** One rhythm: 28px nav rows, 24px secondary rows, 40px list rows, 44px bars. Gaps are 2, 4, 6 and 8 inside components; 24 between property groups. The issue view is a three-column grid: 232 sidebar, a 662px content column, a 286px properties column.

**Hierarchy.** Selection is a 4% white wash, not an accent bar. Section labels sit at the meta color with a caret, so the sidebar has two levels without a single divider.

**Imagery and art direction.** The product is shown as the product: real components and believable data (issue IDs, timestamps "2min ago", a 1 / 84 counter). **Opinion:** shipping the live component tree as marketing art keeps screenshots from going stale; the changelog still uses images and is where drift would show first.

**Motion.** 100ms ease-out-quad on hover and row fills; 160ms on buttons. Nothing in the app frame animates on load except the agent label sweep (2s linear).

**Copy and UX.** State is shown in words next to the icon ("Worked for 10 sec", "DRV-364 added to context", "Changed 2 files +22 -10"). The agent panel uses the same 12px meta language as human activity, so agent work reads as teammate activity.

## Borrow
- Row heights 24 (meta), 28 (nav), 40 (list), 44 (bars). Nav item padding `0 7` with an 8px icon gap and 14px icons.
- Selected row = `rgba(255,255,255,.04)` fill; borders at `.05` to `.12` white alpha; floating layers get both a lighter surface (`#161718`) and `0 2px 32px rgba(0,0,0,.25)`.
- Status color on a small glyph (12 to 16px ring or dot), never on the row; neutral outlined label pills with a 7px dot.
- Names at weight 510, verbs at 400, in the same 12px line.
- Live HTML for product shots; it also documents your real tokens.

## Do not borrow
- Meta text `#62666d` on `#090a0b` (3.4:1) and on `#161718` (3.1:1): fails AA for 12px text that carries real information (times, actors, counters). Lifting it to `#80858e` gives 5.3:1 and 4.8:1.
- Done color `#5e6ad2` on `#090a0b` (4.2:1) is fine as an icon (3:1) but not as text.
- A fixed-size frame scaled to 50% on phones: 13px text renders at 6.5px. Show a phone layout or a crop instead.
- 10 and 11px text (mini card IDs, model tag) for anything but decoration.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- App body is 13px; FOUNDATIONS has 12 and 14, no 13. Many dense UIs (Linear, Vercel table cells, Stripe tables) land on 13.
- Weights 510 and 590 are outside the four weight tokens.
- Radii 9 (cards) and 6 (editor blocks) are off the 0, 4, 8, 12, 16 scale.
- Gaps of 2, 6 and 7px; FOUNDATIONS has 2 but not 6 or 7. Row heights 24, 28, 40, 44 are all multiples of 4.
- Single-line meta at line height 1.17 (12/14), below the 1.5 body rule; acceptable for one-line labels, worth a stated exception.
