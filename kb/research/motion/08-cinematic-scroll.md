# 08 Cinematic scroll pages: what the scroll-driven template libraries teach

Research for design-motion `references/08-cinematic-scroll.md` and design-playbook-landing `references/build-spec.md`. Requested by Davon on 2026-10-23 ("pull as much as possible for our general web design skill, then pull principles, strategies and tactics out of it").

## Sources and how far to trust them
| Source | What it is | What was read | Tier |
|---|---|---|---|
| **Scrolltide** (S1), https://www.scrolltide.co | Paid library of build prompts for scroll-driven sites: 128 templates (6 free), 66 components, 20 sections, 55 shaders, 14 UI screens, an eBook ("Prompt to Motion", 374 pages) | Every catalogue page and description; the "Why Scrolltide" page with its `build-prompt.md` excerpt; the eBook landing page and its 12 public sample spreads; preview recordings of tarn, Valmora, Ora, House and Selene (frames extracted); homepage computed styles at 1440 x 900 | 5 for claims; the preview recordings are inspectable builds (treat as tier 4 practitioner work). Prompts themselves are behind login and were not read. |
| **Motion sections** (S2), https://motionin.design | Library of "copy the prompt" interactive sections (Portfolio, Hero, Interactive, Product Showcase, Immersive), free and paid | Home page catalogue, which prints each section's full mechanism description | 5 |
| **easings.net** (S3), https://easings.net | The Penner easing curves with CSS `cubic-bezier` values | All 24 CSS values on the page | 4 (reference values; the curves themselves are standard) |
| **X post** (S4), https://x.com/BardhylBytyqi/status/2113012232015450311 (read via the fxtwitter API) | A list of 12 resource sites; the author builds the first one | The post text; each site's home page | 5, lead only |

Everything below marked **(S1)** etc. is what the source does or says. Lines marked **opinion** are ours. Accessed 2026-10-23.

## A. Principles (why it works)

1. **Name a mechanism, not an appearance.** Scrolltide's core argument: an adjective handed to a model ("make it feel premium") decodes toward the average of everything it has read; a measurement, a hex value or a physical model gets copied. Their example: not "make it feel premium" but "letter-spacing: -0.03em" (S1, eBook page "The mechanism, not the prompt"). This matches our house rule "decision rules and real numbers over essays" and design-copy's "a voice is a set of decision rules, not adjectives".
2. **The gap is description, not capability.** Their "Why" page replays a 20-edit chat ("make the hero taller", "no, more premium than that", "why is everything purple", "actually, start again") and concludes the model did nothing wrong: it cannot see the site in your head, and a sentence is not a picture (S1, why-scrolltide). Opinion: the same is true when Claude writes for itself. Decide the values before the first line of code.
3. **Constraints live in a file, not the chat.** Instructions given in chat stop being shown to the model once the conversation is long; "a model does not forget your instructions and ignore them. It stops being shown them", and the page drifts back toward the average one edit at a time (S1, eBook p61). A file re-read every turn is diffable and doubles as the client's scope document (S1, p61).
4. **Negatives beat adjectives.** "Do not add: card strokes, card fills, section dividers, gradient fills on surfaces, overlays on video" leaves nothing to interpret (S1, p25). Their standing "never-list": no gradient text, glass cards, floating 3D blobs or purple-to-blue (S1, eBook landing page).
5. **Taste is the job that is left.** "AI collapses the cost of production, which means the only thing left to compete on is judgement: what to reference, what to remove, when a scene is worth its weight" (S1, eBook landing page, paraphrased).
6. **One change between two frames.** A cinematic transition is two stills where frame B is frame A with one thing changed; give a generator three changes and it solves the puzzle by dissolving, which looks like a cheap dissolve (S1, p121). The four safe single changes: the camera moves closer, the light changes, the object rotates (20 degrees at most, or it invents a side it never saw), something opens (S1, p121).
7. **Scroll poses, it does not perform.** In the best templates scroll is a playhead: it scrubs a film, an orbit or a frame sequence; the page never plays something at its own pace while the reader scrolls (S1: Ora, Rann Mahal, Carrara, Apogee, Knoll, Threshold). This is our "scroll is the clock" rule (design-motion expert move 10) at page scale.

