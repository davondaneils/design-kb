# Layout
Where to go deeper on layout: grids, spacing, visual hierarchy and responsive composition. Read the NN/g hierarchy article first (what layout is for), then Every Layout (how to build layouts that adapt without breakpoint soup), then Müller-Brockmann (where grid thinking comes from).

## Start here
- **NN/g, "Visual Hierarchy in UX: Definition":** three levers (contrast, scale, grouping) with concrete limits, in eight minutes (opinion).
- **Every Layout, Heydon Pickering and Andy Bell:** a small set of composable layout primitives that replace most hand-made responsive layouts (opinion).
- **Josef Müller-Brockmann, Grid Systems in Graphic Design:** the source text for modular grids; read it to understand why grids work, not to copy print grids to screens (opinion).

## Entries

### Grid Systems in Graphic Design, Josef Müller-Brockmann (book)
- **Who / what:** Swiss designer and teacher's step-by-step manual for building typographic grids (8 to 32 fields) for print, identity and exhibitions; Niggli, first published 1981, bilingual German and English, 176 pages.
- **Best for:** the logic of grids: deriving column width, leading, margins and fields from the type, and the rule that fewer differences in image size give a quieter page.
- **Why it meets the bar:** still sold by its original publisher after more than forty years and the root text for Swiss-style grid practice. Opinion: essential for principle; translate it to fluid screens rather than applying it literally.
- **Link:** https://niggli.ch/en/products/rastersysteme-fur-die-visuelle-gestaltung
- **Tier:** 3
- **Checked:** Niggli product page (1981, 176 pages, 357 illustrations, ISBN 978-3-7212-0145-1), Open Library edition records (4th revised edition 1996); accessed 2026-10-10. Already used in kb/research/layout/01 and 03.

### Making and Breaking the Grid, Timothy Samara (book)
- **Who / what:** a layout workshop book covering manuscript, column, modular and hierarchical grids, and deliberate non-grid composition; Rockport, third edition (2023).
- **Best for:** seeing grids applied across many real projects at a size where you can study structure, then learning when to break them.
- **Why it meets the bar:** over 150,000 copies in print across editions, per the publisher's listing; each project is shown over several pages with notation. Opinion: the practical companion to Müller-Brockmann.
- **Link:** https://www.overdrive.com/media/9579263/making-and-breaking-the-grid
- **Tier:** 3
- **Checked:** OverDrive listing (third edition, Rockport, 23 May 2023, ISBN 9780760381939), Open Library record (second edition 2017, 240 pages); accessed 2026-10-10. Not yet used in kb/research.

### Visual Hierarchy in UX: Definition, Nielsen Norman Group (article)
- **Who / what:** NN/g article by Kelley Gordon (2021) defining visual hierarchy and its three levers: color and contrast, scale, grouping (proximity and common region), plus the squint test.
- **Best for:** concrete limits to apply: no more than 3 type sizes, no more than 2 big elements, about 2 primary and 2 secondary colors, tighter space between a heading and its content than between groups.
- **Why it meets the bar:** opinion: NN/g is among the most cited UX firms; the article cites Lupton and Davis and Hunt. Opinion: the numbers are rules of thumb from practice, not test results, so treat them as defaults.
- **Link:** https://www.nngroup.com/articles/visual-hierarchy-ux-definition/ (X: https://x.com/nngroup, lead only, tier 5)
- **Tier:** 4 (practitioner guidance from a research firm; not a study)
- **Checked:** the full article (author, date, best practices, references), NN/g follow links; accessed 2026-10-10. Already used in kb/research/layout/03.

### Material Design 3: Layout (docs)
- **Who / what:** Google's layout guidance: breakpoints (formerly window size classes: compact under 600dp, medium 600 to 839dp, expanded, large 1200 to 1599dp, extra-large 1600dp and up), canonical layouts (feed, list-detail, supporting pane), panes, grids and spacing.
- **Best for:** deciding how a screen changes across sizes: start from a canonical layout, not a column grid; how many panes at each breakpoint.
- **Why it meets the bar:** official docs for a system shipped across Android and the web, with Jetpack Compose implementations. Opinion: the best reference for app (not marketing page) layout across devices.
- **Link:** https://m3.material.io/foundations/layout/understanding-layout/overview
- **Tier:** 1
- **Checked:** layout overview, canonical layouts, window size classes and grids pages (including the rename to "breakpoints"); accessed 2026-10-10. Already used in kb/research/layout/01, 02, 04, 05.

