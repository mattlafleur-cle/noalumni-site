// Post-build checks on dist/. Exits 1 on any error, so a broken site is never published.
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import site from '../site.config.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const errors = [];
const warnings = [];

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    out.push(...(e.isDirectory() ? await walk(p) : [p]));
  }
  return out;
}
const exists = (p) => stat(p).then(() => true, () => false);
const textOf = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');

// Resolve a site link (with base path) to the file GitHub Pages would serve.
const fileFor = (href) => {
  let p = href.split('#')[0].split('?')[0];
  if (site.basePath) {
    if (!p.startsWith(site.basePath + '/') && p !== site.basePath) return null; // missing base path
    p = p.slice(site.basePath.length) || '/';
  }
  return p.endsWith('/') ? path.join(dist, p, 'index.html') : path.join(dist, p);
};

const banned = [
  [/—/, 'em dash'],
  [/–/, 'en dash'],
  [/\bTODO\b|\bTBD\b|lorem ipsum/i, 'placeholder text'],
  [/\$\{/, 'an unfilled template variable'],
  [/undefined|\bnull\b|\[object Object\]/, 'a template value that did not resolve'],
];

const files = await walk(dist);
const html = files.filter((f) => f.endsWith('.html'));
const titles = new Map();
const ids = new Map();
for (const f of html) ids.set(f, new Set([...(await readFile(f, 'utf8')).matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])));

for (const f of html) {
  const rel = path.relative(dist, f);
  const h = await readFile(f, 'utf8');

  const redirect = h.match(/<meta name="na-redirect" content="([^"]+)">/)?.[1];
  if (redirect) {
    if (!h.includes('<meta name="robots" content="noindex, nofollow">')) errors.push(`${rel}: redirect page must be noindex`);
    if (!/^https?:/.test(redirect) && !(await exists(fileFor(redirect) || ''))) errors.push(`${rel}: redirect target ${redirect} does not exist`);
    continue;
  }

  if (!/<html lang="en">/.test(h)) errors.push(`${rel}: missing lang`);
  const title = h.match(/<title>([^<]*)<\/title>/)?.[1];
  if (!title) errors.push(`${rel}: missing title`); else titles.set(title, [...(titles.get(title) || []), rel]);
  const desc = h.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!desc) errors.push(`${rel}: missing description`);
  else if (desc.length < 60 || desc.length > 170) warnings.push(`${rel}: description is ${desc.length} characters`);
  const h1s = (h.match(/<h1[\s>]/g) || []).length;
  if (h1s !== 1) errors.push(`${rel}: has ${h1s} h1 elements`);
  if (!(site.allowIndexing && site.canonicalDomain) && !h.includes('<meta name="robots" content="noindex, nofollow">'))
    errors.push(`${rel}: preview pages must carry noindex`);
  for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(m[0])) errors.push(`${rel}: image without alt: ${m[0].slice(0, 80)}`);
  if (/\sstyle="/.test(h)) errors.push(`${rel}: inline style attribute (use site.css)`);

  const text = textOf(h);
  for (const [re, what] of banned) if (re.test(text) || (what.includes('dash') && re.test(h))) errors.push(`${rel}: contains ${what}`);

  for (const m of h.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) {
      if (/noalumni\.com\/(?!$)/.test(url) && !/results\.noalumni\.com/.test(url)) warnings.push(`${rel}: absolute link to ${url}; use a site path`);
      continue;
    }
    if (url.startsWith('#')) {
      if (url.length > 1 && !ids.get(f).has(url.slice(1))) errors.push(`${rel}: missing anchor ${url}`);
      continue;
    }
    const target = fileFor(url);
    if (!target) { errors.push(`${rel}: link ${url} is missing the base path ${site.basePath}`); continue; }
    if (!(await exists(target))) errors.push(`${rel}: broken link ${url}`);
    const anchor = url.split('#')[1];
    if (anchor && ids.has(target) && !ids.get(target).has(anchor)) errors.push(`${rel}: missing anchor ${url}`);
  }
}
for (const [t, where] of titles) if (where.length > 1) errors.push(`duplicate title "${t}" on ${where.join(', ')}`);
for (const p of ['index.html', '404.html', 'what-we-offer/index.html', 'working-genius/index.html', 'who-we-are/index.html', 'contact-us/index.html', 'shop/index.html', 'drag-calculator/index.html', 'jma/index.html', 'ppa/index.html', 'commodore/index.html'])
  if (!(await exists(path.join(dist, p)))) errors.push(`required page missing: ${p} (it exists on the current site)`);

for (const w of warnings) console.warn('warning:', w);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log(`Checks passed: ${html.length} HTML files, ${warnings.length} warning(s).`);
