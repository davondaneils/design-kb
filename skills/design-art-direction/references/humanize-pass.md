# Humanize pass: from correct to alive

> design-art-direction reference. Run by design-director in the self-critique loop (section 5, "Humanize pass"), on the renders, after the lint, fact, polish and judged passes and before the fresh-context critic. Applies to landing, sales and brand pages; product UI screens skip sections 3.3, 3.8 and 3.9 (design-art-direction SKILL.md, "Product UI"). Token names and values: `kb/FOUNDATIONS.md`.

A page can pass every gate and every lint and still read as a template. The Flagship sales page did exactly that on 2026-10-14: the owner called it "very clean and perfect" and said it had "no soul" (field notes: `kb/research/landing/flagship-sales-page-lessons-2026-10-14.md`). The cause was not one mistake. Every section had the same width, the same shape, the same flat ground and no people. This pass finds those symptoms on the renders and names the move that fixes each one.

This file links out rather than repeating. Depth lives in: design-art-direction SKILL.md (concept, reject test, photos, text over art), design-graphic `references/01-logo-identity.md`, `02-icon-systems.md` and `03-photography-direction.md`, design-polish `references/01-interactive-states.md`, `02-depth-borders-shadows.md` and `04-surface-texture-text-rendering.md`, design-motion `references/04-micro-interactions.md`, `05-accessibility-performance.md` and `07-motion-on-real-pages.md`, design-layout `references/06-pacing-signature-and-phone-editing.md`, and design-typography `references/07-type-led-pages.md`.

## 1. Floor: humanity never trades away the gate

The fundamentals gate (design-foundations `references/fundamentals-checklist.md`) is checked first and stays passed after this pass. Re-run the lint after every fix below. One gate miss fails the page however human it now feels.

1. **Contrast holds at the worst pixel.** Every gradient, glow, photo and pattern under text is measured with `assets/overlay_contrast.py` (4.5:1 body, 3:1 large), in both themes, at 390 and 1440 (SKILL.md fundamental 3). A glow is decoration; it never lowers the text's contrast.
2. **Clarity wins over charm.** Blur the screenshot: the headline and the primary action still win (SKILL.md fundamental 10). A new image, numeral or ticker that outranks the action is moved or quieted.
3. **Reduced motion is designed, not deleted.** Every move in 3.9 and 3.10 has a still end state at first paint under `prefers-reduced-motion: reduce` (FOUNDATIONS, Motion; design-motion 07 fundamental 3).
4. **Grid breaks never cause a gate fail.** No horizontal scroll at any lint width (gate item 8), nothing overlaps text or a control (lint `occlusion`), DOM order is still reading order (WCAG 1.3.2; design-layout 06 fundamental 1).
5. **People are real, or labelled as not yet real.** Never present stock, generated or drawn people as real customers, staff or results (SKILL.md fundamental 8; design-graphic 03). Section 5 is the only way a stand-in reaches a draft.
6. **Decoration is hidden; meaning is named.** Patterns, glows and tickers' duplicate copies are `aria-hidden="true"`; portraits and work photos get alt text that says who and what (design-graphic 03).

## 2. The symptom checklist (run on the renders)

Render the page at 390 and 1440, light and dark (`node tools/render.mjs page.html out/ --widths 390,768,1024,1440`), and walk these with the screenshots open. Each line is a yes or no. A yes is a symptom: fix it with the move in section 3, or name it in the hand-over with the reason. The thresholds are opinion, set from the Flagship review and the exemplar teardowns cited in section 3.

