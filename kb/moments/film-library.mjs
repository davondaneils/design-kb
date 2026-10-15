// Film every moment in library.json (or the ids given) into kb/moments/clips/<id>.mp4 plus a 2fps overview sheet.
// node kb/moments/film-library.mjs [id ...] [--out dir]
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const here = path.dirname(new URL(import.meta.url).pathname);
const lib = JSON.parse(fs.readFileSync(path.join(here, 'library.json'), 'utf8'));
const args = process.argv.slice(2);
const oi = args.indexOf('--out');
const out = oi === -1 ? path.join(here, 'clips') : args[oi + 1];
const ids = args.filter((a, i) => !a.startsWith('--') && i !== oi + 1);
fs.mkdirSync(out, { recursive: true });
for (const m of lib.moments.filter((m) => !ids.length || ids.includes(m.id))) {
  const file = path.join(out, m.id + '.mp4');
  try {
    execFileSync('node', [path.join(here, 'film.mjs'), m.url, file, '--width', String(m.width), '--height', String(m.height), '--script', JSON.stringify(m.script)], { stdio: 'inherit', timeout: 120000 });
  } catch (e) { console.error(m.id, 'failed:', e.message.split('\n')[0]); }
}
