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
  beat('hero-aim', 'hero-scene', 'window', 'aim', '#hero-scene', { note: 'The replay, in place: plan values to placeholders and bars to grey, windows and labels retract, the count rolls back (about 0.6s, --offset apart); then the hand sets off from beside the button and presses.' }),
  beat('hero-press', 'hero-scene', 'aim', 'press', '#hero-scene', { note: 'The press: button .97, label rolls to Checking; the line alone crosses the day in 1200ms, bars turning as it passes; then Out, Back, the count and the button back, --offset apart, each window ringing out once.' }),
  beat('hero-window', 'hero-scene', 'press', 'window', '#hero-scene', { note: 'The result, its own beat: the plan values rise onto their reserved placeholders; nothing else moves.' }),
  beat('warn-saved', 'warn-scene', 'fri18', 'saved', '#warnings .stage', { note: 'The plan is saved at 18:10: the one-line note rises into the phone card.' }),
  beat('warn-forecast-swap', 'warn-scene', 'saved', 'fri21', '#warnings .stage', { note: 'The 21:00 forecast over about 1.2s: tag, pause, the bar edge retracts leaving the hatch, Leave time, 15:00, then the note texts cross in place.' }),
  beat('route-leg', 'route-scene', 'leave', 'jack', '#route .stage', { note: 'The boat sails the first leg (600ms on --ease-swap) drawing the line as its tip and settles at the mark; the readout holds (the map carries progress).' }),
  beat('route-leg-long', 'route-scene', 'hamstead', 'gurnard', '#route .stage', { note: 'The longest leg (42 min) takes 1200ms on screen.' }),
  beat('route-arrive', 'route-scene', 'gurnard', 'cowes', '#route .stage', { note: 'Cowes: the pin fills, the dot settles 1.0 to 1.3 to 1.0, then "Arrive Cowes 10:10" and the values roll in place.' }),
  beat('route-reset', 'route-scene', 'cowes', 'leave', '#route .stage', { note: 'The replay, in place: the drawn line retracts to Lymington with the boat (600ms) while the readout rolls back.' }),
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
