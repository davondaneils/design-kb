// Summarise every *.lint.json under the given folders: fails and warnings per file, and which checks warned.
// Usage: node kb/tests/design-copy/lint-summary.mjs <dir> [dir...]
import fs from 'node:fs';
import path from 'node:path';

for (const dir of process.argv.slice(2)) {
  for (const f of fs.readdirSync(dir).filter((n) => n.endsWith('.lint.json')).sort()) {
    const j = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    let fail = 0, warn = 0;
    const warned = {};
    for (const [name, c] of Object.entries(j.checks)) {
      fail += c.fail.length;
      warn += c.warn.length;
      if (c.warn.length) warned[name] = c.warn.length;
      if (c.fail.length) console.log(`  FAIL ${f} ${name}: ${c.fail.map((x) => x.message).join(' | ')}`);
    }
    console.log(`${path.join(dir, f)}  fail ${fail}  warn ${warn}  ${JSON.stringify(warned)}`);
  }
}
