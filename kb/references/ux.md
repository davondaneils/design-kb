# UX and interaction design
Where to go deeper on usability, interaction patterns and product UI (forms, navigation, tables, states). Read Krug and Norman for the fundamentals, then use NN/g, Baymard and GOV.UK for evidence on a specific decision.

## Start here
- **Don't Make Me Think, Revisited (Krug):** short, and it teaches the habit that matters most: watch people use the thing. Opinion.
- **The Design of Everyday Things (Norman):** the vocabulary (signifiers, mapping, feedback, constraints, error types) behind every usability judgment. Opinion.
- **Nielsen Norman Group articles:** the fastest research-backed answer to "what does the evidence say about X". Opinion.

## Entries

### The Design of Everyday Things, revised and expanded edition (book)
- **Who / what:** Don Norman; Basic Books, 2013, 368 pages.
- **Best for:** naming why an interface fails: hidden or ambiguous controls, poor mapping, missing feedback, slips versus mistakes.
- **Why it meets the bar:** the founding text of the field; the 2013 revision added signifiers and two new chapters. Norman is founding director of the UC San Diego Design Lab and a former Apple VP, per the publisher. Opinion: required reading.
- **Link:** https://www.basicbooks.com/titles/don-norman/the-design-of-everyday-things/9780465050659 ; author notes: https://jnd.org/books/the-design-of-everyday-things-revised-and-expanded-edition
- **Tier:** 3
- **Checked:** Hachette/Basic Books page (Nov 5, 2013, ISBN 9780465050659), jnd.org page on what changed, MIT Press UK edition. Accessed 2026-10-10.

### Don't Make Me Think, Revisited, 3rd edition (book)
- **Who / what:** Steve Krug; New Riders, 2014 (published Dec 2013), 216 pages.
- **Best for:** page-level usability: scanning versus reading, clear labels, navigation and "where am I", cheap do-it-yourself usability tests.
- **Why it meets the bar:** the most recommended usability primer; the third edition added a mobile chapter. Opinion: an afternoon read that changes how you review any screen.
- **Link:** https://sensible.com/dont-make-me-think
- **Tier:** 3
- **Checked:** Peachpit product page (3rd ed., ISBN 978-0-321-96551-6), Krug's own site, Pearson sample pages. Accessed 2026-10-10.

### Nielsen Norman Group (research org, articles and courses)
- **Who / what:** UX research and training firm founded by Jakob Nielsen and Don Norman; free article library.
- **Best for:** evidence on a single pattern: the 10 heuristics, response-time limits, hamburger menus, data tables, error messages, empty states, skeleton screens, animation duration.
- **Why it meets the bar:** findings come from many studies across countries and user groups (NN/g reports 2,048 users tested one on one across 1,524 sites in 14 countries). The KB's ux, product-ui and motion research already cites it more than any other source.
- **Link:** https://www.nngroup.com/articles/ (start with https://www.nngroup.com/articles/ten-usability-heuristics/)
- **Tier:** 3
- **Checked:** articles index and the "UX evidence" article with the testing figures. Accessed 2026-10-10. Jakob Nielsen now writes separately at https://jakobnielsenphd.substack.com (verified; opinion, tier 5).

### Baymard Institute (research)
- **Who / what:** large-scale ecommerce UX research: moderated usability testing plus eye-tracking and benchmarks, distilled into guidelines (most behind a paywall).
- **Best for:** checkout, forms, product pages, search, filtering, accounts; numbers such as cart abandonment and form field counts.
- **Why it meets the bar:** methodology page states 4,400+ moderated test sessions, 34,000+ usability issues and 819 guidelines from 200,000+ hours of research. Used in kb/research/ux/03-forms.md and 05-onboarding.md. Opinion: the strongest evidence for any commerce flow.
- **Link:** https://baymard.com/research/methodology ; free articles: https://baymard.com/blog
- **Tier:** 3
- **Checked:** methodology and guidelines product pages. Accessed 2026-10-10. Relevant to conversion work too; Davon's sales-funnels skill covers offers, not form usability.

### GOV.UK Design System and Service Manual (docs)
- **Who / what:** the UK government's open design system (styles, components, patterns with coded examples) and its service design manual.
- **Best for:** forms done right: question pages, error summary, check-your-answers, names, dates, addresses, one thing per page.
- **Why it meets the bar:** the Service Manual calls patterns "evidence-based solutions", built on research from teams across government, and teams that adapt one must contribute their findings back; the code is MIT licensed. Used in kb/research/ux/03-forms.md. Opinion: the best free form guidance anywhere.
- **Link:** https://design-system.service.gov.uk/patterns/ ; https://www.gov.uk/service-manual/design
- **Tier:** 1 (official government standard)
- **Checked:** Design System home, patterns and components pages (GOV.UK Frontend v6.5.0 released 27 Aug 2026), Service Manual "Using, adapting and creating patterns". Accessed 2026-10-10.

