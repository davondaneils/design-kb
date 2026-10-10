# Review: design-motion v0.1 (critic)

Reviewed: `skills/design-motion/SKILL.md`, `references/01` to `06`, `assets/motion-tokens.css`, against `kb/research/motion/*` and the shared foundation contract (v0.1).

## Verdict
First pass: **revise** (two fundamentals misses). After fixes 1 to 9 below were applied: **approve**.

## Fundamentals gate
| Check | First pass | After fixes |
|---|---|---|
| Code correctness | Fail: dialog CSS overrode only `transition-property`, which re-mapped the `allow-discrete` list onto the wrong properties (overlay would lose allow-discrete). Hover color sat inside the reduced-motion block, so reduced-motion users lost hover feedback. | Pass |
| Accessibility | Fail: tooltip spec ignored WCAG 1.4.13; hold-to-confirm cited 2.5.1 (wrong criterion, pointer gestures) | Pass |
| Internal consistency | Fail: 02 said accelerate exits at fast or shorter while SKILL.md and the 02 worked example used a base-length drawer exit | Pass (rule now "one token shorter than entrance, never above base") |
| Foundation contract | Pass: all durations, curves and token names match; easing token names `--easing-*` chosen (contract names no easing tokens; see pipeline notes) | Pass |
| Em dashes | Pass | Pass |

## Fix list (all applied)
1. `references/06-implementation.md` and draft: rewrite the dialog CSS so each `transition` shorthand lists every property with its own `allow-discrete`; explain enter uses the `[open]` rule, exit the closed rule. Done.
2. `references/06`: move hover color outside the reduced-motion block; keep only `transform` inside `no-preference`. Comment corrected: color is low risk, not "not motion" (WCAG 2.3.3 erratum says color can count). Done.
3. `references/04`: tooltip row adds WCAG 1.4.13 (hoverable, dismissible with Esc, persistent). Done.
4. `references/04`: hold-to-confirm cites 2.1.1 Keyboard and requires a keyboard-reachable alternative plus text for remaining time. Done.
5. `references/04`: error shake was 3 cycles in under 300 ms (about 10 Hz, jittery); now 3 decaying oscillations over 300 to 400 ms, plus focus to first invalid field. Done.
6. `references/04`: toast row adds `role="status"` or `alert`. Done.
7. `references/05`: claim that the global 0.01 ms reset makes `animationend` fire "instantly and break JS" was wrong in emphasis (0.01 ms is chosen so events still fire). Rewritten to the real objection: it deletes meaningful crossfades. Done.
8. `SKILL.md` and `references/01`: "anything started from the keyboard never animates" overstated the source (Kowalski means shortcuts and keyboard navigation). Narrowed, with Enter on a button explicitly allowed. Done.
9. `references/02`: exit-easing rule made consistent (see gate). Done.

## Claims checked against research
- Material 3 durations, curves and spring tokens: match MDC Motion.md verbatim.
- Fade through 0.92 and 0.35: verified in MDC source code.
- Shared axis 30 px slide distance: not verified (source code delegates to a provider whose value was not read). Labeled opinion in 03. Keep labeled.
- Cross-document View Transitions support (Chromium 126, Safari 18.2, not Firefox): not re-verified because the shared web search budget ran out. Labeled "verify on caniuse" in 03 and research. Recheck at next review.
- UIScrollView normal deceleration 0.998: Apple page not machine readable; value is the long-standing UIKit constant. Acceptable, labeled with source.
- dotLottie "up to 80% smaller": vendor claim, labeled.

## Expert-depth test ("would the best person learn something?")
Items a strong generalist usually does not know and the skill carries: Material 3 spatial vs effects spring split; M3 spring to Motion damping conversion; fade-through 35 percent threshold; momentum projection with 0.998; velocity-first dismiss threshold; LCP exclusion of opacity 0 elements; transitions retarget while keyframes restart; `allow-discrete` list mapping trap; WCAG 2.3.3 erratum (blur counts); SSR default for reduced-motion hooks; tabular numbers for animated counts; delayed loaders. Verdict: passes. Remaining "nod along" material (use transform and opacity, respect reduced motion) is kept because it is the fundamentals gate.

## Contradictions with other skills
None found. Color values in code are marked illustrative and deferred to design-color. CTA content deferred to copywriting and sales-funnels.

---

# Review round 2: design-motion v0.2 (critic, 2026-10-10)

Reviewed: the v0.2 changes (SKILL.md, new `references/07-motion-on-real-pages.md`, `assets/motion-tokens.css`, new `assets/motion-audit.mjs`, reference 04 edits) against `kb/research/motion/*`, FOUNDATIONS v0.3 and design-foundations `references/accessibility.md`.

## Citation spot check (before step 1)
Method: every unique URL in `kb/research/motion/*.md` (53), random sample of 20 percent rounded up (11), Python `random.seed(20261010)`, `random.sample`. Each re-fetched with WebFetch on 2026-10-10.

