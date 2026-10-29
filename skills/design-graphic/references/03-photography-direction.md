# Photography and image direction

Sources: research/graphic/03-photography-direction.md (P-numbers). Opinion is marked (opinion).

**Scope.** This file holds the professional shot brief, stock selection and the AI imagery rules. Everything about using photos on a page lives in design-art-direction: accept or reject, crops per breakpoint, grading and duotone, sequencing a set (`references/02-photography.md`), text over images and the worst-pixel check (`03-composition-and-overlays.md`), and the phone-friendly photo request with slot code (`05-requesting-photography.md`).

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
- **Hero image, crops, text on photos, unifying a mixed set:** design-art-direction 02 and 03.

## AI generated imagery
- Disclose and preserve provenance: keep Content Credentials (C2PA) where tools attach them; regulators are moving toward mandatory labeling (EU AI Act transparency duties apply from August 2026) [P6][P8].
- Inspect every AI image at 100 percent for hands, teeth, text, logos, reflections, product details and physics.
- Check the tool's terms for commercial use and indemnity.
- Keep the house grade: run AI images through the same preset as photos.
- **No AI image generation on Davon's jobs.** After ten versions of one porch shot (a six-image model test plus four retries for a fade he then dropped, 21.24 credits) he said "dont generate anymore" and "ever" (2026-10-29; research 03, row 15). Give him the idea of the image or a prompt he can run himself; only his own words lift the rule. For any other client, paid generations need a yes first: show the prompt before every paid run, one image per shot unless they ask for options, no model comparisons on their credits.
- **Fakes give themselves away in five places:** anatomy (look at hands first), style (plastic skin, an overly cinematic look, hyper-real detail), things that don't work (garbled text, merged or floating parts), physics (shadows and reflections that disagree) and context [P12]. Check all five before an AI image ships.
- **Models lean pretty, so cast against it.** Stable Diffusion v1 was trained on LAION's 5+ aesthetic-score subset [P13], Midjourney's default style applies "automatic beautification" [P14], and in one study 74% of generated people were rated young [P15]. Name the age, build and real flaws in the prompt.
- **For a snapshot, prompt the phone, not the photoshoot:** main camera at 1x (26 mm on iPhone 16 [P16]), the default 4:3 frame [P17], most of the scene in focus, the phone's flat bright processing [P18], framed a little badly. Leave out cinematic, 8K, bokeh and golden hour. (opinion on the word list)

## Expert moves
- **Brief the moment as a verb.** It is the single biggest difference between a stock-looking and a documentary-looking shoot. (opinion)
- **Design the layout before the shoot** and shoot to it: know where the headline sits so the photographer leaves that space. (opinion)
- **Shoot tethered with the layout as an overlay** (most tethering software can show a transparent overlay), so headline space and crops are checked on set, not in post. (opinion)
- **Shoot every hero in three ratios** (16:9, 4:5, 1:1) at the same moment; social and responsive layouts need them. (opinion)
- **Cast real people and show them working**: NN/g's FreshBooks result shows real people out-earn text [P1].
- **Use the image as information:** product photos that support comparison (same angle, same background, same scale) get scrutinized; lifestyle thumbnails get skipped [P1]. Grading and treatment: design-art-direction 02.

## Do and don't
| Do | Don't |
|---|---|
| Real team on real work | Stock models at a whiteboard |
| One grade across a set | Mix warm, cold and HDR looks |
| alt describes meaning in context | alt="image of people" |

## Worked example: fintech landing page imagery
Brief: calm, trustworthy B2B forecasting tool for finance teams.
1. Job of each image: hero shows the product in use by a real finance team (proof); a customer story shows the CFO of a real customer (proof); feature sections use product UI, not photos (information).
2. Shot brief: real customer team, moment "walking the board through next quarter," soft window light camera left, 35 mm at eye level, left third clear for headline, grade slightly cool neutrals with warm skin, brand teal only in environment.
3. Ratios: 16:9 desktop hero, 4:5 mobile hero, 1:1 for social.
4. Text over hero: headline in the clear left third; check the worst pixel per design-art-direction 03.
5. Alt: "Finance team at Acme reviewing a quarterly forecast on a large screen."

## Hand-offs
- design-art-direction: page concept, picking, cropping, treating and sequencing photos, text over images, the photo request.
- design-frontend: responsive image markup, lazy loading.
- design-copy and copywriting: captions and alt text voice.
- 05 for social crops; 06 for formats.

## Sources
- [P1] NN/g, Photos as Web Content: https://www.nngroup.com/articles/photos-as-web-content/
- [P2] Dropbox brand imagery: https://brand.dropbox.com/imagery
- [P3] W3C, Understanding 1.4.11: https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- [P4] W3C WAI, alt decision tree: https://www.w3.org/WAI/tutorials/images/decision-tree/
- [P6] Adobe, generative AI content transparency: https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/overview/content-transparency
- [P7] C2PA support in AI tools: https://c2paviewer.com/articles/ai-tools-c2pa-support
- [P8] AI labeling in 2026 (EU AI Act): https://ai-solutions.daviesmeyer.com/en/blog/c2pa-content-credentials-ki-kennzeichnung
- [P9] Contently, photo shoot brief: https://support.contently.com/article/822-how-do-i-make-a-brief-for-a-photo-shoot
- [P10] Ocus, brand photography guidelines: https://www.ocus.com/resources/brand-photography-guidelines
- [P11] Penn State Smeal photography standards: https://brand.smeal.psu.edu/photography
- [P12] Kamali et al., How to Distinguish AI-Generated Images from Authentic Photographs (2024): https://arxiv.org/pdf/2406.08651
- [P13] LAION-Aesthetics: https://laion.ai/blog/laion-aesthetics/
- [P14] Midjourney, Style Raw: https://docs.midjourney.com/docs/style-1
- [P15] Dinkar et al., Erasing 'Ugly' from the Internet (2025): https://arxiv.org/abs/2511.00749v1
- [P16] Apple, iPhone 16 technical specifications: https://apple.com/iphone-16/specs/
- [P17] TechRadar, iPhone aspect ratios: https://techradar.com/phones/iphone/how-to-take-different-aspect-ratio-images-on-your-iphone
- [P18] Lux (Halide), Process Zero: https://lux.camera/introducing-process-zero-for-iphone
