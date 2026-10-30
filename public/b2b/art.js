/* ==========================================================
   Product artwork (SVG) — reused by every page and the brochure
   so any pack can carry any brand name.
   ========================================================== */
const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const PALETTES = [
  { name: "Blush", c1: "#E6DCDC", c2: "#B1A6A4", c3: "#FAF9F8", ink: "#413F3D", bg: "#EDE7E7" },
  { name: "Slate", c1: "#DADEE6", c2: "#697184", c3: "#FAF9F8", ink: "#3A3F4B", bg: "#E4E6EB" },
  { name: "Mist", c1: "#E4E6EB", c2: "#8C94A6", c3: "#FFFFFF", ink: "#413F3D", bg: "#ECEDF0" },
  { name: "Stone", c1: "#E9E4DF", c2: "#A39A93", c3: "#FAF9F8", ink: "#413F3D", bg: "#EFECE9" },
  { name: "Mauve", c1: "#E1D9DB", c2: "#8E8487", c3: "#FAF9F8", ink: "#413F3D", bg: "#EAE5E6" },
  { name: "Ash", c1: "#E0E1DE", c2: "#8F938E", c3: "#FAF9F8", ink: "#413F3D", bg: "#E9EAE8" },
  { name: "Charcoal", c1: "#4A4846", c2: "#D8CFD0", c3: "#F2F1EF", ink: "#413F3D", bg: "#D8CFD0" }
];
const PRODUCT_LABEL = { wipes: "Baby Wipes", pump: "Baby Shampoo", flip: "Baby Lotion", tube: "Baby Cream", jar: "Rash Cream", detergent: "Baby Laundry Liquid", pouch: "Refill Pack" };

let artN = 0;

function fit(text, maxW, maxSize) {
  const len = Math.max(String(text).length, 1);
  return Math.min(maxSize, maxW / (len * 0.56)).toFixed(1);
}

function sheen(id) {
  return `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="#fff" stop-opacity=".0"/>
    <stop offset=".18" stop-color="#fff" stop-opacity=".45"/>
    <stop offset=".32" stop-color="#fff" stop-opacity="0"/>
    <stop offset=".85" stop-color="#000" stop-opacity="0"/>
    <stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>`;
}

function labelText(cx, y, w, o, sizes = [22, 8.5, 8.5]) {
  const brand = esc(o.brand || "Your Brand");
  const label = esc((o.label || "").toUpperCase());
  const tag = esc(o.tag || "");
  return `<text x="${cx}" y="${y}" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-weight="600" font-size="${fit(o.brand || "Your Brand", w, sizes[0])}" fill="${o.ink}">${brand}</text>
    <text x="${cx}" y="${y + sizes[1] * 2.4}" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="${sizes[1]}" letter-spacing="1.6" fill="${o.ink}" opacity=".75">${label}</text>
    ${tag ? `<text x="${cx}" y="${y + sizes[1] * 2.4 + sizes[2] * 1.9}" text-anchor="middle" font-family="Fraunces, Georgia, serif" font-style="italic" font-size="${sizes[2]}" fill="${o.ink}" opacity=".65">${tag}</text>` : ""}`;
}

