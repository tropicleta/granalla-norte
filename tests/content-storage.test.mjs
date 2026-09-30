import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import vm from 'node:vm';
import ts from 'typescript';

// Exercise the production adapter with delivery and storage returning different ETags.
const require = createRequire(import.meta.url);
class ContentError extends Error { constructor(message, status) { super(message); this.status = status; } }
class BlobPreconditionFailedError extends Error {}
class BlobNotFoundError extends Error {}
let value = 'first', version = 'storage-1', reads = 0, race = false, continuousRace = false;
const blob = {
  BlobPreconditionFailedError, BlobNotFoundError,
  head: async () => { if (value === null) throw new BlobNotFoundError(); return { etag: version }; },
  get: async () => {
    reads++;
    const bytes = value;
    if (race || continuousRace) { value = 'concurrent'; version += '-next'; race = false; }
    return { statusCode: 200, stream: new Response(bytes).body, blob: { etag: 'W/"delivery-hash"' } };
  },
  put: async (_path, bytes, options) => {
    assert.equal(options.access, 'private');
    if (value !== null && options.ifMatch !== version) throw new BlobPreconditionFailedError();
    value = bytes.toString(); version += '-saved'; return { etag: version };
  },
};
const exports = {};
const code = ts.transpileModule(readFileSync(new URL('../src/lib/content-storage.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
vm.runInNewContext(code, { exports, require: name => name === '@vercel/blob' ? blob : name === './content-model' ? { ContentError } : require(name), process: { env: { BLOB_STORE_ID: 'test' } }, Response, Buffer, TextDecoder, TextEncoder, Uint8Array });
const first = await exports.readBytes('articles.json');
assert.equal(first.etag, 'storage-1');
assert.equal(new TextDecoder().decode(first.bytes), 'first');
await exports.writeBytes('articles.json', new TextEncoder().encode('saved category'), first.etag);
await assert.rejects(exports.writeBytes('articles.json', new Uint8Array(), first.etag), error => error.status === 409);
race = true;
const afterRace = await exports.readBytes('articles.json');
assert.equal(new TextDecoder().decode(afterRace.bytes), 'concurrent');
assert.equal(afterRace.etag, version);
assert.equal(reads, 3, 'Read retries when content changes between metadata checks');
continuousRace = true;
await assert.rejects(exports.readBytes('articles.json'), error => error.status === 409);
continuousRace = false; value = null;
assert.equal(await exports.readBytes('articles.json'), null);
console.log('Storage checks passed: weak delivery ETag, guarded writes, concurrent read retry, bounded retries, missing content.');
