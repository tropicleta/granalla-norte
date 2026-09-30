import { cookies } from "next/headers";
import { configuredPassword, SESSION_COOKIE, verifySession } from "./admin-session";
import { isSameOrigin } from "./request-origin";
import { ContentError } from "./content-model";

export async function requireAdmin(request?: Request) {
  if (!await verifySession((await cookies()).get(SESSION_COOKIE)?.value, configuredPassword())) throw new ContentError("Inicia sesión para continuar.", 401);
  if (request && !isSameOrigin(request)) throw new ContentError("Solicitud no autorizada.", 403);
}
export async function limitedJson(request: Request, max = 100000): Promise<unknown> {
  const reader = request.body?.getReader();
  if (!reader) throw new ContentError("Solicitud inválida.");
  const chunks: Uint8Array[] = []; let size = 0;
  for (;;) { const { done, value } = await reader.read(); if (done) break; size += value.byteLength; if (size > max) { await reader.cancel(); throw new ContentError("El contenido es demasiado grande.", 413); } chunks.push(value); }
  try { return JSON.parse(Buffer.concat(chunks).toString("utf8")); } catch { throw new ContentError("Solicitud inválida."); }
}
export const privateJson = (value: unknown, status = 200) => Response.json(value, { status, headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" } });
export function apiError(error: unknown) {
  if (error instanceof ContentError) return privateJson({ error: error.message }, error.status);
  console.error("[cms] Storage operation failed", error instanceof Error ? error.name : "UnknownError");
  return privateJson({ error: "No pudimos acceder al almacenamiento. Intenta nuevamente; tus cambios no se han confirmado." }, 503);
}
