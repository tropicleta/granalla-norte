// Run against a local instance: node tests/seo-smoke.mjs http://localhost:3107
import assert from "node:assert/strict";

const origin = process.argv[2] || "http://localhost:3000";
const domain = "https://www.granallanorte.cl";
const services = ["mantencion-de-caminos", "minerales-no-metalicos", "monitoreo-de-tronaduras", "obras-civiles"];
const paths = ["/", "/servicios", "/maquinaria", "/equipos-monitoreo", "/nosotros", "/contacto", "/noticias", ...services.map(slug => `/servicios/${slug}`)];
const sitemapResponse = await fetch(`${origin}/sitemap.xml`);
assert.equal(sitemapResponse.status, 200);
const sitemap = await sitemapResponse.text();
for (const path of paths) {
  const response = await fetch(`${origin}${path}`);
  assert.equal(response.status, 200, path);
  const html = await response.text();
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${path}: one heading`);
  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/);
  assert.equal(canonical?.[1], path === "/" ? domain : `${domain}${path}`, `${path}: canonical`);
  assert.ok(sitemap.includes(`<loc>${path === "/" ? domain : domain + path}</loc>`), `${path}: sitemap`);
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
  assert.ok(schemas.some(schema => schema["@id"] === `${domain}/#empresa`), `${path}: business`);
  if (path.startsWith("/servicios/")) {
    const graph = schemas.find(schema => schema["@graph"])?.["@graph"];
    assert.ok(graph?.some(schema => schema["@type"] === "Service" && schema.provider["@id"] === `${domain}/#empresa`), `${path}: service`);
    assert.ok(graph?.some(schema => schema["@type"] === "BreadcrumbList"), `${path}: breadcrumbs`);
  }
}
const missing = await fetch(`${origin}/servicios/servicio-inexistente`);
assert.equal(missing.status, 404);
const articlePath = "/noticias/ventas-de-cloruro-de-sodio-para-minera-maricunga";
const article = await fetch(`${origin}${articlePath}`);
assert.equal(article.status, 200);
const articleHtml = await article.text();
assert.ok(articleHtml.includes(`<link rel="canonical" href="${domain}${articlePath}"`));
const articleSchemas = [...articleHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(match => JSON.parse(match[1]));
assert.ok(articleSchemas.some(schema => schema["@type"] === "Article" && schema.mainEntityOfPage === domain + articlePath));
const login = await fetch(`${origin}/admin/login`);
assert.ok(login.headers.get("x-robots-tag")?.includes("noindex"));
const robots = await fetch(`${origin}/robots.txt`);
assert.ok((await robots.text()).includes(`Sitemap: ${domain}/sitemap.xml`));
console.log(`SEO smoke passed: ${paths.length} pages, article, sitemap, structured data, 404 and private login.`);
