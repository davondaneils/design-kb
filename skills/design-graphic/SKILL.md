---
name: design-graphic
description: Graphic design at top-studio level for logos and identity systems, icon sets, app icons and favicons, photography and art direction, illustration styles, social and marketing graphics (Open Graph images, posts, carousels, ads, posters), composition, and file export (SVG, PNG, WebP, AVIF, print PDF, logo kits). Use when someone asks to design, critique or spec a logo, wordmark, monogram, brand mark, visual identity, brand guidelines, icon or icon set, app icon, favicon, hero image, photo shoot brief, stock photo selection, AI image direction, illustration style, empty state art, social post, link preview, thumbnail, banner, poster, or asks which file formats and sizes to export. Not for palettes (design-color), font choice (design-typography), page layout (design-layout) or positioning (website-strategy).
---

# design-graphic

Make graphics a top identity studio would sign off on. Run the fundamentals gate first; one miss fails the work no matter how clever the rest is. Then apply the expert moves.

All defaults follow the design-kb foundation contract: 4 px spacing scale (0, 2, 4, 8, 12, 16, 24, 32, 48, 64, 96, 128), type scale 12, 14, 16, 20, 25, 31, 39, 49, 61, semantic color roles (`--color-text`, `--color-text-muted`, `--color-primary`, `--color-bg` and so on), radius 0, 4, 8, 12, 16, full, WCAG 2.2 AA, targets 24x24 CSS px minimum and 44x44 preferred, tokens named `--{category}-{role}-{variant}`.

## 1. Fundamentals gate (non-negotiable, check in this order)

**Every graphic**
1. It has one job, statable in one sentence. If not, cut it (NN/g: decorative filler is ignored).
2. It reads at the smallest real size it will be seen at, not at canvas size.
3. Text in or over graphics meets 4.5:1 (3:1 for 24 px plus or 19 px bold plus); meaning-bearing non-text parts meet 3:1 (WCAG 1.4.3, 1.4.11).
4. Text alternative planned: informative = short alt with meaning; decorative or redundant = `alt=""` or `aria-hidden="true"`; functional = the action (W3C alt decision tree).
5. Information is never carried by color alone.
6. Correct dimensions, ratio and format for the destination (section 4).
7. Consistent with its set: same grid, stroke, grade, palette, type system.

**Logos**: works in one flat color in both polarities; recognizable at 16 px; reversed version drawn as its own artwork; clear space and minimum sizes defined in units; wordmark properly spaced; no conflict in a basic category search. Logos are exempt from WCAG contrast, but a logo used as a link or control needs a contrasting variant or a contrasting added element.

**Icons**: visible labels except for the few universal icons and standard controls; 3:1 when the icon alone carries meaning; hit area 24x24 minimum, 44x44 on touch; one library per product; pixel clean at 1x; accessible name on icon-only buttons.

**Photography and illustration**: real people never presented as customers unless they are; releases and licenses cover the use; source at least 2x the slot width; responsive crops keep faces whole; no baked-in text that must be read or translated.

**Export**: logos and icons as SVG; photos as AVIF or WebP with JPEG fallback; sRGB for screen; `width`, `height`, `alt` on every `img`; never lazy-load the LCP image; print at 300 ppi, CMYK to the printer's profile, 3 mm (0.125 in) bleed.

## 2. Decision rules

### Mark type
| Situation | Choose |
|---|---|
| New brand, short ownable name (about 8 letters or fewer) | Wordmark; add a monogram if avatars and favicons matter |
| Long or multi-word name | Wordmark plus monogram or symbol for small sizes |
| Lives mostly as app icon or avatar | Symbol or monogram first |
| Big exposure budget, global or non-Latin audience | Symbol plus wordmark lockup |
| Many sub-brands or outputs | Systematic identity with one fixed constant |
| Client wants the logo to "show what we do" | Push back: a logo identifies, it does not describe (Rand) |

### Picture choice
| Need | Use |
|---|---|
| Proof: real people, product, place, result | Photography |
| Abstract concept, process, empty or error state | Illustration |
| Action or object in UI | Icon with label |
| How a UI works, without real data | Low-fidelity UI illustration |
| Nothing informative to show | No image; strong type instead |

### Icon size pairing (foundation scale)
| Text | Icon token | Icon px | Gap |
|---|---|---|---|
| 12 or 14 (`--text-xs`, `--text-sm`) | `--size-icon-sm` | 16 | 4 |
| 16 (`--text-base`) | `--size-icon-md` | 20 | 8 |
| 20 (`--text-lg`) or standalone toolbar | `--size-icon-lg` | 24 | 8 |
| Feature, empty state | `--size-icon-xl` | 32 | n/a |
| Large display | `--size-icon-2xl` | 48 | n/a |

Default icon spec: 24 grid, 20 live area, 2 px centered stroke, one cap and join style, corner radius 2 (1 under 8 px), 2 px gaps, keylines circle 20 and square 18, `currentColor`.

### Thumbnail math (social and link images)
Canvas text px = on-screen px / (display width / canvas width). A 1080 canvas shows at about 0.36 on phones, so 16 px on screen needs about 44 to 48 px on canvas. Floor: nothing under 40 px on 1080 wide. Main message 12 words or fewer.

## 3. Expert moves (what lifts work above competent)

