import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

const storage = await mkdtemp(join(tmpdir(), "granalla-excavator-visibility-"));
const origin = "http://127.0.0.1:3124";
const path = "/maquinaria/excavadoras";
const machines = ["excavadora-doosan-dx225", "excavadora-doosan-dx210"].map(id => ({
  id, type: "Excavadora", name: "BORRADOR PRIVADO", model: "", capacity: "", description: "Antecedentes privados sin publicar.", image: "",
  availability: "confirm", status: "draft", demo: false, updatedAt: "2026-10-22T12:00:00.000Z",
}));
const save = () => writeFile(join(storage, "machinery.json"), JSON.stringify(machines));
await save();
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3124"], {
  env: { ...process.env, CONTENT_LOCAL_DIR: storage, VERCEL: "", NEXT_BUILD_DIR: ".next" }, windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
server.stdout.on("data", chunk => { output += chunk; });
server.stderr.on("data", chunk => { output += chunk; });
try {
  let ready = false;
  for (let i = 0; i < 60; i++) {
    if (server.exitCode !== null) throw new Error(output);
    try { ready = (await fetch(`${origin}/maquinaria`)).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert.ok(ready, output);
  let response = await fetch(origin + path);
  assert.equal(response.status, 404, "No indexable category without real published excavators");
  assert.ok(!(await response.text()).includes("BORRADOR PRIVADO"));
  assert.ok(!(await (await fetch(`${origin}/sitemap.xml`)).text()).includes(`<loc>https://www.granallanorte.cl${path}</loc>`));
  assert.ok(!(await (await fetch(`${origin}/maquinaria`)).text()).includes(`href="${path}"`));
  machines[0] = { ...machines[0], status: "published", name: "Excavadora de prueba publicada", description: "Descripción técnica de la excavadora publicada.", availability: "maintenance" };
  await save();
  response = await fetch(origin + path);
  assert.equal(response.status, 200, "Category follows current CMS publication state");
  const html = await response.text();
  assert.ok(html.includes("Excavadora de prueba publicada"));
  assert.ok(html.includes("En mantención"), "Maintenance is not presented as available");
  assert.ok(!html.includes("BORRADOR PRIVADO"));
  assert.ok(html.includes('href="/contacto?equipo=Excavadora%20de%20prueba%20publicada"'));
  assert.ok((await (await fetch(`${origin}/sitemap.xml`)).text()).includes(`<loc>https://www.granallanorte.cl${path}</loc>`));
  machines[0].status = "draft";
  await save();
  assert.equal((await fetch(origin + path)).status, 404, "Unpublishing removes the category without a rebuild");
  console.log("PASS: excavator page and sitemap respect publication state, private drafts, maintenance and equipment quote context.");
} finally {
  server.kill();
}
