// Content for the generated pages (product categories, blog, home FAQ).
// Edit the copy here, then run `npm run build:site`.

export const PUBLISHED = "2026-10-29";

/* ----------------------------------------------------------
   Home page FAQ (also emitted as FAQPage structured data)
   ---------------------------------------------------------- */
export const HOME_FAQ = [
  ["What is your minimum order quantity (MOQ)?", "MOQs depend on the product, pack format and how much of the packaging is custom. Share your expected volumes and we'll propose the lowest viable first run — and a path to scale from there."],
  ["Can I launch wipes and liquids together?", "Yes — that's what makes us different. Wipes are made at our North and South India plants and all liquids at our Pondicherry campus, under one contract and one quality standard, so your full range launches together."],
  ["Can you use my own formula?", "Absolutely. We can manufacture to your formula under NDA, or you can start from our baby-safe bases and customise fragrance, actives, texture and claims."],
  ["Do you help with packaging and artwork?", "We guide you on pack formats, sizes and components, and check your artwork against label requirements before print. Request a sample kit to see our standard pack formats in hand."],
  ["Which wipes formats can you make?", "Baby wet wipes in counts from travel packs of 10 up to 100+, with a choice of substrate, fabric weight (GSM), lotion and lid. Hand & face wipes and fragrance-free sensitive variants are available too."],
  ["What baby liquids do you manufacture?", "Baby shampoo, head-to-toe wash, body wash, bubble bath, lotion, cream, massage oil, hair oil, rash cream, baby laundry detergent, fabric conditioner, bottle & nipple cleanser and toy & surface cleanser — across eight lines in Pondicherry."],
  ["Can I get samples before committing?", "Yes. Request a sample kit from this site and we'll share the relevant wipes and bases so you can feel the difference before you finalise specs."],
  ["Do you supply for export?", "Yes. Tell us your destination market and we'll discuss the formulation, labelling and documentation it needs."]
];

/* ----------------------------------------------------------
   Product category pages
   ---------------------------------------------------------- */
