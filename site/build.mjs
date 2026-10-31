// Builds the static product, blog and SEO files into public/b2b.
// Usage: npm run build:site
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATEGORIES, POSTS, HOME_FAQ, PUBLISHED } from "./content.mjs";
import { TRUST, PRICE_BANDS, LANDINGS, GROUPS, ABOUT, MORE_POSTS } from "./content-more.mjs";

const ALL_POSTS = [...POSTS, ...MORE_POSTS];

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, "../public/b2b");
const { CONTACT, SITE } = new Function(fs.readFileSync(path.join(OUT, "config.js"), "utf8") + "; return { CONTACT, SITE };")();
const BASE = SITE.url.replace(/\/$/, "");
const ORG_ID = BASE + "/#organization";

const abs = p => `${BASE}/${p}`;
const strip = html => html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
const attr = s => String(s).replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const slugify = s => strip(s).toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const fmtDate = d => new Date(d + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const readMins = html => Math.max(3, Math.round(strip(html).split(" ").length / 220));
const ld = obj => `<script type="application/ld+json">${JSON.stringify(obj).replace(/</g, "\\u003c")}</script>`;

function write(rel, html) {
  const file = path.join(OUT, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, html);
  console.log("wrote", path.relative(path.resolve(here, ".."), file));
}

/* ---------- shared fragments ---------- */
const FAVICON = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect width='64' height='64' rx='18' fill='%23413F3D'/%3E%3Cpath d='M32 12c8 11 14 18 14 26a14 14 0 0 1-28 0c0-8 6-15 14-26z' fill='%23697184'/%3E%3C/svg%3E`;

function seoHead({ title, description, url, type = "website", image = abs("og-image.png"), jsonld = [], extra = "", noindex = false }) {
  if (SITE.googleVerification) extra += `\n  <meta name="google-site-verification" content="${attr(SITE.googleVerification)}" />`;
  if (SITE.bingVerification) extra += `\n  <meta name="msvalidate.01" content="${attr(SITE.bingVerification)}" />`;
  return `<title>${title}</title>
  <meta name="description" content="${attr(description)}" />
  <link rel="canonical" href="${url}" />
  <meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}" />
  <meta property="og:type" content="${type}" />
  <meta property="og:site_name" content="Novel Tissues" />
  <meta property="og:locale" content="en_IN" />
  <meta property="og:title" content="${attr(title)}" />
  <meta property="og:description" content="${attr(description)}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:image" content="${image}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${attr(title)}" />
  <meta name="twitter:description" content="${attr(description)}" />
  <meta name="twitter:image" content="${image}" />${extra}
  ${jsonld.map(ld).join("\n  ")}`;
}

function navHTML(root, active = "") {
  const links = [
    ["Products", "products/", "products"],
    ["Wipes Lab", "#wipes"],
    ["Plants", "#plants"],
    ["Blog", "blog/", "blog"],
    ["FAQ", "#faq"]
  ];
  return `<div class="cursor" id="cursor" aria-hidden="true"></div>
<div class="scroll-progress" id="scrollProgress" aria-hidden="true"></div>
<header class="nav" id="nav">
  <a href="${root || "./"}" class="brand" aria-label="Novel Tissues home">
    <span class="brand-mark">
      <svg viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="18" fill="#413F3D"/><path d="M32 12c8 11 14 18 14 26a14 14 0 0 1-28 0c0-8 6-15 14-26z" fill="#697184"/><circle cx="27" cy="38" r="4" fill="#F2F1EF" opacity=".7"/></svg>
    </span>
    <span class="brand-text">Novel Tissues<small>Private Label Baby Care</small></span>
  </a>
  <nav class="nav-links" id="navLinks" aria-label="Main">
    ${links.map(([label, href, key]) => `<a href="${root}${href}"${key && key === active ? ' class="active" aria-current="page"' : ""}>${label}</a>`).join("\n    ")}
    <a href="#brochure" data-open="brochure" class="nav-brochure">Brochure ↓</a>
  </nav>
  <a href="${root}#contact" class="btn btn-ink nav-cta magnetic">Start your brand <span class="arrow">→</span></a>
  <button class="burger" id="burger" aria-label="Open menu" aria-expanded="false"><span></span><span></span></button>
</header>`;
}

function footerHTML(root) {
  const group = g => LANDINGS.filter(l => l.group === g).map(l => `<a href="${root}${(GROUPS[g]?.path || "products/")}${l.slug}/">${l.nav}</a>`).join("");
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div>
        <div class="footer-word">Novel Tissues</div>
        <p>Private label manufacturer of baby wipes, baby cosmetics and baby laundry &amp; cleaning liquids. North &amp; South India wipes plants · Pondicherry liquids campus · 5,00,000 sq.ft of manufacturing.</p>
        <div class="footer-ctas"><a href="#brochure" data-open="brochure" class="btn btn-light">Download brochure ↓</a><a href="#visit" data-open="visit" class="btn btn-outline-light">Book a factory visit</a></div>
      </div>
      <div class="footer-cols">
        <div><h5>Products</h5>${CATEGORIES.map(c => `<a href="${root}products/${c.slug}/">${c.nav}</a>`).join("")}${group("products")}<a href="${root}products/">All products</a></div>
        <div><h5>Where we supply</h5>${group("locations")}<a href="${root}locations/">All regions</a>${group("export")}<a href="${root}export/">Export</a></div>
        <div><h5>Company</h5><a href="${root}about/">About us</a><a href="${root}#plants">Our plants</a><a href="${root}#process">Process</a><a href="${root}blog/">Blog</a><a href="${root}#faq">FAQ</a><a href="${root}privacy/">Privacy policy</a><a href="${root}terms/">Terms of use</a></div>
        <div><h5>Talk to us</h5><a href="${root}#contact">Request a quote</a><a href="#sample" data-open="sample">Request samples</a><a href="#visit" data-open="visit">Book a factory visit</a><a href="#brochure" data-open="brochure">Download brochure</a><span data-contact-links></span></div>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© <span data-year></span> Novel Tissues. All rights reserved.</span>
      <a href="#top" class="to-top">Back to top ↑</a>
    </div>
  </div>
</footer>

<a class="wa-float" id="waFloat" hidden aria-label="Chat on WhatsApp" target="_blank" rel="noopener">
  <svg viewBox="0 0 32 32"><path fill="currentColor" d="M16 3a13 13 0 0 0-11.2 19.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm0 23.6c-2 0-3.9-.5-5.6-1.5l-.4-.2-3.9 1 1-3.8-.3-.4A10.6 10.6 0 1 1 16 26.6zm5.8-7.9c-.3-.2-1.9-.9-2.2-1s-.5-.2-.7.2-.8 1-1 1.2-.4.2-.7.1a8.7 8.7 0 0 1-4.3-3.8c-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6a1.2 1.2 0 0 0-.9.4 3.7 3.7 0 0 0-1.1 2.8 6.5 6.5 0 0 0 1.3 3.4 14.6 14.6 0 0 0 5.6 5 c2.1.9 2.9 1 4 .8a3.4 3.4 0 0 0 2.2-1.6 2.8 2.8 0 0 0 .2-1.6c-.1-.2-.3-.3-.6-.4z"/></svg>
</a>`;
}

