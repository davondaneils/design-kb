// Renders src/favicon.svg to a 64px PNG (Google Search ignores SVG favicons; design-search 07). Run from the repo root.
import fs from 'node:fs';
import path from 'node:path';
import { launch } from '../../../../../../tools/browser.mjs';
const here = path.dirname(new URL(import.meta.url).pathname);
const svg = fs.readFileSync(path.join(here, 'favicon.svg'), 'utf8');
const browser = await launch();
const page = await browser.newPage({ viewport: { width: 64, height: 64 } });
await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace('<svg ', '<svg width="64" height="64" ')}</body></html>`);
await page.screenshot({ path: path.join(here, 'favicon-64.png'), omitBackground: true, clip: { x: 0, y: 0, width: 64, height: 64 } });
await browser.close();
console.log('favicon-64.png written');
