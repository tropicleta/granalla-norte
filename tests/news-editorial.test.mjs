import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const load = name => JSON.parse(readFileSync(new URL(`../src/lib/${name}`, import.meta.url), 'utf8'));
const projects = load('project-news.json');
const editorial = load('news-editorial.json');
const exports = {};
const code = ts.transpileModule(readFileSync(new URL('../src/lib/news-editorial.ts', import.meta.url),'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
vm.runInNewContext(code,{exports,require:name=>({default:name==='./project-news.json'?projects:editorial})});
const original={slug:'monitoreo-vibraciones-primer-semestre-2024', title:'Anterior', excerpt:'Anterior',body:['Anterior'],date:'2024-03-14',category:'Monitoreo personalizado',status:'draft',images:['/api/media/00000000-0000-0000-0000-000000000000.webp'],image:'/api/media/00000000-0000-0000-0000-000000000000.webp',client:'Cliente guardado',updatedAt:'2024-03-14T12:00:00Z'};
let articles=exports.withEditorialNews([original]);
assert.equal(articles.length,8);
const revised=articles[0];
for(const field of ['date','category','status','image','images','client']) assert.deepEqual(revised[field],original[field],`Preserves ${field}`);
assert.equal(revised.title,editorial[original.slug].title);
assert.equal(revised.editorialRevision,exports.NEWS_EDITORIAL_REVISION);
const custom={...revised,title:'Edición posterior del administrador',body:['Contenido posterior'],status:'published'};
articles=exports.withEditorialNews([custom,...articles.slice(1)]);
assert.equal(articles.length,8,'No duplicate imports');
assert.equal(articles[0].title,custom.title,'Future edits take precedence');
assert.deepEqual(articles[0].body,custom.body);
const imported=articles.find(p=>p.slug===projects[0].slug);
assert.equal(exports.withEditorialNews([{...imported,status:'draft',title:'Nueva edición'}]).find(p=>p.slug===imported.slug).status,'draft');
assert.equal(exports.withEditorialNews([{...original,category:'Eventos'}])[0].category,'Monitoreo de tronaduras');
assert.equal(Object.keys(editorial).length,10);
assert.equal(projects.length,7);
assert.equal(new Set(projects.map(p=>p.slug)).size,7);
for(const article of projects){
 assert.equal(article.body.length,3);
 assert.ok(article.highlights.length>=3);
 assert.ok(article.excerpt.length<200);
 for(const image of article.images) assert.ok(existsSync(new URL('../public'+image,import.meta.url)),image);
 const publicText=JSON.stringify(article);
 assert.ok(!/\$|450026|77\.144|Nuxia|Carlos Tapia|Pablo Angulo|Brodifacoum|estado de pago|valor neto|\bIVA\b/i.test(publicText),'No internal or contractual details');
}
assert.match(projects.find(p=>p.slug.includes('sala-de-la-calma')).imageCaption,/archivo/);
console.log('PASS: seven sourced projects, privacy, photo assets, one-time editorial edition, retained media/drafts/categories and future admin edits.');
