// Motion scenarios for ferry.html. Run from the repo root:
//   node skills/design-motion/assets/motion-audit.mjs kb/tests/benchmark/round2/landing/src/scenarios.mjs kb/tests/benchmark/round2/landing/shots/motion
const P = 'kb/tests/benchmark/round2/landing/ferry.html';
const into = (sel) => async ({ page }) => page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center', behavior: 'instant' }), sel);
export default [
  { name: 'hero-lanes', url: P, clip: '.run', expect: 'motion', frames: 7,
    note: 'The one hero reveal: the balance splits into seven lanes, row by row (scaleY at --duration-page, --ease-enter, 40 ms apart), dots pop at --duration-base. Everything settles by 640 ms.',
    setup: async ({ page }) => page.evaluate(() => document.documentElement.classList.remove('js')),
    trigger: async ({ page }) => page.evaluate(() => document.documentElement.classList.add('js')) },
  { name: 'menu-pointer', url: P, width: 390, height: 844, clip: '.header', pad: 0, expect: 'motion', frames: 5,
    note: 'Phone menu opened by tap: fade and 8px drop at --duration-base, --ease-enter.',
    trigger: async ({ page }) => page.click('[data-menu]') },
  { name: 'menu-keyboard', url: P, width: 390, height: 844, clip: '.header', pad: 0, expect: 'none', frames: 2,
    note: 'Same menu opened with the keyboard: appears at once.',
    trigger: async ({ page }) => { await page.focus('[data-menu]'); await page.keyboard.press('Enter'); } },
  { name: 'faq-open', url: P, clip: '.faq details:first-child', pad: 12, expect: 'motion', frames: 5,
    note: 'Native details: block size from 0 to auto at --duration-base, --ease-standard; the plus turns 45 degrees in the same time.',
    setup: into('.faq'), trigger: async ({ page }) => page.click('.faq details:first-child summary') },
  { name: 'stepper-press', url: P, clip: '.calc', pad: 12, expect: 'motion', frames: 4,
    note: 'Plus pressed: scale 0.94 at --duration-instant; the total changes at once (no counting animation on a price).',
    setup: into('.calc'), trigger: async ({ page }) => { const b = await page.$('[data-step="1"]'); const r = await b.boundingBox(); await page.mouse.move(r.x + 20, r.y + 20); await page.mouse.down(); } },
  { name: 'stepper-keyboard', url: P, clip: '.calc', pad: 12, expect: 'none', frames: 2,
    note: 'Arrow Up in the number field: value and total change with no motion.',
    setup: into('.calc'), trigger: async ({ page }) => { await page.focus('#people'); await page.keyboard.press('ArrowUp'); } },
  { name: 'signup-sent', url: P, clip: '.hero__copy', expect: 'motion', frames: 5,
    note: 'After a valid email: busy (spinner appears, label kept), then the sent panel fades and rises 8px at --duration-base, --ease-enter.',
    setup: async ({ page }) => { await page.fill('#email', 'dana@lumen.studio'); await page.click('[data-signup] button'); await page.waitForTimeout(700); },
    trigger: async () => {}, wait: 1200 },
];
