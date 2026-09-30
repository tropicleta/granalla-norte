import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { publishedArticles } from "@/lib/content";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await publishedArticles();
  const pages = ["", "/nosotros", "/servicios", "/noticias", "/contacto"].map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const news = posts.map((p) => ({ url: `${site.url}/noticias/${p.slug}`, lastModified: p.updatedAt, priority: 0.6 }));
  return [...pages, ...news];
}
