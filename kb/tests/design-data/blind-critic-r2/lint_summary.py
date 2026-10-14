import json,glob,sys,collections
for e in sys.argv[1:]:
    print('=====',e)
    agg=collections.Counter()
    for f in sorted(glob.glob(e+'/*.json')):
        d=json.load(open(f)); s=d['summary']
        fails=[c for c in d['checks'] if c.get('status')=='fail'] if isinstance(d['checks'],list) else [k for k,v in d['checks'].items() if v.get('status')=='fail']
        names=[c['name'] if isinstance(c,dict) else c for c in fails]
        print(f.split('/')[-1], s, names)
