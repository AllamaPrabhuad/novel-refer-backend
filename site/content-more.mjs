// More content: trust details, price bands, About, regional / specialist / export pages and extra posts.
// Sections driven by empty lists stay hidden on the site until you fill them in — nothing is invented.
import { PUBLISHED } from "./content.mjs";

/* ----------------------------------------------------------
   TRUST — fill these in with real details; each block appears on
   the home and About pages as soon as its list is not empty.
   ---------------------------------------------------------- */
export const TRUST = {
  // Factory photos: put files in public/b2b/media/factory/ and list them, e.g.
  // { src: "media/factory/wipes-line-1.jpg", caption: "Wipes line, South India plant" }
  photos: [],
  // A YouTube video ID for a factory tour, e.g. "dQw4w9WgXcQ"
  videoId: "",
  // e.g. { name: "GMP", detail: "Good Manufacturing Practice — certificate no. …" }
  certifications: [],
  // Brands or retailers you may name publicly, e.g. { name: "Brand name", logo: "media/clients/brand.png" }
  clients: [],
  // e.g. { title: "D2C baby brand", result: "3 SKUs to 2 lakh packs a month in 6 months", detail: "…" }
  caseStudies: [],
  // MOQ & lead times, e.g. { product: "Baby wipes (72s)", moq: "10,000 packs", firstOrder: "4–6 weeks", repeat: "2–3 weeks" }
  moq: [],
  // Founder / company story paragraphs and facts for the About page
  story: [],
  facts: [] // e.g. { label: "Established", value: "2012" }
};

/* ----------------------------------------------------------
   PRICE BANDS — indicative prices for the estimator on the home page.
   Leave empty to hide the estimator. Prices in ₹ per unit, ex-GST.
   e.g. { product: "Baby wipes · 72 count", unit: "pack",
          bands: [ { from: 10000, low: 0, high: 0 }, { from: 50000, low: 0, high: 0 } ] }
   ---------------------------------------------------------- */
export const PRICE_BANDS = [];

/* ----------------------------------------------------------
   Landing pages: regions, specialist ranges, export markets
   ---------------------------------------------------------- */
const SERVE_CTA = "Tell us where your warehouses are and we'll plan dispatch from the plant that gives you the best freight and replenishment time.";

