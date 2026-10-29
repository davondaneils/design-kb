# Research 03: Photography and image direction

Status key: **C** consensus, **X** contested, **O** opinion.

## Key findings

| # | Claim | Source | Status |
|---|---|---|---|
| 1 | Users scrutinize images that carry task-relevant information and ignore decorative "feel-good" images; "jazzed-up = ignored." | NN/g, Photos as Web Content [P1] | C (eyetracking research) |
| 2 | Real people beat stock models: FreshBooks team portraits got about 10% more viewing time than bios that took 316% more space; generic stock was ignored. | NN/g [P1] | C |
| 3 | Product photos matter when they help comparison; unrelated lifestyle scenes in thumbnails are skipped. On an Amazon page studied, 18% of viewing time went to photos vs 82% to text. | NN/g [P1] | C |
| 4 | Enlarged product photos should be at least double the size; a 20% increase is inadequate. | NN/g [P1] | C |
| 5 | Photography is best for real-world proof (customer stories, people, teams, content); illustration for abstract or dry concepts. | Dropbox brand guidelines, imagery [P2] | C (design system) |
| 6 | Text in or over a graphic must meet 1.4.3 (4.5:1, or 3:1 for large text). | W3C 1.4.11 Understanding [P3]; WCAG 2.2 | C |
| 7 | Alt text: informative images get a brief alt conveying meaning; images that repeat nearby text or are decorative get alt=""; functional images describe the action. | W3C WAI alt decision tree [P4] | C |
| 8 | Google: use descriptive file names, useful alt, high quality sharp images, img elements (CSS backgrounds are not indexed); avoid generic logos, images with text and extreme aspect ratios as the preferred page image. | Google Search Central, image SEO [P5] | C |
| 9 | Content Credentials (C2PA) attach provenance to images; Adobe Firefly and others attach them to generated output; regulation (EU AI Act transparency duties from August 2026) is pushing disclosure of AI generated content. | Adobe Experience League [P6]; c2paviewer [P7]; Davies Meyer blog [P8] | C on direction, X on exact legal scope by jurisdiction |
| 10 | Shoot briefs in practice specify objectives, shot list, subjects and casting, location, lighting and style references, and deliverables (Contently [P9], re-checked 2026-10-10: "This should outline what the project aims to achieve"); Contently covers releases, not usage rights, so usage rights rest on Ocus and Penn State Smeal [P10][P11]. | Contently shoot brief guide [P9]; Ocus brand photography guidelines [P10]; Penn State Smeal photography standards [P11] | C |
| 11 | AI image tells fall in five categories: anatomical implausibilities (hands first), stylistic artifacts ("plastic texture", "cinematization", "hyper-real detail"), functional implausibilities (text, merged or floating objects), violations of physics (shadows, reflections, perspective) and sociocultural implausibilities; no single cue is conclusive, and portraits with blurred backgrounds offer the fewest cues. | Kamali et al. 2024 [P12] | C (expert guide with a large human study) |
| 12 | Image models skew toward conventional beauty: Stable Diffusion v1 was trained on the LAION subset with predicted aesthetic score 5+; Midjourney's default applies "automatic beautification" and Raw less; in a 2025 study 74% of generated people were rated young and 86.5% had lighter skin. AI faces are more average, and higher attractiveness pointed to AI in Miller et al. 2023. | LAION [P13]; Midjourney [P14]; Dinkar et al. [P15]; Miller et al. via BPS [P19] | C |
| 13 | A phone snapshot's signature: iPhone 16 main camera 26 mm and ultra wide 13 mm, background blur only from Portrait mode [P16]; 4:3 default frame [P17]; processing that "doesn't like noise", smooths fine detail and lifts shadows [P18]; snapshots are typically "poorly framed or composed, out of focus, and/or inappropriately lighted by flash" [P20]. | Apple [P16]; TechRadar [P17]; Lux [P18]; Wikipedia [P20] | C |
| 14 | 77% of US men are overweight (34.1%) or have obesity (43.0%), NHANES 2017 to 2018: cast an ordinary build, not a fitness model, for a "this is me" audience. | NIDDK [P21] | C on the numbers, O on the casting rule |
| 15 | Client correction (Davon, 2026-10-29, Stand Firm results page): a six-image model test plus four alignment retries for one porch stand-in cost 21.24 credits; "why the hell did you generate so many versions of this image ... youre wasting my credits." Rule: prompt shown and approved before each paid generation, one image per shot. Three minutes later: "dont generate anymore" ... "ever", and "what I want instead, just give me the prompts" ... "or the idea of the image". | Client thread, design-log.md in the Stand Firm results-v1 folder | O (client rule: no generation on his jobs) |

## Numbers
- 10% more attention to real staff portraits vs 316% larger text bios [P1].
- 18% photos vs 82% text viewing on a product listing [P1].
- Enlargement at least 2x [P1].
- Contrast for text over images: 4.5:1 body, 3:1 large (foundation contract, WCAG 2.2).

## Conflicting views
- Stock vs custom: NN/g shows generic stock is ignored, but well chosen, specific stock works for some contexts (budget). (X)
- AI imagery in marketing: efficient for concepts and backgrounds; trust risk for people, products and testimonials. (X, moving fast)

## Practitioner tier (opinion)
- Common art director practice: a single light direction and color grade across a set; casting real customers or staff; 35mm for documentary context, 50 to 85mm for portraits. These are craft conventions, not research.

## Sources
- [P1] https://www.nngroup.com/articles/photos-as-web-content/
- [P2] https://brand.dropbox.com/imagery
- [P3] https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast.html
- [P4] https://www.w3.org/WAI/tutorials/images/decision-tree/
- [P5] https://developers.google.com/search/docs/appearance/google-images
- [P6] https://experienceleague.adobe.com/en/docs/cx-enterprise-ai/experience-cloud-ai/overview/content-transparency
- [P7] https://c2paviewer.com/articles/ai-tools-c2pa-support
- [P8] https://ai-solutions.daviesmeyer.com/en/blog/c2pa-content-credentials-ki-kennzeichnung
- [P9] https://support.contently.com/article/822-how-do-i-make-a-brief-for-a-photo-shoot
- [P10] https://www.ocus.com/resources/brand-photography-guidelines
- [P11] https://brand.smeal.psu.edu/photography
- [P12] https://arxiv.org/pdf/2406.08651 (accessed 2026-10-29)
- [P13] https://laion.ai/blog/laion-aesthetics/ (accessed 2026-10-29)
- [P14] https://docs.midjourney.com/docs/style-1 (accessed 2026-10-29)
- [P15] https://arxiv.org/abs/2511.00749v1 (accessed 2026-10-29)
- [P16] https://apple.com/iphone-16/specs/ (accessed 2026-10-29)
- [P17] https://techradar.com/phones/iphone/how-to-take-different-aspect-ratio-images-on-your-iphone (accessed 2026-10-29)
- [P18] https://lux.camera/introducing-process-zero-for-iphone (accessed 2026-10-29)
- [P19] https://bps.org.uk/research-digest/ai-faces-seem-realer-real (accessed 2026-10-29)
- [P20] https://en.wikipedia.org/wiki/Snapshot_aesthetic (accessed 2026-10-29)
- [P21] https://www.niddk.nih.gov/health-information/health-statistics/overweight-obesity (accessed 2026-10-29)
