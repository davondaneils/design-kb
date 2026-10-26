# 08 Cinematic scroll pages

Pages where scroll drives a film, a pinned object or a sequence of chapters: product reveals, launches, studios, hospitality, luxury goods. Research and sources: `kb/research/motion/08-cinematic-scroll.md` (Scrolltide's 128 templates and eBook samples, motionin.design, easings.net; accessed 2026-10-23). Those sources are tier 5 practitioner libraries; their recordings are inspectable builds, and every value below that is not from FOUNDATIONS is marked opinion or credited.

## 1. Fundamentals (non-negotiable, check first)
Everything in design-motion section 1 still applies. On a cinematic page these are the ones that fail:
1. **The scene must earn its place.** Before building one, answer "should this scene exist at all?" (Scrolltide's stage 6 question). It exists only when the motion shows something a still cannot: how a thing opens, how it is built, what it looks like from the other side, how a space feels to walk through. Atmosphere alone is a still.
2. **Three moments move, no more.** Name the three scroll moments that move before building; the rest of the page is still (Scrolltide's stage 5 decision, "which three moments move"). Opinion: a renovator, clinic or law firm page usually needs one.
3. **The first paint is visible.** The hero headline never starts at opacity 0 (it hides the LCP element); if it moves, it moves by transform only (Scrolltide build spec; web.dev LCP). A frame sequence shows its first frame as a real `<img>` poster before the canvas takes over.
4. **Scroll stays native.** Scroll is the playhead, never a hijacked wheel (03, "never scroll-jack"). Pinned stages use `position: sticky` and native scroll; no smooth-scroll library.
5. **Reduced motion gets the story, not the film.** Each chapter shows its key still with its copy; the pinned stage becomes a stacked series of stills; crossfades replace travel; nothing flashes to black (03; motionin "Iris" reduce path).
6. **The phone gets a plan.** 3D and frame sequences have a budget and a fallback for a stranger on a slow phone (Scrolltide stage 7). Opinion: hero plate and first frames under 2 MB total (Scrolltide chapter 12, "the two-megabyte hero"), frames lazy-decoded past the first chapter.
7. **Text over motion passes contrast on the worst frame**, not the poster (design-art-direction `references/03-composition-and-overlays.md`).

## 2. Decision rules

**Pick the mechanism**
| You want | Mechanism | Why |
|---|---|---|
| A continuous camera move or an object taken apart, scrubbed both ways | Decoded image sequence (WebP frames) drawn to a canvas, indexed by scroll progress | Full quality at every position; seeking a compressed video stutters and blurs on keyframes (Scrolltide: Ora, Knoll, Rann Mahal) |
| A short hero moment that ends still | Video that plays once and **holds its own final frame** | The join never shows and the product ends perfectly still (Scrolltide: Toucan, Eagle, Solis) |
| A loop that runs behind content | Seamless loop: last frame matches the first, re-encoded; or a boomerang that reverses | A mismatched loop cuts on the seam every cycle (Scrolltide eBook, "what breaks"; Stillbloom) |
| Two clips in sequence | Hand over at a shared seam frame | The ride never cuts (Scrolltide: Marlin) |
| A state the person triggers (open, reveal, confirm) | Play the clip to its end; do not scrub it | It lands instead of bouncing (Scrolltide: Poste) |
| Chapters about one object | Pinned stage: the object stays, the copy changes, with a chapter counter and a progress rail | One idea per screen, the picture never shares the screen with a second idea (Valmora, Ora recordings) |
| A soft ground behind text | A still, or a GPU shader loop that pauses off screen, with dithering instead of banding | Weighs less than a video of the same thing (Scrolltide shaders) |

**Make the frames** (when generating stills or clips)
- **Plate and layout are two assets.** From one comp, the plate keeps the composition with every word, button and logo removed and the background rebuilt (it ships); the layout keeps all text and UI at exact position on flat `#000000` (it is only measured). Ask the model to rebuild what was behind removed items, not to zoom, not to re-typeset, and attach the original file, not a screenshot (Scrolltide eBook p97).
- **Prompt in photographer's slots**: subject, lens (85mm f/2.0 for real depth), light (one hard rim, "no fill"), material, background as the page's ground hex, composition (subject to one side, the headline side "empty and unlit"), then negatives (no text, no logos, no watermark). Iterate composition, then light, then material, colour last (Scrolltide eBook p85).
- **One change between frame A and frame B**: camera closer, light changes, object rotates 20 degrees at most, or something opens. Three changes and the generator dissolves between them (Scrolltide eBook p121).

**Easing on a cinematic page**
- Scrubbed by scroll: `linear` mapping from progress to frame or pose (expert move 10). Smooth the input, not the curve: a damped follow toward the scroll target (Scrolltide: Threshold) is fine; an ease on top fights the reader.
- Played reveals on a marketing page: `--ease-reveal` (easeOutQuint `cubic-bezier(0.22, 1, 0.36, 1)`, FOUNDATIONS v0.4.5), which is 97% settled at half time against 89% for `--ease-enter`, so the screen goes still sooner. Triggered states and UI keep the other tokens.
- A card that grows from its rectangle to the viewport and back (FLIP): `--ease-standard`, or easeInOutCubic `cubic-bezier(0.65, 0, 0.35, 1)` as the motionin sections use (opinion).
- Never Back, Elastic or Bounce on a calm brand (they overshoot), and never on opacity or colour (expert move 3).

## 3. Expert moves
1. **Copy changes sides so the subject is never covered.** Each chapter's text alternates left and right of the film (Scrolltide: Rann Mahal).
2. **Pin callouts to points in the source frame**, not to the viewport, so they stay on the subject at any crop (Scrolltide: Katana).
3. **Scroll poses, it does not move.** The object stays dead centre while the page travels past it, then docks into a DOM slot when its section arrives (Scrolltide: Vesper).
4. **Debris passes in front only after it clears the hero's outline** (Scrolltide: Plinth).
5. **Copy waits for the arrival.** In a walk-through, the words stay hidden until most of the move is done, so the reader watches, then reads (Scrolltide: Threshold).
6. **Hold a chapter at rest.** Each chapter has a dwell range (opinion: about 30% of its scroll length) where nothing moves, so the copy can be read without the picture changing under it.
7. **Idle has a cadence.** A character or object left alone drifts on its own after a pause (Scrolltide: 9 seconds, Amble) and its idle motion is speed-limited to the rate it was drawn (Marmalade). Opinion: on a calm brand, nothing idles.
8. **Swap under cover.** To change a full-bleed image, close to black (an iris, a wipe), swap unseen, open; the title lands a beat later. Under reduce, a slow crossfade that never goes black (motionin: Iris).
9. **Lay text out once at its final size** before animating its container, so it never rewraps mid-move (Scrolltide: Expanded Cards).
10. **One loop owns the scene.** A single `requestAnimationFrame` loop drives every pose; a library may own only the text (motionin: Iris). Two clocks drift.
11. **Snap carousels and walls to a slot** after any scroll or drag so they never rest mid-angle (motionin: curved wall).
12. **Emit by distance, not time.** Trails and particle emitters spawn every N pixels of pointer travel, so spacing stays even at any speed (Scrolltide: Image Trail; motionin).
13. **Container units for composed scenes.** Size a framed composition in `cqi` so the whole scene scales with its frame (Scrolltide: Lodestar).
14. **Video lazily, by intersection.** Preview video `preload="none"`, started by an IntersectionObserver with a 200px root margin and paused off screen (Scrolltide build spec).
15. **No scrim only when the plate was made for type.** A plate with an unlit empty third can carry type with no overlay; otherwise run the overlay check (Scrolltide: Auralis, Arbor; design-art-direction 03).
16. **Know the effect before building it.** Reflection needs an environment map and has no hue; diffraction is a repeating spectrum from regular grooves and needs only a 2D shader; thin film is one non-repeating sweep through hue. The wrong guess ships hundreds of KB of 3D for a 2D effect (Scrolltide eBook p273).
17. **A pinned index earns its length or ships stacked.** Budget about 40svh of scroll per step; at 75svh, eight services added half again to a homepage and showed nothing a still could not (VGC job, round 4 critic). If the pin shows no change a still cannot, ship the stacked grid it falls back to.
18. **A hover picture gets its own grid column.** A picture that swings in over the row must land in a reserved track, never on the hovered row's text; give its fade-out 150ms or less so a sweep down the list leaves no trail (VGC job: Scrolltide Hover List covered "Custom homes" at 1024).
19. **A deck must say what it shows.** Each card is `role="group"`, `aria-roledescription="slide"`, `aria-label="n of N"`, and the stage is `aria-live="polite"`; a live counter alone tells a screen reader user "3 of 8" and never the quote (VGC job). Jumping to a slide from a thumbnail moves focus to that slide's link.
20. **Judge hover from a page screenshot, not an element screenshot.** An element screenshot scrolls the page under a still pointer and hovers a different row mid-transition, which looks like a trail bug that is not there.
21. **A curved media ring needs its gaps solved on screen, not in angle.** Put the viewer at the ring centre (`translateZ(P) rotateY(a) translateZ(-R)` with R a little above P, about 1.2P). A card centred at angle a lands at P times tan(a) on screen, so lay cards edge to edge in tan space: next left edge = atan(tan(previous right edge) + gap / P). Equal angles bunch cards at the edges; this keeps the gaps even. Drag in screen pixels divided by the centre card's projected pitch, then settle on the nearest card. Without 3D (reduced motion, no JS) it is a flat scroll-snap row. Source: VGC C media gallery, Oct 2026, built from Scrolltide's Media Gallery description (scrolltide.co/components).
22. **Projected text trips the layout lint.** Words on a card turned in 3D sit at different heights, so the squash and measure checks read one name as three lines. Skip those two checks on the card item only, with a comment saying why, and check the captions by eye at 390, 768 and 1440.

## 4. Do and don't
- Do: one pinned stage where a kitchen goes from bare studs to finished room in four chapters, copy alternating sides, a "02 / 04" counter. Don't: four different devices (a phone, a chart, a mockup, a photo) for the same four steps.
- Do: a hero clip that plays once and holds the finished room. Don't: a looping hero that cuts every six seconds.
- Do: a frame sequence with a real poster image and the H1 as live text, visible at first paint. Don't: a preloader that hides the headline until 240 frames decode.
- Don't copy from these libraries: countdown banners, mid-scroll pop-ups, count-up stats, smooth-scroll hijacking, cursor toys as the hero's point (opinion; `kb/research/motion/08-cinematic-scroll.md` section F).

## 5. Spec it as values
Hand a cinematic build over as a spec of values, not adjectives: design-playbook-landing `references/build-spec.md`.
