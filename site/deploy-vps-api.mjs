// Launches the website on a Hostinger VPS end to end through Hostinger's public API:
//   1. points the domain (and www) at the VPS in Hostinger DNS — email records are left alone;
//   2. stores site/vps-setup.sh in the account as a post-install script;
//   3. installs Ubuntu 24.04 on the VPS with that script, which installs nginx + PHP, serves the
//      hostinger-site branch, issues SSL and pulls updates from GitHub every 5 minutes;
//   4. waits until the site answers.
// A brand-new VPS (state "initial") is set up without erasing anything. A VPS that already has an
// operating system is only reinstalled when --wipe is passed, because that erases its disk.
//
// Usage: npm run deploy:vps -- [--vm 887330] [--wipe] [--dry-run] [--wait-minutes 25]
// Needs a Hostinger API token (hPanel → Account → API) as HOSTINGER_API_TOKEN, or added by the network.
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const { SITE } = new Function(fs.readFileSync(path.join(ROOT, "public/b2b/config.js"), "utf8") + "; return { SITE };")();
const DOMAIN = new URL(SITE.url).host.replace(/^www\./, "");
const BASE = (process.env.API_BASE_URL || "https://developers.hostinger.com").replace(/\/$/, "");
const TOKEN = process.env.HOSTINGER_API_TOKEN;
const SCRIPT_NAME = "Novel Tissues website";

const args = process.argv.slice(2);
const flag = name => args.includes(name);
const option = (name, fallback) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : fallback; };
const VM_ID = Number(option("--vm", process.env.VPS_ID || 887330));
const WIPE = flag("--wipe");
const DRY = flag("--dry-run");
const WAIT_MINUTES = Number(option("--wait-minutes", 25));

const say = msg => console.log(msg);
const sleep = ms => new Promise(r => setTimeout(r, ms));

if (!TOKEN) say("No HOSTINGER_API_TOKEN in the environment — trying anyway, in case the network adds Hostinger credentials.");

async function api(method, p, body) {
  if (DRY && method !== "GET") { say(`  [dry run] ${method} ${p} ${body ? JSON.stringify(body) : ""}`); return {}; }
  const res = await fetch(BASE + p, {
    method,
    headers: { ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}), Accept: "application/json", ...(body ? { "Content-Type": "application/json" } : {}) },
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await res.text();
  if (res.status === 401) throw new Error("Hostinger rejected the API token (401). Create a new one in hPanel → Account → API and update HOSTINGER_API_TOKEN.");
  if (!res.ok) throw new Error(`${method} ${p} → ${res.status} ${text.slice(0, 400)}`);
  try { return text ? JSON.parse(text) : {}; } catch { return { raw: text }; }
}
const list = r => (Array.isArray(r) ? r : Array.isArray(r?.data) ? r.data : []);
const addresses = (ips, re) => (Array.isArray(ips) ? ips : []).map(x => (typeof x === "string" ? x : x?.address)).filter(a => a && re.test(a));
const IPV4 = /^\d{1,3}(\.\d{1,3}){3}$/;
const IPV6 = /:/;

