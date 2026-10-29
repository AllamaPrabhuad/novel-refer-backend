/* ==========================================================
   Novel Tissues — home page interactions
   Needs config.js, art.js and common.js loaded first.
   ========================================================== */

const CAPACITY_PER_MONTH = 15000000; // 1.5 crore wipes
const WIPES_PER_SEC = CAPACITY_PER_MONTH / (30 * 24 * 3600);

/* ----------------------------------------------------------
   Loader
   ---------------------------------------------------------- */
document.body.classList.add("loading");
let loaded = false;
function finishLoading() {
  if (loaded) return;
  loaded = true;
  $("#loader").classList.add("done");
  document.body.classList.remove("loading");
  $$("#hero .reveal, #hero .split").forEach(el => el.classList.add("in"));
}
window.addEventListener("load", () => setTimeout(finishLoading, reduceMotion ? 0 : 900));
setTimeout(finishLoading, 3500);

/* ----------------------------------------------------------
   HERO: products, parallax, bubbles, live ticker
   ---------------------------------------------------------- */
const heroColors = {
  wipes: PALETTES[2], pump: PALETTES[0], tube: PALETTES[1],
  jar: PALETTES[3], detergent: PALETTES[4], flip: PALETTES[0]
};
$$(".hp").forEach(el => {
  const t = el.dataset.type;
  const pal = t === "flip" ? { ...PALETTES[5] } : heroColors[t];
  el.innerHTML = productSVG(t, { ...pal, brand: "Your Brand", tag: t === "wipes" ? "gentle as water" : "" });
});

let mx = 0, my = 0, heroY = 0;
const hps = $$(".hp");
function placeHero() {
  hps.forEach(el => {
    const d = parseFloat(el.dataset.depth);
    el.style.transform = `translate3d(${mx * d * 22}px, ${my * d * 22 - heroY * d * 0.12}px, 0)`;
  });
}
function heroScroll(y) { if (y < innerHeight * 1.2 && !reduceMotion) { heroY = y; placeHero(); } }
scrollHooks.push(heroScroll);
if (finePointer && !reduceMotion) {
  $("#hero").addEventListener("mousemove", e => {
    mx = (e.clientX / innerWidth - 0.5) * 2;
    my = (e.clientY / innerHeight - 0.5) * 2;
    placeHero();
  });
}

if (!reduceMotion) {
  const bubbles = $("#bubbles");
  for (let i = 0; i < 18; i++) {
    const b = document.createElement("span");
    const s = 10 + Math.random() * 42;
    b.className = "bubble";
    Object.assign(b.style, {
      width: s + "px", height: s + "px",
      left: Math.random() * 100 + "%",
      animationDuration: 10 + Math.random() * 12 + "s",
      animationDelay: -Math.random() * 20 + "s"
    });
    bubbles.appendChild(b);
  }
}

