// After a deploy, tell IndexNow search engines (Bing, Yandex, Seznam, Naver) that every public page may have changed.
// Runs only once the site is live on its real domain with indexing on. Never fails the deploy.
import site from '../site.config.mjs';
import { pages } from '../src/pages.mjs';
import { createLinker } from '../src/layout.mjs';

if (!(site.allowIndexing && site.canonicalDomain && site.indexNowKey)) {
  console.log('IndexNow skipped: indexing is off or no key is set.');
  process.exit(0);
}
const host = new URL(site.canonicalDomain).host;
const urlList = pages(site, createLinker(site)).filter((p) => p.path !== '/404' && !p.hidden).map((p) => `${site.canonicalDomain}${p.path}`);
try {
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key: site.indexNowKey, keyLocation: `${site.canonicalDomain}/${site.indexNowKey}.txt`, urlList }),
  });
  console.log(`IndexNow: ${res.status} for ${urlList.length} URLs`);
} catch (err) {
  console.log(`IndexNow request failed (not fatal): ${err.message}`);
}
