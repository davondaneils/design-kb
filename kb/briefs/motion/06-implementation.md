# Brief: 06 Implementation: CSS, Web Animations, Motion, Lottie

**Question it answers:** Which tool for which job, and what is the correct code shape?

**After reading, a designer or engineer can decide:** CSS transition vs keyframes vs WAAPI vs Motion (Framer Motion) vs Lottie vs View Transitions; how to wire tokens; how to make every path honor reduced motion.

**Must cover:** transitions retarget, keyframes restart; `@starting-style` and `allow-discrete` (Baseline Aug 2024); `interpolate-size` limited support; WAAPI control and `commitStyles`; Motion springs, `layout`, `layoutId`, `AnimatePresence`, `MotionConfig reducedMotion="user"`; main-thread caveat for JS animation; Lottie renderer, dotLottie, offscreen pause, static frame for reduced motion.

**Test briefs:** implement a dialog enter and exit with no JS; a React list with shared-element expand.

**Hand-offs:** design-frontend (build, bundle size).