const ctaBand = root => `<section class="sec">
  <div class="wrap">
    <div class="cta-band reveal">
      <div>
        <p class="kicker">Ready when you are</p>
        <h2>Let's build your <em>baby-care range.</em></h2>
        <p>Request a sample kit, download our brochure or send us your brief — our private label team replies with options and a plan for your volumes.</p>
      </div>
      <div class="cta-actions">
        <a class="btn btn-peach magnetic" href="${root}#contact">Request a quote <span class="arrow">→</span></a>
        <button type="button" class="btn btn-light" data-open="sample">Request a sample kit</button>
        <button type="button" class="btn btn-outline-light" data-open="visit">Book a factory visit</button>
        <button type="button" class="btn btn-outline-light" data-open="brochure">Download brochure ↓</button>
      </div>
    </div>
  </div>
</section>`;

const artDiv = (a, cls = "art") =>
  `<div class="${cls}${a.size === "wide" || a.type === "wipes" || a.type === "jar" || a.type === "detergent" ? " art-wide" : ""}" data-art="${a.type}" data-pal="${a.pal ?? 2}"${a.count ? ` data-count="${a.count}"` : ""}${a.label ? ` data-label="${attr(a.label)}"` : ""}></div>`;

function postCard(p, root, feature = false) {
  return `<a class="post-card${feature ? " feature" : ""} reveal" href="${root}blog/${p.slug}/">
    <div class="post-thumb" style="--bg:${p.bg}" aria-hidden="true">${artDiv(p.art)}</div>
    <div class="post-body">
      <span class="post-tag">${p.category}</span>
      <h3>${p.title}</h3>
      <p>${p.excerpt}</p>
      <span class="post-meta">${fmtDate(p.date)} · ${readMins(p.body)} min read</span>
    </div>
  </a>`;
}

function crumbs(root, items) {
  return `<nav class="crumbs" aria-label="Breadcrumb"><a href="${root || "./"}">Home</a>${items.map(([label, href]) =>
    href ? `<span>/</span><a href="${root}${href}">${label}</a>` : `<span>/</span><span aria-current="page">${label}</span>`).join("")}</nav>`;
}

function breadcrumbLD(items) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [["Home", ""], ...items].map(([name, p], i) => ({ "@type": "ListItem", position: i + 1, name, item: abs(p) }))
  };
}

function faqLD(faqs) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } }))
  };
}

const faqList = faqs => faqs.map(([q, a]) => `<details class="reveal"><summary>${q}</summary><p>${a}</p></details>`).join("\n        ");

function page({ root, rel, title, description, body, jsonld = [], type, active, image, noindex = false }) {
  return `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ${seoHead({ title, description, url: abs(rel), type, jsonld, image, noindex })}
  <meta name="theme-color" content="#F2F1EF" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;0,9..144,700;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="${root}styles.css" />
  <link rel="icon" href="${FAVICON}" />
</head>
<body data-root="${root}" class="sub" id="top">
${navHTML(root, active)}
<main>
${body}
</main>
${footerHTML(root)}
<script src="${root}config.js"></script>
<script src="${root}art.js"></script>
<script src="${root}common.js"></script>
</body>
</html>
`;
}

const postsBySlug = Object.fromEntries(ALL_POSTS.map(p => [p.slug, p]));
const catBySlug = Object.fromEntries(CATEGORIES.map(c => [c.slug, c]));