(function ticker() {
  const el = $("#wipeTicker");
  const t0 = performance.now();
  let last = 0;
  const tick = now => {
    if (now - last > 90) {
      last = now;
      el.textContent = inr(((now - t0) / 1000) * WIPES_PER_SEC);
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
})();

/* ----------------------------------------------------------
   PRODUCT CATALOGUE
   ---------------------------------------------------------- */
const CATALOGUE = {
  wipes: {
    page: "products/baby-wipes/",
    title: "Baby Wipes", bg: "#D7E8FA", art: ["wipes"], pal: [PALETTES[2]],
    blurb: "Soft, strong, perfectly moist wipes from 9 machines across North & South India — in every count, lid and lotion your range needs.",
    meta: ["10 – 100+ count", "Flip-top & sticker lids", "Spunlace & plant-based"],
    items: [
      ["Baby Wet Wipes", "Everyday cleaning wipes with soft spunlace and a gentle lotion.", ["72s", "80s", "100s"]],
      ["Water Wipes", "High-purity, water-based wipes for newborns and sensitive skin.", ["99% water", "Fragrance-free"]],
      ["Aloe & Chamomile", "Soothing botanical lotions for daily diaper changes.", ["Aloe", "Chamomile", "Custom extract"]],
      ["Travel & Pocket Packs", "On-the-go packs for bags, cars and hospital kits.", ["10s", "20s", "30s"]],
      ["Hand & Face Wipes", "Mealtime and playtime wipes for little hands and faces.", ["Mild", "Fragrance-free"]],
      ["Multipacks & Combos", "Value multipacks and combo kits for e-commerce and retail.", ["3-pack", "6-pack", "Bundles"]]
    ]
  },
  bath: {
    page: "products/baby-shampoo-body-wash/",
    title: "Bath & Hair", bg: "#FBD3C3", art: ["flip", "pump", "pump"], pal: [PALETTES[5], PALETTES[0], PALETTES[4]],
    blurb: "Tear-free shampoos and soap-free washes from our Pondicherry liquids campus — mild on eyes, kind to delicate scalps.",
    meta: ["Tear-free options", "Mild surfactants", "Pump · flip-cap · refills"],
    items: [
      ["Baby Shampoo", "Tear-free, gentle cleansing for a delicate scalp.", ["100 ml", "200 ml", "500 ml"]],
      ["Head-to-Toe Wash", "One bottle for hair and body — the bath-time essential.", ["Pump", "Flip-cap"]],
      ["Baby Body Wash", "Soap-free, pH-balanced cleansing for daily baths.", ["Gel", "Creamy"]],
      ["Bubble Bath", "Mild, playful foam that rinses clean.", ["Lavender", "Unscented"]],
      ["Baby Hair Oil", "Light, non-sticky nourishment for baby hair.", ["Coconut", "Almond", "Custom blend"]],
      ["2-in-1 Shampoo & Conditioner", "Tangle-free hair for toddlers in one step.", ["200 ml", "400 ml"]]
    ]
  },
  skin: {
    page: "products/baby-lotion-cream-oil/",
    title: "Skin Care", bg: "#CDEFE3", art: ["flip", "jar", "tube"], pal: [PALETTES[1], PALETTES[3], PALETTES[0]],
    blurb: "Lotions, creams, oils and balms — from light everyday moisture to rich barrier care, with free-from formulations available.",
    meta: ["Lotions to rich creams", "Free-from options", "Tubes · jars · bottles"],
    items: [
      ["Baby Lotion", "Light, fast-absorbing daily moisture.", ["100 ml", "200 ml", "400 ml"]],
      ["Baby Cream", "Rich, nourishing cream for face and body.", ["Tube", "Jar"]],
      ["Massage Oil", "Smooth glide oils for the daily baby massage ritual.", ["Almond", "Olive", "Coconut"]],
      ["Diaper Rash Cream", "Protective barrier cream for the diaper area.", ["Tube", "Jar"]],
      ["Winter / Cold Cream", "Extra-rich care for dry seasons.", ["Jar", "Tube"]],
      ["Baby Jelly & Balms", "Protective balms for lips, cheeks and dry patches.", ["Jar", "Stick"]]
    ]
  },
  home: {
    page: "products/baby-laundry-detergent-cleansers/",
    title: "Laundry & Cleaning", bg: "#E4DCF8", art: ["detergent", "pump"], pal: [PALETTES[4], PALETTES[1]],
    blurb: "Baby-safe detergents and cleansers made in the same campus as your cosmetics — so your brand covers the whole nursery.",
    meta: ["Baby-gentle surfactants", "Low-residue rinse", "Bottles · cans · pouches"],
    items: [
      ["Baby Laundry Detergent", "Gentle liquid detergent for baby clothes, nappies and linen.", ["500 ml", "1 L", "2 L"]],
      ["Fabric Conditioner", "Softness for baby clothes, gentle on skin.", ["500 ml", "1 L"]],
      ["Bottle & Nipple Cleanser", "Rinses clean from feeding bottles, nipples and pacifiers.", ["Liquid", "Foam pump"]],
      ["Toy & Surface Cleanser", "For toys, high chairs and changing tables.", ["Spray", "Refill"]],
      ["Pre-wash Stain Remover", "Lifts milk, food and nappy stains before the wash.", ["Spray", "Gel"]],
      ["Refill Pouches", "Economical refills that cut plastic and cost.", ["500 ml", "1 L"]]
    ]
  }
};

function renderCatalogue(key) {
  const c = CATALOGUE[key];
  const art = c.art.map((t, i) => `<div>${productSVG(t, { ...c.pal[i], brand: "Your Brand" })}</div>`).join("");
  $("#productPanel").innerHTML = `
    <div class="pp-hero" style="--c2:${c.bg}">
      <div>
        <h3>${c.title}</h3>
        <p>${c.blurb}</p>
        <div class="pp-meta">${c.meta.map(m => `<span>${m}</span>`).join("")}</div>
        <a class="pp-link" href="${c.page}">Full specifications &amp; pack options <span class="arrow">→</span></a>
      </div>
      <div class="pp-art">${art}</div>
    </div>
    <div class="pp-list">
      ${c.items.map(([n, d, f], i) => `
        <article class="pc" style="--i:${i}; --c2:${c.bg}">
          <h4>${n}</h4><p>${d}</p>
          <div class="formats">${f.map(x => `<span>${x}</span>`).join("")}</div>
        </article>`).join("")}
    </div>`;
}

function moveInk() {
  const active = $(".tab.active");
  const ink = $("#tabInk");
  if (!active) return;
  ink.style.left = active.offsetLeft + "px";
  ink.style.width = active.offsetWidth + "px";
}
$$(".tab").forEach(tab => tab.addEventListener("click", () => {
  $$(".tab").forEach(t => { t.classList.remove("active"); t.setAttribute("aria-selected", "false"); });
  tab.classList.add("active");
  tab.setAttribute("aria-selected", "true");
  moveInk();
  renderCatalogue(tab.dataset.cat);
}));
renderCatalogue("wipes");
window.addEventListener("resize", moveInk);
document.fonts && document.fonts.ready.then(moveInk);
moveInk();

/* ----------------------------------------------------------
   WIPES LAB
   ---------------------------------------------------------- */
const LOTION_PAL = {
  "99% purified water": PALETTES[2],
  "Aloe vera": PALETTES[1],
  "Chamomile": PALETTES[3],
  "Fragrance-free sensitive": PALETTES[4]
};
const wipe = { sub: "Spunlace (viscose-poly blend)", gsm: 50, lotion: "99% purified water", count: "72" };

function setRangeFill(input) {
  const p = (input.value - input.min) / (input.max - input.min) * 100;
  input.style.setProperty("--p", p + "%");
}

function renderWipes(changed) {
  const pal = LOTION_PAL[wipe.lotion];
  const tagline = { "99% purified water": "pure & simple", "Aloe vera": "with soothing aloe", "Chamomile": "calming chamomile", "Fragrance-free sensitive": "for sensitive skin" }[wipe.lotion];
  $("#wipePack").innerHTML = productSVG("wipes", { ...pal, brand: "Your Brand", count: wipe.count, tag: tagline });

  const n = +wipe.count;
  const feel = wipe.gsm < 45 ? "Light & economical" : wipe.gsm <= 55 ? "Soft everyday strength" : "Thick, premium plush";
  const format = n <= 20 ? "Pocket flow-wrap, sticker lid" : n <= 30 ? "Travel pack, re-sealable sticker" : "Flow-wrap with flip-top lid";
  const best = { "99% purified water": "Newborns & everyday", "Aloe vera": "Daily diaper changes", "Chamomile": "Calming night-time care", "Fragrance-free sensitive": "Sensitive & allergy-prone skin" }[wipe.lotion];
  const packs = CAPACITY_PER_MONTH / n;
  const packsTxt = packs >= 100000 ? (packs / 100000).toFixed(2) + " lakh" : inr(packs);
  const rows = [
    ["sub", "Substrate", wipe.sub],
    ["gsm", "Fabric weight", `${wipe.gsm} GSM · ${feel}`],
    ["lotion", "Lotion", wipe.lotion],
    ["count", "Wipes per pack", `${n} wipes`],
    ["count", "Pack format", format],
    ["lotion", "Best for", best],
    ["count", "Our capacity in this pack", `≈ ${packsTxt} packs / month`],
    ["sub", "Made at", "North & South India plants"]
  ];
  $("#specSheet").innerHTML = rows.map(([k, label, v]) =>
    `<div><div class="k">${label}</div><div class="v${changed === k ? " flash" : ""}">${esc(v)}</div></div>`).join("");
}

$$("#wipes .seg").forEach(seg => {
  seg.addEventListener("click", e => {
    const b = e.target.closest("button");
    if (!b) return;
    $$("button", seg).forEach(x => x.classList.remove("on"));
    b.classList.add("on");
    wipe[seg.dataset.key] = b.dataset.v;
    renderWipes(seg.dataset.key);
  });
});
const gsm = $("#gsm");
gsm.addEventListener("input", () => {
  wipe.gsm = +gsm.value;
  $("#gsmOut").textContent = gsm.value + " GSM";
  setRangeFill(gsm);
  renderWipes("gsm");
});
setRangeFill(gsm);
renderWipes();

function pullWipe() {
  const s = $("#wipeSheet");
  s.classList.remove("pull");
  void s.offsetWidth;
  s.classList.add("pull");
}
$("#wipeStage").addEventListener("click", pullWipe);
$("#wipeStage").addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); pullWipe(); } });

