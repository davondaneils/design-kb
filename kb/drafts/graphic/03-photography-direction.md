# Photography and image direction

Sources: research/graphic/03-photography-direction.md (P-numbers). Opinion is marked (opinion).

## Principles
1. **Information earns attention; decoration is ignored.** Users scrutinize images with task-relevant content and skip "feel-good" filler [P1].
2. **Real beats generic.** Real staff portraits got about 10% more viewing time than text bios 316% larger; generic stock was ignored [P1].
3. **Photography proves, illustration explains.** Use photos for real-world evidence (people, places, product, results); use illustration for abstract ideas [P2].
4. **A set is one voice.** Consistency of light, grade, crop and casting is what makes photography feel like a brand rather than a collection. (opinion, standard art direction practice)

## Fundamentals gate
- Every image has a job you can state in one sentence (shows the product, shows who you will work with, shows the result). If not, cut it [P1].
- **Alt text** per the W3C decision tree: informative = brief meaning; decorative or redundant = `alt=""`; functional (inside a link or button) = the action or destination [P4].
- **Text over images** meets 4.5:1 (3:1 for large text) at the worst point behind the text, with a scrim if needed [P3].
- **Rights:** model and property releases for recognizable people and places; license covers the use (paid ads, print run, territory, duration).
- **Resolution:** source at least 2x the largest display width (see 06); product enlargements at least 2x the thumbnail [P1].
- **No faces cut** at the eyes or chin by responsive crops; set a focal point.
- **No fabricated people as customers.** Never present stock or AI people as real customers, staff or testimonials.

## The shot brief (art direction spec)
Fill every field; a vague brief returns stock-looking results. Fields match common shoot brief practice [P9][P10][P11]; the defaults are opinion.
| Field | What to specify | Example |
|---|---|---|
| Purpose and placement | Where each image runs and its crop ratios | Hero 16:9 desktop, 4:5 mobile; case study 3:2 |
| Subject and casting | Real customers or staff, age range, diversity, wardrobe palette | Real finance team, wardrobe in neutrals plus one brand accent |
| Moment | The verb, not the pose | "Reviewing a forecast together," not "smiling at laptop" |
| Light | Direction, quality, color temperature | Soft window light from camera left, about 5000 to 5600 K, no flash look |
| Lens and distance | Focal length and how close | 35 mm environmental at 2 to 3 m; 85 mm portraits |
| Angle | Eye level, high, low | Eye level; no dutch angles |
| Depth | Aperture feel | Shallow (f/2 to f/2.8) for portraits, deeper (f/5.6+) for product context |
| Negative space | Where copy will sit | Left third clear in hero frames |
| Grade | Color, contrast, grain | Slightly warm, lifted blacks, low saturation except brand accent |
| Shot list | Each must-have frame with ratio | 12 frames, 3 per ratio |
| Deliverables | Format, resolution, retouch level | Full-res TIFF masters, retouch skin lightly, no body reshaping |

## Decision rules
- **Custom vs stock vs AI.** Custom for people, product and place that represent the brand. Stock only for context shots without identifiable "our customer" claims, and only after grading to the house look. AI imagery for concepts, moodboards, abstract backgrounds and comps; not for real people, real products, real places presented as real, or testimonials. (opinion; trust and provenance reasons [P6][P7])
- **Selecting from stock.** Reject on sight: handshakes, pointing at screens, headset call center smiles, models looking into camera with no context, perfect desks. Prefer: specific action, real environment, imperfect light. (opinion)
- **Hero image.** Use one only if it shows the product, the outcome or the people; otherwise use a product UI shot or a strong typographic hero (see design-layout). [P1]
- **Crops.** Choose crops per breakpoint as art direction (different crops via picture sources), not a single CSS cover crop; mark a focal point. (see design-frontend)
- **Text on photos.** Place copy in planned negative space. If contrast fails anywhere, add a gradient scrim behind the text from about 60 percent opacity of black or `--color-bg` to 0, sized to the text block; verify the worst pixel. (opinion on values; requirement from [P3])
- **Making a mixed set consistent.** Same grade (one LUT or preset), same crop ratios, same subject-to-frame scale, same light direction where possible, same color cast of neutrals. A duotone or monochrome treatment is the fastest way to unify unmatched sources. (opinion)

## AI generated imagery
- Disclose and preserve provenance: keep Content Credentials (C2PA) where tools attach them; regulators are moving toward mandatory labeling (EU AI Act transparency duties apply from August 2026) [P6][P8].
- Inspect every AI image at 100 percent for hands, teeth, text, logos, reflections, product details and physics.
- Check the tool's terms for commercial use and indemnity.
- Keep the house grade: run AI images through the same preset as photos.

## Expert moves
- **Brief the moment as a verb.** It is the single biggest difference between a stock-looking and a documentary-looking shoot. (opinion)
- **Design the layout before the shoot** and shoot to it: know where the headline sits so the photographer leaves that space. (opinion)
- **Shoot every hero in three ratios** (16:9, 4:5, 1:1) at the same moment; social and responsive layouts need them. (opinion)
- **Cast real people and show them working**: NN/g's FreshBooks result shows real people out-earn text [P1].
- **Grade toward the brand color without tinting skin.** Push brand color into shadows or environment, protect skin tones. (opinion)
- **Use the image as information:** product photos that support comparison (same angle, same background, same scale) get scrutinized; lifestyle thumbnails get skipped [P1].

## Do and don't
| Do | Don't |
|---|---|
| Real team on real work | Stock models at a whiteboard |
| One grade across a set | Mix warm, cold and HDR looks |
| Art-directed crops per breakpoint | One crop that cuts heads on mobile |
| Scrim tested at the worst pixel | White text on a busy sky |
| alt describes meaning in context | alt="image of people" |

## Worked example: fintech landing page imagery
Brief: calm, trustworthy B2B forecasting tool for finance teams.
1. Job of each image: hero shows the product in use by a real finance team (proof); a customer story shows the CFO of a real customer (proof); feature sections use product UI, not photos (information).
2. Shot brief: real customer team, moment "walking the board through next quarter," soft window light camera left, 35 mm at eye level, left third clear for headline, grade slightly cool neutrals with warm skin, brand teal only in environment.
3. Ratios: 16:9 desktop hero, 4:5 mobile hero, 1:1 for social.
4. Text over hero: headline sits in clear left third on a wall at about 85 percent luminance; dark text passes 4.5:1 without a scrim.
5. Alt: "Finance team at Acme reviewing a quarterly forecast on a large screen."

## Hand-offs
- design-frontend: responsive image markup, focal points, lazy loading.
- design-layout: hero composition, text and image placement.
- design-color: grading toward brand palette, scrim colors.
- design-copy and copywriting: captions and alt text voice.
- 05 for social crops; 06 for formats.
