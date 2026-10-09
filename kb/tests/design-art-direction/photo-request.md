# Photo request: Ember and Oak homepage

Written by the tester with design-art-direction `references/05-requesting-photography.md`, as Claude would send it to the roaster with the page. The page ships today with drawn stand-ins (contour maps, the roast curve, the bag). These photos add proof of the real place and people; the drawn system stays.

---

Photos for the Ember and Oak homepage, 3 moments. A phone is fine. Please send the original files (not screenshots, not chat-app copies); AirDrop or a shared folder.

Setup for all shots: the big window by the cupping table, side light, no flash, overhead lights off, the oak cupping table as the surface, between 10am and 1pm on one morning. Wipe the lens first.

1. **Hero (replaces the drawn bag on the right of the headline).** A bag of the current single origin standing on the cupping table, label facing the camera, a few green beans in front. Hold the phone upright. Keep the left third of the frame clear (table and wall only).
   Then the same setup with the phone sideways, and one close-up of the label.
   Used at 1,440 px wide on computers and 1,170 px on phones: any modern phone photo is big enough. Crop 4:5 on phones, 3:2 on computers.
   Alt text (already written): "A bag of Ethiopia Guji on the cupping table at the Portland roastery."
2. **How we roast (sits beside the roast curve; does not replace it).** The 1962 Probat with the door open as a batch drops, beans tumbling into the cooling tray. Phone sideways, then upright, then a close-up of the beans in the tray.
   Alt: "Ethiopia Guji dropping into the cooling tray of the 1962 Probat drum roaster."
3. **For a future team page.** The head roaster cupping: leaning over the table, spoon at the bowl. Square and upright. Their face fully in frame, looking at the cups, not the camera.
   Alt: "[Name], head roaster, cupping a new lot."

Before the full set, send me shot 1 only so I can check the light.

Please confirm you own these photos and that anyone recognizable is happy to appear on the site.

---

## Slot notes (for whoever drops the files in)
| Slot | Ratio | Minimum file | `object-position` start | Treatment |
|---|---|---|---|---|
| Hero | 4:5 phone, 3:2 desktop (`<picture>`) | 1170 x 1463 phone, 1440 wide desktop half-column | set on the bag label, about `55% 60%` | true color; no grade beyond white balance (the product's color matters) |
| How we roast | 3:2 | 1440 wide | on the drum door, about `40% 55%` | warm monochrome if the light is mixed (`assets/duotone_matrix.py "#16100c" "#f9f6f4"`); the roast curve stays the one orange element |
| Team | 1:1 | 1080 square | eyes on the upper third line | same as story |
The shop card tiles stay drawn: each coffee's contour map is the system, not a stand-in.