/* production line */
(function line() {
  const g = $("#lineItems");
  const N = 9;
  let html = "";
  for (let i = 0; i < N; i++) {
    html += `<g class="line-item" style="animation-delay:${-(9 / N) * i}s">
      <rect x="196" y="176" width="44" height="22" rx="6" fill="#FFFFFF" stroke="#D8CFC2" stroke-width="1.5"/>
      <rect x="204" y="182" width="28" height="4" rx="2" fill="#9CC5F0"/>
      <rect x="204" y="189" width="18" height="4" rx="2" fill="#F6A88A"/></g>`;
  }
  g.innerHTML = html;

  const steps = $$("#lineSteps li");
  let idx = 0, paused = false;
  const show = i => steps.forEach((s, j) => s.classList.toggle("on", j === i));
  setInterval(() => { if (!paused) { idx = (idx + 1) % steps.length; show(idx); } }, 1700);
  steps.forEach((s, i) => {
    s.addEventListener("mouseenter", () => { paused = true; idx = i; show(i); });
    s.addEventListener("mouseleave", () => { paused = false; });
  });
})();

/* ----------------------------------------------------------
   LIQUIDS: 8 animated filling lanes
   ---------------------------------------------------------- */
const LANES = [
  ["Shampoos & washes", "Tear-free, soap-free", "#F6A88A"],
  ["Lotions", "Light emulsions", "#FBD3C3"],
  ["Creams", "Rich & barrier creams", "#F7DE8C"],
  ["Oils", "Massage & hair oils", "#E2B43C"],
  ["Gels & bubble bath", "Clear & foaming", "#9CC5F0"],
  ["Laundry detergent", "Baby-gentle liquids", "#C7B8F0"],
  ["Cleansers", "Bottle, toy & surface", "#8FD3BE"],
  ["Tubes & ointments", "Rash & balm care", "#FFFFFF"]
];
function bottleSVG(color) {
  return `<svg viewBox="0 0 24 40"><rect x="8" y="0" width="8" height="6" rx="1.5" fill="#FBF6EF" opacity=".85"/>
    <rect x="2" y="6" width="20" height="34" rx="6" fill="none" stroke="#FBF6EF" stroke-opacity=".6" stroke-width="1.5"/>
    <rect class="liq" x="3.5" y="12" width="17" height="26.5" rx="4.5" fill="${color}"/></svg>`;
}
(function lanes() {
  const wrap = $("#lanes");
  wrap.innerHTML = LANES.map(([name, sub, c], i) => {
    const dur = 7 + (i % 4) * 1.3;
    const bottles = Array.from({ length: 6 }, (_, k) =>
      `<span class="lb" style="animation-duration:${dur}s; animation-delay:${-(dur / 6) * k - i * 0.4}s">${bottleSVG(c)}</span>`).join("");
    return `<div class="lane reveal" style="--c:${c}">
      <div class="lane-id"><small>Line</small>${String(i + 1).padStart(2, "0")}</div>
      <div class="lane-track"><span class="nozzle" style="--c:${c}"></span>${bottles}</div>
      <div class="lane-name">${name}<small>${sub}</small></div>
    </div>`;
  }).join("");
  $$(".lane", wrap).forEach((el, i) => { el.style.setProperty("--d", Math.min(i, 6)); io.observe(el); });
  const setW = () => $$(".lane-track", wrap).forEach(t => t.style.setProperty("--w", t.offsetWidth + 60 + "px"));
  setW();
  window.addEventListener("resize", setW);
  // liquid fill should track each bottle's own travel, so sync durations/delays
  $$(".lb", wrap).forEach(lb => {
    const liq = $(".liq", lb);
    liq.style.animationDuration = lb.style.animationDuration;
    liq.style.animationDelay = lb.style.animationDelay;
  });
  $$(".nozzle", wrap).forEach(n => { n.style.left = "34%"; });
})();

