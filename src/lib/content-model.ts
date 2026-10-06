import type { Post } from "./site";
import { normalizeCategory } from "./news-categories";

export type Article = Post & { status: "draft" | "published"; images: string[]; updatedAt: string; editorialRevision?: string };
export type InboxMessage = {
  id: string; nombre: string; empresa: string; email: string; telefono: string;
  servicio: string; mensaje: string; createdAt: string; status: "new" | "read" | "archived";
};
export class ContentError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
export function record(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new ContentError("Solicitud inválida.");
  return value as Record<string, unknown>;
}
function text(value: unknown, label: string, max: number, min = 0) {
  if (typeof value !== "string" || value.trim().length < min || value.length > max) throw new ContentError(`Revisa ${label} (entre ${min} y ${max} caracteres).`, 422);
  return value.trim();
}
export function validImage(value: unknown): value is string {
  return typeof value === "string" && (/^\/img\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_.-]+$/.test(value) || /^\/api\/media\/[a-f0-9-]{36}\.webp$/.test(value));
}
export function parseArticle(value: unknown): Article {
  const input = record(value);
  const slug = text(input.slug, "la dirección", 120, 3);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new ContentError("La dirección solo admite letras minúsculas, números y guiones.", 422);
  const date = text(input.date, "la fecha", 10, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date) throw new ContentError("Fecha inválida.", 422);
  const category = normalizeCategory(text(input.category, "la categoría", 60, 2));
  if (category.length < 2 || /[\u0000-\u001f\u007f]/.test(input.category as string)) throw new ContentError("Escribe una categoría de entre 2 y 60 caracteres, en una sola línea.", 422);
  if (input.status !== "draft" && input.status !== "published") throw new ContentError("Estado inválido.", 422);
  if (!Array.isArray(input.images) || input.images.length > 12 || !input.images.every(validImage)) throw new ContentError("Selecciona hasta 12 imágenes válidas.", 422);
  if (input.status === "published" && !input.images.length) throw new ContentError("Agrega una imagen de portada antes de publicar.", 422);
  if (!Array.isArray(input.body) || !input.body.length || input.body.length > 100) throw new ContentError("Escribe el cuerpo de la noticia.", 422);
  const body = input.body.map(p => text(p, "el párrafo", 10000)).filter(Boolean);
  if (!body.length) throw new ContentError("Escribe el cuerpo de la noticia.", 422);
  if (body.join("\n").length > 50000) throw new ContentError("El cuerpo supera los 50.000 caracteres.", 422);
  const highlights = input.highlights ?? [];
  if (!Array.isArray(highlights) || highlights.length > 30) throw new ContentError("Máximo 30 puntos destacados.", 422);
  return {
    slug, date, title: text(input.title, "el título", 200, 3),
    excerpt: text(input.excerpt, "el resumen", 500, 10),
    location: text(input.location, "la ubicación", 200), client: text(input.client ?? "", "el mandante", 200),
    category, status: input.status,
    images: [...new Set(input.images)], image: input.images[0] || "", body,
    imageCaption: text(input.imageCaption ?? "", "el pie de la portada", 500),
    highlights: highlights.map(p => text(p, "el punto destacado", 500)).filter(Boolean), updatedAt: new Date().toISOString(),
  };
}
export function parseContact(value: unknown) {
  const input = record(value);
  const email = text(input.email, "el correo", 254, 3);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new ContentError("Ingresa un correo válido.", 422);
  return {
    nombre: text(input.nombre, "el nombre", 150, 1), empresa: text(input.empresa ?? "", "la empresa", 200),
    email, telefono: text(input.telefono ?? "", "el teléfono", 50),
    servicio: text(input.servicio ?? "", "el servicio", 200), mensaje: text(input.mensaje, "el mensaje", 10000, 10),
  };
}
