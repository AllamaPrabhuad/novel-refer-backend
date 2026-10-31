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
const DROP = `<svg viewBox="0 0 64 64"><rect width="64" height="64" rx="18" fill="#413F3D"/><path d="M32 12c8 11 14 18 14 26a14 14 0 0 1-28 0c0-8 6-15 14-26z" fill="#697184"/><circle cx="27" cy="38" r="4" fill="#F2F1EF" opacity=".7"/></svg>`;

const BASE_CSS = `
  :root { --cream:#F2F1EF; --cream-2:#E9E5E3; --cream-3:#D8CFD0; --ink:#413F3D; --ink-2:#5A5654; --muted:#697184; --peach:#697184; --peach-2:#E3DCDC; --mint:#B1A6A4; --mint-2:#E6E1E0; --sky:#9AA2B3; --sky-2:#E2E4EA; --lilac:#C4BBBC; --butter:#D8CFD0; }
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
  .dark .kick { color: rgba(242, 241, 239,.7); }
  h2 { font-size: 30pt; margin-top: 8px; }
  h3 { font-size: 15pt; }
  p { font-size: 10pt; line-height: 1.6; color: var(--ink-2); }
  .dark p { color: rgba(242, 241, 239,.75); }
  .lead { font-size: 11.5pt; margin-top: 10px; max-width: 150mm; }
  .pf { position: absolute; left: 16mm; right: 16mm; bottom: 9mm; display: flex; justify-content: space-between; font-size: 7.5pt; font-weight: 700; color: var(--muted); border-top: 1px solid var(--cream-3); padding-top: 3mm; }
  .dark .pf { color: rgba(242, 241, 239,.5); border-color: rgba(255,255,255,.12); }
  .ticks { list-style: none; display: grid; gap: 5px; margin-top: 8px; }
  .ticks li { position: relative; padding-left: 16px; font-size: 9.5pt; font-weight: 600; }
  .ticks li::before { content: "✓"; position: absolute; left: 0; color: #697184; font-weight: 800; }
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
  .band .a { width: 22mm; margin-left: -3mm; filter: drop-shadow(0 6px 8px rgba(65, 63, 61,.18)); }
  .band .a-wipes, .band .a-jar, .band .a-detergent { width: 46mm; }
  .sec-title { display: flex; justify-content: space-between; align-items: flex-end; gap: 10mm; }

  /* palette contrast: on charcoal, accents use blush grey */
  .dark em, .stats b, .num b { color: #D8CFD0; }
  .dark .kick::before { background: #D8CFD0; }
  .step:nth-child(3n+2) .n { color: #fff; }
  .next { background: #D8CFD0 !important; }
  /* cover */
  .cover { padding: 20mm 18mm; }
  .cover .brand { display: flex; align-items: center; gap: 10px; }
  .cover .brand svg { width: 13mm; }
  .cover .brand b { font-family: "Fraunces", serif; font-size: 18pt; font-weight: 600; }
  .cover .brand small { display: block; font-size: 7pt; letter-spacing: .16em; text-transform: uppercase; color: rgba(242, 241, 239,.6); font-weight: 800; }
  .cover h1 { font-size: 46pt; line-height: .98; margin-top: 30mm; letter-spacing: -.035em; }
  .cover .sub { font-size: 12pt; color: rgba(242, 241, 239,.75); margin-top: 8mm; max-width: 140mm; line-height: 1.55; }
  .cover .glow { position: absolute; width: 160mm; height: 160mm; border-radius: 50%; right: -50mm; bottom: 10mm; background: radial-gradient(circle, rgba(105, 113, 132,.35), transparent 65%); }
  .cover .stage { position: absolute; left: 14mm; right: 14mm; bottom: 46mm; display: flex; align-items: flex-end; justify-content: center; }
  .cover .stage .a { width: 26mm; margin-left: -4mm; filter: drop-shadow(0 10px 14px rgba(0,0,0,.35)); }
  .cover .stage .a-wipes { width: 62mm; } .cover .stage .a-jar { width: 40mm; } .cover .stage .a-detergent { width: 40mm; }
  .stats { position: absolute; left: 18mm; right: 18mm; bottom: 16mm; display: grid; grid-template-columns: repeat(4, 1fr); gap: 6mm; border-top: 1px solid rgba(255,255,255,.15); padding-top: 6mm; }
  .stats b { display: block; font-family: "Fraunces", serif; font-size: 22pt; font-weight: 500; color: var(--peach); }
  .stats span { font-size: 8pt; font-weight: 700; color: rgba(242, 241, 239,.7); }

  /* about */
  .nums { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 9mm; }
  .num { background: var(--ink); color: var(--cream); border-radius: 14px; padding: 12px 14px; }
  .num b { font-family: "Fraunces", serif; font-size: 26pt; font-weight: 500; color: var(--peach); line-height: 1; }
  .num b small { font-family: "Plus Jakarta Sans"; font-size: 9pt; color: var(--cream); font-weight: 700; margin-left: 4px; }
  .num h4 { font-size: 11pt; margin-top: 6px; }
  .num p { font-size: 8.3pt; color: rgba(242, 241, 239,.65); margin-top: 3px; line-height: 1.45; }
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
    <h2>Let's build your <em style="color:#697184">baby-care range.</em></h2>
    <p>Send us your product list, target price and expected volumes. We'll come back with options, samples and a plan.</p>
    <div class="contact">${contactLines.map(l => `<span>${l}</span>`).join("")}</div>
  </div>
  ${footer(7)}
</section>
</body></html>`;

