---
name: design-graphic
description: Domain reference loaded by design-director or a design playbook (design-playbook-landing, -dashboard, -mobile, -brand); do not trigger on its own for a page, screen or brand job. Covers logos, wordmarks and identity systems, drawing marks as outlined SVG, responsive logo tiers, favicons and app icons, icon sets (grid, stroke matched to text, pixel placement, audit), social and marketing graphics, the shot brief and illustration style spec, and file export. Load it directly only when the user names it or asks a narrow question inside this domain alone ("draw an icon set", "outline this wordmark", "favicon sizes"). Page-level imagery, photo treatment and drawn stand-ins are design-art-direction.
---

# design-graphic

> **Layer: domain reference.** Loaded after `design-foundations` by `design-director` or a `design-playbook-*` skill. Accessibility floor: design-foundations `references/accessibility.md`. Page-level imagery (the visual concept, picking, cropping and treating photos, text over images, visuals made from code when image hosts are blocked) lives in **design-art-direction**; this skill draws the marks, icons and single graphics that concept is expressed through.

Make marks and icons a top identity studio and a top product team would sign off on. Run the gate first; one miss fails the work however clever the rest is. Then the expert moves.

Defaults follow FOUNDATIONS v0.3: spacing 0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128; type 12, 14, 16, 20, 25, 31, 39, 49, 61; radius 0, 4, 8, 12, 16, full; semantic color roles; WCAG 2.2 AA; targets 24x24 minimum, 44x44 on touch.

## 1. Fundamentals gate (non-negotiable, in this order)

**Every graphic**
1. One job, statable in one sentence; otherwise cut it.
2. Reads at the smallest size it is really seen at, not at canvas size.
3. Text in or over it meets 4.5:1 (3:1 at 24px, or 19px bold); meaning-bearing non-text parts meet 3:1 (WCAG 1.4.3, 1.4.11).
4. Text alternative planned: informative gets a short meaning, decorative `alt=""` or `aria-hidden="true"`, functional names the action.
5. Never color alone.
6. Right size, ratio and format for the destination (section 5, reference 06).
7. Consistent with its set: one grid, stroke, cap and join, palette, type system.

**Logos and wordmarks**
8. Works in one flat color, both polarities; recognizable at 16px; every tier drawn, not scaled (01).
9. On a page, the mark is outlined SVG artwork, never live text in a web font: the link carries the name (`aria-label="Ember & Oak, home"`) and the SVG is `aria-hidden`, or the SVG is `role="img"` with a `<title>`.
10. Clear space and minimum size in units of the mark (cap height), written down.
11. Logos are exempt from WCAG contrast (W3C Understanding 1.4.11), but a logo that is a link or control needs a contrasting variant, and a favicon's ink must reach 3:1 against what is behind it on every tab strip: test with `assets/tab_contrast.py`, and put the mark on its own field when the bare mark fails.

**Icons**
12. Visible labels except the few universal icons and standard controls; accessible name on icon-only buttons; decorative icons `aria-hidden`.
13. One family: one grid per rendered size, one cap and one join across the set, ink at least 1px inside the box, no hard-coded fill or stroke colors (`currentColor` and CSS only). `assets/icon_audit.mjs` exits 1 on any of these.
14. 3:1 where the icon alone carries meaning; status icons always paired with text.
15. Hit area 24x24 minimum, 44x44 on touch, whatever the glyph size.

**Photography and illustration** (the craft of single images; page use is design-art-direction)
16. Real people never presented as customers unless they are; releases and licenses cover the use; no readable text baked into images.

## 2. Decision rules

### Mark type
| Situation | Choose |
|---|---|
| Short ownable name (about 8 letters or fewer), type-led brand | Wordmark outlined from the brand face, one drawn detail; symbol from that detail for small sizes |
| Long or multi-word name | Wordmark plus monogram or symbol for small sizes |
| Lives mostly as app icon or avatar | Symbol or monogram first |
| Global or non-Latin audience, big exposure budget | Symbol plus wordmark lockup |
| Many sub-brands or outputs | Systematic identity with one fixed constant |
| Client wants the logo to "show what we do" | Push back: a logo identifies, it does not describe (Rand); take the detail from a true fact instead (design-art-direction concept) |

### Where each tier goes (01)
| Width of the mark | Tier | Detail |
|---|---|---|
| 320px and up (sign-off, hero, print) | 1 | Everything |
| 120 to 320px (site header at 24 to 28px tall, email) | 2 | Inner detail one step simpler (two rings to one) |
| 32 to 80px (packaging stamp, avatar) | 3 | Symbol alone, one ring |
| 16 to 32px (favicon, tab, menu bar) | 4 | Drawn separately: monoline, heavier, counters opened, on its own field if the bare mark fails a tab strip |