/* ----------------------------------------------------------
   PLANTS network
   ---------------------------------------------------------- */
(function plants() {
  const dots = $("#gridDots");
  let html = "";
  for (let x = 20; x <= 580; x += 20) {
    for (let y = 20; y <= 620; y += 20) {
      const nx = (x - 300) / 270, ny = (y - 320) / 300;
      const wob = 0.12 * Math.sin(x * 0.03) + 0.1 * Math.cos(y * 0.025);
      const d = nx * nx * (1 + ny * 0.8) + ny * ny;
      if (d < 0.85 + wob) html += `<circle cx="${x}" cy="${y}" r="2.2" opacity="${(1 - d * 0.7).toFixed(2)}"/>`;
    }
  }
  dots.innerHTML = html;

  const select = key => {
    $$(".plant-node").forEach(n => n.classList.toggle("active", n.dataset.plant === key));
    $$(".plant-card").forEach(c => c.classList.toggle("active", c.dataset.plant === key));
  };
  $$(".plant-node").forEach(n => {
    n.addEventListener("click", () => select(n.dataset.plant));
    n.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(n.dataset.plant); } });
  });
  $$(".plant-card").forEach(c => c.addEventListener("click", () => select(c.dataset.plant)));
  select("north");
})();

/* ----------------------------------------------------------
   WHY — horizontal scroll driven by vertical scroll
   ---------------------------------------------------------- */
