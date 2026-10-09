# design-kb

A knowledge base that teaches Claude web, app and graphic design. It is built by the subagents in `.claude/agents/` and shipped as Claude skills in `skills/`.

## House rules (apply to every file)
- Never use em dashes.
- Plain language. Decision rules and real numbers over essays.
- Cite a source for every factual claim. Mark opinion as opinion.
- Reuse before writing: link to the existing website-strategy, copywriting and sales-funnels skills instead of duplicating them.
- Build on the shared foundation contract in `kb/FOUNDATIONS.md`: every default, example, token name and number must match it (a skill may teach when to deviate).

## Quality bar
- The standard is "Michael Jordan level": the best work of the best practitioners in the field, beyond what already counts as world class. Picture what Pentagram, the Apple HIG authors, Bringhurst, or the Stripe and Linear design teams would sign off on. Generic, safe or merely competent output fails.
- Fundamentals are a gate, checked first. Correctness, contrast and accessibility, hierarchy, spacing and consistency, and clarity must be perfect before any advanced or creative work earns credit. One fundamentals miss fails a review, however sophisticated the rest is.
- Above the gate, every skill must carry the non-obvious expert moves: the things a top practitioner knows that a strong generalist does not. Test: would the best person in this field learn something, or nod at every line? Nodding at every line is not enough.
- Every skill leads with its fundamentals as non-negotiable rules, then layers the expert material on top.

## Pipeline
editor-in-chief > researcher > domain-specialist > skill-architect > critic > tester > librarian.
Work moves through `kb/` folders in that order: briefs, research, drafts, reviews, tests. Finished skills land in `skills/<name>/`.

Paths: briefs, research and drafts use the domain slug (`kb/briefs/color/`); reviews and tests use the skill name (`kb/reviews/design-color.md`). Subtopic files share one name across stages (`01-fundamentals.md` in briefs, research and drafts).

## Status
Each domain keeps its status in `kb/status/<domain>.md`; `kb/TOPIC_MAP.md` is the librarian's rollup of those files. Index of shipped skills lives in `kb/INDEX.md`.