| # | URL | Claim it supports | Result |
|---|---|---|---|
| 1 | emilkowal.ski/ui/great-animations | Transitions retarget, keyframes restart (06); compositor animations stay smooth (05) | **Partly wrong.** Transitions and smoothness confirmed verbatim. "Keyframes restart" is not on the page. |
| 2 | developer.mozilla.org/.../@starting-style | Entry from display none; Baseline Aug 2024 (06) | Confirmed verbatim |
| 3 | buildmvpfast.com/...scroll-driven... | Chrome 115, Safari 26, Firefox flag (03) | Quote confirmed, but tier 5 is the **sole** support for Safari and Firefox status: policy breach |
| 4 | cdn.jsdelivr.net/gh/kylezantos/... | Three lenses, anti-patterns, no scale(0) (01, 04) | Confirmed (tier 5, already labelled P) |
| 5 | nngroup.com/articles/animation-purpose-ux/ | Five purposes; dark pattern (01) | Confirmed verbatim |
| 6 | developer.mozilla.org/.../easing-function/linear | `linear()` approximates springs; Baseline Dec 2023 (02, 06) | **Overstated.** MDN says "approximate any curve"; it never names springs. Baseline date confirmed. |
| 7 | docs.lottiefiles.com/.../why-dotlottie | "often up to 80% smaller" (06) | Confirmed verbatim |
| 8 | github.com/material-components/material-components-android | Fade through 0.92 and 0.35 (03) | **URL imprecise**: the repository root has no motion text. Values confirmed in `MaterialFadeThrough.java` (0.92f) and `FadeThroughProvider.java` (0.35F). |
| 9 | developer.mozilla.org/.../transition-timing-function | Initial value `ease`, lists repeat (07) | Confirmed verbatim |
| 10 | w3.org/.../three-flashes-or-below-threshold | 3 flashes, 341 x 256, 87,296 px (05) | Confirmed verbatim |
| 11 | nngroup.com/videos/3-response-time-limits... | Meaning of 0.1, 1, 10 s (02) | **URL does not support the meaning**: the video page lists the limits only. Confirmed on nngroup.com/articles/response-times-3-important-limits/. |

Also found: the v0.1 research notes (01 to 06) store claims without a per-claim quote, which the source policy requires.

**Result: batch fails, sent back to the researcher.** Fixed the same day (researcher): wording of claims 1 and 6 narrowed to what the sources say, the rest marked derived; precise URLs with quotes for 8 and 11; claim 3 marked tier 5 lead, Safari and Firefox status unverified; verified quotes added to notes 01, 02, 05 and 06 under "Quotes added by the critic's spot check". SKILL.md expert move 4 re-attributed (keyframes part derived). Re-check of the five corrected entries: all now match their sources. **Open item:** about 40 v0.1 claims still have no stored quote; logged in `kb/status/motion.md` for a researcher pass before v1.0. The new note 07 has quotes for all 23 claims.

## Fundamentals gate
| Check | Result |
|---|---|
| Token names match FOUNDATIONS | **Fail in v0.1, fixed.** The skill, references, drafts and token file used `--easing-*`; FOUNDATIONS, design-frontend, design-polish and design-foundations use `--ease-*`. The FOUNDATIONS semantic tokens `--motion-{hover,enter,exit}` were never defined, and `--motion-scale` squatted on that namespace. Renamed everywhere (`--ease-*`, `--duration-multiplier`), `--motion-*` pairs defined in `assets/motion-tokens.css` and SKILL.md. This was missed by the round 1 critic ("contract names no easing tokens"), which was true of FOUNDATIONS v0.1 but not of v0.3. |
| Numbers | Durations, curves and the 600 ms marketing ceiling match FOUNDATIONS. 07's derived numbers (contour step 23 ms, marker delays 90, 318, 498 ms) re-computed from the formulas: correct. |
| Accessibility vs design-foundations | Consistent: reduce keeps fades at 150 ms or less (accessibility.md says `--duration-fast`). New 2.2.2 auto-updating rule agrees with W3C. Modality-aware dialogs keep focus moving at the start. |
| Code | `motion-audit.mjs` run on 16 scenarios; it caught two real defects in the test pages (visibility entries on `ease`; a reduced-motion double exposure), so it does what it claims. |
| Em dashes | None (grep U+2014 over skill, briefs, research, drafts, tests). |

## Contradictions
1. Reference 04 said add-to-cart labels "crossfade", and under reduce "an opacity crossfade only". The rendered test showed a crossfade double-exposes two labels in one box. Fixed in 04 (skill and draft) to fade-through.
2. Reference 04 specifies skeleton shimmer `linear` 1.5 to 2 s; the dashboard page pulsed at 1.4 s on `--ease-standard`. Page fixed to 1600 ms linear.
3. SKILL.md fundamental 6 ("never linear on an object that starts and stops") versus 07's linear time-axis reveal: clarified in the rule (a reveal edge whose x axis is time is a clock, not an object).
4. **Exemplar teardowns** (branch `claude/exemplar-library-xfa3bl`, `kb/teardowns/*.md`, measured live CSS): Linear hover color 100 ms, Vercel 100 ms, both on ease-out curves, match `--motion-hover`. Stripe reveals run 800 ms with a strong ease-out and a 1.2 s color fade; Raycast cards slide in at 700 ms. The marketing exemplars exceed the 600 ms FOUNDATIONS ceiling. Not a contradiction inside this skill, but a question for the contract: sent to `kb/reviews/design-motion-pipeline-notes.md`.

## Expert bar
New material a strong generalist would not know: WCAG 2.2.2 applying to live KPIs; linear for time-axis reveals and marker sync by multiplication; the two-transform wipe; `clip-path` digit slots instead of `overflow: hidden` under negative tracking; transition list entries silently defaulting to `ease`; fade-through also under reduce; modality-aware dialogs; freezing animations in-page with a rAF loop because a polled check misses a 100 ms transition; the lint measuring mid-entrance. Passes. "Nod along" lines kept only where they are gate items.

## Verdict
First pass: **revise** (token names, contradictions 1 to 3, citation batch). After the fixes above: **approve** for testing, with the v0.1 quote debt as an open item.
