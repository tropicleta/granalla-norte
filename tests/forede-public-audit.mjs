// Read-only audit: never submits forms or enters the administration area.
import assert from "node:assert/strict";
import { writeFile, mkdir } from "node:fs/promises";

const origin = (process.argv[2] || "http://127.0.0.1:3126").replace(/\/$/, "");
const reportPath = process.argv[3];
const decode = value => value.replaceAll("&amp;", "&");
const errors = [];
const pages = new Map();
const assets = new Set();
const anchors = [];
const titles = new Map();
const queue = new Set(["/", "/empresas", "/servicios", "/contacto", "/nosotros", "/noticias", "/maquinaria", "/equipos-monitoreo"]);
const get = (path, options = {}) => fetch(new URL(path, origin), { signal: AbortSignal.timeout(30000), ...options });
const sitemapResponse = await get("/sitemap.xml");
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) queue.add(new URL(loc).pathname);
for (const path of queue) {
  try {
    const response = await get(path);
    const html = await response.text();
    pages.set(path, html);
    if (response.status !== 200) errors.push(`${path}: HTTP ${response.status}`);
    if ((html.match(/<h1(?:\s|>)/g) || []).length !== 1) errors.push(`${path}: expected one h1`);
    const title = html.match(/<title>([^<]+)<\/title>/)?.[1];
    if (!title) errors.push(`${path}: missing title`);
    if (title && !path.includes("?")) {
      if (titles.has(title)) errors.push(`${path}: duplicate title with ${titles.get(title)}`);
      titles.set(title, path);
    }
    if (!html.includes('name="description"')) errors.push(`${path}: missing description`);
    if (!html.includes('rel="canonical"')) errors.push(`${path}: missing canonical`);
    if (/<meta[^>]+name="robots"[^>]+noindex/.test(html)) errors.push(`${path}: public page noindex`);
    for (const [, href] of html.matchAll(/href="([^"\s]+)"/g)) {
      if (!href.startsWith("/") || href.startsWith("//") || /^\/(?:_next|admin|api)/.test(href)) continue;
      const url = new URL(decode(href), origin);
      if (/\.[a-z0-9]+$/i.test(url.pathname)) { assets.add(url.pathname); continue; }
      queue.add(url.pathname + url.search);
      if (url.hash) anchors.push([url.pathname + url.search, decodeURIComponent(url.hash.slice(1))]);
    }
    for (const [, src] of html.matchAll(/src="([^"\s]+)"/g)) {
      const url = new URL(decode(src), origin);
      const source = url.pathname === "/_next/image" ? url.searchParams.get("url") : url.pathname;
      if (source?.startsWith("/img/") || source?.startsWith("/api/media/")) assets.add(source);
    }
    // This checks the JSON emitted by our server, not absence of client-injected data.
    for (const [, json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) JSON.parse(json);
  } catch (error) { errors.push(`${path}: ${error.message}`); }
}
for (const [path, anchor] of anchors) if (!pages.get(path)?.includes(`id="${anchor}"`)) errors.push(`${path}#${anchor}: missing anchor`);
const pending = [...assets];
await Promise.all(Array.from({ length: 4 }, async () => {
  while (pending.length) {
    const asset = pending.pop();
    try { const response = await get(asset, { method: "HEAD" }); if (!response.ok) errors.push(`${asset}: HTTP ${response.status}`); }
    catch (error) { errors.push(`${asset}: ${error.message}`); }
  }
}));
const robots = await (await get("/robots.txt")).text();
if (!robots.includes("sitemap.xml")) errors.push("robots.txt: sitemap missing");
const report = { origin, checkedAt: new Date().toISOString(), pages: pages.size, assets: assets.size, anchors: anchors.length, errors };
if (reportPath) { await mkdir("tmp/forede-audit", { recursive: true }); await writeFile(reportPath, JSON.stringify(report, null, 2)); }
console.log(JSON.stringify(report, null, 2));
assert.deepEqual(errors, []);
