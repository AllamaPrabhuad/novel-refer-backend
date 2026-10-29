// Renders the downloadable brochure PDF, the social share image and the logo
// into public/b2b using Playwright's Chromium.
// Usage: npm run build:assets   (needs Playwright: npm i -D playwright)
import fs from "fs";
import path from "path";
import { createRequire } from "module";
import { fileURLToPath } from "url";
import { CATEGORIES } from "./content.mjs";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const here = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.resolve(here, "../public/b2b");
const { CONTACT, SITE } = new Function(fs.readFileSync(path.join(OUT, "config.js"), "utf8") + "; return { CONTACT, SITE };")();
const domain = SITE.url.replace(/^https?:\/\//, "").replace(/\/$/, "");

const FONTS = `<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />`;
const DROP = `<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#14213D"/><path d="M32 12c8 11 14 18 14 26a14 14 0 0 1-28 0c0-8 6-15 14-26z" fill="#F6A88A"/><circle cx="27" cy="38" r="4" fill="#FBF6EF" opacity=".7"/></svg>`;

const BASE_CSS = `
  :root { --cream:#FBF6EF; --cream-2:#F4ECE1; --cream-3:#EDE4D8; --ink:#14213D; --ink-2:#2A3656; --muted:#5E6784; --peach:#F6A88A; --peach-2:#FBD3C3; --mint:#8FD3BE; --mint-2:#CDEFE3; --sky:#9CC5F0; --sky-2:#D7E8FA; --lilac:#C7B8F0; --butter:#F7DE8C; }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: "Plus Jakarta Sans", sans-serif; color: var(--ink); -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  h1, h2, h3, h4 { font-family: "Fraunces", Georgia, serif; font-weight: 500; letter-spacing: -.02em; line-height: 1.05; }
  em { font-style: italic; color: var(--peach); }
  svg { display: block; width: 100%; height: auto; }
`;

const contactLines = [
  CONTACT.email && `✉ ${CONTACT.email}`,
  CONTACT.phone && `☏ ${CONTACT.phone}`,
  CONTACT.whatsapp && `WhatsApp +${CONTACT.whatsapp}`,
  `⌂ ${domain}`
].filter(Boolean);

const art = (type, pal, extra = "") => `<div class="a a-${type}" data-art="${type}" data-pal="${pal}" ${extra}></div>`;
const list = items => `<ul class="ticks">${items.map(i => `<li>${i}</li>`).join("")}</ul>`;
const [wipes, bath, skin, home] = CATEGORIES;

function footer(n) {
  return `<div class="pf"><span>Novel Tissues · Private Label Baby Care</span><span>${domain}</span><span>${String(n).padStart(2, "0")}</span></div>`;
}

const BROCHURE = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}
  @page { size: A4; margin: 0; }
  .pg { width: 210mm; height: 297mm; position: relative; overflow: hidden; page-break-after: always; background: var(--cream); padding: 18mm 16mm 22mm; }
  .pg:last-child { page-break-after: auto; }
  .dark { background: var(--ink); color: var(--cream); }
  .kick { font-size: 8.5pt; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: var(--muted); display: flex; align-items: center; gap: 8px; }
  .kick::before { content: ""; width: 22px; height: 2px; background: var(--peach); }
  .dark .kick { color: rgba(251,246,239,.7); }
  h2 { font-size: 30pt; margin-top: 8px; }
  h3 { font-size: 15pt; }
  p { font-size: 10pt; line-height: 1.6; color: var(--ink-2); }
  .dark p { color: rgba(251,246,239,.75); }
  .lead { font-size: 11.5pt; margin-top: 10px; max-width: 150mm; }
  .pf { position: absolute; left: 16mm; right: 16mm; bottom: 9mm; display: flex; justify-content: space-between; font-size: 7.5pt; font-weight: 700; color: var(--muted); border-top: 1px solid var(--cream-3); padding-top: 3mm; }
  .dark .pf { color: rgba(251,246,239,.5); border-color: rgba(255,255,255,.12); }
  .ticks { list-style: none; display: grid; gap: 5px; margin-top: 8px; }
  .ticks li { position: relative; padding-left: 16px; font-size: 9.5pt; font-weight: 600; }
  .ticks li::before { content: "✓"; position: absolute; left: 0; color: #3DA88A; font-weight: 800; }
  .card { background: #fff; border-radius: 14px; padding: 12px 14px; }
  .card h4 { font-size: 11.5pt; }
  .card p { font-size: 8.8pt; margin-top: 4px; line-height: 1.5; }
  .chips { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 6px; }
  .chips span { font-size: 7pt; font-weight: 700; padding: 2px 7px; border-radius: 99px; background: var(--cream-2); }
  .g2 { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
  .g3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
  table { width: 100%; border-collapse: collapse; background: #fff; border-radius: 14px; overflow: hidden; font-size: 8.8pt; }
  th, td { text-align: left; vertical-align: top; padding: 4.5px 12px; border-bottom: 1px solid var(--cream-3); }
  th { width: 30%; font-size: 7pt; letter-spacing: .1em; text-transform: uppercase; color: var(--muted); font-weight: 800; padding-top: 8px; }
  tr:last-child th, tr:last-child td { border-bottom: 0; }
  .band { border-radius: 18px; padding: 10px 16px; display: flex; align-items: flex-end; gap: 0; justify-content: center; height: 38mm; overflow: hidden; }
  .band.tall .a { width: 15mm; }
  .band.tall .a-jar { width: 28mm; }
  .band .a { width: 22mm; margin-left: -3mm; filter: drop-shadow(0 6px 8px rgba(20,33,61,.18)); }
  .band .a-wipes, .band .a-jar, .band .a-detergent { width: 46mm; }
  .sec-title { display: flex; justify-content: space-between; align-items: flex-end; gap: 10mm; }

  /* cover */
  .cover { padding: 20mm 18mm; }
  .cover .brand { display: flex; align-items: center; gap: 10px; }
  .cover .brand svg { width: 13mm; }
  .cover .brand b { font-family: "Fraunces", serif; font-size: 18pt; font-weight: 600; }
  .cover .brand small { display: block; font-size: 7pt; letter-spacing: .16em; text-transform: uppercase; color: rgba(251,246,239,.6); font-weight: 800; }
  .cover h1 { font-size: 46pt; line-height: .98; margin-top: 30mm; letter-spacing: -.035em; }
  .cover .sub { font-size: 12pt; color: rgba(251,246,239,.75); margin-top: 8mm; max-width: 140mm; line-height: 1.55; }
  .cover .glow { position: absolute; width: 160mm; height: 160mm; border-radius: 50%; right: -50mm; bottom: 10mm; background: radial-gradient(circle, rgba(246,168,138,.35), transparent 65%); }
  .cover .stage { position: absolute; left: 14mm; right: 14mm; bottom: 46mm; display: flex; align-items: flex-end; justify-content: center; }
  .cover .stage .a { width: 26mm; margin-left: -4mm; filter: drop-shadow(0 10px 14px rgba(0,0,0,.35)); }
  .cover .stage .a-wipes { width: 62mm; } .cover .stage .a-jar { width: 40mm; } .cover .stage .a-detergent { width: 40mm; }
  .stats { position: absolute; left: 18mm; right: 18mm; bottom: 16mm; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6mm; border-top: 1px solid rgba(255,255,255,.15); padding-top: 6mm; }
  .stats b { display: block; font-family: "Fraunces", serif; font-size: 22pt; font-weight: 500; color: var(--peach); }
  .stats span { font-size: 8pt; font-weight: 700; color: rgba(251,246,239,.7); }

  /* about */
  .nums { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 9mm; }
  .num { background: var(--ink); color: var(--cream); border-radius: 14px; padding: 12px 14px; }
  .num b { font-family: "Fraunces", serif; font-size: 26pt; font-weight: 500; color: var(--peach); line-height: 1; }
  .num b small { font-family: "Plus Jakarta Sans"; font-size: 9pt; color: var(--cream); font-weight: 700; margin-left: 4px; }
  .num h4 { font-size: 11pt; margin-top: 6px; }
  .num p { font-size: 8.3pt; color: rgba(251,246,239,.65); margin-top: 3px; line-height: 1.45; }
  .units { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 7mm; }
  .unit { border-radius: 16px; padding: 14px; }
  .unit .tag { font-size: 7pt; font-weight: 800; letter-spacing: .12em; text-transform: uppercase; }
  .unit h3 { font-size: 13pt; margin-top: 5px; }
  .unit p { font-size: 8.8pt; margin-top: 5px; }

  /* process */
  .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8mm; }
  .step { background: #fff; border-radius: 14px; padding: 12px 14px; }
  .step .n { width: 9mm; height: 9mm; border-radius: 50%; background: var(--ink); color: var(--cream); display: grid; place-items: center; font-family: "Fraunces", serif; font-weight: 600; font-size: 12pt; }
  .step:nth-child(3n+2) .n { background: var(--peach); color: var(--ink); }
  .step:nth-child(3n) .n { background: var(--mint); color: var(--ink); }
  .step h4 { font-size: 11pt; margin-top: 7px; }
  .step p { font-size: 8.5pt; margin-top: 3px; line-height: 1.5; }
  .q { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1); border-radius: 14px; padding: 12px 14px; }
  .q h4 { font-size: 11pt; color: var(--cream); }
  .q p { font-size: 8.5pt; margin-top: 3px; }

  /* back */
  .serve { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 8mm; }
  .serve div { background: rgba(255,255,255,.06); border-radius: 14px; padding: 12px 14px; }
  .serve h4 { font-size: 11pt; color: var(--cream); }
  .serve p { font-size: 8.5pt; margin-top: 3px; }
  .next { margin-top: 14mm; background: var(--peach); color: var(--ink); border-radius: 22px; padding: 12mm; }
  .next h2 { font-size: 28pt; }
  .next p { color: var(--ink-2); font-size: 11pt; margin-top: 4mm; max-width: 130mm; }
  .next .contact { display: grid; gap: 4px; margin-top: 7mm; font-size: 12pt; font-weight: 800; }
</style></head><body>

<!-- 1 · Cover -->
<section class="pg dark cover">
  <div class="glow"></div>
  <div class="brand">${DROP}<div><b>Novel Tissues</b><small>Private label baby care</small></div></div>
  <h1>Your baby-care brand, <em>made under one roof.</em></h1>
  <p class="sub">Private label manufacturing of baby wipes, baby cosmetics and baby laundry &amp; cleaning liquids — from wipes plants in North &amp; South India and an 8-line liquids campus in Pondicherry.</p>
  <div class="stage">${art("detergent", 4)}${art("pump", 0)}${art("wipes", 2)}${art("flip", 5)}${art("jar", 3)}${art("tube", 1)}</div>
  <div class="stats">
    <div><b>1.5 Cr+</b><span>wipes every month</span></div>
    <div><b>9</b><span>wipes machines</span></div>
    <div><b>8</b><span>liquid lines in Pondicherry</span></div>
    <div><b>5 Lakh</b><span>sq.ft manufacturing</span></div>
  </div>
</section>

<!-- 2 · About -->
<section class="pg">
  <p class="kick">About Novel Tissues</p>
  <h2>One manufacturer for <em>the whole nursery.</em></h2>
  <p class="lead">Novel Tissues manufactures complete baby-care ranges for brands, retailers, pharmacy chains, distributors and exporters. Wipes, shampoos, lotions, creams, oils, baby laundry detergents and cleansers — formulated, filled, packed and shipped under your brand, with one contract and one quality standard.</p>
  <div class="nums">
    <div class="num"><b>1.5<small>Cr+</small></b><h4>Wipes every month</h4><p>15 million+ wipes a month — roughly 5 lakh a day.</p></div>
    <div class="num"><b>9</b><h4>Wipes machines</h4><p>Dedicated machines across our North and South India plants.</p></div>
    <div class="num"><b>8</b><h4>Liquid lines</h4><p>Eight manufacturing lines at one Pondicherry campus.</p></div>
    <div class="num"><b>5<small>Lakh sq.ft</small></b><h4>Manufacturing space</h4><p>Production, warehousing and quality across our units.</p></div>
    <div class="num"><b>2<small>regions</small></b><h4>Wipes supply</h4><p>North &amp; South India — shorter freight, built-in backup.</p></div>
    <div class="num"><b>1<small>partner</small></b><h4>For your full range</h4><p>Wipes, cosmetics, laundry and cleaners together.</p></div>
  </div>
  <div class="units">
    <div class="unit" style="background:var(--sky-2)"><span class="tag">Wipes · North India</span><h3>North India Wipes Plant</h3><p>Wipes made close to North, Central, West and East India markets for faster replenishment.</p></div>
    <div class="unit" style="background:var(--mint-2)"><span class="tag">Wipes · South India</span><h3>South India Wipes Plant</h3><p>Wipes for South India and export lanes. Same specifications and QC as the North plant.</p></div>
    <div class="unit" style="background:var(--peach-2)"><span class="tag">Liquids · Pondicherry</span><h3>Pondicherry Liquids Campus</h3><p>One of the largest cosmetics plants in the region — 8 lines for every baby liquid.</p></div>
  </div>
  ${footer(2)}
</section>

<!-- 3 · Wipes -->
<section class="pg">
  <div class="sec-title"><div><p class="kick">${wipes.kicker}</p><h2>Private label <em>baby wipes</em></h2></div></div>
  <p class="lead">${wipes.lead}</p>
  <div class="band" style="background:${wipes.heroBg};margin-top:5mm">${art("wipes", 0, 'data-count="10"')}${art("wipes", 2)}${art("wipes", 1, 'data-count="30"')}</div>
  <div class="g3" style="margin-top:5mm">${wipes.products.map(([n, d, f]) => `<div class="card"><h4>${n}</h4><p>${d}</p><div class="chips">${f.map(x => `<span>${x}</span>`).join("")}</div></div>`).join("")}</div>
  <table style="margin-top:5mm"><tbody>${wipes.specs.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</tbody></table>
  ${footer(3)}
</section>

<!-- 4 · Bath & skin -->
<section class="pg">
  <p class="kick">Pondicherry liquids campus</p>
  <h2>Baby shampoo, wash, <em>lotion, cream &amp; oil</em></h2>
  <p class="lead">${bath.lead}</p>
  <div class="band tall" style="background:${bath.heroBg};margin-top:5mm;height:42mm">${art("flip", 5)}${art("pump", 0)}${art("pump", 4)}${art("tube", 1)}${art("jar", 3)}${art("flip", 1)}</div>
  <h3 style="margin-top:6mm">Bath &amp; hair</h3>
  <div class="g3" style="margin-top:3mm">${bath.products.map(([n, d, f]) => `<div class="card"><h4>${n}</h4><p>${d}</p><div class="chips">${f.map(x => `<span>${x}</span>`).join("")}</div></div>`).join("")}</div>
  <h3 style="margin-top:6mm">Skin care</h3>
  <div class="g3" style="margin-top:3mm">${skin.products.map(([n, d, f]) => `<div class="card"><h4>${n}</h4><p>${d}</p><div class="chips">${f.map(x => `<span>${x}</span>`).join("")}</div></div>`).join("")}</div>
  ${footer(4)}
</section>

<!-- 5 · Laundry + formulation -->
<section class="pg">
  <p class="kick">${home.kicker}</p>
  <h2>Baby laundry &amp; <em>cleaning liquids</em></h2>
  <p class="lead">${home.lead}</p>
  <div class="g3" style="margin-top:6mm">${home.products.map(([n, d, f]) => `<div class="card"><h4>${n}</h4><p>${d}</p><div class="chips">${f.map(x => `<span>${x}</span>`).join("")}</div></div>`).join("")}</div>
  <h3 style="margin-top:8mm">Formulation &amp; customisation</h3>
  <table style="margin-top:3mm"><tbody>
    <tr><th>Cleansing systems</th><td>${bath.specs.find(s => s[0] === "Cleansing systems")[1]}</td></tr>
    <tr><th>Free-from options</th><td>${bath.specs.find(s => s[0] === "Free-from options")[1]}</td></tr>
    <tr><th>Skin care textures</th><td>${skin.specs.find(s => s[0] === "Textures")[1]}</td></tr>
    <tr><th>Oils</th><td>${skin.specs.find(s => s[0] === "Oils")[1]}</td></tr>
    <tr><th>Laundry options</th><td>${home.specs.find(s => s[0] === "Options")[1]}</td></tr>
    <tr><th>Fragrance</th><td>${bath.specs.find(s => s[0] === "Fragrance")[1]}</td></tr>
    <tr><th>Pack formats</th><td>Pump, flip-cap and disc-cap bottles, tubes, jars, handled cans, trigger sprays and refill pouches</td></tr>
    <tr><th>Your formula</th><td>Manufactured to your specification under NDA — or start from our proven baby-safe bases</td></tr>
  </tbody></table>
  ${footer(5)}
</section>

<!-- 6 · Process + quality -->
<section class="pg">
  <p class="kick">How private label works with us</p>
  <h2>From first call to <em>first shipment.</em></h2>
  <div class="steps">
    <div class="step"><div class="n">1</div><h4>Brief &amp; NDA</h4><p>Your products, target price, channels and volumes. We sign an NDA and map your range to our lines.</p></div>
    <div class="step"><div class="n">2</div><h4>Formulation &amp; samples</h4><p>Choose our baby-safe bases or develop a custom formula. Wipes substrates and lotions sampled side by side.</p></div>
    <div class="step"><div class="n">3</div><h4>Packaging &amp; artwork</h4><p>Formats, sizes and components finalised; artwork checked against label requirements before print.</p></div>
    <div class="step"><div class="n">4</div><h4>Testing &amp; approvals</h4><p>Stability, compatibility and quality checks on your final formula and pack.</p></div>
    <div class="step"><div class="n">5</div><h4>Pilot &amp; production</h4><p>A pilot batch to lock specs, then scheduled production on the right line.</p></div>
    <div class="step"><div class="n">6</div><h4>Dispatch &amp; repeat</h4><p>Batch-coded, QC-released goods dispatched; re-orders planned on a rolling forecast.</p></div>
  </div>
  <div style="background:var(--ink);border-radius:22px;padding:10mm;margin-top:9mm" class="dark">
    <p class="kick">Quality, batch after batch</p>
    <h2 style="font-size:22pt;color:var(--cream)">Made for the most sensitive skin <em>there is.</em></h2>
    <div class="g3" style="margin-top:6mm">
      <div class="q"><h4>Raw material checks</h4><p>Fabrics, actives, fragrances and packaging checked before they reach a line.</p></div>
      <div class="q"><h4>In-process controls</h4><p>Lotion dosing, fill weights, seal integrity and counts monitored every run.</p></div>
      <div class="q"><h4>Finished-goods release</h4><p>Each batch tested and released with documentation.</p></div>
      <div class="q"><h4>Batch traceability</h4><p>Batch codes link every pack to its materials, line and shift.</p></div>
      <div class="q"><h4>Gentle by design</h4><p>pH-balanced, mild bases with free-from options.</p></div>
      <div class="q"><h4>Confidential by default</h4><p>NDAs, restricted artwork access and formula confidentiality.</p></div>
    </div>
  </div>
  ${footer(6)}
</section>

<!-- 7 · Back cover -->
<section class="pg dark">
  <p class="kick">Who we manufacture for</p>
  <h2 style="color:var(--cream)">Built for brands that <em>sell to parents.</em></h2>
  <div class="serve">
    <div><h4>D2C baby brands</h4><p>Low-risk pilot runs that scale on the same lines.</p></div>
    <div><h4>Retail &amp; supermarkets</h4><p>Store-brand baby care at dependable volumes.</p></div>
    <div><h4>Pharmacy chains</h4><p>Gentle, documented formulations for the chemist shelf.</p></div>
    <div><h4>E-commerce &amp; quick-commerce</h4><p>Marketplace-ready packs, multipacks and combos.</p></div>
    <div><h4>Hospitals &amp; institutions</h4><p>Bulk wipes and liquids for maternity and neonatal care.</p></div>
    <div><h4>Export &amp; distributors</h4><p>Private label for overseas markets, close to southern ports.</p></div>
  </div>
  <div class="next">
    <h2>Let's build your <em style="color:#B4532F">baby-care range.</em></h2>
    <p>Send us your product list, target price and expected volumes. We'll come back with options, samples and a plan.</p>
    <div class="contact">${contactLines.map(l => `<span>${l}</span>`).join("")}</div>
  </div>
  ${footer(7)}
</section>
</body></html>`;

const OG = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}
  body { width: 1200px; height: 630px; background: #14213D; color: #FBF6EF; position: relative; overflow: hidden; }
  .glow { position: absolute; width: 760px; height: 760px; border-radius: 50%; right: -200px; top: -120px; background: radial-gradient(circle, rgba(246,168,138,.35), transparent 65%); }
  .copy { position: absolute; left: 70px; top: 64px; width: 600px; }
  .brand { display: flex; align-items: center; gap: 14px; font-family: "Fraunces"; font-size: 30px; font-weight: 600; }
  .brand svg { width: 52px; }
  h1 { font-size: 66px; line-height: 1; margin-top: 54px; letter-spacing: -.035em; }
  p { margin-top: 26px; font-size: 22px; color: rgba(251,246,239,.75); line-height: 1.45; }
  .stage { position: absolute; right: 40px; bottom: 70px; width: 500px; display: flex; align-items: flex-end; justify-content: center; }
  .stage .a { width: 92px; margin-left: -14px; filter: drop-shadow(0 18px 20px rgba(0,0,0,.35)); }
  .stage .a-wipes { width: 230px; } .stage .a-jar { width: 140px; }
  .stats { position: absolute; left: 70px; bottom: 54px; display: flex; gap: 40px; }
  .stats b { display: block; font-family: "Fraunces"; font-size: 34px; color: #F6A88A; font-weight: 500; }
  .stats span { font-size: 15px; font-weight: 700; color: rgba(251,246,239,.7); }
</style></head><body>
  <div class="glow"></div>
  <div class="copy">
    <div class="brand">${DROP} Novel Tissues</div>
    <h1>Private label baby care, <em>made under one roof.</em></h1>
    <p>Baby wipes · shampoo · lotion · cream · oil · laundry liquids</p>
  </div>
  <div class="stage">${art("pump", 0)}${art("wipes", 2)}${art("jar", 3)}${art("tube", 1)}</div>
  <div class="stats"><div><b>1.5 Cr+</b><span>wipes / month</span></div><div><b>8</b><span>liquid lines</span></div><div><b>5 Lakh</b><span>sq.ft</span></div></div>
</body></html>`;

const LOGO = `<!doctype html><html><head><style>body{margin:0;width:512px;height:512px;background:transparent}svg{width:512px;height:512px;display:block}</style></head><body>${DROP}</body></html>`;

async function render(page, html) {
  await page.setContent(html, { waitUntil: "networkidle" });
  await page.addScriptTag({ path: path.join(OUT, "config.js") });
  await page.addScriptTag({ path: path.join(OUT, "art.js") });
  await page.evaluate(() => {
    document.querySelectorAll("[data-art]").forEach(el => {
      el.innerHTML = productSVG(el.dataset.art, { ...PALETTES[+el.dataset.pal], brand: "Your Brand", count: el.dataset.count });
    });
    return document.fonts.ready;
  });
}

const browser = await chromium.launch();
try {
  const page = await browser.newPage();
  await render(page, BROCHURE);
  const pdf = path.join(OUT, SITE.brochure);
  fs.mkdirSync(path.dirname(pdf), { recursive: true });
  await page.pdf({ path: pdf, format: "A4", printBackground: true, preferCSSPageSize: true });
  console.log("wrote", path.relative(process.cwd(), pdf));

  const og = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await render(og, OG);
  await og.screenshot({ path: path.join(OUT, "og-image.png") });
  console.log("wrote public/b2b/og-image.png");

  const logo = await browser.newPage({ viewport: { width: 512, height: 512 } });
  await logo.setContent(LOGO);
  await logo.screenshot({ path: path.join(OUT, "logo.png"), omitBackground: true });
  console.log("wrote public/b2b/logo.png");
} finally {
  await browser.close();
}
