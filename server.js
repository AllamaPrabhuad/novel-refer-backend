import express from "express";
import crypto from "crypto";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(express.json());

const SHOP = process.env.SHOP;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const APP_PROXY_SECRET = process.env.APP_PROXY_SECRET;
const ENQUIRY_WEBHOOK_URL = process.env.ENQUIRY_WEBHOOK_URL;

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function verifyProxy(req) {
  const q = { ...req.query };
  const sig = q.signature;
  if (!sig) return false;
  delete q.signature;

  const msg = Object.keys(q)
    .sort()
    .map(k => `${k}=${q[k]}`)
    .join("");

  const hash = crypto
    .createHmac("sha256", APP_PROXY_SECRET)
    .update(msg)
    .digest("hex");

  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(sig));
}

app.get("/proxy/leaderboard", (req, res) => {
  if (!verifyProxy(req)) return res.status(401).send("Invalid signature");

  res.json({
    updated_at: new Date().toISOString(),
    rows: [
      { name: "Demo Influencer 1", sales: 125000, orders: 340 },
      { name: "Demo Influencer 2", sales: 98000, orders: 280 },
      { name: "Demo Influencer 3", sales: 67000, orders: 190 }
    ]
  });
});

app.post("/proxy/enroll", (req, res) => {
  if (!verifyProxy(req)) return res.status(401).send("Invalid signature");
  res.json({ ok: true });
});

// B2B private label website
app.use("/b2b", express.static(path.join(__dirname, "public/b2b")));

// Leads from the site: type is "enquiry", "brochure", "sample" or "visit"
app.post("/api/enquiry", async (req, res) => {
  const b = req.body || {};
  if (b.website) return res.json({ ok: true }); // honeypot

  const type = ["enquiry", "brochure", "sample", "visit"].includes(b.type) ? b.type : "enquiry";
  const required = ["name", "company", "email", "phone"];
  if (type === "sample") required.push("address", "city", "pincode");
  if (type === "visit") required.push("mode", "date");
  if (required.some(k => !String(b[k] || "").trim())) {
    return res.status(400).json({ ok: false, error: "Missing required fields" });
  }

  const lead = {
    type,
    received_at: new Date().toISOString(),
    name: b.name, company: b.company, email: b.email, phone: b.phone,
    business: b.business, products: b.products, volume: b.volume, launch: b.launch,
    formula: b.formula, concept: b.concept, notes: b.notes,
    mode: b.mode, plant: b.plant, date: b.date, time: b.time,
    address: b.address, city: b.city, pincode: b.pincode, page: b.page
  };
  console.log(`B2B ${type}`, JSON.stringify(lead));

  if (ENQUIRY_WEBHOOK_URL) {
    try {
      await fetch(ENQUIRY_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lead)
      });
    } catch (err) {
      console.error("Enquiry webhook failed", err);
    }
  }

  res.json({ ok: true });
});

app.get("/", (_req, res) => res.send("OK"));

app.listen(8080, () => console.log("Server running on port 8080"));
