# Research 02: Icon systems

Status key: **C** consensus, **X** contested, **O** opinion.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Lucide rules: 24x24 canvas, at least 1px padding, 2px centered stroke, round caps and joins, rectangle corner radius 2px (1px if under 8px), 2px between distinct elements, similar optical volume to a circle and square (check by blurring), center by visual center of gravity, smooth curve joins, pixel snap where possible; SVG with viewBox 0 0 24 24, paths minified to 2 decimal places. | Lucide icon design guide [I1] | C (published spec) |
| 2 | Material system icons: 24dp grid, 20dp live area with 2dp padding, 2dp stroke; keyline shapes (circle, square, portrait and landscape rectangles) give consistent optical size. | Material Design system icons [I2] (page needs JS; spec widely mirrored, e.g. UCLA and GovTech design systems [I3][I4]) | C |
| 3 | Material Symbols is a variable icon font with axes: fill 0 to 1, weight 100 to 700, optical size 20 to 48dp, plus grade (finer than weight). Optical size exists because one drawing does not work at every size. | 9to5Google on Material Symbols [I5] | C |
| 4 | Only a few icons are universally recognized (home, print, search); most are ambiguous. Labels should be visible at all times; hover-only labels fail on touch. "If it takes you more than 5 seconds to think of an appropriate icon," it will not communicate. Test recognition and memorability. | NN/g Icon Usability [I6] | C (research) |
| 5 | Icons that carry meaning without text need 3:1 against adjacent colors; icons paired with a text label that conveys the same information are not required for understanding. | W3C Understanding 1.4.11 [I7] | C (standard) |
| 6 | Target size minimum 24x24 CSS px (WCAG 2.2 SC 2.5.8, AA); 44x44 preferred for touch. | WCAG 2.2; foundation contract | C |
| 7 | iOS app icons: 1024x1024 master; Icon Composer builds layered icons with up to 4 groups; appearances Default, Dark, Mono (Clear, Tinted Light, Tinted Dark); keep artwork flat and opaque and add glass effects in Icon Composer; convert text to outlines; export at full canvas; "Never include a rounded rectangle or circle mask"; Mono needs at least one nearly white element. watchOS template 1088x1088. | WWDC25 session 361 notes [I8]; Create with Swift [I9] | C (platform) |
| 8 | Android adaptive icons: all layers 108x108dp; outer 18dp per side reserved for mask and effects; 66x66dp safe zone never clipped; logo 48 to 66dp; provide a monochrome layer for themed icons (Android 13+); from Android 16 QPR 2 the system auto-themes apps without one. | Android Developers, adaptive icons [I10] | C (platform) |
| 9 | Favicon set: ICO 32x32, SVG with prefers-color-scheme dark styling, apple-touch-icon 180x180 with about 20px padding and a background color, 192 and 512 PNG, maskable 512 with logo in central 409x409. | Evil Martians, How to Favicon [I11] | C (widely adopted) |
| 10 | A fort plan drawn at 44 to 56px: square corner towers read as a design tool's anchor points, round ones as a network diagram; one square cut into four mitred wall pieces read as walls. | Claude's desktop pass on the Stand Firm results page, 2026-10-29 (renders at 390 and 1280; the page's design-log.md) | P (one job, self-review) |

## Numbers
- 24 canvas, 20 live area, 2 stroke (Material); 24 canvas, 1 min padding, 2 stroke (Lucide).
- Material Symbols optical size 20 to 48; weight 100 to 700.
- Target 24x24 min, 44x44 preferred.
- Android: 108 / 66 / 48dp. Apple: 1024 master.

## Conflicting views
- Padding 1px (Lucide) vs 2dp (Material): both valid; pick one per set. (X, trivial)
- Outline vs filled as default: Material and Apple both use filled to show a selected state in navigation (platform practice); some teams use filled everywhere for small sizes. (X)
- Icon fonts vs SVG: icon fonts cause accessibility and rendering issues; inline SVG or SVG components are the current default; Material Symbols as a variable font is the main exception. (X, trend toward SVG)

## Practitioner tier
- Phosphor, Lucide, Tabler, Heroicons, SF Symbols as reference sets; their public guides are the de facto specs.
- Community articles on 2,000 icon pack guidelines [I12]: reinforce keyline and optical volume checks.

## Sources
- [I1] https://lucide.dev/guide/design/icon-design-guide
- [I2] https://material.io/design/iconography/system-icons.html
- [I3] https://designsystem.brand.ucla.edu/build/v2.7.0/docs/style-guide/iconography.html
- [I4] https://designsystem.tech.gov.sg/foundations/iconography
- [I5] https://9to5google.com/2022/04/21/google-fonts-material-symbols/
- [I6] https://www.nngroup.com/articles/icon-usability/
- [I7] https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- [I8] https://wwdcnotes.com/documentation/wwdc25-361-create-icons-with-icon-composer/ ; video https://developer.apple.com/videos/play/wwdc2025/361
- [I9] https://www.createwithswift.com/crafting-liquid-glass-app-icons-with-icon-composer/
- [I10] https://developer.android.com/develop/ui/views/launch/icon_design_adaptive
- [I11] https://evilmartians.com/chronicles/how-to-favicon-in-2021-six-files-that-fit-most-needs
- [I12] https://uxplanet.org/developing-design-guidelines-for-a-2-000-minimal-icons-pack-96d78dddec8d
