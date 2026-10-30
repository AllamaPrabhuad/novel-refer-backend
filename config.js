/* ==========================================================
   Novel Tissues — site configuration (edit before going live)
   Used by every page, the brochure and the SEO build.
   After changing, run `npm run build:site` and `npm run build:assets`.
   ========================================================== */
const CONTACT = {
  email: "sales@noveltissues.com", // where enquiries & mailto fallback go
  phone: "",                        // e.g. "+91 98765 43210" (shown if set)
  whatsapp: "",                     // digits only with country code, e.g. "919876543210"
  endpoint: "/api/enquiry.php"          // POST endpoint served by server.js
};

const SITE = {
  url: "https://www.noveltissues.com", // live domain, used for canonical URLs & sitemap
  brochure: "downloads/novel-tissues-private-label-brochure.pdf"
};
