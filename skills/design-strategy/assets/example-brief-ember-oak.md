<!-- Worked example at one page depth. Ember and Oak is the design-kb test brand (design-art-direction worked example 1); competitor names are fictional stand-ins. -->
# Strategy brief: Ember and Oak

Depth: one page (new site for a roaster with no strategy on file)
Locale: en-US (Portland roaster, US shipping)
Deliverables: landing page with shop cards
Not built: brand guidelines, logo kit (the brief did not ask)

## 1. Audience moment
Moment: home brewers who already own a grinder when their supermarket bag tastes flat again, wanting to understand why one coffee beats another, held back by fear of paying more for coffee that tastes the same.
Primary CEP (hero): "my coffee tastes the same every week"
Other CEPs: a gift for a brewer; trying a new origin
Anxiety and design answer: paying more for no difference -> the roast curve and farm map on every card, plus "skip or cancel online" beside the subscribe button
Their words: "flat", "I can't taste the difference", "single origin" (source: stand-in, reviews of two competitor roasters)

## 2. Positioning
Alternatives: status quo: supermarket specialty bags; a local café's beans; online roasters
Competitors named: Northline Roasters, Cascade Bean Co, the supermarket's own reserve range
Competitor wall: kraft bags, a mountain line drawing, "ethically sourced" in a script face
Category frame: single-origin coffee subscription (tried: coffee beans, specialty roaster)
Onlyness (internal): Our subscription is the only single-origin coffee that ships every lot with its own roast curve and farm map, for home brewers, from Portland.
Swap test: pass; Northline prints origin but no curve, Cascade prints neither, the supermarket range prints a flavor wheel only

## 3. One true fact and proof
Fact: every batch is roasted on a 1962 drum roaster in Portland and logged as a curve (source: the roastery's batch logs)
Proof on the page: each bag and shop card shows its logged curve with first crack marked
Weakest field: proof from customers; no review count yet, so no rating is shown

## 4. Claims ledger
| Claim as written | Fact | Source | Evidence held |
|---|---|---|---|
| "Roasted on a 1962 drum roaster" | the roaster's plate | photo of the plate, 2026 | yes |
| "Guji, grown at 2,100 m" | importer lot sheet | lot sheet 412 | yes |
| "The only roaster that shows its curves" | no full market scan | none | cut |

## 5. Voice
| Attribute (this, not that) | Sample line |
|---|---|
| Expert, not academic | "First crack at 9:40. That's why it tastes like apricot." |
| Warm, not cute | "Your Guji ships Tuesday. Brew it in the first two weeks." |
| Plain, not blunt | "Your card did not go through. You have not been charged." |
Flat in: payment errors, delivery problems, account security

## 6. Identity decisions
| Attribute | Decision | Reason | Level | Owner |
|---|---|---|---|---|
| Expert, not academic | Serif display at `--text-display`, sans body; tabular figures for altitude and times | Lab-notebook annotation reads as evidence | O | design-typography 02 |
| Expert, not academic | Imagery is the brand's own data: contour maps and roast curves | Only this roaster has these numbers | O | design-art-direction 01 |
| Warm, not cute | Warm neutrals; `--color-brand` orange only for the fire (the curve) | One loud element; orange fails as body text, so fill and accent only | O | design-color palette-building |
| Warm, not cute | Rounded bag silhouette, `--radius-md` cards | Rounded reads softer (weak lab effect) | E weak | design-graphic 01 |
| Plain, not blunt | `--motion-enter` once on the hero curve, nothing else | Calm; reduced motion removes it | O | design-motion 01 |
Primary distinctive asset: the bag shape printed with a contour map and one orange curve
Supporting assets: brand orange at about 10 percent of any surface; the serif
Category codes: kept: bag shots, origin names, a subscribe flow like every shop; broken: no mountain line drawing or script face, data instead
Asset audit (rebrand only): not a rebrand

## 7. Concept for art direction
Concept sentence: Every coffee is drawn as the contour map of the hill it grew on and the roast curve that finished it.
Reject test: Does the visual show a place, a measurement or the roast? If not, cut it.

## 8. Checks
| Check | Result |
|---|---|
| Word swap test | pass for all three named competitors |
| Competitor wall, logos covered | pending the build; run on the 1440 and 390 first screens |
| Hide-the-logo | pending the build |
| Five-second test (who viewed) | pending the build; one fresh-context subagent |
| Claims ledger complete | yes; "only" claim cut |
