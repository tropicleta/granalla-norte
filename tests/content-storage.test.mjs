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
let metadataReads = 0, lastGetOptions, getFailure;
const blob = {
  BlobPreconditionFailedError, BlobNotFoundError,
  head: async () => { metadataReads++; if (value === null) throw new BlobNotFoundError(); return { etag: version }; },
  get: async (_path, options) => {
    reads++;
    lastGetOptions = options;
    if (getFailure) throw getFailure;
    if (value === null) throw new BlobNotFoundError();
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
value = '{"published":true}';
const beforeReads = reads, beforeMetadata = metadataReads;
const snapshot = await exports.readSnapshotJson('articles.json');
assert.equal(snapshot.value.published, true);
assert.equal(snapshot.etag, undefined, 'Snapshot cannot supply an ETag for writes');
assert.equal(reads - beforeReads, 1, 'Public snapshot needs just one download');
assert.equal(metadataReads, beforeMetadata, 'Snapshot avoids both metadata operations');
assert.equal(lastGetOptions.useCache, false, 'Editable snapshot sees fresh content after tag invalidation');
await exports.readSnapshotBytes('portal/files/immutable-upload', true);
assert.equal(lastGetOptions.useCache, true, 'Immutable private file uses Blob CDN');
assert.equal(lastGetOptions.access, 'private');
value = null;
assert.equal(await exports.readSnapshotBytes('missing.json'), null);
getFailure = new Error('403 Forbidden');
await assert.rejects(exports.readSnapshotJson('articles.json'), /403 Forbidden/);
await assert.rejects(exports.readSnapshotBytes('../private'), /Invalid storage path/);
console.log('Storage checks passed: weak delivery ETag, guarded writes, concurrent read retry, bounded retries, missing content.');