| # | Symptom | Test on the render |
|---|---|---|
| S1 | **One column, one width.** | At 1440, no section's ground, image or band reaches the viewport edge beyond the section padding. |
| S2 | **One shape.** | Every block is a rectangle with the same radius; nothing overlaps a section edge or another card. |
| S3 | **No people.** | No image on the page shows a face or hands, on a page that sells a service people deliver. |
| S4 | **Rooms and boxes only.** | Imagery is only places, objects or plain UI: no illustrative graphic, no micro graphic, no custom icon. |
| S5 | **Flat light.** | Every section ground is one flat fill: no gradient, glow or light step anywhere on the page. |
| S6 | **Flat buttons.** | The primary button has no top highlight, no grounded shadow, no hover movement and no visible pressed face (check the state sheet). |
| S7 | **Brand is only an icon.** | The mark appears in the header and nowhere else: no pattern, no footer moment, no signature on the OG card. |
| S8 | **No type moment.** | Below the hero, the largest text is a section heading: no oversized numeral, no pull quote. |
| S9 | **Still and silent.** | Nothing responds except a color change on hover: no reveal, no count, no ticker, no considered hover (film it; screenshots never show motion). |
| S10 | **Button noise.** | More than one line of small text, or any underlined link, sits under the primary button in the first screen at 390 or 1440. |
| S11 | **Even loudness.** | The flatplan shows no loud section in an act, or every section enters the same way (same spacing, heading position and fade). design-layout 06 owns the fix. |
| S12 | **Nothing warm.** | The palette is neutrals plus one interface primary; no hue comes from the client's material world. |

A page with three or more symptoms is "soulless but correct" (opinion). Fix those first, because they are the ones a reader feels before reading a word.

## 3. The moves, as decision rules

Each move names its numbers and where the depth lives. All numbers are opinion unless a source is given.

### 3.1 People in the imagery (fixes S3)
- **If the business is people doing work** (trades, studios, services, clinics), at least one image per act shows a person, and the first or second screen shows the owner or the team. Order of preference: owner and team portraits; crews and hands at work; the customer in context (in their finished kitchen, opening the box). Never stock people standing in for any of these.
- **Why:** NN/g found real staff portraits drew more viewing time than the text beside them, and that users ignore generic stock people (NN/g, "Photos as Web Content", via design-graphic 03 [P1]). Pentagram's own about page leads with photographed, named partners and credits news to named people ("Giorgia Lupi and team", pentagram.com/about, read 2026-10-15). A people-led studio shows its people.
- **Specs:** portraits at an 85mm feel, environmental work shots at 35mm, 2 to 3m (design-graphic 03). Hands-at-work as a 1:1 detail crop, which also feeds card thumbnails and social crops (`references/05-requesting-photography.md`). Faces and gaze point into the page toward the copy (`references/03-composition-and-overlays.md`).
- **Product in hand:** for a physical or digital product, show it held or in use in a real room. Apple's product pages pair studio renders with lifestyle photos in warm interiors where the screen is visible, and every image shows the product doing one thing (`kb/teardowns/apple-macbook-air.md`).

### 3.2 One warm accent from the client's material world (fixes S12)
- **Sample it from a real material** the client works with or sells: timber, brass, terracotta, a van's livery, a uniform. Apple samples its hero gradient from the laptop's own finish (`kb/teardowns/apple-macbook-air.md`). Map it to `--color-accent` and `--color-illustration-accent`; it does not replace `--color-primary` unless it is the brand primary.
- **At most 5 percent of any screen's area**, measured on the 1440 render (opinion). It marks one thing per screen: the loud stroke, a numeral, a glow, the active ticker item.
- **Gate:** accent text meets 4.5:1 (3:1 at large size) and accent strokes that carry meaning meet 3:1 (WCAG 1.4.3, 1.4.11). Build the ramp in design-color.

### 3.3 Light per section group (fixes S5)
- **One light idea per act**, chosen from three:
  1. **Soft light:** a surface gradient of 2 to 4 percent OKLCH lightness, lighter at the top, `in oklch` (design-polish 04).
  2. **Glow behind key imagery:** a radial in the accent behind the portrait or the product, alpha 0.15 to 0.35, edge fading to transparent by 70 percent. Measured exemplar: Pitch puts `rgba(198,165,255,.35)` to transparent at 70 percent behind sections and one lilac glow shadow `0 20px 60px -20px` (`kb/teardowns/pitch-home.md`).
  3. **Deep tonal gradient** on one dark band per page: the dark band trick, a 3 percent radial lift behind the headline plus 3 percent grain (design-polish 04).
