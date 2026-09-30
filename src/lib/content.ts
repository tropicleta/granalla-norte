import { cache } from "react";
import { posts } from "./site";
import { type Article, type InboxMessage, ContentError } from "./content-model";
import { readJson, writeJson, storageConfigured } from "./content-storage";
import { createHash } from "node:crypto";
import recoveredNews from "./recovered-news.json";
import recoveredDraft from "./recovered-draft.json";

const original: Article[] = posts.map(p => ({ ...p, images: [p.image], status: "published", updatedAt: `${p.date}T12:00:00.000Z` }));
const recoveredSlugs = new Set(recoveredNews.map(p => p.slug));
const recovered: Article[] = [...original.filter(p => recoveredSlugs.has(p.slug)), recoveredDraft as Article];
// Import only missing archive entries. Existing edits and draft states take precedence.
function withRecovered(articles: Article[]) {
  const known = new Set(articles.map(p => p.slug));
  return [...articles, ...recovered.filter(p => !known.has(p.slug))];
}
export async function catalog() {
  if (!storageConfigured()) return { articles: withRecovered(original), version: "initial", configured: false };
  const stored = await readJson<Article[]>("articles.json");
  return { articles: withRecovered(stored?.value ?? original), version: stored?.etag ?? "initial", configured: true };
}
export const publishedArticles = cache(async () => (await catalog()).articles.filter(p => p.status === "published").sort((a, b) => b.date.localeCompare(a.date)));
export async function saveArticle(article: Article, version: string, create: boolean) {
  const current = await catalog();
  if (current.version !== version) throw new ContentError("Otra sesión guardó cambios. Actualiza la lista antes de guardar.", 409);
  const exists = current.articles.some(p => p.slug === article.slug);
  if (create && exists) throw new ContentError("Ya existe una noticia con esa dirección.", 409);
  if (!create && !exists) throw new ContentError("La noticia no existe.", 404);
  const articles = create ? [...current.articles, article] : current.articles.map(p => p.slug === article.slug ? article : p);
  if (articles.length > 500) throw new ContentError("Se alcanzó el límite de 500 noticias.", 422);
  const next = await writeJson("articles.json", articles, version === "initial" ? undefined : version);
  return { article, version: next };
}
export function messagePath(id: string) {
  if (!/^\d{13}-[a-f0-9-]{36}$/.test(id)) throw new ContentError("Mensaje inválido.", 400);
  return `messages/${id}.json`;
}
export async function updateMessage(id: string, status: InboxMessage["status"], version: string) {
  const path = messagePath(id);
  const current = await readJson<InboxMessage>(path);
  if (!current) throw new ContentError("No encontramos el mensaje.", 404);
  if (current.etag !== version) throw new ContentError("El mensaje cambió. Actualiza la bandeja.", 409);
  const message = { ...current.value, status };
  return { message, version: await writeJson(path, message, version) };
}
// Distributed fixed-window quota. Stores a salted hash, never the sender's IP.
export async function contactQuota(ip: string) {
  const bucket = Math.floor(Date.now() / 900000);
  const hash = createHash("sha256").update(`${process.env.ADMIN_PASSWORD}:${ip}`).digest("hex");
  const path = `limits/${hash}.json`;
  for (let attempt = 0; attempt < 4; attempt++) {
    const current = await readJson<{ bucket: number; count: number }>(path);
    const count = current?.value.bucket === bucket ? current.value.count : 0;
    if (count >= 5) throw new ContentError("Has enviado varios mensajes. Espera 15 minutos antes de volver a intentar.", 429);
    try { await writeJson(path, { bucket, count: count + 1 }, current?.etag); return; }
    catch (error) { if (!(error instanceof ContentError) || error.status !== 409) throw error; }
  }
  throw new ContentError("No pudimos recibir el mensaje en este momento. Intenta nuevamente.", 503);
}
