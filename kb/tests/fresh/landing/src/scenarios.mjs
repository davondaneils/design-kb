// motion-audit scenarios for halyard.html: one per user action or scene beat that moves anything.
// Run from the repo root: node skills/design-motion/assets/motion-audit.mjs kb/tests/fresh/landing/src/scenarios.mjs kb/tests/fresh/landing/reports/motion-audit
const url = 'kb/tests/fresh/landing/halyard.html';
const settle = (page, ms = 400) => page.waitForTimeout(ms);
// Under reduced motion every scene sits on its still frame and never steps, so the waits return at once.
const stateIs = (page, id, st) => page.waitForFunction(([i, s]) => matchMedia('(prefers-reduced-motion: reduce)').matches || document.getElementById(i).dataset.state === s, [id, st], { timeout: 20000 });
const into = (page, id) => page.evaluate((i) => document.getElementById(i).scrollIntoView({ block: 'center' }), id);
// One scenario per beat change: wait for the beat before, then film the change into the next.
const beat = (name, id, from, to, clip, extra = {}) => ({
  name, url, clip, wait: 4000, ...extra,
  setup: async ({ page }) => { if (id !== 'hero-scene') await into(page, id); await stateIs(page, id, from); },
  trigger: async ({ page }) => { await stateIs(page, id, to); },
});
export default [
  {
    name: 'hero-reveal', url, clip: '.hero__fig',
    note: 'The one hero reveal: the card rises 12px with its fade, 400ms on --ease-enter, while the headline is already in place. Replayed by re-adding the hero-go class.',
    trigger: async ({ page }) => { await page.evaluate(() => { const r = document.documentElement; r.classList.remove('hero-go'); void r.offsetWidth; r.classList.add('hero-go'); }); },
    wait: 2500,
  },
  beat('hero-aim', 'hero-scene', 'window', 'aim', '#hero-scene', { note: 'Next loop: the hand comes in from its rest point after the hold and travels to Find windows on the spring.' }),
  beat('hero-press', 'hero-scene', 'aim', 'press', '#hero-scene', { note: 'The press: button .97, label rolls to Checking; the sweep crosses the day in 1200ms and each window lands as the line passes its close.' }),
  beat('hero-window', 'hero-scene', 'press', 'window', '#hero-scene', { note: 'The result: the plan rises inside the card, the camera pushes.' }),
  beat('warn-saved', 'warn-scene', 'fri18', 'saved', '#warnings .stage', { note: 'The plan is saved at 18:10: the note rises into the phone card.' }),
  beat('warn-forecast-swap', 'warn-scene', 'saved', 'fri21', '#warnings .stage', { note: 'The 21:00 forecast: chip, window and against-tide time roll; the lost 25 minutes show as a hatched sliver and fade; the note swaps to the alert in place.' }),
  beat('route-leg', 'route-scene', 'leave', 'jack', '#route .stage', { note: 'The boat sails the first leg (600ms) drawing the line as its tip; clock and distance count up; the place name lands on arrival.' }),
  beat('route-leg-long', 'route-scene', 'hamstead', 'gurnard', '#route .stage', { note: 'The longest leg (42 min) takes 1600ms on screen.' }),
  {
    name: 'route-pause-click', url, clip: '#route .fig-foot',
    setup: async ({ page }) => { await into(page, 'route-scene'); await settle(page, 1200); },
    trigger: async ({ page }) => { const b = page.locator('[aria-controls="route-scene"]'); if (await b.isVisible()) await b.click(); },
  },
  {
    name: 'pause-click', url, clip: '.hero__fig .fig-foot',
    // Under reduced motion the scene is a still and scene.js hides the button: nothing to press.
    trigger: async ({ page }) => { const b = page.locator('[aria-controls="hero-scene"]'); if (await b.isVisible()) await b.click(); },
  },
  {
    name: 'primary-hover', url, clip: '.hero__copy .actions',
    trigger: async ({ page }) => { await page.hover('.hero__copy .btn--primary'); },
  },
  {
    name: 'billing-yearly-click', url, clip: '#plus',
    setup: async ({ page }) => { await page.locator('#pricing').scrollIntoViewIfNeeded(); await settle(page, 1200); },
    trigger: async ({ page }) => { await page.click('[data-billing-set="year"]'); },
  },
  {
    name: 'billing-yearly-keyboard', url, clip: '#plus',
    setup: async ({ page }) => { await page.locator('#pricing').scrollIntoViewIfNeeded(); await settle(page, 1200); await page.focus('[data-billing-set="year"]'); },
    trigger: async ({ page }) => { await page.keyboard.press('Space'); },
  },
  {
    name: 'faq-open-click', url, clip: '.faq details:first-child',
    setup: async ({ page }) => { await page.locator('#faq').scrollIntoViewIfNeeded(); await settle(page, 1200); },
    trigger: async ({ page }) => { await page.click('.faq details:first-child summary'); },
  },
  {
    name: 'faq-open-enter', url, clip: '.faq details:nth-child(2)',
    setup: async ({ page }) => { await page.locator('#faq').scrollIntoViewIfNeeded(); await settle(page, 1200); await page.focus('.faq details:nth-child(2) summary'); },
    trigger: async ({ page }) => { await page.keyboard.press('Enter'); },
  },
  {
    name: 'menu-open-390', url, width: 390, height: 844, clip: '.site-head', expect: 'motion',
    trigger: async ({ page }) => { await page.click('[data-menu]'); },
  },
  {
    name: 'reveal-how', url, clip: '#how',
    trigger: async ({ page }) => { await page.evaluate(() => document.querySelector('#how').scrollIntoView()); },
  },
  {
    name: 'reveal-route', url, clip: '#route',
    trigger: async ({ page }) => { await page.evaluate(() => document.querySelector('#route').scrollIntoView()); },
  },
  {
    name: 'reveal-warnings-390', url, width: 390, height: 844, clip: '#warnings',
    trigger: async ({ page }) => { await page.evaluate(() => document.querySelector('#warnings').scrollIntoView()); },
  },
];
