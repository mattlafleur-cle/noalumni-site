// Shared page shell: <head>, header with navigation, footer.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export { esc };

// Internal link helper: adds the base path (the preview lives under /noalumni-site/) to site-relative paths.
export const createLinker = (site) => (p) => (/^(https?:|mailto:|tel:|#)/.test(p) ? p : `${site.basePath}${p}`);

const nav = [
  { key: 'what-we-offer', label: 'What We Offer', path: '/what-we-offer/' },
  { key: 'working-genius', label: 'Working Genius', path: '/working-genius/' },
  { key: 'who-we-are', label: 'Who We Are', path: '/who-we-are/' },
  { key: 'events', label: 'Events', external: 'eventsUrl' },
  { key: 'shop', label: 'Shop', path: '/shop/' },
  { key: 'contact-us', label: 'Contact', path: '/contact-us/' },
];

const icon = {
  Facebook: '<path d="M14 8h3V4h-3c-2.8 0-4.5 1.8-4.5 4.6V11H7v4h2.5v9h4v-9h3l.5-4h-3.5V8.8c0-.5.3-.8.5-.8Z"/>',
  LinkedIn: '<path d="M5 9h3.5v11H5zM6.7 3.5a2 2 0 1 1 0 4 2 2 0 0 1 0-4ZM10.5 9h3.3v1.6c.5-.9 1.7-1.9 3.6-1.9 3.6 0 4.1 2.3 4.1 5.3V20H18v-5.3c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V20h-3.6z"/>',
  YouTube: '<path d="M22 8.2a3 3 0 0 0-2.1-2.1C18 5.6 12 5.6 12 5.6s-6 0-7.9.5A3 3 0 0 0 2 8.2 31 31 0 0 0 1.6 12 31 31 0 0 0 2 15.8a3 3 0 0 0 2.1 2.1c1.9.5 7.9.5 7.9.5s6 0 7.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .4-3.8 31 31 0 0 0-.4-3.8ZM10 15.1V8.9l5.2 3.1Z"/>',
  Spotify: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm4.6 14.4a.7.7 0 0 1-1 .2c-2.6-1.6-5.9-2-9.8-1.1a.7.7 0 1 1-.3-1.4c4.3-1 7.9-.6 10.8 1.2.3.2.4.7.3 1.1Zm1.3-2.9a.9.9 0 0 1-1.2.3c-3-1.8-7.5-2.4-11-1.3a.9.9 0 1 1-.5-1.7c4-1.2 9-.6 12.4 1.5.4.2.5.8.3 1.2Zm.1-3c-3.6-2.1-9.5-2.3-12.9-1.3a1 1 0 1 1-.6-2c3.9-1.2 10.5-.9 14.6 1.5a1 1 0 0 1-1.1 1.8Z"/>',
  'Apple Podcasts': '<path d="M12 2a8 8 0 0 0-3 15.4l.2-1.6A6.5 6.5 0 1 1 18.5 10a6.5 6.5 0 0 1-3.7 5.8l.2 1.6A8 8 0 0 0 12 2Zm0 3.2A4.8 4.8 0 0 0 9.6 14l.3-1.8a3.3 3.3 0 1 1 4.2 0l.3 1.8A4.8 4.8 0 0 0 12 5.2Zm0 3.3a1.6 1.6 0 1 0 0 3.2 1.6 1.6 0 0 0 0-3.2Zm-1.4 4.3c-.6 0-1 .5-.9 1.1l.8 6.4c.1.5.5.7 1.5.7s1.4-.2 1.5-.7l.8-6.4c.1-.6-.3-1.1-.9-1.1Z"/>',
};

export function socialLinks(site) {
  return site.socials
    .map((s) => `<li><a href="${s.url}" rel="noopener" aria-label="${esc(s.name)}"><svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">${icon[s.name] || ''}</svg></a></li>`)
    .join('');
}

export function pageShell({ site, link, page, body }) {
  const indexing = site.allowIndexing && site.canonicalDomain;
  const canonical = site.canonicalDomain ? `${site.canonicalDomain}${page.path}` : null;
  const navItems = nav
    .map((n) => {
      const href = n.external ? site[n.external] : link(n.path);
      const current = n.key === page.key ? ' aria-current="page"' : '';
      const ext = n.external ? ' rel="noopener"' : '';
      return `<li><a href="${href}"${current}${ext}>${n.label}</a></li>`;
    })
    .join('');
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)}</title>
<meta name="description" content="${esc(page.description)}">
${indexing ? '' : '<meta name="robots" content="noindex, nofollow">\n'}${canonical ? `<link rel="canonical" href="${canonical}">\n` : ''}<meta property="og:title" content="${esc(page.title)}">
<meta property="og:description" content="${esc(page.description)}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.siteName)}">
<meta name="theme-color" content="#0b0b0a">
<link rel="icon" type="image/png" href="${link('/assets/brand/badge-interim.png')}">
<link rel="stylesheet" href="${link('/assets/site.css')}">
<script src="${link('/assets/site.js')}" defer></script>
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap header-row">
    <a class="brand" href="${link('/')}" aria-label="${esc(site.siteName)} home">
      <img class="brand-badge" src="${link('/assets/brand/badge.webp')}" alt="" width="48" height="48">
      <img class="brand-word" src="${link('/assets/brand/wordmark.png')}" alt="No Alumni" width="180" height="32">
    </a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">Menu</button>
    <nav id="site-nav" class="site-nav" aria-label="Main">
      <ul>${navItems}</ul>
      <a class="btn btn-fill btn-small" href="${site.booking.call}" rel="noopener">Schedule a call</a>
    </nav>
  </div>
</header>
<main id="main">
${body}
</main>
<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <img class="footer-badge" src="${link('/assets/brand/badge.webp')}" alt="No Alumni, established 2023" width="88" height="88">
      <p class="footer-tag">${esc(site.tagline)}</p>
    </div>
    <div>
      <h2 class="footer-h">Get in touch</h2>
      <ul class="plain">
        <li><a href="mailto:${site.contact.email}">${site.contact.email}</a></li>
        <li><a href="tel:+1${site.contact.phone.replace(/\D/g, '')}">${site.contact.phone}</a></li>
        <li><a href="${site.booking.call}" rel="noopener">Schedule a call</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-h">Explore</h2>
      <ul class="plain">
        <li><a href="${link('/what-we-offer/')}">What we offer</a></li>
        <li><a href="${link('/working-genius/')}">The 6 Types of Working Genius</a></li>
        <li><a href="${link('/drag-calculator/')}">Turnover Drag Calculator</a></li>
        <li><a href="${site.shopUrl}" rel="noopener">Shop No Alumni gear</a></li>
        <li><a href="${site.trustpilotUrl}" rel="noopener">Review us on Trustpilot</a></li>
      </ul>
    </div>
    <div>
      <h2 class="footer-h">Follow along</h2>
      <ul class="socials">${socialLinks(site)}</ul>
      <p class="footer-pod">Listen to <a href="${site.socials.find((s) => s.name === 'Spotify').url}" rel="noopener">New Game Old Game</a>, the No Alumni podcast.</p>
    </div>
  </div>
  <div class="wrap footer-base">
    <p>&copy; ${new Date().getFullYear()} No Alumni. Est. 2023. The 6 Types of Working Genius is a model by Patrick Lencioni and The Table Group.</p>
  </div>
</footer>
</body>
</html>
`;
}
