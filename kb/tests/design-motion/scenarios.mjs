// Motion scenarios for skills/design-motion/assets/motion-audit.mjs (run from the repo root):
//   node skills/design-motion/assets/motion-audit.mjs kb/tests/design-motion/scenarios.mjs kb/tests/design-motion/strips
// Each scenario is one user action on one of the two slice pages. expect: 'none' marks actions that must not animate.
const C = 'kb/tests/design-motion/coffee.html';
const D = 'kb/tests/design-motion/dashboard.html';
const into = (sel) => async ({ page }) => page.evaluate((s) => document.querySelector(s).scrollIntoView({ block: 'center', behavior: 'instant' }), sel);

export default [
  // ---------- Coffee landing page ----------
  { name: 'coffee-1-roast-curve', url: C, clip: '.plot', expect: 'motion', frames: 7,
    note: 'Two-transform wipe at --duration-page (600 ms), linear because x is time. Markers pop at --duration-fast as the pen passes (delay = share of the time axis x 600 ms), labels one instant later.',
    trigger: into('.curve') },
  { name: 'coffee-2-contour-rise', url: C, clip: '.cards .tile', expect: 'motion', frames: 6,
    note: 'Contours fade in from the lowest level to the summit, opacity only, --duration-base with --ease-enter, step 300/levels ms so the last level starts within 300 ms.',
    trigger: into('.cards') },
  { name: 'coffee-3a-add-to-cart-button', url: C, clip: '.cards > li:first-child .card-foot', pad: 12, expect: 'motion', frames: 6,
    note: 'Press, then fade-through: "Add to cart" leaves in --duration-instant (exit), "Added" arrives over --duration-base (enter) after it, the check draws itself in the same 200 ms.',
    setup: into('.cards'), trigger: async ({ page }) => page.click('.cards > li:first-child .add-btn') },
  { name: 'coffee-3b-cart-badge', url: C, clip: '#cart-count', pad: 12, expect: 'motion', frames: 6,
    note: 'Same click, filmed at the cart: the old digit leaves upward (--duration-fast, exit), the new one rolls up from below (--duration-base, enter), the badge bumps to 1.15 once (--duration-base, standard).',
    setup: into('.cards'), trigger: async ({ page }) => page.click('.cards > li:first-child .add-btn') },
  { name: 'coffee-4-card-hover', url: C, clip: '.cards > li:nth-child(2)', expect: 'motion', frames: 5,
    note: 'Lift 2px (transform) while a pseudo-element holding the deeper shadow fades in (opacity); box-shadow itself never animates.',
    setup: into('.cards'), trigger: async ({ page }) => page.hover('.cards > li:nth-child(2) .card-body') },
  { name: 'coffee-5-newsletter-success', url: C, clip: '#news', expect: 'motion', frames: 5,
    note: 'Confirmation rises 4px into place at --duration-base with --ease-enter. The spinner before it only appears after 300 ms.',
    setup: async ({ page }) => {
      await into('#news')({ page });
      await page.fill('#email', 'dana@example.com');
      await page.click('#news-btn');
      await page.waitForTimeout(600);
    },
    trigger: async () => {}, wait: 1200 },
  // ---------- Tally dashboard ----------
  { name: 'dash-1-live-kpi', url: D + '?demo=live', clip: '.kpis.ready', expect: 'motion', frames: 6,
    note: 'A live poll changes two KPIs while they are on screen. Only the changed digits roll: the old digit leaves upward (--duration-fast, exit), the new one rises from below (--duration-base, enter). Up means the number rose. Never on first load.',
    trigger: async () => {}, wait: 2000 },
  { name: 'dash-2-row-menu', url: D, clip: '#row-menu, #pages-body tr:first-child .row-btn', expect: 'motion', frames: 5,
    note: 'Opacity plus scale 0.95 to 1 from the top-right corner (the trigger side), --duration-fast with --ease-enter. Focus moves to the first item at the start, not the end.',
    setup: async ({ page }) => page.hover('#pages-body tr:first-child'), trigger: async ({ page }) => page.click('#pages-body tr:first-child .row-btn') },
  { name: 'dash-3-sheet-pointer', url: D, clip: '#sheet', pad: 48, expect: 'motion', frames: 5,
    note: 'Opened with the mouse: fade plus scale 0.96 to 1 at --duration-base (enter); the backdrop fades with it.',
    trigger: async ({ page }) => page.click('.sidebar [data-open=sheet]') },
  { name: 'dash-4-sheet-keyboard', url: D, clip: '#sheet', pad: 48, expect: 'none', frames: 2,
    note: 'The same sheet opened with the ? shortcut: no transition at all (keyboard paths never animate).',
    trigger: async ({ page }) => { await page.mouse.click(700, 140); await page.keyboard.press('Shift+Slash'); } },
  { name: 'dash-5-palette-pointer', url: D, clip: '#palette', pad: 48, expect: 'motion', frames: 4,
    note: 'Opened by clicking Commands: a 100 ms fade, no scale. The palette is used dozens of times a day, so it gets the smallest motion budget.',
    trigger: async ({ page }) => page.click('.page-head .cmd-btn') },
  { name: 'dash-6-palette-keyboard', url: D, clip: '#palette', pad: 48, expect: 'none', frames: 2,
    note: 'Ctrl K: the palette is simply there (Kowalski: Raycast has no open animation, "the optimal experience").',
    trigger: async ({ page }) => { await page.mouse.click(700, 140); await page.keyboard.press('Control+k'); } },
  { name: 'dash-7-phone-drawer', url: D, width: 390, height: 844, scheme: 'dark', clip: '.app', pad: 0, expect: 'motion', frames: 6,
    note: 'Phone navigation drawer: slides in at --duration-slow with --ease-enter while the scrim fades; focus lands on the current page link at the start.',
    trigger: async ({ page }) => page.click('#menu-btn') },
  { name: 'dash-8-retry-rows', url: D + '?state=partial', clip: '.ready-table', expect: 'motion', frames: 6,
    note: 'After Retry, the six rows fade in once, 30 ms apart (--duration-base, enter); the last starts at 150 ms. Sorting the same rows later never staggers.',
    trigger: async ({ page }) => page.click('#retry') },
  { name: 'dash-9-sort-arrow', url: D, clip: 'thead th[data-key=views]', pad: 12, expect: 'motion', frames: 4,
    note: 'Flipping the sort direction turns the arrow 180 degrees at --duration-fast; the rows re-sort instantly.',
    trigger: async ({ page }) => page.click('thead th[data-key=views] .sort') },
  { name: 'dash-10-switch', url: D + '?open=sheet', clip: '.switch-row', pad: 12, expect: 'motion', frames: 4,
    note: 'Switch thumb moves with transform (not left) at --duration-instant; the track color changes in the same 100 ms.',
    trigger: async ({ page }) => page.click('#single-keys') },
];
