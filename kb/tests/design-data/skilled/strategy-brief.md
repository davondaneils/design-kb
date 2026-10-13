<!-- Crux is the fictional brand of the design-data test brief. Competitor names are fictional stand-ins, as in the design-strategy worked example. -->
# Strategy brief: Crux member schedule

Depth: one page (new product screen, no strategy on file)
Locale: en-US (US gyms; seed walls in Denver)
Deliverables: data model, API, member schedule screen, hand-over
Not built: staff desk screens, marketing site; the brief asks for the member screen

## 1. Audience moment
Moment: a member when picking this week's class on the bus, wanting a place they can count on, held back by fear of a no-show mark if plans change.
Primary CEP (hero): "is there a place Thursday, and can I still get out of it?"
Anxiety and design answer: a hidden late-cancel rule -> each booked row states its own free-cancel deadline; a late cancel asks first
Their words: "is it full", "how many spots" (source: stand-in, the brief's phrasing; no member research held)

## 2. Positioning
Alternatives: status quo: the front desk phone and a clipboard sheet; a generic fitness booking app
Competitors named: Belay Desk, ClassLoop, PeakBook (fictional)
Competitor wall: colored calendar blocks, "Book now" on every row, a spots count with no cancel rule
Category frame: class booking for climbing gyms (tried: gym management, fitness scheduling)
Onlyness (internal): Our schedule is the only class booking screen that shows each booking's own free-cancel deadline and your place in line, for members, as they book.
Swap test: pass for all three stand-ins (a hypothesis, not a market scan)

## 3. One true fact and proof
Fact: every booking stores free_cancel_until, 12 hours before the start (source: schema.sql; run_tests.sh section 6)
Proof on the page: the booked Sunday row reads "Free cancellation until 10:00 pm Sat"; past the deadline, a clock flag and a confirm dialog
Behaviors: the cancel and the waitlist promotion happen in one transaction
Weakest field: their words; no interviews or tickets

## 4. Claims ledger
| Claim as written | Fact | Source | Evidence held |
|---|---|---|---|
| "4 places left" | capacity minus taken bookings | places_left, ready fixture | yes |
| "2nd in line" | rank by (waitlisted_at, id) | waitlist_rank, ready fixture | yes |
| "You can book until Sun 9:14 am" | past_due_since plus 7 days | grace_ends_at, past-due fixture | yes |
| "The fairest waitlist" | no comparison held | none | cut |

## 5. Voice
| Attribute (this, not that) | Sample line |
|---|---|
| Exact, not legalistic | "After that, cancelling counts as a no-show." |
| Calm, not chirpy | "You're booked." |
| Plain, not blunt | "Your monthly pass payment didn't go through." |
Flat in: payment failures, errors, the late-cancel dialog

## 6. Identity decisions
| Attribute | Decision | Reason | Level | Owner |
|---|---|---|---|---|
| Exact, not legalistic | Tabular figures; one dot per place in a rail | Times align; the room fills before you read | O | design-typography 06 |
| Calm, not chirpy | Teal primary, cool neutrals, one filled button per view | Chips carry the signal | O | design-color |
| Plain, not blunt | Warning and danger only on payment and late cancel, always with words | Color is never the only signal (WCAG 1.4.1) | C | design-color |
Primary distinctive asset: the places rail, one dot per place
Supporting assets: teal at about 5 percent of a screen; Inter
Category codes: kept: day strip, time-ordered list, status chips; broken: the calendar block grid, replaced by the rail (emergent)
Asset audit (rebrand only): not a rebrand

## 7. Concept for art direction
Concept sentence: Every class is drawn as one dot per place, so you see the room fill before you read a number.
Reject test: Does it show something the data cannot supply? Cut it.

## 8. Checks
| Check | Result |
|---|---|
| Word swap test | pass, three stand-ins |
| Competitor wall, logos covered | pass, self-review only |
| Hide-the-logo | pass, self-review only |
| Five-second test (who viewed) | not run |
| Claims ledger complete | yes; "fairest" cut |