async function main() {
  /* ---------- 1. the VPS ---------- */
  say(`Reading VPS ${VM_ID}…`);
  const vm = await api("GET", `/api/vps/v1/virtual-machines/${VM_ID}`);
  const ipv4 = addresses(vm.ipv4, IPV4)[0];
  const ipv6 = addresses(vm.ipv6, IPV6)[0];
  say(`  hostname: ${vm.hostname || "—"} · state: ${vm.state} · OS: ${vm.template?.name || "none"} · IPv4: ${ipv4 || "—"} · IPv6: ${ipv6 || "—"}`);
  if (!ipv4) throw new Error("The VPS has no IPv4 address yet, so the domain can't be pointed at it.");

  const isNew = vm.state === "initial";
  if (!isNew && !WIPE) {
    say(`\nThe VPS already has an operating system (${vm.template?.name || "unknown"}).`);
    say("Installing the website this way reinstalls it and ERASES everything on its disk.");
    say("Re-run with --wipe once the owner has confirmed the VPS holds nothing they need.");
    process.exit(2);
  }

  /* ---------- 2. DNS: domain and www → VPS ---------- */
  say(`\nPointing ${DOMAIN} at ${ipv4}${ipv6 ? ` / ${ipv6}` : ""}…`);
  const zone = list(await api("GET", `/api/dns/v1/zones/${DOMAIN}`));
  const rec = (name, type) => zone.find(r => r.name === name && r.type === type);
  const wwwIsCname = !!rec("www", "CNAME");
  const updates = [{ name: "@", type: "A", ttl: 300, records: [{ content: ipv4 }] }];
  if (!wwwIsCname) updates.push({ name: "www", type: "A", ttl: 300, records: [{ content: ipv4 }] });
  if (ipv6) {
    updates.push({ name: "@", type: "AAAA", ttl: 300, records: [{ content: ipv6 }] });
    if (!wwwIsCname) updates.push({ name: "www", type: "AAAA", ttl: 300, records: [{ content: ipv6 }] });
  }
  await api("PUT", `/api/dns/v1/zones/${DOMAIN}`, { overwrite: true, zone: updates });
  say(`  set ${updates.map(u => `${u.name} ${u.type}`).join(", ")}${wwwIsCname ? " (www already follows the main domain)" : ""}`);
  if (!ipv6) {
    const stale = ["@", "www"].filter(n => rec(n, "AAAA"));
    for (const name of stale) {
      try {
        await api("DELETE", `/api/dns/v1/zones/${DOMAIN}`, { filters: [{ name, type: "AAAA" }] });
        say(`  removed old IPv6 record for ${name}`);
      } catch (err) {
        say(`  ! could not remove the old IPv6 (AAAA) record for ${name}: delete it in hPanel → DNS records, or SSL may fail. (${err.message})`);
      }
    }
  }

  /* ---------- 3. post-install script ---------- */
  say("\nSaving the website setup script in the Hostinger account…");
  const setup = fs.readFileSync(path.join(here, "vps-setup.sh"), "utf8");
  if (setup.includes("NOVEL_SETUP_EOF")) throw new Error("vps-setup.sh contains the heredoc marker");
  const content = [
    "#!/usr/bin/env bash",
    "# Waits for the network, then runs the Novel Tissues website setup (site/vps-setup.sh).",
    "for i in $(seq 1 60); do getent hosts github.com >/dev/null 2>&1 && break; sleep 5; done",
    "cat > /root/novel-vps-setup.sh <<'NOVEL_SETUP_EOF'",
    setup.trimEnd(),
    "NOVEL_SETUP_EOF",
    "bash /root/novel-vps-setup.sh",
    ""
  ].join("\n");
  if (Buffer.byteLength(content) > 48 * 1024) throw new Error("Post-install script is larger than Hostinger's 48 KB limit");
  const existing = list(await api("GET", "/api/vps/v1/post-install-scripts")).find(s => s.name === SCRIPT_NAME);
  const script = existing
    ? await api("PUT", `/api/vps/v1/post-install-scripts/${existing.id}`, { name: SCRIPT_NAME, content })
    : await api("POST", "/api/vps/v1/post-install-scripts", { name: SCRIPT_NAME, content });
  let scriptId = existing?.id ?? script?.id ?? script?.data?.id;
  if (!scriptId && !DRY) scriptId = list(await api("GET", "/api/vps/v1/post-install-scripts")).find(x => x.name === SCRIPT_NAME)?.id;
  if (!scriptId && !DRY) throw new Error("Couldn't read the post-install script ID back from Hostinger, so the VPS was not touched.");
  say(`  ${existing ? "updated" : "created"} post-install script${scriptId ? ` #${scriptId}` : ""}`);

  /* ---------- 4. install Ubuntu 24.04 with the website ---------- */
  const templates = list(await api("GET", "/api/vps/v1/templates"));
  const plain = t => !/\bwith\b|panel|coolify|docker|n8n|ols|openlitespeed|cyberpanel|cpanel|plesk|webuzo|hestia|virtualmin/i.test(t.name || "");
  const template = templates.find(t => /^ubuntu 24\.04( lts)?$/i.test((t.name || "").trim()))
    || templates.find(t => /ubuntu 24\.04/i.test(t.name || "") && plain(t))
    || templates.find(t => /ubuntu 22\.04/i.test(t.name || "") && plain(t));
  if (!template) throw new Error("No plain Ubuntu 24.04 / 22.04 template is available for this VPS");
  say(`\nInstalling ${template.name} with the website (${isNew ? "first-time setup" : "reinstall — erasing the VPS"})…`);

  if (isNew) {
    let dataCenter = vm.data_center_id;
    if (!dataCenter) {
      const centers = list(await api("GET", "/api/vps/v1/data-centers"));
      dataCenter = (centers.find(c => /india|mumbai/i.test(`${c.name} ${c.location} ${c.city}`)) || centers[0])?.id;
    }
    await api("POST", `/api/vps/v1/virtual-machines/${VM_ID}/setup`, {
      template_id: template.id, data_center_id: dataCenter, post_install_script_id: scriptId, hostname: DOMAIN
    });
  } else {
    await api("POST", `/api/vps/v1/virtual-machines/${VM_ID}/recreate`, { template_id: template.id, post_install_script_id: scriptId });
  }
  if (DRY) { say("\nDry run finished — nothing was changed."); process.exit(0); }

  /* ---------- 5. wait for the VPS and the site ---------- */
  const deadline = Date.now() + WAIT_MINUTES * 60_000;
  let last = "", sawWork = false;
  while (Date.now() < deadline) {
    const v = await api("GET", `/api/vps/v1/virtual-machines/${VM_ID}`).catch(() => ({}));
    const stateNow = `${v.state}${v.actions_lock === "locked" ? " (busy)" : ""}`;
    if (stateNow !== last) { say(`  VPS: ${stateNow}`); last = stateNow; }
    if (v.state !== "running" || v.actions_lock === "locked") sawWork = true;
    if (sawWork && v.state === "running" && v.actions_lock !== "locked") break;
    await sleep(15_000);
  }
  say("\nThe VPS is installed. The website setup now runs on it (about 3–5 minutes).");
  while (Date.now() < deadline) {
    for (const url of [`https://${DOMAIN}/`, `http://${DOMAIN}/`, `http://${ipv4}/`]) {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(10_000) });
        const body = await res.text();
        if (res.ok && body.includes("Novel Tissues")) {
          say(`\nLive: ${url}`);
          say(`SSL is issued automatically within ~15 minutes of DNS updating; then https://${DOMAIN} is the address.`);
          say("Next, in hPanel → VPS → Browser terminal, run  novel-setup  to connect lead emails and set the /admin/ password.");
          process.exit(0);
        }
      } catch { /* not up yet, or this network can't reach it */ }
    }
    await sleep(20_000);
  }
  say(`\nCouldn't confirm the site from here within ${WAIT_MINUTES} minutes. Open http://${ipv4}/ and https://${DOMAIN}/ in a browser;`);
  say("if they don't load, the setup log on the VPS is /post_install.log (hPanel → VPS → Browser terminal: tail -50 /post_install.log).");
}

main().catch(err => {
  console.error(`\nDeploy failed: ${err.message}`);
  process.exit(1);
});