### Apple Human Interface Guidelines and Material Design 3 (docs)
- **Who / what:** the platform design standards for Apple platforms and for Android and Google products.
- **Best for:** native conventions people already know: tab bars, navigation, alerts, sheets, touch targets, onboarding, privacy prompts, adaptive layouts.
- **Why it meets the bar:** these are the platform owners' own rules; breaking them costs familiarity. Used throughout kb/research/ux/.
- **Link:** https://developer.apple.com/design/human-interface-guidelines ; https://m3.material.io/
- **Tier:** 1
- **Checked:** HIG foundations navigation and Material 3 home (now M3 Expressive). Accessed 2026-10-10.

### Designing Interfaces, 3rd edition (book)
- **Who / what:** Jenifer Tidwell, Charles Brewer and Aynne Valencia; O'Reilly, Dec 2019 (dated 2020), about 600 pages of interaction patterns.
- **Best for:** product UI structure: information architecture, navigation, lists of things, forms and controls, data display, with named patterns to reuse.
- **Why it meets the bar:** Tidwell has researched interface patterns since 1997; this is the standard patterns catalog, updated for mobile and systems. Opinion: the best book for product UI, which kb/research/product-ui/ otherwise sources from design system docs.
- **Link:** https://www.oreilly.com/library/view/designing-interfaces-3rd/9781492051954
- **Tier:** 3
- **Checked:** O'Reilly catalog page and chapter list (Ch. 2 information architecture, Ch. 7 lists of things); Google Books record. Accessed 2026-10-10.

### Enterprise design systems: Carbon (IBM), Polaris (Shopify), Primer (GitHub) (docs)
- **Who / what:** public design systems with detailed usage guidance for dense product UI.
- **Best for:** data tables and admin screens: row sizes, toolbar and batch actions, inline versus overflow row actions, numeric alignment, pagination thresholds, loading states.
- **Why it meets the bar:** each documents components that ship in large products used daily (IBM Cloud, Shopify admin, GitHub). Concrete examples: Carbon keeps fewer than three row actions inline as icon buttons; Polaris paginates past 50 items and right-aligns numbers; Primer pulls out at most one row action. Used heavily in kb/research/product-ui/01-tables.md.
- **Link:** https://carbondesignsystem.com/components/data-table/usage/ ; https://polaris-react.shopify.com/components/tables/index-table ; https://primer.style/product/components/data-table/
- **Tier:** 2 in the KB's research notes (official docs of shipped products)
- **Checked:** fetched all three table pages and confirmed the rules quoted above. Accessed 2026-10-10.

### Vercel Web Interface Guidelines (docs, practitioner)
- **Who / what:** a living checklist of web interface details (keyboard, focus, hit targets, forms, loading states, numbers, motion), published by Vercel and open on GitHub.
- **Best for:** a final pass on a built page: focus rings, 24px minimum hit targets (44px on mobile), 16px mobile input text, tabular numbers.
- **Why it meets the bar:** written by the team behind an exemplar product (Vercel is #3 and #15 in kb/exemplars.md) and checkable in code. It separates universal rules from Vercel brand preferences. Used across kb/research/ux/. Opinion: the best craft checklist for the web.
- **Link:** https://vercel.com/design/guidelines ; https://github.com/vercel-labs/web-interface-guidelines
- **Tier:** 4 (practitioner), per the KB's research notes
- **Checked:** fetched the page and repo. The repo thanks reviewers but does not name the authors; kb/research credits Rauno Freiberg and Paco Coursey, which was not confirmed this session. Accessed 2026-10-10.

### Mobbin (gallery)
- **Who / what:** searchable library of screens and multi-step flows from shipped mobile apps, web apps and websites (about 621,500 screens per its site); full access is paid.
- **Best for:** seeing how real products handle onboarding, checkout, paywalls, settings, empty states and tables before designing one.
- **Why it meets the bar:** references come from shipped products, not concept shots, and include whole flows. A Mobbin connector is available in this environment. Opinion: the best pattern gallery; still evidence of practice, not of usability.
- **Link:** https://mobbin.com/
- **Tier:** 4 (inspectable shipped work)
- **Checked:** fetched the home page description and plan list. Accessed 2026-10-10.

## Considered and dropped
- **About Face, 4th edition (Cooper and others, Wiley 2014):** verified and canonical for goal-directed design, but 720 pages and older than Designing Interfaces for patterns.
- **Laws of UX (Jon Yablonski; site plus O'Reilly book, 2nd ed. 2024):** verified; a handy summary of psychology principles but a secondary source. Cite the original research or NN/g instead.
- **Form Design Patterns (Adam Silver, Smashing):** verified; strong, but GOV.UK covers the same ground with public research.
- **Jakob Nielsen's Substack:** verified; mostly opinion and AI commentary now; NN/g articles are the evidence.
- **Generic UX bootcamp blogs and Medium summaries:** recycled content, tier 5, dropped.
- **UX writing:** belongs in copy.md; not duplicated here.
