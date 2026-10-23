import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
import { publishedArticles } from "@/lib/content";
import { serviceDetails } from "@/lib/service-details";
import { projectContextModified, PROJECT_CONTEXT_UPDATED } from "@/lib/project-evidence";
import { publishedMachines } from "@/lib/machinery";

export const dynamic = "force-dynamic";
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, machines] = await Promise.all([publishedArticles(), publishedMachines()]);
  const pages = ["", "/nosotros", "/servicios", "/maquinaria", "/equipos-monitoreo", "/noticias", "/contacto"].map((p) => ({
    url: `${site.url}${p}`,
    ...(["", "/servicios"].includes(p) ? { lastModified: "2026-10-23" } : p === "/maquinaria" ? { lastModified: "2026-10-22" } : {}),
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.8,
  }));
  const news = posts.map((p) => ({ url: `${site.url}/noticias/${p.slug}`, lastModified: projectContextModified(p), priority: 0.6 }));
  const services = serviceDetails.map(s => ({ url: `${site.url}/servicios/${s.slug}`, lastModified: s.slug === "obras-civiles" ? "2026-10-23" : s.slug === "suministro-y-abastecimiento" ? "2026-10-22" : PROJECT_CONTEXT_UPDATED, changeFrequency: "monthly" as const, priority: 0.9 }));
  const excavators = machines.some(machine => machine.type === "Excavadora" && !machine.demo)
    ? [{ url: `${site.url}/maquinaria/excavadoras`, lastModified: "2026-10-23", changeFrequency: "monthly" as const, priority: 0.8 }]
    : [];
  return [...pages, ...services, { url: `${site.url}/servicios/movimiento-de-tierra`, lastModified: "2026-10-23", changeFrequency: "monthly" as const, priority: 0.9 }, ...excavators, ...news];
}
