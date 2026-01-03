import express from "express";
import crypto from "crypto";

const app = express();
app.use(express.json());

const SHOP = process.env.SHOP;
const ADMIN_TOKEN = process.env.ADMIN_TOKEN;
const APP_PROXY_SECRET = process.env.APP_PROXY_SECRET;

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

app.get("/", (_req, res) => res.send("OK"));

app.listen(8080, () => console.log("Server running on port 8080"));
