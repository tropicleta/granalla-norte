import type { Post } from "./site";
import { categoryKey } from "./news-categories";

export const projectSectors = [
  { slug: "obras-civiles", label: "Obras civiles", categories: ["Obras civiles", "Movimiento de tierra"] },
  { slug: "mantencion-integral-de-caminos", label: "Mantención integral de caminos", categories: ["Caminos", "Mantención integral de caminos", "Mantención de caminos"] },
  { slug: "minerales", label: "Abastecimiento", categories: ["Minerales", "Abastecimiento", "Suministro y abastecimiento"] },
  { slug: "asesorias", label: "Monitoreo", categories: ["Monitoreo", "Monitoreo de tronaduras"] },
] as const;

// These archive articles document monitoring training but retain their original
// Eventos category. Explicit associations avoid unrelated keyword matches.
const monitoringArchive = new Set([
  "monitores-comunitarios-segundo-semestre-2024",
  "monitoreo-vibraciones-primer-semestre-2024",
]);

export function sectorProjects<T extends Post>(articles: T[], slug: string): T[] {
  const sector = projectSectors.find(item => item.slug === slug);
  if (!sector) return [];
  return articles.filter(article => sector.categories.some(category => categoryKey(category) === categoryKey(article.category))
    || (slug === "asesorias" && categoryKey(article.category) === "eventos" && monitoringArchive.has(article.slug)));
}

export const sectorProjectsPath = (slug: string) => `/noticias?rubro=${encodeURIComponent(slug)}`;
