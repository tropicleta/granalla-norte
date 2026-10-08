import assert from "node:assert/strict";

const origin = process.argv[2] || "http://127.0.0.1:3108";
async function page(path) {
  const response = await fetch(origin + path);
  assert.equal(response.status, 200, path);
  return (await response.text()).split("<main")[1].split("</main>")[0];
}
const listing = await page("/servicios");
for (const [legacy, current] of [
  ["/servicios/minerales-no-metalicos", "/servicios/suministro-y-abastecimiento"],
  ["/servicios/minerales", "/servicios/suministro-y-abastecimiento"],
  ["/servicios/asesorias", "/servicios/monitoreo-de-tronaduras"],
  ["/noticias?rubro=minerales", "/noticias?rubro=suministro-y-abastecimiento"],
  ["/noticias?rubro=asesorias", "/noticias?rubro=monitoreo-de-tronaduras"],
]) {
  const response = await fetch(origin + legacy, { redirect: "manual" });
  assert.equal(response.status, 308, legacy);
  const destination = new URL(response.headers.get("location"), origin);
  assert.equal(destination.pathname + destination.search, current);
  assert.equal((await fetch(destination)).status, 200);
}
assert.ok(!listing.includes('href="/servicios/minerales-no-metalicos"'));
assert.ok(listing.includes('id="minerales"'));
assert.ok(listing.includes('id="asesorias"'));
assert.ok(listing.includes("Mantención integral de caminos"));
assert.ok(!listing.includes('href="/servicios/mantencion-de-caminos"'));
for (const [legacy, current] of [["/servicios/mantencion-de-caminos", "/servicios/mantencion-integral-de-caminos"], ["/noticias?rubro=mantencion-de-caminos", "/noticias?rubro=mantencion-integral-de-caminos"]]) {
  const response = await fetch(origin + legacy, { redirect: "manual" });
  assert.equal(response.status, 308, legacy);
  const destination = new URL(response.headers.get("location"), origin);
  assert.equal(destination.pathname + destination.search, current);
  assert.equal((await fetch(destination)).status, 200);
}
assert.equal((listing.match(/También puedes arrendar equipos/g) || []).length, 3);
for (const slug of ["obras-civiles", "mantencion-integral-de-caminos", "suministro-y-abastecimiento", "monitoreo-de-tronaduras"]) {
  assert.ok(listing.includes(`/noticias?rubro=${slug}`), `${slug}: sector news link`);
}
for (const slug of ["obras-civiles", "mantencion-integral-de-caminos", "suministro-y-abastecimiento"]) {
  const html = await page(`/servicios/${slug}`);
  assert.ok(html.includes("Arriendo de maquinaria"));
  assert.ok(html.includes('href="/maquinaria"'));
}
const monitoring = await page("/noticias?rubro=monitoreo-de-tronaduras");
assert.ok(monitoring.includes("monitoreo-vibraciones-primer-semestre-2024"));
assert.ok(monitoring.includes("monitores-comunitarios-segundo-semestre-2024"));
assert.ok(!monitoring.includes("ventas-de-cloruro-de-sodio-para-minera-maricunga"));
assert.ok(!monitoring.includes("expo-forede-2025"));
const supply = await page("/noticias?rubro=suministro-y-abastecimiento");
assert.ok(supply.includes("ventas-de-cloruro-de-sodio-para-minera-maricunga"));
assert.ok(!supply.includes("mejora-escuela-paul-harris"));
const civil = await page("/noticias?rubro=obras-civiles");
assert.ok(civil.includes("mejora-escuela-paul-harris"));
assert.ok(!civil.includes("monitoreo-vibraciones-primer-semestre-2024"));
const roads = await page("/noticias?rubro=mantencion-integral-de-caminos");
assert.ok(roads.includes("Aún no hay publicaciones de este rubro"));
assert.equal((roads.match(/<article /g) || []).length, 0);
const unknown = await page("/noticias?rubro=inexistente");
assert.ok(unknown.includes("expo-forede-2025"), "Unknown filters show the full listing");
console.log("PASS: machinery access in both services, four sector links, archive monitoring articles, isolated sector results and empty/unknown filters.");
