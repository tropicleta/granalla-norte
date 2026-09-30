import { catalog, saveArticle } from "@/lib/content";
import { apiError, limitedJson, privateJson, requireAdmin } from "@/lib/admin-api";
import { ContentError, parseArticle, record } from "@/lib/content-model";
import { readBytes } from "@/lib/content-storage";

export const runtime = "nodejs";
export async function GET() {
  try { await requireAdmin(); return privateJson(await catalog()); } catch (error) { return apiError(error); }
}
async function save(request: Request, create: boolean) {
  try {
    await requireAdmin(request);
    const input = record(await limitedJson(request));
    const article = parseArticle(input.article);
    if (typeof input.version !== "string") throw new ContentError("Actualiza la lista antes de guardar.", 409);
    for (const image of article.images) {
      if (image.startsWith("/api/media/") && !await readBytes(`images/${image.split("/").pop()}`)) throw new ContentError("Una imagen ya no está disponible. Vuelve a subirla.", 422);
    }
    return privateJson(await saveArticle(article, input.version, create), create ? 201 : 200);
  } catch (error) { return apiError(error); }
}
export const POST = (request: Request) => save(request, true);
export const PUT = (request: Request) => save(request, false);
