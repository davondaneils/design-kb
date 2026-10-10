# Front-end build and accessibility
Where to go deeper on HTML, CSS, design engineering and accessibility. Standards first (MDN, WCAG, APG), then the few practitioners whose books, courses and shipped components prove the craft.

## Start here
- **WCAG 2.2 with the WAI Understanding docs**: the legal and technical floor; every accessibility rule in this KB traces back to it (opinion on order, fact on status).
- **Every Layout**: the best way to learn layout that works without breakpoint hacks (opinion).
- **Practical Accessibility (Sara Soueidan)**: the most complete course on how HTML, ARIA and CSS reach assistive technology (opinion).

## Entries

### MDN Web Docs (docs)
- **Who / what:** Mozilla's reference for HTML, CSS, JavaScript and Web APIs, plus a structured Learn web development curriculum.
- **Best for:** exact element, attribute and property behavior, with browser compatibility tables.
- **Why it meets the bar:** the standard reference named in the source policy; already used in kb/research/frontend (01, 02, 05).
- **Link:** https://developer.mozilla.org/
- **Tier:** 1
- **Checked:** fetched Learn web development page (updated 2026-10-10). Accessed 2026-10-10.

### WCAG 2.2 and WAI supporting docs (docs)
- **Who / what:** The W3C Recommendation for web accessibility, with Understanding pages and the How to Meet quick reference.
- **Best for:** what a success criterion actually requires (target size 24 by 24 CSS px, focus not obscured, accessible authentication) and its exceptions.
- **Why it meets the bar:** W3C Recommendation, published 12 December 2024 edition; W3C recommends adopting 2.2 even where policy names older versions. Already used in kb/research/frontend/03-accessibility.md.
- **Link:** https://www.w3.org/TR/WCAG22/ and https://www.w3.org/WAI/WCAG22/quickref/
- **Tier:** 1
- **Checked:** fetched the Recommendation's status section and comparison with 2.1 (4.1.1 Parsing removed). Accessed 2026-10-10.

### ARIA Authoring Practices Guide (APG) (docs)
- **Who / what:** W3C WAI guide to applying ARIA roles, states and keyboard support to common widgets, with working examples.
- **Best for:** keyboard behavior and naming for custom widgets (tabs, combobox, menu button, dialog) when no native element fits.
- **Why it meets the bar:** maintained by the W3C APG Task Force. Caution: it shows patterns, not production components; native HTML first (Using ARIA rule 1). Vercel's guidelines point to it for keyboard behavior.
- **Link:** https://www.w3.org/WAI/ARIA/apg/
- **Tier:** 1
- **Checked:** fetched APG home (patterns, landmarks, names and descriptions). Accessed 2026-10-10.

### web.dev and Baseline (docs)
- **Who / what:** Chrome team's guidance site; Baseline marks which web features work across all major browsers, now defined by the WebDX Community Group.
- **Best for:** deciding whether a CSS or HTML feature is safe to ship today; Core Web Vitals guidance; the Learn CSS course.
- **Why it meets the bar:** official vendor docs; Baseline is now cross-vendor. Already used in kb/research/frontend (01, 02, 04, 05). Note it is written by the Chrome team, so check Safari and Firefox status on MDN when it matters.
- **Link:** https://web.dev/baseline
- **Tier:** 1
- **Checked:** fetched Baseline page (who defines it, monthly digest, Browserslist support). Accessed 2026-10-10.

### Every Layout, by Heydon Pickering and Andy Bell (book)
- **Who / what:** A book and site of 12 composable layout primitives (Stack, Cluster, Sidebar, Switcher and more) built on intrinsic CSS, with generators and custom elements.
- **Best for:** layouts that adapt without media query breakpoints or magic numbers.
- **Why it meets the bar:** third edition; used by the BBC design system per a BBC engineer's testimonial on the site; Andy Bell wrote most of web.dev's Learn CSS. Opinion: the most important CSS layout text since flexbox and grid landed.
- **Link:** https://every-layout.dev/ (free rudiments: https://every-layout.dev/rudiments/boxes/)
- **Tier:** 3
- **Checked:** fetched home page (edition, authors, contents, price 69 USD). Accessed 2026-10-10.

