# design-kb

A knowledge base that teaches Claude web, app and graphic design. It is built by the subagents in `.claude/agents/` and shipped as Claude skills in `skills/`.

## House rules (apply to every file)
- Never use em dashes.
- Plain language. Decision rules and real numbers over essays.
- Cite a source for every factual claim. Mark opinion as opinion.
- Reuse before writing: link to the existing website-strategy, copywriting and sales-funnels skills instead of duplicating them.

## Pipeline
editor-in-chief > researcher > domain-specialist > skill-architect > critic > tester > librarian.
Work moves through `kb/` folders in that order: briefs, research, drafts, reviews, tests. Finished skills land in `skills/<name>/`.

## Status
Topic map and status live in `kb/TOPIC_MAP.md`. Index of shipped skills lives in `kb/INDEX.md`.
