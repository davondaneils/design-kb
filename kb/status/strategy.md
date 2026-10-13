# Strategy and brand

| Field | Value |
|---|---|
| Domain number | 1 |
| Layer | reference |
| Skill | design-strategy |
| Branch | claude/data-backend-strategy-brand-a8m75c |
| Status (editor-in-chief) | drafting |
| Shipped version (librarian) | none (v0.1 built, not reviewed) |
| Reuses | website-strategy, crafting-voice-identity (Davon's skills); design-copy 03, design-art-direction 01, design-color psychology-brand, design-graphic 01 |
| Last updated | 2026-10-13 |

## Where it stands
Until 2026-10-13 this domain was a pointer to website-strategy. Now a domain reference that design-director loads after design-foundations and before the playbook for every page, screen or brand job, at the depth the brief needs (inherit, three lines, one page, full; proposals stay with website-strategy). Output: a one-page strategy brief (`skills/design-strategy/assets/strategy-brief.md`) checked by `assets/brief_lint.mjs`.

Built on this branch: briefs (`kb/briefs/strategy/00` to `06`), research (6 notes, claim tables), drafts (6), skill (SKILL.md, 6 references, template, example, linter with self-test). Proposed shared-file edits (director, four playbooks, CLAUDE.md) are in `kb/reviews/design-strategy-pipeline-notes.md`, not applied.

## Next step
1. Editor-in-chief applies or rejects the shared-file edits in the pipeline notes.
2. Critic reviews `skills/design-strategy` (citation batch: re-fetch 20 percent of claims).
3. Tester runs the held-out briefs in `kb/tests/design-strategy/` from a clean context (the builder did not read them).
4. Librarian ships on approval.