function productSVG(type, opts = {}) {
  const o = Object.assign({ brand: "Your Brand", tag: "", ...PALETTES[2] }, opts);
  if (!o.label) o.label = PRODUCT_LABEL[type];
  const g = "art" + (++artN);
  switch (type) {
    case "wipes": {
      const count = o.count || 72;
      return `<svg viewBox="0 0 320 200" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.brand)} ${esc(o.label)} pack"><defs>${sheen(g)}</defs>
        <rect x="10" y="36" width="26" height="132" rx="5" fill="${o.c2}"/>
        <rect x="284" y="36" width="26" height="132" rx="5" fill="${o.c2}"/>
        <line x1="16" y1="40" x2="16" y2="164" stroke="#fff" stroke-width="3" stroke-dasharray="2 5" opacity=".6"/>
        <line x1="304" y1="40" x2="304" y2="164" stroke="#fff" stroke-width="3" stroke-dasharray="2 5" opacity=".6"/>
        <path d="M30 26 C110 12 210 12 290 26 L296 174 C210 188 110 188 24 174 Z" fill="${o.c1}"/>
        <path d="M30 26 C110 12 210 12 290 26 L296 174 C210 188 110 188 24 174 Z" fill="url(#${g})"/>
        <circle cx="58" cy="58" r="12" fill="#fff" opacity=".35"/><circle cx="76" cy="44" r="6" fill="#fff" opacity=".35"/>
        <circle cx="268" cy="150" r="16" fill="#fff" opacity=".25"/>
        <rect x="108" y="32" width="104" height="50" rx="18" fill="#fff"/>
        <rect x="116" y="40" width="88" height="34" rx="12" fill="${o.c2}" opacity=".22"/>
        <rect x="146" y="70" width="28" height="4" rx="2" fill="${o.c2}" opacity=".6"/>
        <rect x="72" y="94" width="176" height="70" rx="18" fill="${o.c3}"/>
        ${labelText(160, 124, 150, Object.assign({}, o, { label: `${o.label} · ${count}` }), [26, 8.5, 9])}
        <circle cx="262" cy="64" r="20" fill="${o.c2}"/>
        <text x="262" y="62" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="800" font-size="11" fill="#fff">${esc(count)}</text>
        <text x="262" y="73" text-anchor="middle" font-family="Plus Jakarta Sans, sans-serif" font-weight="700" font-size="6.5" fill="#fff">WIPES</text>
      </svg>`;
    }
    case "pump":
      return `<svg viewBox="0 0 148 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.brand)} ${esc(o.label)} pump bottle"><defs>${sheen(g)}</defs>
        <path d="M24 18 h40 v12 h-40 a6 6 0 0 1 0-12z" fill="${o.c2}"/>
        <rect x="54" y="8" width="44" height="26" rx="7" fill="${o.c2}"/>
        <rect x="67" y="34" width="18" height="24" fill="${o.c2}" opacity=".85"/>
        <rect x="48" y="56" width="56" height="28" rx="7" fill="${o.c2}"/>
        <rect x="18" y="80" width="116" height="212" rx="36" fill="${o.c1}"/>
        <rect x="18" y="80" width="116" height="212" rx="36" fill="url(#${g})"/>
        <rect x="30" y="134" width="92" height="118" rx="16" fill="${o.c3}"/>
        <path d="M76 148c5 7 9 11 9 16a9 9 0 0 1-18 0c0-5 4-9 9-16z" fill="${o.c2}"/>
        ${labelText(76, 196, 80, o, [20, 7.2, 7.5])}
      </svg>`;
    case "flip":
      return `<svg viewBox="0 0 130 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.brand)} ${esc(o.label)} bottle"><defs>${sheen(g)}</defs>
        <rect x="33" y="10" width="64" height="52" rx="12" fill="${o.c2}"/>
        <rect x="33" y="28" width="64" height="4" fill="#000" opacity=".08"/>
        <path d="M36 58 H94 C116 70 122 92 122 122 V270 Q122 292 100 292 H30 Q8 292 8 270 V122 C8 92 14 70 36 58Z" fill="${o.c1}"/>
        <path d="M36 58 H94 C116 70 122 92 122 122 V270 Q122 292 100 292 H30 Q8 292 8 270 V122 C8 92 14 70 36 58Z" fill="url(#${g})"/>
        <rect x="18" y="140" width="94" height="116" rx="16" fill="${o.c3}"/>
        <circle cx="65" cy="160" r="8" fill="${o.c2}" opacity=".85"/>
        ${labelText(65, 200, 80, o, [19, 7, 7.5])}
      </svg>`;
    case "tube":
      return `<svg viewBox="0 0 120 300" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.brand)} ${esc(o.label)} tube"><defs>${sheen(g)}</defs>
        <rect x="12" y="8" width="96" height="20" rx="3" fill="${o.c2}"/>
        <g stroke="#fff" stroke-width="2" opacity=".5"><line x1="22" y1="12" x2="22" y2="24"/><line x1="32" y1="12" x2="32" y2="24"/><line x1="42" y1="12" x2="42" y2="24"/><line x1="78" y1="12" x2="78" y2="24"/><line x1="88" y1="12" x2="88" y2="24"/><line x1="98" y1="12" x2="98" y2="24"/></g>
        <path d="M12 26 H108 L96 240 Q60 248 24 240 Z" fill="${o.c1}"/>
        <path d="M12 26 H108 L96 240 Q60 248 24 240 Z" fill="url(#${g})"/>
        <rect x="32" y="236" width="56" height="56" rx="10" fill="${o.c2}"/>
        <rect x="26" y="88" width="68" height="110" rx="12" fill="${o.c3}"/>
        ${labelText(60, 136, 58, o, [16, 6.2, 6.5])}
      </svg>`;
    case "jar":
      return `<svg viewBox="0 0 220 190" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.brand)} ${esc(o.label)} jar"><defs>${sheen(g)}</defs>
        <rect x="24" y="12" width="172" height="52" rx="14" fill="${o.c2}"/>
        <g stroke="#000" stroke-width="2" opacity=".08">${Array.from({ length: 16 }, (_, i) => `<line x1="${36 + i * 10}" y1="18" x2="${36 + i * 10}" y2="58"/>`).join("")}</g>
        <rect x="16" y="56" width="188" height="126" rx="30" fill="${o.c1}"/>
        <rect x="16" y="56" width="188" height="126" rx="30" fill="url(#${g})"/>
        <rect x="16" y="88" width="188" height="64" fill="${o.c3}"/>
        ${labelText(110, 116, 150, o, [22, 7.5, 7.5])}
      </svg>`;
    case "detergent":
      return `<svg viewBox="0 0 220 290" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.brand)} ${esc(o.label)} can"><defs>${sheen(g)}</defs>
        <rect x="34" y="6" width="58" height="32" rx="7" fill="${o.c2}"/>
        <rect x="40" y="34" width="46" height="16" fill="${o.c2}" opacity=".8"/>
        <path fill-rule="evenodd" d="M32 46 H150 Q206 46 206 102 V262 Q206 284 184 284 H36 Q14 284 14 262 V70 Q14 46 32 46Z M122 68 H168 Q184 68 184 86 V118 Q184 134 168 134 H122 Q108 134 108 120 V82 Q108 68 122 68Z" fill="${o.c1}"/>
        <path fill-rule="evenodd" d="M32 46 H150 Q206 46 206 102 V262 Q206 284 184 284 H36 Q14 284 14 262 V70 Q14 46 32 46Z M122 68 H168 Q184 68 184 86 V118 Q184 134 168 134 H122 Q108 134 108 120 V82 Q108 68 122 68Z" fill="url(#${g})"/>
        <rect x="30" y="152" width="160" height="112" rx="18" fill="${o.c3}"/>
        <circle cx="110" cy="172" r="8" fill="${o.c2}"/><circle cx="96" cy="176" r="5" fill="${o.c2}" opacity=".6"/><circle cx="124" cy="177" r="4" fill="${o.c2}" opacity=".5"/>
        ${labelText(110, 212, 140, o, [22, 7.5, 8])}
      </svg>`;
    case "pouch":
      return `<svg viewBox="0 0 170 260" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${esc(o.brand)} ${esc(o.label)} pouch"><defs>${sheen(g)}</defs>
        <rect x="108" y="4" width="34" height="26" rx="6" fill="${o.c2}"/>
        <rect x="114" y="28" width="22" height="16" fill="${o.c2}" opacity=".8"/>
        <path d="M18 40 H152 V222 Q152 250 124 250 H46 Q18 250 18 222 Z" fill="${o.c1}"/>
        <path d="M18 40 H152 V222 Q152 250 124 250 H46 Q18 250 18 222 Z" fill="url(#${g})"/>
        <path d="M18 214 Q85 236 152 214" fill="none" stroke="#000" stroke-opacity=".08" stroke-width="3"/>
        <rect x="18" y="40" width="134" height="10" fill="#000" opacity=".06"/>
        <rect x="32" y="96" width="106" height="100" rx="14" fill="${o.c3}"/>
        ${labelText(85, 138, 92, o, [18, 6.8, 7])}
      </svg>`;
  }
  return "";
}