/* ---------- product category pages ---------- */
for (const c of CATEGORIES) {
  const root = "../../";
  const rel = `products/${c.slug}/`;
  const body = `
<section class="page-hero" style="--hero-bg:${c.heroBg}">
  <div class="blob b1"></div><div class="blob b2"></div>
  <div class="wrap ph-grid">
    <div>
      ${crumbs(root, [["Products", "products/"], [c.nav]])}
      <p class="kicker">${c.kicker}</p>
      <h1 class="split">${c.h1}</h1>
      <p class="ph-lead reveal">${c.lead}</p>
      <div class="ph-ctas reveal">
        <a class="btn btn-peach magnetic" href="${root}#contact">Get a quote <span class="arrow">→</span></a>
        <button type="button" class="btn btn-ink" data-open="sample">Request samples</button>
        <button type="button" class="btn btn-ghost" data-open="brochure">Brochure ↓</button>
      </div>
      <div class="facts reveal">${c.facts.map(f => `<span>${f}</span>`).join("")}</div>
    </div>
    <div class="ph-art" aria-hidden="true">${c.art.map(a => artDiv(a)).join("")}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <p class="kicker reveal">What we make</p>
      <h2 class="split">Our ${c.nav.toLowerCase()} range, <em>ready for your label.</em></h2>
    </div>
    <div class="grid-3">
      ${c.products.map(([n, d, f], i) => `<article class="pc reveal" style="--i:${i}; --c2:${c.heroBg}"><h3 class="h4">${n}</h3><p>${d}</p><div class="formats">${f.map(x => `<span>${x}</span>`).join("")}</div></article>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="sec alt">
  <div class="wrap split-2">
    <div class="sticky-col">
      <p class="kicker reveal">Specifications</p>
      <h2 class="split">The spec sheet, <em>at a glance.</em></h2>
      <p class="lead reveal">These are our standard ranges. Before production we agree a written specification with you — the reference every batch is checked against.</p>
      <div class="ph-ctas reveal"><a class="btn btn-ink" href="${root}downloads/spec-sheet-${c.slug}.pdf" download>Spec sheet (PDF) ↓</a><button type="button" class="btn btn-ghost" data-open="brochure">Full brochure ↓</button></div>
    </div>
    <table class="spec-table reveal">
      <caption class="sr-only">${c.nav} manufacturing specifications</caption>
      <tbody>
        ${c.specs.map(([k, v]) => `<tr><th scope="row">${k}</th><td>${v}</td></tr>`).join("\n        ")}
      </tbody>
    </table>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head">
      <p class="kicker reveal">Customisation</p>
      <h2 class="split">Make it <em>unmistakably yours.</em></h2>
    </div>
    <div class="grid-3">
      ${c.custom.map(([t, d], i) => `<div class="feat reveal"><span class="feat-n">${String(i + 1).padStart(2, "0")}</span><h3 class="h4">${t}</h3><p>${d}</p></div>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="sec tint" style="--tint:${c.heroBg}">
  <div class="wrap">
    <div class="sec-head">
      <p class="kicker reveal">Packaging options</p>
      <h2 class="split">${c.packsTitle}</h2>
    </div>
    <div class="pack-grid">
      ${c.packs.map(p => `<div class="pack-card reveal"><div class="pack-art" aria-hidden="true">${artDiv(p)}</div><h3 class="h4">${p.name}</h3><p>${p.text}</p></div>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap split-2">
    <div>
      <p class="kicker reveal">Formulation</p>
      <h2 class="split">${c.basesTitle}</h2>
      <p class="lead reveal">Start from a proven base and customise it — or bring your own formula. Every option is sampled before you commit.</p>
    </div>
    <div class="base-list">
      ${c.bases.map(([n, d]) => `<div class="base reveal"><h3 class="h4">${n}</h3><p>${d}</p></div>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="sec dark">
  <div class="wrap split-2">
    <div>
      <p class="kicker reveal">Where it's made</p>
      <h2 class="split">${c.made.title}</h2>
    </div>
    <div class="reveal">
      <p class="lead">${c.made.text}</p>
      <ul class="tick-list">${c.made.bullets.map(b => `<li>${b}</li>`).join("")}</ul>
      <a class="btn btn-light" href="${root}#plants">See our manufacturing network →</a>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap faq-grid">
    <div>
      <p class="kicker reveal">FAQ</p>
      <h2 class="split">${c.nav} questions, <em>answered.</em></h2>
      <p class="lead reveal">Something else on your mind? <a class="link" href="${root}#contact">Ask our team</a>.</p>
    </div>
    <div class="acc">
        ${faqList(c.faqs)}
    </div>
  </div>
</section>

<section class="sec alt">
  <div class="wrap">
    <div class="sec-head">
      <p class="kicker reveal">From the blog</p>
      <h2 class="split">Guides for <em>brand builders.</em></h2>
    </div>
    <div class="post-grid">
      ${c.related.map(s => postCard(postsBySlug[s], root)).join("\n      ")}
    </div>
  </div>
</section>

${ctaBand(root)}`;

  const service = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: strip(c.seoTitle.split("|")[0]),
    serviceType: `Private label ${c.nav.toLowerCase()} manufacturing`,
    description: c.description,
    provider: { "@id": ORG_ID },
    areaServed: { "@type": "Country", name: "India" },
    url: abs(rel)
  };
  write(rel + "index.html", page({
    root, rel, title: c.seoTitle, description: c.description, body, active: "products",
    jsonld: [breadcrumbLD([["Products", "products/"], [c.nav, rel]]), service, faqLD(c.faqs)]
  }));
}

/* ---------- products hub ---------- */
{
  const root = "../";
  const rel = "products/";
  const body = `
<section class="page-hero" style="--hero-bg:#E3DCDC">
  <div class="blob b1"></div><div class="blob b2"></div>
  <div class="wrap">
    ${crumbs(root, [["Products"]])}
    <p class="kicker">Private label products</p>
    <h1 class="split">Every baby-care product your brand needs, <em>from one manufacturer.</em></h1>
    <p class="ph-lead reveal">Novel Tissues manufactures private label baby wipes, baby shampoos and washes, lotions, creams and oils, and baby laundry &amp; cleaning liquids — across 5,00,000 sq.ft of manufacturing in North and South India.</p>
    <div class="ph-ctas reveal">
      <a class="btn btn-peach magnetic" href="${root}#contact">Get a quote <span class="arrow">→</span></a>
      <button type="button" class="btn btn-ink" data-open="sample">Request samples</button>
      <button type="button" class="btn btn-ghost" data-open="brochure">Brochure ↓</button>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap cat-grid">
    ${CATEGORIES.map(c => `<a class="cat-card reveal" href="${c.slug}/" style="--bg:${c.heroBg}">
      <div class="cat-art" aria-hidden="true">${c.art.map(a => artDiv(a)).join("")}</div>
      <div class="cat-body">
        <p class="kicker">${c.kicker}</p>
        <h2 class="h3">${c.nav}</h2>
        <p>${c.description}</p>
        <span class="pp-link">Specifications, packs &amp; FAQs <span class="arrow">→</span></span>
      </div>
    </a>`).join("\n    ")}
  </div>
</section>

<section class="sec alt">
  <div class="wrap">
    <div class="sec-head">
      <p class="kicker reveal">At a glance</p>
      <h2 class="split">What we make, <em>and where.</em></h2>
    </div>
    <div class="table-wrap reveal">
      <table class="spec-table wide">
        <thead><tr><th>Category</th><th>Products</th><th>Pack formats</th><th>Made at</th></tr></thead>
        <tbody>
          <tr><th scope="row"><a class="link" href="baby-wipes/">Baby wipes</a></th><td>Wet wipes, water wipes, botanical, travel, hand &amp; face, multipacks</td><td>Flip-top &amp; sticker-lid flow-wrap, 10 to 100+ count</td><td>North &amp; South India plants · 9 machines</td></tr>
          <tr><th scope="row"><a class="link" href="baby-shampoo-body-wash/">Shampoo &amp; wash</a></th><td>Shampoo, head-to-toe wash, body wash, bubble bath, 2-in-1, hair oil</td><td>Pump, flip-cap, refill pouch, travel sizes</td><td>Pondicherry · 8 liquid lines</td></tr>
          <tr><th scope="row"><a class="link" href="baby-lotion-cream-oil/">Lotion, cream &amp; oil</a></th><td>Lotion, cream, massage oil, rash cream, cold cream, balms</td><td>Flip-cap, pump, tube, jar</td><td>Pondicherry · 8 liquid lines</td></tr>
          <tr><th scope="row"><a class="link" href="baby-laundry-detergent-cleansers/">Laundry &amp; cleaners</a></th><td>Laundry detergent, conditioner, bottle cleanser, toy &amp; surface cleanser</td><td>Handled can, bottles, sprays, refill pouch</td><td>Pondicherry · 8 liquid lines</td></tr>
        </tbody>
      </table>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><p class="kicker reveal">Specialist ranges</p><h2 class="split">Formats buyers <em>ask us for.</em></h2></div>
    <div class="cat-links reveal">${LANDINGS.filter(l => l.group === "products").map(l => `<a href="${l.slug}/">${l.nav} <span class="arrow">→</span></a>`).join("")}</div>
  </div>
</section>

${ctaBand(root)}`;
  write(rel + "index.html", page({
    root, rel, active: "products",
    title: "Private Label Baby Care Products | Wipes, Shampoo, Lotion, Detergent | Novel Tissues",
    description: "Private label baby care manufacturing in India: baby wipes, baby shampoo & body wash, lotion, cream & oil, and baby laundry detergent & cleansers — from one manufacturer.",
    body,
    jsonld: [breadcrumbLD([["Products", rel]]), {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: CATEGORIES.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.nav, url: abs(`products/${c.slug}/`) }))
    }]
  }));
}

