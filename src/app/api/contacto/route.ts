import { randomUUID } from "node:crypto";
import { apiError, limitedJson, privateJson } from "@/lib/admin-api";
import { ContentError, parseContact, record, type InboxMessage } from "@/lib/content-model";
import { contactQuota, messagePath } from "@/lib/content";
import { writeJson } from "@/lib/content-storage";
import { isSameOrigin } from "@/lib/request-origin";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const body = record(await limitedJson(request, 20000));
    if (!isSameOrigin(request)) throw new ContentError("Envía el mensaje desde el formulario de la página.", 403);
    if (body.website) return privateJson({ ok: true });
    const fields = parseContact(body);
    // Vercel overwrites this header; do not trust a client-supplied X-Forwarded-For.
    const ip = process.env.VERCEL ? request.headers.get("x-vercel-forwarded-for") || "unknown" : "local";
    await contactQuota(ip);
    // Reverse timestamp gives newest-first storage pagination.
    const id = `${String(9999999999999 - Date.now()).padStart(13, "0")}-${randomUUID()}`;
    const message: InboxMessage = { ...fields, id, createdAt: new Date().toISOString(), status: "new" };
    await writeJson(messagePath(id), message);
    return privateJson({ ok: true }, 201);
  } catch (error) { return apiError(error); }
}