### Every Layout, Heydon Pickering and Andy Bell (book + site)
- **Who / what:** a book and site teaching CSS layout through 12 composable primitives (Stack, Box, Center, Cluster, Sidebar, Switcher, Cover, Grid, Frame, Reel, Imposter, Icon, plus Container) built to adapt without media queries.
- **Best for:** turning a design into layout code that holds up at any width; the free "rudiments" chapters on boxes, composition, units and modular scale.
- **Why it meets the bar:** Bell runs the agency Set Studio, which uses these layouts on client work, and wrote most of web.dev's Learn CSS course; Pickering has consulted for the BBC and Spotify on accessible design systems. Opinion: the most important layout idea of the last decade for web designers who also build.
- **Link:** https://every-layout.dev/
- **Tier:** 4
- **Checked:** home page (primitives list, author bios), rudiments index, Piccalilli post by Bell (now in its third edition, used at Set Studio); accessed 2026-10-10. Already used in kb/research/layout/01, 02, 04, 05.

### Refactoring UI, Adam Wathan and Steve Schoger (book)
- **Who / what:** design-for-developers book (2018) with chapters on hierarchy, layout and spacing alongside color and type.
- **Best for:** fast fixes for cramped or flat app screens; building a spacing system.
- **Why it meets the bar:** authors' shipped work is Tailwind CSS and its sites. Opinion: tactics, not research; strong as defaults.
- **Link:** https://www.refactoringui.com/ (X: https://x.com/steveschoger, lead only, tier 5)
- **Tier:** 4
- **Checked:** refactoringui.com, steveschoger.com, Open Library record; accessed 2026-10-10. Already used in kb/research/layout/01, 02, 03, 05. Also listed in color.md.

### Rachel Andrew (practitioner)
- **Who / what:** member of the CSS Working Group (editor of the Multiple-column layout and Page Floats specs) and content lead for web.dev and developer.chrome.com at Google; created Grid by Example and the CSS Layout News newsletter.
- **Best for:** how CSS Grid, subgrid and multi-column actually behave, from someone who helps write the specs.
- **Why it meets the bar:** spec-editor authority plus years of teaching material. Opinion: go here when a layout question is really a CSS question.
- **Link:** https://rachelandrew.co.uk/ (Grid by Example is linked from her Projects page)
- **Tier:** 4 (her spec work itself is tier 1)
- **Checked:** home and Projects pages (Working Group role, specs edited, Grid by Example, newsletter), 2015 post on complex grids; accessed 2026-10-10. Not yet used in kb/research.

### Ahmad Shadeed (practitioner)
- **Who / what:** design engineer (UX designer who codes), author of the Debugging CSS book, creator of Defensive CSS, Google Developer Expert in Web UI.
- **Best for:** layouts that do not break: long content, flex wrapping, min-content sizing, auto-fit versus auto-fill, plus interactive guides to container queries and gap.
- **Why it meets the bar:** 145+ visual articles, featured by CSS Day, Figma Config and Smashing Magazine; opinion: Defensive CSS is the most practical checklist of its kind. Opinion: the best source on the gap between a static mockup and a layout that survives real data.
- **Link:** https://ishadeed.com/ and https://defensivecss.dev/
- **Tier:** 4
- **Checked:** home, About (roles, contributions, features), articles index, Defensive CSS site; accessed 2026-10-10. No X account confirmed on his own site, so none listed. Not yet used in kb/research.

### Josh W. Comeau, "An Interactive Guide to CSS Grid" (practitioner)
- **Who / what:** independent educator whose interactive CSS articles explain layout algorithms (Flow, Flexbox, Grid) with live demos.
- **Best for:** building a correct mental model of Grid and Flexbox, and patterns like full-bleed layouts.
- **Why it meets the bar:** the Grid guide was first published November 2023 and updated June 2026; he also maintains open source packages such as use-sound. Opinion: the best way to learn the algorithms, as opposed to memorizing properties.
- **Link:** https://www.joshwcomeau.com/css/interactive-guide-to-grid/ (active on Bluesky, not X: https://bsky.app/profile/joshwcomeau.com, lead only, tier 5)
- **Tier:** 4
- **Checked:** the Grid guide (dates), CSS article index, About page and social links; accessed 2026-10-10. Already used in kb/research/layout/01 and 05.

## Considered and dropped
- **Jen Simmons (Layout Land videos):** strong history in CSS layout, but not verified this session, so left out.
- **Laws of UX and "Gestalt principles" listicles:** compilations of other people's research; cite the originals or the NN/g articles instead.
- **Golden ratio and "divine proportion" layout posts:** mostly hype with weak evidence; a consistent spacing scale and measure do the real work.
- **Apple Human Interface Guidelines, layout:** tier 1 and already used in kb/research/layout, but platform-specific; it belongs in ux.md.
- **Bootstrap or Tailwind grid docs:** framework references, not layout thinking.
- **Utopia fluid grid and space calculators:** a strong tool, listed once in typography.md to avoid duplication; its space scale applies directly to layout.
