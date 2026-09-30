import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import assert from "node:assert/strict";
import sharp from "sharp";

const origin = "http://127.0.0.1:3102";
const password = randomBytes(24).toString("hex");
const directory = await mkdtemp(join(tmpdir(), "granalla-cms-test-"));
const env = { ...process.env, NEXT_BUILD_DIR: ".next-verification", ADMIN_PASSWORD: password, CONTENT_LOCAL_DIR: directory };
delete env.VERCEL; delete env.BLOB_READ_WRITE_TOKEN; delete env.BLOB_STORE_ID; delete env.VERCEL_OIDC_TOKEN;
let server;
async function start() {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3102"], { env, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
  server.stdout.on("data", d => process.stdout.write(d)); server.stderr.on("data", d => process.stderr.write(d));
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error("Server exited");
    try { if ((await fetch(origin)).ok) return; } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error("Server did not start");
}
async function stop() { if (server?.exitCode === null) { const ended = new Promise(r => server.once("exit", r)); server.kill(); await ended; } }
let cookie = "";
function call(path, method = "GET", body, authenticated = true, extraHeaders = {}) {
  return fetch(origin + path, { method, redirect: "manual", headers: { Origin: origin, ...(authenticated ? { Cookie: cookie } : {}), ...(body ? { "Content-Type": "application/json" } : {}), ...extraHeaders }, ...(body ? { body: JSON.stringify(body) } : {}) });
}
async function json(response, status = 200) { assert.equal(response.status, status, await response.clone().text()); return response.json(); }
try {
  await start();
  for (const path of ["/api/admin/noticias", "/api/admin/mensajes", "/api/admin/imagenes"]) assert.equal((await call(path, path.endsWith("imagenes") ? "POST" : "GET", undefined, false)).status, 401);
  const login = await call("/api/admin/login", "POST", { username: "admin", password }, false);
  assert.equal(login.status, 200); cookie = login.headers.get("set-cookie").split(";")[0];
  for (const path of ["/admin/noticias", "/admin/mensajes"]) assert.equal((await call(path)).status, 200);
  let catalog = await json(await call("/api/admin/noticias"));
  assert.equal(catalog.articles.length, 11); assert.equal(catalog.configured, true);
  assert.equal(catalog.articles.filter(p => p.status === "published").length, 10);
  assert.equal(catalog.articles.find(p => p.slug === "mejora-sede-social-hermanos-carrizos").status, "draft");
  assert.equal((await call("/noticias/mejora-sede-social-hermanos-carrizos", "GET", undefined, false)).status, 404);
  const oldArticle = catalog.articles[0];
  const edited = { ...oldArticle, title: "Título editado de noticia anterior", category: "Monitoreo de tronaduras" };
  let saved = await json(await call("/api/admin/noticias", "PUT", { article: edited, version: catalog.version }));
  assert.ok((await (await call(`/noticias/${oldArticle.slug}`, "GET", undefined, false)).text()).includes(edited.title));
  assert.equal(saved.article.category, edited.category);
  for (const category of ["", "x", "x".repeat(61), null, "Categoría\ninválida"]) {
    assert.equal((await call("/api/admin/noticias", "PUT", { article: { ...edited, category }, version: saved.version })).status, 422);
  }
  const recovered = catalog.articles.find(p => p.slug === "seminario-del-mes-de-la-mineria-2024");
  saved = await json(await call("/api/admin/noticias", "PUT", { article: { ...recovered, title: "Seminario recuperado editado", status: "draft" }, version: saved.version }));
  const afterRecoveryEdit = await json(await call("/api/admin/noticias"));
  assert.equal(afterRecoveryEdit.articles.filter(p => p.slug === recovered.slug).length, 1);
  assert.equal(afterRecoveryEdit.articles.find(p => p.slug === recovered.slug).title, "Seminario recuperado editado");
  assert.equal((await call(`/noticias/${recovered.slug}`, "GET", undefined, false)).status, 404, "Recovered entries keep saved draft states");
  assert.equal((await call("/api/admin/noticias", "PUT", { article: oldArticle, version: catalog.version })).status, 409);
  assert.equal((await call("/api/admin/noticias", "PUT", { article: oldArticle, version: saved.version }, true, { Origin: "https://evil.example" })).status, 403);
  const upload = new FormData();
  upload.set("file", new Blob([await sharp({ create: { width: 80, height: 60, channels: 3, background: "#667044" } }).png().toBuffer()], { type: "image/png" }), "test.png");
  const image = await json(await fetch(origin + "/api/admin/imagenes", { method: "POST", headers: { Origin: origin, Cookie: cookie }, body: upload }), 201);
  assert.equal((await call(image.url, "GET", undefined, false)).status, 404, "Unpublished images stay private");
  assert.equal((await call(image.url)).status, 200);
  const draft = { ...oldArticle, slug: "prueba-noticia-nueva", title: "Noticia de prueba nueva", category: "  Capacitación   comunitaria  ", status: "draft", images: [image.url], date: "2026-09-30", body: ["Texto de prueba <script>alert(1)</script>"] };
  saved = await json(await call("/api/admin/noticias", "POST", { article: draft, version: saved.version }), 201);
  assert.equal(saved.article.category, "Capacitación comunitaria");
  assert.equal((await call(`/noticias/${draft.slug}`, "GET", undefined, false)).status, 404);
  assert.ok(!(await (await call("/noticias", "GET", undefined, false)).text()).includes(draft.title));
  const published = { ...saved.article, status: "published" };
  saved = await json(await call("/api/admin/noticias", "PUT", { article: published, version: saved.version }));
  for (const path of ["/", "/noticias", `/noticias/${draft.slug}`, "/sitemap.xml"]) {
    const response = await call(path, "GET", undefined, false); assert.equal(response.status, 200);
    assert.ok((await response.text()).includes(path === "/sitemap.xml" ? draft.slug : draft.title));
  }
  const html = await (await call(`/noticias/${draft.slug}`, "GET", undefined, false)).text();
  assert.ok(html.includes("&lt;script&gt;"), "Article body rendered as text, not HTML");
  assert.equal((await call(image.url, "GET", undefined, false)).status, 200);
  assert.equal((await call("/api/admin/noticias", "POST", { article: published, version: saved.version })).status, 409, "Duplicate slug rejected");
  assert.equal((await call("/api/admin/noticias", "PUT", { article: { ...published, images: ["https://evil.example/image.svg"] }, version: saved.version })).status, 422);
  saved = await json(await call("/api/admin/noticias", "PUT", { article: { ...published, status: "draft" }, version: saved.version }));
  assert.equal((await call(image.url, "GET", undefined, false)).status, 404, "Unpublishing removes public image access");
  const invalidImage = new FormData(); invalidImage.set("file", new Blob(["<svg onload='alert(1)'/>"], { type: "image/png" }), "fake.png");
  assert.equal((await fetch(origin + "/api/admin/imagenes", { method: "POST", headers: { Origin: origin, Cookie: cookie }, body: invalidImage })).status, 422);
  const contact = { nombre: "Consulta de prueba", email: "test@example.com", mensaje: "Mensaje privado de prueba de integración", empresa: "Empresa de prueba", telefono: "", servicio: "Obras civiles" };
  assert.equal((await call("/api/contacto", "POST", contact, false, { Origin: "https://evil.example" })).status, 403);
  assert.equal((await call("/api/contacto", "POST", { ...contact, email: "invalid" }, false)).status, 422);
  assert.equal((await call("/api/contacto", "POST", contact, false)).status, 201);
  let inbox = await json(await call("/api/admin/mensajes")); assert.equal(inbox.messages.length, 1); assert.equal(inbox.messages[0].mensaje, contact.mensaje);
  const originalMessage = inbox.messages[0];
  let updated = await json(await call("/api/admin/mensajes", "PATCH", { id: originalMessage.id, status: "read", version: originalMessage.version }));
  assert.equal(updated.message.status, "read");
  assert.equal((await call("/api/admin/mensajes", "PATCH", { id: originalMessage.id, status: "archived", version: originalMessage.version })).status, 409);
  updated = await json(await call("/api/admin/mensajes", "PATCH", { id: originalMessage.id, status: "archived", version: updated.version }));
  assert.equal(updated.message.status, "archived");
  for (let i = 0; i < 4; i++) assert.equal((await call("/api/contacto", "POST", contact, false)).status, 201);
  assert.equal((await call("/api/contacto", "POST", contact, false)).status, 429);
  assert.equal((await call("/api/contacto", "POST", { ...contact, website: "spam" }, false)).status, 200);
  inbox = await json(await call("/api/admin/mensajes")); assert.equal(inbox.messages.length, 5);
  await stop(); await start();
  catalog = await json(await call("/api/admin/noticias")); assert.equal(catalog.articles.length, 12); assert.equal(catalog.articles.find(p => p.slug === oldArticle.slug).title, edited.title);
  assert.equal(catalog.articles.find(p => p.slug === oldArticle.slug).category, "Monitoreo de tronaduras");
  assert.equal(catalog.articles.find(p => p.slug === draft.slug).category, "Capacitación comunitaria");
  inbox = await json(await call("/api/admin/mensajes")); assert.equal(inbox.messages.length, 5); assert.equal(inbox.messages.find(m => m.id === originalMessage.id).status, "archived");
  assert.equal((await call("/api/contacto", "POST", contact, false)).status, 429, "Quota survives a process restart");
  await stop(); delete env.CONTENT_LOCAL_DIR; await start();
  assert.equal((await call("/api/contacto", "POST", contact, false)).status, 503, "Never report receipt without persistent storage");
  assert.equal((await call("/api/admin/mensajes")).status, 503);
  const unavailable = await json(await call("/api/admin/noticias")); assert.equal(unavailable.configured, false); assert.equal(unavailable.articles.length, 11);
  console.log("PASS: legacy edit, new draft, image upload/privacy, publish/unpublish, public listing/detail/sitemap, conflicting writes, input validation, contact persistence, private inbox, archive/read, distributed quota and server restart.");
} finally {
  await stop();
  if (dirname(resolve(directory)) === resolve(tmpdir()) && basename(directory).startsWith("granalla-cms-test-")) await rm(directory, { recursive: true, force: true });
}