## B. Strategies (how a whole page is planned)

1. **The seven-stage loop and the decision each stage makes** (S1, eBook "The loop"): Reference (what this will feel like) > Brief (ground, accent, type and sections, as values) > Assets (where the empty third goes) > Build (what to withhold from the first prompt) > Motion (**which three moments move**) > 3D (**whether the scene should exist at all**) > Ship (what a stranger on a slow phone gets). Opinion: the bolded two are the most useful for us; they cap motion at three moments a page and make 3D justify itself.
2. **Decide sixteen things before building** (S1, why-scrolltide "Decided before you paste"): grid and measure, type scale, tracking at display size, colour ratios, section order, easing curve, stagger timing, scroll triggers, hover behaviour, depth and grain, breakpoints, focus states, reduced-motion fallbacks, image loading, copy tone, what not to do.
3. **A build spec in six blocks, all values** (S1, why-scrolltide `build-prompt.md` excerpt, about 12,000 characters per template). Shape of the excerpt:
   - ART DIRECTION: ground `#0A0A0B`; one accent on no more than 4 elements per viewport; no gradient text, no purple, no glass panels; grain 3.5% opacity, blend overlay.
   - TYPOGRAPHY: display grotesk 600, tracking -0.04em; H1 `clamp(2.6rem, 7vw, 5.2rem)` leading 0.94; body 16.5px leading 1.7, measure capped at 62ch; never centre a paragraph longer than two lines.
   - MOTION: one easing curve site-wide, `cubic-bezier(0.22, 1, 0.36, 1)`; entry y 16px to 0 over 750ms, stagger 60ms; hero parallax on scroll progress, not a timer; transform only; everything behind `prefers-reduced-motion`.
   - Per section: hero is full viewport, eyebrow pill, H1 on three lines, one supporting line at 60% opacity, one primary action; "headline animates transform only, never opacity: an opacity of 0 in the initial state ships the LCP element invisible."
   - Marquee: two rows counter-running at 32s and 38s linear; duplicate children once and translate -50% for a seamless loop; mask both edges with a 12% gradient.
   - Gallery: 24px radius on a 1px hairline, no drop shadow; preview video `preload="none"`, started by an IntersectionObserver at 200px rootMargin, paused off screen; hover translateY(-4px) over 500ms, nothing scales.
   - Accessibility: visible 2px-offset focus ring on every control; contrast 4.5:1 body, 3:1 display.
4. **The project constraints block** (S1, p25): ground and one accent as hex; named state colours (positive, caution, error) so the model never invents a utility green; display tracking as a number and tracking above 0 only on uppercase labels under 12px; a closed spacing scale (8 / 16 / 24 / 40 / 64 / 96, "nothing between"); separate sections with space, never a border or divider; "do not change the colour scheme unless I ask".
5. **Plate and layout are separate assets** (S1, p97). From one comp make two outputs: the plate (every word, button, icon and logo removed and the background rebuilt, same crop, ground as hex; this ships) and the layout (all text and UI kept at exact position, size and weight on pure `#000000`; this is only measured). Tactics inside it: "rebuild what was behind them" or you get a grey smear where the headline was; "do not zoom" because removal makes models re-frame (a plate 4% tighter no longer lines up); flat black, not transparency; "do not re-typeset" or the model fixes a widow and moves what you measured; attach the original file, not a screenshot of it.
6. **Prompt an image like a photographer, in a fixed slot order** (S1, p85): subject, lens (85mm at f/2.0 for real depth instead of a cut-out), light (one hard rim, "no fill", which is what creates drama), material, background as the page's ground hex (so the plate composites with no halo), composition (subject lower right, the left 45% "empty and unlit" for the headline, because a bright empty third still eats white type), then negatives (no text, no logos, no watermark). Iterate in the order composition, light direction, material, colour last.
7. **The toolkit is roles, not brands** (S1, p6): something that makes a still, something that animates it with start and end frames, something that writes code you can read. Only one page carries version numbers. Opinion: the same split keeps our skills current: mechanisms in the chapter, tool names in one dated place.
8. **Every finished build keeps its failures.** Their case studies count "turns, not hours" and record "what the model got right" beside "what a person had to decide" (S1, p296). Opinion: our self-critique loop should log the same two columns.

