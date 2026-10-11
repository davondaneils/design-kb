// Render the social card and the PNG icons for the Set in Stone event page.
// Usage (from the repo root): node kb/tests/heldout/skilled/make-assets.mjs
import { launch } from '../../../../tools/browser.mjs';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const dir = path.dirname(fileURLToPath(import.meta.url));
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto('file://' + path.join(dir, 'og-card.html'));
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(dir, 'og.png'), clip: { x: 0, y: 0, width: 1200, height: 630 } });

const svg = readFileSync(path.join(dir, 'favicon.svg'), 'utf8');
for (const [name, size] of [['favicon-192.png', 192], ['apple-touch-icon.png', 180]]) {
  const p = await browser.newPage({ viewport: { width: size, height: size } });
  await p.setContent(`<html><body style="margin:0">${svg.replace('<svg ', `<svg width="${size}" height="${size}" `)}</body></html>`);
  await p.screenshot({ path: path.join(dir, name), omitBackground: true });
  await p.close();
}
await browser.close();
console.log('wrote og.png, favicon-192.png, apple-touch-icon.png');