- **Exemplars:** Stripe spends its whole color budget on one signature gradient behind the hero and echoes it in every product card fill (`kb/teardowns/stripe-home.md`). Linear lights a near-black page with surface steps of 1 to 3 lightness points and a half-pixel inner highlight, not drop shadows (`kb/teardowns/linear-home.md`).
- **Rules:** light comes from above everywhere (design-polish fundamental 7). Never a two-hue "aurora" behind body text (design-polish 04). Gradients stay still under reduced motion. Add grain past about 600px of a small lightness change, or it bands (design-polish 04).

### 3.4 Buttons treated as objects (fixes S6)
Evidence: in NN/g's eyetracking study of 71 users, pages with weak signifiers (flat ghost buttons, links styled as static text) took 22 percent more time and drew 25 percent more fixations than nearly identical pages with strong ones (Moran, NN/g, 2017). Baymard's button guidance says to place the primary button more prominently than, and apart from, the others (baymard.com/learn/button-design). Recipe on FOUNDATIONS tokens:

| Face | Spec |
|---|---|
| Rest | `--size-control-lg` (48px) in the hero; fill `--color-primary` with a 2 to 4 percent OKLCH gradient, top lighter; `box-shadow: var(--highlight), var(--shadow-2)` (weight, inner highlight, grounded shadow); `border: 1px solid transparent` so forced colors keeps the edge (design-polish fundamental 9) |
| Hover (`hover: hover` and `pointer: fine` only) | `--color-primary-hover`; the arrow moves 4px (`--space-2`) along the reading direction at `--motion-hover`; the larger shadow fades in on a pseudo-element's opacity, never by animating `box-shadow` (design-motion 07 fundamental 8) |
| Pressed | `--color-primary-active`, `translateY(1px)`, shadow down to `--shadow-1`; declared after `:hover` (design-polish fundamental 3) |
| Focus | `outline: 2px solid var(--color-focus-ring); outline-offset: 2px`, 3:1, not transitioned (design-polish fundamental 1) |
| Dark theme | no drop shadow: ring, lighter fill and `--highlight` (FOUNDATIONS shadow recipe) |
| Reduced motion | the arrow and the press do not move; color changes stay at `--duration-fast` or less |

Measured exemplar of the object button: Designjoy's glossy dark button is `linear-gradient(#444,#000)` with inset white highlights at 30 and 50 percent and a 1px drop (`kb/teardowns/designjoy-home.md`). Take the idea, not the values: they are outside the FOUNDATIONS alpha cap.

### 3.5 A real brand mark and a pattern from it (fixes S7)
- **The mark is a mark**, built in design-graphic 01 (one flat color master, works at 16px), not a generic icon beside the name.
- **The pattern comes from one part of the mark** (a stroke, a corner, a counter), tiled as SVG `<pattern>`, `aria-hidden="true"`, at about 1.1 to 1.3:1 against its surface (`references/03-composition-and-overlays.md`), and moved away from the text color so it can only raise contrast.
- **A quiet signature, in 2 to 3 places per page**: the footer, one band, the OG card (opinion). Never under body text at full strength, never on forms, pricing or checkout (SKILL.md method step 5).

### 3.6 One consistent custom icon set (fixes S4)
One family, drawn to the design-graphic 02 default spec, stroke matched to the adjacent text (design-polish 03), ideally sharing the mark's corner or terminal. Run `node skills/design-graphic/assets/icon_audit.mjs page.html`. Use icons where they carry meaning (inclusions list, process steps), not as bullets on every line.

### 3.7 Big type moments (fixes S8)
- **One per act**: an oversized numeral at `--text-display` with `tabular-nums` and its unit set small beside it, or an editorial pull quote at `--text-display-2` (hanging opening quote, name and role under it at `--text-sm`).
- Pentagram breaks its project grid with a 32px pull quote between rows (`kb/teardowns/pentagram-home.md`). Setting and optical margins: design-typography 07.
- Two type moments never sit back to back (design-layout 06: never two loud sections of the same kind adjacent).

