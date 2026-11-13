// Builds the static site into dist/. Pages come from src/pages.mjs; short links from site.config.mjs.
import { mkdir, rm, writeFile, readdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import site from '../site.config.mjs';
import { createLinker, pageShell, esc } from '../src/layout.mjs';
import { pages } from '../src/pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');

if (site.allowIndexing && !site.canonicalDomain) throw new Error('allowIndexing requires canonicalDomain');
if (site.basePath && !/^\/[a-z0-9-]+$/.test(site.basePath)) throw new Error('basePath must look like /name or be empty');

async function copyDir(from, to) {
  await mkdir(to, { recursive: true });
  for (const e of await readdir(from, { withFileTypes: true })) {
    const s = path.join(from, e.name), d = path.join(to, e.name);
    if (e.isDirectory()) await copyDir(s, d); else await copyFile(s, d);
  }
}

const out = async (rel, html) => {
  const file = path.join(dist, rel);
  await mkdir(path.dirname(file), { recursive: true });
  await writeFile(file, html);
};

await rm(dist, { recursive: true, force: true });
const link = createLinker(site);
let count = 0;
for (const page of pages(site, link)) {
  const rel = page.path === '/' ? 'index.html' : page.path === '/404' ? '404.html' : `${page.path.replace(/^\/|\/$/g, '')}/index.html`;
  await out(rel, pageShell({ site, link, page, body: page.body }));
  count++;
}

// Short links and retired Wix pages: tiny noindex pages that forward. GitHub Pages cannot send real redirects.
for (const r of site.redirects) {
  const to = link(r.to);
  await out(`${r.from}/index.html`, `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Redirecting</title>
<meta name="robots" content="noindex, nofollow">
<meta name="na-redirect" content="${esc(to)}">
<meta http-equiv="refresh" content="0; url=${esc(to)}">
<link rel="canonical" href="${esc(to)}">
</head>
<body>
<p><a href="${esc(to)}">Continue</a></p>
</body>
</html>
`);
  count++;
}

await copyDir(path.join(root, 'src/assets'), path.join(dist, 'assets'));

const indexing = site.allowIndexing && site.canonicalDomain;
await writeFile(path.join(dist, 'robots.txt'), indexing
  ? `User-agent: *\nAllow: /\n\nSitemap: ${site.canonicalDomain}/sitemap.xml\n`
  : '# Preview: every page carries noindex. Crawling is allowed so search engines see that tag.\nUser-agent: *\nAllow: /\n');
if (indexing) {
  const urls = pages(site, link).filter((p) => p.path !== '/404' && !p.hidden).map((p) => `  <url><loc>${site.canonicalDomain}${p.path}</loc></url>`).join('\n');
  await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
}
// GitHub Pages: serve files as-is (no Jekyll processing).
await writeFile(path.join(dist, '.nojekyll'), '');
console.log(`Built ${count} pages into dist/ (base path "${site.basePath}", indexing ${indexing ? 'ON' : 'OFF'})`);