const why = $("#why"), whyTrack = $("#whyTrack");
function whyScroll() {
  if (innerWidth <= 720) return;
  const r = why.getBoundingClientRect();
  const total = why.offsetHeight - innerHeight;
  const p = clamp(-r.top / total, 0, 1);
  const dist = whyTrack.scrollWidth - innerWidth + Math.max(24, (innerWidth - 1240) / 2) + 24;
  whyTrack.style.transform = `translate3d(${-p * Math.max(dist, 0)}px, 0, 0)`;
  $("#whyBar").style.transform = `scaleX(${p})`;
  $("#whyIdx").textContent = String(Math.min(5, Math.floor(p * 4.999) + 1)).padStart(2, "0");
}
scrollHooks.push(whyScroll);

/* ----------------------------------------------------------
   BRAND STUDIO
   ---------------------------------------------------------- */
const studio = { brand: "Little Bloom", tag: "gentle from day one", product: "wipes", pal: 0 };
$("#swatches").innerHTML = PALETTES.map((p, i) =>
  `<button class="swatch${i === 0 ? " on" : ""}" data-i="${i}" aria-label="${p.name} palette" title="${p.name}"><span style="background:${p.c1}"></span><span style="background:${p.c2}"></span></button>`).join("");

function renderStudio(swap) {
  const pal = PALETTES[studio.pal];
  const opts = { ...pal, brand: studio.brand || "Your Brand", tag: studio.tag };
  const view = $("#studioProductView");
  view.innerHTML = productSVG(studio.product, opts);
  view.classList.toggle("tall", ["pump", "flip", "tube"].includes(studio.product));
  if (swap) { view.classList.remove("swap"); void view.offsetWidth; view.classList.add("swap"); }
  $("#studioBg").style.background = `linear-gradient(160deg, ${pal.bg}, #FFFFFF)`;
  const others = Object.keys(PRODUCT_LABEL).filter(t => t !== studio.product);
  $("#studioFamily").innerHTML = others.map(t =>
    `<div class="${["wipes", "jar", "detergent"].includes(t) ? "wide" : ""}" data-t="${t}" title="${PRODUCT_LABEL[t]}">${productSVG(t, { ...opts, tag: "" })}</div>`).join("");
}
function setStudioProduct(t) {
  studio.product = t;
  $$("#studioProduct button").forEach(b => b.classList.toggle("on", b.dataset.v === t));
  renderStudio(true);
}
$("#studioProduct").addEventListener("click", e => { const b = e.target.closest("button"); if (b) setStudioProduct(b.dataset.v); });
$("#studioFamily").addEventListener("click", e => { const d = e.target.closest("[data-t]"); if (d) setStudioProduct(d.dataset.t); });
$("#swatches").addEventListener("click", e => {
  const b = e.target.closest(".swatch");
  if (!b) return;
  $$(".swatch").forEach(s => s.classList.remove("on"));
  b.classList.add("on");
  studio.pal = +b.dataset.i;
  renderStudio(true);
});
$("#brandName").addEventListener("input", e => { studio.brand = e.target.value.trim(); renderStudio(); });
$("#brandTag").addEventListener("input", e => { studio.tag = e.target.value.trim(); renderStudio(); });
renderStudio();

