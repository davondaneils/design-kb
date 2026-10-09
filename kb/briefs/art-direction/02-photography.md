# Brief 02: Photography: picking, cropping, treating

## Question
How do I choose, crop and treat photographs so each one proves something and the set looks like one brand?

## Audience
Claude building a page where the user supplied photos, where stock is the only option, or when reviewing a page's imagery.

## Decisions the reader must be able to make
- Accept or reject a photo (job test, cliché test, concept test).
- Crop per breakpoint (the art direction problem, `<picture>`, `object-position`) and protect the focal point.
- Pick a treatment that unifies mixed sources (grade, monochrome, duotone) and know its cost.
- Sequence a set so adjacent images do not fight.

## Fundamentals
NN/g: filler and generic stock are ignored; alt per the W3C decision tree; source at least 2x the display width; width and height attributes so the layout does not shift; no fabricated customers.

## Expert layer
Crop tighter than feels safe; crop to the verb; duotone as a unifier with its contrast check; same subject-to-frame scale across a set; product shots on one axis for comparison.

## Must cover
MDN art direction problem, `object-position` default 50% 50%, CLS and width/height, Spotify duotone (Collins), treatment recipes in CSS and SVG filters.

## Out of scope or reuse
Shot brief fields and AI imagery rules: design-graphic 03 (reuse). srcset code: design-frontend 05.

## Test briefs
1. Coffee page, assuming the roaster later supplies 6 mixed photos: write the crop and treatment spec. Playbook: landing. Exemplar: apple.com product pages.
2. A B2B team page with phone snapshots of 12 staff: make them one set. Playbook: landing. Exemplar: mercury.com.

## Rubric
Gate first. Then: each kept photo has a stated job; crops specified per breakpoint with focal point; one treatment, with a contrast check on any text it carries.
