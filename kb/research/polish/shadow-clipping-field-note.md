# Shadow clipping (field note, 2026-11-23)

Evidence: VGC Foundations page in Figma. The Shadow/Card, Shadow/Media and Focus/Ring specimens sat in auto layout frames built with `figma.createAutoLayout()`, which leaves `clipsContent` on. Every shadow was cut at the frame edge. Davon found it and turned Clip content off by hand.

Reach of the VGC shadows (blur + offset - spread): card 0 24 64 -32 gives 56px below, 32px each side; media 0 24 64 -24 gives 64px below, 40px each side.

Fix applied: Clip content off on all 118 container frames inside the documentation frame, plus 64px of space between each specimen and its caption.

Rule recorded in design-polish SKILL.md expert move 17.
