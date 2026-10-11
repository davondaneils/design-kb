# Brief: Color in UI systems (tokens, roles, themes, states)

**Domain:** color. **Skill:** design-color. **Audience:** a designer building websites and apps for themselves and for clients.

## Question
How do you turn a palette into a token system that survives light mode, dark mode, states and client rebrands?

## Decisions the reader must be able to make
- The token layers (primitive, semantic, component) and naming.
- The minimum semantic role set for a site or app.
- Dark mode surfaces, text and accent mapping.
- Hover, active, focus, selected, disabled treatments with numbers.

## Fundamentals (non-negotiable)
- Components use semantic tokens, never raw primitives.
- Each role has a paired "on" color that passes contrast.
- Dark mode is a remap, not an inversion.

## Expert layer
- Elevation in dark mode by lightness, not shadow.
- State layers as alpha overlays (Material values) vs stepped scale changes (Radix).
- One-variable rebrand: swap the primary hue, keep the ladder.

## Must cover
Material 3 roles, Radix step jobs, Apple semantic colors and base/elevated, CSS custom properties, light-dark(), color-scheme, forced-colors, prefers-contrast, NN/g on dark mode defaults. Data viz: point to dataviz skill.

## Test briefs
- "Set up light and dark tokens for a SaaS dashboard."
- "What should hover and disabled look like on my buttons?"