Logo and identity
- Design the smallest version first: sketch the 16 px favicon and 40 px avatar crop before the big lockup.
- Spend the "awkward" budget on exactly one detail (Haviv: unusual, even awkward, to hook the eye); everything else quiet.
- Stress test suite before presenting: 16 and 32 px, one color both ways, blur at 4 to 8 px, competitor wall of 12 to 20 grayscale marks at 48 px, real contexts at real scale, upside down.
- Optical corrections: overshoot rounds about 1 to 3 percent; thin the reversed artwork (irradiation); center by eye; thin horizontals in geometric forms.
- Responsive logo tiers: full lockup, lockup without tagline, symbol, and a separately drawn 16 to 32 px version with heavier strokes and open counters.
- Draw separate reversed and dark mode versions; check the symbol inside a circular avatar crop.
- Present 2 or 3 directions, one sentence of idea each, each in 3 real contexts. Kill the seconds before the client sees them.
- AI image tools are for exploration only: US copyright needs human authorship ("not the mere provision of prompts"), so redraw the chosen idea by hand.

Icons
- Draw the hard icons first (settings, filter, sync, share, analytics); they set the detail budget.
- Blur review the whole set at 1x in light and dark; outliers in weight jump out.
- Never scale 24 to 16: draw 16 px variants on a 16 grid with 1.5 px strokes, or keep absolute stroke and simplify.
- Keep a metaphor table (concept, chosen metaphor, rejected options) to stop drift.
- App icons and favicons are derivations: the symbol, larger, on a color field; never the shrunk lockup.

Photography and illustration
- Brief the moment as a verb ("walking the board through next quarter"), not a pose.
- Lay out the page before the shoot and shoot to it, in 16:9, 4:5 and 1:1 at the same moment.
- One grade across a set; push brand color into environment and shadows, protect skin tones.
- Write the illustration spec from the first 10 to 15 finished pieces, then hold every new piece to it.

Social and marketing
- One focal point at about 3x the area of anything else; headline at least 2x the support text.
- Design the series template, not the post. Treat the OG image as your most viewed graphic: show the product or a sharp claim, not the logo alone.
- Review in a real feed mockup at phone size, between other posts.

Export
- Ship one color SVGs with `fill="currentColor"` so tokens recolor them.
- Put a dark mode media query in the favicon SVG.
- Test where it lands: paste the link in Slack, X and iMessage; check separations in Acrobat Output Preview; open SVGs at 400 percent.

## 4. Key numbers (sources in references)

| Item | Spec |
|---|---|
| Open Graph image | 1200 x 630 (about 1.91:1), min 600 x 315, 8 MB; set `og:image:alt` (Meta, ogp.me) |
| X large card | 2:1, min 300 x 157, under 5 MB, no SVG (X docs) |
| Instagram feed and carousel | 1080 x 1350 (4:5); grid crops 3:4 (since early 2025) |
| Stories and Reels | 1080 x 1920 (9:16); text and logos in the center 70% |
| YouTube thumbnail | 16:9, 3840 x 2160 recommended, min width 640, 2 MB on mobile upload |
| Favicon set | ICO 32, SVG, apple-touch 180, PWA 192 and 512, maskable 512 with logo in 409 (Evil Martians) |
| iOS app icon | 1024 master, layered in Icon Composer, no baked mask, Default, Dark and Mono appearances |
| Android adaptive icon | 108 dp layers, 66 dp safe zone, logo 48 to 66 dp, monochrome layer |
| LCP image | not lazy, `fetchpriority="high"`, target LCP 2.5 s at p75 (web.dev) |
| Print | 300 ppi, CMYK, 3 mm bleed, PDF/X-4 unless the printer says otherwise |
Platform specs are volatile; recheck quarterly.

## 5. Workflow for any graphic request
1. State the job, audience, destinations and smallest viewing size. If positioning is missing for a brand mark, get it first (website-strategy).
2. Pick the visual type (picture choice table) and the mark type if it is identity work.
3. Build in one color and at the smallest size first; then scale up and add color.
4. Run the fundamentals gate, then the relevant stress tests.
5. Specify: sizes, clear space, tokens, formats, names, alt text.
6. Export per section 4 and the kit matrix in references/06.

## 6. Reference map
| Read | When |
|---|---|
| references/01-logo-identity.md | Logos, wordmarks, monograms, lockups, clear space, brand systems, presenting identity work |
| references/02-icon-systems.md | Icon sets, extending libraries, app icons, favicons as marks |
| references/03-photography-direction.md | Shot briefs, stock selection, crops, grading, text on photos, AI imagery |
| references/04-illustration.md | Illustration tiers, style specs, empty and error states |
| references/05-composition-social.md | Social posts, OG images, carousels, ads, posters, composition |
| references/06-export-formats.md | Formats, logo kits, favicon code, responsive images, SVG hygiene, print |

## 7. Related skills
design-color (palettes, contrast, CMYK conversions), design-typography (wordmark type, brand type), design-layout (grids, heroes), design-ux (labels, empty states), design-motion (logo and icon animation), design-copy and copywriting (headlines, hooks, alt voice), design-frontend (image delivery), design-search (image SEO, og tags), website-strategy (positioning before identity), sales-funnels (ad creative testing).
