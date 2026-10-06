import type { Article } from "./content-model";
import editorial from "./news-editorial.json";
import projects from "./project-news.json";

export const NEWS_EDITORIAL_REVISION = "2026-10-06";
const edits = editorial as Record<string, Pick<Article, "title" | "excerpt" | "body" | "highlights">>;
const monitoring = new Set(["monitores-comunitarios-segundo-semestre-2024", "monitoreo-vibraciones-primer-semestre-2024"]);

// Apply this editorial edition once per stored article. Subsequent administrator
// edits carry the revision and take precedence, including draft states and photos.
export function withEditorialNews(articles: Article[]): Article[] {
  const known = new Set(articles.map(article => article.slug));
  const current = articles.map(article => {
    const edit = edits[article.slug];
    if (!edit || article.editorialRevision === NEWS_EDITORIAL_REVISION) return article;
    return {
      ...article, ...edit,
      category: monitoring.has(article.slug) && article.category === "Eventos" ? "Monitoreo de tronaduras" : article.category,
      editorialRevision: NEWS_EDITORIAL_REVISION,
      updatedAt: "2026-10-06T15:00:00.000Z",
    };
  });
  return [...current, ...projects.filter(article => !known.has(article.slug)).map(article => ({ ...article, editorialRevision: NEWS_EDITORIAL_REVISION }) as Article)];
}
