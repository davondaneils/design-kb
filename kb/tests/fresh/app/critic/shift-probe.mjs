// Critic scratch: does the timeline move under the pointer while a departure changes?
import { launch, toUrl } from '../../../../../tools/browser.mjs';
const P = process.argv[2];
const browser = await launch();
for (const w of [390, 768, 1024, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: w < 600 ? 844 : 900 } }); const page = await ctx.newPage();
  await page.goto(toUrl(P)); await page.waitForTimeout(300);
  const top = () => page.$eval('#p-plan', (e) => Math.round(e.getBoundingClientRect().top + scrollY));
  const t0 = await top(); const res = [];
  const h = (await page.$$('.handle'))[0]; await h.focus();
  let minT = t0, maxT = t0;
  for (let k = 0; k < 40; k++) { await page.keyboard.press('ArrowRight'); const t = await top(); minT = Math.min(minT, t); maxT = Math.max(maxT, t); }
  const hb = (await page.$$('.handle'))[1]; await hb.focus();
  for (let k = 0; k < 30; k++) { await page.keyboard.press('ArrowLeft'); const t = await top(); minT = Math.min(minT, t); maxT = Math.max(maxT, t); }
  for (let k = 0; k < 40; k++) { await page.keyboard.press('ArrowRight'); const t = await top(); minT = Math.min(minT, t); maxT = Math.max(maxT, t); }
  console.log(`${w}: plan lane top at load ${t0}; while stepping departures it ranged ${minT} to ${maxT} (moves ${maxT - minT}px)`);
  await ctx.close();
}
await browser.close();
