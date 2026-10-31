/* ==========================================================
   Novel Tissues — site configuration (edit before going live)
   Used by every page, the brochure and the SEO build.
   After changing, run `npm run build:site` and `npm run build:assets`.
   ========================================================== */
const CONTACT = {
  email: "sales@noveltissues.com", // where enquiries & mailto fallback go
  phone: "",                        // e.g. "+91 98765 43210" (shown if set)
  whatsapp: "",                     // digits only with country code, e.g. "919876543210"
  calendly: "",                     // optional booking-page link (Calendly, Google Calendar…) shown in "Book a visit"
  endpoint: "/api/enquiry.php"          // POST endpoint served by server.js
};

const SITE = {
  url: "https://babywipesmanufacturer.com", // live domain, used for canonical URLs & sitemap
  brochure: "downloads/novel-tissues-private-label-brochure.pdf",
  ga4: "",                 // Google Analytics 4 measurement ID, e.g. "G-XXXXXXXXXX" (tracking is off until set)
  googleVerification: "",  // Google Search Console "HTML tag" content value
  bingVerification: ""     // Bing Webmaster Tools "msvalidate.01" content value
};
