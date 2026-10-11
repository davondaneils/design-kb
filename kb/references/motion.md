# UI motion and interaction craft
Where to go deeper on when to animate, timing and easing, gestures, and reduced motion. Read Emil Kowalski's "You Don't Need Animations" and Apple's Designing Fluid Interfaces first; use NN/g and Material for numbers.

## Start here
- **Emil Kowalski, "You Don't Need Animations" and animations.dev:** the best rules for when not to animate and how to make the rest feel right on the web. Opinion.
- **Apple WWDC18, Designing Fluid Interfaces:** the clearest talk on why motion should respond instantly, be interruptible and follow the finger. Opinion.
- **NN/g, Executing UX Animations: Duration and Motion Characteristics:** the evidence-based duration and easing defaults. Opinion.

## Entries

### Emil Kowalski (practitioner, course)
- **Who / what:** design engineer on the Web team at Linear, previously on the design team at Vercel; author of the Sonner (toast) and Vaul (drawer) React libraries and the animations.dev course.
- **Best for:** web UI animation decisions: what to animate, ease-out for entrances, short durations, springs, clip-path, and when to cut an animation entirely.
- **Why it meets the bar:** his libraries are open source and inspectable; animations.dev says they are downloaded over 90 million times per week. emilkowal.ski is on the exemplar list (kb/exemplars.md, #22) and Linear is #1 and #13. Matt Perry (creator of Motion) endorses the course on its page. Already used in kb/research/motion/01, 02, 04.
- **Link:** https://emilkowal.ski ; https://emilkowal.ski/ui/you-dont-need-animations ; https://animations.dev ; his agent skill: https://emilkowal.ski/skill (X: https://x.com/emilkowalski, lead only, tier 5)
- **Tier:** 2 (exemplar, when measured); 4 otherwise
- **Checked:** home page (current role at Linear), essay, course page, Sonner and Vaul sites, GitHub profile linking @emilkowalski. The old handle @emilkowalski_ in kb/research/ux/01 and 06 was corrected to @emilkowalski on 2026-10-10. Accessed 2026-10-10.

### Rauno Freiberg (practitioner, essay, course)
- **Who / what:** Estonian interaction designer, Staff Design Engineer at Vercel, previously at The Browser Company on Arc; author of the cmdk command menu library and Devouring Details.
- **Best for:** the feel of interactions: gesture metaphors, interruptible motion, inferring intent, motion choreography, simulated physics.
- **Why it meets the bar:** the essay "Invisible Details of Interaction Design" (July 2023) is, in our opinion, the best short essay on the topic; Devouring Details is an interactive manual of 23 chapters with 23 downloadable React components; rauno.me is on the exemplar list (#21) and his Craft page has dozens of working prototypes. Already used in kb/research/motion/01 and 04.
- **Link:** https://rauno.me/craft/interaction-design ; https://devouringdetails.com ; https://rauno.me/craft (X: https://x.com/raunofreiberg, lead only, tier 5)
- **Tier:** 2 (exemplar, when measured); 4 otherwise
- **Checked:** essay page, Craft index, Devouring Details home and author bio, raunofreiberg.com. Accessed 2026-10-10.

### Designing Fluid Interfaces, WWDC18 session 803 (talk) and Apple HIG Motion (docs)
- **Who / what:** 64-minute Apple talk by Chan Karunamuni, Nathan de Vries and Marcos Alonso of the Human Interface team on the iPhone X gesture system; plus Apple's current motion guidelines.
- **Best for:** gesture-driven motion: respond instantly, allow redirection mid-animation, keep spatial consistency, hint in the direction of the gesture, use velocity, prefer behavior (springs) over fixed animations.
- **Why it meets the bar:** first-party account of how a shipped, celebrated interaction system was designed; slides and transcript are public. Used in kb/research/motion/02 and 04.
- **Link:** https://developer.apple.com/videos/play/wwdc2018/803/ ; https://developer.apple.com/design/human-interface-guidelines/motion
- **Tier:** 1
- **Checked:** video page with transcript, slide PDF outline, HIG Motion page. Accessed 2026-10-10.

### Material Design 3 motion (docs)
- **Who / what:** Google's motion system: the new spring-based "motion physics system" (introduced with M3 Expressive, May 2025) and the legacy easing and duration tokens.
- **Best for:** numbers to start from. Legacy pairs: emphasized 500ms, emphasized decelerate 400ms to enter, emphasized accelerate 200ms to exit, standard 300ms; duration tokens run 50ms to 1000ms. Spring tokens give damping and stiffness per speed.
- **Why it meets the bar:** official platform standard with published tokens; it also states that easing and duration is now legacy and no longer maintained, which matters for anything citing it.
- **Link:** https://m3.material.io/styles/motion/overview/how-it-works ; https://m3.material.io/styles/motion/easing-and-duration
- **Tier:** 1
- **Checked:** both pages and the tokens and specs page. Accessed 2026-10-10. kb/research/motion/02 now cites M3 and marks its m1.material.io rows outdated (fixed 2026-10-10).

### NN/g on animation (research articles)
- **Who / what:** Nielsen Norman Group articles, chiefly Page Laubheimer's "Executing UX Animations: Duration and Motion Characteristics" (2020).
- **Best for:** defaults: most UI animation 100 to 500ms, simple feedback about 100ms, 100 to 400ms for most cases, entrances slightly longer than exits, ease-out for most motion.
- **Why it meets the bar:** grounded in NN/g's response-time research and cites Val Head's book. Used in kb/research/motion/01, 02 and 04.
- **Link:** https://www.nngroup.com/articles/animation-duration/
- **Tier:** 3
- **Checked:** fetched the duration article and confirmed the ranges above. Accessed 2026-10-10.

### Designing Interface Animation (book)
- **Who / what:** Val Head; Rosenfeld Media, July 2016, 240 pages.
- **Best for:** planning motion for a product: purposes (feedback, orientation, attention, causality, brand), motion style guides, and how Disney's principles map to UI.
- **Why it meets the bar:** the standard book on interface animation, cited by NN/g; Head also wrote the A List Apart and Smashing articles on reduced motion that kb/research/motion/05 uses. Opinion: older on implementation, still right on purpose.
- **Link:** https://rosenfeldmedia.com/books/designing-interface-animation
- **Tier:** 3
- **Checked:** publisher page (ISBN 978-1933820-32-3), Smashing author page, valhead.com. Accessed 2026-10-10.

### The Illusion of Life: Disney Animation (book)
- **Who / what:** Frank Thomas and Ollie Johnston, Disney animators; source of the 12 principles of animation (Hyperion edition 1995, first published in the early 1980s).
- **Best for:** the fundamentals beneath UI motion: timing, slow in and slow out, anticipation, follow-through, arcs, staging.
- **Why it meets the bar:** the original source that UI motion writing (including Head's book) builds on. Opinion: read the principles chapter; skip the studio history unless curious.
- **Link:** https://openlibrary.org/books/OL787141M/The_illusion_of_life
- **Tier:** 3
- **Checked:** Open Library record (Hyperion 1995, ISBN 0786860707) and Head's book quoting its 12 principles. Accessed 2026-10-10. The Open Library record lists the first author oddly as "Frank Thomas Bullen"; the author is Frank Thomas.

### Reduced motion: WCAG 2.3.3 and MDN prefers-reduced-motion (docs)
- **Who / what:** W3C's Understanding page for Success Criterion 2.3.3 Animation from Interactions (Level AAA) and MDN's reference for the prefers-reduced-motion media feature.
- **Best for:** the rule and the code: let people turn off non-essential motion, swap scaling and panning for fades, and know where users set the preference on each OS.
- **Why it meets the bar:** the accessibility standard and the canonical web reference. Used in kb/research/motion/05.
- **Link:** https://www.w3.org/WAI/WCAG22/Understanding/animation-from-interactions.html ; https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion
- **Tier:** 1
- **Checked:** both pages, including techniques C39 and SCR40. Accessed 2026-10-10.

### Motion (formerly Framer Motion) (tool, docs)
- **Who / what:** animation library for React, JavaScript and Vue by Matt Perry; docs cover springs, layout animations, gestures and accessibility.
- **Best for:** implementing springs, shared layout transitions and gesture-driven motion on the web, with reduced-motion support built in.
- **Why it meets the bar:** powers animations across hundreds of thousands of Framer sites per its site; framer.com is exemplar #6. Used in kb/research/motion/02, 05 and 06.
- **Link:** https://motion.dev/
- **Tier:** 4 (practitioner tool docs)
- **Checked:** home page (Motion Studio announced 22 Sep 2026). Accessed 2026-10-10.

## Considered and dropped
- **Dan Saffer, Microinteractions (O'Reilly 2013):** cited in kb/research/motion/04 but not re-verified this session; strong on triggers, rules and feedback, weaker on motion itself.
- **Issara Willenskomer, UX in Motion:** well known, not verified this session.
- **Jhey Tompkins and Jakub Krehel:** named as leads in kb/research/motion/01; not verified this session, so left out.
- **kylezantos/design-motion-principles (GitHub):** a compilation of others' rules; tier 5.
- **Disney's 12 principles as blog listicles:** duplicates of The Illusion of Life; go to the source.
- **Material 1 motion page (m1.material.io):** superseded and marked unmaintained; use M3.