export const CATEGORIES = [
  {
    slug: "baby-wipes",
    nav: "Baby Wipes",
    seoTitle: "Private Label Baby Wipes Manufacturer in India | Novel Tissues",
    description: "Private label and contract manufacturer of baby wet wipes in India. 9 machines, 1.5 crore+ wipes a month from North & South India plants. Custom GSM, lotion, count and packaging.",
    kicker: "Baby wipes manufacturing",
    h1: "Private label baby wipes, made at <em>crore scale.</em>",
    lead: "Novel Tissues manufactures baby wet wipes for brands, retailers and distributors across India and overseas. Nine dedicated wipes machines across our North and South India plants produce more than 1.5 crore wipes every month — so you can start with a trial run and grow to national distribution without changing manufacturers.",
    heroBg: "#D7E8FA",
    art: [{ type: "wipes", pal: 2, size: "wide" }, { type: "wipes", pal: 0, size: "wide", count: 30 }],
    facts: ["9 wipes machines", "1.5 Cr+ wipes / month", "North & South India plants", "10 to 100+ count packs"],
    products: [
      ["Baby Wet Wipes", "Our everyday wipe: soft spunlace, a gentle cleansing lotion and an interleaved fold that dispenses one sheet at a time.", ["72s", "80s", "100s"]],
      ["Water-Based Wipes", "Minimal-ingredient wipes with a very high purified-water content, positioned for newborns and sensitive skin.", ["High water %", "Fragrance-free"]],
      ["Botanical Wipes", "Aloe vera, chamomile or your own extract blend for a signature feel and scent.", ["Aloe", "Chamomile", "Custom extract"]],
      ["Travel & Pocket Packs", "Compact packs for diaper bags, cars, sampling and hospital kits.", ["10s", "20s", "30s"]],
      ["Hand & Face Wipes", "Mealtime and playtime wipes made for little hands and faces.", ["Mild", "Fragrance-free"]],
      ["Multipacks & Bulk Packs", "Value multipacks for marketplaces and modern trade, bulk packs for hospitals and maternity kits.", ["3-pack", "6-pack", "Institutional"]]
    ],
    specs: [
      ["Substrate", "Spunlace nonwoven — viscose/polyester blends, 100% viscose, or plant-based fibre options"],
      ["Fabric weight", "Typically 40–60 GSM; lighter or heavier on request"],
      ["Sheet size", "Standard baby-wipe sizes, or a custom size to suit your pack and positioning"],
      ["Fold", "Interleaved fold for one-at-a-time pop-up dispensing"],
      ["Count per pack", "From 10-count pocket packs to 100+ count family packs"],
      ["Lotion", "Purified-water base with mild cleansers, humectants and botanical extracts; fragrance-free and custom options"],
      ["Closure", "Flip-top plastic lid or re-sealable sticker label"],
      ["Packaging", "Printed flow-wrap in your artwork; multipacks, shrink bundles and shipper cartons"],
      ["Capacity", "1.5 crore+ wipes per month across 9 machines"],
      ["Manufactured at", "Our North India and South India wipes plants"]
    ],
    custom: [
      ["Your fabric, your feel", "Choose substrate and GSM. We sample options side by side so you can feel softness, thickness and strength before you decide."],
      ["Signature lotion", "Set the water content, extracts, fragrance and free-from profile that matches your brand promise."],
      ["Pack architecture", "Counts, lid type, multipacks and shipper configuration planned around your channels — marketplace, modern trade or pharmacy."],
      ["Artwork & print", "Your brand printed on flow-wrap. We check proofs against pack dimensions and label requirements before print."],
      ["Claims, planned early", "Every on-pack claim is planned with the testing needed to support it, before artwork is final."],
      ["Regional dispatch", "Ship from the plant closest to your warehouses — North or South — for shorter lead times and lower freight."]
    ],
    packsTitle: "Wipes pack formats",
    packs: [
      { type: "wipes", pal: 2, count: 72, name: "Flip-top family pack", text: "Rigid re-closable lid that keeps wipes moist to the last sheet. Popular for 72–100 count packs." },
      { type: "wipes", pal: 1, count: 30, name: "Sticker-lid travel pack", text: "Light, re-sealable label lid — ideal for 20–30 count packs." },
      { type: "wipes", pal: 0, count: 10, name: "Pocket pack", text: "10-count packs for diaper bags, sampling, gifting and hospital kits." },
      { type: "wipes", pal: 4, count: "3×", name: "Multipacks & bundles", text: "3-, 6- or 12-pack bundles for marketplaces and modern trade." }
    ],
    basesTitle: "Lotion starting points",
    bases: [
      ["Pure water", "High purified-water content with a minimal ingredient list. Fragrance-free."],
      ["Aloe soothe", "Aloe vera with mild humectants for everyday diaper changes."],
      ["Chamomile calm", "Chamomile extract and a soft, light scent profile."],
      ["Sensitive", "Fragrance-free, dye-free and alcohol-free for delicate skin."],
      ["Moisture plus", "Added humectants for a softer, more moisturising after-feel."],
      ["Your formula", "Manufactured to your specification under NDA."]
    ],
    made: {
      title: "Made in North & South India",
      text: "Our wipes run on nine machines split across two plants. That gives your brand regional supply — wipes made close to your warehouses — and a second plant ready if demand spikes.",
      bullets: ["Same specifications and QC at both plants", "Dispatch from the plant nearest your market", "Close to southern ports for export orders"]
    },
    faqs: [
      ["What GSM is best for baby wipes?", "Most everyday baby wipes sit in the middle of the 40–60 GSM range. Lighter fabrics keep costs down; heavier fabrics feel thicker and more premium. We'll sample two or three weights so you can compare them in hand."],
      ["Can you make plant-based or plastic-free wipes?", "We offer plant-based substrates such as 100% viscose. Any 'plastic-free' or 'biodegradable' claim must match the exact substrate and its test data, so we confirm the claim before it goes on pack."],
      ["What is the MOQ for private label baby wipes?", "It depends mainly on printed packaging — flow-wrap film is printed in rolls. Share your expected monthly volume and we'll propose the smallest practical first run."],
      ["How do you keep wipes fresh until the last sheet?", "Lotion formulation, preservation, seal integrity and lid choice all matter. Each variant's shelf life is established through stability testing on the final pack."],
      ["Can you supply both North and South India?", "Yes. With plants in both regions, we can dispatch from whichever is closest to your distribution hubs."],
      ["Do you make baby wipes for export?", "Yes. Tell us your destination market early so formulation, labelling and documentation are planned for it."]
    ],
    related: ["choose-baby-wipes-manufacturer-india", "baby-wipes-gsm-spunlace-guide", "start-baby-care-brand-india"]
  },
  {
    slug: "baby-shampoo-body-wash",
    nav: "Shampoo & Wash",
    seoTitle: "Baby Shampoo & Body Wash Manufacturer | Private Label | Novel Tissues",
    description: "Private label baby shampoo, head-to-toe wash, body wash and bubble bath manufacturer in Pondicherry, India. Tear-free and sulphate-free options, pump, flip-cap and refill packs.",
    kicker: "Bath & hair care manufacturing",
    h1: "Tear-free baby shampoo &amp; wash, <em>under your brand.</em>",
    lead: "At our Pondicherry liquids campus — one of the largest cosmetics plants in the region, with eight manufacturing lines — we formulate, fill and pack baby shampoos, head-to-toe washes, body washes, bubble baths and hair oils for private label brands.",
    heroBg: "#FBD3C3",
    art: [{ type: "flip", pal: 5 }, { type: "pump", pal: 0 }, { type: "pump", pal: 4 }],
    facts: ["8 liquid lines in Pondicherry", "Tear-free & sulphate-free options", "Pump, flip-cap & refill packs", "Your formula or ours"],
    products: [
      ["Baby Shampoo", "Gentle cleansing for a delicate scalp, with tear-free formulation options.", ["100 ml", "200 ml", "500 ml"]],
      ["Head-to-Toe Wash", "One bottle for hair and body — the bath-time essential parents re-buy.", ["Pump", "Flip-cap"]],
      ["Baby Body Wash", "Soap-free, mild, pH-balanced cleansing for daily baths.", ["Clear gel", "Creamy"]],
      ["Bubble Bath", "Mild, playful foam that rinses clean.", ["Lightly scented", "Unscented"]],
      ["2-in-1 Shampoo & Conditioner", "Tangle-free hair for toddlers in one step.", ["200 ml", "400 ml"]],
      ["Baby Hair Oil", "Light, non-sticky oils for baby hair and scalp.", ["Coconut", "Almond", "Custom blend"]]
    ],
    specs: [
      ["Products", "Baby shampoo, head-to-toe wash, body wash, bubble bath, 2-in-1 shampoo & conditioner, hair oil"],
      ["Cleansing systems", "Mild amphoteric and non-ionic surfactant blends; sulphate-free options"],
      ["pH", "Mild, near-neutral pH targeted for each formula"],
      ["Free-from options", "Parabens, sulphates (SLS/SLES), dyes, mineral oil or fragrance — left out on request"],
      ["Fragrance", "Fragrance-free, light baby fragrances or your signature fragrance"],
      ["Actives", "Botanical extracts and conditioning agents to suit your positioning"],
      ["Pack sizes", "From travel sizes to family packs; other sizes on request"],
      ["Pack formats", "Pump bottles, flip-cap and disc-cap bottles, refill pouches"],
      ["Manufactured at", "Pondicherry liquids campus — 8 manufacturing lines"]
    ],
    custom: [
      ["Formula", "Start from our mild bases or bring your own formula under NDA."],
      ["Fragrance & feel", "Choose fragrance strength, foam profile, viscosity and after-feel."],
      ["Free-from profile", "Decide what to leave out to match your brand promise."],
      ["Claims", "Tear-free, sulphate-free and similar claims planned with the testing needed to support them."],
      ["Packaging", "Standard bottles and closures, or work with components you supply after line trials."],
      ["Range building", "Launch shampoo, wash, lotion and wipes together — one manufacturer, one timeline."]
    ],
    packsTitle: "Pack formats for bath & hair",
    packs: [
      { type: "pump", pal: 0, name: "Pump bottle", text: "The bath-time favourite for shampoos and washes — one-handed dispensing for parents." },
      { type: "flip", pal: 5, name: "Flip-cap bottle", text: "Everyday format for shampoos and washes at accessible price points." },
      { type: "pouch", pal: 1, name: "Refill pouch", text: "Lower plastic and lower cost — great for repeat buyers and subscriptions." },
      { type: "flip", pal: 3, name: "Travel sizes", text: "Small bottles for trial packs, gift sets and hospital kits.", label: "Travel Size" }
    ],
    basesTitle: "Formula starting points",
    bases: [
      ["Tear-free mild shampoo", "A gentle surfactant blend designed for tear-free positioning."],
      ["Head-to-toe 2-in-1", "One mild cleanser for hair and body."],
      ["Soap-free body wash", "Clear or creamy, pH-balanced daily wash."],
      ["Gentle bubble bath", "Generous foam from mild surfactants."],
      ["Light hair oil", "Fast-absorbing oil blends for baby hair."],
      ["Your formula", "Manufactured to your specification under NDA."]
    ],
    made: {
      title: "Made at our Pondicherry liquids campus",
      text: "All our liquids are made at one location with eight different manufacturing lines. Your shampoo can run alongside your lotion, cream and detergent — so a multi-SKU launch runs on one schedule.",
      bullets: ["Formulation, filling and packing in one place", "Batch-wise quality release", "Combined dispatch with your wipes"]
    },
    faqs: [
      ["What makes a baby shampoo tear-free?", "Mainly the choice of very mild surfactants and a near-neutral pH, plus testing to support the claim. Our guide to tear-free formulation explains it in detail."],
      ["Can you make sulphate-free baby shampoo?", "Yes. We offer sulphate-free cleansing systems built on mild amphoteric and non-ionic surfactants."],
      ["Can I use my own fragrance?", "Yes. We can work with your fragrance house's oil, or suggest light baby fragrances. For newborn positioning, many brands also offer a fragrance-free variant."],
      ["What is the MOQ for private label baby shampoo?", "It depends on batch size, pack size and whether components are stock or custom. Share your volumes and we'll recommend the smallest practical first batch."],
      ["Can you fill my own bottles?", "Often, yes — subject to compatibility trials on our filling lines. We can also recommend standard bottles and closures."],
      ["How is shelf life decided?", "Through stability and compatibility testing of your final formula in your final pack."]
    ],
    related: ["tear-free-baby-shampoo-formulation", "start-baby-care-brand-india", "private-label-vs-contract-manufacturing"]
  },
  {
    slug: "baby-lotion-cream-oil",
    nav: "Lotion, Cream & Oil",
    seoTitle: "Baby Lotion, Cream & Massage Oil Manufacturer | Private Label | Novel Tissues",
    description: "Private label manufacturer of baby lotion, baby cream, massage oil and diaper rash cream in Pondicherry, India. Free-from formulations, tubes, jars, pump and flip-cap bottles.",
    kicker: "Baby skin care manufacturing",
    h1: "Baby lotions, creams &amp; oils — <em>made for your brand.</em>",
    lead: "From light everyday lotions to rich barrier creams and massage oils, our Pondicherry campus formulates, fills and packs baby skin care for private label brands — with free-from options built around delicate baby skin.",
    heroBg: "#CDEFE3",
    art: [{ type: "flip", pal: 1 }, { type: "jar", pal: 3, size: "wide" }, { type: "tube", pal: 0 }],
    facts: ["Lotions to rich creams", "Free-from options", "Tubes, jars & bottles", "Made in Pondicherry"],
    products: [
      ["Baby Lotion", "Light, fast-absorbing daily moisture for face and body.", ["100 ml", "200 ml", "400 ml"]],
      ["Baby Cream", "Richer nourishment for dry patches and dry seasons.", ["Tube", "Jar"]],
      ["Massage Oil", "Smooth-glide oil blends for the daily massage ritual.", ["Almond", "Olive", "Coconut"]],
      ["Diaper Rash Cream", "Protective barrier cream for the diaper area.", ["Tube", "Jar"]],
      ["Winter / Cold Cream", "Extra-rich care for dry, cold weather.", ["Jar", "Tube"]],
      ["Baby Balms & Jelly", "Protective balms for lips, cheeks and dry patches.", ["Jar", "Stick"]]
    ],
    specs: [
      ["Products", "Baby lotion, baby cream, massage oil, diaper rash cream, cold cream, balms"],
      ["Textures", "Light lotions, rich creams, ointments, balms and oils"],
      ["Emulsions", "Oil-in-water lotions and creams tuned for absorption and after-feel"],
      ["Oils", "Almond, olive, coconut, sunflower and custom blends"],
      ["Free-from options", "Parabens, mineral oil, dyes or fragrance — left out on request"],
      ["Pack sizes", "Small travel sizes to large family packs; other sizes on request"],
      ["Pack formats", "Flip-cap and pump bottles, tubes, jars, oil bottles"],
      ["Manufactured at", "Pondicherry liquids campus — 8 manufacturing lines"]
    ],
    custom: [
      ["Texture & after-feel", "Light and quick-absorbing, or rich and cushiony — tuned to your positioning."],
      ["Oils & actives", "Choose carrier oils, butters and botanical extracts."],
      ["Free-from profile", "Decide what to leave out — and plan the testing behind each claim."],
      ["Fragrance", "Fragrance-free, light baby scents or your own fragrance."],
      ["Packaging", "Tubes, jars, pumps or flip-caps, matched across your range."],
      ["Gift sets & combos", "Lotion, oil and wash bundles for gifting and marketplaces."]
    ],
    packsTitle: "Pack formats for skin care",
    packs: [
      { type: "flip", pal: 1, name: "Flip-cap lotion bottle", text: "Everyday lotion format — easy one-handed use." },
      { type: "pump", pal: 4, name: "Pump bottle", text: "Family-size lotions and oils with clean dispensing.", label: "Baby Lotion" },
      { type: "tube", pal: 0, name: "Tube", text: "Hygienic format for creams and rash creams." },
      { type: "jar", pal: 3, name: "Jar", text: "Rich creams, balms and winter creams." }
    ],
    basesTitle: "Formula starting points",
    bases: [
      ["Daily light lotion", "Quick-absorbing oil-in-water lotion."],
      ["Rich nourishing cream", "Thicker cream for dry skin and dry seasons."],
      ["Barrier rash cream", "Zinc-oxide based barrier cream for the diaper area."],
      ["Massage oil blend", "Smooth-glide carrier oil blend, light or unscented."],
      ["Winter cream", "Richer emulsion with butters for cold weather."],
      ["Your formula", "Manufactured to your specification under NDA."]
    ],
    made: {
      title: "Made at our Pondicherry liquids campus",
      text: "Lotions, creams and oils are produced on dedicated equipment at the same campus as your shampoos and detergents, under one quality system.",
      bullets: ["Emulsions, oils and ointments under one roof", "Batch-wise quality release", "Range launches on one schedule"]
    },
    faqs: [
      ["Can you make a zinc oxide diaper rash cream?", "Yes, as a cosmetic barrier cream. Products making medicinal or treatment claims can fall under drug rules instead, so we review the positioning and claims with you before formulation is final."],
      ["Do you make Ayurvedic or herbal baby oils?", "We work with botanical oils and extracts. Positioning a product as Ayurvedic falls under separate AYUSH regulations, so tell us early if that's your plan."],
      ["Can lotions be fragrance-free?", "Yes. Many baby brands offer a fragrance-free variant for newborns and sensitive skin."],
      ["What is the MOQ for private label baby lotion?", "It depends on batch size and packaging. Tell us your volumes and we'll suggest the smallest practical first batch."],
      ["How do you decide shelf life?", "Through stability and compatibility testing of your final formula in your final pack."]
    ],
    related: ["start-baby-care-brand-india", "private-label-vs-contract-manufacturing", "tear-free-baby-shampoo-formulation"]
  },
  {
    slug: "baby-laundry-detergent-cleansers",
    nav: "Laundry & Cleaners",
    seoTitle: "Baby Laundry Detergent & Bottle Cleanser Manufacturer | Private Label | Novel Tissues",
    description: "Private label baby laundry detergent, fabric conditioner, bottle & nipple cleanser and toy & surface cleanser manufacturer in Pondicherry, India. Gentle, low-residue formulas.",
    kicker: "Baby laundry & cleaning manufacturing",
    h1: "Baby laundry &amp; cleaning liquids, <em>made beside your cosmetics.</em>",
    lead: "Parents look for gentler detergents and cleansers for everything that touches their baby. We manufacture baby laundry detergents, fabric conditioners, bottle & nipple cleansers and toy & surface cleansers at our Pondicherry campus — so your brand can cover the whole nursery.",
    heroBg: "#E4DCF8",
    art: [{ type: "detergent", pal: 4, size: "wide" }, { type: "pouch", pal: 1 }, { type: "pump", pal: 2, label: "Bottle Cleanser" }],
    facts: ["Gentle, low-residue formulas", "Dye-free & fragrance-free options", "Bottles, cans & refills", "Same campus as your cosmetics"],
    products: [
      ["Baby Laundry Detergent", "Gentle liquid detergent for baby clothes, cloth nappies and linen.", ["500 ml", "1 L", "2 L"]],
      ["Fabric Conditioner", "Softness for baby clothes, formulated with sensitive skin in mind.", ["500 ml", "1 L"]],
      ["Bottle & Nipple Cleanser", "Cleans milk residue from feeding bottles, nipples and pacifiers and rinses away cleanly.", ["Liquid", "Foam pump"]],
      ["Toy & Surface Cleanser", "For toys, high chairs and changing tables.", ["Spray", "Refill"]],
      ["Pre-wash Stain Remover", "Helps lift milk, food and nappy stains before the wash.", ["Spray", "Gel"]],
      ["Refill Pouches", "Economical refills that cut plastic and cost.", ["500 ml", "1 L"]]
    ],
    specs: [
      ["Products", "Baby laundry detergent, fabric conditioner, bottle & nipple cleanser, toy & surface cleanser, stain remover"],
      ["Detergent type", "Liquid detergents for hand wash and machine wash"],
      ["Formulation focus", "Gentle surfactants and low-residue rinsing"],
      ["Options", "Dye-free, fragrance-free, plant-derived surfactants, low-foam variants for front-loaders"],
      ["Pack sizes", "From 500 ml bottles to larger family sizes; refill pouches"],
      ["Pack formats", "Handled cans, flip-cap and pump bottles, trigger sprays, pouches"],
      ["Manufactured at", "Pondicherry liquids campus — 8 manufacturing lines"]
    ],
    custom: [
      ["Gentleness profile", "Choose surfactant systems, fragrance level and what to leave out."],
      ["Machine compatibility", "Low-foam variants for front-load machines."],
      ["Fragrance", "Fragrance-free or soft, clean baby scents."],
      ["Packaging", "Cans, bottles, sprays and refill pouches matched across your range."],
      ["Bundles", "Detergent + conditioner + bottle cleanser kits for new parents."],
      ["One order", "Ship laundry products with your wipes and cosmetics."]
    ],
    packsTitle: "Pack formats for laundry & cleaning",
    packs: [
      { type: "detergent", pal: 4, name: "Handled can", text: "Family-size detergent with an easy-pour handle." },
      { type: "pouch", pal: 1, name: "Refill pouch", text: "Refills for detergents and cleansers." },
      { type: "pump", pal: 2, name: "Pump / foam bottle", text: "Bottle & nipple cleansers with clean dispensing.", label: "Bottle Cleanser" },
      { type: "flip", pal: 5, name: "Flip-cap bottle", text: "Conditioners and liquid cleansers.", label: "Conditioner" }
    ],
    basesTitle: "Formula starting points",
    bases: [
      ["Gentle baby detergent", "Mild surfactant system with low-residue rinsing."],
      ["Sensitive detergent", "Fragrance-free and dye-free."],
      ["Softening conditioner", "Light softness for baby clothes."],
      ["Bottle & nipple cleanser", "Cuts milk fat and rinses away cleanly."],
      ["Toy & surface cleanser", "Everyday cleaning for nursery surfaces."],
      ["Your formula", "Manufactured to your specification under NDA."]
    ],
    made: {
      title: "Made at our Pondicherry liquids campus",
      text: "Laundry and cleaning liquids are made on the same campus as our baby cosmetics, so one partner covers your entire baby-care range.",
      bullets: ["One contract for cosmetics, wipes and laundry", "Batch-wise quality release", "Combined dispatch"]
    },
    faqs: [
      ["Why do babies need a different laundry detergent?", "Baby skin is thinner and more easily irritated, and clothes sit against it all day. Baby detergents typically use milder surfactants, rinse out cleanly and are often dye-free and fragrance-free."],
      ["Can you make low-foam detergent for front-load machines?", "Yes, we offer low-foam variants for front-load washing machines."],
      ["Can the detergent be fragrance-free?", "Yes. Many brands offer a fragrance-free variant alongside a lightly scented one."],
      ["How should bottle cleansers be used?", "They're designed to rinse away cleanly. Directions on your label should tell parents to rinse thoroughly with clean, safe water after washing."],
      ["Can I order detergent with my wipes and cosmetics?", "Yes — that's the point of working with us. One contract, one quality standard and combined dispatch."]
    ],
    related: ["baby-laundry-detergent-private-label", "start-baby-care-brand-india", "private-label-vs-contract-manufacturing"]
  }
];

