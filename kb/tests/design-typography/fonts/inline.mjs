#!/usr/bin/env node
// Inlines font CSS into a test page: replaces each line `/* @inline name.css */` with that file.
// Usage: node inline.mjs <src.html> <out.html> [--no-fonts]
// --no-fonts drops the web fonts entirely, to check the page with only its fallback stack
// (what a visitor sees when the font is blocked, slow or not yet loaded).
import fs from 'node:fs';
import path from 'node:path';
const [src, out] = process.argv.slice(2);
const noFonts = process.argv.includes('--no-fonts');
const dir = path.dirname(new URL(import.meta.url).pathname);
const html = fs.readFileSync(src, 'utf8').replace(/\/\* @inline ([\w.-]+) \*\//g, (_, f) => {
  if (noFonts && !f.includes('fallback')) return `/* ${f} omitted: fallback test */`;
  return fs.readFileSync(path.join(dir, f), 'utf8');
});
fs.writeFileSync(out, html);
console.log(`${out}: ${(Buffer.byteLength(html) / 1024).toFixed(1)} KB`);
