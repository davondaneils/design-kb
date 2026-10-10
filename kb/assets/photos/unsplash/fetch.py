"""Download the chosen Unsplash photos and build the page sizes.

Run from a machine that can reach unsplash.com and images.unsplash.com:
    pip install pillow requests
    python kb/assets/photos/unsplash/fetch.py            # chosen photos only
    python kb/assets/photos/unsplash/fetch.py --sheets   # also small candidate thumbs

Output, next to this file: <role>.jpg (about 2400w, q82 progressive),
<role>-1600.webp and <role>-800.webp (q80). With --sheets, thumbs/<id>.jpg at 480w.
The /download endpoint is used on purpose: Unsplash API guidelines ask that a
download be registered with the photographer.
"""
import io, os, sys
import requests
from PIL import Image

HERE = os.path.dirname(os.path.abspath(__file__))
CHOSEN = {
    "hero": "x8q9Qdp1l9U",
    "roaster": "iwcZmTKFo0w",
    "cupping": "VXIOMNlnSos",
    "origin": "vnhz8fKYGUg",
}
CANDIDATES = {
    "hero": ["x8q9Qdp1l9U", "jNbq6Vy0EII", "zlwDJoKTuA8"],
    "roaster": ["iwcZmTKFo0w", "G4iBY_MUmtk", "MjvOQ__XFgI"],
    "cupping": ["VXIOMNlnSos", "pLPZjZL8cII", "PIRNODAC1WA", "iJMsWOHPFVM"],
    "origin": ["vnhz8fKYGUg", "imp-b2kcb08", "gTqCoIPy464"],
}

def get(photo_id, width):
    url = f"https://unsplash.com/photos/{photo_id}/download?force=true&w={width}"
    r = requests.get(url, timeout=60, allow_redirects=True)
    r.raise_for_status()
    return Image.open(io.BytesIO(r.content)).convert("RGB")

def resize(img, width):
    if img.width <= width:
        return img
    return img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)

def main():
    for role, pid in CHOSEN.items():
        img = get(pid, 2400)
        resize(img, 2400).save(os.path.join(HERE, f"{role}.jpg"), quality=82, progressive=True, optimize=True)
        for w in (1600, 800):
            resize(img, w).save(os.path.join(HERE, f"{role}-{w}.webp"), quality=80, method=6)
        print(role, pid, img.size)
    if "--sheets" in sys.argv:
        os.makedirs(os.path.join(HERE, "thumbs"), exist_ok=True)
        for role, ids in CANDIDATES.items():
            for pid in ids:
                resize(get(pid, 480), 480).save(os.path.join(HERE, "thumbs", f"{role}-{pid}.jpg"), quality=75)

if __name__ == "__main__":
    main()
