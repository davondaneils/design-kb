# Brief 03: Composition, focal point and text over images

## Question
Where does the eye land first in a picture or a hero, and how do I put text over imagery that passes contrast everywhere?

## Audience
Claude composing heroes, cards with images, posters and feature sections.

## Decisions the reader must be able to make
- Pick one focal point and build the frame and the type around it.
- Use gaze, scale, contrast and isolation to direct the eye toward the headline or action.
- Choose a text-over-image technique (planned negative space, solid panel, scrim, or no overlay) and verify the worst pixel.
- Handle forced colors and dark mode for overlays.

## Fundamentals
WCAG 1.4.3 with F83 and G18 (contrast at the worst point behind each letter), 1.4.11 for meaningful graphics, 1.4.5 images of text: never bake readable text into images.

## Expert layer
The rule of thirds is weakly supported (Amirshahi et al.); gaze cueing is measured (Friesen and Kingstone); one focal point clearly larger than anything else; gradient scrims vanish in forced colors (non-url background images forced to none), so a solid backplate is the robust answer; the squint test.

## Must cover
Worst-pixel check method and a script; scrim recipe; forced-colors behavior; composition rules with evidence levels.

## Out of scope or reuse
Social and thumbnail composition: design-graphic 05. Hero layout grids: design-layout.

## Test briefs
1. Coffee hero with an image behind or beside the headline, light and dark. Exemplar: apple.com product pages.
2. Editorial feature header with full-bleed image and headline over it. Exemplar: nytimes.com feature stories.

## Rubric
Gate first, with the worst-pixel contrast measured and recorded. Then: one focal point is obvious in a blurred screenshot; the eye path ends at the primary action.
