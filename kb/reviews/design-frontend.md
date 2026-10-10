# Review: design-frontend v0.1 (critic)

Reviewed 2026-10-09 against kb/research/frontend/*, the foundation contract (kb/FOUNDATIONS.md) and the quality bar in CLAUDE.md.

## Verdict
Round 1: **revise** (3 fundamentals defects: one invalid code sample, one wrong `sizes="auto"` instruction, one unsupported statistic). Round 2 after fixes: **approve**.

## Fundamentals gate check
| Check | Round 1 | Round 2 |
|---|---|---|
| Code samples are valid and would work as pasted | Fail: Tailwind `@theme` declares `--color-bg: var(--color-bg)` (circular, resolves to invalid) | Pass |
| Facts match sources | Fail: `sizes="auto"` guidance contradicts MDN; "top six account for most errors" not in WebAIM data | Pass |
| Accessibility advice is WCAG 2.2 AA correct | Pass (verified contrast thresholds, 2.5.8 exceptions, 2.4.11, 3.3.8) | Pass |
| Foundation contract consistency (tokens, numbers, names) | Partial: raw `#fff` inside semantic tokens | Pass (white now a primitive) |
| No em dashes | Pass | Pass |

## Fix list
1. `references/06-design-to-code.md`, Tailwind block: remove `--color-bg: var(--color-bg)`. Declare the semantic colors in `@theme` directly with `light-dark()` values, so Tailwind emits them on `:root` and generates `bg-bg`, `text-text-muted` and so on. **Done.**
2. `references/05-images-fonts.md`, `sizes="auto"` bullet: rewrite per MDN. `auto` goes first, followed by a normal sizes list as fallback; only valid with `loading="lazy"`; unsupported browsers use the list. **Done.**
3. `references/03-accessibility.md`, Principle 2: WebAIM reports the share of pages with each failure, not the share of errors. Reword to "appear on the most pages". **Done.**
4. `references/02-modern-css.md`, token file: `#fff` is a raw value inside a semantic token. Add `--white` and `--black` to the primitive layer and reference them. **Done.**
5. `references/04-performance.md`: LoAF, `contain-intrinsic-size: auto` and `startTransition` were not in research. LoAF (Chrome and Edge 123+, 50ms frames, script attribution over 5ms) and `contain-intrinsic-size: auto` (Baseline widely available since September 2023) verified on Chrome for Developers and MDN and added to research 04. `startTransition` advice marked opinion. **Done.**
6. `references/02-modern-css.md`, em media queries: the claim had no source. Marked opinion and stated the reason (relative units in media queries resolve against the initial font size, so they follow the user's browser setting, not your root CSS). **Done.**
7. `references/06-design-to-code.md`, worked example 1: the radius sentence was garbled. Rewritten: concentric rule applies to flush nested shapes; a button floating inside padding uses its own token. **Done.**
8. Gap, `references/01-semantic-html.md`: no guidance for informative inline SVG (charts, logos as links). Add `role="img"` plus `aria-label` or `<title>`. **Done.**
9. Gap, `references/02-modern-css.md`: no mention of `prefers-contrast` and `prefers-reduced-transparency`. Add to the user-preference section. **Done.**
10. Conflict, Vercel guidelines prefer APCA. design-kb floor is WCAG 2.2 ratios (foundation contract). Add a one-line note in reference 02 so Claude never ships an APCA-only pass. **Done.**
11. `SKILL.md` gate item 1 omitted `<title>`. Added. **Done.**
12. `references/06-design-to-code.md`: Next.js route announcer statement marked verify (V); keep the "move focus to h1" rule as the default. **Done.**

## Critic test: would a top practitioner learn something?
Yes, on these items a strong generalist typically misses: LCP subpart diagnosis and the "late discovery, not bytes" heuristic; the 2.5x clamp rule and the vw-ignores-zoom reason; outlines vs box-shadow in forced colors plus the transparent-outline trick; the `inline-size` container collapse trap; metric-matched fallback fonts with the Android Roboto gap; `scheduler.yield` continuation priority; `sizes="auto"` fallback grammar; `scroll-padding` for 2.4.11; layer inversion for `!important`. Nodding-only lines were cut from SKILL.md (generic "optimize images" and "use semantic HTML" phrasing replaced by specific rules).

## Remaining risks (accepted for v0.1)
- Practitioner-tier X.com threads were not fetched directly (X does not fetch, and the search budget ran out). Practitioner claims come from those practitioners' own sites and are labelled.
- Legal dates (EAA, ADA Title II) are flagged V and kept out of SKILL.md.

# Round 3: design-frontend v0.2 (critic, 2026-10-10)

Scope: brief 07, research 07, draft 07, `references/07-measured-build-quality.md`, the SKILL.md changes, the reference 02 edits and the tools in `assets/`.

## Verdict
**Approve**, with the three fixes below done before the tester run.

## Citation spot check (20 percent, random)
Research 07 has 34 cited claims (C1 to C34); 20 percent is 7. Sample drawn with Python `random.seed(20261010); random.sample(range(1, 35), 7)` = C3, C9, C11, C15, C23, C24, C27. Re-fetched 2026-10-10 (MDN and web.dev through WebFetch; curl from this container got 403 on those hosts, the Lighthouse file came by curl from raw.githubusercontent.com).

| Claim | Source | Result |
|---|---|---|
| C3 mobile viewport 412x823, DPR 1.75 | lighthouse `core/config/constants.js` | match (`width: 412`, `height: 823`, `deviceScaleFactor: 1.75`) |
| C9 durationThreshold floor 16 ms | MDN PerformanceObserver.observe | match, verbatim |
| C11 LCP stops at input | web.dev/articles/lcp | match; the full sentence adds "(via a tap, scroll, or keypress)". Scroll also stops LCP: the vitals script must not scroll before LCP settles. It does not (interactions run after load). Noted in the reference. |
| C15 continuous input is not recent input | web.dev/articles/cls | match, verbatim |
| C23 unlayered beats layered | MDN @layer | match, verbatim |
| C24 important reverses layer order | MDN @layer | match ("However, the priority is reversed when the !important flag is used") |
| C27 inline-size computed in isolation | MDN container-type | match, verbatim |

7 of 7 match. No misquotes. C10 (SVG not an LCP candidate) was confirmed on the same fetch, with the nuance that `<img src="x.svg">` and `<image>` inside an SVG are candidates; added to the reference.

## Fundamentals gate check
- Correct: every rule in reference 07 is either cited (C) or measured (M) with its script; opinion is marked (font delivery rule, inline-axis logical properties, head script robustness).
- No em dashes (grep U+2014: 0).
- Consistent with FOUNDATIONS except where the skill deliberately deviates and says so: transparent dark shadows instead of `none` (deviation with a measured reason; change proposed in `kb/reviews/design-frontend-pipeline-notes.md`), and a `states` layer added to the layer order.
- Reuse: accessibility rules stay in design-foundations; image pipeline stays in reference 05.

## Fix list
1. Gate item 22 said "no sync scripts in head" while the refactored pages added an inline head script. The tester then measured that head script costing 20 to 50 ms of desktop first paint on both pages; a follow-up with seeded storage showed the end-of-body placement shifts the page (CLS up to 0.074). Final: the dashboard keeps its head script (layout state), coffee's paint-only `js` class moved to the end of body; item 22, the decision rules and expert move 10 now state that split with the numbers. **Done.**
2. Item 18 (logical properties by default) contradicted the measured UA-padding finding. Narrowed to asymmetric inline-axis values, marked opinion. Reference 02 aligned (and its container query examples moved from em to rem). **Done.**
3. Reference 07 move 1 should say SVG files in `<img>` are LCP candidates, so the rule is about inline `<svg>` only. **Done.**

## Critic test: would a top practitioner learn something?
Yes. Items a strong front-end lead is unlikely to know cold: `none` in a shadow token silently killing a composed list (and a FOUNDATIONS token doing it on both shipped pages); em in container conditions resolving to the container's font size; `:is()` lifting a type selector to class weight and breaking a later reset; `padding-inline` reviving UA button padding; hover-driven `left` counting as CLS; the rail inverting available width below a breakpoint; and a measured first-view versus repeat-view font delivery table instead of the blanket "never inline fonts". Nodding lines: the thresholds and the 14 KB rule of thumb, kept only as context for the numbers.

## Remaining risks
- Lab numbers come from one machine and Chromium 141; LCP varied about 200 ms between sessions on the same file. The reference says lab numbers are a regression check.
- Exemplar sites could not be measured (403), so no exemplar byte or font-loading baseline exists.
- The tools depend on playwright-core internals that are stable but not versioned here.
