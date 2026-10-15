# Lessons from the Flagship sales page build (2026-10-14)

These are field notes, not sourced facts. They come from one owner's reactions over one build (Davon, Flagship Build Co.). Read them as opinion and as test cases for the landing playbook.

## What the owner rejected, and why
1. **Correct but even.** Directions that passed the fundamentals gate were still called "generically good". Every element had about the same weight. The fix was one colour moment (a single deep green band), one type moment (the loudest fact at display scale) and a hero that fills the first screen.
2. **Polish that sands off identity.** A pass that cut the drawing-set devices (title blocks, revision clouds, scale drawings) back to small labels read as a loss, even though it scored better on contrast and space. Keep the motif carrying every screen; that is the first-screen reject test in `skills/design-playbook-landing/references/signature-moves.md`.
3. **Unexplained notation.** He didn't get the circled letters (architectural callout bubbles), and they repeated too much. A device the reader can't decode is noise, however authentic it is to the source discipline.
4. **Showing the reader's own brand back to them.** On a sales page reached from the reader's own before and after, repeating their photos and site in the hero is redundant. The hero should show what they get next (here, the free website plan as an object: a folio that opens on scroll). Their photos belong only where the copy points at them as proof, marked as samples.

## What worked
- **Product theatre, rationed.** Four scroll scenes across 20 sections. Each one shows a state change the reader must believe: the plan opens, the same words blur away, the referral replays and ends on their phone ringing, the folio reopens to the price. Every other section is still or a simple fade-in. The owner's worry, "impress more than persuade", is the test for whether a section gets a scene.
- **Videos, not PNGs, for motion review.** Record desktop and phone scroll videos with Playwright `recordVideo` plus ffmpeg, and pull frames to confirm the motion was captured.
- **Speed.** A long builder, critic, fix and re-score loop (about two hours) frustrated the owner more than imperfect work did. Show each group as it lands. Parallel builders writing separate section partials, stitched together by an assemble script, kept four builders from colliding on one page.
- **Buyer needs for a no-call purchase of about US$10,000** (the owner's own research, unsourced here): inspect real work, count exactly what they get, know the rules (delays, stopping, ownership), and see who does the work. Each needs a section.

## Process mistakes to avoid
- Building three directions solo, without the pipeline, produced "horrible" work. The skills only help when they are loaded and followed.
- Drifting from the approved outline. Reread it before each new round, because the outline said the hero subject and the loud kind of section 3 long before the builds wandered.

## Why the page read as disconnected pieces (deep read, 2026-10-14)

Full read: `agency/PAGE-READ-2026-10-14.md` in the project files. Lessons for any long sales page (opinion, from Sugarman's slippery slide, Bencivenga's Rule of One and Halbert's letter form):
- A section that states a finished conclusion as its headline ("Your quote reads as the top choice") closes its own loop. Twenty of those read as a feature grid, not an argument. 13 of 20 headlines on this page began with "You" or "Your".
- Each section should end by opening the next; the only working open loop on the page (section 15 into the price) was the model for the rest.
- A mirrored payoff (the referral that fails in section 2 and succeeds in section 6) needs a literal callback: same objects, same words. Without it the reader doesn't feel the mirror.
- Words repeated verbatim lose force ("London is still open" 5 times plus the sticky bar). Repeats should escalate.
- If the closing letter is the only part that feels human, it is the page's real skeleton: use its sentence order for the sections.
- Twenty identical section entrances (same spacing, same headline position, same fade) tell the eye "separate cards". Group into acts with different ground, let bridge lines share a screen with the next section, and vary density.
- Process cause: the 20 sections were split across four parallel builders, each polishing its own sections, so nobody owned the thread between them. For a long sales page, write the whole argument top to bottom in one pass first (one author, bridges included), then split the build.
- Headline chain (owner feedback, 2026-10-14): a headline chain built on clever links ("The look that wins is your own work") read as weird. The owner's bar: clear before clever; benefits and specific numbers; the headlines alone flow when skimmed, and the full read flows too. A small studio writes as "we" with a named contact, never "me" alone (owner's rule: when small, act big).

## Soulless but correct (owner review, 2026-10-15)

Opinion, from the owner's review of the built sales page. It passed every fundamentals check and the lint, and he said it had "no soul". What he saw:
- very clean and perfect, and nothing else;
- every element in one content column, at one width, in rectangles with the same corner radius;
- nothing breaking the grid: no full-width section past the section padding, no ticker;
- no micro graphics or illustrative imagery, only photos of rooms and plain interface;
- no people in any image;
- flat buttons, no gradients, no depth;
- no brand mark beyond an icon;
- too many lines of microcopy and underlined links under the main button.

**What he rejected:** sketches of rooms and paper textures. He called them tacky.

**What we agreed adds humanity:** people in the imagery (owner and team portraits, crews and hands at work, the customer in context); one warm accent from the client's material world, used sparingly; gradients and light per section group (soft light, glow behind key imagery, deep tonal gradients); buttons treated as objects (weight, inner highlight, grounded shadow, a moving arrow on hover, a pressed state, a focus ring); a real brand mark and a quiet pattern from it; one custom icon set; big type moments (oversized numerals, editorial pull quotes); full-bleed bands, a slow pausable ticker, images overlapping section edges, layered cards, at least one grid break per act; micro-interactions (count-ups, image reveals, considered hovers, all respecting reduced motion); a founder video slot; generated or stock placeholders allowed while drafting, tracked on a placeholder list and replaced before launch, never presented as real proof.

**What we changed in the skills:** a new reference, `skills/design-art-direction/references/humanize-pass.md` (12-symptom checklist, the moves as decision rules, the tacky list, the placeholder rule), run as a new step in the design-director self-critique loop (section 5, step 12) before the exemplar comparison and the fresh-context critic. Lesson: the gate makes a page correct; it does not make it human. Check for soul on the renders as deliberately as for contrast.
