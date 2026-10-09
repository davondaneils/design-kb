# Research: 02 Timing, easing and springs

Status key: C = consensus, P = practitioner opinion, S = single source.

## Durations
| Claim | Source | Status |
|---|---|---|
| General band 100 to 500 ms. Simple feedback about 100 ms; modal-size changes 200 to 300 ms; large moves on big screens up to 400 ms; about 500 ms starts to "feel like a drag". Animations are more often too long than too short. 250 vs 300 ms is a noticeable difference. | NN/g, Animation Duration | C |
| Entrances slightly longer than exits: popup 300 ms in, 200 to 250 ms out. | NN/g, same | C |
| Mobile typical 300 ms; large full-screen up to 375 ms; enter 225 ms, exit 195 ms; tablet about 30 percent longer; wearable about 30 percent shorter; desktop 150 to 200 ms. | Material Design 1, Duration and easing (m1.material.io, archived) | C (dated, still the only published device scaling) |
| Material 3 duration tokens: short1-4 = 50, 100, 150, 200; medium1-4 = 250 to 400; long1-4 = 450 to 600; extra-long1-4 = 700 to 1000 ms. Duration grows with area and traversal. | material-components-android, docs/theming/Motion.md | C |
| Carbon: fast-01 70 ms (buttons, toggles), fast-02 110 ms (fades), moderate-01 150 ms (small expansions), moderate-02 240 ms (expansions, toasts), slow-01 400 ms (large expansions), slow-02 700 ms (background dimming). | Carbon Motion overview | C |
| UI animations usually under 300 ms; a 180 ms dropdown feels more responsive than 400 ms. Button press 100 to 160 ms; tooltips 125 to 200 ms; dropdowns 150 to 250 ms; modals and drawers 200 to 500 ms. | Kowalski, articles and skill | P |
| Response time limits: 0.1 s feels instantaneous, 1 s keeps flow of thought, 10 s keeps attention. | Nielsen, Usability Engineering (1993); NN/g | C |
| INP good at or below 200 ms, poor above 500 ms. | web.dev INP | C |

## Easing
| Claim | Source | Status |
|---|---|---|
| Ease-out is the most common choice, including entrances; ease-in for exits; linear looks unnatural for moving objects; ease-in can feel sluggish. | NN/g | C |
| M3: standard (0.2,0,0,1), standard decelerate (0,0,0,1), standard accelerate (0.3,0,1,1), emphasized decelerate (0.05,0.7,0.1,1), emphasized accelerate (0.3,0,0.8,0.15), emphasized = two-segment path. | material-components-android Motion.md | C |
| M1: standard (0.4,0,0.2,1), deceleration (0,0,0.2,1), acceleration (0.4,0,1,1), sharp (0.4,0,0.6,1). | m1.material.io | C (legacy) |
| Carbon productive standard (0.2,0,0.38,0.9), entrance (0,0,0.38,0.9), exit (0.2,0,1,0.9); expressive standard (0.4,0.14,0.3,1), entrance (0,0,0.3,1), exit (0.4,0.14,1,1). | Carbon | C |
| Easing order: enter or exit ease-out; on-screen move ease-in-out; hover or color ease; constant motion linear. Strong ease-out (0.23,1,0.32,1); strong ease-in-out (0.77,0,0.175,1); drawer (0.32,0.72,0,1). "ease-in is discouraged for UI." | Kowalski skill | P |
| Shared design-kb foundation: standard (0.2,0,0,1), enter (0,0,0,1), exit (0.3,0,1,1); durations instant 0 to 100, fast 150, base 200 to 250, slow 300 to 400, page 400 to 600 ms. These equal the M3 standard set. | design-kb FOUNDATIONS v0.1 | house default |

## Springs
| Claim | Source | Status |
|---|---|---|
| M3 spring tokens (damping ratio / stiffness): fast spatial 0.9/1400, fast effects 1/3800, default spatial 0.9/700, default effects 1/1600, slow spatial 0.9/300, slow effects 1/800. Spatial = position, size, rotation, shape; effects = color, opacity (no overshoot). | material-components-android Motion.md | C |
| Apple: describe springs by damping ratio and response, not duration. "Most animations should use a damping value of 1." Demo values: drawer 0.8/0.3 s, rotation 0.8/0.4, PiP 1/0.4. Conversion (mass 1): stiffness = (2 pi / response)^2, damping coefficient = 4 pi x ratio / response. | WWDC18 "Designing Fluid Interfaces", via Nathan Gitter | C (Apple) via secondary |
| Motion (Framer Motion): `bounce` default 0.25 for duration-based springs, `visualDuration` overrides duration; setting stiffness, damping or mass overrides bounce and duration. Tween default duration 0.3 s. | motion.dev transitions docs | C |
| Apple-style spring in Motion `{type:"spring", duration:0.5, bounce:0.2}`; bounce 0.1 to 0.3 when used, avoided in most UI. | Kowalski skill | P |
| CSS `linear()` approximates springs and bounces; Baseline widely available since Dec 2023. | MDN linear() | C |
| Damping coefficient c = 2 x ratio x sqrt(stiffness x mass) (standard damped oscillator physics), used to convert M3 tokens to Motion params. | Physics identity | C |

## Sources
- https://www.nngroup.com/articles/animation-duration/
- https://m1.material.io/motion/duration-easing.html
- https://github.com/material-components/material-components-android/blob/master/docs/theming/Motion.md
- https://carbondesignsystem.com/elements/motion/overview/
- https://medium.com/@nathangitter/building-fluid-interfaces-ios-swift-9732bb934bf5 (WWDC18 session 803)
- https://motion.dev/docs/react-transitions
- https://developer.mozilla.org/en-US/docs/Web/CSS/easing-function/linear
- https://web.dev/articles/inp
- https://www.nngroup.com/videos/3-response-time-limits-interaction-design/
- https://tessl.io/registry/skills/github/emilkowalski/skill/emil-design-eng
