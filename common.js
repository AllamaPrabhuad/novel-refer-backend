/* ==========================================================
   Novel Tissues — shared behaviour for every page
   (navigation, reveals, product art, brochure & sample modals)
   Needs config.js and art.js loaded first.
   ========================================================== */
const ROOT = document.body.dataset.root || "";
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const inr = n => Math.round(n).toLocaleString("en-IN");
const scrollHooks = [];

/* ---------- Google Analytics 4 (only when SITE.ga4 is set in config.js) ---------- */
window.dataLayer = window.dataLayer || [];
function track(event, params = {}) {
  if (typeof window.gtag === "function") window.gtag("event", event, params);
}
if (SITE.ga4) {
  window.gtag = function () { window.dataLayer.push(arguments); };
  window.gtag("js", new Date());
  window.gtag("config", SITE.ga4, { anonymize_ip: true });
  const tag = document.createElement("script");
  tag.async = true;
  tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(SITE.ga4);
  document.head.appendChild(tag);
}

const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) { /* private mode */ } }
};

/* ---------- product art placeholders ---------- */
function renderArt(scope = document) {
  $$("[data-art]", scope).forEach(el => {
    const pal = PALETTES[+(el.dataset.pal || 2)] || PALETTES[2];
    el.innerHTML = productSVG(el.dataset.art, {
      ...pal,
      brand: el.dataset.brand || "Your Brand",
      tag: el.dataset.tag || "",
      count: el.dataset.count,
      label: el.dataset.label
    });
  });
}
renderArt();

/* ---------- split headings, reveals & counters ---------- */
function splitWords(root) {
  let i = 0;
  const walk = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === 3) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(" ")); return; }
          const w = document.createElement("span");
          w.className = "w";
          const inner = document.createElement("span");
          inner.style.setProperty("--i", i++);
          inner.textContent = part;
          w.appendChild(inner);
          frag.appendChild(w);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === 1) {
        walk(child);
      }
    });
  };
  walk(root);
}
$$(".split").forEach(splitWords);

$$(".reveal").forEach(el => {
  if (el.style.getPropertyValue("--d")) return;
  const sibs = [...el.parentElement.children].filter(c => c.classList.contains("reveal"));
  el.style.setProperty("--d", Math.min(sibs.indexOf(el), 6));
});

function animateCount(el) {
  const to = parseFloat(el.dataset.to);
  const dec = parseInt(el.dataset.dec || "0", 10);
  const indian = el.dataset.indian === "1";
  const dur = reduceMotion ? 0 : 1800;
  const t0 = performance.now();
  const step = now => {
    const p = dur ? clamp((now - t0) / dur, 0, 1) : 1;
    const e = 1 - Math.pow(2, -10 * p);
    const v = to * (p === 1 ? 1 : e);
    el.textContent = indian ? inr(v) : v.toFixed(dec);
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

const io = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    el.classList.add("in");
    $$(".count", el).forEach(c => { if (!c.dataset.done) { c.dataset.done = 1; animateCount(c); } });
    if (el.classList.contains("count") && !el.dataset.done) { el.dataset.done = 1; animateCount(el); }
    io.unobserve(el);
  });
}, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

// On the home page the loader reveals the hero itself.
const heroManaged = !!$("#loader");
$$(".reveal, .split, .count").forEach(el => { if (!(heroManaged && el.closest("#hero"))) io.observe(el); });

/* ---------- nav, progress, cursor, magnetic buttons ---------- */
const nav = $("#nav");
const progress = $("#scrollProgress");
const navLinks = $$(".nav-links a[href]");
const sections = $$("main section[id]");
let lastY = 0;

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  if (nav) {
    nav.classList.toggle("scrolled", y > 30);
    const menuOpen = $("#navLinks").classList.contains("open");
    nav.classList.toggle("hide", !menuOpen && y > 700 && y > lastY + 4);
    if (y < lastY - 4) nav.classList.remove("hide");
  }
  lastY = y;

  if (heroManaged) {
    let current = "";
    sections.forEach(s => { if (s.offsetTop - 160 <= y) current = s.id; });
    navLinks.forEach(a => {
      const h = a.getAttribute("href");
      if (h.startsWith("#")) a.classList.toggle("active", h === "#" + current);
    });
  }
  scrollHooks.forEach(fn => fn(y));
}
window.addEventListener("scroll", onScroll, { passive: true });

