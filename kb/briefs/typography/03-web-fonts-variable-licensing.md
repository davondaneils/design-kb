# Brief 03: Web font loading, variable fonts and licensing

**Question it answers:** How do we ship fonts fast, without layout shift or invisible text, and legally?

**After reading, a designer or engineer can decide:**
- font-display value per role; what to preload; self-host vs service.
- How to build a metric-matched fallback (size-adjust and overrides) for near-zero CLS.
- When a variable font beats static files; how to use axes (wght, wdth, opsz, GRAD) correctly.
- Subsetting with unicode-range, and the license traps it triggers.
- Which license a use needs (desktop, web, app, ePub, broadcast) and what OFL allows.

**Must cover:** web.dev font best practices, MDN size-adjust / font-size-adjust / variable fonts / font-optical-sizing, Web Almanac 2024 fonts chapter, OFL FAQ (subsetting is modification), Alphabettes licensing survey, Apple SF Pro restriction.

**Test briefs it must pass:** an audit of a slow marketing site using six static Google Font weights.
