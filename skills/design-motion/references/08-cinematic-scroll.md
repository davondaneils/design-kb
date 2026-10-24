# 08 Cinematic scroll pages

Pages where scroll drives a film, a pinned object or a sequence of chapters: product reveals, launches, studios, hospitality, luxury goods. Research and sources: `kb/research/motion/08-cinematic-scroll.md` (Scrolltide's 128 templates and eBook samples, motionin.design, easings.net; accessed 2026-10-23). Those sources are tier 5 practitioner libraries; their recordings are inspectable builds, and every value below that is not from FOUNDATIONS is marked opinion or credited.

## 1. Fundamentals (non-negotiable, check first)
Everything in design-motion section 1 still applies. On a cinematic page these are the ones that fail:
1. **The scene must earn its place.** Before building one, answer "should this scene exist at all?" (Scrolltide's stage 6 question). It exists only when the motion shows something a still cannot: how a thing opens, how it is built, what it looks like from the other side, how a space feels to walk through. Atmosphere alone is a still.
2. **Three moments move, no more.** Name the three scroll moments that move before building; the rest of the page is still (Scrolltide's stage 5 decision, "which three moments move"). Opinion: a renovator, clinic or law firm page usually needs one. The count is of scroll-scrubbed stages; components the reader steps through (a deck, a stack) and one ambient ground do not count, because they move only when asked or never compete with the copy (Stand Firm v4: film, lie and walls scrubbed; deck, stack and dawn not).
3. **The first paint is visible.** The hero headline never starts at opacity 0 (it hides the LCP element); if it moves, it moves by transform only (Scrolltide build spec; web.dev LCP). A frame sequence shows its first frame as a real `<img>` poster before the canvas takes over.
4. **Scroll stays native.** Scroll is the playhead, never a hijacked wheel (03, "never scroll-jack"). Pinned stages use `position: sticky` and native scroll; no smooth-scroll library.
5. **Reduced motion gets the story, not the film.** Each chapter shows its key still with its copy; the pinned stage becomes a stacked series of stills; crossfades replace travel; nothing flashes to black (03; motionin "Iris" reduce path).
6. **The phone gets a plan.** 3D and frame sequences have a budget and a fallback for a stranger on a slow phone (Scrolltide stage 7). Opinion: hero plate and first frames under 2 MB total (Scrolltide chapter 12, "the two-megabyte hero"), frames lazy-decoded past the first chapter.
7. **Text over motion passes contrast on the worst frame**, not the poster (design-art-direction `references/03-composition-and-overlays.md`).
8. **Structure first, motion second.** Plan the page as a sequence of story beats and give each beat the mechanism or component that tells it; the cinematic spine is the layout. Adding a zoom or a parallax to a page designed static fails (Stand Firm v3, rated mediocre by the client for exactly this; research G1).
9. **Judge motion moving.** Screenshots and the lint render with reduced motion, so they show stills. Record a scroll-driven screen video at `prefers-reduced-motion: no-preference` and judge timing from that; send the video, not screenshots, when someone signs off on motion (research G10).
10. **Every transient state passes too.** Blurred, dimmed or half-revealed text is still text: keep it at 3:1 or better (opinion: opacity 0.55 or more on a dark ground), and check the phone, where copy sits over a different part of the picture than on desktop (research G6).

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

**Pick a component by job** (Scrolltide components, shaders and UI previews; research G)
| Job on the page | Component | Build note |
|---|---|---|
| Enter a chapter stage from a headline | Zoom Reveal: a picture pill between two words of the headline opens to full bleed | clip-path `inset()` with a radius, from about 40% each side to 0; flanking words `flex: 1`, aligned toward the gap, so the pill is centred |
| Correct a belief | Strike the old line, then Focus Reveal: a corner-bracket frame travels word to word and each word turns sharp | Ease the frame between word boxes with easeInOutCubic; unrevealed words blurred at opacity 0.55 or more |
| Five to seven chapters of an offer | Scroll Index: full-bleed photo, one giant word, a thumbnail strip with the current one outlined, a counter | Giant word sized `min(19vw, calc(110vw / letters))` on phones, where the strip goes horizontal above the word, and `calc(96vw / letters)` on desktop, where the strip sits at the side and the longest word must clear it |
| A few stories or people | Photo Stack: the top print swings out and tucks under, over a ghosted word | Button steps; the prints are decoration (`aria-hidden`), the story text is live and `aria-live="polite"` |
| Testimonials | Quote Deck: fanned cards, focused card upright | Arrows and swipe, never auto-advance; reset `<figure>` margins; clip the section `overflow-x: clip` |
| A score | Segmented arc gauge (20 segments on 270 degrees) | Drawn in SVG; the number is live text beside it |
| A quiet moving ground | Aurora or mesh shader | Half resolution, dithered, paused off screen; loud families (chrome, flame, halftone) only when the brand is built on them |

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
17. **Build a film from a keyframe chain.** Make 3 to 5 keyframe stills in one look, each generated with the previous one as an image reference, then one clip per neighbouring pair with start and end frames set. Neighbouring clips share a seam frame, so the film plays as one take (research G2).
18. **Step through generated clips frame by frame.** Generators cross-fade between unlike frames, and a 0.85 s dissolve can hide in a clip whose thumbnail looks clean. Extract the frames and look at every one near each change before building (research G3).
19. **Hide an unavoidable cut under something the story provides.** A lightning flash, a door swinging past, headlights: peak at the cut frame and fall off over about 1.5 frames each side. It is "swap under cover" with cover that belongs in the scene (research G3).
20. **Load frames coarse to fine.** Every 8th frame, then 4th, 2nd and 1st; draw the nearest loaded frame. Scrubbing works in a second and sharpens as the rest arrive (research G4).
21. **Cut a portrait frame set for phones.** Crop 9:16 frames from the source with the crop centre following the subject, rather than cover-cropping 16:9 frames on a tall screen (research G4).
22. **A diegetic progress readout.** A clock, an altimeter or a distance that advances with the film tells the reader how far through they are and adds story; a bar adds neither (research G5).
23. **A scrim belongs to the copy, not the film.** On phones, give the beat that needs it its own gradient (it fades with the beat), so later beats keep the full picture (research G6).
24. **Copy beats keyed to frames.** Each beat has four frame numbers: start in, fully in, start out, gone. Hold at least a third of its range still (move 6), and alternate the side of each beat (move 1).

## 4. Do and don't
- Do: one pinned stage where a kitchen goes from bare studs to finished room in four chapters, copy alternating sides, a "02 / 04" counter. Don't: four different devices (a phone, a chart, a mockup, a photo) for the same four steps.
- Do: a hero clip that plays once and holds the finished room. Don't: a looping hero that cuts every six seconds.
- Do: a frame sequence with a real poster image and the H1 as live text, visible at first paint. Don't: a preloader that hides the headline until 240 frames decode.
- Don't copy from these libraries: countdown banners, mid-scroll pop-ups, count-up stats, smooth-scroll hijacking, cursor toys as the hero's point (opinion; `kb/research/motion/08-cinematic-scroll.md` section F).

## 5. Spec it as values
Hand a cinematic build over as a spec of values, not adjectives: design-playbook-landing `references/build-spec.md`.
