# Color
Where to go deeper on color: perception, perceptual color spaces (OKLCH), contrast, and UI color systems. Read the WCAG contrast rules first (the floor), then the OKLCH article (the working model), then the Radix scale (how a palette maps to UI roles).

## Start here
- **WCAG 2.2 contrast criteria (1.4.3 and 1.4.11):** the legal and accessibility floor every palette must clear before taste enters (opinion).
- **Evil Martians, "OKLCH in CSS":** the clearest practical case for building palettes in OKLCH instead of HSL or hex (opinion).
- **Radix Colors, "Understanding the scale":** the best short spec of how 12 steps map to backgrounds, borders, solids and text (opinion).

## Entries

### Interaction of Color, Josef Albers (book)
- **Who / what:** Albers' 1963 teaching text on how colors change each other in context; Yale University Press, 50th anniversary edition (2013) plus an iPad app.
- **Best for:** training the eye: why the same swatch looks different on different grounds, simultaneous contrast, vibrating edges, apparent transparency.
- **Why it meets the bar:** in print continuously since the 1971 paperback, over a quarter of a million copies sold per the WorldCat record, and cited on every syllabus of Yale's undergraduate Color course for a decade per Yale University Press. Opinion: the one color book that ages well because it is about perception, not fashion.
- **Link:** https://yalebooks.yale.edu/book/9780300179354/interaction-of-color
- **Tier:** 3
- **Checked:** Yale University Press book page (50th anniversary edition, 208 pages, published 28 Jun 2013), Yale News on the 2013 iPad app, WorldCat summary; accessed 2026-10-10. Already used in kb/research/color/01-fundamentals-models.md.

### WCAG 2.2 Understanding docs: Contrast (Minimum) and Non-text Contrast (docs)
- **Who / what:** the W3C's normative contrast thresholds and their explanatory "Understanding" pages.
- **Best for:** the hard numbers: 4.5:1 for body text, 3:1 for large text (1.4.3), 3:1 for UI component boundaries, states and meaningful graphics (1.4.11), 7:1 for AAA (1.4.6).
- **Why it meets the bar:** it is the standard that accessibility law and audits reference. Opinion: know its known weakness (it misjudges dark mode, see APCA below) but never ship below it.
- **Link:** https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html and https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- **Tier:** 1
- **Checked:** both Understanding pages and the WCAG 2.2 recommendation text for 1.4.3, 1.4.6, 1.4.11; accessed 2026-10-10. Already used in kb/research/color/03-contrast-accessibility.md.

### CSS Color Module Level 4, with Björn Ottosson's Oklab post (docs)
- **Who / what:** the W3C spec that defines `oklch()`, `oklab()`, `lch()`, `color()` and wide-gamut spaces such as Display P3; Oklab itself comes from Björn Ottosson's 2020 post "A perceptual color space for image processing".
- **Best for:** exact definitions of the color functions and spaces a palette will be written in; the Ottosson post explains why Oklab predicts lightness, chroma and hue better than CIELAB and HSL.
- **Why it meets the bar:** it is the spec browsers implement. Ottosson's post is the primary source the spec adopted. Opinion: read the post once to understand why OKLCH lightness is trustworthy for building scales.
- **Link:** https://www.w3.org/TR/css-color-4/ and https://bottosson.github.io/posts/oklab/
- **Tier:** 1 (spec); the Ottosson post is a primary-source practitioner write-up, tier 4
- **Checked:** spec's list of Level 4 color functions; Ottosson post's stated design goals; CSS-Tricks almanac confirming Ottosson as Oklab's creator; accessed 2026-10-10. Already used in kb/research/color/01-fundamentals-models.md.

