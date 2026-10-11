# Unsplash photos for the coffee test page

Real photography to replace the AI stand-ins in `../README.md` (hero-bag, roaster-drop, cupping), plus a new origin image. Sourced 2026-10-10.

## Status: chosen, not yet downloaded

The image files are not in this folder yet. From the build container, unsplash.com, images.unsplash.com and api.unsplash.com all returned a proxy 403 (egress policy), and the Unsplash MCP tools refused every call ("email address has not been confirmed"). Candidates were found by web search and each photo page was read for photographer, license and caption. **No image here has been looked at by eye yet.** Picks are made on caption, camera, shoot context and photographer track record, so treat them as a shortlist to confirm visually, not a final art-direction sign-off.

To finish: on a machine with access, run `python kb/assets/photos/unsplash/fetch.py --sheets`. It writes `<role>.jpg` (about 2400w), `<role>-1600.webp`, `<role>-800.webp`, and 480w candidate thumbs. Then check each pick against the art direction below and swap in an alternate if it fails.

## License

Every photo below is marked "Free to use under the Unsplash License" on its page (checked 2026-10-10): https://unsplash.com/license. Unsplash+ photos were excluded. The license allows commercial use without permission; attribution is not required but we give it. It does not allow selling the photos unaltered or building a competing image service. Brand and trademark rights are not covered by the license (Source: https://unsplash.com/license), which is one more reason to avoid visible logos.

## Art direction (applies to the set)

Warm, natural light, documentary rather than staged stock. One grade across the set: warm whites, deep chocolate shadows, no teal shadows. No visible brand logos, no readable text. If the four do not match after download, grade them together (slight warm white balance, lift blacks a touch) rather than mixing looks.

## Chosen

### 1. hero: `hero.jpg`
- Photo: "Close-up of roasted coffee beans in a bag", https://unsplash.com/photos/close-up-of-roasted-coffee-beans-in-a-bag-x8q9Qdp1l9U
- Photographer: Blake Wisz, https://unsplash.com/@blakewisz
- Details: Nikon Z 8, published 2026-03-29. Caption: macro of roasted beans in a kraft paper bag, deep chocolate tones.
- Why: fixes the critic's two hero complaints at once. No printed label to sit wrong on a curved bag, and real bean texture instead of soft AI surface. Kraft paper reads as specialty roaster, not supermarket. Wisz shoots coffee and product work professionally (Source: https://unsplash.com/@blakewisz profile lists coffee and Nikon).
- Risk: a macro may fill the frame and leave no calm area for type. If so, use alternate 1b.
- Crop, 1440 (hero split, image right, about 600px wide): keep the bag mouth and bean mound in the upper two thirds, focal point near 55% x, 45% y. If the frame is full-bleed behind type, put the type over the paper side, never over beans (busy texture fails contrast).
- Crop, 390 (stacked, image under headline): 4:5 portrait, focal point on the bean mound, about 50% x, 50% y.

### 2. roaster: `roaster.jpg`
- Photo: "Freshly roasted coffee beans in a roaster machine", https://unsplash.com/photos/freshly-roasted-coffee-beans-in-a-roaster-machine-iwcZmTKFo0w
- Photographer: Ichsan Chairul, https://unsplash.com/@__humanbean
- Details: Sony A7 III, published 2026-03-10, Umbra Coffee & Roastery, Makassar, Indonesia.
- Why: a working small-batch roastery, shot as a documentary series (the same shoot has two more roaster frames, see alternates), so we can pick the frame closest to beans in the cooling tray. Small shop, not a chain: no corporate branding expected.
- Check on download: no machine maker badge readable (Probat, Giesen and similar badges sit on the front plate). Crop it out if present.
- Crop, 1440 (wide band, about 1264 x 560): focal point on the bean surface and stirring arm, about 50% x, 60% y; let the machine body fall off the top edge.
- Crop, 390 (tight square, about 520 x 520): beans only, center on the densest bean area. Motion blur in the beans is good; it says "just dropped".

### 3. cupping: `cupping.jpg`
- Photo: "person pours hot water in cups", https://unsplash.com/photos/VXIOMNlnSos
- Photographer: René Porter, https://unsplash.com/@reneporter
- Details: Canon EOS 70D, published 2019-05-27, tagged coffee, event, table.
- Why: a real cupping session (hands, kettle, a row of cups), which is exactly the moment the AI version faked. Same session yields alternates 3a, so the page can use two frames with matching light if needed.
- Check on download: name cards or score sheets on the table. If readable, crop above the table edge, as the old README advised.
- Crop, 1440 (beside the three promises, about 824px wide, 4:5): hands and pouring stream on the upper third line, about 45% x, 40% y.
- Crop, 390 (about 560 wide): tighter, kettle spout plus two cups, same focal point.