export const LANDINGS = [
  // ---------- regions ----------
  {
    group: "locations", slug: "south-india", nav: "South India",
    seoTitle: "Baby Wipes & Baby Care Manufacturer in South India | Private Label | Novel Tissues",
    description: "Private label baby wipes, baby shampoo, lotion and detergent manufacturer for Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana and Puducherry — South India wipes plant and Pondicherry liquids campus.",
    kicker: "Manufacturing for South India",
    h1: "Baby care manufacturing <em>in South India.</em>",
    lead: "Our South India wipes plant and our Pondicherry liquids campus are both in the region — so brands in Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana and Puducherry get wipes, cosmetics and laundry liquids made close to their warehouses.",
    heroBg: "#E6E1E0",
    art: [{ type: "wipes", pal: 1 }, { type: "pump", pal: 0 }, { type: "jar", pal: 3 }],
    facts: ["South India wipes plant", "Pondicherry liquids campus", "Wipes + liquids from one region", "Near southern ports"],
    points: [
      ["Wipes and liquids from the same region", "Wipes from our South India plant and every liquid from Pondicherry — easier to plan consolidated dispatches to your South Indian warehouses."],
      ["Close to southern ports", "A short haul to Chennai and other southern ports for export orders."],
      ["Built for regional brands", "D2C labels, pharmacy chains and modern trade across the five southern states and Puducherry."],
      ["Visit the plants", "Walk the wipes line and the liquids campus before you commit — book a visit from this page."]
    ],
    sections: [
      { h2: "What we make for South Indian brands", html: "<p>Baby wet wipes in every count from pocket packs to 100+; tear-free shampoos and washes; lotions, creams, massage oils and rash creams; and baby laundry detergents and cleansers. Every product can carry your brand, your formula choices and your pack design.</p>" },
      { h2: "Why make in the south", html: "<p>Making close to where you sell shortens freight time and lowers the cost of replenishment. With wipes and liquids both made in the region, you can plan fewer, fuller shipments to your hubs in Chennai, Bengaluru, Hyderabad, Kochi or Coimbatore.</p><p>" + SERVE_CTA + "</p>" }
    ],
    faqs: [
      ["Do you supply brands across all South Indian states?", "Yes — Tamil Nadu, Kerala, Karnataka, Andhra Pradesh, Telangana and Puducherry. Tell us your warehouse locations and volumes and we'll plan dispatch."],
      ["Can I visit the Pondicherry campus?", "Yes. Use “Book a factory visit” on this page and choose the Pondicherry liquids campus."],
      ["Can wipes and liquids ship together?", "We plan dispatches around your range and volumes so you receive what you need with fewer, fuller loads."]
    ],
    products: ["baby-wipes", "baby-shampoo-body-wash", "baby-lotion-cream-oil", "baby-laundry-detergent-cleansers"],
    posts: ["start-baby-care-brand-india", "choose-baby-wipes-manufacturer-india"]
  },
  {
    group: "locations", slug: "north-india", nav: "North India",
    seoTitle: "Baby Wipes Manufacturer in North India & Delhi NCR | Private Label | Novel Tissues",
    description: "Private label baby wipes manufacturer for Delhi NCR, Uttar Pradesh, Punjab, Haryana, Rajasthan and the north — North India wipes plant, plus baby cosmetics and detergents from our Pondicherry campus.",
    kicker: "Manufacturing for North India",
    h1: "Baby wipes made <em>in North India.</em>",
    lead: "Our North India wipes plant makes baby wipes close to Delhi NCR, Uttar Pradesh, Punjab, Haryana, Rajasthan, Uttarakhand and Himachal Pradesh — with shampoos, lotions, creams and laundry liquids from our Pondicherry campus completing your range.",
    heroBg: "#E2E4EA",
    art: [{ type: "wipes", pal: 2 }, { type: "wipes", pal: 0, count: 30 }],
    facts: ["North India wipes plant", "Serves Delhi NCR & the north", "Full range with Pondicherry liquids", "Backup plant in the south"],
    points: [
      ["Wipes made close to the north", "Shorter freight to warehouses in Delhi NCR, Lucknow, Jaipur, Chandigarh and beyond."],
      ["A second plant behind you", "If demand spikes, our South India wipes plant runs the same specification."],
      ["One supplier for the range", "Add shampoos, lotions, creams and detergents from Pondicherry under the same contract."],
      ["For every channel", "D2C, quick-commerce dark stores, modern trade, pharmacy chains and hospitals."]
    ],
    sections: [
      { h2: "Baby wipes for North Indian brands", html: "<p>Choose your substrate, fabric weight, lotion, count and lid. We make everyday baby wipes, water-based wipes, botanical wipes, travel packs and hand &amp; face wipes in your branding, and plan production around your forecast.</p>" },
      { h2: "Planning supply for the north", html: "<p>North India is one of the largest markets for baby care in the country, with dense e-commerce and quick-commerce demand around Delhi NCR. Making wipes in the region helps you replenish faster and keep listings in stock.</p><p>" + SERVE_CTA + "</p>" }
    ],
    faqs: [
      ["Do you make baby wipes in North India?", "Yes. One of our two wipes plants is in North India, and both plants run the same specifications and quality checks."],
      ["Can you also supply shampoo and lotion to the north?", "Yes. Our liquids are made at our Pondicherry campus and shipped to your warehouses alongside your wipes plan."],
      ["What if one plant is busy?", "With wipes plants in both the north and the south, we can balance production between them."]
    ],
    products: ["baby-wipes", "baby-shampoo-body-wash", "baby-lotion-cream-oil"],
    posts: ["choose-baby-wipes-manufacturer-india", "baby-wipes-gsm-spunlace-guide"]
  },
  {
    group: "locations", slug: "west-india", nav: "West India",
    seoTitle: "Private Label Baby Care Manufacturer for Maharashtra & Gujarat | Novel Tissues",
    description: "Private label baby wipes, baby shampoo, lotion and laundry detergent for brands in Mumbai, Pune, Ahmedabad, Surat and across Maharashtra, Gujarat, Madhya Pradesh and Goa.",
    kicker: "Manufacturing for West India",
    h1: "Private label baby care <em>for West India.</em>",
    lead: "Mumbai, Pune, Ahmedabad and Surat are home to many of India's fastest-growing D2C and e-commerce baby brands. We make their wipes, cosmetics and laundry liquids — and plan dispatch from whichever of our plants gives the best freight to your warehouse.",
    heroBg: "#EDE8E6",
    art: [{ type: "flip", pal: 4 }, { type: "wipes", pal: 3 }, { type: "tube", pal: 1 }],
    facts: ["For D2C & e-commerce brands", "Wipes + cosmetics + detergents", "Dispatch planned per warehouse", "Pilot runs to national scale"],
    points: [
      ["Made for D2C speed", "Start with a pilot run, then scale on the same lines as your sales grow."],
      ["Marketplace-ready packs", "Multipacks, combos and travel sizes for marketplace and quick-commerce listings."],
      ["One supplier, full range", "Wipes, shampoos, lotions, creams, oils and laundry liquids under one contract."],
      ["Dispatch planned for you", "We plan shipments from the plant that suits your warehouse best."]
    ],
    sections: [
      { h2: "What West Indian brands make with us", html: "<p>Most brands start with a hero baby wipe and one or two liquids — a tear-free shampoo or a baby lotion — then add laundry detergent, rash cream and gift sets as they grow. We manufacture all of them in your branding.</p>" },
      { h2: "Supply to Maharashtra, Gujarat, MP and Goa", html: "<p>" + SERVE_CTA + " For large volumes we agree a rolling forecast so your marketplace listings stay in stock.</p>" }
    ],
    faqs: [
      ["Do you work with D2C brands in Mumbai and Pune?", "Yes — D2C and e-commerce brands are a large share of the brands we make for. Pilot runs are a good place to start."],
      ["Which plant would supply my warehouse?", "We plan dispatch from the plant that gives your warehouse the best freight and replenishment time."],
      ["Can you make combo packs?", "We make every product in a typical baby care combo. Tell us the combination and pack format you want."]
    ],
    products: ["baby-wipes", "baby-shampoo-body-wash", "baby-lotion-cream-oil", "baby-laundry-detergent-cleansers"],
    posts: ["start-baby-care-brand-india", "private-label-moq-baby-products"]
  },
  {
    group: "locations", slug: "east-india", nav: "East & North-East India",
    seoTitle: "Baby Care Manufacturer for East & North-East India | Private Label | Novel Tissues",
    description: "Private label baby wipes and baby care manufacturing for brands and distributors in West Bengal, Odisha, Bihar, Jharkhand, Assam and the North-East.",
    kicker: "Manufacturing for East India",
    h1: "Baby care manufacturing <em>for East &amp; North-East India.</em>",
    lead: "For brands and distributors in West Bengal, Odisha, Bihar, Jharkhand, Assam and the North-East, we manufacture private label baby wipes, cosmetics and laundry liquids and plan consolidated dispatches to your hubs.",
    heroBg: "#E4E1E6",
    art: [{ type: "detergent", pal: 4 }, { type: "pump", pal: 2 }],
    facts: ["For brands & distributors", "Consolidated dispatches", "Full baby care range", "Your brand, your specs"],
    points: [
      ["Distributor-friendly", "Private label ranges for regional distributors building their own brand."],
      ["Fuller, planned loads", "Wipes and liquids planned together so each shipment carries more of your range."],
      ["Value and premium", "From value packs for general trade to premium ranges for modern trade."],
      ["Growing with you", "Start with a focused range and add products as your distribution grows."]
    ],
    sections: [
      { h2: "Building a regional baby care brand", html: "<p>Regional distributors often know their market better than national brands do. A private label range — wipes plus two or three liquids — lets you build margin and loyalty under your own name.</p>" },
      { h2: "How supply works", html: "<p>" + SERVE_CTA + " We'll agree pack formats and carton configurations that suit your channel and your transport.</p>" }
    ],
    faqs: [
      ["Do you supply distributors in the North-East?", "Yes. Share your hub locations and volumes and we'll plan dispatch."],
      ["Can I start with a small range?", "Yes. Many distributors start with wipes and one or two liquids, then expand."],
      ["Can you make value packs for general trade?", "Yes — we can tune fabric weight, counts and pack formats to hit your price point."]
    ],
    products: ["baby-wipes", "baby-shampoo-body-wash", "baby-laundry-detergent-cleansers"],
    posts: ["private-label-vs-contract-manufacturing", "private-label-moq-baby-products"]
  },

  // ---------- specialist ranges ----------
  {
    group: "products", slug: "water-wipes-manufacturer", nav: "Water Wipes",
    seoTitle: "Water Wipes Manufacturer | Private Label High-Purity Baby Wipes | Novel Tissues",
    description: "Private label water wipes manufacturer in India: very high purified-water content, minimal ingredients, fragrance-free — for newborn and sensitive-skin baby brands.",
    kicker: "Specialist range · Wipes",
    h1: "Private label <em>water wipes.</em>",
    lead: "Water wipes — wipes with a very high purified-water content and a minimal ingredient list — are one of the fastest-growing baby wipe formats. We make them under your brand for newborn and sensitive-skin positioning.",
    heroBg: "#E2E4EA",
    art: [{ type: "wipes", pal: 2, label: "Water Wipes" }, { type: "wipes", pal: 1, count: 60, label: "Water Wipes" }],
    facts: ["Very high water content", "Minimal ingredients", "Fragrance-free", "Your brand, your counts"],
    points: [
      ["Purified water base", "A short ingredient list built around purified water, with only what's needed to keep the wipe safe and stable."],
      ["Newborn positioning", "Fragrance-free and alcohol-free for the most sensitive skin."],
      ["Soft, strong substrate", "Choose spunlace blends, 100% viscose or plant-based fibres at the fabric weight you want."],
      ["Claims done properly", "Water-percentage and 'sensitive skin' claims are planned with the testing that supports them."]
    ],
    sections: [
      { h2: "What makes a water wipe", html: "<p>A water wipe keeps the lotion as simple as possible: mostly purified water, a gentle preservation system and very few other ingredients. Because there is so little else in the lotion, water quality, preservation and hygiene on the line matter even more — every batch is checked before release.</p>" },
      { h2: "Formats we make", html: "<ul><li>Family packs with flip-top lids</li><li>Travel and pocket packs</li><li>Multipacks for marketplaces</li><li>Hospital and maternity kit packs</li></ul>" }
    ],
    faqs: [
      ["Can you print a water percentage on the pack?", "We'll confirm the exact water content of your final formula, and plan the testing to support any percentage claim before artwork is final."],
      ["Are water wipes more expensive to make?", "The lotion is simpler, but water quality and preservation need extra care. Cost depends mostly on substrate, count and packaging — ask us for a quote."],
      ["Can I get samples?", "Yes — request a sample kit and choose baby wipes."]
    ],
    products: ["baby-wipes"],
    posts: ["baby-wipes-gsm-spunlace-guide", "choose-baby-wipes-manufacturer-india"]
  },
  {
    group: "products", slug: "plant-based-baby-wipes", nav: "Plant-Based Wipes",
    seoTitle: "Plant-Based & Bamboo Baby Wipes Manufacturer | Private Label | Novel Tissues",
    description: "Private label plant-based baby wipes: 100% viscose and bamboo-derived fibres, botanical lotions and claim-checked sustainability messaging.",
    kicker: "Specialist range · Wipes",
    h1: "Plant-based baby wipes, <em>made for your brand.</em>",
    lead: "Parents increasingly look for wipes made from plant-based fibres. We make private label wipes on 100% viscose and other plant-derived substrates, with botanical lotions — and we check every sustainability claim before it goes on your pack.",
    heroBg: "#E1E3DE",
    art: [{ type: "wipes", pal: 5, label: "Plant Wipes" }, { type: "wipes", pal: 0, count: 30, label: "Plant Wipes" }],
    facts: ["100% viscose options", "Bamboo-derived fibres on request", "Botanical lotions", "Claims checked"],
    points: [
      ["Plant-derived fibres", "100% viscose made from wood pulp, and bamboo-derived options subject to availability."],
      ["Botanical lotions", "Aloe vera, chamomile or your own extract blend."],
      ["Honest claims", "Words like 'plastic-free' or 'biodegradable' must match the exact substrate and its test data — we confirm before print."],
      ["Matching packaging", "Discuss recyclable or reduced-plastic pack options with our packaging team."]
    ],
    sections: [
      { h2: "Choosing a plant-based substrate", html: "<p>Viscose is a cellulose fibre made from wood pulp; 100% viscose wipes are soft and absorbent and contain no synthetic polymer fibres. Bamboo-derived viscose and other plant-based fibres support natural positioning, but availability and cost vary — sample early. Our <a href=\"../../blog/baby-wipes-gsm-spunlace-guide/\">guide to wipes fabric</a> explains the trade-offs.</p>" },
      { h2: "Getting the claims right", html: "<p>Sustainability claims attract scrutiny from parents and regulators alike. We'll tell you exactly what your chosen substrate and pack can support, so your messaging is both persuasive and defensible.</p>" }
    ],
    faqs: [
      ["Are 100% viscose wipes plastic-free?", "The substrate contains no synthetic polymer fibres, but the whole product and pack determine what you can claim. We review claims with you before artwork is final."],
      ["Do you make bamboo wipes?", "Bamboo-derived fibres are available on request, subject to supply. Ask for samples."],
      ["Are plant-based wipes softer?", "100% viscose wipes are typically very soft and absorbent. Compare samples in hand."]
    ],
    products: ["baby-wipes"],
    posts: ["baby-wipes-gsm-spunlace-guide", "start-baby-care-brand-india"]
  },
  {
    group: "products", slug: "hospital-maternity-wipes", nav: "Hospital & Maternity Wipes",
    seoTitle: "Hospital & Maternity Baby Wipes Manufacturer | Bulk Private Label | Novel Tissues",
    description: "Bulk baby wipes and baby care liquids for hospitals, maternity homes and new-mother kits — private label packs in the counts and formats institutions need.",
    kicker: "Specialist range · Institutions",
    h1: "Baby wipes for <em>hospitals &amp; maternity care.</em>",
    lead: "Hospitals, maternity homes and new-mother kit suppliers need dependable volumes of gentle wipes and baby care liquids in practical formats. We make them under your label or the hospital group's own brand.",
    heroBg: "#E6E1E0",
    art: [{ type: "wipes", pal: 2, count: 100 }, { type: "pump", pal: 1, label: "Baby Wash" }],
    facts: ["Bulk & ward packs", "Fragrance-free options", "New-mother kit products", "Planned, dependable supply"],
    points: [
      ["Ward-friendly packs", "Larger counts and practical lids for frequent use."],
      ["Gentle by default", "Fragrance-free and alcohol-free options for newborn care."],
      ["Kit-ready range", "Wipes, wash, lotion, oil and rash cream — everything in a new-mother kit from one supplier."],
      ["Dependable volumes", "Two wipes plants and a rolling forecast keep institutional supply steady."]
    ],
    sections: [
      { h2: "What institutions buy", html: "<p>Maternity wards and neonatal units typically use large volumes of baby wipes, plus gentle washes and creams. New-mother kits add travel packs of wipes, a small shampoo or wash, lotion and rash cream. We manufacture all of these in your branding.</p>" },
      { h2: "A note on medical products", html: "<p>Our baby wipes and liquids are personal care products. If you need sterile wipes or products with medical claims, tell us at the start — those follow different rules, and we'll advise what is and isn't possible.</p>" }
    ],
    faqs: [
      ["Do you supply hospitals directly?", "We supply hospital groups, maternity homes and the distributors and kit companies that serve them."],
      ["Can you make sterile wipes?", "Our standard wipes are personal care products, not sterile medical devices. Tell us your requirement and we'll advise."],
      ["Can you make products for new-mother kits?", "Yes — travel packs of wipes and small sizes of wash, lotion, oil and rash cream."]
    ],
    products: ["baby-wipes", "baby-lotion-cream-oil"],
    posts: ["choose-baby-wipes-manufacturer-india", "private-label-moq-baby-products"]
  },
  {
    group: "products", slug: "sulphate-free-baby-shampoo", nav: "Sulphate-Free Shampoo",
    seoTitle: "Sulphate-Free Baby Shampoo Manufacturer | Private Label | Novel Tissues",
    description: "Private label sulphate-free and tear-free baby shampoo manufacturer in Pondicherry, India — mild surfactant systems, near-neutral pH, free-from options and pump, flip-cap or refill packs.",
    kicker: "Specialist range · Bath & hair",
    h1: "Sulphate-free baby shampoo, <em>under your brand.</em>",
    lead: "Sulphate-free baby shampoos built on mild amphoteric and non-ionic surfactants, formulated near neutral pH and made at our Pondicherry liquids campus — with tear-free positioning available when backed by testing.",
    heroBg: "#E3DCDC",
    art: [{ type: "pump", pal: 0, label: "Sulphate-free Shampoo" }, { type: "flip", pal: 5, label: "Baby Shampoo" }],
    facts: ["No SLS / SLES", "Mild, near-neutral pH", "Tear-free options", "Pump, flip-cap & refills"],
    points: [
      ["Mild cleansing system", "Amphoteric and non-ionic surfactants such as betaines and glucosides."],
      ["Free-from options", "Leave out sulphates, parabens, dyes, mineral oil or fragrance."],
      ["Foam that parents like", "We balance mildness with foam, viscosity and rinse."],
      ["Claims with evidence", "Tear-free and sulphate-free claims planned with appropriate testing."]
    ],
    sections: [
      { h2: "Sulphate-free vs tear-free", html: "<p>They are different claims. Sulphate-free means the formula contains no sulphate surfactants such as SLS or SLES. Tear-free depends on the whole surfactant system, the pH and testing of the final formula. Our <a href=\"../../blog/tear-free-baby-shampoo-formulation/\">tear-free formulation guide</a> explains the details.</p>" },
      { h2: "Range ideas", html: "<ul><li>Sulphate-free baby shampoo</li><li>Head-to-toe wash</li><li>2-in-1 shampoo &amp; conditioner for toddlers</li><li>Refill pouches for repeat buyers</li></ul>" }
    ],
    faqs: [
      ["Does sulphate-free shampoo foam?", "Yes, though usually a little less than sulphate-based formulas. We tune the system so it still feels satisfying in use."],
      ["Can you add my fragrance?", "Yes — or offer a fragrance-free variant for newborns."],
      ["Where is it made?", "At our Pondicherry liquids campus, alongside your lotions, creams and detergents."]
    ],
    products: ["baby-shampoo-body-wash"],
    posts: ["tear-free-baby-shampoo-formulation", "private-label-vs-contract-manufacturing"]
  },
  {
    group: "products", slug: "baby-care-gift-kits", nav: "Baby Care Kits",
    seoTitle: "Private Label Baby Care Gift Kits & Combos | Wipes, Shampoo, Lotion | Novel Tissues",
    description: "Private label baby care kits and combo packs: wipes, shampoo, wash, lotion, oil and rash cream from one manufacturer — for gifting, marketplaces and new-mother kits.",
    kicker: "Specialist range · Kits & combos",
    h1: "Baby care kits, <em>every product from one maker.</em>",
    lead: "Gift kits and combo packs sell well on marketplaces and as new-baby gifts — but sourcing each product from a different supplier is slow and inconsistent. We make every product in a typical baby care kit, in matching branding.",
    heroBg: "#EDE7E7",
    art: [{ type: "wipes", pal: 0, count: 30 }, { type: "pump", pal: 0 }, { type: "flip", pal: 0 }, { type: "tube", pal: 0 }],
    facts: ["Wipes + liquids together", "Matching branding", "Gifting & marketplace combos", "New-mother kits"],
    points: [
      ["One maker, one look", "Wipes, shampoo, wash, lotion, oil and rash cream with matching design and quality."],
      ["Travel & trial sizes", "Small sizes that fit gift boxes and hospital kits."],
      ["Combo-friendly", "Combinations planned for marketplace listings and seasonal gifting."],
      ["Ask about kitting", "Tell us your kit and box format and we'll discuss assembly options."]
    ],
    sections: [
      { h2: "Popular kit combinations", html: "<ul><li><strong>Bath time:</strong> shampoo or head-to-toe wash + lotion + wipes</li><li><strong>Newborn essentials:</strong> water wipes + gentle wash + massage oil + rash cream</li><li><strong>Travel kit:</strong> pocket wipes + travel-size wash and lotion</li><li><strong>Laundry starter:</strong> baby detergent + fabric conditioner + bottle cleanser</li></ul>" },
      { h2: "Why one manufacturer matters for kits", html: "<p>A kit is only as good as its weakest product. Making every item with one partner keeps colours, fragrance families and quality consistent — and means one schedule instead of four.</p>" }
    ],
    faqs: [
      ["Can you assemble the gift box?", "Tell us your kit and box format and we'll discuss kitting and assembly options."],
      ["Can kit products use smaller sizes?", "Yes — travel and trial sizes are common in kits."],
      ["Can I sell the kit items separately too?", "Yes. Many brands sell each product on its own and in kits."]
    ],
    products: ["baby-wipes", "baby-shampoo-body-wash", "baby-lotion-cream-oil"],
    posts: ["start-baby-care-brand-india", "packaging-guide-baby-wipes-cosmetics"]
  },

  // ---------- export ----------
  {
    group: "export", slug: "uae-gcc", nav: "UAE & GCC",
    seoTitle: "Private Label Baby Wipes & Baby Care for UAE & GCC Importers | Novel Tissues",
    description: "Private label baby wipes, baby shampoo, lotion and detergent from India for importers and brands in the UAE, Saudi Arabia, Oman, Qatar, Kuwait and Bahrain.",
    kicker: "Export · Middle East",
    h1: "Baby care from India <em>for the UAE &amp; GCC.</em>",
    lead: "We manufacture private label baby wipes, cosmetics and laundry liquids for importers, distributors and brands across the UAE, Saudi Arabia, Oman, Qatar, Kuwait and Bahrain — shipped from southern Indian ports close to our plants.",
    heroBg: "#E9E4DF",
    art: [{ type: "wipes", pal: 3 }, { type: "pump", pal: 3 }, { type: "jar", pal: 0 }],
    facts: ["Close to southern ports", "Full baby care range", "Labelling planned for your market", "Your brand, your specs"],
    points: [
      ["Short route from India", "Our South India plant and Pondicherry campus are a short haul from southern ports."],
      ["Labels for your market", "GCC markets often require Arabic on labels — we plan artwork and label content with you."],
      ["Documents your importer needs", "We prepare the manufacturing documents your importer requests for registration and clearance."],
      ["One container, full range", "Wipes, cosmetics and detergents planned together."]
    ],
    sections: [
      { h2: "What GCC buyers make with us", html: "<p>Baby wipes in family and travel packs, tear-free shampoos and washes, lotions, creams, oils and baby laundry detergents — under your brand or your retail chain's own label.</p>" },
      { h2: "Registration and compliance", html: "<p>Each GCC country has its own product registration and labelling requirements, usually handled by the importer of record. Tell us your destination early: we'll plan formulation, label content and the manufacturing documents your importer needs to register your products.</p>" }
    ],
    faqs: [
      ["Do you export to the UAE and Saudi Arabia?", "Yes. Tell us your destination country, importer and volumes and we'll plan with you."],
      ["Can labels be in Arabic?", "Yes — we plan bilingual artwork and label content with you for your market."],
      ["Who registers the products?", "Usually your importer of record. We provide the manufacturing documents they request."]
    ],
    products: ["baby-wipes", "baby-shampoo-body-wash", "baby-lotion-cream-oil", "baby-laundry-detergent-cleansers"],
    posts: ["export-baby-care-products-india", "private-label-moq-baby-products"]
  },
  {
    group: "export", slug: "africa", nav: "Africa",
    seoTitle: "Baby Wipes & Baby Care Private Label Manufacturer for Africa | Novel Tissues",
    description: "Private label baby wipes and baby care products from India for importers and distributors in Kenya, Nigeria, Tanzania, South Africa and across Africa.",
    kicker: "Export · Africa",
    h1: "Private label baby care <em>for African markets.</em>",
    lead: "Distributors and brands across East, West and Southern Africa build baby care ranges with Indian manufacturers. We make private label wipes, cosmetics and laundry liquids at the price points and pack formats your markets need.",
    heroBg: "#E9E4DF",
    art: [{ type: "wipes", pal: 3, count: 80 }, { type: "detergent", pal: 3 }],
    facts: ["Value to premium ranges", "Shipped from southern ports", "Pack formats for your channel", "Full baby care range"],
    points: [
      ["Price points that work", "Tune fabric weight, counts and pack formats to hit value or premium price points."],
      ["Built for distributors", "Private label ranges for importers building their own brand."],
      ["Full container planning", "Combine wipes, cosmetics and detergents to fill containers efficiently."],
      ["Market requirements first", "Tell us your country early so labels and documents are planned."]
    ],
    sections: [
      { h2: "Ranges for African distributors", html: "<p>Most distributors start with baby wipes in a value and a premium variant, plus a baby jelly or cream and a baby lotion — then add shampoo, oil and laundry detergent.</p>" },
      { h2: "Registration and documents", html: "<p>Requirements vary by country and are usually handled by the importer. We plan label content and provide the manufacturing documents your importer requests.</p>" }
    ],
    faqs: [
      ["Which African countries do you supply?", "Tell us your destination and volumes — we'll confirm what's needed for that market."],
      ["Can you make value-priced wipes?", "Yes — fabric weight, count and pack format let us build to your target price."],
      ["Can I mix products in one container?", "Yes, we plan mixed loads across wipes, cosmetics and detergents."]
    ],
    products: ["baby-wipes", "baby-lotion-cream-oil", "baby-laundry-detergent-cleansers"],
    posts: ["export-baby-care-products-india", "private-label-vs-contract-manufacturing"]
  },
  {
    group: "export", slug: "southeast-asia", nav: "Southeast Asia",
    seoTitle: "Private Label Baby Care Manufacturer for Southeast Asia | Wipes & Cosmetics | Novel Tissues",
    description: "Private label baby wipes, baby shampoo, lotion and detergent from India for brands and distributors in Malaysia, Singapore, Indonesia, Vietnam, Thailand and the Philippines.",
    kicker: "Export · Southeast Asia",
    h1: "Baby care from India <em>for Southeast Asia.</em>",
    lead: "For brands and distributors in Malaysia, Singapore, Indonesia, Vietnam, Thailand and the Philippines, we manufacture private label baby wipes, cosmetics and laundry liquids — shipped from southern India.",
    heroBg: "#E4E6EB",
    art: [{ type: "wipes", pal: 1 }, { type: "flip", pal: 1 }, { type: "tube", pal: 2 }],
    facts: ["Shipped from southern ports", "Full baby care range", "Market labelling planned", "Pilot to container volumes"],
    points: [
      ["Close to the sea route", "Our southern plants are a short haul from ports serving Southeast Asia."],
      ["Formulas for your market", "Tell us your market's ingredient rules early and we'll plan formulation around them."],
      ["Labels in your languages", "Artwork and label content planned with you."],
      ["Scale with you", "Start with a pilot shipment, then grow to regular containers."]
    ],
    sections: [
      { h2: "What we make for Southeast Asian buyers", html: "<p>Baby wipes, tear-free shampoos and washes, lotions, creams, massage oils and baby laundry detergents — under your brand or your retailer's label.</p>" },
      { h2: "Registration and documents", html: "<p>Many Southeast Asian markets require cosmetic product notification before sale, usually by the local importer or brand owner. We plan formulation and labels with you and provide the manufacturing documents needed.</p>" }
    ],
    faqs: [
      ["Do you supply Malaysia and Indonesia?", "Tell us your destination, importer and volumes and we'll plan with you."],
      ["Can you follow my market's ingredient rules?", "Yes — share them at the start and we'll formulate around them."],
      ["Can I start with a pilot shipment?", "Yes. Many export partners start small and scale up."]
    ],
    products: ["baby-wipes", "baby-shampoo-body-wash", "baby-lotion-cream-oil"],
    posts: ["export-baby-care-products-india", "start-baby-care-brand-india"]
  }
];