### Evil Martians: "OKLCH in CSS" and the oklch.com picker (practitioner + tool)
- **Who / what:** article by Andrey Sitnik (creator of PostCSS and Autoprefixer) and Travis Turner, plus the open-source OKLCH Color Picker and Converter by Sitnik and Roman Shamin.
- **Best for:** moving a palette from hex/HSL to OKLCH: predictable lightness, P3 colors with sRGB fallbacks, relative color syntax, gamut mapping. The picker shows which colors fall outside sRGB or P3.
- **Why it meets the bar:** shipped, widely used tool (oklch.com) with open source code on GitHub; the article is maintained (dated 2025-09-17) rather than a one-off. Opinion: the best on-ramp to perceptual color for working designers.
- **Link:** https://evilmartians.com/chronicles/oklch-in-css-why-quit-rgb-hsl and https://oklch.com/
- **Tier:** 4
- **Checked:** article page (authors, date, LCH blue hue-shift explanation, P3 media-query fallback pattern), oklch.com credits, Evil Martians open-source page linking github.com/evilmartians/oklch-picker; accessed 2026-10-10. Already used in kb/research/color/01-fundamentals-models.md.

### Radix Colors (docs / tool)
- **Who / what:** open-source UI color system (now a WorkOS project) with 12-step scales, alpha variants, dark mode and P3 support.
- **Best for:** a ready rule for which step does which job: 1 to 2 app backgrounds, 3 to 5 component backgrounds and hover/active, 6 to 8 borders and focus rings, 9 to 10 solid fills, 11 to 12 text. Steps 11 and 12 target APCA Lc 60 and Lc 90 on step 2.
- **Why it meets the bar:** shipped system used by Radix Themes and many products; every claim is inspectable in the published scales. Opinion: the most transferable mental model for UI palettes, whether or not you use its colors.
- **Link:** https://www.radix-ui.com/colors/docs/palette-composition/understanding-the-scale
- **Tier:** 4
- **Checked:** "Understanding the scale" page (12 steps and use cases, APCA guarantee for steps 11 to 12, which step-9 colors need dark text); Radix Colors home; a GitHub issue noting some scales once missed a stated 4.5:1 guarantee, so verify contrast yourself; accessed 2026-10-10. Already used in kb/research/color/02, 03, 04.

### Material Design 3 color system and HCT (docs)
- **Who / what:** Google's color system: roles, tonal palettes (tone 0 to 100) and the HCT space (hue, chroma, tone) built on CAM16 plus CIELAB L*; source code in material-color-utilities.
- **Best for:** generating light, dark and high-contrast schemes from one seed color; understanding why "tone" gives contrast you can reason about; the Material Theme Builder Figma plugin.
- **Why it meets the bar:** official docs for a system shipped across Android; the "Science of Color & Design" post explains the HCT reasoning. Opinion: copy the role architecture even if you never use Material's look.
- **Link:** https://m3.material.io/styles/color/system/how-the-system-works and https://m3.material.io/blog/science-of-color-design
- **Tier:** 1
- **Checked:** "How the system works" (HCT, tonal palettes 0 to 100, warning not to conflate HSL and HCT), Science of Color blog (2022-02-17), material-color-utilities README listing hct, palettes, scheme, contrast modules; accessed 2026-10-10. Already used in kb/research/color/02 and 04.

### APCA, the Accessible Perceptual Contrast Algorithm (tool / research)
- **Who / what:** contrast method by Andrew Somers (Myndex Research, W3C Invited Expert); outputs a lightness contrast value (Lc) that accounts for text size, weight and polarity.
- **Best for:** dark mode and colored backgrounds, where WCAG 2 ratios mislead; rough guide from its docs: Lc 90 preferred and Lc 75 minimum for body text.
- **Why it meets the bar:** the most rigorous modern contrast model and the basis of Radix's text steps. Caveat (fact, from its own docs): it is a candidate for the future WCAG 3, not a standard, and nothing can be "WCAG 3 compliant" yet. Opinion: design with APCA, then confirm WCAG 2.2 still passes.
- **Link:** https://git.apcacontrast.com/documentation/APCAeasyIntro
- **Tier:** 4 (not a standard)
- **Checked:** APCA "Easy Intro", "README" and "minimum compliance" pages, Myndex GitHub repo; accessed 2026-10-10. Already used in kb/research/color/02 and 03.

