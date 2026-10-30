# Novel Tissues B2B website

The site lives in `public/b2b/` and is served by `server.js` at `/b2b`.

| File | What it is |
| --- | --- |
| `public/b2b/config.js` | Contact email, phone, WhatsApp, live domain, brochure path — **edit before launch** |
| `public/b2b/index.html` | Home page (hand-written; parts between `<!--NAME-->` markers are generated) |
| `public/b2b/art.js` | Product pack drawings used everywhere |
| `public/b2b/common.js` | Shared navigation, animations, brochure & sample pop-ups |
| `public/b2b/app.js` | Home page interactions (Wipes Lab, liquids lines, planner…) |
| `site/content.mjs` | Copy for product pages, blog posts and home FAQ |
| `site/build.mjs` | Generates product pages, blog, sitemap, robots.txt, SEO tags |
| `site/make-assets.mjs` | Renders the brochure PDF, share image and logo |

## After changing content or config

```bash
npm run build:site
```

```bash
npm run build:assets
```

`build:assets` needs Playwright (`npm i -D playwright`) and only has to be rerun when the
brochure, contact details or domain change.

## Adding a blog post

Add an entry to `POSTS` in `site/content.mjs` (copy an existing one), then run `npm run build:site`.
The post page, blog index, home teaser and sitemap update automatically.

## Leads

Enquiries, brochure downloads and sample requests are POSTed to `/api/enquiry` with a `type`
of `enquiry`, `brochure` or `sample`. They are logged by the server and, if `ENQUIRY_WEBHOOK_URL`
is set, forwarded there as JSON (e.g. a Zapier/Make webhook into email or Google Sheets).

## Going live for Google

1. Set `SITE.url` in `config.js` to the real domain and rebuild — canonical URLs and the sitemap use it.
2. Serve the site at the root of that domain so `/sitemap.xml` and `/robots.txt` are at the top level.
3. Add the domain in Google Search Console and submit `sitemap.xml`.

## Hosting on Hostinger

```bash
npm run build:hostinger
```

This writes `dist/novel-tissues-hostinger.zip`: the whole site plus `api/enquiry.php` (emails every
enquiry, brochure download and sample request to `CONTACT.email`, and keeps a CSV backup outside
`public_html`) and an `.htaccess` (https, one main address, caching, compression).

1. hPanel → Websites → your site → File Manager → open `public_html` and delete the default page.
2. Upload the zip, right-click it → Extract into `public_html`, then delete the zip.
3. Make sure the inbox in `CONTACT.email` exists (hPanel → Emails) and send a test sample request.
4. In Google Search Console add the domain and submit `<your domain>/sitemap.xml`.

### Automatic deploys from GitHub

`npm run deploy:hostinger` rebuilds the package and pushes it to the `hostinger-site` branch, which
contains only the files that belong in `public_html`. Connect that branch once in hPanel →
Websites → your site → Advanced → Git (install path left empty, so it deploys into `public_html`)
and turn on auto-deployment; every later push to `hostinger-site` goes live by itself.

### Deploying through the Hostinger API (no hPanel clicks)

`npm run deploy:hostinger:api` builds the package and deploys it to the domain in `SITE.url` with
Hostinger's official API toolkit. It needs a Hostinger API token in `HOSTINGER_API_TOKEN` (hPanel →
Account → API) and network access to Hostinger's API and upload hosts. The domain must already
exist as a website in the Hostinger account.

### Hosting on a VPS (e.g. Hostinger VPS)

On a fresh Ubuntu/Debian VPS, run as root:

```bash
curl -fsSL https://raw.githubusercontent.com/AllamaPrabhuad/novel-refer-backend/claude/b2b-baby-care-website-vmwutq/site/vps-setup.sh | bash
```

`site/vps-setup.sh` installs nginx + PHP, serves the `hostinger-site` branch from
`/var/www/<domain>/public_html`, issues a Let's Encrypt certificate once the domain's A records point
at the server, and pulls new versions from GitHub every 5 minutes (so `npm run deploy:hostinger`
goes live by itself).
