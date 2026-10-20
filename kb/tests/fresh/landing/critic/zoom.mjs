// Critic scratch: element screenshots at DPR 2. Usage: node zoom.mjs
import { launch, toUrl } from '../../../../../tools/browser.mjs';
const url = toUrl('/home/user/design-kb/kb/tests/fresh/landing/halyard.html');
const out = '/home/user/design-kb/kb/tests/fresh/landing/critic/zoom/';
const b = await launch();
const jobs = [
  [1440,'light','.stage--map','map-1440-light'],[1440,'dark','.stage--map','map-1440-dark'],
  [1024,'light','.stage--map','map-1024-light'],[768,'light','.stage--map','map-768-light'],[390,'light','.stage--map','map-390-light'],
  [1440,'light','#how .card:nth-child(3) .stage','daylight-1440'],[390,'light','#how .card:nth-child(3) .stage','daylight-390'],
  [1440,'light','#how .card:nth-child(2) .stage','wind-1440'],
  [390,'light','#route .stage','route-390'],[390,'dark','#route .stage','route-390-dark'],
  [1440,'dark','.hero__fig','hero-1440-dark'],[390,'light','.hero__fig','hero-390-light'],
  [390,'light','.site-foot','foot-390'],[390,'dark','.site-foot','foot-390-dark'],
  [390,'light','#pricing','pricing-390'],[1440,'dark','#warnings','warn-1440-dark'],
];
for (const [w,s,sel,name] of jobs) {
  const ctx = await b.newContext({ viewport:{width:w,height:900}, deviceScaleFactor:2, colorScheme:s, reducedMotion:'reduce' });
  const p = await ctx.newPage(); await p.goto(url); await p.evaluate(()=>document.fonts.ready);
  const el = await p.$(sel); await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(300);
  await el.screenshot({ path: out+name+'.png' }); await ctx.close();
}
await b.close(); console.log('ok');
