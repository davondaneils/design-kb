# Site headers and logo bars (marketing pages)
Jobs: landing page, funnel page, brand site. Sources observed 2026-10-28 on Navbar Gallery (https://www.navbar.gallery/type/static), rendered live with Playwright at 1440; screenshots in `shots/12-site-headers/`. App navigation (sidebars, tab bars) is in [03-navigation.md](03-navigation.md). Opinion is marked (opinion).

**Look at the pictures, not only this text.** These notes keep the decisions; the shots keep the feel (how a bar sits on an image, weight, air). Open the shots, and re-render the live gallery page when choosing a header (preflight section 2).

## What the best examples do
1. **Floating solid pill over a full-bleed painting.** Solidroad: a painted mountain landscape fills the hero inside a rounded inset frame; the nav is a solid white pill floating at top center, logo in the middle, links left, sign-in and a green CTA right. Solid enough to read anywhere, yet the painting still reaches the top edge. Shot: `navbar-gallery-solidroad.jpg`. [live page]
2. **Logo in a tab cut into the photo.** Lassco: a solid light tab with an angled right edge holds the logo in the top-left corner of a full-bleed cave photo; the links sit on a thin light strip to the right. The solid area is only as big as the logo needs. Shot: `navbar-gallery-lassco.jpg`. [live page]
3. **A solid tab hung from the top center.** Rekorder Studios: a black tab carrying the wordmark hangs from the top edge, with a dark pill of links under it. Shot: `navbar-gallery-rekorder-studios.jpg`. [live page]
4. **Centered crest, pill buttons on both sides.** Hungry Tiger: the tiger crest sits centered on a poster-like hero; small pill buttons (Sauce, About, Recipes, Game | Contact, Buy now) frame it. The logo is a badge, not a line of text. Shot: `navbar-gallery-hungry-tiger.jpg`. [live page]
5. **Centered serif name inside a drawn frame.** Haley Park: the name in an italic serif, centered, flanked by two links, inside a thin hairline border that frames the whole page, with an arch drawing below. Ceremonial without any solid fill. Shot: `navbar-gallery-haley-park.jpg`. [live page]
6. **Glass pill of links, logo free on the image.** Integrated Biosciences: logo top-left directly on the hero, links grouped in a dark translucent pill top-right, the primary item filled. Shot: `navbar-gallery-integrated-biosciences.jpg`. [live page]

## Decision rules drawn from them (opinion, from the set above)
- A header over a painting or photo is either fully open (logo on the image) or a **shaped** solid (pill, tab, banner); a full-width solid bar is the template choice and cuts the image.
- Size the solid shape to its contents. Solidroad's pill and Lassco's tab are only as large as the logo and links.
- A centered logo needs nothing on either side or a symmetric pair (Hungry Tiger, Haley Park); a left logo aligns to the headline's left edge.
- A funnel page with no links (a quiz cover) keeps only the logo, so a shaped solid (tab or banner) carries the brand without adding exits.

## Applied
Stand Firm quiz cover logo bar, options I (pill, from Solidroad), J (tab, from Lassco) and K (banner, from Rekorder and Hungry Tiger), 2026-10-28: https://claude.ai/artifact/6DMMGuabJRM4diXZ5SQF2w
