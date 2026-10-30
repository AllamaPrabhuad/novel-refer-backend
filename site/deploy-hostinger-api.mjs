// Deploys the Hostinger package straight to the live domain through Hostinger's API,
// using Hostinger's official toolkit (hostinger-api-mcp) over stdio.
// Needs HOSTINGER_API_TOKEN in the environment and network access to Hostinger.
// Usage: npm run deploy:hostinger:api
import fs from "fs";
import path from "path";
import { spawn, execFileSync } from "child_process";
import { fileURLToPath } from "url";

const here = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(here, "..");
const { SITE } = new Function(fs.readFileSync(path.join(ROOT, "public/b2b/config.js"), "utf8") + "; return { SITE };")();
const DOMAIN = new URL(SITE.url).host.replace(/^www\./, "");
const ARCHIVE = path.join(ROOT, "dist/novel-tissues-hostinger.zip");

if (!process.env.HOSTINGER_API_TOKEN) {
  console.error("HOSTINGER_API_TOKEN is not set. Create one in hPanel (Account → API) and add it to the environment.");
  process.exit(1);
}

execFileSync("npm", ["run", "--silent", "build:hostinger"], { cwd: ROOT, stdio: "inherit" });

const server = spawn("npx", ["-y", "hostinger-api-mcp@3.24.1"], {
  env: { ...process.env, HOSTINGER_API_TOKEN: process.env.HOSTINGER_API_TOKEN },
  stdio: ["pipe", "pipe", "inherit"]
});

let nextId = 1;
const pending = new Map();
let buffer = "";
server.stdout.on("data", chunk => {
  buffer += chunk;
  let nl;
  while ((nl = buffer.indexOf("\n")) >= 0) {
    const line = buffer.slice(0, nl).trim();
    buffer = buffer.slice(nl + 1);
    if (!line) continue;
    let msg;
    try { msg = JSON.parse(line); } catch { continue; }
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      msg.error ? reject(new Error(msg.error.message)) : resolve(msg.result);
    }
  }
});
const send = msg => server.stdin.write(JSON.stringify(msg) + "\n");
const request = (method, params) => new Promise((resolve, reject) => {
  const id = nextId++;
  pending.set(id, { resolve, reject });
  send({ jsonrpc: "2.0", id, method, params });
});
const text = result => (result?.content || []).map(c => c.text || "").join("\n");
async function call(name, args) {
  const result = await request("tools/call", { name, arguments: args });
  if (result.isError) throw new Error(`${name}: ${text(result)}`);
  return text(result);
}

try {
  await request("initialize", { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "novel-tissues-deploy", version: "1.0.0" } });
  send({ jsonrpc: "2.0", method: "notifications/initialized" });
  const { tools } = await request("tools/list", {});
  const find = re => tools.find(t => re.test(t.name))?.name;

  const listTool = find(/^hosting_listWebsites/i) || find(/^hosting_websites_list/i);
  if (listTool) {
    const sites = await call(listTool, {});
    if (!sites.includes(DOMAIN)) {
      throw new Error(`${DOMAIN} is not a website in this Hostinger account yet. Add it in hPanel → Websites first.`);
    }
    console.log(`Found ${DOMAIN} in the Hostinger account.`);
  }

  const deployTool = find(/^hosting_deployStaticWebsite$/);
  if (!deployTool) throw new Error("This toolkit version has no static website deploy tool.");
  console.log(`Deploying ${path.basename(ARCHIVE)} to ${DOMAIN}…`);
  console.log(await call(deployTool, { domain: DOMAIN, archivePath: ARCHIVE }));
  console.log(`Done. Check https://${DOMAIN}`);
} catch (err) {
  console.error("Deploy failed:", err.message);
  process.exitCode = 1;
} finally {
  server.kill();
}
