import { get, put, list, BlobPreconditionFailedError } from "@vercel/blob";
import { createHash, randomUUID } from "node:crypto";
import { ContentError } from "./content-model";

// Explicit local adapter for development/tests only. Never writes to Vercel's filesystem.
const local = () => !process.env.VERCEL ? process.env.CONTENT_LOCAL_DIR : undefined;
// On Vercel the SDK obtains OIDC from the request context, not necessarily process.env.
export const storageConfigured = () => Boolean(local() || process.env.BLOB_READ_WRITE_TOKEN || process.env.BLOB_STORE_ID);
function ready() { if (!storageConfigured()) throw new ContentError("Falta conectar el almacenamiento de noticias y mensajes en Vercel.", 503); }
function safePath(path: string) { if (!/^[a-zA-Z0-9/_.-]+$/.test(path) || path.includes("..")) throw new Error("Invalid storage path"); }
export async function readBytes(path: string): Promise<{ bytes: Uint8Array; etag: string } | null> {
  ready(); safePath(path);
  if (local()) {
    const fs = await import("node:fs/promises");
    try { const bytes = await fs.readFile(`${local()}/${path}`); return { bytes, etag: createHash("sha256").update(bytes).digest("hex") }; }
    catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; }
  }
  const result = await get(`cms/${path}`, { access: "private", useCache: false });
  if (!result || result.statusCode !== 200) return null;
  return { bytes: new Uint8Array(await new Response(result.stream).arrayBuffer()), etag: result.blob.etag };
}
export async function writeBytes(path: string, bytes: Uint8Array, etag?: string, contentType = "application/json") {
  ready(); safePath(path);
  if (local()) {
    const fs = await import("node:fs/promises");
    const { dirname } = await import("node:path");
    const target = `${local()}/${path}`;
    await fs.mkdir(dirname(target), { recursive: true });
    let lock;
    try { lock = await fs.open(`${target}.lock`, "wx"); }
    catch { throw new ContentError("Hay cambios simultáneos. Actualiza y vuelve a intentar.", 409); }
    try {
      const current = await readBytes(path);
      if (current ? current.etag !== etag : Boolean(etag)) throw new ContentError("Hay cambios más recientes. Actualiza antes de guardar.", 409);
      const temp = `${target}.${randomUUID()}.tmp`;
      await fs.writeFile(temp, bytes); await fs.rename(temp, target);
      return createHash("sha256").update(bytes).digest("hex");
    } finally { await lock.close(); await fs.unlink(`${target}.lock`); }
  }
  try {
    const result = await put(`cms/${path}`, Buffer.from(bytes), { access: "private", contentType, addRandomSuffix: false, allowOverwrite: Boolean(etag), ...(etag ? { ifMatch: etag } : {}) });
    return result.etag;
  } catch (error) {
    if (error instanceof BlobPreconditionFailedError || (error instanceof Error && /already exists/i.test(error.message))) throw new ContentError("Hay cambios más recientes. Actualiza antes de guardar.", 409);
    throw error;
  }
}
export async function readJson<T>(path: string) {
  const result = await readBytes(path);
  return result ? { value: JSON.parse(new TextDecoder().decode(result.bytes)) as T, etag: result.etag } : null;
}
export const writeJson = (path: string, value: unknown, etag?: string) => writeBytes(path, new TextEncoder().encode(JSON.stringify(value)), etag);
export async function listMessages(cursor?: string) {
  ready();
  if (local()) {
    const fs = await import("node:fs/promises");
    let files: string[] = [];
    try { files = (await fs.readdir(`${local()}/messages`)).filter(p => p.endsWith(".json")).sort(); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
    const offset = Number(cursor || 0);
    return { paths: files.slice(offset, offset + 30).map(p => `messages/${p}`), cursor: offset + 30 < files.length ? String(offset + 30) : undefined };
  }
  const result = await list({ prefix: "cms/messages/", limit: 30, cursor });
  return { paths: result.blobs.map(b => b.pathname.slice(4)), cursor: result.hasMore ? result.cursor : undefined };
}
