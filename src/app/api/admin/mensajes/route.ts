import { apiError, limitedJson, privateJson, requireAdmin } from "@/lib/admin-api";
import { ContentError, type InboxMessage, record } from "@/lib/content-model";
import { updateMessage } from "@/lib/content";
import { listMessages, readJson } from "@/lib/content-storage";

export const runtime = "nodejs";
export async function GET(request: Request) {
  try {
    await requireAdmin();
    const cursor = new URL(request.url).searchParams.get("cursor") || undefined;
    if (cursor && cursor.length > 2000) throw new ContentError("Página inválida.");
    const page = await listMessages(cursor);
    const messages = await Promise.all(page.paths.map(async path => {
      const result = await readJson<InboxMessage>(path);
      return result ? { ...result.value, version: result.etag } : null;
    }));
    return privateJson({ messages: messages.filter(Boolean), cursor: page.cursor });
  } catch (error) { return apiError(error); }
}
export async function PATCH(request: Request) {
  try {
    await requireAdmin(request);
    const input = record(await limitedJson(request, 4000));
    if (typeof input.id !== "string" || typeof input.version !== "string" || !["new", "read", "archived"].includes(String(input.status))) throw new ContentError("Solicitud inválida.");
    return privateJson(await updateMessage(input.id, input.status as InboxMessage["status"], input.version));
  } catch (error) { return apiError(error); }
}
