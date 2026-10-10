"""Cropped and resized derivatives of the generated test-bench photos (kb/assets/photos/README.md), for srcset.
Run from the repo root: python3 kb/tests/round4/photos.py
Writes kb/assets/photos/<name>-<w>.webp and .jpg (WebP q80, JPEG q82 progressive, same as the masters).

Art direction (design-art-direction 02, design-graphic 03):
- hero-bag: the green (unroasted) beans stay in every crop (README use note: they point to origin).
  portrait 4:5 (bag centred, window edge right) for desktop and phone; the full 3:2 frame for tablet, where the
  photo spans the column and the room (grinder, shelf, window light) earns its width.
  The blank label sits at x 725..918, y 364..618 of the 1264x848 master (measured: cream pixels); the page prints
  the live label onto it, so every crop records where the label lands, in percent.
- roaster-drop: wide 2:1 for desktop (the drum door, the falling beans and the cooling tray), 4:3 centred on the
  falling beans for phones.
- cupping: cropped above the table edge so no cup label is in frame (README use note: the labels are garbled AI text);
  the out-of-focus roaster badge behind her is softened further so no letterform reads.
"""
from PIL import Image, ImageFilter
import json, os

SRC = 'kb/assets/photos'
LABEL = (725, 364, 918, 618)
out = {}


def save(im, name, widths):
    files = []
    for w in widths:
        h = round(im.height * w / im.width)
        r = im if w == im.width else im.resize((w, h), Image.LANCZOS)
        base = f'{SRC}/{name}-{w}'
        r.save(base + '.webp', 'WEBP', quality=80, method=6)
        r.convert('RGB').save(base + '.jpg', 'JPEG', quality=82, progressive=True, optimize=True)
        files.append((w, h, os.path.getsize(base + '.webp'), os.path.getsize(base + '.jpg')))
    return files


def label_pct(box):
    x0, y0, x1, y1 = box
    lx0, ly0, lx1, ly1 = LABEL
    w, h = x1 - x0, y1 - y0
    return {'left': round((lx0 - x0) / w * 100, 2), 'top': round((ly0 - y0) / h * 100, 2),
            'width': round((lx1 - lx0) / w * 100, 2), 'height': round((ly1 - ly0) / h * 100, 2)}


bag = Image.open(f'{SRC}/hero-bag.jpg').convert('RGB')
portrait = (481, 0, 1159, 848)          # 678 x 848, 4:5, bag centre x 820
out['hero-bag-portrait'] = {'box': portrait, 'label': label_pct(portrait), 'files': save(bag.crop(portrait), 'hero-bag-portrait', [678, 480])}
full = (0, 0, 1264, 848)
out['hero-bag'] = {'box': full, 'label': label_pct(full), 'files': save(bag, 'hero-bag', [1264, 960, 640])}

drop = Image.open(f'{SRC}/roaster-drop.jpg').convert('RGB')
wide = (0, 150, 1264, 782)              # 1264 x 632, 2:1
out['roaster-drop-wide'] = {'box': wide, 'files': save(drop.crop(wide), 'roaster-drop-wide', [1264, 960, 640])}
tight = (380, 160, 1164, 748)           # 784 x 588, 4:3
out['roaster-drop-tight'] = {'box': tight, 'files': save(drop.crop(tight), 'roaster-drop-tight', [784, 520])}

cup = Image.open(f'{SRC}/cupping.jpg').convert('RGB')
badge = (262, 318, 448, 410)            # out-of-focus roaster badge: soften so no letterform reads
soft = cup.filter(ImageFilter.GaussianBlur(5))
mask = Image.new('L', cup.size, 0)
mask.paste(255, badge)
cup = Image.composite(soft, cup, mask.filter(ImageFilter.GaussianBlur(14)))   # feathered: no seam at the patch edge
crop = (180, 36, 1004, 676)             # 824 x 640: cup rims and crust in frame; cup numbers (y 680+) and table labels (y 740+) out
out['cupping-crop'] = {'box': crop, 'files': save(cup.crop(crop), 'cupping-crop', [824, 560])}

print(json.dumps(out, indent=1))
