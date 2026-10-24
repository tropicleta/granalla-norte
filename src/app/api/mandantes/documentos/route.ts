import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { requireAdmin, privateJson, apiError } from "@/lib/admin-api";
import { SESSION_COOKIE } from "@/lib/admin-session";
import { verifyAdminSession } from "@/lib/admin-account";
import { readSnapshotBytes, writeBytes } from "@/lib/content-storage";
import { ContentError } from "@/lib/content-model";
import { loadPortal, savePortal, requireMandante, text, adminPortalView, documentCategories } from "@/lib/portal";
export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    const admin = await verifyAdminSession((await cookies()).get(SESSION_COOKIE)?.value);
    const store = admin ? await loadPortal() : null;
    const clients = store ? store.value.clients : [(await requireMandante()).client];
    const id = new URL(request.url).searchParams.get("id");
    const document = clients.flatMap(c => c.projects).flatMap(p => p.parts).flatMap(p => p.documents).find(d => d.id === id) ?? (store ? store.value.trash?.find(t => t.document.id === id)?.document : undefined);
    if (!document) throw new ContentError("Documento no encontrado.", 404);
    const file = await readSnapshotBytes(document.path, true); if (!file) throw new ContentError("Archivo no encontrado.", 404);
    return new Response(Buffer.from(file.bytes), { headers: { "Content-Type": "application/octet-stream", "Content-Length": String(file.bytes.length), "Content-Disposition": `attachment; filename="documento"; filename*=UTF-8''${encodeURIComponent(document.filename).replace(/'/g, "%27")}`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex, nofollow" } });
  } catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const reader = request.body?.getReader(); if (!reader) throw new ContentError("Selecciona un archivo.");
    const chunks: Uint8Array[] = []; let size = 0;
    for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > 3500000) { await reader.cancel(); throw new ContentError("El archivo debe pesar como máximo 3 MB.", 413); } chunks.push(value); }
    const form = await new Request(request.url, { method: "POST", headers: { "Content-Type": request.headers.get("Content-Type") ?? "" }, body: Buffer.concat(chunks) }).formData();
    const store = await loadPortal();
    if ((store.etag ?? "") !== form.get("version")) throw new ContentError("Hay cambios más recientes. Actualiza antes de subir el archivo.", 409);
    const client = store.value.clients.find(c => c.id === form.get("clientId"));
    const part = client?.projects.find(p => p.id === form.get("projectId"))?.parts.find(p => p.id === form.get("partId"));
    if (!part) throw new ContentError("Parte no encontrada.", 404);
    const file = form.get("file");
    if (!(file instanceof File) || !file.size || file.size > 3 * 1024 * 1024) throw new ContentError("Selecciona un archivo de hasta 3 MB.");
    if (!/\.(pdf|docx?|xlsx?|csv|txt|png|jpe?g|zip)$/i.test(file.name)) throw new ContentError("Formato permitido: PDF, Word, Excel, CSV, TXT, JPG, PNG o ZIP.");
    const name = text(form.get("name") || file.name, "Nombre del documento");
    const category = String(form.get("category") || "Otros");
    if (!documentCategories.includes(category as typeof documentCategories[number])) throw new ContentError("Selecciona una categoría válida.");
    const id = randomUUID(); const path = `portal/files/${id}`;
    await writeBytes(path, new Uint8Array(await file.arrayBuffer()), undefined, "application/octet-stream");
    part.documents.push({ id, path, name, category, filename: file.name.replace(/[\x00-\x1f\x7f/\\]/g, "_").slice(0, 200), size: file.size, uploadedAt: new Date().toISOString() });
    const version = await savePortal(store.value, store.etag, `Documento cargado: ${name}`);
    return privateJson(adminPortalView(store.value, version));
  } catch (error) { return apiError(error); }
}