/* ---------- blog index ---------- */
{
  const root = "../";
  const rel = "blog/";
  const sorted = [...ALL_POSTS].sort((a, b) => b.date.localeCompare(a.date));
  const body = `
<section class="page-hero compact" style="--hero-bg:#E6E1E0">
  <div class="blob b1"></div><div class="blob b2"></div>
  <div class="wrap">
    ${crumbs(root, [["Blog"]])}
    <p class="kicker">The Novel Tissues journal</p>
    <h1 class="split">Guides for building a <em>baby-care brand.</em></h1>
    <p class="ph-lead reveal">Practical, no-fluff guides on private label manufacturing, wipes, formulation, packaging and launching in India — from the team that makes it.</p>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="post-grid">
      ${sorted.map((p, i) => postCard(p, root, i === 0)).join("\n      ")}
    </div>
  </div>
</section>

${ctaBand(root)}`;
  write(rel + "index.html", page({
    root, rel, active: "blog",
    title: "Baby Care Brand & Private Label Manufacturing Guides | Novel Tissues Blog",
    description: "Guides on starting a baby care brand in India, private label vs contract manufacturing, choosing a wipes manufacturer, wipes GSM, tear-free shampoo and baby detergent.",
    body,
    jsonld: [breadcrumbLD([["Blog", rel]]), {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Novel Tissues Blog",
      url: abs(rel),
      publisher: { "@id": ORG_ID },
      blogPost: sorted.map(p => ({ "@type": "BlogPosting", headline: p.title, url: abs(`blog/${p.slug}/`), datePublished: p.date }))
    }]
  }));
}

/* ---------- blog posts ---------- */
for (const p of ALL_POSTS) {
  const root = "../../";
  const rel = `blog/${p.slug}/`;
  const heads = [];
  let html = p.body.replace(/<h2>([\s\S]*?)<\/h2>/g, (_, inner) => {
    const id = slugify(inner);
    heads.push([id, strip(inner)]);
    return `<h2 id="${id}">${inner}</h2>`;
  });
  html = html.replace("<!--CTA-->", `<aside class="inline-cta">
  <div><strong>Planning your baby-care range?</strong><p>Get our brochure with capacities, product ranges and pack formats — or request a sample kit to feel the options.</p></div>
  <div class="inline-cta-actions"><button type="button" class="btn btn-peach" data-open="brochure">Download brochure ↓</button><button type="button" class="btn btn-outline-light" data-open="sample">Request samples</button></div>
</aside>`);
  const cat = catBySlug[p.product];
  const related = ALL_POSTS.filter(x => x.slug !== p.slug).sort((a, b) => (b.category === p.category) - (a.category === p.category)).slice(0, 3);
  const body = `
<article>
  <header class="article-hero" style="--hero-bg:${p.bg}">
    <div class="blob b1"></div><div class="blob b2"></div>
    <div class="wrap article-head">
      <div>
        ${crumbs(root, [["Blog", "blog/"], [p.category]])}
        <span class="post-tag">${p.category}</span>
        <h1>${p.title}</h1>
        <p class="ph-lead">${p.description}</p>
        <div class="article-meta"><span>By the Novel Tissues private label team</span><span aria-hidden="true">·</span><time datetime="${p.date}">${fmtDate(p.date)}</time><span aria-hidden="true">·</span><span>${readMins(p.body)} min read</span></div>
      </div>
      <div class="article-art" aria-hidden="true">${artDiv(p.art)}</div>
    </div>
  </header>

  <div class="wrap article-layout">
    <aside class="toc" aria-label="On this page">
      <h2 class="toc-title">On this page</h2>
      ${heads.map(([id, t]) => `<a href="#${id}">${t}</a>`).join("\n      ")}
      <div class="toc-cta">
        <p>Make it with us</p>
        <a class="btn btn-ink btn-block" href="${root}products/${cat.slug}/">${cat.nav} →</a>
      </div>
    </aside>
    <div class="prose">
${html}
      <div class="post-end">
        <p><strong>Novel Tissues</strong> is a private label manufacturer of baby wipes, baby cosmetics and baby laundry &amp; cleaning liquids, with wipes plants in North and South India and an 8-line liquids campus in Pondicherry.</p>
        <div class="ph-ctas"><a class="btn btn-peach" href="${root}products/${cat.slug}/">Explore ${cat.nav.toLowerCase()} →</a><button type="button" class="btn btn-ghost" data-open="sample">Request samples</button></div>
      </div>
    </div>
  </div>
</article>

<section class="sec alt">
  <div class="wrap">
    <div class="sec-head">
      <p class="kicker reveal">Keep reading</p>
      <h2 class="split">More guides for <em>brand builders.</em></h2>
    </div>
    <div class="post-grid">
      ${related.map(r => postCard(r, root)).join("\n      ")}
    </div>
  </div>
</section>

${ctaBand(root)}`;
  write(rel + "index.html", page({
    root, rel, active: "blog", type: "article",
    title: p.seoTitle, description: p.description, body,
    jsonld: [breadcrumbLD([["Blog", "blog/"], [p.title, rel]]), {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      dateModified: p.date,
      mainEntityOfPage: abs(rel),
      image: abs("og-image.png"),
      author: { "@type": "Organization", name: "Novel Tissues", url: abs("") },
      publisher: { "@id": ORG_ID },
      articleSection: p.category,
      wordCount: strip(p.body).split(" ").length
    }]
  }));
}