if ($("#burger")) {
  $("#burger").addEventListener("click", () => {
    const open = $("#navLinks").classList.toggle("open");
    $("#burger").setAttribute("aria-expanded", open);
  });
  navLinks.forEach(a => a.addEventListener("click", () => {
    $("#navLinks").classList.remove("open");
    $("#burger").setAttribute("aria-expanded", "false");
  }));
}

if (finePointer && !reduceMotion && $("#cursor")) {
  const cursor = $("#cursor");
  let cx = 0, cy = 0, tx = 0, ty = 0;
  window.addEventListener("mousemove", e => { tx = e.clientX; ty = e.clientY; cursor.classList.add("on"); });
  document.addEventListener("mouseleave", () => cursor.classList.remove("on"));
  (function loop() {
    cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2;
    cursor.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(loop);
  })();
  document.addEventListener("mouseover", e => {
    cursor.classList.toggle("big", !!e.target.closest("a, button, .plant-node, .wipe-stage, .plant-card, .swatch, label, summary"));
  });
}
if (finePointer && !reduceMotion) {
  $$(".magnetic").forEach(btn => {
    btn.addEventListener("mousemove", e => {
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${dx * 0.22}px, ${dy * 0.35}px)`;
    });
    btn.addEventListener("mouseleave", () => { btn.style.transform = ""; });
  });
}

/* ---------- article table of contents ---------- */
(function toc() {
  const links = $$(".toc a");
  if (!links.length) return;
  const heads = links.map(a => document.getElementById(a.getAttribute("href").slice(1))).filter(Boolean);
  scrollHooks.push(() => {
    let cur = heads[0];
    heads.forEach(h => { if (h.getBoundingClientRect().top < 140) cur = h; });
    links.forEach(a => a.classList.toggle("on", cur && a.getAttribute("href") === "#" + cur.id));
  });
})();

/* ---------- lead capture (enquiry, brochure, samples) ---------- */
async function sendLead(data) {
  try {
    const res = await fetch(CONTACT.endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, page: location.href })
    });
    if (res.ok) track("generate_lead", { lead_type: data.type || "enquiry" });
    return res.ok;
  } catch (_) {
    return false;
  }
}

function mailtoLead(subject, lines) {
  location.href = `mailto:${CONTACT.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.filter(Boolean).join("\n"))}`;
}

function rememberContact(d) {
  store.set("nt_contact", { name: d.name, company: d.company, email: d.email, phone: d.phone, business: d.business });
}

function prefill(form) {
  const saved = store.get("nt_contact");
  if (!saved) return;
  Object.entries(saved).forEach(([k, v]) => {
    const f = form.elements[k];
    if (f && !f.value && v) f.value = v;
  });
}

function validContact(form) {
  let ok = true;
  $$("[required]", form).forEach(f => {
    const v = f.value.trim();
    const bad = !v || (f.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) || (f.type === "tel" && v.replace(/\D/g, "").length < 7);
    f.classList.toggle("bad", bad);
    if (bad) ok = false;
  });
  return ok;
}

const BUSINESS_OPTIONS = ["D2C / online brand", "Retail / supermarket chain", "Pharmacy chain", "Distributor / exporter", "Hospital / institution", "New brand — just starting", "Other"];
const SAMPLE_PRODUCTS = ["Baby wipes", "Baby shampoo / wash", "Baby lotion", "Baby cream", "Baby oil", "Rash cream", "Baby laundry detergent", "Bottle / surface cleanser"];

function contactFields(prefix) {
  return `
    <div class="field two">
      <div><label for="${prefix}Name">Your name *</label><input id="${prefix}Name" name="name" required autocomplete="name" /></div>
      <div><label for="${prefix}Company">Company / brand *</label><input id="${prefix}Company" name="company" required autocomplete="organization" /></div>
    </div>
    <div class="field two">
      <div><label for="${prefix}Email">Work email *</label><input id="${prefix}Email" name="email" type="email" required autocomplete="email" /></div>
      <div><label for="${prefix}Phone">Phone / WhatsApp *</label><input id="${prefix}Phone" name="phone" type="tel" required autocomplete="tel" /></div>
    </div>`;
}

const MODALS_HTML = `
<div class="modal" id="mBrochure" role="dialog" aria-modal="true" aria-labelledby="mBrochureT" hidden>
  <div class="modal-scrim" data-close></div>
  <div class="modal-card">
    <button class="modal-x" type="button" data-close aria-label="Close">✕</button>
    <div class="modal-grid">
      <div class="modal-side side-brochure">
        <div class="book"><div class="book-page"></div><div class="book-cover"><span>Novel Tissues</span><b>Private Label<br/>Baby Care</b><i></i></div></div>
        <ul class="inside">
          <li>Plants, machines &amp; monthly capacity</li>
          <li>Full wipes, cosmetics &amp; laundry range</li>
          <li>Pack formats &amp; customisation options</li>
          <li>Our 6-step private label process</li>
        </ul>
      </div>
      <div class="modal-main">
        <form class="modal-form" id="fBrochure" novalidate>
          <p class="kicker">Company brochure · PDF</p>
          <h3 id="mBrochureT">Get the Novel Tissues brochure</h3>
          <p class="modal-lead">Capacity, product ranges, pack formats and our private label process — in one PDF to share with your team.</p>
          ${contactFields("b")}
          <div class="field">
            <label for="bBusiness">You are a…</label>
            <select id="bBusiness" name="business">${BUSINESS_OPTIONS.map(o => `<option>${o}</option>`).join("")}</select>
          </div>
          <input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <button type="submit" class="btn btn-peach btn-block">Download the brochure ↓</button>
          <p class="form-err" role="alert"></p>
          <p class="privacy">We only use your details to follow up about private label manufacturing.</p>
        </form>
        <div class="modal-done" hidden>
          <div class="done-burst"></div>
          <h3>Your brochure is downloading</h3>
          <p>If it didn't start, <a class="link" data-brochure-link href="#" download>download it here</a>.</p>
          <button type="button" class="btn btn-ink" data-open="sample">Request a sample kit too →</button>
        </div>
      </div>
    </div>
  </div>
</div>

<div class="modal" id="mSample" role="dialog" aria-modal="true" aria-labelledby="mSampleT" hidden>
  <div class="modal-scrim" data-close></div>
  <div class="modal-card">
    <button class="modal-x" type="button" data-close aria-label="Close">✕</button>
    <div class="modal-grid">
      <div class="modal-side side-sample">
        <div class="kit">
          <div class="kit-items"><div data-art="pump" data-pal="0"></div><div data-art="tube" data-pal="1"></div><div data-art="flip" data-pal="4"></div></div>
          <div class="kit-box"><span>Sample kit</span></div>
          <div class="kit-lid"></div>
        </div>
        <ul class="inside">
          <li>Feel our wipes substrates &amp; lotions</li>
          <li>Try shampoo, lotion &amp; cream bases</li>
          <li>Compare textures before you decide</li>
          <li>Shipped to your office</li>
        </ul>
      </div>
      <div class="modal-main">
        <form class="modal-form" id="fSample" novalidate>
          <p class="kicker">Sample request</p>
          <h3 id="mSampleT">Request a sample kit</h3>
          <p class="modal-lead">Tell us what you're planning to launch and where to send it. Our team confirms the kit before dispatch.</p>
          <div class="field"><label>Samples you'd like *</label>
            <div class="chips">${SAMPLE_PRODUCTS.map(p => `<label><input type="checkbox" name="products" value="${p}" /><span>${p.replace(/^Baby (.)/, (_, c) => c.toUpperCase())}</span></label>`).join("")}</div>
          </div>
          ${contactFields("s")}
          <div class="field"><label for="sAddress">Delivery address *</label><textarea id="sAddress" name="address" rows="2" required autocomplete="street-address"></textarea></div>
          <div class="field two">
            <div><label for="sCity">City *</label><input id="sCity" name="city" required autocomplete="address-level2" /></div>
            <div><label for="sPin">PIN / postcode *</label><input id="sPin" name="pincode" required autocomplete="postal-code" /></div>
          </div>
          <div class="field"><label for="sNotes">What are you planning to launch?</label><textarea id="sNotes" name="notes" rows="2"></textarea></div>
          <input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <button type="submit" class="btn btn-peach btn-block">Request my sample kit ✦</button>
          <p class="form-err" role="alert"></p>
        </form>
        <div class="modal-done" hidden>
          <div class="done-burst"></div>
          <h3>Sample request received</h3>
          <p class="done-msg">Our private label team will confirm your kit and dispatch details shortly.</p>
          <button type="button" class="btn btn-ghost" data-open="brochure">Download our brochure →</button>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="modal" id="mVisit" role="dialog" aria-modal="true" aria-labelledby="mVisitT" hidden>
  <div class="modal-scrim" data-close></div>
  <div class="modal-card">
    <button class="modal-x" type="button" data-close aria-label="Close">✕</button>
    <div class="modal-grid">
      <div class="modal-side side-visit">
        <div class="cal" aria-hidden="true">
          <div class="cal-head"><span>Visit day</span><b>10:30</b></div>
          <div class="cal-grid">${Array.from({ length: 28 }, (_, i) => `<i${i === 17 ? ' class="on"' : ""}></i>`).join("")}</div>
        </div>
        <ul class="inside">
          <li>Walk the wipes lines or the Pondicherry liquids campus</li>
          <li>Or meet us on a video call with your brief</li>
          <li>Meet the people who will make your products</li>
          <li>We confirm the slot with you</li>
        </ul>
      </div>
      <div class="modal-main">
        <form class="modal-form" id="fVisit" novalidate>
          <p class="kicker">Meet us</p>
          <h3 id="mVisitT">Book a factory visit or video call</h3>
          <p class="modal-lead">See how your products would be made, or talk through your range with our private label team.</p>
          <div class="field two">
            <div><label for="vMode">Meeting *</label><select id="vMode" name="mode" required><option>Factory visit</option><option>Video call</option></select></div>
            <div><label for="vPlant">Plant</label><select id="vPlant" name="plant"><option>Not sure yet</option><option>North India wipes plant</option><option>South India wipes plant</option><option>Pondicherry liquids campus</option></select></div>
          </div>
          <div class="field two">
            <div><label for="vDate">Preferred date *</label><input id="vDate" name="date" type="date" required /></div>
            <div><label for="vTime">Preferred time</label><select id="vTime" name="time"><option>Morning (10 am – 1 pm)</option><option>Afternoon (2 pm – 5 pm)</option></select></div>
          </div>
          ${contactFields("v")}
          <div class="field"><label for="vNotes">What would you like to discuss?</label><textarea id="vNotes" name="notes" rows="2"></textarea></div>
          <input type="text" name="website" class="hp-field" tabindex="-1" autocomplete="off" aria-hidden="true" />
          <button type="submit" class="btn btn-peach btn-block">Request this slot</button>
          <p class="form-err" role="alert"></p>
          <p class="privacy cal-link" hidden>Prefer to pick a time yourself? <a class="link" target="_blank" rel="noopener" data-calendar-link href="#">Open our calendar</a>.</p>
        </form>
        <div class="modal-done" hidden>
          <div class="done-burst"></div>
          <h3>Request received</h3>
          <p class="done-msg">We'll confirm the slot with you by email or phone.</p>
          <button type="button" class="btn btn-ghost" data-open="brochure">Download our brochure →</button>
        </div>
      </div>
    </div>
  </div>
</div>`;

(function modals() {
  document.body.insertAdjacentHTML("beforeend", MODALS_HTML);
  const mB = $("#mBrochure"), mS = $("#mSample"), mV = $("#mVisit");
  const MODALS = { brochure: mB, sample: mS, visit: mV };
  const tomorrow = new Date(Date.now() + 864e5).toISOString().slice(0, 10);
  $("#vDate").min = tomorrow;
  if (CONTACT.calendly) {
    $("[data-calendar-link]", mV).href = CONTACT.calendly;
    $(".cal-link", mV).hidden = false;
  }
  renderArt(mS);
  const brochureUrl = ROOT + SITE.brochure;
  $("[data-brochure-link]", mB).href = brochureUrl;
  let lastFocus = null;

  const close = () => {
    $$(".modal").forEach(m => { m.hidden = true; });
    document.body.classList.remove("modal-open");
    if (lastFocus) lastFocus.focus();
  };
  const open = which => {
    const m = MODALS[which] || mB;
    $$(".modal").forEach(x => { x.hidden = x !== m; });
    lastFocus = document.activeElement;
    document.body.classList.add("modal-open");
    const form = $("form", m);
    if (which === "brochure" && store.get("nt_brochure")) {
      form.hidden = true;
      $(".modal-done", m).hidden = false;
    } else {
      form.hidden = false;
      $(".modal-done", m).hidden = true;
      prefill(form);
    }
    m.hidden = false;
    const first = $("input:not([type=hidden]):not(.hp-field), button", form.hidden ? $(".modal-done", m) : form);
    setTimeout(() => first && first.focus(), 60);
  };

  document.addEventListener("click", e => {
    const t = e.target.closest("[data-open]");
    if (t) { e.preventDefault(); open(t.dataset.open); return; }
    if (e.target.closest("[data-close]")) close();
  });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && document.body.classList.contains("modal-open")) close(); });
  $$(".modal").forEach(m => m.addEventListener("input", e => {
    e.target.classList.remove("bad");
    const err = $(".form-err", e.target.form || m);
    if (err && e.target.name === "products") err.textContent = "";
  }));

  function download() {
    const a = document.createElement("a");
    a.href = brochureUrl;
    a.download = "";
    document.body.appendChild(a);
    a.click();
    a.remove();
    track("file_download", { file_name: SITE.brochure.split("/").pop() });
  }

  $("#fBrochure").addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target, err = $(".form-err", form);
    if (!validContact(form)) { err.textContent = "Please fill in the highlighted fields."; return; }
    err.textContent = "";
    const fd = new FormData(form);
    const d = Object.fromEntries(fd.entries());
    const btn = $("button[type=submit]", form);
    btn.disabled = true;
    if (!d.website) {
      rememberContact(d);
      await sendLead({ ...d, type: "brochure" });
    }
    btn.disabled = false;
    store.set("nt_brochure", true);
    form.hidden = true;
    $(".modal-done", mB).hidden = false;
    download();
  });

  $("#fSample").addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target, err = $(".form-err", form);
    const fd = new FormData(form);
    const products = fd.getAll("products");
    const okContact = validContact(form);
    if (!products.length) { err.textContent = "Pick at least one product to sample."; return; }
    if (!okContact) { err.textContent = "Please fill in the highlighted fields."; return; }
    err.textContent = "";
    const d = { ...Object.fromEntries(fd.entries()), products, type: "sample" };
    const btn = $("button[type=submit]", form);
    btn.disabled = true;
    btn.textContent = "Sending…";
    let sent = true;
    if (!d.website) {
      rememberContact(d);
      sent = await sendLead(d);
    }
    btn.disabled = false;
    btn.textContent = "Request my sample kit ✦";
    if (!sent) {
      mailtoLead(`Sample kit request — ${d.company}`, [
        `Name: ${d.name}`, `Company: ${d.company}`, `Email: ${d.email}`, `Phone: ${d.phone}`,
        `Samples: ${products.join(", ")}`, `Address: ${d.address}`, `City: ${d.city}`, `PIN: ${d.pincode}`,
        d.notes ? `Plans: ${d.notes}` : ""
      ]);
      $(".done-msg", mS).textContent = "Your email app should open with the request filled in — just press send.";
    }
    form.hidden = true;
    $(".modal-done", mS).hidden = false;
    confetti();
  });

  $("#fVisit").addEventListener("submit", async e => {
    e.preventDefault();
    const form = e.target, err = $(".form-err", form);
    if (!validContact(form)) { err.textContent = "Please fill in the highlighted fields."; return; }
    err.textContent = "";
    const d = { ...Object.fromEntries(new FormData(form).entries()), type: "visit" };
    const btn = $("button[type=submit]", form);
    btn.disabled = true;
    btn.textContent = "Sending…";
    let sent = true;
    if (!d.website) {
      rememberContact(d);
      sent = await sendLead(d);
    }
    btn.disabled = false;
    btn.textContent = "Request this slot";
    if (!sent) {
      mailtoLead(`${d.mode} request — ${d.company}`, [
        `Name: ${d.name}`, `Company: ${d.company}`, `Email: ${d.email}`, `Phone: ${d.phone}`,
        `Meeting: ${d.mode}`, `Plant: ${d.plant}`, `Date: ${d.date}`, `Time: ${d.time}`, d.notes ? `Notes: ${d.notes}` : ""
      ]);
      $(".done-msg", mV).textContent = "Your email app should open with the request filled in — just press send.";
    }
    form.hidden = true;
    $(".modal-done", mV).hidden = false;
    confetti();
  });

  if (["#brochure", "#sample", "#visit"].includes(location.hash)) open(location.hash.slice(1));
})();

function confetti() {
  if (reduceMotion) return;
  const colors = ["#697184", "#B1A6A4", "#9AA2B3", "#D8CFD0", "#C4BBBC"];
  for (let i = 0; i < 70; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[i % colors.length];
    c.style.setProperty("--x", (Math.random() - 0.5) * 200 + "px");
    c.style.setProperty("--r", Math.random() * 720 + "deg");
    c.style.animationDuration = 2 + Math.random() * 2 + "s";
    c.style.animationDelay = Math.random() * 0.4 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 4800);
  }
}

/* ---------- factory video: load YouTube only when the visitor presses play ---------- */
document.addEventListener("click", e => {
  const b = e.target.closest(".video-lite");
  if (!b) return;
  const f = document.createElement("iframe");
  f.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(b.dataset.yt)}?autoplay=1&rel=0`;
  f.title = "Factory tour";
  f.allow = "autoplay; encrypted-media; picture-in-picture";
  f.allowFullscreen = true;
  const frame = document.createElement("div");
  frame.className = "video-frame";
  frame.appendChild(f);
  b.replaceWith(frame);
});

/* ---------- contact details & misc ---------- */
(function contacts() {
  const links = [];
  if (CONTACT.email) links.push(`<a href="mailto:${esc(CONTACT.email)}">✉ ${esc(CONTACT.email)}</a>`);
  if (CONTACT.phone) links.push(`<a href="tel:${esc(CONTACT.phone.replace(/\s/g, ""))}">☏ ${esc(CONTACT.phone)}</a>`);
  if (CONTACT.whatsapp) {
    const wa = `https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent("Hi Novel Tissues, I'd like to discuss private label baby care.")}`;
    links.push(`<a href="${wa}" target="_blank" rel="noopener">💬 WhatsApp us</a>`);
    const f = $("#waFloat");
    if (f) { f.href = wa; f.hidden = false; }
  }
  $$("[data-contact-links]").forEach(el => { el.innerHTML = links.join(""); });
  $$("[data-year]").forEach(el => { el.textContent = new Date().getFullYear(); });
})();

requestAnimationFrame(onScroll);