$("#downloadSvg").addEventListener("click", () => {
  const svg = $("#studioProductView svg");
  if (!svg) return;
  const blob = new Blob([svg.outerHTML], { type: "image/svg+xml" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${(studio.brand || "brand").replace(/[^\w-]+/g, "-").toLowerCase()}-${studio.product}-mockup.svg`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
});

const CHIP_FOR = { wipes: "Baby wipes", pump: "Baby shampoo / wash", flip: "Baby lotion", tube: "Baby cream", jar: "Rash cream", detergent: "Baby laundry detergent" };
$("#useConcept").addEventListener("click", () => {
  const pal = PALETTES[studio.pal];
  const concept = `${studio.brand || "Your Brand"} — ${PRODUCT_LABEL[studio.product]} — ${pal.name} palette${studio.tag ? ` — "${studio.tag}"` : ""}`;
  $("#fConcept").value = concept;
  const pill = $("#conceptPill");
  pill.hidden = false;
  pill.innerHTML = `<span>✦ Brand Studio concept: ${esc(concept)}</span><button type="button" aria-label="Remove concept">✕</button>`;
  const chip = $(`#productChips input[value="${CHIP_FOR[studio.product]}"]`);
  if (chip) chip.checked = true;
  if (studio.brand && !$("#fCompany").value) $("#fCompany").value = studio.brand;
  $("#contact").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
});
$("#conceptPill").addEventListener("click", e => {
  if (e.target.closest("button")) { $("#fConcept").value = ""; $("#conceptPill").hidden = true; }
});

/* ----------------------------------------------------------
   CAPACITY PLANNER
   ---------------------------------------------------------- */
const plan = { count: 72 };
function packsFromSlider(v) {
  const raw = 1000 * Math.pow(500, v / 100);
  const mag = Math.pow(10, Math.floor(Math.log10(raw)) - 1);
  return Math.round(raw / mag) * mag;
}
function renderPlan() {
  const slider = $("#packs");
  setRangeFill(slider);
  const packs = packsFromSlider(+slider.value);
  const wipesN = packs * plan.count;
  const pct = wipesN / CAPACITY_PER_MONTH * 100;
  const hours = wipesN / WIPES_PER_SEC / 3600;
  $("#packsOut").textContent = inr(packs);
  $("#planWipes").textContent = wipesN >= 1e7 ? (wipesN / 1e7).toFixed(2) + " Cr" : wipesN >= 1e5 ? (wipesN / 1e5).toFixed(2) + " L" : inr(wipesN);
  $("#planHours").textContent = hours < 1 ? Math.max(1, Math.round(hours * 60)) + " min" : hours < 48 ? hours.toFixed(1) + " hrs" : (hours / 24).toFixed(1) + " days";
  $("#gaugePct").textContent = pct < 1 ? pct.toFixed(2) + "%" : pct < 10 ? pct.toFixed(1) + "%" : Math.round(pct) + "%";
  $("#gaugeArc").setAttribute("stroke-dasharray", `${Math.min(pct, 100)} 100`);
  $("#planPlants").textContent = pct < 10 ? "North or South" : "North & South";
  $("#planMsg").textContent =
    pct < 1 ? "A perfect pilot — small enough to test the market, made on the same lines that run our biggest orders." :
    pct < 10 ? "Comfortably within capacity, with room to grow 10× without changing manufacturer." :
    pct < 40 ? "A serious programme. We'd typically run it from both plants for faster regional delivery." :
    pct <= 100 ? "A major-volume programme — let's plan dedicated machine time on a rolling forecast." :
    "That's more than one month of our total output — we'd plan it as a phased, multi-month schedule. Let's talk.";
}
$("#packs").addEventListener("input", renderPlan);
$("#planCount").addEventListener("click", e => {
  const b = e.target.closest("button");
  if (!b) return;
  $$("#planCount button").forEach(x => x.classList.remove("on"));
  b.classList.add("on");
  plan.count = +b.dataset.v;
  renderPlan();
});
$("#planCta").addEventListener("click", () => {
  const chip = $('#productChips input[value="Baby wipes"]');
  if (chip) chip.checked = true;
  const packs = packsFromSlider(+$("#packs").value);
  const v = $("#fVolume");
  v.selectedIndex = packs < 10000 ? 1 : packs < 50000 ? 2 : packs < 200000 ? 3 : 4;
  const notes = $("#fNotes");
  if (!notes.value) notes.value = `Planner: ~${inr(packs)} packs/month of ${plan.count}-count wipes.`;
});
renderPlan();

/* ----------------------------------------------------------
   ENQUIRY FORM
   ---------------------------------------------------------- */
(function form() {
  const formEl = $("#enquiry");
  const steps = $$(".step", formEl);
  const labels = $$(".fs", formEl);
  const prev = $("#prevStep"), next = $("#nextStep"), submit = $("#submitBtn"), err = $("#formErr");
  let cur = 0;

  const show = (i, back) => {
    steps.forEach((s, j) => { s.classList.toggle("on", j === i); s.classList.toggle("back", !!back); });
    labels.forEach((l, j) => l.classList.toggle("on", j <= i));
    $("#formBar").style.width = ((i + 1) / steps.length * 100) + "%";
    prev.disabled = i === 0;
    next.hidden = i === steps.length - 1;
    submit.hidden = i !== steps.length - 1;
    err.textContent = "";
    cur = i;
  };

  const validate = i => {
    if (i === 0 && !$$('input[name="products"]:checked', formEl).length) {
      err.textContent = "Pick at least one product you'd like to make.";
      return false;
    }
    if (i === 2) {
      let ok = true;
      ["fName", "fCompany", "fEmail", "fPhone"].forEach(id => {
        const f = $("#" + id);
        const bad = !f.value.trim() || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.value.trim())) || (id === "fPhone" && f.value.replace(/\D/g, "").length < 7);
        f.classList.toggle("bad", bad);
        if (bad) ok = false;
      });
      if (!ok) { err.textContent = "Please fill in the highlighted fields."; return false; }
    }
    return true;
  };

  next.addEventListener("click", () => { if (validate(cur)) show(cur + 1); });
  prev.addEventListener("click", () => show(Math.max(0, cur - 1), true));
  $$("input", formEl).forEach(f => f.addEventListener("input", () => f.classList.remove("bad")));

  formEl.addEventListener("submit", async e => {
    e.preventDefault();
    if (!validate(0)) { show(0); validate(0); return; }
    if (!validate(2)) return;

    const fd = new FormData(formEl);
    const data = {
      products: fd.getAll("products"),
      business: fd.get("business"), volume: fd.get("volume"), launch: fd.get("launch"), formula: fd.get("formula"),
      notes: fd.get("notes"), name: fd.get("name"), company: fd.get("company"), email: fd.get("email"),
      phone: fd.get("phone"), city: fd.get("city"), concept: fd.get("concept"), website: fd.get("website")
    };

    submit.disabled = true;
    submit.textContent = "Sending…";
    const sent = data.website ? true : await sendLead({ ...data, type: "enquiry" });
    if (!data.website) rememberContact(data);

    if (!sent) {
      // No backend reachable (e.g. static hosting) — hand the brief to the visitor's email app.
      mailtoLead("Private label enquiry — " + data.company, [
        `Name: ${data.name}`, `Company: ${data.company}`, `Email: ${data.email}`, `Phone: ${data.phone}`, `City: ${data.city || "-"}`,
        `Business: ${data.business}`, `Products: ${data.products.join(", ")}`, `Volume: ${data.volume}`, `Launch: ${data.launch}`,
        `Formulation: ${data.formula}`, data.concept ? `Brand Studio concept: ${data.concept}` : "", `Notes: ${data.notes || "-"}`
      ]);
      $("#doneMsg").textContent = "Your email app should open with your brief filled in — just press send and our private label team will reply.";
    }
    $("#formDone").hidden = false;
    confetti();
  });

  show(0);
})();

