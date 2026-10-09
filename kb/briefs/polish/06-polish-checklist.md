# Brief: 06 The polish pass: checklist and automation

**Question:** What does the director check, in what order, on the rendered screenshots, to find the last 10 percent? Which checks can a script do?

**Decisions the reader must be able to make**
- Order of the pass (gate first, then system-wide audits, then component states, then surfaces, then edges).
- For each item: how to see it in a screenshot or the CSS, and the fix.
- Which checks to automate in `tools/lint.mjs` and with what thresholds.

**Fundamentals (gate):** the FOUNDATIONS 15-item checklist runs first; polish never overrides it.

**Expert layer:** audit-by-property (collect every radius, shadow, border color, icon stroke used, then reduce), squint and zoom tests, state sheet render, the "what would Linear remove" pass.

**Must cover:** a checklist the director can run in its self-critique loop at most 3 rounds, with screenshot cues; automation proposals for lint with thresholds and expected false positives.

**Test briefs:** both slice pages; the checklist is run on them and the with-polish page must pass every item.

**Rubric:** gate; every checklist item passes or is named as a remaining gap with a reason.
