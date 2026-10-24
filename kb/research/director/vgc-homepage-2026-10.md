# Evidence note: VGC homepage, three directions (2026-10-24)

Job: three homepage directions for Vancouver General Contractors from a read-only Figma file. Three critic rounds. These are the failures that recurred, with the evidence, and where each lesson now lives.

| Failure | Evidence | Lesson written to |
|---|---|---|
| Form showed "sent" for every submit, no lead created | All three round 2 critics; `fetch` with `mode: 'no-cors'` is opaque (MDN Request.mode); the live Contact Form 7 form needs its own fields; WordPress returned 404 to a POST field `name` | design-conversion 04, "Prototype forms tell the truth" |
| H1 promised 3D, page showed no render | Critic A rounds 1 and 2, playbook "proof next to the claim" | design-art-direction 02, "When the proof image does not exist" |
| Review count, review months, a Figma-only quote, a Figma-only financing amount, a "names mentioned most" claim | Live JSON-LD 4.3 from 91; widget dates unstable; critics C and A counted names | design-conversion 02, "Verify proof before it ships" |
| Unsourced caption ("1970s home"), unnamed people | Critic C rounds 1 and 2; VGC's YouTube title named the designer | design-art-direction 02 |
| Phone menu did not close on Escape or outside click | Critics A, B, C round 2 (Playwright probe) | design-ux 02, "Phone menu as a disclosure" |
| Line art and lazy images missing from renders | mask-image CORS on file:// (MDN); lazy images absent in full-page screenshots | design-frontend 07 item 12 |
| Reveal animated `clip-path` | Critic B; design-motion 07 already names the two-transform wipe. A reading miss, not a skill gap | none (already covered) |

Tool gap: `claims_inventory` has no en-CA rules, so Canadian spellings and `$1M+` were checked by hand.