/* ---------- trust & price sections (hidden until site/content-more.mjs has data) ---------- */
function trustHTML(root) {
  const t = TRUST;
  const parts = [];
  if (t.videoId || t.photos.length) {
    parts.push(`<div class="trust-block">
      <div class="sec-head"><p class="kicker reveal">Inside our plants</p><h2 class="split">See where your products <em>are made.</em></h2></div>
      ${t.videoId ? `<button type="button" class="video-lite reveal" data-yt="${attr(t.videoId)}" style="background-image:url('https://i.ytimg.com/vi/${attr(t.videoId)}/hqdefault.jpg')" aria-label="Play factory tour video"><span>▶</span></button>` : ""}
      ${t.photos.length ? `<div class="gallery">${t.photos.map(ph => `<figure class="reveal"><img src="${root}${attr(ph.src)}" alt="${attr(ph.caption || "Novel Tissues manufacturing")}" loading="lazy" width="800" height="600" />${ph.caption ? `<figcaption>${ph.caption}</figcaption>` : ""}</figure>`).join("")}</div>` : ""}
    </div>`);
  }
  if (t.certifications.length) {
    parts.push(`<div class="trust-block"><p class="kicker reveal">Certifications &amp; licences</p>
      <div class="cert-row">${t.certifications.map(c => `<div class="cert reveal"><b>${c.name}</b>${c.detail ? `<span>${c.detail}</span>` : ""}</div>`).join("")}</div></div>`);
  }
  if (t.clients.length) {
    parts.push(`<div class="trust-block"><p class="kicker reveal">Brands we make for</p>
      <div class="client-row">${t.clients.map(c => c.logo ? `<img class="reveal" src="${root}${attr(c.logo)}" alt="${attr(c.name)}" loading="lazy" height="48" />` : `<span class="client reveal">${c.name}</span>`).join("")}</div></div>`);
  }
  if (t.caseStudies.length) {
    parts.push(`<div class="trust-block"><p class="kicker reveal">Results</p>
      <div class="grid-3">${t.caseStudies.map(c => `<article class="feat reveal"><h3 class="h4">${c.title}</h3><p class="case-result">${c.result}</p>${c.detail ? `<p>${c.detail}</p>` : ""}</article>`).join("")}</div></div>`);
  }
  if (t.moq.length) {
    parts.push(`<div class="trust-block"><p class="kicker reveal">Minimum orders &amp; lead times</p>
      <div class="table-wrap reveal"><table class="spec-table wide"><thead><tr><th>Product</th><th>Minimum first order</th><th>First order</th><th>Repeat orders</th></tr></thead>
      <tbody>${t.moq.map(m => `<tr><th scope="row">${m.product}</th><td>${m.moq}</td><td>${m.firstOrder || "—"}</td><td>${m.repeat || "—"}</td></tr>`).join("")}</tbody></table></div>
      <p class="fine">Indicative. Final quantities and timelines depend on packaging and approvals for each project.</p></div>`);
  }
  return parts.length ? `<section class="sec trust" id="trust"><div class="wrap">${parts.join("\n")}</div></section>` : "";
}

function pricesHTML() {
  if (!PRICE_BANDS.length) return "";
  return `<section class="sec prices" id="prices">
  <div class="wrap split-2">
    <div>
      <p class="kicker reveal">Price estimator</p>
      <h2 class="split">What could your range <em>cost per unit?</em></h2>
      <p class="lead reveal">Pick a product and a quantity for an indicative price per unit. Final prices depend on your formula, packaging and artwork — we confirm them in your quote.</p>
    </div>
    <div class="price-card reveal">
      <div class="field"><label for="priceProduct">Product</label><select id="priceProduct">${PRICE_BANDS.map((p, i) => `<option value="${i}">${p.product}</option>`).join("")}</select></div>
      <div class="field"><label for="priceQty">Quantity per order</label><input id="priceQty" type="number" min="1" step="1000" value="${PRICE_BANDS[0].bands[0].from}" /></div>
      <div class="price-out" id="priceOut" aria-live="polite"></div>
      <p class="fine">Indicative ex-GST prices in ₹. Freight extra.</p>
      <a class="btn btn-peach" href="#contact">Get an exact quote →</a>
    </div>
  </div>
  <script type="application/json" id="priceData">${JSON.stringify(PRICE_BANDS).replace(/</g, "\\u003c")}</script>
</section>`;
}

/* ---------- landing pages: regions, specialist ranges, export ---------- */
const groupPath = g => (GROUPS[g]?.path || "products/");
for (const l of LANDINGS) {
  const root = "../../";
  const rel = `${groupPath(l.group)}${l.slug}/`;
  const parent = l.group === "products" ? ["Products", "products/"] : [GROUPS[l.group].title, GROUPS[l.group].path];
  const body = `
<section class="page-hero" style="--hero-bg:${l.heroBg}">
  <div class="blob b1"></div><div class="blob b2"></div>
  <div class="wrap ph-grid">
    <div>
      ${crumbs(root, [parent, [l.nav]])}
      <p class="kicker">${l.kicker}</p>
      <h1 class="split">${l.h1}</h1>
      <p class="ph-lead reveal">${l.lead}</p>
      <div class="ph-ctas reveal">
        <a class="btn btn-peach magnetic" href="${root}#contact">Get a quote <span class="arrow">→</span></a>
        <button type="button" class="btn btn-ink" data-open="sample">Request samples</button>
        <button type="button" class="btn btn-ghost" data-open="visit">Book a visit</button>
      </div>
      <div class="facts reveal">${l.facts.map(f => `<span>${f}</span>`).join("")}</div>
    </div>
    <div class="ph-art" aria-hidden="true">${l.art.map(a => artDiv(a)).join("")}</div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="pack-grid">
      ${l.points.map(([t, d], i) => `<div class="feat reveal"><span class="feat-n">${String(i + 1).padStart(2, "0")}</span><h2 class="h4">${t}</h2><p>${d}</p></div>`).join("\n      ")}
    </div>
  </div>
</section>

${l.sections.map((sec, i) => `<section class="sec${i % 2 === 0 ? " alt" : ""}">
  <div class="wrap split-2">
    <div><h2 class="split">${sec.h2}</h2></div>
    <div class="prose reveal">${sec.html}</div>
  </div>
</section>`).join("\n")}

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><p class="kicker reveal">Explore the range</p><h2 class="split">Products you can <em>launch with us.</em></h2></div>
    <div class="cat-links reveal">${l.products.map(sl => `<a href="${root}products/${sl}/">${catBySlug[sl].nav} <span class="arrow">→</span></a>`).join("")}</div>
  </div>
</section>

<section class="sec alt">
  <div class="wrap faq-grid">
    <div><p class="kicker reveal">FAQ</p><h2 class="split">Questions, <em>answered.</em></h2></div>
    <div class="acc">
        ${faqList(l.faqs)}
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap">
    <div class="sec-head"><p class="kicker reveal">From the blog</p><h2 class="split">Guides for <em>brand builders.</em></h2></div>
    <div class="post-grid">${l.posts.map(sl => postCard(postsBySlug[sl], root)).join("")}</div>
  </div>
</section>

${ctaBand(root)}`;
  const area = l.group === "export"
    ? { "@type": "Place", name: l.nav }
    : l.group === "locations" ? { "@type": "Place", name: `${l.nav}, India` } : { "@type": "Country", name: "India" };
  write(rel + "index.html", page({
    root, rel, title: l.seoTitle, description: l.description, body, active: l.group === "products" ? "products" : "",
    jsonld: [breadcrumbLD([[parent[0], parent[1]], [l.nav, rel]]), {
      "@context": "https://schema.org", "@type": "Service", name: strip(l.h1), description: l.description,
      provider: { "@id": ORG_ID }, areaServed: area, url: abs(rel)
    }, faqLD(l.faqs)]
  }));
}

