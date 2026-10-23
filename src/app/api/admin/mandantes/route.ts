import { randomUUID } from "node:crypto";
import { requireAdmin, limitedJson, privateJson, apiError } from "@/lib/admin-api";
import { ContentError } from "@/lib/content-model";
import { readBytes, readJson } from "@/lib/content-storage";
import { loadPortal, savePortal, findClient, adminPortalView, text, email, password, hashPassword, projectInput, documentCategories, type PortalSnapshot } from "@/lib/portal";
export const runtime = "nodejs";
export async function GET() { try { await requireAdmin(); const store = await loadPortal(); return privateJson(adminPortalView(store.value, store.etag)); } catch (error) { return apiError(error); } }
export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const body = await limitedJson(request) as Record<string, unknown>;
    if (!body || typeof body !== "object") throw new ContentError("Solicitud inválida.");
    const store = await loadPortal();
    if ((store.etag ?? "") !== body.version) throw new ContentError("Hay cambios más recientes. Actualiza el listado antes de guardar.", 409);
    let label = "Datos de mandantes actualizados";
    let clientId: string | undefined; let projectId: string | undefined;
    if (body.action === "client") {
      const previous = body.id ? findClient(store.value, body.id) : undefined;
      const address = email(body.email);
      if (store.value.clients.some(c => c.email === address && c.id !== previous?.id)) throw new ContentError("Ese correo ya tiene una cuenta.");
      if (typeof body.active !== "boolean") throw new ContentError("Selecciona el estado del acceso.");
      const hash = body.password ? await hashPassword(password(body.password)) : previous?.passwordHash;
      if (!hash) throw new ContentError("Ingresa una contraseña inicial.");
      const client = { id: previous?.id ?? randomUUID(), name: text(body.name, "Nombre del mandante"), email: address, active: body.active, passwordHash: hash, sessionVersion: !previous || previous.active !== body.active || previous.email !== address || body.password ? randomUUID() : previous.sessionVersion, projects: previous?.projects ?? [] };
      if (previous) store.value.clients[store.value.clients.indexOf(previous)] = client; else store.value.clients.push(client);
      clientId = client.id; label = `${previous ? "Cuenta actualizada" : "Mandante creado"}: ${client.name}`;
    } else if (body.action === "project") {
      const client = findClient(store.value, body.clientId);
      const previous = body.id ? client.projects.find(p => p.id === body.id) : undefined;
      if (body.id && !previous) throw new ContentError("Proyecto no encontrado.", 404);
      const project = projectInput(body, previous);
      if (previous) client.projects[client.projects.indexOf(previous)] = project; else client.projects.push(project);
      clientId = client.id; projectId = project.id; label = `${previous ? "Proyecto actualizado" : "Proyecto creado"}: ${project.name}`;
    } else if (body.action === "removeDocument" || body.action === "renameDocument") {
      const client = findClient(store.value, body.clientId);
      const project = client.projects.find(p => p.id === body.projectId);
      const part = project?.parts.find(p => p.id === body.partId);
      const document = part?.documents.find(d => d.id === body.documentId);
      if (!part || !document) throw new ContentError("Documento no encontrado.", 404);
      if (body.action === "renameDocument") {
        document.name = text(body.name, "Nombre del documento");
        if (body.category !== undefined) {
          if (!documentCategories.includes(body.category as typeof documentCategories[number])) throw new ContentError("Selecciona una categoría válida.");
          document.category = String(body.category);
        }
        label = `Documento actualizado: ${document.name}`;
      } else {
        store.value.trash = [...(store.value.trash ?? []), { id: randomUUID(), clientId: client.id, projectId: String(body.projectId), projectName: project!.name, projectDescription: project!.description, projectStatus: project!.status, partId: part.id, partName: part.name, document, removedAt: new Date().toISOString() }];
        part.documents = part.documents.filter(d => d.id !== document.id);
        label = `Documento enviado a papelera: ${document.name}`;
      }
    } else if (body.action === "restoreDocument") {
      const item = store.value.trash?.find(t => t.id === body.id);
      if (!item) throw new ContentError("Documento retirado no encontrado.", 404);
      const client = findClient(store.value, item.clientId); let project = client.projects.find(p => p.id === item.projectId);
      if (!await readBytes(item.document.path)) throw new ContentError("No se encontró el archivo. No se restauró el documento.", 404);
      if (!project) { project = { id: item.projectId, name: item.projectName ?? "Proyecto recuperado", description: item.projectDescription ?? "", status: item.projectStatus ?? "En preparación", parts: [] }; client.projects.push(project); }
      let part = project.parts.find(p => p.id === item.partId);
      if (!part) { if (project.parts.length >= 100) throw new ContentError("El proyecto alcanzó el máximo de partes."); part = { id: item.partId, name: item.partName, documents: [] }; project.parts.push(part); }
      if (!part.documents.some(d => d.id === item.document.id)) part.documents.push(item.document);
      store.value.trash = store.value.trash!.filter(t => t.id !== item.id);
      label = `Documento recuperado: ${item.document.name}`;
    } else if (body.action === "restoreSnapshot") {
      const item = store.value.history?.find(h => h.id === body.id);
      if (!item) throw new ContentError("Copia del historial no encontrada.", 404);
      if (!item.restorable) throw new ContentError("Este cambio corresponde a una cuenta. Edita la cuenta desde Mandantes para modificar sus datos.");
      const snapshot = await readJson<PortalSnapshot>(item.path);
      if (!snapshot) throw new ContentError("No se encontró la copia del historial.", 404);
      const knownClients = new Set(store.value.clients.map(c => c.id));
      if (snapshot.value.clients.some(c => !knownClients.has(c.id))) throw new ContentError("La copia contiene mandantes que ya no están disponibles.");
      const documents = snapshot.value.clients.flatMap(c => c.projects).flatMap(p => p.parts).flatMap(p => p.documents);
      for (const doc of documents) if (!await readBytes(doc.path)) throw new ContentError("Falta un archivo de la copia. No se restauraron los proyectos.");
      const previousDocuments = store.value.clients.flatMap(c => c.projects.flatMap(p => p.parts.flatMap(part => part.documents.map(document => ({ id: randomUUID(), clientId: c.id, projectId: p.id, projectName: p.name, projectDescription: p.description, projectStatus: p.status, partId: part.id, partName: part.name, document, removedAt: new Date().toISOString() })))));
      // Accounts and credentials always remain current; only project documents revert.
      for (const client of store.value.clients) {
        const saved = snapshot.value.clients.find(c => c.id === client.id);
        if (saved) client.projects = saved.projects;
      }
      const activeIds = new Set(store.value.clients.flatMap(c => c.projects).flatMap(p => p.parts).flatMap(p => p.documents).map(d => d.id));
      const retired = [...(store.value.trash ?? []), ...snapshot.value.trash, ...previousDocuments].filter(t => knownClients.has(t.clientId) && !activeIds.has(t.document.id));
      store.value.trash = Array.from(new Map(retired.map(t => [t.document.id, t])).values());
      label = `Proyectos restaurados a la copia anterior a: ${item.label}`;
    } else throw new ContentError("Acción inválida.");
    const version = await savePortal(store.value, store.etag, label);
    return privateJson({ ...adminPortalView(store.value, version), selectedClientId: clientId, selectedProjectId: projectId });
  } catch (error) { return apiError(error); }
}
