# MicroKit UI: button microinteractions (mined 2026-10-28)

Source: https://microkit.co/ ("Copy-paste React & CSS microinteractions", 54 components, shadcn registry). Shared by Davon for the Stand Firm quiz cover button. Accessed 2026-10-28 with Playwright, 1440 wide; CSS read from the live stylesheets.

## What is there
Click-feedback buttons: Cursor Edge Glow, Cursor Follow Share, Hold to Delete, Fuse Undo, Secure Purchase (label swaps to "Processing Payment" with a dot grid), Next Dot Fill, Expanding Contact, Contact Reveal, Subscribe Shine, Expanding Newsletter, Next Reveal, Staggered Letter Glow, What's New glow. Plus nav and input pieces (Blur Glide Menu, Expanding Icon Tabs, Scrub Number Field, Bounce Checkbox).

## Recipes worth keeping (from the live CSS)
- **Shine:** `::after` band 30px wide, white at 13%, `transform: rotate(25deg) translate(-180px)` moving to `translate(190px)` on hover, `transition: transform .5s`, parent `overflow: hidden`.
- **Subscribe Shine:** a 1px rim made by a 121deg linear gradient on an oversized layer behind an inset-1px face; the light lives only in the rim.
- **Edge Glow:** three stacked rings (outer blur 15px, rim blur 7px, inner blur 2px), each a gradient border that brightens toward the cursor side.
- **Staggered Letter Glow:** each letter slides up and is replaced (`translateY(125%)`, 0.45s, `cubic-bezier(.16,1,.3,1)`, per-letter delay) with inset side glows on hover.
- Reduced motion: their Social Highlight Card cuts transitions to 0.01ms under `prefers-reduced-motion`.

## Rule it adds (opinion, from the Stand Firm job)
Hover-driven light does nothing on a phone. For a mobile CTA, run the light on a timer instead (a sheen pass or a rim light once per cycle, matched to any other loop on the screen, here the 3.8s ring) and stop it under reduced motion.
