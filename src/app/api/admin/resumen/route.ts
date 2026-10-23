import { requireAdmin, privateJson, apiError } from "@/lib/admin-api";
import { loadPortal } from "@/lib/portal";
import { listMessages, readJson, storageConfigured } from "@/lib/content-storage";
import type { InboxMessage } from "@/lib/content-model";
export async function GET() {
  try {
    await requireAdmin();
    if (!storageConfigured()) return privateJson({ configured: false });
    const [store, first] = await Promise.all([loadPortal(), listMessages()]);
    const paths = [...first.paths]; let cursor = first.cursor;
    for (let page = 1; cursor && page < 10; page++) { const next = await listMessages(cursor); paths.push(...next.paths); cursor = next.cursor; }
    const messages = (await Promise.all(paths.map(p => readJson<InboxMessage>(p)))).flatMap(m => m ? [m.value] : []);
    const pending = store.value.clients.flatMap(c => c.projects.filter(p => p.status !== "Finalizado").flatMap(p => p.parts.filter(part => part.documents.length === 0).map(part => ({ clientId: c.id, client: c.name, projectId: p.id, project: p.name, part: part.name }))));
    return privateJson({ configured: true, clients: store.value.clients.length, projects: store.value.clients.flatMap(c => c.projects).filter(p => p.status !== "Finalizado").length, pendingCount: pending.length, pending: pending.slice(0, 8), newMessages: messages.filter(m => m.status === "new").length, messagesPartial: Boolean(cursor), messageCount: messages.length, trash: store.value.trash?.length ?? 0, changes: (store.value.history ?? []).slice(0, 5).map(({ id, at, label }) => ({ id, at, label })) });
  } catch (error) { return apiError(error); }
}
