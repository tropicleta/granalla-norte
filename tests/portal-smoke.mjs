import { spawn } from 'node:child_process';
import { randomBytes } from 'node:crypto';
import { mkdtemp, rm, readFile, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import assert from 'node:assert/strict';
import { pathToFileURL } from 'node:url';
const origin = 'http://127.0.0.1:3114';
const directory = await mkdtemp(join(tmpdir(), 'gn-portal-test-'));
const password = randomBytes(24).toString('hex');
const env = { ...process.env, NEXT_BUILD_DIR: process.env.NEXT_BUILD_DIR || '.next-portal-check', ADMIN_PASSWORD: password, CONTENT_LOCAL_DIR: directory };
for (const key of ['VERCEL', 'BLOB_STORE_ID', 'BLOB_READ_WRITE_TOKEN', 'VERCEL_OIDC_TOKEN']) delete env[key];
let server;
async function start() {
  server = spawn(process.execPath, ['node_modules/next/dist/bin/next', 'start', '--hostname', '127.0.0.1', '--port', '3114'], { env, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] });
  server.stdout.on('data', d => process.stdout.write(d)); server.stderr.on('data', d => process.stderr.write(d));
  for (let i = 0; i < 120; i++) { if (server.exitCode !== null) throw new Error('Server exited'); try { if ((await fetch(origin + '/acceso')).ok) return; } catch {} await new Promise(r => setTimeout(r, 500)); }
  throw new Error('Server did not start');
}
async function stop() { if (server && server.exitCode === null) { server.kill(); await new Promise(r => server.once('exit', r)); } }
async function call(path, method = 'GET', body, cookie = '', extra = {}) {
  return fetch(origin + path, { method, headers: { Origin: origin, ...(cookie ? { Cookie: cookie } : {}), ...(body && !(body instanceof FormData) ? { 'Content-Type': 'application/json' } : {}), ...extra }, ...(body ? { body: body instanceof FormData ? body : JSON.stringify(body) } : {}) });
}
async function json(response, status = 200) { const data = await response.json(); assert.equal(response.status, status, JSON.stringify(data)); return data; }
const cookieOf = response => response.headers.get('set-cookie').split(';')[0];
try {
  await start();
  const legacy = await fetch(origin + '/mandantes', { redirect: 'manual' });
  assert.equal(legacy.status, 308); assert.equal(new URL(legacy.headers.get('location'), origin).pathname, '/acceso');
  assert.match((await call('/api/admin/mandantes')).headers.get('cache-control'), /no-store/);
  assert.equal((await call('/api/admin/mandantes')).status, 401);
  assert.equal((await call('/api/mandantes')).status, 401);
  assert.equal((await call('/api/mandantes/documentos?id=anything')).status, 401);
  const login = await call('/api/admin/login', 'POST', { username: 'admin', password }); await json(login); const admin = cookieOf(login);
  await json(await call('/api/admin/login', 'POST', { username: 'admin', password: 'x'.repeat(5000) }), 413);
  await json(await call('/api/admin/login', 'POST', []), 401);
  let data = await json(await call('/api/admin/mandantes', 'GET', undefined, admin));
  const save = async body => { data = await json(await call('/api/admin/mandantes', 'POST', { ...body, version: data.version }, admin)); return data; };
  const aPassword = randomBytes(16).toString('hex'); const bPassword = randomBytes(16).toString('hex');
  await save({ action: 'client', name: 'Mandante A', email: 'a@example.com', password: aPassword, active: true });
  const aId = data.clients[0].id;
  await save({ action: 'client', name: 'Mandante B', email: 'b@example.com', password: bPassword, active: true });
  const bId = data.clients[1].id;
  assert.ok(!JSON.stringify(data).includes('passwordHash')); assert.ok(!JSON.stringify(data).includes('sessionVersion'));
  await json(await call('/api/admin/mandantes', 'POST', { action: 'client', name: 'Duplicate', email: 'A@example.com', password: aPassword, active: true, version: data.version }, admin), 400);
  await save({ action: 'project', clientId: aId, name: 'Proyecto A', status: 'En ejecución', partCount: 2, partNames: ['Primera entrega', 'Segunda entrega'] });
  const project = data.clients[0].projects[0];
  await save({ action: 'project', clientId: bId, name: 'Proyecto B', status: 'En preparación', partCount: 1 });
  const staleVersion = data.version;
  await save({ action: 'project', clientId: aId, id: project.id, name: 'Proyecto A editado', description: 'Documentación de obra', status: 'En ejecución', partCount: 2, partNames: ['Primera entrega', 'Segunda entrega'] });
  await json(await call('/api/admin/mandantes', 'POST', { action: 'client', name: 'Stale', email: 'stale@example.com', password: aPassword, active: true, version: staleVersion }, admin), 409);
  const upload = new FormData(); for (const [key, value] of Object.entries({ clientId: aId, projectId: project.id, partId: project.parts[1].id, version: data.version, name: 'Informe privado A' })) upload.set(key, value);
  upload.set('file', new Blob(['%PDF-1.4 private report A'], { type: 'application/pdf' }), 'informe.pdf');
  assert.equal((await call('/api/mandantes/documentos', 'POST', upload)).status, 401);
  assert.equal((await call('/api/mandantes/documentos', 'POST', upload, admin, { Origin: 'https://evil.example' })).status, 403);
  data = await json(await call('/api/mandantes/documentos', 'POST', upload, admin));
  const doc = data.clients[0].projects[0].parts[1].documents[0]; assert.ok(!('path' in doc));
  await json(await call('/api/admin/mandantes', 'POST', { action: 'project', clientId: aId, id: project.id, name: 'Project', status: 'Finalizado', partCount: 1, version: data.version }, admin), 400);
  const aLogin = await call('/api/mandantes', 'POST', { action: 'login', email: 'a@example.com', password: aPassword }); const aData = await json(aLogin); let aCookie = cookieOf(aLogin);
  assert.equal(aData.client.id, aId); assert.equal(aData.client.projects.length, 1); assert.ok(!JSON.stringify(aData).includes('Proyecto B'));
  const bLogin = await call('/api/mandantes', 'POST', { action: 'login', email: 'b@example.com', password: bPassword }); await json(bLogin); const bCookie = cookieOf(bLogin);
  if (process.env.PORTAL_PLAYWRIGHT) {
    const { chromium } = await import(pathToFileURL(process.env.PORTAL_PLAYWRIGHT).href);
    const browser = await chromium.launch({ headless: true, channel: process.env.PORTAL_BROWSER_CHANNEL || undefined });
    try {
      const screenshots = 'output/portal-review'; await mkdir(screenshots, { recursive: true });
      for (const [role, cookie] of [['admin', admin], ['mandante', aCookie]]) {
        const context = await browser.newContext({ viewport: { width: 1366, height: 900 } });
        const split = cookie.indexOf('='); await context.addCookies([{ name: cookie.slice(0, split), value: cookie.slice(split + 1), url: origin }]);
        const page = await context.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
        await page.goto(origin + (role === 'admin' ? '/admin/mandantes' : '/acceso'));
        if (role === 'admin') await page.getByRole('button', { name: 'Ver proyectos', exact: true }).first().click();
        await page.getByRole('button').filter({ hasText: 'Proyecto A editado' }).click();
        await page.locator('summary').filter({ hasText: 'Segunda entrega' }).click();
        await page.getByRole('link', { name: 'Informe privado A', exact: true }).waitFor();
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.evaluate(() => document.fonts.ready);
        await page.screenshot({ path: `${screenshots}/${role}-desktop.png`, fullPage: true });
        await page.setViewportSize({ width: 390, height: 844 });
        assert.ok(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), `${role}: no page overflow on mobile`);
        await page.screenshot({ path: `${screenshots}/${role}-mobile.png`, fullPage: true });
        assert.deepEqual(errors, []);
        if (role === 'admin') {
          await page.goto(origin + '/admin');
          const damaged = '{damaged-original';
          await page.evaluate(value => localStorage.setItem('granalla-norte-admin-demo-v1', value), damaged);
          await page.reload();
          await page.getByRole('status').filter({ hasText: 'se bloquearon las escrituras' }).waitFor();
          await page.getByRole('button', { name: 'Finanzas', exact: true }).click();
          assert.ok(await page.getByRole('button', { name: 'Marcar pagado', exact: true }).isDisabled());
          assert.ok(await page.getByRole('button', { name: /Nuevo registro/ }).isDisabled());
          const [download] = await Promise.all([page.waitForEvent('download'), page.getByRole('button', { name: 'Descargar copia para recuperación' }).click()]);
          assert.equal(await readFile(await download.path(), 'utf8'), damaged);
          assert.equal(await page.evaluate(() => localStorage.getItem('granalla-norte-admin-demo-v1')), damaged);
        }
        await context.close();
      }
    } finally { await browser.close(); }
  }
  const download = `/api/mandantes/documentos?id=${doc.id}`;
  const file = await call(download, 'GET', undefined, aCookie); assert.equal(file.status, 200); assert.equal(await file.text(), '%PDF-1.4 private report A'); assert.match(file.headers.get('cache-control'), /no-store/); assert.match(file.headers.get('content-disposition'), /attachment/);
  assert.equal((await call(download, 'GET', undefined, bCookie)).status, 404);
  assert.equal((await call('/api/admin/mandantes', 'POST', { action: 'client', version: data.version }, aCookie)).status, 401);
  await json(await call('/api/mandantes', 'POST', { action: 'client', name: 'Intrusion' }, aCookie), 400);
  assert.equal((await call('/api/mandantes', 'POST', { action: 'password', currentPassword: aPassword, password: bPassword }, aCookie, { Origin: 'https://evil.example' })).status, 403);
  const newPassword = randomBytes(16).toString('hex');
  const changed = await call('/api/mandantes', 'POST', { action: 'password', currentPassword: aPassword, password: newPassword }, aCookie); await json(changed); const oldCookie = aCookie; aCookie = cookieOf(changed);
  assert.equal((await call('/api/mandantes', 'GET', undefined, oldCookie)).status, 401);
  assert.equal((await call('/api/mandantes', 'GET', undefined, aCookie)).status, 200);
  data = await json(await call('/api/admin/mandantes', 'GET', undefined, admin));
  await save({ action: 'client', id: aId, name: 'Mandante A', email: 'a@example.com', active: false });
  assert.equal((await call(download, 'GET', undefined, aCookie)).status, 401);
  await save({ action: 'client', id: aId, name: 'Mandante A', email: 'a@example.com', active: true, password: aPassword });
  assert.equal((await call('/api/mandantes', 'GET', undefined, aCookie)).status, 401);
  await save({ action: 'renameDocument', clientId: aId, projectId: project.id, partId: project.parts[1].id, documentId: doc.id, name: 'Informe revisado' });
  assert.equal(data.clients[0].projects[0].parts[1].documents[0].name, 'Informe revisado');
  await stop(); await start();
  const persisted = await json(await call('/api/admin/mandantes', 'GET', undefined, admin)); assert.equal(persisted.clients[0].projects[0].parts[1].documents[0].id, doc.id);
  assert.ok(!(await readFile(join(directory, 'portal/clients.json'), 'utf8')).includes(aPassword), 'Passwords are not plaintext');
  const relogin = await call('/api/mandantes', 'POST', { action: 'login', email: 'a@example.com', password: aPassword }); await json(relogin); aCookie = cookieOf(relogin);
  data = persisted; await save({ action: 'removeDocument', clientId: aId, projectId: project.id, partId: project.parts[1].id, documentId: doc.id });
  assert.equal((await call(download, 'GET', undefined, aCookie)).status, 404);
  const logout = await call('/api/mandantes', 'POST', { action: 'logout' }, aCookie); await json(logout); assert.match(logout.headers.get('set-cookie'), /Max-Age=0/i);
  for (let i = 0; i < 8; i++) await json(await call('/api/mandantes', 'POST', { action: 'login', email: 'unknown@example.com', password: 'wrong-password' }), 401);
  await json(await call('/api/mandantes', 'POST', { action: 'login', email: 'unknown@example.com', password: 'wrong-password' }), 429);
  await stop(); delete env.CONTENT_LOCAL_DIR; await start();
  await json(await call('/api/admin/mandantes', 'GET', undefined, admin), 503);
  await json(await call('/api/mandantes'), 401);
  await json(await call('/api/mandantes/documentos?id=unknown'), 401);
  console.log('Portal checks passed: account isolation, admin permissions, private uploads/downloads, validation, conflicts, password change, disabling/reset, persistence, rename/removal, logout, shared login limits.');
} finally { await stop(); await rm(directory, { recursive: true, force: true }); }
