import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const origin = "http://127.0.0.1:3100";
const password = randomBytes(24).toString("hex");
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3100"], { env: { ...process.env, NEXT_BUILD_DIR: ".next-verification", ADMIN_PASSWORD: password }, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
let output = "";
server.stdout.on("data", data => { output += data; process.stdout.write(data); });
server.stderr.on("data", data => { output += data; process.stderr.write(data); });
async function login(body, options = {}) {
  return fetch(`${origin}/api/admin/login`, { method: "POST", headers: { "Content-Type": "application/json", Origin: origin, "x-vercel-forwarded-for": "127.0.0.1", ...options }, body: JSON.stringify(body), redirect: "manual" });
}
try {
  let ready = false;
  for (let i = 0; i < 90; i++) {
    if (server.exitCode !== null) throw new Error(output);
    try { ready = (await fetch(origin)).ok; if (ready) break; } catch {}
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert.ok(ready, `Server starts: ${output}`);
  const paths = new Set(["/", "/nosotros", "/servicios", "/noticias", "/contacto"]);
  const pages = new Map();
  const anchors = [];
  for (const path of paths) {
    const response = await fetch(origin + path).catch(error => { throw new Error(`Failed to load ${path}`, { cause: error }); });
    assert.equal(response.status, 200, path);
    const html = await response.text(); pages.set(path, html);
    assert.ok(html.includes("Granalla Norte"), `Content renders: ${path}`);
    assert.ok(html.includes('mailto:contacto@granallanorte.cl'), `Corporate contact email: ${path}`);
    assert.ok(!/granalla\.?norte@gmail\.com/i.test(html), `No old Gmail contact: ${path}`);
    for (const match of html.matchAll(/href="([^"\s]+)"/g)) {
      const href = match[1].replaceAll("&amp;", "&");
      if (!href.startsWith("/") || href.startsWith("//") || href.startsWith("/_next") || href.startsWith("/admin")) continue;
      const url = new URL(href, origin);
      if (url.pathname.match(/\.[a-z]+$/i)) continue;
      paths.add(url.pathname);
      if (url.hash) anchors.push([url.pathname, decodeURIComponent(url.hash.slice(1))]);
    }
  }
  for (const [path, id] of anchors) assert.ok(pages.get(path)?.includes(`id="${id}"`), `Anchor ${path}#${id} exists`);
  for (const html of pages.values()) {
    for (const match of html.matchAll(/(?:src|srcSet)="([^"\s]+)/g)) {
      const source = new URL(match[1].replaceAll("&amp;", "&"), origin);
      const image = source.pathname === "/_next/image" ? source.searchParams.get("url") : source.pathname;
      if (image?.startsWith("/img/")) assert.equal((await fetch(origin + image)).status, 200, image);
    }
  }
  for (const legacy of ["/granalla-norte", "/-granlla-norte-presente-en-la-expo-forede-2025-", "/ventas-de-cloruro-de-sodio-para-minera-maricunga", "/mejora-sede-social-villa-los-forjadores", "/mejora-escuela-paul-harris"]) {
    const response = await fetch(origin + legacy, {redirect:"manual"});
    assert.equal(response.status,308,legacy);
    assert.equal((await fetch(new URL(response.headers.get("location"),origin))).status,200);
  }
  const recovered = JSON.parse(await readFile(new URL("../src/lib/recovered-news.json", import.meta.url), "utf8"));
  const editorial = JSON.parse(await readFile(new URL("../src/lib/news-editorial.json", import.meta.url), "utf8"));
  for (const post of recovered) {
    const response = await fetch(origin + "/" + (post.legacySlug || post.slug), { redirect: "manual" });
    assert.equal(response.status, 308);
    const page = await fetch(new URL(response.headers.get("location"), origin));
    assert.equal(page.status, 200);
    const html = await page.text();
    assert.ok(html.includes(editorial[post.slug]?.title ?? post.title));
    for (const video of post.videos || []) assert.ok(html.includes(video), "Original videos remain available");
  }
  assert.equal((await fetch(origin + "/noticias/mejora-sede-social-hermanos-carrizos")).status, 404);
  const favicon = Buffer.from(await (await fetch(origin + "/favicon.ico")).arrayBuffer());
  assert.equal(favicon.readUInt16LE(2), 1);
  assert.deepEqual(favicon, await readFile(new URL("../src/app/favicon.ico", import.meta.url)));
  const denied = await fetch(`${origin}/admin`, { redirect: "manual" });
  assert.equal(denied.status, 307); assert.ok(denied.headers.get("location").endsWith("/admin/login"));
  const loginPage = await fetch(`${origin}/admin/login`);
  assert.ok((await loginPage.text()).includes('name="password"'), "Login renders");
  assert.equal((await login({username:"admin",password:"wrong"})).status, 401);
  assert.equal((await login({username:"admin",password}, {Origin:"https://another.example"})).status, 403);
  const signedIn = await login({username:"admin",password});
  assert.equal(signedIn.status, 200);
  const setCookie = signedIn.headers.get("set-cookie");
  assert.match(setCookie, /HttpOnly/i); assert.match(setCookie, /Secure/i); assert.match(setCookie, /SameSite=strict/i);
  const cookie = setCookie.split(";")[0];
  const admin = await fetch(`${origin}/admin`, {headers:{Cookie:cookie},redirect:"manual"});
  assert.equal(admin.status, 200); assert.ok((await admin.text()).includes("Administración"));
  const forged = await fetch(`${origin}/admin`, {headers:{Cookie:"gn_admin_session=invalid"},redirect:"manual"});
  assert.equal(forged.status, 307);
  const logout = await fetch(`${origin}/api/admin/logout`, {method:"POST",headers:{Origin:origin,Cookie:cookie},redirect:"manual"});
  assert.equal(logout.status, 303); assert.match(logout.headers.get("set-cookie"), /Max-Age=0/i);
  for (let i=0; i<5; i++) assert.equal((await login({username:"admin",password:"wrong"})).status,401);
  assert.equal((await login({username:"admin",password:"wrong"})).status,429);
  const contact = await fetch(`${origin}/api/contacto`,{method:"POST",headers:{"Content-Type":"application/json"},body:"null"});
  assert.equal(contact.status,400);
  console.log(`PASS: ${pages.size} public pages, ${anchors.length} section links, login, session cookies, route protection, logout, invalid input and login throttling.`);
} finally {
  server.kill();
}