const OG = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}
  body { width: 1200px; height: 630px; background: #413F3D; color: #F2F1EF; position: relative; overflow: hidden; }
  .glow { position: absolute; width: 760px; height: 760px; border-radius: 50%; right: -200px; top: -120px; background: radial-gradient(circle, rgba(105, 113, 132,.35), transparent 65%); }
  .copy { position: absolute; left: 70px; top: 64px; width: 600px; }
  .brand { display: flex; align-items: center; gap: 14px; font-family: "Fraunces"; font-size: 30px; font-weight: 600; }
  .brand svg { width: 52px; }
  h1 { font-size: 66px; line-height: 1; margin-top: 54px; letter-spacing: -.035em; }
  p { margin-top: 26px; font-size: 22px; color: rgba(242, 241, 239,.75); line-height: 1.45; }
  .stage { position: absolute; right: 40px; bottom: 70px; width: 500px; display: flex; align-items: flex-end; justify-content: center; }
  .stage .a { width: 92px; margin-left: -14px; filter: drop-shadow(0 18px 20px rgba(0,0,0,.35)); }
  .stage .a-wipes { width: 230px; } .stage .a-jar { width: 140px; }
  .stats { position: absolute; left: 70px; bottom: 54px; display: flex; gap: 40px; }
  .stats b { display: block; font-family: "Fraunces"; font-size: 34px; color: #D8CFD0; font-weight: 500; }
  em { color: #D8CFD0; }
  .stats span { font-size: 15px; font-weight: 700; color: rgba(242, 241, 239,.7); }
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

/* ---------- spec sheets (public, one per category) ---------- */
const SALES = path.resolve(here, "../sales");
const specSheet = c => `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}
  @page { size: A4; margin: 14mm 14mm 16mm; }
  body { background: #fff; font-size: 9.5pt; }
  .head { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #413F3D; padding-bottom: 4mm; }
  .head .brand { display: flex; align-items: center; gap: 8px; font-family: "Fraunces", serif; font-size: 14pt; font-weight: 600; }
  .head .brand svg { width: 9mm; }
  .head span { font-size: 7.5pt; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #697184; }
  .hero { display: grid; grid-template-columns: 1fr 52mm; gap: 6mm; align-items: center; margin-top: 6mm; }
  h1 { font-size: 22pt; } h1 em { color: #697184; }
  .lead { margin-top: 3mm; color: #5A5654; line-height: 1.55; }
  .art-row { display: flex; align-items: flex-end; justify-content: center; height: 34mm; background: ${c.heroBg}; border-radius: 12px; padding: 3mm; }
  .art-row .a { width: 13mm; margin-left: -2mm; } .art-row .a-wipes, .art-row .a-jar, .art-row .a-detergent { width: 28mm; }
  h2 { font-size: 12.5pt; margin: 6mm 0 2.5mm; }
  table { width: 100%; border-collapse: collapse; }
  th, td { text-align: left; vertical-align: top; padding: 2.2mm 3mm; border-bottom: 1px solid #E9E5E3; }
  th { width: 32%; font-size: 7pt; letter-spacing: .1em; text-transform: uppercase; color: #697184; font-weight: 800; }
  .g3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5mm; }
  .g2 { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2.5mm; }
  .box { border: 1px solid #E9E5E3; border-radius: 8px; padding: 2.5mm 3mm; break-inside: avoid; }
  .box b { display: block; font-size: 9.5pt; }
  .box p { font-size: 8pt; color: #5A5654; margin-top: 1mm; line-height: 1.45; }
  .chips { margin-top: 1.5mm; display: flex; flex-wrap: wrap; gap: 1mm; }
  .chips span { font-size: 6.5pt; font-weight: 700; background: #F2F1EF; border-radius: 99px; padding: .5mm 2mm; }
  .foot { margin-top: 7mm; display: flex; justify-content: space-between; gap: 4mm; padding: 4mm 5mm; background: #413F3D; color: #F2F1EF; border-radius: 10px; font-size: 8.5pt; font-weight: 700; break-inside: avoid; }
  section { break-inside: avoid; }
</style></head><body>
  <div class="head"><div class="brand">${DROP} Novel Tissues</div><span>Private label spec sheet</span></div>
  <div class="hero">
    <div><p class="kick">${c.kicker}</p><h1>${c.h1}</h1><p class="lead">${c.lead}</p></div>
    <div class="art-row">${c.art.map(a => art(a.type, a.pal ?? 2, a.count ? `data-count="${a.count}"` : "")).join("")}</div>
  </div>
  <section><h2>Specifications</h2><table><tbody>${c.specs.map(([k, v]) => `<tr><th>${k}</th><td>${v}</td></tr>`).join("")}</tbody></table></section>
  <section><h2>What we make</h2><div class="g3">${c.products.map(([n, d, f]) => `<div class="box"><b>${n}</b><p>${d}</p><div class="chips">${f.map(x => `<span>${x}</span>`).join("")}</div></div>`).join("")}</div></section>
  <section><h2>${c.packsTitle}</h2><div class="g2">${c.packs.map(p => `<div class="box"><b>${p.name}</b><p>${p.text}</p></div>`).join("")}</div></section>
  <section><h2>${c.basesTitle}</h2><div class="g3">${c.bases.map(([n, d]) => `<div class="box"><b>${n}</b><p>${d}</p></div>`).join("")}</div></section>
  <section><h2>Customisation</h2><div class="g3">${c.custom.map(([n, d]) => `<div class="box"><b>${n}</b><p>${d}</p></div>`).join("")}</div></section>
  <div class="foot"><span>Samples, quotes &amp; visits: ${contactLines.join(" · ")}</span></div>
</body></html>`;

/* ---------- pitch deck (16:9, for meetings) ---------- */
const slide = (inner, cls = "") => `<section class="s ${cls}">${inner}<div class="sf"><span>Novel Tissues · Private label baby care</span><span>${domain}</span></div></section>`;
const DECK = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}
  @page { size: 1280px 720px; margin: 0; }
  .s { width: 1280px; height: 720px; position: relative; overflow: hidden; page-break-after: always; background: #F2F1EF; padding: 72px 88px; }
  .s:last-child { page-break-after: auto; }
  .dark { background: #413F3D; color: #F2F1EF; } .dark em { color: #D8CFD0; } .dark p { color: rgba(242,241,239,.75); }
  .k { font-size: 15px; font-weight: 800; letter-spacing: .16em; text-transform: uppercase; color: #697184; }
  .dark .k { color: #D8CFD0; }
  h1 { font-size: 76px; line-height: 1; margin-top: 26px; letter-spacing: -.03em; }
  h2 { font-size: 54px; line-height: 1.05; margin-top: 18px; max-width: 980px; }
  p { font-size: 22px; line-height: 1.5; color: #5A5654; margin-top: 22px; max-width: 760px; }
  .sf { position: absolute; left: 88px; right: 88px; bottom: 30px; display: flex; justify-content: space-between; font-size: 13px; font-weight: 700; color: #697184; }
  .dark .sf { color: rgba(242,241,239,.5); }
  .stage { position: absolute; right: 70px; bottom: 80px; display: flex; align-items: flex-end; }
  .stage .a { width: 92px; margin-left: -14px; filter: drop-shadow(0 16px 18px rgba(0,0,0,.3)); }
  .stage .a-wipes { width: 230px; } .stage .a-jar, .stage .a-detergent { width: 140px; }
  .nums { display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px; margin-top: 44px; }
  .num { background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.12); border-radius: 22px; padding: 26px 28px; }
  .num b { font-family: "Fraunces", serif; font-size: 58px; font-weight: 500; color: #D8CFD0; line-height: 1; }
  .num span { display: block; margin-top: 10px; font-size: 18px; font-weight: 700; }
  .cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 40px; }
  .card { background: #fff; border-radius: 22px; padding: 26px; }
  .card h3 { font-size: 26px; }
  .card p { font-size: 17px; margin-top: 10px; }
  .list { columns: 2; column-gap: 50px; margin-top: 34px; font-size: 21px; line-height: 1.9; list-style: none; padding: 0; }
  .list li::before { content: "✓  "; color: #697184; font-weight: 800; }
  .steps { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; margin-top: 36px; }
  .step { background: #fff; border-radius: 20px; padding: 22px 24px; }
  .step b { display: inline-grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: #413F3D; color: #F2F1EF; font-family: "Fraunces", serif; font-size: 20px; }
  .step h3 { font-size: 22px; margin-top: 12px; } .step p { font-size: 15px; margin-top: 6px; }
  .contact { margin-top: 40px; font-size: 28px; font-weight: 800; display: grid; gap: 10px; }
</style></head><body>
${slide(`<div class="k">Private label manufacturing</div><h1>Your baby-care brand,<br/><em>made under one roof.</em></h1><p>Baby wipes, baby cosmetics and baby laundry &amp; cleaning liquids — formulated, filled, packed and shipped under your brand.</p><div class="stage">${art("detergent", 4)}${art("pump", 0)}${art("wipes", 2)}${art("jar", 3)}${art("tube", 1)}</div>`, "dark")}
${slide(`<div class="k">The opportunity</div><h2>Most baby brands juggle three suppliers. <em>You need one.</em></h2><p>A wipes converter, a cosmetics filler and a detergent maker means three contracts, three quality standards and three delivery schedules. Novel Tissues makes all of it.</p><div class="cards"><div class="card"><h3>Baby wipes</h3><p>Every count from pocket packs to 100+, in your substrate, lotion and lid.</p></div><div class="card"><h3>Baby cosmetics</h3><p>Shampoos, washes, lotions, creams, oils and rash creams.</p></div><div class="card"><h3>Laundry &amp; cleaners</h3><p>Baby detergents, conditioners, bottle and surface cleansers.</p></div></div>`)}
${slide(`<div class="k">Scale</div><h2>The numbers behind every pack <em>with your name on it.</em></h2><div class="nums"><div class="num"><b>1.5 Cr+</b><span>wipes every month</span></div><div class="num"><b>9</b><span>wipes machines</span></div><div class="num"><b>8</b><span>liquid lines in Pondicherry</span></div><div class="num"><b>5 Lakh</b><span>sq.ft manufacturing</span></div><div class="num"><b>2</b><span>wipes regions: North &amp; South</span></div><div class="num"><b>1</b><span>partner for the whole range</span></div></div>`, "dark")}
${slide(`<div class="k">Our network</div><h2>North. South. <em>And a liquids campus in Pondicherry.</em></h2><div class="cards"><div class="card"><h3>North India wipes plant</h3><p>Wipes made close to North, Central, West and East India markets.</p></div><div class="card"><h3>South India wipes plant</h3><p>Wipes for the south and export lanes — and a backup for the north.</p></div><div class="card"><h3>Pondicherry liquids campus</h3><p>Eight manufacturing lines for every baby liquid, under one roof.</p></div></div>`)}
${slide(`<div class="k">${wipes.kicker}</div><h2>Private label <em>baby wipes</em></h2><ul class="list">${wipes.specs.slice(0, 8).map(([k, v]) => `<li><b>${k}:</b> ${v.split(";")[0]}</li>`).join("")}</ul>`)}
${slide(`<div class="k">Pondicherry liquids campus</div><h2>Shampoos, lotions, creams, oils <em>and laundry liquids.</em></h2><ul class="list">${[...bath.products, ...skin.products, ...home.products].slice(0, 14).map(([n]) => `<li>${n}</li>`).join("")}</ul>`)}
${slide(`<div class="k">How it works</div><h2>From first call to <em>first shipment.</em></h2><div class="steps">${[["Brief &amp; NDA", "Your products, price, channels and volumes."], ["Formulation &amp; samples", "Our bases or your formula, sampled side by side."], ["Packaging &amp; artwork", "Formats chosen, artwork checked before print."], ["Testing &amp; approvals", "Stability and quality checks on the final pack."], ["Pilot &amp; production", "A pilot batch, then scheduled production."], ["Dispatch &amp; repeat", "QC-released goods and forecast-based reorders."]].map(([t, d], i) => `<div class="step"><b>${i + 1}</b><h3>${t}</h3><p>${d}</p></div>`).join("")}</div>`)}
${slide(`<div class="k">Quality</div><h2>Made for the most sensitive skin <em>there is.</em></h2><ul class="list"><li>Raw material checks</li><li>In-process controls</li><li>Batch-wise release</li><li>Batch traceability</li><li>pH-balanced, mild bases</li><li>Free-from options</li><li>Confidential by default — NDAs</li><li>We never compete with you</li></ul>`, "dark")}
${slide(`<div class="k">Who we make for</div><h2>Built for brands that <em>sell to parents.</em></h2><ul class="list"><li>D2C baby brands</li><li>Retail &amp; supermarket chains</li><li>Pharmacy chains</li><li>E-commerce &amp; quick-commerce</li><li>Hospitals &amp; institutions</li><li>Export &amp; distributors</li></ul>`)}
${slide(`<div class="k">Next steps</div><h2>Let's build your <em>baby-care range.</em></h2><p>Send your product list, target price and volumes. We'll come back with options, samples and a plan.</p><div class="contact">${contactLines.map(l => `<span>${l}</span>`).join("")}</div><div class="stage">${art("pump", 0)}${art("wipes", 2)}${art("tube", 1)}</div>`, "dark")}
</body></html>`;

/* ---------- roll-up banner 85 × 200 cm with QR code ---------- */
const QRCode = require("qrcode");
const expoUrl = SITE.url.replace(/\/$/, "") + "/expo/";
const qrSvg = await QRCode.toString(expoUrl, { type: "svg", margin: 0, color: { dark: "#413F3D", light: "#00000000" } });
const BANNER = `<!doctype html><html><head><meta charset="utf-8">${FONTS}<style>${BASE_CSS}
  @page { size: 850mm 2000mm; margin: 0; }
  body { width: 850mm; height: 2000mm; background: #F2F1EF; position: relative; overflow: hidden; }
  .top { background: #413F3D; color: #F2F1EF; padding: 70mm 60mm 80mm; }
  .brand { display: flex; align-items: center; gap: 18mm; font-family: "Fraunces", serif; font-size: 70mm; font-weight: 600; }
  .brand svg { width: 70mm; }
  .tag { font-size: 18mm; font-weight: 800; letter-spacing: .14em; text-transform: uppercase; color: #D8CFD0; margin-top: 50mm; }
  h1 { font-size: 92mm; line-height: 1; margin-top: 20mm; letter-spacing: -.03em; color: #F2F1EF; }
  h1 em { color: #D8CFD0; }
  .stage { display: flex; align-items: flex-end; justify-content: center; margin: -10mm 40mm 0; height: 360mm; }
  .stage .a { width: 120mm; margin-left: -18mm; filter: drop-shadow(0 20mm 20mm rgba(0,0,0,.2)); }
  .stage .a-wipes { width: 300mm; } .stage .a-jar, .stage .a-detergent { width: 190mm; }
  .nums { display: grid; grid-template-columns: 1fr 1fr; gap: 24mm; padding: 60mm 60mm 0; }
  .nums b { display: block; font-family: "Fraunces", serif; font-size: 96mm; font-weight: 500; line-height: 1; color: #413F3D; }
  .nums span { font-size: 22mm; font-weight: 700; color: #697184; }
  .products { padding: 60mm 60mm 0; font-size: 26mm; line-height: 1.6; font-weight: 600; color: #413F3D; }
  .qr { position: absolute; left: 60mm; right: 60mm; bottom: 70mm; display: flex; align-items: center; gap: 40mm; background: #fff; border-radius: 30mm; padding: 40mm; }
  .qr svg { width: 260mm; height: 260mm; flex: none; }
  .qr b { display: block; font-family: "Fraunces", serif; font-size: 52mm; font-weight: 500; line-height: 1.05; color: #413F3D; }
  .qr span { display: block; margin-top: 16mm; font-size: 24mm; font-weight: 700; color: #697184; }
</style></head><body>
  <div class="top">
    <div class="brand">${DROP} Novel Tissues</div>
    <div class="tag">Private label baby care</div>
    <h1>Your baby-care brand, <em>made under one roof.</em></h1>
  </div>
  <div class="stage">${art("detergent", 4)}${art("pump", 0)}${art("wipes", 2)}${art("jar", 3)}</div>
  <div class="nums"><div><b>1.5 Cr+</b><span>wipes every month</span></div><div><b>8</b><span>liquid lines</span></div><div><b>9</b><span>wipes machines</span></div><div><b>5 Lakh</b><span>sq.ft manufacturing</span></div></div>
  <div class="products">Baby wipes · Shampoo &amp; wash · Lotion, cream &amp; oil · Rash cream · Baby laundry detergent · Bottle &amp; surface cleansers</div>
  <div class="qr">${qrSvg}<div><b>Scan for our brochure &amp; samples</b><span>${domain}/expo</span></div></div>
</body></html>`;

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

  for (const c of CATEGORIES) {
    const sp = await browser.newPage();
    await render(sp, specSheet(c));
    const file = path.join(OUT, "downloads", `spec-sheet-${c.slug}.pdf`);
    await sp.pdf({ path: file, printBackground: true, preferCSSPageSize: true });
    console.log("wrote", path.relative(process.cwd(), file));
  }

  fs.mkdirSync(SALES, { recursive: true });
  const deck = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await render(deck, DECK);
  await deck.pdf({ path: path.join(SALES, "novel-tissues-pitch-deck.pdf"), printBackground: true, preferCSSPageSize: true });
  console.log("wrote sales/novel-tissues-pitch-deck.pdf");

  const banner = await browser.newPage();
  await render(banner, BANNER);
  await banner.pdf({ path: path.join(SALES, "rollup-banner-85x200cm.pdf"), printBackground: true, preferCSSPageSize: true });
  fs.writeFileSync(path.join(SALES, "qr-expo.svg"), qrSvg);
  console.log("wrote sales/rollup-banner-85x200cm.pdf and sales/qr-expo.svg");

  const logo = await browser.newPage({ viewport: { width: 512, height: 512 } });
  await logo.setContent(LOGO);
  await logo.screenshot({ path: path.join(OUT, "logo.png"), omitBackground: true });
  console.log("wrote public/b2b/logo.png");
} finally {
  await browser.close();
}