## C. Tactics, grouped (the non-obvious moves)

### Film and frame sequences
1. **Scrub decoded frames on a canvas, not a seeked video.** 240 WebP frames decoded ahead and drawn to a canvas, scroll-scrubbed at full quality, instead of seeking a compressed video (S1: Ora, Knoll, Rann Mahal, AeroForce). Ora shows a real-progress preloader for the frames and uses no animation library (S1).
2. **Play once, freeze on the last frame.** Toucan, Eagle, Parrot, Solis: the clip plays once and holds its own final frame "so the join never shows"; Solis "settles into its own final frame rather than looping, so the product ends up perfectly still" (S1). Macaw adds a pixel-exact cut-out on top of the held frame (S1).
3. **Hand over at a shared seam frame.** Marlin's two clips share a seam frame so the ride never cuts (S1). The loop version: match the end frame to the start frame and re-encode, or it cuts on the seam every loop (S1, eBook "what breaks").
4. **Boomerang instead of a cut.** Stillbloom's loop reverses rather than restarting (S1).
5. **A button plays, scroll scrubs.** Poste: pressing the button plays the door's own clip fully "rather than being scrubbed, which is why it lands instead of bouncing" (S1). Opinion: user-triggered state changes play to the end; continuous input scrubs.
6. **Damp the playhead.** Threshold: page progress drives the video playhead through a damped loop, and the copy stays hidden until you are most of the way through the doorway (S1).
7. **Speed-limit idle loops to their drawn cadence.** Marmalade's blink is speed-limited so it plays at the rate it was drawn; Amble and Scowlby idle into their own slow sweep after 9 seconds without input (S1).

### Copy over moving pictures
8. **Text changes sides so the subject is never covered.** Rann Mahal: five chapters of copy fade through a 240-frame film, switching sides each time (S1).
9. **Callouts pin to points in the source frame**, so they stay on the subject at any crop (S1, Katana).
10. **No scrim when the footage allows it.** Auralis puts "no scrim over its own footage"; Arbor's veil lifts "so nothing about the light is dimmed" (S1). Opinion: this only passes our gate when the plate was made with an unlit empty third (B6); otherwise use design-art-direction 03's overlay check.
11. **Emphasis by colour on the working words.** Fluxora breaks to italic serif "on the word doing the work"; Cinnabar switches to red on those words; Keelway's headline "falls into blue on the lines that matter"; Cypress opens in grey and lands in white; Meridian drops the second line to half presence (S1). Opinion: one of these per page, not several.
12. **A stat column can end on a deliberate zero** (S1, Stillbloom). Opinion: "0 hidden fees" closes a proof column harder than a fourth big number.