export const GROUPS = {
  locations: { title: "Locations we serve", path: "locations/", h1: "Baby care manufacturing <em>for every region of India.</em>",
    lead: "Wipes plants in North and South India and an 8-line liquids campus in Pondicherry let us plan supply for brands and distributors across the country.",
    seoTitle: "Private Label Baby Care Manufacturer Across India | Regions We Serve | Novel Tissues",
    description: "Private label baby wipes and baby care manufacturing for brands in South, North, West and East India — two wipes plants and a Pondicherry liquids campus." },
  export: { title: "Export markets", path: "export/", h1: "Private label baby care <em>for export.</em>",
    lead: "We manufacture private label baby wipes, cosmetics and laundry liquids for importers, distributors and brands outside India — shipped from southern ports close to our plants.",
    seoTitle: "Export Private Label Baby Care from India | UAE, Africa, Southeast Asia | Novel Tissues",
    description: "Private label baby wipes, baby shampoo, lotion and detergent from India for importers in the UAE & GCC, Africa and Southeast Asia." }
};

/* ----------------------------------------------------------
   About page
   ---------------------------------------------------------- */
export const ABOUT = {
  seoTitle: "About Novel Tissues | Private Label Baby Care Manufacturer in India",
  description: "Novel Tissues manufactures private label baby wipes, baby cosmetics and baby laundry liquids: two wipes plants in North and South India, an 8-line liquids campus in Pondicherry and 5,00,000 sq.ft of manufacturing.",
  h1: "We make baby care <em>for the brands parents trust.</em>",
  lead: "Novel Tissues is a private label manufacturer of complete baby care ranges — wipes, shampoos, lotions, creams, oils, laundry detergents and cleansers — for brands, retailers, pharmacy chains, distributors and exporters."
};

