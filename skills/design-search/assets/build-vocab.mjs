#!/usr/bin/env node
// Compacts the schema.org vocabulary (N-Triples or N-Quads) into schemaorg-vocab.json for search-check.mjs.
// Source used for the shipped file: npm @vocabulary/schema 1.1.0 (published 2026-01-16), file schema.nq,
// which is schema.org's own schemaorg-current-http.nt. Refresh: npm pack @vocabulary/schema, untar, then
//   node skills/design-search/assets/build-vocab.mjs <path/to/schema.nq>
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const src = process.argv[2];
if (!src) { console.error('Usage: node build-vocab.mjs <schema.nq|schema.nt>'); process.exit(2); }
const S = 'http://schema.org/';
const RDF = 'http://www.w3.org/1999/02/22-rdf-syntax-ns#';
const RDFS = 'http://www.w3.org/2000/01/rdf-schema#';
const types = {}, props = {}, members = {}, superseded = {};
const short = (iri) => (iri.startsWith(S) ? iri.slice(S.length) : null);
for (const line of fs.readFileSync(src, 'utf8').split('\n')) {
  const m = line.match(/^<([^>]+)> <([^>]+)> (<[^>]+>|".*?"(?:\^\^<[^>]+>|@[\w-]+)?)/);
  if (!m) continue;
  const [, s, p, oRaw] = m;
  const o = oRaw.startsWith('<') ? oRaw.slice(1, -1) : oRaw;
  const ss = short(s);
  if (!ss) continue;
  const os = short(o);
  if (p === RDF + 'type' && o === RDFS + 'Class') types[ss] ??= [];
  else if (p === RDF + 'type' && o === RDF + 'Property') props[ss] ??= { d: [], r: [] };
  else if (p === RDF + 'type' && os) (members[ss] ??= []).push(os);
  else if (p === RDFS + 'subClassOf' && os) (types[ss] ??= []).push(os);
  else if (p === S + 'domainIncludes' && os) (props[ss] ??= { d: [], r: [] }).d.push(os);
  else if (p === S + 'rangeIncludes' && os) (props[ss] ??= { d: [], r: [] }).r.push(os);
  else if (p === S + 'supersededBy' && os) superseded[ss] = os;
}
// Enumeration members: things typed as a schema.org class other than rdfs:Class (for example InStock a ItemAvailability).
for (const k of Object.keys(members)) if (types[k] || props[k]) delete members[k];
const out = { source: path.basename(src), built: new Date().toISOString().slice(0, 10), types, props, members, superseded };
const dest = path.join(path.dirname(fileURLToPath(import.meta.url)), 'schemaorg-vocab.json');
fs.writeFileSync(dest, JSON.stringify(out));
console.log(`wrote ${dest}: ${Object.keys(types).length} types, ${Object.keys(props).length} properties, ${Object.keys(members).length} enum members`);
