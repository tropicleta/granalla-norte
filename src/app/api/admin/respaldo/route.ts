import { zipSync, strToU8 } from "fflate";
import { requireAdmin, apiError } from "@/lib/admin-api";
import { loadPortal, publicClient, publicDocument } from "@/lib/portal";
import { readBytes } from "@/lib/content-storage";
import { ContentError } from "@/lib/content-model";

export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    await requireAdmin();
    const store = await loadPortal(); const clientId = new URL(request.url).searchParams.get("clientId");
    const clients = clientId ? store.value.clients.filter(c => c.id === clientId) : store.value.clients;
    if (clientId && !clients.length) throw new ContentError("Mandante no encontrado.", 404);
    const known = new Set(clients.map(c => c.id));
    const trash = (store.value.trash ?? []).filter(t => known.has(t.clientId));
    const documents = Array.from(new Map([...clients.flatMap(c => c.projects).flatMap(p => p.parts).flatMap(p => p.documents), ...trash.map(t => t.document)].map(d => [d.id, d])).values());
    if (documents.reduce((n, d) => n + d.size, 0) > 50 * 1024 * 1024 || documents.length > 1000) throw new ContentError("El respaldo supera 50 MB o 1000 archivos. Descarga un respaldo por mandante.", 413);
    const files: Record<string, Uint8Array> = Object.create(null); const fileIndex = [];
    let size = 0;
    for (const doc of documents) {
      const file = await readBytes(doc.path);
      if (!file) throw new ContentError("Falta un archivo. El respaldo no se generó; revisa los documentos antes de continuar.", 503);
      size += file.bytes.length;
      if (size > 50 * 1024 * 1024) throw new ContentError("El respaldo supera 50 MB. Descárgalo por mandante.", 413);
      const archivePath = `archivos/${doc.id}/${doc.filename.replace(/[^a-zA-Z0-9_.-]/g, "_")}`;
      files[archivePath] = file.bytes; fileIndex.push({ id: doc.id, archivo: archivePath });
    }
    const manifest = { format: "granalla-norte-respaldo-v1", createdAt: new Date().toISOString(), clients: clients.map(publicClient), trash: trash.map(t => ({ ...t, document: publicDocument(t.document) })), files: fileIndex };
    files["proyectos.json"] = strToU8(JSON.stringify(manifest, null, 2));
    files["LEEME.txt"] = strToU8("Respaldo privado de mandantes, proyectos y documentos de Granalla Norte.\nLos documentos están en archivos/ y su organización en proyectos.json.\nIncluye la papelera. No contiene contraseñas ni códigos de recuperación.\nConserva este ZIP en un lugar privado. Los archivos pueden cargarse nuevamente desde el portal.\n");
    const archive = zipSync(files, { level: 0 });
    return new Response(Buffer.from(archive), { headers: { "Content-Type": "application/zip", "Content-Disposition": `attachment; filename="granalla-norte-respaldo-${new Date().toISOString().slice(0, 10)}.zip"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff", "X-Robots-Tag": "noindex" } });
  } catch (error) { return apiError(error); }
}