### Icon grid and stroke (02; stems from design-polish 03)
| Label text (Inter) | Icon box and grid | Stroke |
|---|---|---|
| 12px 500 | 12 on a 12 grid | 1.25px |
| 12px 600 | 12 on a 12 grid | 1.5px |
| 14px 500 | 16 on a 16 grid | 1.5px |
| 14px 600 (selected, bold) | 16 | 1.75px |
| 16px 400 to 500 | 20 on a 20 grid | 1.5 to 1.75px |
| 20px, standalone toolbar | 24 on a 24 grid | 2px |
| Feature, empty state | 32 or 48 | design-art-direction line weight |
Gap icon to label: 8 inline and in buttons, 12 in nav rows (opinion). Other faces: measure stems with design-polish `kb/research/polish/scripts/measure.mjs`.

### Where strokes land (measured, `kb/research/graphic/scripts/stroke-snap.mjs`)
A straight stem is crisp when both of its edges fall on device-pixel boundaries.
| Stroke | Put straight stems on | Result |
|---|---|---|
| 1px | .5 | crisp at 1x and 2x |
| 1.5px | .25 or .75 | crisp at 2x, one soft column at 1x (on .0 or .5: two soft columns at both) |
| 2px | whole pixels | crisp at 1x and 2x |
A 24-grid library icon shown at 16px (2px becomes 1.33px on 0.67px steps) is never crisp. Draw the small sizes.

### Library or custom
Use a mature library (Lucide, Phosphor, Material Symbols, SF Symbols) at its native grid when the product is not icon-led. Draw custom when the labels sit at 12 to 14px and the library is 24-grid (it will be soft), when the brand needs owned metaphors, or when you can draw the whole set plus 20 percent headroom in one style. (opinion)

### Thumbnail math (social and link images, 05)
Canvas text px = on-screen px / (display width / canvas width). A 1080 canvas shows at about 0.36 on phones: 16px on screen needs about 44 to 48px. Floor: nothing under 40px on 1080 wide. Main message 12 words or fewer.

## 3. Expert moves

Marks
1. **Outline from the instance you will see.** Instance the variable font at the mark's optical size (opsz 72, not the 16pt default) and measure cap and x height from H and x of that instance: OS/2 describes the default instance only (Newsreader: 1340 reported, 1430 measured, 7 percent off the clear-space unit). `assets/wordmark.py` does both.
2. **Space the word, not the font.** Tracking plus per-pair corrections on the actual word (a space around an italic ampersand is always too wide), set by eye at the size of use.
3. **Use the best ampersand the family has**, usually the italic one inside a roman word (Bringhurst 5.1.3: "In heads and titles, use the best available ampersand").
4. **Spend the awkward budget on one detail taken from the concept** (Haviv: "unusual in some way, even awkward"). Keep the letter's own outline and draw inside it, at the letter's own hairline weight, so the detail reads as part of the type.
5. **Draw the smallest version first, and drop detail by tier**, not by scaling: the inner rings that make the 1200px sign-off sing are mud at 28px.
6. **The favicon carries its own ground.** A bare mid-lightness brand color fails somewhere (Ember & Oak orange: 3.04:1 on white, 2.32:1 on a gray inactive tab), and `prefers-color-scheme` inside an SVG follows the OS, not the strip a themed browser paints (MDN). A rounded field in the darkest brand neutral fixes the contrast inside the icon.
7. **The sign-off is the mark at full measure.** A full-width outlined wordmark closing the page is the brand's loudest moment after the hero, at about 15 KB of paths. (opinion)
8. **Stress test before anyone sees it**: 16 and 32px, one color both ways, blur 4 to 8px, avatar circle, a light and a dark tab, upside down. Render it as a sheet (`kb/tests/design-graphic/mark-sheet.mjs` is a template).

