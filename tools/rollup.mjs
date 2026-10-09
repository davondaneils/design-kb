#!/usr/bin/env node
// Librarian rollup: regenerate the table in kb/TOPIC_MAP.md from kb/status/*.md.
// Usage: node tools/rollup.mjs   (run from anywhere)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dir = path.join(root, 'kb/status');
const rows = [];
for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.md'))) {
  const text = fs.readFileSync(path.join(dir, f), 'utf8');
  const field = (name) => (text.match(new RegExp(`^\\| ${name}[^|]*\\| (.*?) \\|$`, 'm')) || [])[1] || '';
  rows.push({
    n: Number(field('Domain number')) || 99, layer: field('Layer') || 'reference',
    domain: (text.match(/^# (.+)$/m) || [])[1] || f,
    skill: field('Skill'), branch: field('Branch'),
    status: field('Status'), shipped: field('Shipped version'), file: `status/${f}`,
  });
}
const order = ['foundation', 'spine', 'playbook', 'reference', 'linked', 'archived'];
const rank = (r) => (order.indexOf(r.layer) + 1) || order.length + 1;
rows.sort((a, b) => rank(a) - rank(b) || a.n - b.n);
const table = ['| # | Layer | Domain | Skill | Branch | Status | Shipped | Status file |', '|---|---|---|---|---|---|---|---|',
  ...rows.map((r) => `| ${r.n} | ${r.layer} | ${r.domain} | ${r.skill} | ${r.branch} | ${r.status} | ${r.shipped} | \`${r.file}\` |`)].join('\n');
const mapPath = path.join(root, 'kb/TOPIC_MAP.md');
const map = fs.readFileSync(mapPath, 'utf8');
const out = map.replace(/\| # \|[\s\S]*?\n(?=\n## )/, table + '\n');
fs.writeFileSync(mapPath, out);
console.log(`TOPIC_MAP.md: ${rows.length} rows`);
