<!-- Worked example at one page depth. Ember and Oak is the design-kb test brand (design-art-direction worked example 1); competitor names are fictional stand-ins. -->
# Strategy brief: Ember and Oak

Depth: one page (new site, no strategy on file)
Locale: en-US (Portland roaster, US shipping)
Deliverables: landing page with shop cards
Not built: guidelines, logo kit

## 1. Audience moment
Moment: home brewers when their supermarket bag tastes flat again, wanting to know why one coffee beats another, held back by fear of paying more for the same taste.
Primary CEP (hero): "my coffee tastes the same every week"
Anxiety and design answer: paying more for no difference -> curve and farm map on every card; "cancel online" beside subscribe
Their words: "flat", "I can't taste the difference" (source: stand-in, competitor reviews)

## 2. Positioning
Alternatives: status quo: supermarket specialty bags; a café's beans; online roasters
Competitors named: Northline Roasters, Cascade Bean Co, the supermarket's reserve range
Competitor wall: kraft bags, mountain line drawings, script type
Category frame: single-origin coffee subscription (tried: coffee beans, specialty roaster)
Onlyness (internal): Our subscription is the only single-origin coffee that ships every lot with its roast curve and farm map, for home brewers.
Swap test: pass; Northline prints origin, no curve; Cascade and the supermarket neither

## 3. One true fact and proof
Fact: every batch is roasted on a 1962 drum roaster in Portland and logged as a curve (source: batch logs)
Proof on the page: each card shows its curve, first crack marked
Behaviors: a bag that misses its curve is sold as "seconds", never as the lot
Weakest field: no reviews yet, so no rating shown

## 4. Claims ledger
| Claim as written | Fact | Source | Evidence held |
|---|---|---|---|
| "Roasted on a 1962 drum roaster" | the roaster's plate | photo of the plate, 2026 | yes |
| "Guji, grown at 2,100 m" | importer lot sheet | lot sheet 412 | yes |
| "The only roaster showing curves" | no market scan | none | cut |

## 5. Voice
| Attribute (this, not that) | Sample line |
|---|---|
| Expert, not academic | "First crack at 9:40. That's why it tastes like apricot." |
| Warm, not cute | "Your Guji ships Tuesday. Brew it within two weeks." |
| Plain, not blunt | "Your card did not go through. You have not been charged." |
Flat in: payment errors, delivery problems, security

## 6. Identity decisions
| Attribute | Decision | Reason | Level | Owner |
|---|---|---|---|---|
| Expert, not academic | Serif at `--text-display`, sans body, tabular figures | Notebook annotation reads as evidence | O | design-typography 02 |
| Expert, not academic | Imagery: contour maps, roast curves | Only this roaster has them | O | design-art-direction 01 |
| Warm, not cute | Warm neutrals; `--color-brand` orange only for the curve | 3.0:1 on white, under 3:1 on neutrals: never text; curve one step darker (1.4.11) | O | design-color palette-building |
| Warm, not cute | Rounded bag silhouette, `--radius-lg` cards | Rounded reads softer (weak lab effect) | E weak | design-graphic 01 |
| Plain, not blunt | `--motion-enter` once on the hero curve | Calm; reduced motion removes it | O | design-motion 01 |
Primary distinctive asset: the bag shape printed with a contour map and one orange curve
Supporting assets: orange at about 10 percent of any surface
Category codes: kept: bag shots, origin names, a standard subscribe flow; broken: the dominant mountain drawing, replaced by data graphics (emergent)
Asset audit (rebrand only): not a rebrand

## 7. Concept for art direction
Concept sentence: Every coffee is drawn as the contour map of the hill it grew on and the roast curve that finished it.
Reject test: No place, measurement or roast in it? Cut it.

## 8. Checks
| Check | Result |
|---|---|
| Word swap test | pass for all three competitors |
| Competitor wall, logos covered | pending build |
| Hide-the-logo | pending build |
| Five-second test (who viewed) | pending; one fresh subagent |
| Claims ledger complete | yes; "only" cut |
