# Launch checklist — babywipesmanufacturer.com

## 1. Go live
Either let Claude do it through the Hostinger API (`npm run deploy:vps`, needs an API token), or by hand:
- [ ] VPS: run the one-line setup in the hPanel browser terminal (see `site/README.md`)
- [ ] DNS: `A @` and `A www` → VPS IP (hPanel → Domains → DNS records)
- [ ] Wait for SSL (automatic within ~15 minutes after DNS)
- [ ] On the VPS run `novel-setup`: mailbox for sending, lead email, Google Sheet link, dashboard password

## 2. Leads
- [ ] Create the sending mailbox (e.g. `sales@babywipesmanufacturer.com`) in hPanel → Emails
- [ ] Google Sheet copy: follow `site/google-sheet-leads.gs`, paste the web-app URL into `novel-setup`
- [ ] Send a test enquiry, brochure, sample and visit request; check the inbox, the auto-reply and https://babywipesmanufacturer.com/admin/
- [ ] Add the WhatsApp number in `public/b2b/config.js` (`whatsapp`)
- [ ] Optional: a booking-page link in `config.js` (`calendly`)

## 3. Google & analytics
- [ ] Google Search Console: add the domain, put the HTML-tag value in `config.js` → `googleVerification`, rebuild, verify, submit `sitemap.xml`
- [ ] Bing Webmaster Tools: same, with `bingVerification`
- [ ] Google Analytics 4: create a property, put the `G-…` ID in `config.js` → `ga4`. Mark `generate_lead` and `file_download` as key events.
- [ ] Google Business Profile for each plant: name "Novel Tissues", category "Manufacturer", the plant's address and photos, website link to the matching page:
  - North India wipes plant → /locations/north-india/
  - South India wipes plant → /locations/south-india/
  - Pondicherry liquids campus → /products/baby-shampoo-body-wash/
- [ ] Ask happy clients for Google reviews

## 4. Trust details (appear on the site automatically once filled)
In `site/content-more.mjs` → `TRUST`, then `npm run build:site`:
- [ ] Factory photos (`photos`) and a factory tour video (`videoId`)
- [ ] Certifications and licence numbers (`certifications`)
- [ ] Clients you may name (`clients`) and case studies (`caseStudies`)
- [ ] MOQs and lead times (`moq`)
- [ ] Company story and facts, such as year established (`story`, `facts`)
- [ ] Price bands for the estimator (`PRICE_BANDS`), if you want to show indicative prices

## 5. Legal
- [ ] Have the privacy policy and terms (`/privacy/`, `/terms/`) reviewed by your legal adviser

## 6. Sales materials (in this folder)
- [ ] Pitch deck: `novel-tissues-pitch-deck.pdf`
- [ ] Roll-up banner, 85 × 200 cm: `rollup-banner-85x200cm.pdf` (ask your printer to add bleed); the QR code opens /expo/
- [ ] Outreach emails: `outreach-templates.md`
- [ ] Marketplace listings: `marketplace-listings.md`
- [ ] Blog plan: `content-calendar.md`