/* ---------- group hubs: locations & export ---------- */
for (const [key, g] of Object.entries(GROUPS)) {
  const root = "../";
  const rel = g.path;
  const items = LANDINGS.filter(l => l.group === key);
  const body = `
<section class="page-hero compact" style="--hero-bg:#E2E4EA">
  <div class="blob b1"></div><div class="blob b2"></div>
  <div class="wrap">
    ${crumbs(root, [[g.title]])}
    <p class="kicker">${g.title}</p>
    <h1 class="split">${g.h1}</h1>
    <p class="ph-lead reveal">${g.lead}</p>
  </div>
</section>
<section class="sec">
  <div class="wrap cat-grid">
    ${items.map(l => `<a class="cat-card reveal" href="${l.slug}/" style="--bg:${l.heroBg}">
      <div class="cat-art" aria-hidden="true">${l.art.slice(0, 3).map(a => artDiv(a)).join("")}</div>
      <div class="cat-body"><p class="kicker">${l.kicker}</p><h2 class="h3">${l.nav}</h2><p>${l.description}</p><span class="pp-link">Read more <span class="arrow">→</span></span></div>
    </a>`).join("\n    ")}
  </div>
</section>
${ctaBand(root)}`;
  write(rel + "index.html", page({
    root, rel, title: g.seoTitle, description: g.description, body,
    jsonld: [breadcrumbLD([[g.title, rel]]), { "@context": "https://schema.org", "@type": "ItemList",
      itemListElement: items.map((l, i) => ({ "@type": "ListItem", position: i + 1, name: l.nav, url: abs(`${rel}${l.slug}/`) })) }]
  }));
}

/* ---------- about ---------- */
{
  const root = "../";
  const rel = "about/";
  const body = `
<section class="page-hero" style="--hero-bg:#E3DCDC">
  <div class="blob b1"></div><div class="blob b2"></div>
  <div class="wrap ph-grid">
    <div>
      ${crumbs(root, [["About"]])}
      <p class="kicker">About Novel Tissues</p>
      <h1 class="split">${ABOUT.h1}</h1>
      <p class="ph-lead reveal">${ABOUT.lead}</p>
      <div class="ph-ctas reveal"><button type="button" class="btn btn-peach" data-open="visit">Book a factory visit</button><button type="button" class="btn btn-ghost" data-open="brochure">Brochure ↓</button></div>
    </div>
    <div class="ph-art" aria-hidden="true">${[{ type: "detergent", pal: 4 }, { type: "pump", pal: 0 }, { type: "wipes", pal: 2 }, { type: "tube", pal: 1 }].map(a => artDiv(a)).join("")}</div>
  </div>
</section>

<section class="sec dark">
  <div class="wrap">
    <div class="about-nums">
      <div class="reveal"><b>1.5 Cr+</b><span>wipes every month</span></div>
      <div class="reveal"><b>9</b><span>wipes machines</span></div>
      <div class="reveal"><b>8</b><span>liquid lines in Pondicherry</span></div>
      <div class="reveal"><b>5,00,000</b><span>sq.ft of manufacturing</span></div>
      ${TRUST.facts.map(f => `<div class="reveal"><b>${f.value}</b><span>${f.label}</span></div>`).join("")}
    </div>
  </div>
</section>

${TRUST.story.length ? `<section class="sec"><div class="wrap split-2"><div><p class="kicker reveal">Our story</p><h2 class="split">How Novel Tissues <em>began.</em></h2></div><div class="prose reveal">${TRUST.story.map(p => `<p>${p}</p>`).join("")}</div></div></section>` : ""}

<section class="sec">
  <div class="wrap split-2">
    <div><p class="kicker reveal">What we do</p><h2 class="split">One manufacturer <em>for the whole nursery.</em></h2>
      <p class="lead reveal">Most baby brands juggle a wipes converter, a cosmetics filler and a detergent maker. We make all three — under one contract, one quality system and one dispatch plan.</p></div>
    <div class="base-list">${CATEGORIES.map(c => `<a class="base reveal" href="${root}products/${c.slug}/"><h3 class="h4">${c.nav}</h3><p>${strip(c.lead).split(". ")[0]}.</p></a>`).join("")}</div>
  </div>
</section>

<section class="sec alt">
  <div class="wrap">
    <div class="sec-head"><p class="kicker reveal">Our plants</p><h2 class="split">Three units, <em>one standard.</em></h2></div>
    <div class="grid-3">
      <div class="feat reveal"><span class="feat-n">Wipes</span><h3 class="h4">North India Wipes Plant</h3><p>Baby wipes made close to North, Central, West and East India markets for faster replenishment.</p></div>
      <div class="feat reveal"><span class="feat-n">Wipes</span><h3 class="h4">South India Wipes Plant</h3><p>Wipes for South India and export lanes, running the same specifications and quality checks as the North plant.</p></div>
      <div class="feat reveal"><span class="feat-n">Liquids</span><h3 class="h4">Pondicherry Liquids Campus</h3><p>One of the largest cosmetics plants in the region, with eight manufacturing lines for every baby liquid.</p></div>
    </div>
  </div>
</section>

<section class="sec">
  <div class="wrap split-2">
    <div><p class="kicker reveal">How we work</p><h2 class="split">Built around <em>your brand.</em></h2></div>
    <ul class="tick-list reveal">
      <li>NDA before we see your formulas or artwork</li>
      <li>Proven baby-safe bases, or manufacturing to your formula</li>
      <li>Samples side by side before you commit</li>
      <li>Batch-wise quality release and traceability</li>
      <li>Production planned on a rolling forecast</li>
      <li>We never compete with you on the shelf</li>
    </ul>
  </div>
</section>

${trustHTML(root)}
${ctaBand(root)}`;
  write(rel + "index.html", page({
    root, rel, title: ABOUT.seoTitle, description: ABOUT.description, body,
    jsonld: [breadcrumbLD([["About", rel]]), { "@context": "https://schema.org", "@type": "AboutPage", url: abs(rel), mainEntity: { "@id": ORG_ID } }]
  }));
}

