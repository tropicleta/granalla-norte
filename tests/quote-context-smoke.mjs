import assert from "node:assert/strict";

const origin = process.argv[2] || "http://127.0.0.1:3108";
async function page(path) {
  const response = await fetch(origin + path);
  assert.equal(response.status, 200, path);
  return (await response.text()).split("<main")[1].split("</main>")[0];
}
for (const path of ["/maquinaria", "/equipos-monitoreo"]) {
  const html = await page(path);
  const links = [...html.matchAll(/href="(\/contacto\?equipo=[^"]+)"/g)];
  assert.ok(links.length, `Equipment quote links: ${path}`);
  for (const [, link] of links) {
    const name = new URL(link.replaceAll("&amp;", "&"), origin).searchParams.get("equipo");
    assert.ok(name?.length, "Equipment name supplied");
    const contact = await page(link);
    if (contact.includes('name="mensaje"')) {
      assert.ok(contact.includes("Solicito cotización de arriendo de"), "Quote message prefilled");
      assert.match(contact, /<option[^>]*selected=""[^>]*>Arriendo de maquinaria y equipos<\/option>/);
    } else {
      assert.ok(contact.includes(encodeURIComponent(`Arriendo de ${name}`)), "Email keeps selected equipment");
    }
  }
}
for (const [slug, title] of [
  ["obras-civiles", "Obras civiles y movimiento de tierra"],
  ["mantencion-integral-de-caminos", "Mantención integral de caminos mineros"],
  ["suministro-y-abastecimiento", "Suministro y abastecimiento"],
  ["monitoreo-de-tronaduras", "Monitoreo de tronaduras"],
]) {
  const service = await page(`/servicios/${slug}`);
  assert.ok(service.includes(`/contacto?servicio=${slug}`), `Service quote link: ${slug}`);
  const contact = await page(`/contacto?servicio=${slug}`);
  if (contact.includes('name="servicio"')) {
    assert.ok(contact.includes(`selected="">${title}</option>`), `Selected service: ${slug}`);
  } else {
    assert.ok(contact.includes(encodeURIComponent(`Cotización: ${title}`)), `Email service: ${slug}`);
  }
}
const malicious = await page("/contacto?equipo=" + encodeURIComponent('<script>alert("test")</script>'));
assert.ok(!malicious.includes('<script>alert("test")</script>'), "Query text cannot inject HTML");
const home = await page("/");
assert.ok(home.includes("Proyectos destacados en faena y comunidad"));
assert.ok(home.includes("Pausar logos"));
console.log("PASS: equipment quotes, four selected services, safe query text and updated homepage.");
