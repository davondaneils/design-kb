# VGC round 3: references first, lint second

Evidence for design-director preflight section 4, items 5 and 6.

## What happened
- Round 2 of the VGC homepage directions passed `tools/check.mjs` but did not use the client's reference links, motion, component design, navbars, or type weight and tracking. Davon's review: "its like you're not trying." He asked for Awwwards-level work, conversion triggers and tasteful GSAP motion with custom pieces.
- Round 3 measured nine reference sites with `kb/teardowns/measure.mjs` and seven Awwwards winners with a GSAP tween hook (for example Montarville headline lines yPercent 110 to 0, 1.2s, expo.out; MERSI clip reveals 1.2s, power4.inOut; Studio X parallax yPercent -20 to 0, scrub 2). It wrote a spec from those numbers, shared it, then built.

## Lessons (opinion, from this job)
- Measure the references before deciding type, buttons, nav or motion. The spec is the proof that they were used.
- Clip-path reveals from the references can be rebuilt with transforms only: the frame moves one way while the image inside counter-moves the same amount. It looks the same and passes design-motion's property rule.
- GSAP motion needs filming with Playwright, because `motion-audit.mjs` sees Web Animations only.
- In a scrubbed GSAP timeline, prefer `fromTo()`. A staggered `from()` stayed at its start state after a scroll jump.
- A line splitter should keep the real words in the lines. A hidden duplicate copy doubled the character count the measure lint reads, and `aria-label` is not allowed on a `p`.