### Stage and chapters
13. **Pin one object; let the page travel past it.** Vesper holds a bottle dead centre while the page moves; scroll poses the model rather than moving it, and at the allocation row it shrinks and docks into a DOM slot (S1). Valmora and Ora run chapters beside one object with a counter ("02 / 04") and a progress rail (preview recordings).
14. **Fragments pass in front only after they clear the outline** (S1, Plinth), so the hero object is never crossed by debris.
15. **One straight line, one perspective divide.** A depth hang of a dozen prints on one line from the camera, with a single perspective divide, so near prints lean and far ones lie flat and "the depth order can never go wrong" (S2, perspective hang).
16. **Snap the carousel to a slot after any scroll**, so it never rests mid-angle (S2, curved video wall); on a true cylinder the gaps stay even (S2).
17. **A card expands from its exact rectangle** to fill the screen and shrinks back to its exact place (FLIP), on easeInOutCubic (S2, Aperture wall and mountain slider).
18. **Lay a caption out once at its final width**, so text never rewraps mid-reveal (S1, Expanded Cards). Measure every box so a focus frame fits any font at any size (S1, Focus Reveal).

### Interaction physics
19. **A comfortable focal void**: it holds still while the cursor rests inside and only follows when you wander out, on a smooth lerp (S2, gravity wall).
20. **Emit by distance, not time**, so a slow drift leaves a sparse trail and a fast one a dense trail (S2, manifesto trail; S1, Image Trail: "evenly spaced however fast you move").
21. **Velocity drives the bend, smoothed back to flat** (S2, Aperture wall; S1, Scroll 3D Slider). Opinion: under reduced motion the wall stays flat.
22. **One requestAnimationFrame loop owns the scene**; a library owns only the text (S2, Iris: rAF owns the aperture, GSAP the title).
23. **Swap under cover of black**: an iris closes to black, the photo swaps unseen, the iris opens, the title lands a beat later; under reduced motion a slow crossfade that never flashes to black (S2, Iris).
24. **Every size in container units** so a composition scales with its frame (S1, Lodestar).
25. **All copy in one typed data file** the sections map over (S1, Verge). Opinion: the same file feeds our claims inventory.

### Sections and footers
26. Scrolltide's 20 section prompts split into Features (bento, render grid, metrics), Pricing (tier cards), Contact (forms, a form-less contact column), CTA and Footer (S1). Footers are the largest group: a giant wordmark bleeding off the bottom edge, a footer set inside an illustration, a CTA and footer in one over a photograph (S1). footer.design sorts footers by Typographic, Small Type, Illustrative, Grid, Flat, Animated, Cards, Bright, Dark, Large Type, Bold (S4 site).
27. **Contact without a form** (S1, Contact Column): a two-word headline and a column of mail, phone, address and social links. Opinion: the right default for a studio whose buyers prefer email.
28. **A form that is the page, not an afterthought** (S1, Route Booking) for booking-led businesses.

### Shaders and grounds
29. **Background motion that weighs nothing.** Each Scrolltide shader ships three ways: an MP4 at the size you need, a still for the OG image, and a one-file React component that pauses itself off screen (S1). Several are named for being quiet enough for text ("Mint Haze: the quietest thing on the shelf, made for text to sit on"; "Arctic Mesh: built for dark text"; "Plum Mesh: dark enough to carry white type") (S1).
30. **Dither instead of banding.** Their gradient and aurora shaders carry the colour "by the dither", so they read as print rather than as a gradient (S1, Noir Mesh, Cobalt Flow).
31. **Tell three looks apart before building** (S1, eBook p273): reflection needs an environment map and has no hue; diffraction is the whole spectrum repeating in bands from regular grooves and needs only a 2D shader; thin film is one sweep through hue, never repeating. Getting it wrong ships hundreds of kilobytes of 3D for a 2D effect that still looks wrong.

### Measured on the Scrolltide homepage (1440 x 900, computed styles)
32. Two curves run the whole page: `cubic-bezier(0.22, 1, 0.36, 1)` (easeOutQuint on easings.net) on 249 elements and `cubic-bezier(0.4, 0, 0.2, 1)` on 238. Durations 150, 300, 350, 500 and 700ms (S1, measured).
33. Type: one display face (Bricolage Grotesque 800) at 112, 88, 72, 60, 48 and 36px with tracking about -0.025em; body Inter 14 to 16px; one mono label (Space Mono 14px, uppercase, +0.1em) (S1, measured).
34. Each catalogue section has the same shape: a label that carries a number ("128 templates in the library"), H2 left, one short paragraph top right, one grid of identical cards (S1, screenshots).

