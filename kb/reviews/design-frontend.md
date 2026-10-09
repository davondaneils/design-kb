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
