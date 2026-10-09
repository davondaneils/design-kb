# Logo and identity

Sources: research/graphic/01-logo-identity.md (R-numbers below). Opinion is marked (opinion).

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

### Responsive logo tiers
Simplify as space shrinks until "only the essence remains" [R6]:
- Tier 1 (large, 200 px and up): full lockup with any tagline.
- Tier 2 (80 to 200 px): lockup without tagline; detail reduced.
- Tier 3 (32 to 80 px): symbol or monogram alone.
- Tier 4 (16 to 32 px): a specially drawn small version with thicker strokes, fewer parts and opened counters.
Tier boundaries are opinion; the principle is from Harrison's work [R6].

## Expert moves (what a generalist misses)
- **Design the smallest version first.** Sketch the 16 px favicon and the 40 px avatar crop before refining the large lockup; it forces the essential idea early. (opinion, consistent with Haviv on tiny sizes [R2])
- **Spend the "awkward" budget on exactly one detail.** One unexpected cut, ligature, angle or negative space shape; everything else stays quiet. Two quirks read as noise. (opinion, building on [R2])
- **Draw the reversed version as its own artwork.** Most kits just invert; top studios thin it [R4].
- **Choose the type before the symbol.** For wordmark-led brands, 70 percent of recognition comes from the wordmark's letterforms; start from a typeface with good bones and customize 1 to 3 letters rather than drawing from scratch. (opinion; see design-typography for selection)
- **Own a color, not a palette.** Recognition attaches to one dominant color used at scale (see design-color for ramps and contrast).
- **Write the rationale in one sentence per direction.** Present 2 or 3 directions maximum, each with one sentence of idea, shown in 3 real contexts. Chermayeff and Geismar pick "the best by common agreement, and throw out the seconds" before the client sees anything [R2].
- **Avoid trend effects in the master.** Gradients, glass, 3D can be applied as treatments later; Haviv notes a simple mark can take "fashionable" treatments without losing recognition [R2].

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

## Hand-offs
- design-color: owned color, ramps, contrast when brand color is used in UI.
- design-typography: wordmark base typeface and brand type system.
- design-motion: logo animation and sonic or motion signatures.
- design-layout: graphic devices and grid in brand applications.
- website-strategy: positioning, naming and brand strategy come before the mark; do not design a logo without them.
- 02 (icons) for app icon and favicon derivation; 06 (export) for the kit.