## D. Easing values (easings.net, S3)
| Name | CSS | Use here |
|---|---|---|
| easeOutQuint | `cubic-bezier(0.22, 1, 0.36, 1)` | Candidate for marketing reveals: 97% settled at half time (our `--ease-enter` is 89%), so a screen goes still sooner |
| easeOutExpo | `cubic-bezier(0.16, 1, 0.3, 1)` | Very front-loaded; close to `--ease-enter` |
| easeOutCubic | `cubic-bezier(0.33, 1, 0.68, 1)` | Softer arrival |
| easeInOutCubic | `cubic-bezier(0.65, 0, 0.35, 1)` | FLIP expand and collapse of a card into the viewport (S2) |
| easeInOutQuart | `cubic-bezier(0.76, 0, 0.24, 1)` | Long on-screen moves |
| easeInQuint | `cubic-bezier(0.64, 0, 0.78, 0)` | Leaving for good; close to `--ease-exit` |
| easeOutBack, easeInOutBack, Elastic, Bounce | `cubic-bezier(0.34, 1.56, 0.64, 1)` and others | Overshoot. Rare brand moments only, never opacity or colour (design-motion expert move 3) |

The half-time figures are computed from the curves (x = 0.5). Adopting easeOutQuint as a token is a change to FOUNDATIONS, so it is proposed, not applied (see `kb/status/motion.md`).

## E. The 12 sites from the X post (S4)
| Site | What it is (checked 2026-10-23) | Keep? |
|---|---|---|
| recent.design (godly.website now redirects here with `?ref=godly`) | Design inspiration feed: web, interface, branding, motion, posters, launch videos, OG images, app icons | Keep; update our Godly entry |
| landdding.com | Daily landing page gallery, 2.5k designs, 40 categories (including Real Estate, Architecture, Furniture and Interiors) | Keep, as a Land-book complement |
| footer.design | The only footer-only gallery; filters by footer type | Keep |
| 60fps.design | 2,110 animation shots from 494 shipped apps; has an MCP | Keep (motion) |
| motionin.design | Prompt library of interactive sections; descriptions are full mechanism specs | Keep (motion) |
| iconly.design | 2,400+ real app, game and web app icons by category and colour | Keep (graphic: app icon research) |
| fontinlogo.com | Identifies fonts in famous logos, with free alternatives | Keep, with care (typography: identification only; many matches are "free alternatives", not the real face) |
| scrolltide.co | Covered above | Keep |
| modulify.ai | AI website builder, the post author's own product | Drop: a builder, not a reference |
| wonderlist.design | 127 Figma website templates, $329 to $999, countdown discount banner | Drop: templates for purchase, not shipped work |
| backgrounds.supply | 1,273 handcrafted and AI backgrounds, $49 | Drop: decorative backgrounds conflict with "never a gradient blob" (signature move 1) |
| on.design | Invite-only design community, login wall | Drop: not inspectable |

## F. What not to take (opinion, with the rule it breaks)
- Countdown banners and mid-scroll upsell pop-ups (both on Scrolltide's own homepage; a countdown on Wonderlist): fake urgency, against design-copy and design-motion ("no shaking or pulsing urgency").
- Count-up numbers (Valmora's tachometer, Cold Club's cooling curve): our rule is that numbers stay still on arrival (design-motion rule 10).
- Smooth-scroll libraries (Lenis is in Scrolltide's listed stack): take scroll from the reader (design-motion 03, never scroll-jack). Pinned stages driven by native scroll are fine.
- Cursor toys as the hero's point (googly-eye buttons, pointer-grown grass, burn-through reveals): a novelty that does not say what the product is. Fine as a second-screen delight on a studio portfolio.
