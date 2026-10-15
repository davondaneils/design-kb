// Critic scratch: film the hero product scene at intervals, with and without reduced motion; check pause at 390.
import { launch, toUrl } from '../../../../../tools/browser.mjs';
const url = toUrl('/home/user/design-kb/kb/tests/fresh/landing/halyard.html');
const out = '/home/user/design-kb/kb/tests/fresh/landing/critic/film/';
const b = await launch();
const times = [0,300,700,1200,1700,2300,3000,3700,4300,5000,5700,6500,7300,8200,9000,10000,11000,12000,13500,15000,16000,17500];
for (const [w, rm] of [[1440,'no-preference'],[1440,'reduce'],[390,'no-preference']]) {
  const ctx = await b.newContext({ viewport:{width:w,height:w<600?844:900}, reducedMotion: rm });
  const p = await ctx.newPage();
  const t0 = Date.now(); await p.goto(url);
  if (w===390) await p.evaluate(()=>document.querySelector('.hero__fig').scrollIntoView({block:'center'}));
  const log=[];
  for (const t of (rm==='reduce'? [0,1000,3000,6000] : times)) {
    const wait = t - (Date.now()-t0); if (wait>0) await p.waitForTimeout(wait);
    const st = await p.evaluate(()=>{const s=document.querySelector('#hero-scene');return {state:s.dataset.state, seen:s.dataset.seen, seam:s.hasAttribute('data-scene-seam'), still:s.hasAttribute('data-scene-still'), paused:s.hasAttribute('data-scene-paused'), status:[...s.querySelectorAll('.status .st')].filter(e=>getComputedStyle(e).visibility==='visible').map(e=>e.innerText.trim()).join('/'), pauseVisible: getComputedStyle(document.querySelector('[data-scene-pause]')).display}});
    log.push([Date.now()-t0, JSON.stringify(st)]);
    await p.locator('.hero__fig').screenshot({ path: `${out}${w}-${rm}-${String(t).padStart(5,'0')}.png` });
  }
  console.log(w, rm); for (const l of log) console.log('  ', l.join(' '));
  if (w===390) {
    const before = await p.evaluate(()=>document.querySelector('#hero-scene').hasAttribute('data-scene-paused'));
    await p.locator('[data-scene-pause]').click(); await p.waitForTimeout(300);
    const after = await p.evaluate(()=>({paused:document.querySelector('#hero-scene').hasAttribute('data-scene-paused'), pressed: document.querySelector('[data-scene-pause]').getAttribute('aria-pressed'), state: document.querySelector('#hero-scene').dataset.state}));
    await p.waitForTimeout(4000);
    const later = await p.evaluate(()=>document.querySelector('#hero-scene').dataset.state);
    console.log('390 pause: before paused', before, 'after', JSON.stringify(after), 'state 4s later', later);
  }
  await ctx.close();
}
await b.close();
