# Index of skills

Shipped means the librarian set a shipped version in the domain's status file. Everything else is listed by layer so the director's routing is visible in one place. Status per domain: `kb/TOPIC_MAP.md`.

## Shipped

| Skill | Layer | Covers | Version | Last reviewed | Next review | Related skills |
|---|---|---|---|---|---|---|
| [design-color](../skills/design-color/SKILL.md) | reference | Color models and OKLCH, contrast-locked 50 to 950 ramps, WCAG 2.2 contrast with APCA as a draft second opinion, semantic color tokens, light and dark themes, states, brand color choice and color psychology evidence | 0.1 (0.2 in CHANGELOG, not shipped) | 2026-10-09 | 2027-10-09 (foundation, yearly); APCA and WCAG 3 status and legal dates: 2027-04-09 | design-foundations, design-playbook-landing, design-playbook-dashboard, dataviz, website-strategy |

## In the repo, not shipped

| Skill | Layer | Covers | Stage |
|---|---|---|---|
| [design-foundations](../skills/design-foundations/SKILL.md) | foundation | Tokens, the 15-item fundamentals gate, accessibility (WCAG 2.2 AA) as the cross-cutting floor | drafting |
| [design-director](../skills/design-director/SKILL.md) | spine | Routes a job: foundations, playbook, references, self-critique loop | drafting |
| [design-playbook-landing](../skills/design-playbook-landing/SKILL.md) | playbook | Marketing sites and landing pages; copy rule (design-copy vs copywriting) | drafting |
| [design-playbook-dashboard](../skills/design-playbook-dashboard/SKILL.md) | playbook | SaaS app screens, dashboards, internal tools | drafting |
| [design-playbook-mobile](../skills/design-playbook-mobile/SKILL.md) | playbook | iOS, Android and mobile web; platform conventions | drafting |
| [design-playbook-brand](../skills/design-playbook-brand/SKILL.md) | playbook | Brand identity and guidelines | drafting |
| [design-typography](../skills/design-typography/SKILL.md) | reference | Scale, 52ch measure, pairing, self-hosted web fonts without a CDN, type-led pages, hierarchy, typographic detail | v0.2: rendered test done, combined test passed, awaiting Davon's blind ranking |
| [design-layout](../skills/design-layout/SKILL.md) | reference | Grids, spacing, hierarchy, responsive and adaptive layout, density | text test passed, render test due |
| [design-graphic](../skills/design-graphic/SKILL.md) | reference | Logos, icons, photography direction, illustration, social graphics, export | critic approved, not tested |
| [design-ux](../skills/design-ux/SKILL.md) | reference | Usability gate, navigation, forms, states, onboarding, component specs | text test passed, render test due |
| [design-motion](../skills/design-motion/SKILL.md) | reference | Timing, easing, choreography, micro-interactions, reduced motion | text test passed, render test due |
| [design-copy](../skills/design-copy/SKILL.md) | reference | UX writing: page structure, microcopy, voice and tone, readability | text test passed, render test due |
| [design-frontend](../skills/design-frontend/SKILL.md) | reference | Semantic HTML, modern CSS, performance, images and fonts, design to code | text test passed, render test due |
| [design-search](../skills/design-search/SKILL.md) | reference | SEO and AEO | text test passed, render test due |
| [design-product-ui](../skills/design-product-ui/SKILL.md) | reference | Dense app UI: tables, density modes, command palette and shortcuts, loading, empty, partial and permission states | v0.1: rendered test done, combined test passed, awaiting Davon's review |
| [design-art-direction](../skills/design-art-direction/SKILL.md) | reference | Concept and motif, data-driven art, visuals without image hosts, photography briefs, text over art | v0.1: rendered test done, combined test passed, awaiting Davon's blind ranking |
| [design-polish](../skills/design-polish/SKILL.md) | reference | Elevation and tinted shadows, state layers, focus, borders and radius, icon strokes, state sheets | v0.1: rendered test done, combined test passed, awaiting Davon's blind ranking |

Planned (no content yet): design systems (inside design-foundations), self-critique method (inside design-director).

Linked user skills: website-strategy, copywriting (direct response only), sales-funnels, dataviz.

## Review queue
For the editor-in-chief. Add an item when a review falls due or a source changes.

| Due | Skill | What to recheck |
|---|---|---|
| 2027-04-09 | design-color | WCAG 3 contrast status (APCA in or out); ADA Title II and EU EN 301 549 dates and versions; browser support for `light-dark()` and relative color syntax; Tailwind and Radix default palettes. |
| 2027-04-09 | design-color | Re-run the "without" test answers with a fresh agent that has not read the skill (pilot limitation, see `kb/tests/design-color.md`). |
| 2027-10-09 | design-color | Full yearly review: Material and Apple color guidance, Oklab tooling, any new peer reviewed color psychology reviews. |