/* ---------- privacy & terms ---------- */
function legalPage(rel, title, h1, description, html) {
  const root = "../";
  const body = `
<section class="page-hero compact" style="--hero-bg:#E9E5E3">
  <div class="wrap">
    ${crumbs(root, [[title]])}
    <h1>${h1}</h1>
    <p class="ph-lead">Last updated ${fmtDate(PUBLISHED)}</p>
  </div>
</section>
<section class="sec legal"><div class="wrap"><div class="prose">${html}</div></div></section>`;
  write(rel + "index.html", page({ root, rel, title: `${title} | Novel Tissues`, description, body, jsonld: [breadcrumbLD([[title, rel]])] }));
}
const host = new URL(SITE.url).host;
legalPage("privacy/", "Privacy policy", "Privacy policy", "How Novel Tissues collects, uses and protects the details you share through this website.", `
<p>This policy explains how Novel Tissues ("we", "us") handles personal data collected through ${host}. We collect only what we need to respond to business enquiries, and we process it in line with India's Digital Personal Data Protection Act, 2023.</p>
<h2>What we collect</h2>
<ul>
  <li><strong>Details you give us in our forms:</strong> your name, company, work email, phone or WhatsApp number, business type, the products you're interested in, volumes, notes, and — for sample requests — a delivery address; for visit requests, your preferred date and time.</li>
  <li><strong>Technical data:</strong> standard server logs (such as IP address and browser type) used to keep the site secure and working.</li>
  <li><strong>Analytics:</strong> when enabled, Google Analytics collects anonymised information about how visitors use the site, such as pages viewed.</li>
  <li><strong>Your browser:</strong> the site stores your form details in your own browser so you don't have to type them twice. You can clear this at any time in your browser settings.</li>
</ul>
<h2>Why we use it</h2>
<ul>
  <li>To reply to your enquiry, send the brochure, dispatch samples and arrange visits or calls you request.</li>
  <li>To follow up about private label manufacturing you have asked us about.</li>
  <li>To understand which pages are useful and improve the site.</li>
</ul>
<p>We do not sell your personal data, and we do not use it for unrelated marketing.</p>
<h2>Who we share it with</h2>
<p>Only service providers that help us run the site and respond to you — such as our hosting provider, email provider, spreadsheet tools used by our sales team, and analytics when enabled — and only as needed for those purposes. We may also disclose data where the law requires it.</p>
<h2>How long we keep it</h2>
<p>We keep enquiry details for as long as needed to respond to you and manage any business relationship that follows, and then delete or anonymise them unless the law requires us to keep them longer.</p>
<h2>Your rights</h2>
<p>You can ask us to access, correct or erase your personal data, withdraw your consent, or raise a grievance. Write to <a href="mailto:${CONTACT.email}">${CONTACT.email}</a> and we will respond within a reasonable time.</p>
<h2>Security</h2>
<p>The site is served over HTTPS, and enquiry data is stored on our server outside the public website folder, with access limited to our team.</p>
<h2>Changes</h2>
<p>We may update this policy. The date at the top shows the latest version.</p>
<h2>Contact</h2>
<p>Questions about this policy: <a href="mailto:${CONTACT.email}">${CONTACT.email}</a>.</p>`);

legalPage("terms/", "Terms of use", "Terms of use", "Terms for using the Novel Tissues website.", `
<p>By using ${host} you agree to these terms.</p>
<h2>Information on this site</h2>
<p>The content on this site describes our private label manufacturing services in general terms. Capacities, product formats, specifications, timelines and prices shown are indicative and may change. Nothing on this site is an offer to sell; every order is subject to a written quotation and agreement.</p>
<h2>Samples, quotes and orders</h2>
<p>Sample kits, quotes and visits are arranged at our discretion. Specifications, prices, minimum quantities, lead times, payment and delivery terms are set out in the quotation or agreement for each project.</p>
<h2>Intellectual property</h2>
<p>The design, text, graphics and brochure on this site belong to Novel Tissues. Product mock-ups showing "Your Brand" are illustrations. You may share links to the site and the brochure, but you may not copy or reuse our content without permission. Your brand names, formulas and artwork remain yours.</p>
<h2>Third-party links</h2>
<p>Links to other websites are provided for convenience. We are not responsible for their content.</p>
<h2>Liability</h2>
<p>We work to keep this site accurate and available, but we provide it "as is". To the extent the law allows, we are not liable for losses arising from use of the site or reliance on its general information.</p>
<h2>Governing law</h2>
<p>These terms are governed by the laws of India.</p>
<h2>Contact</h2>
<p><a href="mailto:${CONTACT.email}">${CONTACT.email}</a></p>`);