Icons
9. **Stroke is a type property.** Set `--icon-stroke` in the same rule that sets font-weight (`[aria-current] { font-weight: 600; --icon-stroke: 1.75px }`); icons never carry a stroke-width attribute.
10. **Place stems on the device grid you ship to** (table above). Most "soft icons" are placement, not antialiasing.
11. **Solid status icons with the mark knocked out** in one evenodd path: one color, mass at 16px, works in both themes and forced colors, nothing hard-coded white or black.
12. **One source module, expanded inline.** Define each icon once and expand `{{i:name}}` at build. Sprites (`<use href>`) hide the shapes in a shadow tree, where the lint and the audit cannot see them.
13. **Audit the set with numbers** (`assets/icon_audit.mjs`): caps, joins, hard-coded colors, padding, ink share (optical volume) and partial pixels at 1x and 2x. On the combined Tally page the fundamentals lint and the polish audit both passed a set with mixed caps, mixed joins and white and black hard-coded inside status icons; the audit failed it.
14. **Draw the hard icons first** (settings, filter, sync, share), keep a metaphor table (concept, chosen, rejected, why), and write it in the icon module's header so the set cannot drift.
15. **Keylines**: a circle icon and a square icon in the same box look different sizes; on a 16 grid use circle 13, square 12 (Material's 20 and 18 on 24, scaled; opinion).

Single graphics
16. **Design the series template, not the post**, review in a feed mockup at phone size, and treat the OG image as your most viewed graphic (05).

## 4. Key numbers (sources in references)
| Item | Spec |
|---|---|
| Open Graph image | 1200 x 630, min 600 x 315, 8 MB; `og:image:alt` |
| X large card | 2:1, min 300 x 157, under 5 MB, no SVG |
| Instagram feed | 1080 x 1350 (4:5); grid crops 3:4 since early 2025 |
| Stories and Reels | 1080 x 1920; text in the center 70% |
| YouTube thumbnail | 16:9, 3840 x 2160 recommended, min width 640, 2 MB mobile upload |
| Favicon set | ICO 32, SVG, apple-touch 180, PWA 192 and 512, maskable 512 with logo in 409 |
| iOS app icon | 1024 master, layered in Icon Composer, no baked mask, Default, Dark, Clear and Tinted appearances |
| Android adaptive icon | 108 dp layers, 66 dp safe zone, logo 48 to 66 dp, monochrome layer |
| Print | 300 ppi, CMYK, 3 mm bleed, PDF/X-4 unless the printer says otherwise |
| Inline SVG budget | about 150 KB per page (design-art-direction); an outlined wordmark is 10 to 20 KB |
Platform specs are volatile; recheck quarterly.

## 5. Workflow
1. State the job, audience, destinations and smallest viewing size. For a mark, get positioning first (website-strategy) and the concept (design-art-direction).
2. Pick the visual type and, for identity work, the mark type.
3. Build in one color at the smallest size first; then scale up and add color.
4. Run the gate, then the stress tests and `icon_audit.mjs`.
5. Specify sizes, tiers, clear space, tokens, formats, names, alt text. Export per 06.

## 6. Assets (all run on the test pages)
| Run (from the design-kb repo root) | Does |
|---|---|
| `python3 skills/design-graphic/assets/wordmark.py FONT.ttf "Ember & Oak" --axes wght=480,opsz=72 --swap "&=ITALIC.ttf" --slot O --track -16 --kern "r =-24, &=-20" --json wm.json > wm.svg` | Outlines a word from a font (variable instance, italic swap, tracking, pair kerning on top of the font's own), one path per glyph; `--slot` leaves one letter's outline aside for a drawn detail; JSON gives cap height (measured), x height, advances. Needs fontTools. |
| `node skills/design-graphic/assets/icon_audit.mjs page.html [--selector "svg.i"] [--json out.json]` | Renders every distinct small icon alone at 1x and 2x and reports stroke, caps, joins, padding, ink share and partial pixels; exit 1 on mixed caps or joins, hard-coded colors, or ink touching the box. |
| `python3 skills/design-graphic/assets/tab_contrast.py "#f26b21" [--strips "#fff,#dee1e6,#202124"]` | Favicon color against light, gray and dark tab strips; exit 1 under 3:1. |

## 7. Reference map
| Read | When |
|---|---|
| `references/01-logo-identity.md` | Marks, wordmarks, outlining, tiers, clear space, lockups, favicons as marks, presenting identity work |
| `references/02-icon-systems.md` | Icon grids, stroke and placement, product icon sets, metaphors, status icons, app icons, the audit |
| `references/03-photography-direction.md` | The professional shot brief, stock selection, AI imagery rules (crops, treatment, text over photos: design-art-direction 02 and 03) |
| `references/04-illustration.md` | Illustration tiers and the style spec (drawn visuals without image hosts: design-art-direction 04) |
| `references/05-composition-social.md` | Social posts, OG images, carousels, ads, posters |
| `references/06-export-formats.md` | Formats, logo kits, favicon code, SVG hygiene, print |

## 8. Related skills
design-art-direction (concept, photography, text over images, code-drawn visuals), design-polish (stem tables, radius, the polish pass), design-typography (brand face, optical sizes), design-color (palettes, contrast, CMYK), design-layout (grids), design-ux (labels, empty states), design-motion (logo and icon animation), design-copy and copywriting (headlines, alt voice), design-frontend (inline SVG, image delivery), design-search (og tags), website-strategy (positioning before identity), sales-funnels (ad creative testing).
