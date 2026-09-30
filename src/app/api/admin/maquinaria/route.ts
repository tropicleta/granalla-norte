import { machineryCatalog, saveMachine } from "@/lib/machinery";
import { parseMachine } from "@/lib/machinery-model";
import { ContentError, record } from "@/lib/content-model";
import { apiError, limitedJson, privateJson, requireAdmin } from "@/lib/admin-api";
import { readBytes } from "@/lib/content-storage";

export const runtime = "nodejs";
export async function GET() {
  try { await requireAdmin(); return privateJson(await machineryCatalog()); } catch (error) { return apiError(error); }
}
async function save(request: Request, create: boolean) {
  try {
    await requireAdmin(request);
    const input = record(await limitedJson(request));
    const machine = parseMachine(input.machine);
    if (typeof input.version !== "string") throw new ContentError("Actualiza la lista antes de guardar.", 409);
    if (machine.image.startsWith("/api/media/") && !await readBytes(`images/${machine.image.split("/").pop()}`)) throw new ContentError("Vuelve a subir la imagen del equipo.", 422);
    return privateJson(await saveMachine(machine, input.version, create), create ? 201 : 200);
  } catch (error) { return apiError(error); }
}
export const POST = (request: Request) => save(request, true);
export const PUT = (request: Request) => save(request, false);
