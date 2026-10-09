# design-kb

Goal: a team of agents that researches, writes, checks and tests a design knowledge base that makes Claude excellent at web, app and graphic design, from color and type through copy, motion, data and search.

## What the finished knowledge base looks like (proposed default)

- **One Claude skill per domain** (for example `design-color`, `design-typography`), each a short SKILL.md with decision rules, plus a `references/` folder holding the deep material (scales, tables, checklists, worked examples). Claude loads the short part every time and the deep part only when needed.
- **One router skill, `design-director`**, that runs a project end to end and calls on the domain skills in the right order (strategy, then structure, then visuals, then copy, then build, then search).
- **Your existing skills plug straight in:** `website-strategy` (discovery and positioning), `copywriting` (persuasion copy), `sales-funnels` (conversion paths). PPGPool27 stays its own project skill but can inherit the new design rules.

## The agents (defined in `.claude/agents/`)

| # | Agent | Job | Takes in | Hands off |
|---|---|---|---|---|
| 1 | **Editor in Chief** (orchestrator) | Owns the topic map, assigns work, enforces the house format and your rules (no em dashes, plain language). | Your priorities and the domain list | Topic briefs to the Researcher |
| 2 | **Researcher** | Gathers the best sources per topic: canonical books, standards (WCAG, Google Search docs, Apple HIG, Material), and current practice. Separates consensus from opinion. | A topic brief | Source notes with citations |
| 3 | **Domain Specialists** (one template, many hats) | Turn research into usable rules: principles, decision trees, numbers (type scales, contrast ratios, spacing, easing curves), do and don't, examples. | Source notes | A draft domain chapter |
| 4 | **Skill Architect** | Shapes chapters into skills: trigger description, short SKILL.md, deep references, cross-links between domains. | Draft chapter | A draft skill |
| 5 | **Critic** | Fact checks against sources, catches contradictions between domains (say, motion vs accessibility), cuts filler. | Draft skill | Fix list, or approval |
| 6 | **Tester** | Gives Claude real briefs (a landing page, a dashboard, a logo lockup) with and without the skill and compares the results. | Approved skill | Pass, or a list of gaps back to the Specialist |
| 7 | **Librarian** | Keeps the index, versions and freshness dates. Flags fast moving areas (SEO, AEO, framework trends) for re-review. | Shipped skills | Update tickets back to the Editor |

### Specialist hats (domains)

1. Strategy and brand (reuses `website-strategy`)
2. Color theory and palettes
3. Typography and font pairing
4. Layout, grids, spacing and visual hierarchy
5. Graphic design (logos, icons, imagery, illustration)
6. UX and interaction patterns (web and app)
7. Motion and micro-interaction
8. Copywriting and UX writing (reuses `copywriting`)
9. Conversion and funnels (reuses `sales-funnels`)
10. Front-end build: HTML, CSS, accessibility, performance
11. Data and backend: database structure, APIs, auth
12. Search: SEO and AEO (answer engine optimization)

## Pipeline

Editor in Chief → Researcher → Specialist → Skill Architect → Critic → Tester → (loop back on gaps) → Librarian ships it.

Each domain runs through this loop on its own, so several can move in parallel.

## Proposed first build order

1. Write the 7 agent definitions themselves (this step).
2. Pilot on **one domain** (color is a good pilot: it is well sourced and easy to test visually).
3. Fix the agents based on the pilot, then run the remaining domains in batches.
4. Build `design-director` last, once the domain skills exist.
