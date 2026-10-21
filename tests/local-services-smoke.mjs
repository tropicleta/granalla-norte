import assert from "node:assert/strict";
const origin = process.argv[2] || "http://127.0.0.1:3119";
const paths = ["/servicios/obras-civiles", "/servicios/mantencion-integral-de-caminos", "/servicios/suministro-y-abastecimiento", "/servicios/monitoreo-de-tronaduras", "/maquinaria", "/equipos-monitoreo"];
for (const path of paths) {
  const response = await fetch(origin + path);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.ok(html.match(/<title>[^<]*Copiapó[^<]*<\/title>/), `${path}: service and city in search title`);
  const main = html.split("<main")[1].split("</main>")[0];
  assert.ok(main.includes('aria-label="Cobertura y coordinación del servicio"'), path);
  for (const place of ["Tierra Amarilla", "Copiapó", "Atacama"]) assert.ok(main.includes(place), `${path}: ${place}`);
  assert.ok(main.includes('href="tel:+56983312335"'));
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  const business = schemas.find(schema => schema["@type"] === "LocalBusiness");
  assert.ok(business.sameAs.includes(business.hasMap), "Website linked to the verified Maps profile");
  assert.ok(business.hasMap.includes("0x7fa5da5fda12113d"), "Correct Granalla Norte profile");
  assert.equal(business.hasOfferCatalog.itemListElement.length, 6);
  assert.equal(business.address.streetAddress, undefined, "No private street address published");
  for (const servicePath of paths) assert.ok(business.hasOfferCatalog.itemListElement.some(offer => offer.itemOffered.url === `https://www.granallanorte.cl${servicePath}`));
  assert.ok(business.areaServed.some(area => area["@type"] === "City" && area.name === "Tierra Amarilla"));
}
console.log("PASS: six local services, business service catalog, coverage, phone and address privacy.");
