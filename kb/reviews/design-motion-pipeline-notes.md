# design-motion: suggested changes to shared files

From the motion wave (2026-10-10, branch `wave/motion`). These files are outside the motion domain, so nothing here was edited; each item names the owner.

## tools/lint.mjs (owner: editor-in-chief)
1. **The `motion` check only proves a reduce rule exists.** It passes a page whose animations run 1800 ms on `ease`. Suggest folding the core of `skills/design-motion/assets/motion-audit.mjs` into the lint: read `document.getAnimations()` after a probe interaction set (hover the first card, click the first button) and fail any duration off the token set (100, 150, 200, 250, 300, 400, 500, 600 ms; loops exempt), any curve off the three tokens or `linear`, and any animated `box-shadow`, `width`, `height`, `top`, `left`, `margin`, `padding`, `filter` or `clip-path`.
2. **The reduce probe fails any animation over 100 ms, including opacity-only ones.** FOUNDATIONS item 10 says reduce "removes the movement", and design-foundations `accessibility.md` says reduce keeps opacity fades at `--duration-fast` (150 ms). An opacity keyframe animation of 150 ms under reduce would fail the lint while following the accessibility reference. Suggest: fail only animations whose keyframes change a transform-family property (or `translate`, `scale`, `rotate`), warn on other animations over 150 ms. Same rule as the audit.
3. **The lint measures during entrance transitions.** With `?open=sheet` it measured a 24 px switch at 23 px (the dialog was at scale 0.96, 100 ms into a 200 ms entrance). Suggest waiting for `Promise.all(document.getAnimations().filter(a => isFinite(a.effect.getComputedTiming().endTime)).map(a => a.finished))` (with a 2 s cap) before every measurement. The test page works around it by opening review states without their entrance.
4. **Screenshots are motion-blind by design.** `render.mjs` uses `reducedMotion: 'reduce'`, which is right for end states, but it means no rendered artifact ever shows the no-preference path. Suggest the director's loop require a motion strip for every page that moves (below).

## design-director (owner: editor-in-chief)
5. Section 5, add a step after Render: "**Film motion.** If anything on the page moves, write one scenario per user action and run `node skills/design-motion/assets/motion-audit.mjs <scenarios.mjs> <outdir>`; look at both rows of every strip. Keyboard paths get `expect: 'none'`." Section 4 build rules: "Scripts read motion tokens from CSS; no millisecond literals in JS."
6. Playbook-landing step 8 loads design-motion 01 and 04 only. The chart reveal and contour rise needed 03 (reveals, LCP) and 07 (data motion). Suggest: `01`, `04`, and `07` when the page shows data or a drawing that could reveal.
7. Playbook-dashboard step 9 loads 04 only. Live numbers and the palette rule need 07. Suggest `04` and `07`.

## kb/FOUNDATIONS.md (owner: editor-in-chief)
8. **Define the `--motion-*` values.** The schema names `--motion-{hover,enter,exit}` but gives no values; design-motion v0.2 uses `--motion-hover: var(--duration-instant) var(--ease-standard)`, `--motion-enter: var(--duration-base) var(--ease-enter)`, `--motion-exit: var(--duration-fast) var(--ease-exit)` (duration plus curve, for transition shorthands). Suggest adopting these in the Motion section.
9. **Say that `linear` is allowed** for loops, scroll-linked motion and time-axis reveals; the contract lists three curves only, so a strict reader fails `linear`.
10. **The 600 ms page ceiling versus measured exemplars.** The exemplar teardowns (`kb/teardowns/*.md` on `claude/exemplar-library-xfa3bl`) measured Stripe reveals at 800 ms with a strong ease-out (and a 1.2 s heading color fade) and Raycast card slides at 700 ms. Linear and Vercel hover colors are 100 ms, inside the contract. Opinion: keep 600 ms for anything a person triggers, and allow one below-the-fold marketing reveal per section up to 800 ms. The editor decides; v0.2 of the skill stays at 600.
11. Checklist item 10 could add "keyboard shortcuts do not animate" as a judged line: it is the most common motion failure on product UI and it is testable (the audit's `expect: 'none'`).

## design-foundations references/accessibility.md (owner: librarian, mirror)
12. Add under "Motion and reduced motion": WCAG 2.2.2 also covers **auto-updating** content (a live KPI or ticker beside other content needs pause, stop, hide or a frequency control). Source: W3C Understanding 2.2.2, quoted in `kb/research/motion/07-motion-on-real-pages.md`.

## Tester method (owner: editor-in-chief, `.claude/agents/tester.md`)
13. Step 4 ("Render") could add: "for pages that move, film each animation with design-motion's `motion-audit.mjs` and judge the strips; screenshots show end states only."
14. Exemplar motion should be measured, not recalled: the teardowns already record transition values; a `motion-audit.mjs` run pointed at the live exemplar URLs (hover a link, open a menu) would give filmed strips to compare side by side.

## Research debt (owner: researcher)
15. v0.1 motion research notes (01 to 06) store about 40 claims without a per-claim quote. The critic's spot check added quotes for 11; the rest need a pass before v1.0.