### Refactoring UI, Adam Wathan and Steve Schoger (book)
- **Who / what:** a 218-page design-for-developers book (2018) by Adam Wathan (creator of Tailwind CSS) and visual designer Steve Schoger; includes hand-built palettes with 10 shades per color.
- **Best for:** practical UI color tactics: build more shades than you think, use greys with a hint of hue, do not rely on color alone, define the palette before designing.
- **Why it meets the bar:** authors' shipped work is Tailwind CSS and its sites, whose resources page recommends the book; Schoger's site says over 10,000 copies sold. Opinion: the fastest route from "it looks off" to a fix; its rules are tactics, not research, so treat them as opinion.
- **Link:** https://www.refactoringui.com/ (X: https://x.com/steveschoger and https://x.com/adamwathan, lead only, tier 5)
- **Tier:** 4
- **Checked:** refactoringui.com contents (palettes, 50 chapters), steveschoger.com (bio, Twitter link, sales figure), Open Library record (2018, 218 pages); accessed 2026-10-10. Already used in kb/research/color/01, 02, 04.

### Matt Ström-Awn, "How to pick the least wrong colors" (practitioner)
- **Who / what:** design leader (Stripe design director 2022 to 2024, Head of Design at Copilot Money) and founding editor of the W3C Design Tokens Community Group.
- **Best for:** generating categorical palettes that are on-brand, accessible and distinct at once, using optimization (simulated annealing) instead of guesswork; follow-up posts on palettes for design systems.
- **Why it meets the bar:** work came out of Stripe's data visualization palette, and the post names its tradeoffs against Viridis and ColorBrewer. Opinion: the best worked example of treating color as a constraint problem.
- **Link:** https://mattstromawn.com/writing/how-to-pick-the-least-wrong-colors (active on Bluesky, not X: https://bsky.app/profile/mattstromawn.bsky.social, lead only, tier 5)
- **Tier:** 4
- **Checked:** the article, his writing index (also "How to generate color palettes for design systems" and "The least wrong colors, version 2"), About page with roles and the Design Tokens group; accessed 2026-10-10. Already used in kb/research/color/02-palette-building.md.

### ColorBrewer, Cynthia Brewer (tool)
- **Who / what:** palette tool from Penn State cartographer Cynthia Brewer (with Mark Harrower), sorted into sequential, diverging and qualitative schemes with colorblind-safe and print-safe filters.
- **Best for:** data colors in charts and maps; choosing the scheme type from the nature of the data.
- **Why it meets the bar:** built on Brewer's cartography research at Penn State (faculty since 1994) and bundled into R (RColorBrewer) and most plotting libraries. Opinion: still the reference for choosing a data scheme type, though some of its palettes fall short on accessibility, as Ström-Awn notes.
- **Link:** https://colorbrewer2.org/
- **Tier:** 3
- **Checked:** colorbrewer2.org (filters, export formats, credits), Brewer's Penn State faculty page, RColorBrewer manual describing the three scheme types; accessed 2026-10-10. Already used in kb/research/color/02 and 04. For chart color specifically, also see the dataviz skill.

## Considered and dropped
- **Johannes Itten, The Art of Color:** historically important, but its seasonal "color types" are subjective, and Albers covers perception better. Kept as background in the research notes, not a primary reference.
- **Adobe Leonardo (leonardocolor.io):** a good tool that generates colors from target contrast ratios (used in Adobe Spectrum). Dropped to stay at ten because Radix and Material already cover contrast-driven scales. Worth using as a tool.
- **Color.js and Lea Verou's color posts:** expert work by CSS Color spec editors, but it is an engineering library. For design decisions the CSS Color 4 spec and the OKLCH article cover the same ground.
- **Random palette generators (Coolors and similar):** fast, but they generate swatches with no roles, scales or contrast logic.
- **Pantone Color of the Year and "color psychology" listicles:** trend marketing and weak evidence. Brand color meaning is handled with sources in kb/research/color/05-psychology-brand.md.