/* ----------------------------------------------------------
   More blog posts
   ---------------------------------------------------------- */
export const MORE_POSTS = [
  {
    slug: "private-label-moq-baby-products",
    title: "MOQ for Private Label Baby Products: How Minimum Order Quantities Really Work",
    seoTitle: "Private Label MOQ for Baby Wipes & Cosmetics Explained | Novel Tissues",
    description: "What drives minimum order quantities for private label baby wipes, shampoos and lotions — packaging, batch sizes, printing — and how to plan a first run you can sell.",
    category: "Manufacturing basics",
    date: PUBLISHED,
    art: { type: "wipes", pal: 4, size: "wide" },
    bg: "#E4E1E6",
    excerpt: "MOQs aren't arbitrary. Here's what sets them, and how to plan a first production run that fits your launch.",
    product: "baby-wipes",
    body: `
<p>"What's your MOQ?" is usually the first question a new brand asks a manufacturer. The honest answer is "it depends" — but it depends on a few specific things you can plan around.</p>

<h2>What sets an MOQ</h2>
<h3>Printed packaging</h3>
<p>For baby wipes, the biggest driver is printed flow-wrap film. Film is printed in rolls, and printing has set-up costs, so a print run has a practical minimum. Printed labels, cartons and tubes work the same way for cosmetics.</p>
<h3>Batch sizes</h3>
<p>Liquids are made in batches in mixing vessels. Very small batches are inefficient and harder to control, so each product has a sensible minimum batch.</p>
<h3>Components</h3>
<p>Stock bottles, caps and lids are easier to buy in small quantities than custom moulds, which need large orders to justify the tooling.</p>

<!--CTA-->

<h2>How to lower your first-run MOQ</h2>
<ul>
  <li><strong>Use stock components</strong> for your first launch; move to custom bottles once you've proven demand.</li>
  <li><strong>Limit SKUs.</strong> One hero product with two variants is easier to make in viable quantities than six products at once.</li>
  <li><strong>Share a base.</strong> Two fragrance variants of the same base can sometimes share a batch plan.</li>
  <li><strong>Plan packaging for growth.</strong> Labels or sleeves can be cheaper to change than printed bottles.</li>
</ul>

<h2>Plan the second order before the first ships</h2>
<p>Most launch problems aren't about the first MOQ — they're about the stock-out that follows a successful launch. Agree a reorder process and share a rolling forecast with your manufacturer from day one.</p>

<h2>What to send for an MOQ quote</h2>
<ol>
  <li>The products and pack sizes you want</li>
  <li>Stock or custom packaging</li>
  <li>Expected monthly volume after launch</li>
  <li>Your target launch date</li>
</ol>
<p>With that, a manufacturer can propose the smallest practical first run — and a path to scale from there.</p>`
  },
  {
    slug: "packaging-guide-baby-wipes-cosmetics",
    title: "Choosing Packaging for Baby Wipes and Baby Cosmetics",
    seoTitle: "Packaging Guide for Private Label Baby Wipes & Baby Cosmetics | Novel Tissues",
    description: "Flip-top lids or sticker labels, pumps or flip-caps, tubes or jars — how to choose packaging for private label baby wipes, shampoos, lotions and creams.",
    category: "Packaging",
    date: PUBLISHED,
    art: { type: "flip", pal: 3 },
    bg: "#E9E4DF",
    excerpt: "Your pack is your brand on the shelf. Here's how to pick formats that look right, work for parents and keep costs sensible.",
    product: "baby-lotion-cream-oil",
    body: `
<p>Packaging does three jobs at once: it protects the product, it makes it easy for a tired parent to use, and it sells your brand. Here's how to choose formats for a baby care range.</p>

<h2>Baby wipes</h2>
<h3>Flip-top lid or sticker label?</h3>
<p>A rigid <strong>flip-top lid</strong> re-seals well and feels premium — common on 72–100 count packs. A <strong>re-sealable sticker label</strong> is lighter and lower cost, and works well for travel packs of 20–30 wipes.</p>
<h3>Counts</h3>
<p>Offer one family count (72 or 80 is common), one travel size, and a multipack for marketplaces.</p>

<h2>Shampoos and washes</h2>
<p><strong>Pump bottles</strong> allow one-handed dispensing during bath time. <strong>Flip-cap bottles</strong> are lower cost and travel well. Add <strong>refill pouches</strong> once you have repeat buyers.</p>

<!--CTA-->

<h2>Lotions, creams and oils</h2>
<ul>
  <li><strong>Tubes</strong> are hygienic and portable — good for rash creams and face creams.</li>
  <li><strong>Jars</strong> suit rich creams and balms, and feel generous.</li>
  <li><strong>Flip-cap or pump bottles</strong> suit lotions and massage oils.</li>
</ul>

<h2>Practical checks before you commit</h2>
<ol>
  <li><strong>Compatibility:</strong> the formula and pack must be stability-tested together.</li>
  <li><strong>Line fit:</strong> make sure the bottle and closure run on the filling line.</li>
  <li><strong>Label space:</strong> leave room for mandatory information, not just design.</li>
  <li><strong>Shipping:</strong> check how packs travel in shipper cartons and marketplace fulfilment.</li>
</ol>
<p>Start with stock components for speed and lower minimums, then invest in custom shapes once your range is proven.</p>`
  },
  {
    slug: "export-baby-care-products-india",
    title: "Exporting Baby Care Products from India: A Starter Guide for Brands and Importers",
    seoTitle: "Exporting Private Label Baby Care Products from India | Starter Guide | Novel Tissues",
    description: "How brands and importers source private label baby wipes and baby cosmetics from India for export — markets, registration, labelling, documents and shipping.",
    category: "Export",
    date: PUBLISHED,
    art: { type: "detergent", pal: 3, size: "wide" },
    bg: "#E9E4DF",
    excerpt: "Sourcing baby care from India for another market? Plan registration, labels and documents early — here's the checklist.",
    product: "baby-wipes",
    body: `
<p>India has become a major sourcing base for private label personal care, including baby wipes and baby cosmetics. If you're an importer or a brand planning to sell in another country, the product is only half the job — registration, labelling and documents decide how fast you can sell.</p>

<h2>Start with your destination market</h2>
<p>Every country has its own rules for cosmetics and personal care. Some require product registration or notification before sale; many have their own labelling rules and permitted-ingredient lists. Share your destination with your manufacturer before formulation is final.</p>

<h2>Who does what</h2>
<ul>
  <li><strong>Importer or brand owner:</strong> usually responsible for registration in the destination market.</li>
  <li><strong>Manufacturer:</strong> provides the manufacturing documents the importer needs, makes the product to the agreed specification and labels it as agreed.</li>
</ul>

<!--CTA-->

<h2>Labelling</h2>
<p>Expect to need label content in the local language (for example Arabic in GCC markets), an ingredient list in the required format, and importer details. Plan label space for this from the start.</p>

<h2>Shipping</h2>
<p>Plan full or mixed containers early. Combining wipes, cosmetics and detergents from one manufacturer makes it easier to fill containers efficiently and keeps one schedule for the whole range.</p>

<h2>Export checklist</h2>
<ol>
  <li>Confirm destination-market rules with your importer or regulatory adviser</li>
  <li>Agree formulation and claims that fit those rules</li>
  <li>Plan bilingual or local-language artwork</li>
  <li>List the documents your importer needs</li>
  <li>Agree packaging and carton configuration for sea freight</li>
  <li>Plan a pilot shipment, then a regular schedule</li>
</ol>`
  }
];
