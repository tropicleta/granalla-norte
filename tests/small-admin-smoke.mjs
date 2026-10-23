import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdtemp, readFile, rm, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { unzipSync, strFromU8 } from 'fflate';
const origin = 'http://127.0.0.1:3115';
const directory = await mkdtemp(join(tmpdir(), 'gn-small-admin-'));
const bootstrap = randomBytes(24).toString('hex');
const env = { ...process.env, NEXT_BUILD_DIR: process.env.NEXT_BUILD_DIR || '.next-portal-verify', ADMIN_PASSWORD: bootstrap, CONTENT_LOCAL_DIR: directory };
for (const key of ['VERCEL', 'BLOB_STORE_ID', 'BLOB_READ_WRITE_TOKEN', 'VERCEL_OIDC_TOKEN']) delete env[key];
let server;
async function start() { server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3115'], { env, windowsHide: true, stdio: ['ignore','pipe','pipe'] }); server.stdout.on('data', d => process.stdout.write(d)); server.stderr.on('data', d => process.stderr.write(d)); for (let i=0;i<120;i++) { if (server.exitCode !== null) throw Error('Server exited'); try { if ((await fetch(origin+'/acceso')).ok) return; } catch {} await new Promise(r=>setTimeout(r,500)); } throw Error('Server did not start'); }
async function stop() { if (server && server.exitCode === null) { server.kill(); await new Promise(r=>server.once('exit',r)); } }
async function call(path, method='GET', body, cookie='', extra={}) { return fetch(origin+path,{ method, headers:{ Origin:origin,...(cookie?{Cookie:cookie}:{}),...(body && !(body instanceof FormData)?{'Content-Type':'application/json'}:{}),...extra },...(body?{body:body instanceof FormData?body:JSON.stringify(body)}:{}) }); }
async function json(response,status=200) { const value=await response.json();assert.equal(response.status,status,JSON.stringify(value));return value; }
const cookieOf=r=>r.headers.get('set-cookie').split(';')[0];
try {
 await start();
 const login=await call('/api/admin/login','POST',{username:'admin',password:bootstrap});await json(login);let admin=cookieOf(login);
 let data=await json(await call('/api/admin/mandantes','GET',undefined,admin));
 async function save(body){data=await json(await call('/api/admin/mandantes','POST',{...body,version:data.version},admin));return data;}
 const clientPassword=randomBytes(16).toString('hex');
 await save({action:'client',name:'Mandante de prueba',email:'small@example.com',active:true,password:clientPassword});const clientId=data.clients[0].id;
 await save({action:'project',clientId,name:'Proyecto principal',status:'En ejecución',partCount:2,partNames:['Primera entrega','Entrega final']});
 const project=data.clients[0].projects[0];const beforeProject=data.history[0].id;
 async function upload(name,partId=project.parts[1].id){const form=new FormData();for(const [key,value]of Object.entries({clientId,projectId:project.id,partId,version:data.version,category:'Planos'}))form.set(key,value);form.set('file',new Blob(['%PDF-1.4 '+name],{type:'application/pdf'}),name);data=await json(await call('/api/mandantes/documentos','POST',form,admin));return data.clients[0].projects.find(p=>p.id===project.id).parts.find(p=>p.id===partId).documents.at(-1);}
 const doc=await upload('plano.pdf');assert.equal(doc.category,'Planos');
 const clientLogin=await call('/api/mandantes','POST',{action:'login',email:'small@example.com',password:clientPassword});await json(clientLogin);const clientCookie=cookieOf(clientLogin);
 for(const path of ['/api/admin/resumen','/api/admin/respaldo','/api/admin/cuenta'])assert.equal((await call(path,'GET',undefined,clientCookie)).status,401,path);
 const summary=await json(await call('/api/admin/resumen','GET',undefined,admin));assert.equal(summary.clients,1);assert.equal(summary.projects,1);assert.equal(summary.pendingCount,1);
 await save({action:'renameDocument',clientId,projectId:project.id,partId:project.parts[1].id,documentId:doc.id,name:'Plano revisado',category:'Informes'});const beforeRename=data.history[0].id;
 const second=await upload('segundo.pdf');
 await save({action:'restoreSnapshot',id:beforeRename});
 assert.equal(data.clients[0].projects[0].parts[1].documents[0].name,'plano.pdf');assert.ok(data.trash.some(t=>t.document.id===second.id));
 assert.equal((await call('/api/mandantes','GET',undefined,clientCookie)).status,200,'History restore preserves client credentials');
 await save({action:'removeDocument',clientId,projectId:project.id,partId:project.parts[1].id,documentId:doc.id});const retired=data.trash.find(t=>t.document.id===doc.id);
 const filePath=`/api/mandantes/documentos?id=${doc.id}`;
 assert.equal((await call(filePath,'GET',undefined,clientCookie)).status,404);assert.equal((await call(filePath,'GET',undefined,admin)).status,200);
 const backup=await call('/api/admin/respaldo','GET',undefined,admin);assert.equal(backup.status,200);assert.match(backup.headers.get('content-type'),/zip/);
 const archive=unzipSync(new Uint8Array(await backup.arrayBuffer()));const manifestText=strFromU8(archive['proyectos.json']);const manifest=JSON.parse(manifestText);
 assert.equal(manifest.format,'granalla-norte-respaldo-v1');assert.equal(manifest.trash.length,2);assert.ok(manifest.files.some(f=>f.id===doc.id));assert.ok(manifest.files.every(f=>archive[f.archivo]));
 for(const secret of ['passwordHash','sessionVersion',clientPassword,bootstrap])assert.ok(!manifestText.includes(secret),'Backup contains no credentials');
 await save({action:'restoreDocument',id:retired.id});assert.equal((await call(filePath,'GET',undefined,clientCookie)).status,200);
 await save({action:'restoreSnapshot',id:beforeProject});assert.equal(data.clients[0].projects.length,0);assert.ok(data.trash.some(t=>t.document.id===doc.id));
 await save({action:'restoreDocument',id:data.trash.find(t=>t.document.id===doc.id).id});assert.equal(data.clients[0].projects[0].id,project.id);assert.equal(data.clients[0].projects[0].name,'Proyecto principal');assert.equal((await call(filePath,'GET',undefined,clientCookie)).status,200);
 const accountStatus=await json(await call('/api/admin/cuenta','GET',undefined,admin));assert.equal(accountStatus.recoveryReady,false);
 const passwordA=randomBytes(20).toString('hex');
 await json(await call('/api/admin/cuenta','POST',{currentPassword:'wrong',password:passwordA},admin),400);
 await json(await call('/api/admin/cuenta','POST',{currentPassword:bootstrap,password:passwordA},admin,{Origin:'https://evil.example'}),403);
 const changed=await call('/api/admin/cuenta','POST',{currentPassword:bootstrap,password:passwordA},admin);const changedData=await json(changed);const oldAdmin=admin;admin=cookieOf(changed);assert.equal(changedData.codes.length,6);
 assert.equal((await call('/api/admin/mandantes','GET',undefined,oldAdmin)).status,401);assert.equal((await call(filePath,'GET',undefined,oldAdmin)).status,401);
 const oldLoginPage=await fetch(origin+'/admin/login',{headers:{Cookie:oldAdmin},redirect:'manual'});assert.equal(oldLoginPage.status,200,'Stale cookie must not cause login redirect loop');
 await json(await call('/api/admin/login','POST',{username:'admin',password:bootstrap}),401);
 const newLogin=await call('/api/admin/login','POST',{username:'admin',password:passwordA});await json(newLogin);admin=cookieOf(newLogin);
 const passwordB=randomBytes(20).toString('hex');
 await json(await call('/api/admin/recuperar','POST',{code:'invalid',password:passwordB}),400);
 for (let i=0;i<20;i++) await json(await call('/api/admin/recuperar','POST',{code:'invalid',password:passwordB},'',{'x-vercel-forwarded-for':'192.0.2.77'}),400);
 await json(await call('/api/admin/recuperar','POST',{code:'invalid',password:passwordB},'',{'x-vercel-forwarded-for':'192.0.2.77'}),429);
 const recovered=await call('/api/admin/recuperar','POST',{code:changedData.codes[0],password:passwordB});const recoveredData=await json(recovered);const preRecovery=admin;admin=cookieOf(recovered);assert.equal(recoveredData.codes.length,6);assert.equal((await call('/api/admin/cuenta','GET',undefined,preRecovery)).status,401);
 await json(await call('/api/admin/recuperar','POST',{code:changedData.codes[0],password:passwordA}),400);
 await json(await call('/api/admin/recuperar','POST',{code:changedData.codes[1],password:passwordA}),400);
 const accountFile=await readFile(join(directory,'settings/admin-account.json'),'utf8');for(const secret of [passwordA,passwordB,...recoveredData.codes])assert.ok(!accountFile.includes(secret),'Stored account excludes plaintext passwords and recovery codes');
 await stop();await start();
 const persistedLogin=await call('/api/admin/login','POST',{username:'admin',password:passwordB});await json(persistedLogin);admin=cookieOf(persistedLogin);assert.equal((await call('/api/admin/mandantes','GET',undefined,admin)).status,200);
 if(process.env.PORTAL_PLAYWRIGHT){
  const {chromium}=await import(pathToFileURL(process.env.PORTAL_PLAYWRIGHT).href);const browser=await chromium.launch({headless:true,channel:process.env.PORTAL_BROWSER_CHANNEL||undefined});
  try{
   const context=await browser.newContext({viewport:{width:1366,height:900}});const split=admin.indexOf('=');await context.addCookies([{name:admin.slice(0,split),value:admin.slice(split+1),url:origin}]);const page=await context.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(origin+'/admin');await page.getByRole('heading',{name:'Tu espacio de trabajo'}).waitFor();await page.getByRole('heading',{name:'Por completar'}).waitFor();
   await mkdir('output/small-admin-review',{recursive:true});await page.evaluate(()=>document.fonts.ready);await page.screenshot({path:'output/small-admin-review/home-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await page.screenshot({path:'output/small-admin-review/home-mobile.png',fullPage:true});
   await page.goto(origin+'/admin/mandantes?nuevo=1');await page.getByRole('heading',{name:'Agregar mandante',exact:true}).waitFor();await page.getByLabel('Nombre o razón social').fill('Mandante desde el panel');await page.getByLabel('Correo de acceso').fill('ui-small@example.com');await page.getByLabel('Contraseña inicial').fill(randomBytes(16).toString('hex'));await page.getByRole('button',{name:'Guardar mandante',exact:true}).click();await page.getByRole('heading',{name:'Proyectos de Mandante desde el panel',exact:true}).waitFor();
   await page.getByRole('button',{name:'Agregar proyecto',exact:true}).click();await page.getByLabel('Nombre del proyecto').fill('Proyecto desde el panel');await page.getByLabel('¿Cuántas partes tiene el proyecto?').fill('2');await page.getByLabel('Nombre de la parte 2').fill('Entrega final UI');await page.getByRole('button',{name:'Guardar proyecto',exact:true}).click();await page.getByRole('heading',{name:'Proyecto desde el panel',exact:true}).waitFor();await page.locator('summary').filter({hasText:'Entrega final UI'}).click();
   const form=page.locator('form').filter({has:page.getByRole('heading',{name:'Cargar documento en Entrega final UI',exact:true})});await form.getByLabel(/^Archivo/).setInputFiles({name:'acta-entrega.pdf',mimeType:'application/pdf',buffer:Buffer.from('%PDF-1.4 UI document')});await form.getByRole('button',{name:'Subir documento',exact:true}).click();await page.getByRole('link',{name:'acta-entrega.pdf',exact:true}).waitFor();
   await page.getByLabel('Buscar documento').fill('no-coincide');assert.equal(await page.getByRole('link',{name:'acta-entrega.pdf',exact:true}).count(),0);await page.getByLabel('Buscar documento').fill('acta');await page.getByRole('link',{name:'acta-entrega.pdf',exact:true}).waitFor();await page.getByLabel('Categoría de acta-entrega.pdf').selectOption('Certificados');await page.getByRole('status').filter({hasText:'Documento actualizado'}).waitFor();
   await page.evaluate(()=>window.scrollTo(0,0));await page.screenshot({path:'output/small-admin-review/project-mobile.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.goto(origin+'/admin/respaldos');await page.getByRole('heading',{name:/Papelera/}).waitFor();await page.screenshot({path:'output/small-admin-review/backups-mobile.png',fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));
   await page.goto(origin+'/admin/cuenta');await page.getByRole('heading',{name:'Tu cuenta de administración'}).waitFor();await page.screenshot({path:'output/small-admin-review/account-mobile.png',fullPage:true});assert.deepEqual(errors,[]);await context.close();
  }finally{await browser.close();}
 }
 console.log('Small admin checks passed: real dashboard, categories/search, UI client/project/upload flow, trash recovery, project/history restore, complete private ZIP, credential-safe backups, admin password change and recovery, session invalidation, persistence, responsive pages.');
}finally{await stop();await rm(directory,{recursive:true,force:true});}
