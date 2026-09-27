import type { MetadataRoute } from "next";
import { posts, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/nosotros", "/servicios", "/noticias", "/contacto"].map((p) => ({
    url: `${site.url}${p}`,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const news = posts.map((p) => ({ url: `${site.url}/noticias/${p.slug}`, lastModified: p.date, priority: 0.6 }));
  return [...pages, ...news];
}
