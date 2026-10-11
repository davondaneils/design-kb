// Frame-time check for the heaviest moves, at 4x CPU throttle (design-motion review checklist: "tested at 4x CPU throttle").
// Run from the repo root: node kb/tests/design-motion/perf.mjs
// Measures requestAnimationFrame intervals for 900 ms after each trigger; a frame over 25 ms at 60 Hz is a dropped frame.
// Caveat: headless Chromium without a GPU, so compositor-only work is not fully offloaded; treat the numbers as relative.
import { launch, toUrl } from '../../../tools/browser.mjs';

const cases = [
  { name: 'coffee roast curve wipe', url: 'kb/tests/design-motion/coffee.html', trigger: (p) => p.evaluate(() => document.querySelector('.curve').scrollIntoView({ block: 'center', behavior: 'instant' })) },
  { name: 'coffee contour rise (37 paths)', url: 'kb/tests/design-motion/coffee.html', trigger: (p) => p.evaluate(() => document.querySelector('.cards').scrollIntoView({ block: 'center', behavior: 'instant' })) },
  { name: 'coffee before: clip-path draw (combined page)', url: 'kb/tests/combined/coffee.html', trigger: (p) => p.evaluate(() => document.querySelector('.curve').scrollIntoView({ block: 'center', behavior: 'instant' })) },
  { name: 'dashboard live digits', url: 'kb/tests/design-motion/dashboard.html?demo=live', trigger: async (p) => p.waitForTimeout(650) },
  { name: 'dashboard phone drawer', url: 'kb/tests/design-motion/dashboard.html', width: 390, trigger: (p) => p.click('#menu-btn') },
];

const browser = await launch();
for (const c of cases) {
  const ctx = await browser.newContext({ viewport: { width: c.width || 1440, height: 900 }, reducedMotion: 'no-preference' });
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await page.goto(toUrl(c.url), { waitUntil: 'load' });
  await page.waitForTimeout(300);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluate(() => {
    window.__ft = []; let last = performance.now(); const end = last + 1400;
    const f = (t) => { window.__ft.push(t - last); last = t; if (t < end) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  });
  await c.trigger(page);
  await page.waitForTimeout(1500);
  const ft = await page.evaluate(() => window.__ft.slice(1));
  ft.sort((a, b) => a - b);
  const p = (q) => ft[Math.min(ft.length - 1, Math.floor(q * ft.length))].toFixed(1);
  const dropped = ft.filter((x) => x > 25).length;
  console.log(`${c.name.padEnd(48)} frames ${String(ft.length).padStart(3)}  median ${p(0.5)} ms  p95 ${p(0.95)} ms  max ${ft[ft.length - 1].toFixed(1)} ms  over 25 ms: ${dropped}`);
  await ctx.close();
}
await browser.close();
