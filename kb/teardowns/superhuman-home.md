# Superhuman: home page (and the app UI in its product shots)

- **URL:** https://superhuman.com (final URL https://superhuman.com/)
- **Measured:** 2026-10-10, Playwright Chromium, light scheme, 1440 and 390 wide. Bulk values from `kb/teardowns/measure.mjs` (raw: `data/superhuman-home.json`); section-head and button details from `kb/teardowns/probe.mjs`. Screenshots: `kb/exemplars/shots/superhuman-home-1440-light.jpg`, `superhuman-home-390-light.jpg`. Caveats: the site serves different page variants on different loads. The 1440 capture and measure got the suite page ("Superpowers, everywhere you work", 6,446px); the 390 capture and a later 1440 probe got a Go-led page with no `h1` ("Get help from agents right where you work", 10,232px at 390). Values below say which variant they come from. 8 (1440) and 11 (390) stylesheets blocked cross-origin reading, so reduced-motion behavior is unverified. App UI values are **estimates read from screenshots** of the published product shots, not measured from the app.
- **Strongest in:** type (one variable face at non-standard weights 460 and 540), color (warm paper neutrals plus three deep brand fields), product-ui, brand.
- Everything below is measured unless marked opinion or estimate.

## Measured values

| Area | Value |
|---|---|
| Families | `Super Sans VF` (variable, 100 to 900, with italic) for 100% of characters. Fallback `system-ui`. |
| Weights | **460** body and headings, **540** for h1, leads and link text, 600 and 700 only on small buttons and footer heads |
| Type steps (1440, suite) | 64 (h1, closing h2), 49 (section h2), 48, 28, 26, 22, 20 (list items, lead), 18, 16, 14 (UI in mock-ups), 12 |
| Line height | 64/61.44 (0.96), 64/57.6 (0.9), 49/58.8 (1.2), 48/46.08 (0.96), 28/32 (1.14), 20/30 (1.5), 18/27 (1.5), 16/24 (1.5), 14/21 (1.5) |
| Tracking | 0 on the 64px h1; -1.3475px at 49 (-0.0275em); -0.63px at 28 (-0.0225em); -0.55px at 20/24 (-0.0275em); -0.15px at 20/30 and -0.135px at 18 (-0.0075em) |
| Hero (390, Go variant) | No `h1`. First heading 32px/38.4, weight 460, -0.88px (-0.0275em), two-tone (muted "Bring AI inside every app and tab with", then "Superhuman Go" in white) |
| Text colors | Warm ink `#292827` (13.52:1 on `#f7f5f2`, 14.72:1 on white); muted `rgba(20,20,19,.65)` (renders about `#636261`, 5.54:1 on `#f7f5f2`); purple links `#714cb6` (5.66:1); white on oxblood `#421d24` (14.66:1) and on teal `#0c4243` (11.19:1) |
| Surfaces | Warm paper `#f2f0eb` and `#f7f5f2`, `#dedbd5`; brand fields oxblood `#421d24` (banner, footer), deep teal `#0c4243`, aubergine `#281647`, lilac `#e8e0ff` (quote band) |
| Texture | Section dividers are hatching: `repeating-linear-gradient(45deg, rgba(115,113,109,.2) 1px, transparent ...)`, plus a 90deg 4px dash rule |
| Accent | Purple `#714cb6` (links, buttons on phone, white text 6.16:1); lilac `#d4c7ff` secondary buttons with ink text |
| Borders | 1px `rgba(115,113,109,.2)`, a warm gray at 20% alpha; 1px `rgba(255,255,255,.2)` on dark fields |
| Radii | 8px (small buttons), 12px (main buttons), 16px (banner), 24px (hero cards), 999px pills |
| Shadows | Card stack (390): `rgba(71,69,67,.04) 0 0 0 1px, rgba(71,69,67,.06) 0 4px 8px -2px, rgba(71,69,67,.04) 0 2px 4px, rgba(71,69,67,.04) 0 1px 2px, rgba(222,219,213,.2) 0 0 0 1px`. Hero button: `rgba(20,20,19,.24) 0 1px 2px, rgb(53,48,136) 0 0 0 1px`. |
| Buttons | "Get Superhuman" 212x50, dark, white 16px/460, padding 6 6 6 16, radius 12, the arrow in its own purple inner tile; its border gradient rotates (`10s linear infinite`). Phone: "Try Go" 87x52, `#714cb6`, 16px/600, padding 6 20, radius 12; "Request a demo" lilac. |
| Container | Content 1312px (64px side gutters at 1440); h1 capped at 900px; text columns 351px on phone |
| Spacing | Gaps 4, 8, 32, 16, 12, 24; padding 8, 26, 12, 16, 36, 32, 40 |
| Motion | Links `color .2s ease` (41 uses); hero items fade in `.3s` and slide `.5s` on `cubic-bezier(.191,.703,.704,.952)`; asset grid fade `.5s ease-in-out`; header blur removed on scroll; phone carousel progress bar `10s cubic-bezier(.25,1,.5,1)` |
| Body measure | 20px on the teal band in a 500px column: 46 characters per line. Phone: 18px, 35 per line. |

