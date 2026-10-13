# Splits full-page screenshots into screen-height tiles so each can be read at full resolution.
# Usage: python3 src/crop.py shots/r1 [tile_height_ratio]
import sys, os
from PIL import Image
d = sys.argv[1]
os.makedirs(os.path.join(d, 'tiles'), exist_ok=True)
for f in sorted(os.listdir(d)):
    if not f.endswith('.png'): continue
    im = Image.open(os.path.join(d, f)); w, h = im.size
    th = 900 if w >= 1024 else (1024 if w == 768 else 844)
    th = int(th * (w / (w if im.size[0] == w else w)))
    n = 0
    for y in range(0, h, th):
        im.crop((0, y, w, min(h, y + th))).save(os.path.join(d, 'tiles', f[:-4] + f'-{n:02d}.png')); n += 1
    print(f, w, h, n)
