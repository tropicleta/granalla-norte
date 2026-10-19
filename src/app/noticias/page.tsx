import { pageMetadata } from "@/lib/seo";
import { Container, CtaBand, PageHero, PostCard } from "@/components/ui";
import { publishedArticles } from "@/lib/content";
import Link from "next/link";
import { projectSectors, sectorProjects } from "@/lib/service-projects";
import { categoryKey } from "@/lib/news-categories";

export const metadata = pageMetadata("/noticias", "Proyectos mineros y obras comunitarias en Atacama", "Revisa proyectos de Granalla Norte: obras comunitarias, suministro de minerales y servicios para faenas en Tierra Amarilla y la Región de Atacama.");

export const dynamic = "force-dynamic";
export default async function NoticiasPage({ searchParams }: { searchParams: Promise<{ rubro?: string | string[] }> }) {
  const { rubro } = await searchParams;
  const sector = projectSectors.find(item => item.slug === rubro);
  const isEvents = rubro === "eventos";
  const activeFilter = isEvents ? "eventos" : sector?.slug ?? "";
  const articles = await publishedArticles();
  // These archive entries concern weather or monitoring work, not industry attendance.
  const archiveNonEvents = new Set(["evento-de-polvo-en-tierra-amarilla", "monitores-comunitarios-segundo-semestre-2024", "monitoreo-vibraciones-primer-semestre-2024"]);
  const sorted = isEvents
    ? articles.filter(article => categoryKey(article.category) === "eventos" && !archiveNonEvents.has(article.slug))
    : sector ? sectorProjects(articles, sector.slug) : articles;
  return (
    <>
      <PageHero
        eyebrow="Proyectos y noticias"
        title={isEvents ? "Nuestra participación en eventos" : sector ? `Proyectos y noticias de ${sector.label.toLowerCase()}` : "Trabajo que se ve en terreno"}
        intro={isEvents ? "Ferias, seminarios y encuentros donde compartimos nuestro trabajo y fortalecemos vínculos con la industria minera regional." : sector ? `Trabajos y actividades de Granalla Norte relacionados con ${sector.label.toLowerCase()} en Atacama.` : "Obras comunitarias, suministro a faenas y presencia en la industria. Lo último de Granalla Norte."}
      />
      <section className="py-12 sm:py-16">
        <Container>
          <nav aria-label="Filtrar noticias por tema" className="mb-8 flex flex-wrap gap-3">{[{ slug: "", label: "Todos" }, { slug: "eventos", label: "Eventos" }, ...projectSectors].map(item => <Link key={item.slug} href={item.slug ? `/noticias?rubro=${item.slug}` : "/noticias"} aria-current={activeFilter === item.slug ? "page" : undefined} className={`rounded-full px-5 py-3 text-sm font-semibold transition ${activeFilter === item.slug ? "bg-olive-900 text-cream" : "bg-sand-300 text-olive-900 hover:bg-sand"}`}>{item.label}</Link>)}</nav>
          <p className="mb-6 text-sm text-ink/65">{sorted.length} {sorted.length === 1 ? "publicación" : "publicaciones"}{isEvents ? " de eventos" : sector ? ` de ${sector.label.toLowerCase()}` : ""}</p>
          {!sorted.length && (isEvents ? <div className="rounded-[var(--radius-card)] bg-sand-300 p-8"><h2 className="font-display text-2xl font-semibold text-olive-900">Pronto compartiremos nuestras participaciones</h2><p className="text-body mt-3 text-ink/75">Aquí publicaremos las ferias, seminarios y encuentros en los que participe Granalla Norte.</p></div> : <div className="rounded-[var(--radius-card)] bg-sand-300 p-8"><h2 className="font-display text-2xl font-semibold text-olive-900">Aún no hay publicaciones de este rubro</h2><p className="text-body mt-3 text-ink/75">Consulta a nuestro equipo por la experiencia y las necesidades de tu proyecto.</p><Link href="/contacto" className="mt-5 inline-flex rounded-full bg-copper px-5 py-3 font-semibold text-white">Consultar proyecto</Link></div>)}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((p) => (
              <PostCard key={p.slug} post={p} linkLabel={isEvents ? "Ver evento" : undefined} />
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
