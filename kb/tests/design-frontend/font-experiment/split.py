import re, base64, sys, os, hashlib
src_path, out_dir, name = sys.argv[1], sys.argv[2], sys.argv[3]
mode = sys.argv[4] if len(sys.argv) > 4 else 'preload'
os.makedirs(out_dir, exist_ok=True)
s = open(src_path).read()
files = []
def rep(m):
    data = base64.b64decode(m.group(1))
    h = hashlib.sha1(data).hexdigest()[:8]
    fn = f'{name}-{h}.woff2'
    open(os.path.join(out_dir, fn), 'wb').write(data)
    files.append(fn)
    return f'url("{fn}")'
s = re.sub(r'url\("?data:font/woff2;base64,([A-Za-z0-9+/=]+)"?\)', rep, s)
if mode == 'preload':
    links = ''.join(f'<link rel="preload" href="{f}" as="font" type="font/woff2" crossorigin>\n' for f in files)
    s = s.replace('<style>', links + '<style>', 1)
open(os.path.join(out_dir, name + '.html'), 'w').write(s)
print(files)