### 3.8 Break the grid, once per act (fixes S1, S2, S11)
- **At least one grid-breaking section per act of 4 to 7 sections** (opinion). This scales design-layout 06's "break once, toward one edge" from the page to the act: each act gets one directed break; two adjacent sections never break the same way.
- **Kinds of break:**

| Break | Spec |
|---|---|
| Full-bleed band | ground and image run to both viewport edges; text stays on the page grid |
| Image over a section edge | overlaps the next or previous section by 48 to 96px (`--space-8` to `--space-10`); never over text or a control |
| Layered cards | 2 layers at most, offset 16 to 24px (`--space-5` to `--space-6`), back layer one surface step down |
| Slow ticker | see 3.9 |

- **Radius:** one family stays (design-polish fundamental 10). Shape variety comes from full-bleed (radius 0), overlap and layering, not from new radii.
- Phone: overlaps shrink to 24 to 48px or stack; check the 390 render for horizontal scroll.

### 3.9 A slow, pausable ticker (fixes S1, S9)
- **Content is real facts** the reader can check (suburbs served, project names, years in trade), never adjectives.
- **Speed 30 to 60px per second**, `linear` (FOUNDATIONS allows `linear` for loops), one per page.
- **A visible pause button** (it runs more than 5 seconds beside other content, so WCAG 2.2.2 Level A applies; design-motion 05). Pause also on hover and on focus inside it.
- The list sits once in the DOM; the duplicate copy that makes the loop is `aria-hidden="true"`. Under reduced motion it is a still row that wraps or scrolls by hand.

### 3.10 Micro-interactions (fixes S9)
Film all of these with `motion-audit.mjs` in both motion settings (design-motion 07 fundamental 9).
- **Image reveals:** below the fold only, once, the two-transform wipe at `--duration-page` or less (design-motion 07). First paint never animates.
- **Considered hovers:** card lift through a pseudo-element's shadow opacity; image scale 1.02 to 1.04 inside a clipping frame; the card's arrow moves like the button's. Pointer-fine only.
- **Count-ups, narrowly:** design-motion 07 fundamental 5 says numbers never animate on arrival. This pass allows one deliberate deviation: a proof numeral in a type moment (3.7), below the fold, counting once on first view in at most `--duration-page`, with the final value in the HTML from first paint (the count is visual only, so readers and crawlers get the true number) and shown still under reduced motion. Never on prices, KPIs, anything in the first screen, or any live number.

### 3.11 A founder video slot
- One slot, near the proof or the close: 16:9 on desktop, 4:5 on phones, the poster frame is the founder's face mid-sentence, the play button is at least 48px and carries the duration ("Watch Michael, 1:40").
- **60 to 120 seconds** (opinion). No autoplay. Captions (WCAG 1.2.2, Level A) and a transcript link. Load the player only on click (a poster-and-button facade), so the player's script costs nothing before the click (opinion; image and media delivery rules are in design-frontend).
- Until the video exists, the slot follows section 5.

### 3.12 Quiet the primary button (fixes S10)
- **No more than one line of microcopy under a primary button in the first screen** (opinion), and no underlined links stacked under it. That one line answers the first objection (design-conversion 01, "the objection line under the button") or states the guarantee as a sentence (design-conversion 02).
- Terms the law requires at the point of consent (design-conversion 03) go where consent happens. If they must sit under this button, they are the one line.
- Secondary paths move to the nav, the next screen or the close.

## 4. What reads as tacky (avoid)

The first two rows are the owner's verdict on the Flagship page (field notes, 2026-10-14); the rest are sourced where noted, otherwise opinion.