## What it does right

**Type.** One variable face and two working weights, 460 and 540, both off the usual stops, which reads softer than 400/500 on warm paper. Section heads use the same-size two-tone: probed "Save 4+ hours every week" in `#292827` then "on email and scheduling" in 65% ink, both 49px/460. On the phone, card titles do it with weight instead of color: "Perfect your writing" heavier, "with Grammarly" lighter. Tracking is a constant -0.0275em on every heading except the 64px hero, which is left at 0.

**Color.** No white page: `#f2f0eb` and `#f7f5f2` warm paper with a warm ink `#292827`. Three deep fields carry the brand instead of one accent: oxblood, deep teal, aubergine. Purple `#714cb6` is the only interactive color. Hatched 45deg bands between sections add texture without images.

**Layout and spacing.** Suite variant: a full-bleed photo hero (a man looking up into a lilac sky) with product cards floating around him; then a six-logo strip in bordered cells; a tabbed suite switcher (Mail, Grammarly, Docs, Go); then four alternating rows, copy left with a 4-item checklist, product shot right on a photographic gradient tile.

**Hierarchy.** h1 64px, sub 26px, one button. Each product row: product chip with icon ("Mail"), a dotted rule, 49px heading, 18px lead in muted ink, a purple "Learn more about Mail" link, then the checklist.

**Imagery and art direction.** Product UI cut out and laid over soft-focus nature photography (sky, grass, flowers) with thin white circle and dotted-line overlays. **Opinion:** the photos make productivity software feel calm, which is the brand promise.

**Motion.** Entrance only: a fast ease-out (300 to 500ms) on hero items; 200ms color on links. The one perpetual motion is the rotating gradient on the hero button border.

**Copy and UX.** "Superpowers, everywhere you work". Sub "Mail, Docs, and AI that works in every app and tab". Rows promise numbers: "save 4 hours every single week". A dark banner at the very top catches returning users: "Looking for Superhuman Mail? Learn more".

## App UI in the published product shots (estimates read from screenshots)
- **Mail inbox:** split-inbox tabs across the top with counts in lighter gray ("Important 12, Calendar 13, Docs 8, Other 19"). One-line rows: sender, then subject in darker ink, then preview in gray; no avatars, no row dividers visible. Selected row marked by a thin purple bar at the left edge (about 2px, estimate). Small colored label chips sit before the subject ("recruiting" in pink).
- **Density:** rows look about 32 to 36px tall at 1x and text about 13 to 14px (estimate from 14px measured mock-up text).
- **AI panels:** "Ask AI" field with gradient pink-to-purple placeholder; assistant chat with right-aligned gray user bubble ("yes!") and time-slot chips with clock icons ("Monday at 3:00 PM").
- **Docs:** sidebar with Home, Favorites, Search, then "Pages" with icon per page; selected page as a light gray rounded fill; a floating pill format toolbar (T, B, I, U, S, align) under the text.
- **Grammarly card:** "Fix critical mistakes", a "Writing quality 65/100" bar in teal, Dismiss as text and Accept as a small green filled button.
- **App chrome:** a floating vertical dock of round app icons beside the content (Superhuman, Grammarly, others).

## Borrow
- Variable weights 460/540 on warm paper `#f7f5f2` with warm ink `#292827`.
- Same-size two-tone heads at 49px, muted part as 65% ink (5.54:1).
- Three deep brand fields (oxblood, teal, aubergine) for bands; one purple for every action.
- Hatched 45deg divider bands, 1px lines at 20% warm gray.
- Inbox UI pattern: split tabs with counts, one-line rows, a 2px selection bar instead of a filled row.
- A top banner that routes a known audience ("Looking for Superhuman Mail?") instead of rebuilding the page around them.

## Do not borrow
- Serving a mobile variant with no `h1`.
- Different page variants on reload without a stable URL: hard to link, test or audit.
- White text placed directly over a photo in the hero; the measure could not resolve a background (1:1), so contrast depends on the image.
- 14px UI text inside product shots as real content; it is decorative here.

## Deviations from FOUNDATIONS (data for the editor-in-chief)
- Type steps 18, 22, 26, 28, 48, 64 are off the 1.25 scale (49 matches).
- Weights 460 and 540 are not in the `--weight-*` set.
- h1 line height 0.96 at 64px and 0.9 on the closing h2 (FOUNDATIONS: 1.1 to 1.25 under 100px).
- Radii 24 and 999 alongside 8, 12, 16.
- Hero easing `cubic-bezier(.191,.703,.704,.952)` differs from the enter curve; 10s perpetual border rotation with no readable reduced-motion rule.
