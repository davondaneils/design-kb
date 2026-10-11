"""Converts the round 3 PNG renders to JPEG q80 (full PNG renders were 123 MB) and gives state shots plain names:
coffee.html?state=cart-390-light.png -> states/coffee.state-cart-390-light.jpg. Run from the repo root after render-all.mjs."""
import os, re
from PIL import Image
root = 'kb/tests/round4/shots'
for d, _, files in os.walk(root):
    for f in files:
        if not f.endswith('.png'):
            continue
        name = re.sub(r'\.html\?', '.', f).replace('=', '-')
        src = os.path.join(d, f)
        Image.open(src).convert('RGB').save(os.path.join(d, name[:-4] + '.jpg'), quality=80, optimize=True, progressive=True)
        os.remove(src)
