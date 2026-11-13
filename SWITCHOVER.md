# Switch-over checklist: noalumni.com from Wix to the new site

The domain stays registered at Wix. Only the website moves. Email (Google Workspace), the results site
(results.noalumni.com), and the Shopify store are not affected.

Who does what: **You** = Matt in Wix, GitHub, or Google. **Claude** = changes in this repository.

---

## Part 1. Any day before switch-over (no visible change, about 15 minutes)

### 1a. Verify noalumni.com with GitHub (protects the domain)
GitHub recommends this before connecting a custom domain, so no one else can attach a site to it.

1. **You:** github.com, click your profile photo (top right), **Settings**, then **Pages** in the left sidebar.
2. Click **Add a domain**, type `noalumni.com`, click **Add domain**.
3. GitHub shows a TXT record. Copy its **name** (it starts with `_github-pages-challenge-mattlafleur-cle`) and its **value**.
4. **You:** Wix, **Domains**, the **Domain Actions** icon next to noalumni.com, **Manage DNS Records**.
5. In **TXT (Text)**, click **+ Add Record**. Host name: `_github-pages-challenge-mattlafleur-cle`. Value: the code from GitHub. Save.
6. Back in GitHub, click **Verify**. If it says the record is not found yet, wait 15 to 30 minutes and click **Verify** again.

### 1b. Email authentication records (fixes the spam-folder risk)
Same Wix DNS screen. Do not touch the existing MX record (`smtp.google.com`).

| Record | Wix section | Host name | Value |
|---|---|---|---|
| SPF | TXT | leave blank (the root domain) | `v=spf1 include:_spf.google.com ~all` |
| DKIM | TXT | `google._domainkey` | the long value Google generates (steps below) |
| DMARC | TXT | `_dmarc` | `v=DMARC1; p=none; rua=mailto:connect@noalumni.com` |

DKIM steps:
1. **You:** admin.google.com, **Apps**, **Google Workspace**, **Gmail**, **Authenticate email**.
2. Select noalumni.com, click **Generate new record** (2048-bit, prefix `google`), copy the TXT value.
3. Add it in Wix as shown in the table, save, wait about an hour, then click **Start authentication** in Google.

Before adding SPF, check one thing: if any other service sends email *as* an @noalumni.com address
(an email newsletter tool, for example), tell Claude so it can be added to the SPF value.
`p=none` only monitors; it never blocks mail. It can be tightened later once reports look clean.

---

## Part 2. Switch-over day (about 30 minutes, pick a quiet evening)

The site may be unreachable for a few minutes up to about an hour while the internet picks up the change.
Avoid days with events that use printed noalumni.com links.

1. **You:** tell Claude "starting the switch-over."
2. **You:** GitHub repository **noalumni-site**, **Settings**, **Pages**. Under **Custom domain**, type
   `www.noalumni.com` and click **Save**. (From this moment the preview link forwards to noalumni.com,
   which still shows Wix until step 3 is done.)
3. **You:** Wix, **Manage DNS Records** for noalumni.com:
   - **A (Host):** add these four records, host name blank, then delete the three old Wix records
     (`185.230.63.107`, `185.230.63.186`, `185.230.63.171`):

     | Host name | Value |
     |---|---|
     | (blank) | `185.199.108.153` |
     | (blank) | `185.199.109.153` |
     | (blank) | `185.199.110.153` |
     | (blank) | `185.199.111.153` |

   - **CNAME (Aliases):** edit the `www` record. Change its value from `cdn3.wixdns.net` to
     `mattlafleur-cle.github.io` (no repository name). Save.
   - Leave alone: MX `smtp.google.com`, CNAME `results` to `wg-results.onrender.com`, the
     `google-site-verification` TXT record, and the nameservers.
4. **Claude:** switch the site to the real domain (`basePath: ''`, `canonicalDomain:
   'https://www.noalumni.com'`, `allowIndexing: true`), turn on search-engine change notifications,
   and publish.
5. **You:** when GitHub's Pages screen shows the DNS check as successful, tick **Enforce HTTPS**.
   It can take from a few minutes up to 24 hours before that box becomes available.
6. **Claude:** verify every page, the short links (/jma, /ppa, /commodore, /book-online), the old
   Wix addresses, both forms, the share preview, structured data, sitemap, robots.txt, and llms.txt.

### If something goes wrong (rollback, about 5 minutes)
In Wix DNS, put back the three A records `185.230.63.107`, `185.230.63.186`, `185.230.63.171`
(deleting the four GitHub ones), and set the `www` CNAME back to `cdn3.wixdns.net`.
In GitHub Pages settings, click **Remove** next to the custom domain. Wix is live again.

---

## Part 3. After switch-over

1. **You:** Google Search Console (search.google.com/search-console). Add `noalumni.com` as a
   **Domain** property. Your existing google-site-verification record may verify it immediately;
   if not, Google gives a TXT record to add in Wix. Then **Sitemaps**, submit
   `https://www.noalumni.com/sitemap.xml`.
2. **You:** Bing Webmaster Tools (bing.com/webmasters). Sign in and choose **Import from Google
   Search Console**. Bing also powers ChatGPT search and Copilot answers.
3. **Before canceling Wix, export anything that lives only in Wix:**
   - Contacts (Wix dashboard, **Contacts**, **Export**)
   - Old contact form submissions and Wix Chat history, if you want to keep them
   - Any site members, if anyone signed up
4. **About 30 days later, if all is well:** cancel the Wix **site plan** (Premium). Keep the
   **domain registration** and its auto-renew on. The domain is paid through October 17, 2027.

---

## Reference: the DNS records after switch-over

| Type | Host | Value | Purpose |
|---|---|---|---|
| A | noalumni.com | 185.199.108.153, .109.153, .110.153, .111.153 | Website (GitHub Pages) |
| CNAME | www | mattlafleur-cle.github.io | Website (GitHub Pages) |
| CNAME | results | wg-results.onrender.com | Results site (unchanged) |
| MX | noalumni.com | smtp.google.com, priority 10 | Google Workspace email (unchanged) |
| TXT | noalumni.com | google-site-verification=... | Google verification (unchanged) |
| TXT | noalumni.com | v=spf1 include:_spf.google.com ~all | Email authentication (new) |
| TXT | google._domainkey | (from Google Admin) | Email authentication (new) |
| TXT | _dmarc | v=DMARC1; p=none; rua=mailto:connect@noalumni.com | Email authentication (new) |
| TXT | _github-pages-challenge-mattlafleur-cle | (from GitHub) | Domain verification (new) |

Sources: GitHub Docs, "Managing a custom domain for your GitHub Pages site"; Wix Help Center,
"Connecting a Wix Domain to an External Site via Pointing" (both checked 2026-11-13).
