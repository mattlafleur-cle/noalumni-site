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
  // People no longer affiliated with No Alumni (Matt, 2026-11-13). Their names must not appear anywhere.
  [/\brandi\b|borosh/i, 'a former team member (Randi Borosh)'],
  [/undefined|\bnull\b|\[object Object\]/, 'a template value that did not resolve'],
];

const siteBase = site.canonicalDomain || `${site.previewOrigin}${site.basePath}`;
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

  // Structured data: must parse, describe the organization, and match the visible FAQ word for word.
  const ldRaw = h.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/)?.[1];
  if (!ldRaw) errors.push(`${rel}: missing structured data`);
  else {
    let ld = null;
    try { ld = JSON.parse(ldRaw); } catch (e) { errors.push(`${rel}: structured data does not parse: ${e.message}`); }
    const graph = ld?.['@graph'] || [];
    if (!graph.some((n) => n['@type'] === 'Organization')) errors.push(`${rel}: structured data lacks the Organization`);
    const faqNode = graph.find((n) => n['@type'] === 'FAQPage');
    const visibleQs = [...h.matchAll(/<summary><h3>([\s\S]*?)<\/h3><\/summary>/g)].map((m) => m[1]);
    const schemaQs = faqNode ? faqNode.mainEntity.map((q) => q.name) : [];
    if (JSON.stringify(visibleQs) !== JSON.stringify(schemaQs)) errors.push(`${rel}: FAQ structured data does not match the visible questions`);
    for (const id of JSON.stringify(graph).matchAll(/"@id":"([^"]+)"/g)) {
      if (!id[1].startsWith(siteBase)) errors.push(`${rel}: structured data id outside the site: ${id[1]}`);
    }
  }
  // Share image and icons must exist.
  const og = h.match(/<meta property="og:image" content="([^"]+)">/)?.[1];
  if (!og) errors.push(`${rel}: missing og:image`);
  else if (!(await exists(path.join(dist, og.slice(siteBase.length))))) errors.push(`${rel}: og:image file not found: ${og}`);
  if (!/<meta name="twitter:card" content="summary_large_image">/.test(h)) errors.push(`${rel}: missing twitter card`);
  if (site.canonicalDomain && !/<link rel="canonical" href="/.test(h)) errors.push(`${rel}: missing canonical link`);

  const text = textOf(h);
  for (const [re, what] of banned) if (re.test(text) || (what.includes('dash') && re.test(h))) errors.push(`${rel}: contains ${what}`);

  for (const m of h.matchAll(/\s(?:href|src)="([^"]+)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:|data:)/.test(url)) {
      // In-page links to our own pages should be site paths; canonical and share tags are absolute on purpose.
      if (/noalumni\.com\/(?!$)/.test(url) && !/results\.noalumni\.com/.test(url) && h.includes(`<a href="${url}"`)) warnings.push(`${rel}: absolute link to ${url}; use a site path`);
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
for (const p of ['index.html', '404.html', 'our-work/index.html', 'what-we-offer/index.html', 'working-genius/index.html', 'who-we-are/index.html', 'contact-us/index.html', 'shop/index.html', 'drag-calculator/index.html', 'jma/index.html', 'ppa/index.html', 'commodore/index.html'])
  if (!(await exists(path.join(dist, p)))) errors.push(`required page missing: ${p} (it exists on the current site)`);

// Files search engines and AI assistants look for.
for (const p of ['robots.txt', 'llms.txt', 'llms-full.txt', 'favicon.ico'])
  if (!(await exists(path.join(dist, p)))) errors.push(`missing ${p}`);
const robots = await readFile(path.join(dist, 'robots.txt'), 'utf8');
if (/^Disallow:\s*\/\s*$/m.test(robots)) errors.push('robots.txt blocks the whole site');
if (site.allowIndexing && site.canonicalDomain) {
  const sm = await readFile(path.join(dist, 'sitemap.xml'), 'utf8').catch(() => '');
  for (const p of ['/', '/what-we-offer/', '/working-genius/', '/who-we-are/', '/contact-us/', '/drag-calculator/'])
    if (!sm.includes(`<loc>${site.canonicalDomain}${p}</loc>`)) errors.push(`sitemap.xml is missing ${p}`);
}
const llmsFull = await readFile(path.join(dist, 'llms-full.txt'), 'utf8');
for (const [re, what] of banned) if (re.test(llmsFull)) errors.push(`llms-full.txt contains ${what}`);

for (const w of warnings) console.warn('warning:', w);
if (errors.length) {
  console.error(`\n${errors.length} problem(s):\n- ` + errors.join('\n- '));
  process.exit(1);
}
console.log(`Checks passed: ${html.length} HTML files, ${warnings.length} warning(s).`);
