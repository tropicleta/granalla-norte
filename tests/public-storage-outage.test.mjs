import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import { resolve, dirname } from "node:path";
import vm from "node:vm";
import ts from "typescript";

const nativeRequire = createRequire(import.meta.url);
function scenario(read) {
  const modules = new Map(), tags = [], policies = [], errors = [];
  let writes = 0;
  function load(file) {
    if (modules.has(file)) return modules.get(file).exports;
    if (file.endsWith(".json")) return JSON.parse(readFileSync(file, "utf8"));
    const module = { exports: {} }; modules.set(file, module);
    const code = ts.transpileModule(readFileSync(file, "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
    const require = name => {
      if (name === "react") return { cache: fn => fn };
      if (name === "next/cache") return { unstable_cache: (fn, keys, options) => { policies.push(options); return fn; }, revalidateTag: tag => tags.push(tag) };
      if (name === "./content-storage") return { storageConfigured: () => true, readJson: read, writeJson: async () => { writes++; return "next-version"; } };
      if (name.startsWith(".")) {
        const target = resolve(dirname(file), name);
        return load(existsSync(target) ? target : target + ".ts");
      }
      return nativeRequire(name);
    };
    vm.runInNewContext(code, { module, exports: module.exports, require, process, URL, console: { error: (...args) => errors.push(args) } });
    return module.exports;
  }
  return { load: name => load(resolve("src/lib", name + ".ts")), tags, policies, errors, writes: () => writes };
}
const outage = scenario(async () => { throw new Error("Vercel Blob: Failed to fetch blob: 403 Forbidden"); });
for (const [file, publicMethod, adminMethod] of [["content", "publishedArticles", "catalog"], ["machinery", "publishedMachines", "machineryCatalog"], ["monitoring", "publishedMonitoringEquipment", "monitoringCatalog"]]) {
  const catalog = outage.load(file);
  const publicItems = await catalog[publicMethod]();
  assert.ok(publicItems.length > 0, file + " public fallback remains available");
  assert.ok(publicItems.every(item => item.status === "published"), "No drafts in public fallback");
  await assert.rejects(catalog[adminMethod](), /403 Forbidden/, "Admin must not substitute defaults for saved data");
}
assert.equal(outage.writes(), 0, "Outage cannot overwrite stored data");
assert.equal(outage.errors.length, 3, "Failures remain visible in server logs");
assert.ok(outage.policies.every(policy => policy.revalidate === 300 && policy.tags.length === 1));

const healthy = scenario(async () => null);
const news = healthy.load("content");
const current = await news.catalog();
const article = { ...current.articles.find(item => item.status === "published"), title: "Administrator edit", status: "draft" };
await news.saveArticle(article, "initial", false);
assert.equal(healthy.writes(), 1);
assert.ok(healthy.tags.includes("public-news"), "Successful edit immediately invalidates public cache");
const stored = scenario(async () => ({ value: [article], etag: "saved" }));
assert.ok(!(await stored.load("content").publishedArticles()).some(item => item.slug === article.slug), "Saved drafts stay private while storage is healthy");
console.log("Public storage outage checks passed: public fallback, draft privacy, strict admin reads, no writes and cache invalidation.");
