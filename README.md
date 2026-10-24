# design-kb

A team of agents that researches, writes, checks and tests a design knowledge base that makes Claude excellent at web, app and graphic design. The bar is the exemplar set in `kb/exemplars.md` (Stripe, Linear, Apple, Pentagram and others), judged on rendered pages, with fundamentals checked first.

## Doing design work with it
Start at `skills/design-director/references/preflight.md` (read order, trigger table, read log, hand-over gate) and `references/resource-index.md` (where every resource and tool lives). The skills are also linked in `.claude/skills/`, so a session opened in this repo lists all of them. `node tools/check.mjs page.html` runs the whole automated hand-over check.

## How the skills are organised

Three layers, all shipped as Claude skills in `skills/`:

| Layer | Skills | Role |
|---|---|---|
| Foundations | `design-foundations` | Always loaded first. Token system, the 16-item fundamentals gate, accessibility (WCAG 2.2 AA) as the cross-cutting floor. Mirrors `kb/FOUNDATIONS.md`, the source of truth. |
| Job playbooks | `design-playbook-landing`, `design-playbook-dashboard`, `design-playbook-mobile`, `design-playbook-brand` | What triggers. Each says which references to load in what order, what done looks like, and the signature moves of the closest exemplars. |
| Strategy | `design-strategy` | Loads second on every job, at the depth the brief needs. |
| Domain references | `design-color`, `design-typography`, `design-layout`, `design-art-direction`, `design-graphic`, `design-ux`, `design-product-ui`, `design-conversion`, `design-polish`, `design-motion`, `design-copy`, `design-frontend`, `design-search`, `design-data` | Depth, loaded on demand by the director or a playbook. Not triggered on their own. |

`design-director` is the spine: preflight, foundations, the strategy brief, the playbook, the references, then a self-critique loop (`tools/check.mjs` for the automated half, then judged steps, exemplar comparison and a fresh-context critic, at most 3 rounds).

The user's existing skills plug in where a playbook says: `website-strategy` (positioning), `copywriting` (direct response only: sales pages, VSLs, funnels; never premium product or brand sites), `sales-funnels`, `dataviz`.

Planned next: design systems (inside foundations) and a fuller self-critique method (inside the director).

## The agents (`.claude/agents/`)

editor-in-chief > researcher > domain-specialist > skill-architect > critic > tester > librarian.

| Agent | Job |
|---|---|
| editor-in-chief | Plans per layer (foundations, then playbooks, then references), writes briefs with test briefs and rubric, owns `kb/FOUNDATIONS.md`, caps loops at 3 rounds, gets Davon's approval before batch runs. |
| researcher | Sources under a tiered policy with quote, URL and date per claim; runs the standing exemplar teardown stream (`kb/teardowns/`). |
| domain-specialist | Writes chapters: floor (fundamentals, standards) then ceiling (exemplar patterns, signature moves). |
| skill-architect | Packages chapters as skills, with descriptions set by layer. |
| critic | Citation spot check, fundamentals gate, contradictions with foundations, the expert bar. |
| tester | Builds real pages with and without the skills, lints, renders, judges against the exemplars. |
| librarian | Index, versions, freshness, topic map rollup, keeps the foundations mirrors in sync. |

## Repo map

| Path | What |
|---|---|
| `skills/` | The shipped and in-progress skills (three layers above) |
| `kb/FOUNDATIONS.md` | Shared contract: tokens, chapter template, fundamentals checklist |
| `kb/exemplars.md` | The approved quality bar |
| `kb/briefs`, `research`, `drafts`, `reviews`, `tests` | Pipeline stages |
| `kb/teardowns/` | Measured exemplar CSS (standing research stream) |
| `kb/status/`, `kb/TOPIC_MAP.md`, `kb/INDEX.md` | Per-domain status, its rollup (`node tools/rollup.mjs`), the skill index |
| `tools/` | `check.mjs` (the whole automated hand-over check), `render.mjs` (screenshots), `lint.mjs` (fundamentals lint), `rollup.mjs` |
