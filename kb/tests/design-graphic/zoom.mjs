// Close-up screenshots at DPR 2 (what a Retina reader sees), for judging icons and marks in context.
// Usage (repo root): node kb/tests/design-graphic/zoom.mjs page.html out.png x y w h [width=1440] [scheme=light]
import { launch, toUrl } from '../../../tools/browser.mjs';
const [page, out, x, y, w, h, vw = '1440', scheme = 'light'] = process.argv.slice(2);
const b = await launch();
const p = await b.newPage({ viewport: { width: +vw, height: 900 }, deviceScaleFactor: 2, colorScheme: scheme });
await p.goto(toUrl(page));
await p.waitForTimeout(300);
await p.screenshot({ path: out, fullPage: true, clip: { x: +x, y: +y, width: +w, height: +h } });
await b.close();
console.log('wrote', out);
