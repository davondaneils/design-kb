# Brief: 06 Evidence and testing

**Question:** Which conversion practices are backed by what kind of evidence, and how should Claude read and cite a published A/B test or "X% lift" claim?

**Audience:** Claude when recommending, defending or questioning a conversion change; the critic when reviewing one.

**Decisions the reader must be able to make**
- Tier a claim: law and standards, large benchmarks (Baymard), lab usability (NN/g), controlled experiments at scale, case studies, opinion.
- Reject or downgrade a lift claim (sample size, power, surprise).
- Which tactics are dark patterns with legal risk, and which are honest equivalents.
- When to recommend a test vs just ship a known best practice.

**Fundamentals (gate)**
- Every claim in a hand-over is labelled evidence (with source) or opinion.
- No deceptive urgency, scarcity, sneaking or hard cancellation (FTC dark patterns report 2022; Mathur et al. 2019).

**Expert layer**
- Base rates: only about a third of ideas improve their target metric at Microsoft (Kohavi et al.).
- Twyman's law and false positive risk: at a 10% success rate, about 22% of significant results are false (Kohavi, Deng, Vermeer 2022).
- Button color tests and "300% lift" case studies are weak evidence.

**Must cover:** evidence ladder, claim table of the strongest numbers, how to read a test, dark pattern list with honest swaps, when to test.

**Out of scope or reuse:** experiment platform setup and analytics (design-search 06 for measurement basics).

**Test briefs**
1. Text: "Our agency says a red button lifted conversion 21%. Should we change ours?" Exemplar answer standard: Kohavi's papers.
2. Rendered: the coffee page's hand-over lists every conversion change with its evidence tier.

**Rubric:** each recommendation tagged with tier and source; underpowered claims called out with the reason.
