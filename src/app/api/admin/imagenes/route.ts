import sharp from "sharp";
import { randomUUID } from "node:crypto";
import { apiError, privateJson, requireAdmin } from "@/lib/admin-api";
import { ContentError } from "@/lib/content-model";
import { writeBytes } from "@/lib/content-storage";

export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    if (Number(request.headers.get("content-length") || 0) > 4000000) throw new ContentError("La imagen supera los 3 MB permitidos.", 413);
    const reader = request.body?.getReader();
    if (!reader) throw new ContentError("Selecciona una imagen.", 422);
    const chunks: Uint8Array[] = []; let size = 0;
    for (;;) { const part = await reader.read(); if (part.done) break; size += part.value.byteLength; if (size > 4000000) { await reader.cancel(); throw new ContentError("La imagen supera el tamaño permitido.", 413); } chunks.push(part.value); }
    const form = await new Response(Buffer.concat(chunks), { headers: { "Content-Type": request.headers.get("content-type") || "" } }).formData();
    const file = form.get("file");
    if (!(file instanceof File) || file.size > 3000000 || !["image/jpeg", "image/png", "image/webp"].includes(file.type)) throw new ContentError("Usa imágenes JPG, PNG o WebP de hasta 3 MB.", 422);
    let bytes: Buffer;
    try {
      const image = sharp(Buffer.from(await file.arrayBuffer()), { limitInputPixels: 40000000 });
      const meta = await image.metadata();
      if (!["jpeg", "png", "webp"].includes(meta.format || "")) throw new Error("Unsupported image");
      bytes = await image.rotate().resize({ width: 2000, height: 2000, fit: "inside", withoutEnlargement: true }).webp({ quality: 85 }).toBuffer();
    } catch { throw new ContentError("No pudimos abrir esa imagen. Prueba con otro archivo JPG, PNG o WebP.", 422); }
    const filename = `${randomUUID()}.webp`;
    await writeBytes(`images/${filename}`, bytes, undefined, "image/webp");
    return privateJson({ url: `/api/media/${filename}` }, 201);
  } catch (error) { return apiError(error); }
}
