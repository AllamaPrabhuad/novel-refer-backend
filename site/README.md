# Novel Tissues B2B website

The site lives in `public/b2b/` and is served by `server.js` at `/b2b`.

| File | What it is |
| --- | --- |
| `public/b2b/config.js` | Contact email, phone, WhatsApp, live domain, brochure path — **edit before launch** |
| `public/b2b/index.html` | Home page (hand-written; parts between `<!--NAME-->` markers are generated) |
| `public/b2b/art.js` | Product pack drawings used everywhere |
| `public/b2b/common.js` | Shared navigation, animations, brochure & sample pop-ups |
| `public/b2b/app.js` | Home page interactions (Wipes Lab, Brand Studio, planner…) |
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
