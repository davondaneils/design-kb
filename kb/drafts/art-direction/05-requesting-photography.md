# 05 Requesting real photography

Sources: `kb/research/art-direction/05-requesting-photography.md` (R-numbers) and 02 (Ph-numbers). Professional shoot brief fields live in design-graphic 03; this chapter is the version Claude sends to a user who has a phone, a product and no photographer. Opinion is marked (opinion).

## Floor: fundamentals (non-negotiable)
1. **Every request is tied to a slot** on the page: ratio, minimum pixel size, focal point, where text will sit, and its alt text. No "send me some photos". [judged]
2. **Minimum size** is the larger of: largest CSS width x 2 on desktop, largest CSS width x 3 on phones, and the platform norm (product squares 2048 x 2048) [R1][R2][Ph10]. [judged]
3. **Color**: files in sRGB, or with an embedded color profile [R3]. Phone photos are fine; screenshots of photos are not. [judged]
4. **Rights**: the user confirms they own the photo or have a license and releases for recognizable people (design-graphic 03). [judged]
5. **The slot does not move when the file arrives**: `width` and `height` or `aspect-ratio` set, `object-fit: cover`, `object-position` from the focal point [Ph7][R5]. [judged]
6. **The hero photo is not lazy loaded** and gets `fetchpriority="high"` when it is the LCP element; it is an `<img>`, not a CSS background [R6][R7][R8]. [judged]

## Numbers (derived: CSS width x device pixel ratio)
| Slot | Ratio | Minimum file | Ask for |
|---|---|---|---|
| Full-bleed desktop hero | 16:9 or 3:2 | 3072 px wide | 3000+ px long edge, landscape |
| Half-width hero image | 4:5 or 1:1 | 1440 px wide | 2000+ px, portrait |
| Phone hero | 4:5 | 1170 x 1463 | same frame as desktop hero, shot vertical |
| Product card | 1:1 | 720 square | 2048 x 2048 [Ph10] |
| Team portrait | 1:1 or 4:5 | 288 square | 1080 square or larger |
| Open Graph | 1.91:1 | 1200 x 630 | made by Claude from the hero (design-graphic 05) |
Most phones since about 2018 shoot 3000 px or more on the long edge, so the phone default is enough for every slot. (opinion; check the file's pixel size when it arrives)

## Decision rules
- **Ask for the moment as a verb**, not a subject: "pouring beans into the hopper", not "the roaster" (design-graphic 03).
- **One window, one surface, one time of day for a whole set.** It is the cheapest consistency move a non-photographer can make. Side light from a window, no overhead lights, no flash. (opinion)
- **Shoot each moment three ways**: landscape wide, vertical, and a close detail. That covers 16:9, 4:5 and 1:1 crops (design-graphic 03).
- **Leave room for the headline** where the layout needs it: "keep the left third empty: wall or table only".
- **Ask for a test frame first.** One photo before the full set; check light, focus and size, then send corrections. (opinion)
- **Never ask a user to stage fake customers.** Staff and real customers with consent only.
- **When files arrive**: check pixel size, profile, focus at 100 percent, faces and labels inside every crop at 390 and 1440, then set `object-position` per image (02).

## The request template (copy, fill the brackets, send)
```
Photos for [page], [n] shots. A phone is fine. Please send the original files (not screenshots,
not WhatsApp-compressed); email, AirDrop or a shared folder.

Setup for all shots: [one window, side light], no flash, overhead lights off,
[surface: the oak workbench], between [10am and 2pm]. Wipe the lens.

1. [Slot: hero]. [Verb: Roaster pouring green beans into the hopper]. Hold the phone sideways.
   Keep the left third of the frame empty (wall only); that is where the headline goes.
   Then the same moment, phone upright, and one close-up of the hands and beans.
   Used at: [3000 px wide], crop 16:9 on computers, 4:5 on phones.
2. ...

Before the full set, send me shot 1 only so I can check the light.
Please confirm you own these photos and that anyone recognizable is happy to appear.
```

## The slot contract (code that waits for the photo)
```html
<figure class="slot slot--hero">
  <img src="hero-4x5.avif" width="1170" height="1463" alt="[alt written now]"
       fetchpriority="high" style="--focus: 40% 55%">
</figure>
.slot img { width: 100%; height: 100%; object-fit: cover; object-position: var(--focus, 50% 50%); }
.slot--hero { aspect-ratio: 4 / 5; } @media (min-width: 768px) { .slot--hero { aspect-ratio: 3 / 2; } }
```
Until the photo arrives, the same `figure` holds the drawn stand-in (04). Swapping in the file changes no layout.

## Ceiling: signature moves
1. **Write the alt text when you write the request.** It forces you to say what the photo must show, and it is ready when the file arrives. (opinion)
2. **Specify the empty third.** Naming where text goes is the difference between a usable hero and a crop that fights the headline (design-graphic 03 shoots to the layout).
3. **Same light, same surface, same hour** turns twelve phone photos into a set before any grading. (opinion)
4. **Request the detail shot every time.** Hands, material, texture: the 1:1 detail is what card thumbnails and social crops actually use. (opinion)
5. **Treat the arriving set with the concept (01) and the treatment rule (02)**, not ad hoc. The concept decided the crop family and grade before the shoot.

## Do and don't
| Do | Don't |
|---|---|
| "Pouring beans into the hopper, left third empty, sideways then upright" | "A nice photo of the roastery" |
| Original files, sRGB | Screenshots or chat-app compressed copies |
| One test frame first | Twenty photos, then discover the light was wrong |
| Slot with ratio and focus set before the photo arrives | Redesign the hero around whatever arrives |

## Worked example: Ember and Oak photo request
1. Hero (replaces the drawn bag): the bag of the current origin standing on the oak cupping table, window light from the left, left third empty, three ways. 3000 px plus. Alt: "A bag of Ethiopia Guji on the cupping table at the Portland roastery."
2. Story (sits beside the roast curve, does not replace it): the 1962 Probat with the door open and beans tumbling, vertical and detail.
3. Card tiles stay drawn (contour maps are the system); no photo requested.
4. People: the head roaster at the cupping table, slurping a spoon, for a future team page.
5. Same window, same table, same morning for all.

## Hand-offs
design-graphic 03 (professional shoot briefs, AI imagery), design-frontend 05 (srcset, formats, LCP), 02 (crops and treatment when files arrive).
