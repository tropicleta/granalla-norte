import { randomUUID } from "node:crypto";
import { requireAdmin, limitedJson, privateJson, apiError } from "@/lib/admin-api";
import { ContentError } from "@/lib/content-model";
import { loadPortal, savePortal, findClient, publicClient, text, email, password, hashPassword, projectInput } from "@/lib/portal";
export const runtime = "nodejs";
export async function GET() { try { await requireAdmin(); const store = await loadPortal(); return privateJson({ clients: store.value.clients.map(publicClient), version: store.etag ?? "" }); } catch (error) { return apiError(error); } }
export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const body = await limitedJson(request) as Record<string, unknown>;
    if (!body || typeof body !== "object") throw new ContentError("Solicitud inválida.");
    const store = await loadPortal();
    if ((store.etag ?? "") !== body.version) throw new ContentError("Hay cambios más recientes. Actualiza el listado antes de guardar.", 409);
    if (body.action === "client") {
      const previous = body.id ? findClient(store.value, body.id) : undefined;
      const address = email(body.email);
      if (store.value.clients.some(c => c.email === address && c.id !== previous?.id)) throw new ContentError("Ese correo ya tiene una cuenta.");
      if (typeof body.active !== "boolean") throw new ContentError("Selecciona el estado del acceso.");
      const hash = body.password ? await hashPassword(password(body.password)) : previous?.passwordHash;
      if (!hash) throw new ContentError("Ingresa una contraseña inicial.");
      const client = { id: previous?.id ?? randomUUID(), name: text(body.name, "Nombre del mandante"), email: address, active: body.active, passwordHash: hash, sessionVersion: !previous || previous.active !== body.active || previous.email !== address || body.password ? randomUUID() : previous.sessionVersion, projects: previous?.projects ?? [] };
      if (previous) store.value.clients[store.value.clients.indexOf(previous)] = client; else store.value.clients.push(client);
    } else if (body.action === "project") {
      const client = findClient(store.value, body.clientId);
      const previous = body.id ? client.projects.find(p => p.id === body.id) : undefined;
      if (body.id && !previous) throw new ContentError("Proyecto no encontrado.", 404);
      const project = projectInput(body, previous);
      if (previous) client.projects[client.projects.indexOf(previous)] = project; else client.projects.push(project);
    } else if (body.action === "removeDocument" || body.action === "renameDocument") {
      const client = findClient(store.value, body.clientId);
      const part = client.projects.find(p => p.id === body.projectId)?.parts.find(p => p.id === body.partId);
      const document = part?.documents.find(d => d.id === body.documentId);
      if (!part || !document) throw new ContentError("Documento no encontrado.", 404);
      if (body.action === "renameDocument") document.name = text(body.name, "Nombre del documento");
      else part.documents = part.documents.filter(d => d.id !== document.id);
    } else throw new ContentError("Acción inválida.");
    const version = await savePortal(store.value, store.etag);
    return privateJson({ clients: store.value.clients.map(publicClient), version });
  } catch (error) { return apiError(error); }
}
