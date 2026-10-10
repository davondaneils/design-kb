# Head-script experiment (kb/tests/design-frontend.md). Builds placement variants of one small inline state script
# from a page whose state script sits in <head> before the <style>, then measure each with:
#   node skills/design-frontend/assets/vitals.mjs <variant>.html --runs 7 --profile desktop
# Usage: python3 variants.py <page-with-head-script.html> <out-dir>
import os, sys
src_path, out = sys.argv[1], sys.argv[2]
os.makedirs(out, exist_ok=True)
src = open(src_path).read()
i = src.index('<script>'); j = src.index('</script>', i) + len('</script>')
block, rest = src[i:j], src[:i] + src[j:]
def write(name, s): open(os.path.join(out, name + '.html'), 'w').write(s)
write('head', src)                                                     # before the <style>
k = rest.index('</style>') + len('</style>'); write('afterstyle', rest[:k] + block + rest[k:])
k = rest.index('<body>') + len('<body>'); write('bodystart', rest[:k] + block + rest[k:])
k = rest.rindex('<script'); write('bodyend', rest[:k] + block + rest[k:])  # just before the app script
