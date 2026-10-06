import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve, dirname, basename } from "node:path";
import assert from "node:assert/strict";
import sharp from "sharp";

const origin = "http://127.0.0.1:3110";
const password = randomBytes(24).toString("hex");
const directory = await mkdtemp(join(tmpdir(), "granalla-monitoring-test-"));
const env = { ...process.env, NEXT_BUILD_DIR: ".next-verification", ADMIN_PASSWORD: password, CONTENT_LOCAL_DIR: directory };
for (const key of ["VERCEL", "BLOB_READ_WRITE_TOKEN", "BLOB_STORE_ID", "VERCEL_OIDC_TOKEN"]) delete env[key];
let server, cookie = "";
async function start() {
  server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3110"], { env, stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
  server.stdout.on("data", d => process.stdout.write(d)); server.stderr.on("data", d => process.stderr.write(d));
  for (let i = 0; i < 90; i++) {
    if (server.exitCode !== null) throw new Error("Server exited");
    try { if ((await fetch(origin, { signal: AbortSignal.timeout(2000) })).ok) return; } catch {}
    await new Promise(r => setTimeout(r, 500));
  }
  throw new Error("Server did not start");
}
async function stop() { if (server?.exitCode === null) { const ended = new Promise(r => server.once("exit", r)); server.kill(); await ended; } }
function call(path, method = "GET", body, authenticated = true, extraHeaders = {}) {
  return fetch(origin + path, { method, redirect: "manual", signal: AbortSignal.timeout(15000), headers: { Origin: origin, ...(authenticated ? { Cookie: cookie } : {}), ...(body ? { "Content-Type": "application/json" } : {}), ...extraHeaders }, ...(body ? { body: JSON.stringify(body) } : {}) });
}
async function json(response, status = 200) { assert.equal(response.status, status, await response.clone().text()); return response.json(); }
const endpoint = "/api/admin/equipos-monitoreo";
try {
  await writeFile(join(directory, "monitoring-equipment.json"), JSON.stringify(["instantel-equipo-2", "instantel-equipo-5", "instantel-equipo-6", "minimate-pro4", "minimate-pro6", "geofono-triaxial"].map(id => ({ id, name: "Ficha anterior por unidad", status: "published", updatedAt: "", image: "" }))));
  await start();
  for (const method of ["GET", "POST", "PUT"]) assert.equal((await call(endpoint, method, undefined, false)).status, 401);
  const login = await call("/api/admin/login", "POST", { username: "admin", password }, false);
  assert.equal(login.status, 200); cookie = login.headers.get("set-cookie").split(";")[0];
  assert.equal((await call("/admin/equipos-monitoreo")).status, 200);
  assert.equal((await call("/admin/equipos-monitoreo", "GET", undefined, false)).status, 307);
  let catalog = await json(await call(endpoint));
  assert.equal(catalog.machines.length, 2); assert.equal(catalog.machines.filter(m => m.status === "published").length, 2);
  let publicHtml = await (await call("/equipos-monitoreo", "GET", undefined, false)).text();
  assert.ok(publicHtml.includes("Minimate Plus")); assert.ok(!publicHtml.includes("Minimate Pro4")); assert.ok(!publicHtml.includes("Minimate Pro6"));
  assert.ok(!publicHtml.includes("Certificado aportado")); assert.ok(!publicHtml.includes("Equipo 2")); assert.ok(publicHtml.includes("Contamos con equipos")); assert.ok(!publicHtml.split("</main>")[0].includes("Fotografía referencial"));
  for (const path of ["/", "/servicios", "/servicios/monitoreo-de-tronaduras"]) assert.ok((await (await call(path, "GET", undefined, false)).text()).includes('href="/equipos-monitoreo"'), path);
  const unit = catalog.machines[0];
  assert.equal((await call(endpoint, "PUT", { machine: unit, version: catalog.version }, true, { Origin: "https://evil.example" })).status, 403);
  for (const patch of [{ type: "Excavadora" }, { image: "https://evil.example/photo.png" }, { calibrationDate: "2024-02-30" }, { calibrationDate: "2099-01-01" }]) assert.equal((await call(endpoint, "PUT", { machine: { ...unit, ...patch }, version: catalog.version })).status, 422);
  const form = new FormData(); form.set("file", new Blob([await sharp({ create: { width: 40, height: 40, channels: 3, background: "#515137" } }).png().toBuffer()], { type: "image/png" }), "test.png");
  const uploaded = await json(await fetch(origin + "/api/admin/imagenes", { method: "POST", headers: { Origin: origin, Cookie: cookie }, body: form }), 201);
  const draft = { ...unit, name: "Equipo de monitoreo editado", serial: "SERIE-EDITADA", calibrationDate: "2026-09-01", image: uploaded.url, status: "draft" };
  let saved = await json(await call(endpoint, "PUT", { machine: draft, version: catalog.version }));
  assert.equal((await call(uploaded.url, "GET", undefined, false)).status, 404);
  assert.ok(!(await (await call("/equipos-monitoreo", "GET", undefined, false)).text()).includes(draft.name));
  assert.equal((await call(endpoint, "PUT", { machine: draft, version: catalog.version })).status, 409);
  saved = await json(await call(endpoint, "PUT", { machine: { ...draft, status: "published" }, version: saved.version }));
  assert.equal((await call(uploaded.url, "GET", undefined, false)).status, 200);
  publicHtml = await (await call("/equipos-monitoreo", "GET", undefined, false)).text(); assert.ok(publicHtml.includes(draft.name));
  assert.equal((await call(endpoint, "POST", { machine: draft, version: saved.version })).status, 409);
  saved = await json(await call(endpoint, "POST", { machine: { ...draft, id: "nuevo-geofono", type: "Geófono triaxial" }, version: saved.version }), 201);
  await stop(); await start();
  catalog = await json(await call(endpoint)); assert.equal(catalog.machines.length, 3); assert.equal(catalog.machines.find(m => m.id === unit.id).serial, draft.serial);
  assert.equal(catalog.machines.find(m => m.id === unit.id).calibrationDate, draft.calibrationDate);
  saved = await json(await call(endpoint, "PUT", { machine: { ...draft, status: "draft" }, version: catalog.version }));
  assert.equal((await call(uploaded.url, "GET", undefined, false)).status, 404);
  assert.equal((await json(await call("/api/admin/maquinaria"))).machines.length, 9, "Monitoring uses separate persistent storage");
  console.log("PASS: monitoring access, admin authentication/origin, validation, drafts, photo privacy, publication, concurrent writes, new equipment and persistence after restart.");
} finally {
  await stop();
  if (dirname(resolve(directory)) === resolve(tmpdir()) && basename(directory).startsWith("granalla-monitoring-test-")) await rm(directory, { recursive: true, force: true });
}
