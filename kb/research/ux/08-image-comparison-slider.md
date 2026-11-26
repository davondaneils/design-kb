# 08 Image comparison (before and after) slider: research note

Read 2026-11-26 for the VGC Home page, section 5. Feeds design-ux `references/06-platforms-touch-systems.md` (slider block) and design-art-direction `references/02-photography.md` (Crop).

| # | Claim | Source | Quote | Tier |
|---|---|---|---|---|
| 1 | On a phone, vertical scroll wins unless the visitor clearly drags sideways | Poper, "Before After Slider Mobile" (https://www.poper.ai/blog/before-after-slider-mobile, 2026-06-05) | "On a phone, vertical scroll should always win unless the visitor clearly grabs the handle." | practitioner |
| 2 | Grab area 40 to 48px; labels in opposite corners | Poper, same | "wrap it in an invisible touch area about 40 to 48 pixels wide"; "Push the Before and After labels into opposite corners so the thumb never covers them." | practitioner |
| 3 | A drag needs a single-pointer alternative | W3C, Understanding SC 2.5.7 Dragging Movements (https://www.w3.org/WAI/WCAG22/Understanding/dragging-movements) | "All functionality that uses a dragging movement for operation can be achieved by a single pointer without dragging" | standard |
| 4 | Tap to place, real slider control, or two labelled images | a11yfix (https://blog.a11yfix.dev/blog/before-after-image-slider-accessibility, 2026-07-28) | "clicking anywhere on the image repositions the divider, so dragging is never the only way"; option 1: "Replace the slider with two labelled images" | practitioner |
| 5 | A native range input carries keyboard and screen reader support | Cloud Four (https://cloudfour.com/thinks/building-an-accessible-image-comparison-web-component, 2021-07-14) | "since we're using native browser controls our code is accessible and performant" | practitioner |
| 6 | Labels need a background to survive both photos | Common Ninja (https://www.commoninja.com/blog/before-and-after-slider-for-your-website, 2026-07-13) | "a label with no background will disappear on one side of the drag" | vendor |
| 7 | The pair must share crop and size | RevelRaw (https://revelraw.com/blog/before-after-comparison-slider.html, 2026-09-21) | "Export the before and the after from the same RAW file with an identical crop, pixel size and color space, or the seam will lie." | vendor |
| 8 | The frame ratio follows the client's photos | Davon, VGC Home section 5, 2026-11-26 | "The before and after slider needs to be a 16:9 aspect ratio to match the images." | correction on record |

Measured on the VGC options page (390 by 844 touch emulation, 2026-11-26): a sideways drag moved the line 50 to 20; a vertical swipe starting on the picture scrolled the page about 250px and left the line in place; a tap at 75% moved the line to 75; End set the range to 100.

Opinion (mine): the last rule in the skill block (no slider for pairs shot from different spots) follows from claims 4 and 7 and from looking at one client's archive, where the befores were snapshots and the afters professional photos from another position. It is not tested with users.
