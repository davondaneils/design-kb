#!/usr/bin/env node
// Probe the computed style of the elements that hold given text on a live page.
//
// Usage: node kb/teardowns/probe.mjs <url> <width> "text one" ["text two" ...]
//
// For each text, finds the deepest visible element whose text contains it and
// prints font, color (with background and contrast), gradient fills, size,
// position and the first transition. Used to check headline and CTA details
// that the bulk measure cannot attribute.
import { launch } from '../../tools/browser.mjs';
const [url, w, ...texts] = process.argv.slice(2);
const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: Number(w) || 1440, height: 900 }, colorScheme: 'light',
  userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36' });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
await page.waitForTimeout(1500);
const out = await page.evaluate((texts) => texts.map((t) => {
  let best = null;
  for (const el of document.querySelectorAll('body *')) {
    if (!el.textContent.includes(t)) continue;
    const r = el.getBoundingClientRect(); if (!r.width) continue;
    best = el;
  }
  if (!best) return { t, found: false };
  const cs = getComputedStyle(best); const r = best.getBoundingClientRect();
  let bg = null; for (let e = best; e; e = e.parentElement) { const b = getComputedStyle(e).backgroundColor; if (b && !/rgba\(0, 0, 0, 0\)|transparent/.test(b)) { bg = b; break; } }
  return { t, tag: best.tagName.toLowerCase(), cls: String(best.className).slice(0, 60), font: `${cs.fontFamily.split(',')[0]} ${cs.fontSize}/${cs.lineHeight} w${cs.fontWeight} ls ${cs.letterSpacing} ${cs.textTransform !== 'none' ? cs.textTransform : ''}`,
    color: cs.color, bg, bgImage: cs.backgroundImage !== 'none' ? cs.backgroundImage.slice(0, 200) : null, clip: cs.webkitBackgroundClip || cs.backgroundClip,
    box: `${Math.round(r.x)},${Math.round(r.y + scrollY)} ${Math.round(r.width)}x${Math.round(r.height)}`, pad: cs.padding, radius: cs.borderRadius, border: cs.border, shadow: cs.boxShadow !== 'none' ? cs.boxShadow : null,
    transition: cs.transitionDuration !== '0s' ? `${cs.transitionProperty} ${cs.transitionDuration} ${cs.transitionTimingFunction}` : null, textWrap: cs.textWrap || cs.textWrapStyle, fontFeatures: cs.fontFeatureSettings };
}), texts);
console.log(JSON.stringify(out, null, 1));
await browser.close();
