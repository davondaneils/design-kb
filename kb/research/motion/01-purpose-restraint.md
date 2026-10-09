# Research: 01 Purpose and restraint

Status key: C = consensus, P = practitioner opinion, S = single source or vendor claim.

## Key findings
| Claim | Source | Status |
|---|---|---|
| Animation serves feedback, state change, navigation metaphor, signifiers, attention. "Animation in UX must be unobtrusive, brief, and subtle." | NN/g, The Role of Animation and Motion in UX | C |
| Using motion to hijack attention or create fear of loss is a dark pattern. | NN/g, same | C |
| The more often an animation is seen, the shorter and more subtle it should be. | NN/g, Animation Duration | C |
| "Add motion purposefully." "Make motion optional." Do not rely on motion as the only carrier of information; pair with haptics or audio. | Apple HIG, Motion | C |
| "In apps, generally avoid adding motion to UI interactions that occur frequently." "Let people cancel motion... don't make people wait." | Apple HIG, Motion | C |
| Productive motion for task focus; expressive motion "sparingly for significant moments". | IBM Carbon, Motion overview | C |
| Frequency ladder: 100+ times a day = no animation; tens per day = remove or drastically reduce; occasional = standard; rare = can add delight. Keyboard-initiated actions never animate. | Emil Kowalski (Sonner, Vaul, animations.dev): "You don't need animations" and his published design-eng skill | P |
| Raycast opens with no animation; optimal for something used hundreds of times a day. | Emil Kowalski, same | P |
| Removing motion from core keyboard interactions made the product feel faster. Animation is for novel actions. | Rauno Freiberg, Invisible Details of Interaction Design | P |
| Three lenses: restraint (Kowalski), production polish (Krehel), creative play (Tompkins); pick by product context. Anti-patterns: hover-scale on everything, stagger spam, bouncy springs on utility actions, motion on mount for static content, blur-everywhere entrances. | kylezantos/design-motion-principles README (practitioner compilation) | P |

## Conflicting views
- Marketing and storytelling sites deliberately spend more motion budget (Kowalski allows longer marketing durations). Resolution: budget by context; the accessibility rules in 05 never relax.

## Sources
- https://www.nngroup.com/articles/animation-purpose-ux/
- https://www.nngroup.com/articles/animation-duration/
- https://developer.apple.com/design/human-interface-guidelines/motion
- https://carbondesignsystem.com/elements/motion/overview/
- https://emilkowal.ski/ui/you-dont-need-animations
- https://emilkowal.ski/ui/great-animations
- https://rauno.me/craft/interaction-design
- https://cdn.jsdelivr.net/gh/kylezantos/design-motion-principles@main/README.md
- Practitioner X accounts used as leads (opinion tier): @emilkowalski, @raunofreiberg, @jh3yy (Jhey Tompkins), Jakub Krehel (krehel.com). X pages do not fetch; their published sites and skills were read instead.