| Tacky | Instead |
|---|---|
| Sketches or line drawings of rooms standing in for photos | Real photos of the work and the people, or an honest slot (section 5) |
| Paper, kraft, grunge, torn-edge or stain textures as page ground | Light (3.3); grain only on an object, 4 to 8 percent (design-polish 04) |
| Stock handshakes, pointing at screens, headset smiles, perfect desks | Specific action by real people (design-graphic 03 reject list) |
| Generic 3D blobs, glass orbs, floating shapes | The product, the work, or the brand's own data drawn (SKILL.md expert move 2) |
| Interchangeable flat-people illustration | Photos of the real team (design-graphic 04) |
| Scribble underlines, fake handwriting fonts, emoji as icons | One type moment (3.7) and one icon set (3.6) |
| Every section revealing, parallax everywhere | Reveals rationed to the scenes that prove something (field notes, "product theatre, rationed") |

## 5. The placeholder rule

1. **While drafting**, generated or stock images may stand in for portraits, crews, customers and the founder video poster, so the composition can be judged. Each one is visibly a draft (a small "Placeholder" label in the image corner on drafts) and carries `data-placeholder="<id>"` on its `<img>` or `<figure>`.
2. **Every stand-in is on the placeholder list** in the hand-over: id, slot, what the real asset must show, the photo request spec (`references/05-requesting-photography.md`), owner, due date.
3. **Before launch every one is replaced.** A launch build with any `data-placeholder` element fails this pass. A generated or stock person is never presented as a real customer, team member, testimonial or result at launch (SKILL.md fundamental 8; design-graphic 03; FTC Endorsement Guides, 16 CFR Part 255, on endorsements reflecting real experience).
4. If a real asset will not exist by launch, remove the slot or replace it with something true (the work itself, a type moment). Never ship the stand-in.

## 6. Running the pass

1. Walk S1 to S12 on the 390 and 1440 renders, light and dark, plus the state sheet for S6 and the motion strips for S9.
2. For each yes, apply the move in section 3, or write why it stays (a product UI screen, a client rule).
3. Re-run the lint, `overlay_contrast.py` on every new text-over-art box, `icon_audit.mjs`, and `motion-audit.mjs` for anything that now moves. Section 1 must still hold.
4. Hand-over line: "Humanize pass: symptoms found [list], fixed [list], named [list with reason]; placeholders open: [n]".

## 7. Do and don't

| Do | Don't |
|---|---|
| Show the owner and the crew at work | Fill the people slots with stock smiles |
| One warm accent, at most 5 percent of a screen | Warm everything up with a beige page |
| One light idea per act, from above | An aurora gradient behind body copy |
| One directed grid break per act | Bleed and overlap every section |
| Object buttons with every face designed | A glossy hero button with no pressed or focus face |
| One quiet line under the main button | Three lines of small print and two underlined links |
| Label and list every placeholder | Let a generated face reach launch |

## Sources
- NN/g, Kate Moran, Flat UI Elements Attract Less Attention and Cause Uncertainty (2017-09-03; 71 participants, 9 page pairs): https://www.nngroup.com/articles/flat-ui-less-attention-cause-uncertainty/ (read 2026-10-15)
- NN/g, Photos as Web Content: https://www.nngroup.com/articles/photos-as-web-content/ (via design-graphic 03 [P1])
- Baymard Institute, Button Design: https://baymard.com/learn/button-design (read 2026-10-15)
- Pentagram, About (named partner portraits, named credits): https://www.pentagram.com/about (read 2026-10-15)
- W3C, WCAG 2.2: 1.2.2 Captions (Prerecorded), 1.3.2 Meaningful Sequence, 1.4.3 Contrast, 1.4.11 Non-text Contrast, 2.2.2 Pause, Stop, Hide: https://www.w3.org/TR/WCAG22/
- FTC, Guides Concerning the Use of Endorsements and Testimonials in Advertising, 16 CFR Part 255: https://www.ecfr.gov/current/title-16/chapter-I/subchapter-B/part-255
- Measured teardowns in this repo (2026-10-10): `kb/teardowns/stripe-home.md`, `linear-home.md`, `pitch-home.md`, `apple-macbook-air.md`, `pentagram-home.md`, `designjoy-home.md`
- Owner review of the Flagship sales page, 2026-10-14 and 2026-10-15 (opinion): `kb/research/landing/flagship-sales-page-lessons-2026-10-14.md`
