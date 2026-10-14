import { launch, toUrl } from '../../../../../tools/browser.mjs';
const url = toUrl('/home/user/design-kb/kb/tests/fresh/landing/halyard.html');
const b = await launch();
for (const scheme of ['light','dark']) {
  const ctx = await b.newContext({ viewport:{width:1440,height:900}, colorScheme: scheme, reducedMotion:'reduce' });
  const p = await ctx.newPage(); await p.goto(url);
  const r = await p.evaluate(() => {
    const cv = document.createElement('canvas').getContext('2d');
    const rgb = (c) => { cv.clearRect(0,0,1,1); cv.fillStyle = '#000'; cv.fillStyle = c; cv.fillRect(0,0,1,1); const d = cv.getImageData(0,0,1,1).data; return [d[0],d[1],d[2],d[3]]; };
    const bgOf = (el) => { while (el) { const c = getComputedStyle(el).backgroundColor; const v = rgb(c); if (v[3] > 250) return v; el = el.parentElement; } return [255,255,255,255]; };
    const pick = (sel, prop) => { const el = document.querySelector(sel); if (!el) return null; const cs = getComputedStyle(el); return { sel, prop, fg: rgb(cs[prop]), bg: bgOf(el.parentElement) }; };
    return [
      pick('.hero .btn--secondary','borderTopColor'), pick('.billing','borderTopColor'), pick('.faq summary .icon','color'),
      pick('.feat .icon','color'), pick('.hero .btn--primary','backgroundColor'), pick('.win','borderTopColor'),
      pick('.alerts .icon','color'), pick('.plan-card','borderTopColor'), pick('.menu-btn','color'), pick('.stn','fill'), pick('.track--wind .limit','borderTopColor'),
      { sel:'focus ring (outline color var)', prop:'--color-focus-ring', fg: rgb(getComputedStyle(document.documentElement).getPropertyValue('--color-focus-ring').trim()||'red'), bg: rgb(getComputedStyle(document.body).backgroundColor) },
      { sel:'focus ring on band', prop:'--color-focus-ring', fg: rgb(getComputedStyle(document.documentElement).getPropertyValue('--color-focus-ring').trim()||'red'), bg: bgOf(document.querySelector('#safety')) },
    ];
  });
  const L = ([r,g,b]) => { const f = (c) => { c/=255; return c<=0.03928? c/12.92 : ((c+0.055)/1.055)**2.4; }; return 0.2126*f(r)+0.7152*f(g)+0.0722*f(b); };
  for (const x of r) { if (!x) continue; const a=L(x.fg), c=L(x.bg); const cr=(Math.max(a,c)+0.05)/(Math.min(a,c)+0.05); console.log(scheme, x.sel, x.prop, 'fg', x.fg.join(','), 'bg', x.bg.join(','), cr.toFixed(2)); }
  await ctx.close();
}
await b.close();