/* ---------- trade show lead capture (shared by QR code on the banner) ---------- */
{
  const root = "../";
  const rel = "expo/";
  const body = `
<section class="page-hero compact" style="--hero-bg:#E2E4EA">
  <div class="blob b1"></div><div class="blob b2"></div>
  <div class="wrap ph-grid">
    <div>
      <p class="kicker">Great to meet you</p>
      <h1 class="split">Met us at the show? <em>Let's stay in touch.</em></h1>
      <p class="ph-lead reveal">Leave your details and what you'd like to make. We'll send the brochure and follow up with options for your range.</p>
      <div class="facts reveal"><span>1.5 Cr+ wipes / month</span><span>8 liquid lines</span><span>5 Lakh sq.ft</span></div>
    </div>
    <form class="expo-card reveal" id="expoForm" novalidate>
      <div class="field"><label>I'm interested in</label>
        <div class="chips">${["Baby wipes", "Shampoo / wash", "Lotion / cream / oil", "Laundry & cleaners", "Full range"].map(p => `<label><input type="checkbox" name="products" value="${p}" /><span>${p}</span></label>`).join("")}</div>
      </div>
      <div class="field two">
        <div><label for="xName">Your name *</label><input id="xName" name="name" required autocomplete="name" /></div>
        <div><label for="xCompany">Company / brand *</label><input id="xCompany" name="company" required autocomplete="organization" /></div>
      </div>
      <div class="field two">
        <div><label for="xEmail">Work email *</label><input id="xEmail" name="email" type="email" required autocomplete="email" /></div>
        <div><label for="xPhone">Phone / WhatsApp *</label><input id="xPhone" name="phone" type="tel" required autocomplete="tel" /></div>
      </div>
      <div class="field"><label for="xNotes">Anything to remember from our chat?</label><textarea id="xNotes" name="notes" rows="2"></textarea></div>
      <input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true" />
      <button type="submit" class="btn btn-peach btn-block">Send &amp; get the brochure</button>
      <p class="form-err" role="alert"></p>
      <div class="expo-done" hidden><div class="done-burst"></div><h2 class="h3">Thank you — we'll be in touch.</h2><p><a class="link" data-brochure-link href="#">Download the brochure now</a></p></div>
    </form>
  </div>
</section>
<script>
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("expoForm");
  const done = form.querySelector(".expo-done");
  const link = form.querySelector("[data-brochure-link]");
  link.href = ROOT + SITE.brochure;
  form.addEventListener("submit", async e => {
    e.preventDefault();
    const err = form.querySelector(".form-err");
    if (!validContact(form)) { err.textContent = "Please fill in the highlighted fields."; return; }
    err.textContent = "";
    const fd = new FormData(form);
    const d = { ...Object.fromEntries(fd.entries()), products: fd.getAll("products"), business: "Met at trade show", type: "enquiry" };
    if (!d.website) { rememberContact(d); await sendLead(d); }
    [...form.children].forEach(el => { if (el !== done) el.hidden = true; });
    done.hidden = false;
    confetti();
  });
});
</script>`;
  write(rel + "index.html", page({ root, rel, noindex: true,
    title: "Trade show — Novel Tissues private label baby care",
    description: "Met Novel Tissues at a trade show? Leave your details to get our private label brochure and a follow-up.", body }));
}

/* ---------- home page: inject shared nav, footer, SEO, FAQ, blog ---------- */
{
  const file = path.join(OUT, "index.html");
  let html = fs.readFileSync(file, "utf8");
  const inject = (name, content) => {
    const re = new RegExp(`(<!--${name}-->)[\\s\\S]*?(<!--/${name}-->)`);
    if (!re.test(html)) throw new Error(`Marker ${name} missing in index.html`);
    html = html.replace(re, `$1\n${content}\n$2`);
  };
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: "Novel Tissues",
    url: abs(""),
    logo: abs("logo.png"),
    image: abs("og-image.png"),
    description: "Private label manufacturer of baby wipes, baby cosmetics (shampoo, lotion, cream, oil) and baby laundry & cleaning liquids, with wipes plants in North and South India and an 8-line liquids campus in Pondicherry.",
    ...(CONTACT.email ? { email: CONTACT.email } : {}),
    ...(CONTACT.phone ? { telephone: CONTACT.phone } : {}),
    contactPoint: [{ "@type": "ContactPoint", contactType: "sales", areaServed: "IN", ...(CONTACT.email ? { email: CONTACT.email } : {}), ...(CONTACT.phone ? { telephone: CONTACT.phone } : {}) }],
    knowsAbout: ["Private label baby wipes", "Baby shampoo manufacturing", "Baby lotion manufacturing", "Baby laundry detergent manufacturing", "Contract cosmetics manufacturing"],
    areaServed: { "@type": "Country", name: "India" }
  };
  const website = { "@context": "https://schema.org", "@type": "WebSite", name: "Novel Tissues", url: abs(""), publisher: { "@id": ORG_ID }, inLanguage: "en-IN" };

  inject("SEO", "  " + seoHead({
    title: "Private Label Baby Care Manufacturer in India | Baby Wipes, Shampoo, Lotion | Novel Tissues",
    description: "Novel Tissues is a private label manufacturer of baby wipes, baby shampoo, lotion, cream, oil and baby laundry detergent in India. 9 wipes machines, 1.5 crore+ wipes a month, 8 liquid lines in Pondicherry.",
    url: abs(""),
    jsonld: [org, website, faqLD(HOME_FAQ)]
  }));
  inject("NAV", navHTML(""));
  inject("TRUST", trustHTML(""));
  inject("PRICES", pricesHTML());
  inject("FOOTER", footerHTML(""));
  inject("HOMEFAQ", "        " + faqList(HOME_FAQ));
  inject("CATLINKS", `      <div class="cat-links reveal">
        <span>Full specifications:</span>
        ${CATEGORIES.map(c => `<a href="products/${c.slug}/">${c.nav} <span class="arrow">→</span></a>`).join("\n        ")}
      </div>`);
  inject("BLOG", `      <div class="post-grid">
        ${[...ALL_POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).map(p => postCard(p, "")).join("\n        ")}
      </div>`);
  fs.writeFileSync(file, html);
  console.log("updated public/b2b/index.html");
}

/* ---------- sitemap & robots ---------- */
{
  const urls = [
    ["", "weekly", "1.0"],
    ["products/", "monthly", "0.9"],
    ...CATEGORIES.map(c => [`products/${c.slug}/`, "monthly", "0.9"]),
    ["blog/", "weekly", "0.7"],
    ...ALL_POSTS.map(p => [`blog/${p.slug}/`, "monthly", "0.6", p.date]),
    ...LANDINGS.map(l => [`${groupPath(l.group)}${l.slug}/`, "monthly", "0.8"]),
    ...Object.values(GROUPS).map(g => [g.path, "monthly", "0.7"]),
    ["about/", "monthly", "0.6"], ["privacy/", "yearly", "0.2"], ["terms/", "yearly", "0.2"]
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, f, pr, d]) => `  <url><loc>${abs(u)}</loc><lastmod>${d || PUBLISHED}</lastmod><changefreq>${f}</changefreq><priority>${pr}</priority></url>`).join("\n")}
</urlset>
`;
  write("sitemap.xml", xml);
  write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /admin/\n\nSitemap: ${abs("sitemap.xml")}\n`);
}