/* ----------------------------------------------------------
   Blog posts. <!--CTA--> marks where the inline call-to-action goes.
   ---------------------------------------------------------- */
export const POSTS = [
  {
    slug: "start-baby-care-brand-india",
    title: "How to Start Your Own Baby Care Brand in India: A Private Label Guide",
    seoTitle: "How to Start a Baby Care Brand in India (Private Label Guide) | Novel Tissues",
    description: "A step-by-step guide to launching your own baby care brand in India with a private label manufacturer — positioning, range, samples, packaging, compliance, costing and launch.",
    category: "Brand building",
    date: PUBLISHED,
    art: { type: "pump", pal: 0 },
    bg: "#FBD3C3",
    excerpt: "From choosing your hero product to your first reorder — the practical path to launching a baby care brand without building a factory.",
    product: "baby-wipes",
    body: `
<p>India's baby care shelf has changed. Parents now compare ingredients, read reviews and buy from marketplaces, quick-commerce apps and D2C sites as readily as from the corner chemist. That shift has opened the door for new brands — and almost none of them own a factory. They work with a <strong>private label manufacturer</strong> that formulates, fills and packs products under the brand's name.</p>
<p>This guide walks through how to go from idea to first shipment.</p>

<h2>1. Decide who your brand is for</h2>
<p>"Baby care" is broad. Successful brands start narrow and clear:</p>
<ul>
  <li><strong>Positioning:</strong> natural and plant-based, dermatologist-led, newborn-sensitive, value-for-money, premium gifting?</li>
  <li><strong>Customer:</strong> first-time parents in metros, value-conscious families, hospitals and maternity homes, export markets?</li>
  <li><strong>Channel:</strong> your own website, marketplaces, quick-commerce, pharmacies, modern trade — each shapes pack sizes and pricing.</li>
</ul>
<p>Write your brand promise in one sentence. Every formula, fragrance and pack decision should support it.</p>

<h2>2. Build a focused launch range</h2>
<p>Most brands launch with a <strong>hero product plus two or three supporting SKUs</strong>. Baby wipes are a common hero: they are bought often, so they bring repeat customers. A typical starter range might be:</p>
<ul>
  <li>Baby wet wipes (for example a 72- or 80-count pack, plus a travel pack)</li>
  <li>A tear-free shampoo or head-to-toe wash</li>
  <li>A baby lotion or massage oil</li>
  <li>Optionally, a baby laundry detergent to own more of the nursery</li>
</ul>
<p>Working with a manufacturer that makes all of these saves you managing several suppliers, quality standards and delivery schedules.</p>

<h2>3. Choose the right manufacturing partner</h2>
<p>Look for a partner whose capacity comfortably exceeds your three-year plan, not just your first order. Ask about plants and machines, in-house formulation, quality control, pack formats, minimum order quantities and confidentiality. Our <a href="../choose-baby-wipes-manufacturer-india/">checklist for choosing a wipes manufacturer</a> lists the questions to ask.</p>

<!--CTA-->

<h2>4. Sample, compare and lock specifications</h2>
<p>Request samples of the bases and substrates that match your positioning. Compare them side by side: wipe thickness and moisture, shampoo foam and fragrance, lotion texture and absorption. Once you decide, the manufacturer turns your choices into a written specification — the reference every batch is checked against.</p>

<h2>5. Packaging and artwork</h2>
<p>Packaging is where your brand lives on the shelf. Decide formats (flip-top wipes lid or sticker, pump or flip-cap bottle, tube or jar), sizes and colours. Then brief your designer with the exact pack dimensions and label areas from your manufacturer.</p>
<p>Plan your on-pack claims early. Claims like "tear-free", "dermatologically tested" or "plant-based" need supporting evidence, and the testing behind them takes time.</p>

<h2>6. Understand compliance</h2>
<p>In India, cosmetics are regulated under the Drugs and Cosmetics Act, 1940 and the Cosmetics Rules, 2020. Packaged goods must also meet the Legal Metrology (Packaged Commodities) Rules — MRP, net quantity, manufacturer and marketer details, customer care contact and more. Your manufacturer's licences cover manufacturing. You remain responsible as the brand owner for your labels and claims, and for registering your trademark.</p>
<p>Requirements change and depend on the product, so confirm the current rules for your category with a regulatory consultant before you print.</p>

<h2>7. Cost your product properly</h2>
<p>Your landed cost per unit includes formulation, packaging components, printing, filling, testing, freight and warehousing. Then build up to MRP through your channel margins: marketplace commissions, distributor and retailer margins, returns, advertising and GST. Many first-time brands under-price because they leave out performance-marketing costs — model them from day one.</p>

<h2>8. Plan your first run and your second</h2>
<p>Minimum order quantities are usually driven by printed packaging (film rolls, labels, cartons) and batch sizes. Order enough to launch and learn, but agree a reorder process before you go live. A rolling three-month forecast shared with your manufacturer helps you avoid stock-outs, which can sink a marketplace listing's ranking.</p>

<h2>9. Launch, listen and expand</h2>
<p>Use your first months to read reviews and repeat-purchase data. Then add the next SKUs your customers ask for — often a fragrance-free variant, a value multipack or a gift set.</p>

<h2>The short version</h2>
<ol>
  <li>Define a clear positioning and channel.</li>
  <li>Launch a focused range around a hero product.</li>
  <li>Choose a manufacturer that can scale with you.</li>
  <li>Sample, decide and lock specifications.</li>
  <li>Design packaging and plan claims early.</li>
  <li>Get compliance right before you print.</li>
  <li>Cost every rupee, including marketing.</li>
  <li>Forecast reorders from day one.</li>
</ol>`
  },
  {
    slug: "private-label-vs-contract-manufacturing",
    title: "Private Label vs Contract Manufacturing vs White Label: What's the Difference?",
    seoTitle: "Private Label vs Contract Manufacturing vs White Label | Novel Tissues",
    description: "Private label, contract manufacturing and white label explained for baby care brands — who owns the formula, how much you can customise, MOQs, speed and cost.",
    category: "Manufacturing basics",
    date: PUBLISHED,
    art: { type: "flip", pal: 4 },
    bg: "#E4DCF8",
    excerpt: "Three terms that get mixed up all the time. Here's what each means for your formula, your brand and your budget.",
    product: "baby-shampoo-body-wash",
    body: `
<p>If you're planning a baby care brand you will hear three terms used — often interchangeably: <strong>white label</strong>, <strong>private label</strong> and <strong>contract manufacturing</strong>. They overlap, but the differences matter for how unique your product is, who owns the formula and how fast you can launch.</p>

<h2>White label: a ready product with your name on it</h2>
<p>The manufacturer has an existing product — formula, and often packaging too — and sells it to many brands, each with its own label. You choose from a catalogue and add your branding.</p>
<ul>
  <li><strong>Pros:</strong> fastest route to market, lowest development cost, often lower minimum quantities.</li>
  <li><strong>Cons:</strong> other brands may sell essentially the same product, so it is harder to stand out on ingredients.</li>
</ul>

<h2>Private label: proven bases, customised for you</h2>
<p>You start from the manufacturer's tested base formulas and customise them — fragrance, extracts, free-from profile, texture, pack format and design — to create a product sold only under your brand.</p>
<ul>
  <li><strong>Pros:</strong> a differentiated product without starting from zero; development risk is lower because the base is already proven.</li>
  <li><strong>Cons:</strong> takes longer than white label, and the underlying base usually remains the manufacturer's know-how.</li>
</ul>

<!--CTA-->

<h2>Contract manufacturing: your formula, their factory</h2>
<p>You bring the formula — developed by you or your formulator — and the manufacturer produces it to your specification under a confidentiality agreement.</p>
<ul>
  <li><strong>Pros:</strong> maximum control and ownership of the formula, so it's easier to move or dual-source later.</li>
  <li><strong>Cons:</strong> you carry the development cost and the responsibility for testing it.</li>
</ul>

<h2>Side-by-side comparison</h2>
<div class="table-wrap"><table>
  <thead><tr><th></th><th>White label</th><th>Private label</th><th>Contract manufacturing</th></tr></thead>
  <tbody>
    <tr><th>Formula</th><td>Manufacturer's, unchanged</td><td>Manufacturer's base, customised</td><td>Yours</td></tr>
    <tr><th>Uniqueness</th><td>Low</td><td>Medium–high</td><td>High</td></tr>
    <tr><th>Speed to launch</th><td>Fastest</td><td>Moderate</td><td>Slowest</td></tr>
    <tr><th>Development cost</th><td>Lowest</td><td>Moderate</td><td>Highest</td></tr>
    <tr><th>Best for</th><td>Testing a market quickly</td><td>Most new brands</td><td>Established brands with R&amp;D</td></tr>
  </tbody>
</table></div>

<h2>Which is right for a baby care brand?</h2>
<p>Most first-time baby brands do best with <strong>private label</strong>. Baby products face tough scrutiny from parents, so starting from bases with a track record lowers risk, while customisation lets you build a real point of difference.</p>
<p>As you grow, you can move hero products to your own proprietary formulas under contract manufacturing — ideally with the same partner, so specifications, quality systems and supply stay consistent.</p>

<h2>Questions to settle in writing</h2>
<ul>
  <li>Who owns the formula and the specifications?</li>
  <li>Who owns the artwork and print plates or cylinders?</li>
  <li>What confidentiality (NDA) terms apply?</li>
  <li>Which tests are included, and who pays for claim-support testing?</li>
  <li>How are price changes for raw materials handled?</li>
</ul>
<p>Clear answers up front make for a long, low-drama manufacturing relationship.</p>`
  },
  {
    slug: "choose-baby-wipes-manufacturer-india",
    title: "How to Choose a Baby Wipes Manufacturer in India: 12 Questions to Ask",
    seoTitle: "How to Choose a Baby Wipes Manufacturer in India: 12 Questions | Novel Tissues",
    description: "The 12 questions to ask before choosing a private label baby wipes manufacturer in India — capacity, plants, substrates, lotion, microbiological quality, packaging, MOQ and more.",
    category: "Wipes",
    date: PUBLISHED,
    art: { type: "wipes", pal: 2, size: "wide" },
    bg: "#D7E8FA",
    excerpt: "Wipes look simple. Making them consistently, safely and at scale isn't. Ask these 12 questions before you sign.",
    product: "baby-wipes",
    body: `
<p>Baby wipes are one of the most frequently repurchased baby products — which makes them a great anchor for a brand, and makes your choice of manufacturer critical. A single bad batch, dried-out pack or stock-out can undo months of marketing. Use these questions to compare partners.</p>

<h2>Capacity and supply</h2>
<h3>1. What is your monthly capacity — and how much is already committed?</h3>
<p>Raw capacity tells you if a manufacturer can grow with you. Ask how many machines they run and what monthly output they produce. For reference, Novel Tissues runs nine wipes machines producing 1.5 crore+ wipes a month.</p>
<h3>2. How many plants make wipes, and where?</h3>
<p>A second plant means continuity if one line goes down, and regional plants cut freight time to your warehouses. Ask whether every plant runs the same specification and quality checks.</p>
<h3>3. Can you scale my volumes without changing specifications?</h3>
<p>Your wipe should feel the same at 10,000 packs a month as at 5 lakh.</p>

<h2>Product and formulation</h2>
<h3>4. Which substrates and GSM options do you offer?</h3>
<p>Expect spunlace in different blends and weights, and ideally plant-based options. See our <a href="../baby-wipes-gsm-spunlace-guide/">guide to wipes GSM and substrates</a>.</p>
<h3>5. Do you formulate lotions in-house?</h3>
<p>In-house formulation means faster customisation of water content, extracts and fragrance — and one party accountable for the result.</p>
<h3>6. How do you control microbiological quality?</h3>
<p>Wet wipes are mostly water, which makes preservation and hygiene critical. Ask about water treatment, preservative systems, preservative efficacy testing, environmental monitoring and batch release testing.</p>

<!--CTA-->

<h2>Packaging and operations</h2>
<h3>7. Which pack formats and lids can you run?</h3>
<p>Flip-top lids, sticker labels, travel packs, multipacks — check that the formats your channels need are standard on their lines.</p>
<h3>8. What drives your MOQ?</h3>
<p>Usually printed flow-wrap film and lids. A good partner will explain the drivers and propose a practical first run.</p>
<h3>9. What are your typical lead times for first and repeat orders?</h3>
<p>First orders include artwork, film printing and approvals; repeat orders should be much faster. Agree a forecasting process.</p>

<h2>Quality and partnership</h2>
<h3>10. What documentation comes with each batch?</h3>
<p>Batch codes, release records and certificates of analysis protect you when a retailer or marketplace asks questions.</p>
<h3>11. How do you protect my brand?</h3>
<p>NDAs, restricted artwork access and confidentiality of your formula and pricing should be standard.</p>
<h3>12. Can you make the rest of my range too?</h3>
<p>If you plan to add shampoo, lotion or laundry detergent later, a partner that makes those too simplifies everything — one contract, one quality standard, one dispatch.</p>

<h2>Next step</h2>
<p>Shortlist two or three manufacturers, request samples and visit the plant if you can. The answers above — and how openly they're given — will tell you who to trust with your brand.</p>`
  },
  {
    slug: "baby-wipes-gsm-spunlace-guide",
    title: "Baby Wipes Fabric Explained: GSM, Spunlace and Plant-Based Substrates",
    seoTitle: "Baby Wipes GSM & Spunlace Fabric Guide for Brands | Novel Tissues",
    description: "What GSM means for baby wipes, how spunlace nonwovens are made, viscose vs polyester blends vs plant-based fibres, and how to pick the right wipe fabric for your brand.",
    category: "Wipes",
    date: PUBLISHED,
    art: { type: "wipes", pal: 1, size: "wide", count: 80 },
    bg: "#CDEFE3",
    excerpt: "The fabric decides how a wipe feels in a parent's hand. Here's how to choose GSM and substrate with confidence.",
    product: "baby-wipes",
    body: `
<p>When parents say a wipe feels "thin", "rough" or "luxurious", they're talking about the fabric — the <strong>substrate</strong>. It's one of the biggest drivers of both perceived quality and cost, so it's worth understanding before you choose.</p>

<h2>What is spunlace?</h2>
<p>Most baby wipes use <strong>spunlace</strong> (hydroentangled) nonwoven fabric. Instead of being woven or glued, fibres are laid into a web and entangled by fine high-pressure water jets. The result is soft, strong and absorbent, with no chemical binders — well suited to products that touch baby skin.</p>

<h2>What does GSM mean?</h2>
<p><strong>GSM</strong> is grams per square metre — the fabric's weight. Higher GSM generally means a thicker, stronger, more cushioned wipe. It also means more fibre per wipe, which raises cost.</p>
<div class="table-wrap"><table>
  <thead><tr><th>GSM band</th><th>Feel</th><th>Typical positioning</th></tr></thead>
  <tbody>
    <tr><td>Lighter (around 40–45)</td><td>Thin, flexible</td><td>Value packs, hand &amp; face wipes</td></tr>
    <tr><td>Mid (around 45–55)</td><td>Soft, everyday strength</td><td>Mainstream baby wipes</td></tr>
    <tr><td>Heavier (55–60+)</td><td>Thick, plush</td><td>Premium and newborn ranges</td></tr>
  </tbody>
</table></div>
<p>GSM isn't the whole story. Fibre blend, the embossed pattern and the lotion all change how thick a wipe feels, so always judge samples in hand.</p>

<!--CTA-->

<h2>Choosing the fibre blend</h2>
<h3>Viscose / polyester blends</h3>
<p>Polyester adds strength and keeps costs down. Viscose — a cellulose fibre made from wood pulp — adds softness and absorbency. Blends are the workhorse of the category.</p>
<h3>100% viscose</h3>
<p>Softer and more absorbent, and free of synthetic polymer fibres — often chosen for premium or "plant-based" positioning.</p>
<h3>Other plant-based fibres</h3>
<p>Fibres such as lyocell, or cotton-rich blends, support natural positioning. Availability and cost vary, so sample early.</p>
<p class="callout"><strong>A note on claims:</strong> words like "plastic-free", "biodegradable" or "flushable" must match the exact substrate — and in some cases test data. Confirm the evidence with your manufacturer before they go on pack.</p>

<h2>How the lotion interacts with fabric</h2>
<p>Different substrates hold lotion differently. A heavier, more absorbent fabric may need more lotion to feel equally moist. That's why fabric and lotion should be specified together, and why the lid and seal matter for keeping the last wipe as moist as the first.</p>

<h2>How to choose</h2>
<ol>
  <li>Start from your positioning: value, mainstream or premium.</li>
  <li>Sample two or three GSM levels in your preferred blend.</li>
  <li>Test them the way parents will — on a messy change, not just by touch.</li>
  <li>Check cost per pack at your target count.</li>
  <li>Lock the specification with tolerances so every batch matches.</li>
</ol>
<p>Want to see the trade-offs live? Try the Wipes Lab on our home page, then request a sample kit to feel the options for yourself.</p>`
  },
  {
    slug: "tear-free-baby-shampoo-formulation",
    title: "What Makes a Baby Shampoo Tear-Free? A Formulation Guide for Brand Owners",
    seoTitle: "What Makes Baby Shampoo Tear-Free? Formulation Guide | Novel Tissues",
    description: "How tear-free baby shampoos work — mild surfactants, near-neutral pH, sulphate-free systems, preservatives and fragrance — and what brand owners should check before making the claim.",
    category: "Formulation",
    date: PUBLISHED,
    art: { type: "pump", pal: 5 },
    bg: "#FBEFC4",
    excerpt: "Tear-free isn't a single ingredient — it's a set of formulation choices plus the testing to prove it.",
    product: "baby-shampoo-body-wash",
    body: `
<p>"Tear-free" is one of the most valued claims in baby care. Parents want bath time without tears. But there is no single "tear-free ingredient" — it's the result of several formulation choices working together, backed by testing.</p>

<h2>Gentle surfactants do the heavy lifting</h2>
<p>Surfactants are the cleansing agents in shampoo. Some, like sodium lauryl sulphate (SLS), clean powerfully but can sting eyes and dry skin. Baby shampoos instead rely on milder systems, typically built from:</p>
<ul>
  <li><strong>Amphoteric surfactants</strong> such as cocamidopropyl betaine — mild, and they reduce the harshness of other surfactants.</li>
  <li><strong>Non-ionic surfactants</strong> such as glucosides (decyl or coco glucoside) — very gentle and plant-derived.</li>
  <li><strong>Milder anionic surfactants</strong> used at low levels, or avoided altogether in sulphate-free formulas.</li>
</ul>
<p>The blend — and the total surfactant level — determines both mildness and how well the product foams and rinses.</p>

<h2>pH close to neutral</h2>
<p>Tears are close to neutral pH. Shampoos formulated near that point tend to be less irritating to the eyes than more acidic or alkaline products. Formulators balance this with what keeps the preservative system and the skin barrier happy.</p>

<!--CTA-->

<h2>Sulphate-free: helpful, not the whole answer</h2>
<p>Removing SLS and SLES is a popular choice and supports gentleness. But "sulphate-free" and "tear-free" are different claims. A sulphate-free shampoo still needs the right overall surfactant system and pH to be gentle on eyes.</p>

<h2>Fragrance, preservatives and extras</h2>
<ul>
  <li><strong>Fragrance:</strong> keep it light, or offer a fragrance-free variant for newborns and sensitive skin.</li>
  <li><strong>Preservatives:</strong> every water-based product needs an effective preservative system. Paraben-free options are common; whatever you choose must pass preservative efficacy testing.</li>
  <li><strong>Conditioning agents:</strong> help detangling, especially for toddler 2-in-1 formulas.</li>
  <li><strong>Botanicals:</strong> chamomile, aloe or calendula extracts support positioning — use them at levels that don't compromise mildness.</li>
</ul>

<h2>Backing the claim</h2>
<p>A tear-free claim should be supported by appropriate testing of the final formula — for example in-vitro eye-irritation methods and, where suitable, safety-in-use studies conducted by qualified labs. Plan this testing early: it affects your timeline and budget, and your artwork shouldn't go to print until it's done.</p>

<h2>Checklist for brand owners</h2>
<ol>
  <li>Choose your positioning: classic, sulphate-free, natural or fragrance-free.</li>
  <li>Start from a proven mild base and customise from there.</li>
  <li>Agree target pH, foam, viscosity and fragrance level.</li>
  <li>Plan stability, compatibility and preservative efficacy testing.</li>
  <li>Plan claim-support testing before artwork is final.</li>
</ol>`
  },
  {
    slug: "baby-laundry-detergent-private-label",
    title: "Baby Laundry Detergent: Why It's Different and How to Launch Your Own",
    seoTitle: "Baby Laundry Detergent: Formulation & Private Label Launch Guide | Novel Tissues",
    description: "Why baby laundry detergent differs from regular detergent — mild surfactants, low residue, dye- and fragrance-free options — and how to launch a private label baby detergent.",
    category: "Laundry",
    date: PUBLISHED,
    art: { type: "detergent", pal: 4, size: "wide" },
    bg: "#E4DCF8",
    excerpt: "Baby clothes sit on baby skin all day. Here's what makes a detergent baby-friendly — and why it's a smart addition to your range.",
    product: "baby-laundry-detergent-cleansers",
    body: `
<p>Parents who carefully choose wipes and lotions increasingly ask the next question: what is my baby's clothing washed in? Baby laundry detergent has become a natural extension for baby care brands — and it lets you own more of the nursery.</p>

<h2>Why baby detergent is different</h2>
<p>Baby skin is thinner and more easily irritated than adult skin, and clothes, bedding and cloth nappies are in contact with it for hours. Baby detergents are therefore typically formulated to:</p>
<ul>
  <li><strong>Use milder surfactant systems</strong> that clean effectively without being harsh.</li>
  <li><strong>Rinse out cleanly</strong>, leaving less residue in fabric.</li>
  <li><strong>Leave out dyes</strong> and often fragrance, or keep fragrance very light.</li>
  <li><strong>Handle typical baby stains</strong> — milk, food and nappy stains.</li>
</ul>

<h2>Formulation choices to make</h2>
<h3>Surfactant system</h3>
<p>Plant-derived and mild surfactants support gentle positioning. The blend affects cleaning, foaming and rinsing.</p>
<h3>Enzymes or enzyme-free</h3>
<p>Enzymes help break down protein- and starch-based stains like milk and food. Some brands prefer enzyme-free variants for sensitive-skin positioning. Decide based on your brand promise.</p>
<h3>Foam level</h3>
<p>Front-load machines need low-foam detergents. If your customers use them, offer a compatible variant.</p>
<h3>Fragrance</h3>
<p>Many brands offer two variants: a soft, clean scent and a fragrance-free sensitive version.</p>

<!--CTA-->

<h2>Completing the range</h2>
<p>Laundry detergent pairs naturally with:</p>
<ul>
  <li><strong>Fabric conditioner</strong> for softer baby clothes</li>
  <li><strong>Bottle &amp; nipple cleanser</strong> for feeding items</li>
  <li><strong>Toy &amp; surface cleanser</strong> for high chairs and changing tables</li>
  <li><strong>Refill pouches</strong> for repeat buyers</li>
</ul>
<p>Together they make an attractive "new parent home kit" bundle for marketplaces and gifting.</p>

<h2>Packaging and pricing</h2>
<p>Handled cans and bottles in 500 ml to 2 litre sizes cover most needs, with refill pouches for value and lower plastic use. Because detergents are heavier and bulkier than cosmetics, freight is a meaningful part of cost. Shipping them with your wipes and cosmetics in consolidated loads helps.</p>

<h2>Launching with one manufacturer</h2>
<p>Making detergents at the same campus as your shampoos and lotions means one quality system, one contract and combined dispatch. At Novel Tissues, our Pondicherry campus produces baby cosmetics and baby laundry and cleaning liquids side by side across eight lines.</p>`
  }
];
