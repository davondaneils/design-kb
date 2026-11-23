# Accent word baseline (field note, 2026-11-23)

Evidence: VGC Foundations page in Figma. "Built to" (Heading/H2, Newsreader Regular 49px, line height 110%) and "last." (Newsreader Italic 49px, line height 100%) were two text layers in a horizontal auto layout aligned to the top. The 10% line-height difference (about 4.9px, half of it above the text) lifted "last." about 2 to 3px above the baseline of "Built to". Davon caught it by eye.

Fix: one text layer, the italic applied to a character range. Same structure as the build: `<h2>Built to <em>last.</em></h2>`.

Rule recorded in design-typography SKILL.md expert move 24 and reference 05 (Links and emphasis).
