import { randomUUID, randomBytes, scrypt as derive, timingSafeEqual, createHmac, createHash } from "node:crypto";
import { promisify } from "node:util";
import { cookies } from "next/headers";
import { readJson, writeJson } from "./content-storage";
import { configuredPassword } from "./admin-session";
import { ContentError } from "./content-model";

export type PortalDocument = { id: string; name: string; filename: string; size: number; uploadedAt: string; path: string };
export type PortalPart = { id: string; name: string; documents: PortalDocument[] };
export type PortalProject = { id: string; name: string; description: string; status: "En ejecución" | "Finalizado" | "En preparación"; parts: PortalPart[] };
export type Mandante = { id: string; name: string; email: string; active: boolean; passwordHash: string; sessionVersion: string; projects: PortalProject[] };
export type PortalStore = { clients: Mandante[] };
export const PORTAL_COOKIE = "gn_mandante_session";
export const PORTAL_SECONDS = 8 * 60 * 60;
const scrypt = promisify(derive);
const path = "portal/clients.json";
export async function loadPortal(): Promise<{ value: PortalStore; etag: string | undefined }> { return await readJson<PortalStore>(path) ?? { value: { clients: [] }, etag: undefined }; }
export async function savePortal(value: PortalStore, etag?: string) { return writeJson(path, value, etag); }
export function text(value: unknown, label: string, max = 160) {
  if (typeof value !== "string" || !value.trim() || value.trim().length > max) throw new ContentError(`${label}: ingresa entre 1 y ${max} caracteres.`);
  return value.trim();
}
export function email(value: unknown) { const result = text(value, "Correo", 254).toLowerCase(); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(result)) throw new ContentError("Ingresa un correo válido."); return result; }
export function password(value: unknown) { if (typeof value !== "string" || value.length < 12 || value.length > 128) throw new ContentError("La contraseña debe tener entre 12 y 128 caracteres."); return value; }
export async function hashPassword(value: string) { const salt = randomBytes(16).toString("hex"); return `${salt}:${(await scrypt(value, salt, 64) as Buffer).toString("hex")}`; }
const DUMMY = "00000000000000000000000000000000:" + "00".repeat(64);
export async function checkPassword(value: string, encoded = DUMMY) { const [salt, hash] = encoded.split(":"); const actual = await scrypt(value, salt, 64) as Buffer; const expected = Buffer.from(hash, "hex"); return expected.length === actual.length && timingSafeEqual(actual, expected); }
function signature(payload: string, client: Mandante) { const secret = configuredPassword(); if (!secret) throw new ContentError("El acceso todavía no está configurado.", 503); return createHmac("sha256", secret).update(`portal:v1:${client.passwordHash}:${client.sessionVersion}:${payload}`).digest("hex"); }
export function issueToken(client: Mandante) { const payload = `${client.id}.${Math.floor(Date.now() / 1000) + PORTAL_SECONDS}`; return `${payload}.${signature(payload, client)}`; }
export function verifyToken(token: string | undefined, clients: Mandante[]) {
  if (!token || token.length > 200 || !configuredPassword()) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [id, expires, signed] = parts; const client = clients.find(c => c.id === id && c.active);
  const now = Math.floor(Date.now() / 1000);
  if (!client || !/^\d+$/.test(expires) || Number(expires) <= now || Number(expires) > now + PORTAL_SECONDS || !/^[a-f0-9]{64}$/.test(signed ?? "")) return null;
  return timingSafeEqual(Buffer.from(signature(`${id}.${expires}`, client), "hex"), Buffer.from(signed, "hex")) ? client : null;
}
export async function requireMandante() {
  const token = (await cookies()).get(PORTAL_COOKIE)?.value;
  if (!token || token.length > 200 || token.split(".").length !== 3) throw new ContentError("Inicia sesión para continuar.", 401);
  const store = await loadPortal();
  const client = verifyToken(token, store.value.clients);
  if (!client) throw new ContentError("Inicia sesión para continuar.", 401);
  return { ...store, client };
}
export function publicClient(client: Mandante) { return { id: client.id, name: client.name, email: client.email, active: client.active, projects: client.projects.map(p => ({ ...p, parts: p.parts.map(part => ({ ...part, documents: part.documents.map(doc => ({ id: doc.id, name: doc.name, filename: doc.filename, size: doc.size, uploadedAt: doc.uploadedAt })) })) })) }; }
export function findClient(store: PortalStore, id: unknown) { const client = store.clients.find(c => c.id === id); if (!client) throw new ContentError("Mandante no encontrado.", 404); return client; }
export function projectInput(body: Record<string, unknown>, previous?: PortalProject): PortalProject {
  const count = Number(body.partCount);
  if (body.description !== undefined && (typeof body.description !== "string" || body.description.trim().length > 2000)) throw new ContentError("La descripción debe tener como máximo 2000 caracteres. No se guardaron los cambios.");
  if (!Number.isInteger(count) || count < 1 || count > 100) throw new ContentError("El proyecto debe tener entre 1 y 100 partes.");
  if (previous?.parts.slice(count).some(p => p.documents.length)) throw new ContentError("No puedes quitar partes con documentos. Retira sus archivos primero.");
  const statuses = ["En ejecución", "Finalizado", "En preparación"];
  if (!statuses.includes(String(body.status))) throw new ContentError("Selecciona un estado válido.");
  const names = Array.isArray(body.partNames) ? body.partNames : [];
  return { id: previous?.id ?? randomUUID(), name: text(body.name, "Nombre del proyecto"), description: typeof body.description === "string" ? body.description.trim() : "", status: body.status as PortalProject["status"], parts: Array.from({ length: count }, (_, i) => ({ id: previous?.parts[i]?.id ?? randomUUID(), name: text(names[i] ?? previous?.parts[i]?.name ?? `Parte ${i + 1}`, "Nombre de parte"), documents: previous?.parts[i]?.documents ?? [] })) };
}
// Shared limits survive restarts and apply independently to the account and source.
export async function loginQuota(request: Request, account: string) {
  const secret = configuredPassword(); if (!secret) throw new ContentError("El acceso todavía no está configurado.", 503);
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  for (const [key, limit] of [[`ip:${ip}`, 20], [`account:${account}`, 8]] as const) {
    const keyHash = createHash("sha256").update(`${secret}:portal:${key}`).digest("hex");
    const location = `portal/limits/${keyHash}.json`;
    for (let attempt = 0; attempt < 3; attempt++) {
      const previous = await readJson<{ count: number; expires: number }>(location);
      const current = previous && previous.value.expires > Date.now() ? previous.value : { count: 0, expires: Date.now() + 900000 };
      if (current.count >= limit) throw new ContentError("Demasiados intentos. Vuelve a intentar en 15 minutos.", 429);
      try { await writeJson(location, { ...current, count: current.count + 1 }, previous?.etag); break; }
      catch (error) { if (!(error instanceof ContentError) || error.status !== 409 || attempt === 2) throw error; }
    }
  }
}
