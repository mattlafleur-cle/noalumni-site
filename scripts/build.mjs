// Builds the static site into dist/. Pages come from src/pages.mjs; short links from site.config.mjs.
import { mkdir, rm, writeFile, readdir, copyFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import site from '../site.config.mjs';
import { createLinker, pageShell, esc, baseGraph, siteUrl } from '../src/layout.mjs';
import { pages, team } from '../src/pages.mjs';

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
  await out(rel, pageShell({ site, link, page, body: page.body, graph: baseGraph(site, team) }));
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
// Browsers and crawlers ask for /favicon.ico at the site root by default.
await copyFile(path.join(root, 'src/assets/brand/favicon.ico'), path.join(dist, 'favicon.ico'));

const indexing = site.allowIndexing && site.canonicalDomain;
const today = new Date().toISOString().slice(0, 10);
const all = pages(site, link).filter((p) => p.path !== '/404' && !p.hidden);

// robots.txt. Answer engines and AI assistants are welcome: they are named explicitly so no default
// policy on their side can read silence as a "no". While previewing, every page also carries noindex.
const aiBots = ['GPTBot', 'OAI-SearchBot', 'ChatGPT-User', 'ClaudeBot', 'Claude-User', 'Claude-SearchBot', 'PerplexityBot', 'Perplexity-User', 'Google-Extended', 'Applebot-Extended', 'Bingbot', 'DuckAssistBot', 'Meta-ExternalAgent', 'CCBot'];
await writeFile(path.join(dist, 'robots.txt'), [
  indexing ? '# Search engines and AI answer engines are welcome to read and cite this site.' : '# Preview: every page carries noindex. Crawling is allowed so that tag is seen.',
  'User-agent: *',
  'Allow: /',
  '',
  ...aiBots.flatMap((b) => [`User-agent: ${b}`, 'Allow: /', '']),
  ...(indexing ? [`Sitemap: ${site.canonicalDomain}/sitemap.xml`] : []),
  '',
].join('\n'));

if (indexing) {
  const urls = all.map((p) => `  <url><loc>${site.canonicalDomain}${p.path}</loc><lastmod>${today}</lastmod></url>`).join('\n');
  await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`);
  if (site.indexNowKey) await writeFile(path.join(dist, `${site.indexNowKey}.txt`), site.indexNowKey);
}

// llms.txt (short map for AI assistants) and llms-full.txt (every page's text plus its FAQ answers).
const base = siteUrl(site);
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>/g, '').replace(/<(br|\/p|\/h\d|\/li|\/tr|\/summary)>/g, '\n').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/&nbsp;/g, ' ').replace(/[ \t]+/g, ' ').replace(/\n\s*\n+/g, '\n\n').trim();
await writeFile(path.join(dist, 'llms.txt'), [
  `# ${site.siteName}`,
  '',
  `> ${site.summary}`,
  '',
  '## Pages',
  ...all.map((p) => `- [${p.crumb || p.title}](${base}${p.path}): ${p.description}`),
  '',
  '## Contact',
  `- Email: ${site.contact.email}`,
  `- Phone: ${site.contact.phone}`,
  `- Schedule a call: ${site.booking.call}`,
  '',
  '## Elsewhere',
  ...site.socials.map((s) => `- ${s.name}: ${s.url}`),
  `- Shop: ${site.shopUrl}`,
  `- Events: ${site.eventsUrl}`,
  '',
  `Full text of every page: ${base}/llms-full.txt`,
  '',
].join('\n'));
await writeFile(path.join(dist, 'llms-full.txt'), [
  `# ${site.siteName}`, '', site.summary, '',
  ...all.flatMap((p) => [`## ${p.crumb || p.title}`, `URL: ${base}${p.path}`, '', strip(p.body.replace(/<details[\s\S]*?<\/details>/g, '')), '', ...(p.faq?.length ? ['### Questions and answers', ...p.faq.flatMap(([q, a]) => [`Q: ${q}`, `A: ${a.replace(/<[^>]+>/g, '')}`, ''])] : []), '']),
].join('\n'));

// GitHub Pages: serve files as-is (no Jekyll processing).
await writeFile(path.join(dist, '.nojekyll'), '');
console.log(`Built ${count} pages into dist/ (base path "${site.basePath}", indexing ${indexing ? 'ON' : 'OFF'})`);
