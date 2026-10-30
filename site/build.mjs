// Builds the static product, blog and SEO files into public/b2b.
// Usage: npm run build:site
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { CATEGORIES, POSTS, HOME_FAQ, PUBLISHED } from "./content.mjs";

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

function seoHead({ title, description, url, type = "website", image = abs("og-image.png"), jsonld = [], extra = "" }) {
  return `<title>${title}</title>
  <meta name="description" content="${attr(description)}" />
  <link rel="canonical" href="${url}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
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
  return `<footer class="footer">
  <div class="wrap">
    <div class="footer-top">
      <div>
        <div class="footer-word">Novel Tissues</div>
        <p>Private label manufacturer of baby wipes, baby cosmetics and baby laundry &amp; cleaning liquids. North &amp; South India wipes plants · Pondicherry liquids campus · 5,00,000 sq.ft of manufacturing.</p>
      </div>
      <div class="footer-cols">
        <div><h5>Products</h5>${CATEGORIES.map(c => `<a href="${root}products/${c.slug}/">${c.nav}</a>`).join("")}<a href="${root}products/">All products</a></div>
        <div><h5>Explore</h5><a href="${root}#plants">Our plants</a><a href="${root}#planner">Capacity planner</a><a href="${root}#process">Process</a><a href="${root}blog/">Blog</a></div>
        <div><h5>Talk to us</h5><a href="${root}#contact">Request a quote</a><a href="#sample" data-open="sample">Request samples</a><a href="#brochure" data-open="brochure">Download brochure</a><span data-contact-links></span></div>
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

function page({ root, rel, title, description, body, jsonld, type, active, image }) {
  return `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  ${seoHead({ title, description, url: abs(rel), type, jsonld, image })}
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

const postsBySlug = Object.fromEntries(POSTS.map(p => [p.slug, p]));
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
      <div class="ph-ctas reveal"><button type="button" class="btn btn-ink" data-open="brochure">Get the full brochure ↓</button></div>
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
  const sorted = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
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
for (const p of POSTS) {
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
  const related = POSTS.filter(x => x.slug !== p.slug).slice(0, 3);
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
  inject("FOOTER", footerHTML(""));
  inject("HOMEFAQ", "        " + faqList(HOME_FAQ));
  inject("CATLINKS", `      <div class="cat-links reveal">
        <span>Full specifications:</span>
        ${CATEGORIES.map(c => `<a href="products/${c.slug}/">${c.nav} <span class="arrow">→</span></a>`).join("\n        ")}
      </div>`);
  inject("BLOG", `      <div class="post-grid">
        ${[...POSTS].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 3).map(p => postCard(p, "")).join("\n        ")}
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
    ...POSTS.map(p => [`blog/${p.slug}/`, "monthly", "0.6", p.date])
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(([u, f, pr, d]) => `  <url><loc>${abs(u)}</loc><lastmod>${d || PUBLISHED}</lastmod><changefreq>${f}</changefreq><priority>${pr}</priority></url>`).join("\n")}
</urlset>
`;
  write("sitemap.xml", xml);
  write("robots.txt", `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${abs("sitemap.xml")}\n`);
}
