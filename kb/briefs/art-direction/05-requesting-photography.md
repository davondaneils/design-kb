# Brief 05: Requesting real photography

## Question
What exactly does Claude ask the user to shoot or send, and how are those files dropped into the page without a redesign?

## Audience
Claude handing over a page built with SVG stand-ins, or starting a page where the user has a phone and a product.

## Decisions the reader must be able to make
- Write a shot list tied to page slots: ratio, minimum pixels, focal point, negative space, light, background, file format, color profile, naming.
- Give phone-level instructions a non-photographer can follow.
- Build slots so the photo replaces the stand-in with no layout change (`aspect-ratio`, `object-position`, width and height).

## Fundamentals
Source at least 2x display width; sRGB or a tagged profile; rights and releases; alt text written per slot.

## Expert layer
Ask for the moment as a verb; shoot three ratios at one moment; one window, one surface, one time of day; a test frame first; the slot contract in code.

## Must cover
Apple HIG scale factors and color profile, Shopify 2048 square, web.dev width and height, a copy-paste request template.

## Out of scope or reuse
Professional shoot brief fields and AI rules: design-graphic 03.

## Test briefs
1. Coffee page hand-over: the photo request for the roaster. Playbook: landing. Exemplar: apple.com product pages.
2. SaaS team page: request for 8 staff portraits from phones. Playbook: landing. Exemplar: mercury.com.

## Rubric
A non-designer could follow the request without questions; every slot has ratio, minimum pixels and focal point; slot code needs no change when the photo arrives.