### 4. origin: `origin.jpg`
- Photo: "Red coffee cherries soaking in a wooden water tank", https://unsplash.com/photos/coffee-cherries-in-wooden-tank-vnhz8fKYGUg
- Photographer: Faris Ristiansyah, https://unsplash.com/@farisr___
- Details: Fujifilm X-T5, published 2026-08-11. Caption: ripe cherries floating in water during the wet process.
- Why: the page features a washed coffee from a washing station (Hambela Wamena, Guji). Cherries in a flotation tank show the washing step itself, which a generic cherries-on-branch shot does not. Red against wood keeps the warm grade.
- Honesty note: this is not Ethiopia (location not stated; the photographer's other work suggests Indonesia). Caption it as process, not place, for example "Washed: cherries sorted in water", never "Hambela Wamena". No free Unsplash photo of an Ethiopian washing station was found.
- Crop, 1440 (supporting image, about 640px wide, 3:2): the floating cherry surface, focal point 50% x, 50% y; pattern holds at any crop.
- Crop, 390: 1:1, same center. Safe at small sizes because there is no subject to lose.

## Alternates (the other candidates)

| Role | Photo | Photographer | Note |
|---|---|---|---|
| hero 1b | https://unsplash.com/photos/a-cup-of-coffee-next-to-a-bag-of-coffee-beans-jNbq6Vy0EII | Matt Phillips, https://unsplash.com/@ksumatt13 | Product shot, bag plus mug, studio background. More room for type; check the bag for a printed brand. |
| hero 1c | https://unsplash.com/photos/coffee-beans-on-table-zlwDJoKTuA8 | Mike Kenneally, https://unsplash.com/@asthetik | Beans on a table, Nikon D600, 2016. No bag, so no label risk; less product story. |
| roaster 2b | https://unsplash.com/photos/coffee-beans-tumbling-in-a-roasting-machine-G4iBY_MUmtk | Ichsan Chairul, https://unsplash.com/@__humanbean | Same Umbra shoot; beans tumbling. Use if 2 shows a badge. |
| roaster 2c | https://unsplash.com/photos/coffee-seeds-MjvOQ__XFgI | Gregory Hayes (profile linked from the photo page) | Top-down beans in a small roaster, Xining, Canon 6D. Caption says HDR: check for an overcooked look. |
| cupping 3a | https://unsplash.com/photos/pLPZjZL8cII | René Porter, https://unsplash.com/@reneporter | Same session as 3, "person brewing coffee", tagged cupping. Also 7RYrEvbqFM8 (breaking the crust). |
| cupping 3b | https://unsplash.com/photos/coffee-is-brewing-in-a-pour-over-coffee-maker-PIRNODAC1WA | William Figueroa, https://unsplash.com/@wifigueroa | V60 pour-over, Sony a6100, 2025. Fallback if the cupping frames carry readable cards. |
| cupping 3c | https://unsplash.com/photos/steam-rising-from-freshly-brewed-coffee-in-a-pour-over-set-iJMsWOHPFVM | Lera Ginzburg, https://unsplash.com/@ginzburg_l | Pour-over with steam, Fujifilm X100VI, 2026. Quieter, more lifestyle. |
| origin 4b | https://unsplash.com/photos/imp-b2kcb08 | LIVESTART STIVEN, https://unsplash.com/@livestart | Hands picking ripe cherries, Sony ZV-E10, 2025. Human, but harvest, not washing. |
| origin 4c | https://unsplash.com/photos/close-up-of-ripening-coffee-cherries-on-a-branch-gTqCoIPy464 | dennis epema, https://unsplash.com/@dennisepema | Cherries on a branch, Canon R6 II, 2026. Safest, most generic. |

## Rejected

- https://unsplash.com/photos/WyWbcqwb9oo and https://unsplash.com/photos/S378C4t-upU (Zoshua Colah): strong cooling-tray shots, but taken at the Starbucks Reserve Roastery, Seattle, per the caption. A chain flagship behind an independent roaster's page is a brand problem.
- Photos from Battlecreek Coffee Roasters' account: a real roaster's own brand imagery.
- Unsplash+ results (for example Fellipe Ditadi W8uY2GXoia4, Getty Images cupping frames): not under the free license.

## Gaps

- No real Ethiopia Guji or washing station photo under the free license. The honest fix is the roaster's own photos from the station, or a licensed photo from the importer.
- Visual check outstanding for all four (see Status).
