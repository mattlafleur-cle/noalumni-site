# No Alumni website

Static site for noalumni.com, replacing the Wix site. Plain Node, no dependencies.

- `npm run check` builds `dist/` and runs the checks (links, redirects, titles, noindex during preview, no em dashes).
- `npm run preview` builds and serves it at http://localhost:4321/noalumni-site/.
- Pushing to `claude/noalumni-site` publishes to GitHub Pages (Settings > Pages > Source: GitHub Actions).

Content lives in `src/pages.mjs`; shared facts, form endpoints, and short links in `site.config.mjs`.

## Switch-over to www.noalumni.com
The full click-by-click plan is in SWITCHOVER.md. Summary:
1. In `site.config.mjs`: `basePath: ''`, `canonicalDomain: 'https://www.noalumni.com'`, and `allowIndexing: true` once approved.
2. Settings > Pages > Custom domain: `www.noalumni.com`, then enforce HTTPS.
3. In Wix (domain stays registered there): disconnect the domain from the Wix site, then point the records at GitHub Pages.
   Leave MX (Google Workspace), the google-site-verification TXT record, and `results` CNAME untouched.