### Inclusive Components, by Heydon Pickering (book)
- **Who / what:** A blog turned book that builds common components accessibly, one at a time: toggles, menus, tooltips and toggletips, tabs, cards, data tables, notifications.
- **Best for:** the reasoning behind accessible versions of the components every site uses.
- **Why it meets the bar:** each chapter shows the markup, the screen reader behavior and the tradeoffs; the book has updated content and demos. Opinion: still the best component-by-component accessibility text, though the blog posts date from 2017 and 2018, so check newer HTML (dialog, popover) on MDN.
- **Link:** https://inclusive-components.design/ (book: http://book.inclusive-components.design/)
- **Tier:** 3
- **Checked:** fetched index (component list and dates). Accessed 2026-10-10.

### Practical Accessibility, by Sara Soueidan (course)
- **Who / what:** A self-paced course (15+ hours of captioned video plus full text) on how accessibility works under the hood: accessibility tree, ARIA, forced colors mode, testing.
- **Best for:** building a mental model of how code reaches assistive technology, then debugging with DevTools.
- **Why it meets the bar:** eligible for IAAP education credits; recommended by Brad Frost on the course page; her focus indicator guide is already used in kb/research/frontend/03-accessibility.md. Opinion: the best accessibility course for designers and front-end developers.
- **Link:** https://practical-accessibility.today/ and https://www.sarasoueidan.com/ (X: https://x.com/SaraSoueidan, lead only, tier 5; her X profile now points to Bluesky)
- **Tier:** 4
- **Checked:** fetched course page (curriculum, hours, IAAP credits); sarasoueidan.com social links. Accessed 2026-10-10.

### Adrian Roselli (practitioner)
- **Who / what:** Accessibility consultant, writer and W3C contributor who tests patterns across browsers and screen readers.
- **Best for:** whether a specific pattern actually works (dialog close on outside click, link plus popover navigation, table headers support, aria-label translation).
- **Why it meets the bar:** publishes test results, keeps old posts updated with dated notes, and explains WCAG evaluation; his responsive type and zoom post is already used in kb/research/frontend/02-modern-css.md. Opinion: the most rigorous single voice on what really works.
- **Link:** https://adrianroselli.com/
- **Tier:** 4
- **Checked:** fetched home page (posts from June to September 2026, contributions to W3C). Accessed 2026-10-10.

### Josh W. Comeau, CSS for JavaScript Developers (course)
- **Who / what:** An interactive CSS course plus a blog of deep, illustrated CSS articles (subgrid, anchor positioning, linear() easing, the modern CSS reset).
- **Best for:** developers who write components but find CSS unpredictable; understanding layout algorithms rather than memorizing properties.
- **Why it meets the bar:** his CSS reset is already used in kb/research/frontend (02, 06); interactive demos teach the mental model. Opinion: the best paid CSS course.
- **Link:** https://css-for-js.dev/ and https://www.joshwcomeau.com/ (X: https://x.com/JoshWComeau, lead only, tier 5)
- **Tier:** 4
- **Checked:** fetched course page and blog home (recent article topics). Accessed 2026-10-10.

### Web Interface Guidelines (Vercel) (docs)
- **Who / what:** Vercel's checklist of interface details for the web; started by Rauno Freiberg. Full entry in 00-general.md.
- **Best for:** a pre-ship pass on keyboard support, focus, hit targets, motion and forms.
- **Why it meets the bar:** used in every kb/research/frontend note; links rules to APG and MDN. Note it prefers APCA over WCAG 2 contrast; this KB keeps WCAG 2.2 as the floor.
- **Link:** https://vercel.com/design/guidelines
- **Tier:** 4
- **Checked:** fetched page (Interactions, Animations, Layout, Design sections). Accessed 2026-10-10.

## Considered and dropped
- **Accessibility overlays** (for example accessiBe): an open fact sheet signed by hundreds of practitioners, including the chair of the W3C APG Task Force, documents that overlays do not deliver compliance and can make sites harder to use. Never recommend them. Source: https://overlayfactsheet.com/ (accessed 2026-10-10).
- **WebAIM:** valuable (contrast checker, WebAIM Million data already used in 03-accessibility.md), but a tool and data source rather than a learning path; use it from the research notes.
- **CSS-Tricks, Kevin Powell, Una Kravets, Jhey Tompkins, Adam Argyle:** good leads (named in kb/research/frontend/06-design-to-code.md) but they overlap Josh Comeau and web.dev; not verified further this session.
- **Automated checkers alone (Lighthouse, axe):** necessary but they catch only part of the issues; the KB requires manual testing, so they are tools, not references.
- **Heydon Pickering and Andy Bell on X:** both are best followed through their sites and books; X handles were not verified this session.
