# 02 Proof and trust design

Which proof answers which doubt, where it sits, and how to set it so a careful buyer believes it and a premium brand does not look like a discount site. Sources: `kb/research/conversion/02-proof-and-trust.md`.

## Floor: fundamentals (non-negotiable)
1. **Real, attributable, complete.** No invented, AI-written or insider reviews without disclosure, no suppressed negatives (FTC final rule, Aug 2024, C24). On test pages with a fictional brand, mark sample proof as sample in the source. [judged]
2. **A rating always shows its count** ("4.7 from 1,284 reviews"). An average alone is distrusted (C22). [judged]
3. **Proof sits next to the claim it proves**, and at least one proof element is within one screen of the primary CTA (playbook-landing non-negotiable 3). [judged]
4. **Stars are never the only carrier.** The number is text; star glyphs are `aria-hidden`; bars carry their count as text (FOUNDATIONS item 11). [judged]
5. **Security cues belong to payment.** A lock or seal goes on the encapsulated card block (C23), not in the hero. [judged]
6. **Guarantees and policies state the mechanism and the time** ("Tell us within 30 days and the next bag is free"), never "100% satisfaction guaranteed" alone. [judged] (opinion as phrased; the fundamentals reason is clarity, FOUNDATIONS item 12)

## Principles
- Proof answers a specific doubt at the moment it arises. Map doubts first, then place proof.
- On a premium site the strongest proof is first-party and checkable: specific facts only this company could state. Generic badges borrow trust from strangers and read as insecurity (opinion, consistent with C19 "up-front disclosure" and "comprehensive and current content").
- Imperfection is credible. A 4.7 with visible 2 and 3 star reviews sells better than a wall of fives (C20, C21).

## Doubt to proof map
| Doubt | Proof that answers it | Where |
|---|---|---|
| Is it good? | Rating with count and distribution; one specific quote | Beside the price block |
| Is it for me? | A review from someone like me, with the variable that matters (brew method, team size) | Near the plan or cadence choice |
| What if it is not? | Guarantee with mechanism and time; returns or cancel terms | Directly under the CTA, body size |
| Is this company real and fair? | First-party facts: address, roast dates, prices paid, named people | Story section, footer |
| Is my card safe? | Encapsulated card block, lock icon, processor name | Payment step only (C23) |
| Will a B2B buyer's security team approve? | Compliance list (SOC 2, ISO 27001) as text | Pricing page, enterprise column (C46) |

## Numbers
- Five reviews: +270% purchase likelihood over none; +380% for higher-priced items (C20).
- Rating sweet spot 4.0 to 4.7; likelihood falls toward 5.0 (C20).
- 53% of users seek negative reviews (C21). Hide the distribution with 5 or fewer reviews (C21).
- 19% abandon over card trust (C5).
- Rating component: average at `--text-2xl` or larger in the display face, count at `--text-sm` muted, bars 4 to 8px tall, `--radius-full`, fill `--color-text` (not brand orange; the bar is data, not decoration; opinion).

## Ceiling: exemplar patterns
- **Numbers as proof.** Stripe: "99.999% average historical uptime", "100+ category leaders each process more than $1 billion per year" (C47). Linear: "Trusted by more than 40,000 companies" (C45). One number, one line, no badge art.
- **Compliance as a buyer's checklist.** Vercel lists SOC 2 Type 2, ISO 27001, PCI DSS on the pricing page because the enterprise buyer asks (C46).
- **No reviews widgets on the marketing exemplars.** Apple, Linear and Stripe sell through product and numbers; review stars belong to retail product pages (opinion from the text reads).

## Signature moves
1. **Proof with a denominator.** "4.7 from 1,284 subscriber reviews" plus a five-row distribution. The count is what convinces (C22); the distribution shows you have nothing to hide (C21).
2. **Feature the 3-star review, with the reply.** Choose a mixed review that names a real trade-off ("too bright for my moka pot") and show the roaster's one-line answer ("Try the Huila; we swapped hers"). It answers the "is it for me" doubt and shows service. Opinion built on C21.
3. **Proof made of your own data.** The coffee page's lot number, roast date and price paid per pound are proof no competitor can copy. Put one such fact next to the CTA ("Your first bag: lot 0412, roasted Tuesday").
4. **The guarantee as a sentence, not a seal.** Body type, under the button: "Not for you? Tell us within 30 days and your next bag is on us." Mechanism plus time plus who acts. No shield icon.
5. **Seal where the card is.** Give the card block its own surface (`--color-surface-sunken` or a ring), a lock icon and "Payments by [processor]. We never see your card number." (C23). Nowhere else.
6. **Quote set as type, not as a card carousel.** One quote at `--text-xl` serif italic with name, city and the variable that matters (brew method), no headshot circles, no carousel. Carousels hide proof behind a control (opinion).

## What reads as cheap (opinion, from the exemplar reads and common sense; label it so when advising)
- Rows of payment and SSL logos in the hero or nav.
- "As seen in" logo walls for press nobody can verify.
- Countdown timers, "only 3 left" on a product that is not scarce (also a dark pattern, C26).
- Five-star averages, round numbers ("10,000+ happy customers").
- Testimonials without surnames or places, stock headshots.

## Do and don't
| Do | Don't |
|---|---|
| "4.7 · 1,284 reviews" plus distribution | "★★★★★ Loved by thousands" |
| One mixed review with the reply | Only five-star quotes |
| Guarantee in body text under the CTA | Shield badge with "Guaranteed" |
| Lock and processor name on the card block | Norton and McAfee logos in the header |

## Worked example: coffee subscription
Doubt: "Will I like a new coffee every two weeks?" Proof: rating 4.7 from 1,284 subscriber reviews beside the price, distribution bars, one mixed review with the reply, guarantee sentence under the button. Placement: the band's right column, between the price block and the CTA, so the eye passes proof on the way to the button. Not used: stars on the shop cards (the cards already carry tasting notes and price; three ratings in a grid turn the shop into a marketplace; opinion).

## Verify proof before it ships (VGC homepage, 2026-10)
- **Rating and count come from the business's own structured data or the review platform on the day you build**, and the page, meta and JSON-LD say the same number. VGC's Figma said 93 reviews; the live JSON-LD said 91.
- **Review widgets show relative or shuffled dates.** Do not print a month unless the platform shows that review's date. Drop the date before you guess one.
- **A quote found only in the client's design file is unverified.** Cite it as "<name>, <client> client", list it in the ledger as "client to confirm", and never label it "Google review" until you find it there.
- **An offer amount from a design file ("financing up to $100,000") is not a fact** until the live site or the client confirms it. Cut the number, keep the offer.
- **A team line needs a count.** "The names clients mention most" was false for one of four names when a critic counted the reviews. Write what you can show: "the same names you just read in the reviews".

## Hand-offs
- Testimonial copy: design-copy (premium), copywriting (direct response). Review schema: design-search 03. Rating bars as data: dataviz rules on bar charts. Color of stars and bars: design-color (never status colors).
