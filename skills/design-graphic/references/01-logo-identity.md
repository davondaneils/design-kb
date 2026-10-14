# Logo and identity

Sources: research/graphic/01-logo-identity.md (R-numbers) and 07-marks-icons-rendered.md (G and M numbers). Opinion is marked (opinion).

## Principles
1. **A logo identifies; it does not explain.** Rand: "A logo doesn't sell (directly), it identifies" and is "rarely a description of a business" [R1]. Do not try to show what the company does.
2. **Meaning is earned by association.** The mark is an empty vessel the business fills over years [R1]. So the mark's job on day one is to be distinct, simple and appropriate, not meaningful.
3. **Simple and distinctive at once.** Simplicity alone produces generic marks; Haviv's rule is simple in form but "unusual in some way, even awkward" to hook the eye [R2].
4. **The identity is the system, not the mark.** Recognition is carried by a small set of repeated assets: mark, wordmark type, 1 or 2 owned colors, a layout or graphic device, an image style, a voice. (opinion, observed across studio work such as Pentagram's MIT Media Lab system [R8])
5. **Design by eye, verify by grid.** Build on a grid for consistency, then correct optically; geometry that is mathematically exact often looks wrong [R3][R4].

## Fundamentals gate (all must pass before any creative judgment)
- Works in **one flat color**, black on white and white on black, with no gradients, shadows or tints.
- Recognizable at **16 CSS px** (favicon) and at the smallest print size you specify.
- Has a **separately drawn reversed version** (not just inverted), corrected for irradiation.
- Clear space and minimum size are **defined in units** and written down.
- Wordmark letterforms are **legible and correctly spaced** (no default tracking, no faux bold, no stretched type).
- No trademark conflict found in a basic search of the category (opinion: always run one; legal clearance is the client's lawyer's job).
- Brand colors used for text meet WCAG AA (4.5:1 body, 3:1 large) wherever the logo color doubles as a UI color; the logo itself is exempt from contrast rules, but a logo used as a link or button needs a contrasting variant or added contrasting element [R7].

## Decision rules

### Which kind of mark
| Situation | Choose | Why |
|---|---|---|
| New brand, name is short (up to about 8 letters) and ownable | Wordmark, optionally with a monogram for small sizes | The name must be learned first; a wordmark teaches it every time (opinion) |
| Long name or multi-word name | Monogram or symbol for small sizes plus a full wordmark | Long wordmarks fail at 16 to 32 px |
| Brand will live mostly as an app icon, avatar or favicon | Symbol or monogram first, wordmark second | The small square is the main touchpoint |
| Large exposure budget, global or non-Latin audiences | Symbol plus wordmark lockup, with a plan to run the symbol alone later | Symbols transcend language but need exposure to become recognized (opinion) |
| Organization with many sub-brands or changing outputs | Consider a systematic or dynamic identity with a fixed core | MIT Media Lab style generators work when a constant element stays fixed [R8] |
| Client asks for a mark that "shows what we do" | Push back with Rand's principle; offer a distinctive form with an apt idea at most | Literal marks date quickly and look like competitors (opinion grounded in [R1]) |

### When the mark is done: the stress test suite
Run every candidate through all of these, side by side, before presenting:
1. **16 px and 32 px** on a browser tab mockup and as a 40 px avatar circle (crop risk).
2. **One color, both polarities.**
3. **Blur test:** apply a 4 to 8 px Gaussian blur at 200 px size; the silhouette alone should still be identifiable. (opinion, common studio practice)
4. **Competitor wall:** place it in a grid with 12 to 20 category marks, all grayscale at 48 px. If yours does not pop out or could be swapped with one, it fails distinctiveness. (opinion)
5. **Context:** signage, packaging or product UI at real scale, not floating on a gray artboard.
6. **Medium specific:** embroidery (no strokes under about 1 mm, opinion), laser etch, one-color screen print, if relevant.
7. **Upside down and mirrored:** catches accidental shapes and unwanted readings. (opinion)

### Optical corrections (apply every time)
- **Overshoot:** round forms extend about 1 to 3 percent past flat baselines and cap lines so they look the same size [R5].
- **Irradiation:** light on dark looks heavier; thin the reversed artwork by eye (often a hairline per stroke at display size) and save it as a separate file [R4].
- **Optical centering:** a symbol inside a circle or a triangle in a square sits slightly above mathematical center to look centered [R3].
- **Horizontal vs vertical strokes:** horizontals look thicker than verticals of the same weight; thin horizontals slightly in geometric wordmarks (type design convention, opinion).
- **Custom wordmark spacing:** set spacing by eye on the actual word; fix awkward pairs (for example "AV", "rn" reading as "m") and consider ligatures or a modified letter as the single ownable detail.

### Lockups and specification
- Ship at least: **primary lockup** (horizontal), **stacked lockup**, **symbol or monogram alone**, **wordmark alone**.
- **Clear space unit:** derive it from the mark (for example the height of the wordmark's x-height or of a symbol element) so it scales with the logo [R10][R11]. Default (opinion): clear space = cap height of the wordmark on all sides.
- **Minimum sizes:** state per medium. Defaults (opinion, adjust after the stress test): horizontal lockup 80 px wide on screen and 25 mm in print; symbol alone 16 px on screen and 6 mm in print.
- **Color versions:** full color, one color dark, one color light (reversed artwork), and if needed a version for photography backgrounds.
- **Misuse page:** do not stretch, recolor, outline, add effects, rotate, or place on busy images without the approved treatment.

### Lockup proportion (symbol beside a wordmark)
No guide publishes a universal ratio; the good ones anchor to one unit taken from the logo and finish by eye for equal weight ("Visual balancing should give all logos the same weight") [R21]. Rules:
1. **Pick one unit from the logo and build everything on it:** the symbol height X [R20], a letter height such as the "e" [R22], or a glyph part such as the wordmark's dot [R23]. Gap, clear space and alignment are all fractions of it.
2. **Align to type metrics, not the text box.** The symbol spans ascender to baseline, or cap line to baseline, or sits centered on the cap height [R22]. A second line (descriptor, "Inc.", "Build Co.") hangs below like a tagline and is never included in the symbol's height. Sizing to the whole block is the most common reason a lockup looks "off" [M5].
3. **Match visual weight, not height.** Compact, roughly square symbols balance at about 1.5 to 2 times the cap height; wide or dense symbols carry more ink per unit of height and sit nearer 1 to 1.25 times (Flagship: a 1.5:1 three-flag symbol balanced at 1.08 times cap height) [M5]. Allow about 10 percent of optical adjustment after measuring [R24]. (opinion on the ranges)
4. **Gap = 1/4 to 1/3 of the symbol height** [R20][M5]. Open it toward 1/3 when the first letter's serif or sidebearing already adds space. (opinion)
5. **Align uneven symbols optically.** A heavy base or light points shift the perceived center; center secondary text on the symbol's optical center [R20][R25].
6. **Render, then choose.** Set 4 or 5 proportions side by side at display size and at header size (about 160 to 200 px) and pick by eye; header size exposes a symbol that is too heavy faster than the large view does.
7. **Freeze it.** Ship the lockup as one artwork with the spacing written in units; never re-space or rescale the parts in use [R26].

### The wordmark is artwork: outlining it (on a page, always)
A wordmark set as live text in a web font changes with font loading, fallback metrics, user font settings and the next font update; the mark must not. Outline it.
1. **License.** OFL fonts may be used for logos, and artwork made with them is not under the OFL ("creating any kind of graphic using a font under the OFL does not make the resulting artwork subject to the OFL", OFL FAQ 1.13) [G1][G2]. Commercial fonts: check the EULA's logo clause.
2. **Instance.** For a variable font, instance it at the size the mark lives at: optical size at its display end, weight by eye (Ember & Oak: Newsreader opsz 72, wght 480, between the page's 400 display and 600).
3. **Measure, do not read, the metrics.** Cap and x height come from the H and x of that instance; OS/2 values describe the default instance only (Newsreader: OS/2 1340, measured 1430 at opsz 72) [M3]. Cap height is the clear-space unit.
4. **Space the word.** Tracking for display (about -0.5 to -1 percent of the em, opinion), then pairs by eye on the real word: the spaces around an ampersand are always too wide; round letters beside a space need less.
5. **Best ampersand.** Try the italic ampersand in the roman word ("In heads and titles, use the best available ampersand", Bringhurst 5.1.3) [G3][G4].
6. **One detail, inside the letter.** Keep the chosen letter's own outline and draw the detail inside its counter at the letter's hairline weight, so it reads as type, not as a sticker.
7. **Ship it as one inline SVG** with `fill: currentColor` for the ink and one token for the accent (`--color-logo-ember`), so both themes remap it.

`assets/wordmark.py` does steps 2 to 4 and leaves the detail letter's outline in the JSON (`--slot`).

### Responsive logo tiers
Simplify as space shrinks until "only the essence remains" [R6]:
- Tier 1 (large, 200 px and up): full lockup with any tagline.
- Tier 2 (80 to 200 px): lockup without tagline; detail reduced.
- Tier 3 (32 to 80 px): symbol or monogram alone.
- Tier 4 (16 to 32 px): a specially drawn small version with thicker strokes, fewer parts and opened counters.
Tier boundaries are opinion; the principle is from Harrison's work [R6].
Drop detail one step at each tier (Ember & Oak: two rings at tier 1, one ring at tier 2 and 3, a monoline ring and dot at tier 4). The favicon is tier 4 on its own field when the bare mark fails any tab strip (`assets/tab_contrast.py`; see 06).

## Expert moves (what a generalist misses)
- **Design the smallest version first.** Sketch the 16 px favicon and the 40 px avatar crop before refining the large lockup; it forces the essential idea early. (opinion, consistent with Haviv on tiny sizes [R2])
- **Spend the "awkward" budget on exactly one detail.** One unexpected cut, ligature, angle or negative space shape; everything else stays quiet. Two quirks read as noise. (opinion, building on [R2])
- **Draw the reversed version as its own artwork.** Most kits just invert; top studios thin it [R4].
- **Choose the type before the symbol.** For wordmark-led brands the letterforms carry most of the recognition; start from a typeface with good bones and customize 1 to 3 letters rather than drawing from scratch. Check the font license allows logo use and modification. (opinion; see design-typography for selection)
- **Draw a dark mode version, not just a reversed one.** A full color mark on `--color-bg` in a dark theme often needs its brand color lifted one or two ramp steps to hold presence; specify it as its own artwork. (opinion; see design-color for ramps)
- **Check the avatar circle.** Most platforms crop avatars to circles; the symbol must sit inside the inscribed circle with clear space, optically centered. (opinion)
- **Fix the lockup proportion by eye, after measuring.** Size the symbol to the type metrics, never the text box, and match visual weight rather than height: wide symbols sit well below the usual 1.5 to 2 times cap height. Full rules under Lockup proportion above [R20][R21][M5].
- **Plan for ink spread and thread.** For small print, stamps and embroidery, open the counters and add small notches at tight joins so they do not fill in. (opinion, type design ink trap practice)
- **AI tools are for exploration only.** The US Copyright Office (January 2025) says AI outputs are protectable "only where a human author has determined sufficient expressive elements," and "not the mere provision of prompts." A client must own its mark, so redraw any AI-explored idea by hand and keep the process files. [R19]
- **Own a color, not a palette.** Recognition attaches to one dominant color used at scale (see design-color for ramps and contrast).
- **Write the rationale in one sentence per direction.** Present 2 or 3 directions maximum, each with one sentence of idea, shown in 3 real contexts. Chermayeff and Geismar pick "the best by common agreement, and throw out the seconds" before the client sees anything [R2].
- **Avoid trend effects in the master.** Gradients, glass, 3D can be applied as treatments later; Haviv notes a simple mark can take "fashionable" treatments without losing recognition [R2].

- **Give the favicon its own ground.** A bare brand color is judged against strips you do not control: Ember & Oak orange measures 3.04:1 on white, 2.32:1 on a gray inactive tab, 5.29:1 on a dark one [M4]. A `prefers-color-scheme` rule inside the SVG follows the OS, not a themed browser's strip [G7]. The darkest brand neutral as a rounded field, mark in the lightest neutral, accent kept, fixes it everywhere. (opinion on the choice)
- **Close the page with the mark at full measure.** A full-width outlined wordmark as the footer sign-off costs about 15 KB and gives a type-led page its second loud moment. (opinion)

## Do and don't
| Do | Don't |
|---|---|
| Build the master in one flat color | Start in full color with gradients |
| Test at 16 px early | Discover favicon failure after approval |
| Derive clear space from the mark | Use an arbitrary "20 px" |
| Present in real contexts at real size | Present centered on a gray artboard only |
| Customize 1 to 3 letters of a strong typeface | Set the name in a default font with default spacing |
| Keep one quirk | Add a swoosh, a globe and a gradient |

## Worked examples

### A. Specialty coffee roaster "Northbound"
Brief: new, small, sells online and in one cafe. Touchpoints: bag labels, stamps, Instagram avatar, website.
1. Name is 10 letters: wordmark plus monogram. Avatar and stamp need the monogram.
2. Idea: an "N" whose diagonal is a compass needle tilted slightly past north; that tilt is the one quirk.
3. Wordmark: a sturdy grotesk with tight custom spacing; the "N" in the wordmark gets the same tilted diagonal so the two link.
4. Stress test: monogram at 16 px works because it is a single solid shape; wordmark fails below 80 px wide so the spec sets that minimum.
5. Stamp and screen print need one color; reversed version thinned for kraft paper printed white.
6. Recognition system: monogram, wordmark, one deep green, a ruled-line label layout, documentary photography of origin farms (see 03).

### B. SaaS rebrand where the old logo fails as a favicon
Old mark: wordmark with a thin gradient swoosh. At 16 px it is a smudge.
1. Keep the equity: the swoosh's angle becomes a solid wedge cut into the first letter.
2. Build a Tier 4 favicon: the first letter alone, heavier, wedge cut, on a solid brand color square.
3. Update the app icon as a derivation (see 02), not by shrinking the lockup.

### C. Ember & Oak, rendered (wave 2 test, `kb/tests/design-graphic/`)
Brief: specialty roaster, concept "the hill and the fire" (design-art-direction). Before: the logo was "Ember & Oak" in live Newsreader text.
1. Wordmark: Newsreader opsz 72, wght 480, italic ampersand, tracking -16 units on a 2000-unit em, pairs `r ` -24, ` &` -20, `& ` -8, ` O` -10.
2. Detail: the O keeps its outline; inside it, two eccentric rings at the O's hairline weight (contour lines around a summit, or an oak's growth rings) and an ember dot in brand orange, up and right of centre. Blur test: still one ring with a hot point.
3. Tiers: sign-off full width (two rings); header 24px tall on phones and 28px on desktop (one ring); bag label 32px symbol (one ring); favicon on a warm 950 field (ring 14.9:1, ember 5.3:1); apple-touch 180 on the same field.
4. Stress sheet: `mark-sheet.html` (one color on the brand field, both polarities, 16 and 32px, tabs, avatar circle, blur, clear space).

## Hand-offs
- design-color: owned color, ramps, contrast when brand color is used in UI.
- design-typography: wordmark base typeface and brand type system.
- design-motion: logo animation and sonic or motion signatures.
- design-layout: graphic devices and grid in brand applications.
- website-strategy: positioning, naming and brand strategy come before the mark; do not design a logo without them.
- 02 (icons) for app icon and favicon derivation; 06 (export) for the kit.

## Sources
- [R1] Paul Rand, Logos, Flags, and Escutcheons: https://paulrand.design/writing/articles/1991-logos-flags-and-escutcheons.html
- [R2] Print, interview with Chermayeff, Geismar and Haviv: https://www.printmag.com/branding-identity-design/marks-men-an-interview-with-ivan-chermayeff-tom-geismar-and-sagi-haviv-of-chermayeff-geisma/
- [R3] George Bokhua, Principles of Logo Design (review): https://weandthecolor.com/principles-of-logo-design-by-george-bokhua-teaches-you-to-build-marks-that-last/209937
- [R4] Logo Geek, optical corrections: https://logogeek.uk/?p=2617
- [R5] Overshoot (typography): https://en.wikipedia.org/wiki/Overshoot_(typography)
- [R6] Responsive logos (Joe Harrison): https://mne.today/post/responsive-logos-adapting-brands-for-digital-design/
- [R7] W3C, Understanding 1.4.11 Non-text Contrast: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- [R8] Pentagram, MIT Media Lab: https://www.pentagram.com/work/mit-media-lab/story
- [R10] Bank of Canada corporate identifier: https://design.bankofcanada.ca/design/corporate-identifier/
- [R11] NinjaOne brand, clear space and minimum size: https://ninjaone.com/brand
- [G1][G2] SIL Open Font License FAQ (1.1, 1.13): https://openfontlicense.org/ofl-faq/
- [G3] Bringhurst 5.1.3 as quoted by Dan Cederholm: https://retro.simplebits.com/posts/ampersands-2.html
- [G4] Typefacts, The ampersand: https://typefacts.com/en/articles/the-ampersand
- [G7] MDN, prefers-color-scheme (SVG inherits from the OS or the embedding element): https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-color-scheme
- [M3][M4] Measured, `kb/research/graphic/07-marks-icons-rendered.md`
- [R19] US Copyright Office, Part 2 report announcement (Jan 2025): https://www.copyright.gov/newsnet/2025/1060.html
- [R20] Frappe identity (symbol height as unit X, gap X/4, optical center): https://frappe.io/design/identity
- [R21] Afterpay brand collaborations (equal visual weight): https://afterpay.com/en-US/for-retailers/resources/marketing/brand-tools/brand-collaborations
- [R22] Scale logo guidelines ("e" unit, cap height and baseline alignment): https://brand.scale.com/logo
- [R23] GOV.UK brand hierarchy (dot width sets spacing): https://brand.design-system.service.gov.uk/logo-system/brand-hierarchy
- [R24] Sport Chek co-branding (plus or minus 10 percent for balance): https://brand-qa2.canadiantire.ca/en/sport-chek/design-system/foundations/co-branding-partnerships.html
- [R25] Metafy logo (optical alignment of an uneven symbol): https://brand.metafy.gg/latest/brand/logo-gakad5JR
- [R26] Scrums.com brand (never recombine at another spacing or scale): https://www.scrums.com/company/sorted-ui/brand
- [M5] Measured, `kb/research/graphic/08-lockup-proportion.md`
- Practitioner references (opinion tier, for inspiration and current practice, not specs): LogoArchive by Richard Baird, Brand New by UnderConsideration, Standards.site, David Airey's resource list https://www.davidairey.com/resources
