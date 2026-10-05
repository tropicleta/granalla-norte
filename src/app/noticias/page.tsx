import { pageMetadata } from "@/lib/seo";
import { Container, CtaBand, PageHero, PostCard } from "@/components/ui";
import { publishedArticles } from "@/lib/content";
import Link from "next/link";
import { projectSectors, sectorProjects } from "@/lib/service-projects";

export const metadata = pageMetadata("/noticias", "Proyectos mineros y obras comunitarias en Atacama", "Revisa proyectos de Granalla Norte: obras comunitarias, suministro de minerales y servicios para faenas en Tierra Amarilla y la Región de Atacama.");

export const dynamic = "force-dynamic";
export default async function NoticiasPage({ searchParams }: { searchParams: Promise<{ rubro?: string | string[] }> }) {
  const { rubro } = await searchParams;
  const sector = projectSectors.find(item => item.slug === rubro);
  const articles = await publishedArticles();
  const sorted = sector ? sectorProjects(articles, sector.slug) : articles;
  return (
    <>
      <PageHero
        eyebrow="Proyectos"
        title={sector ? `Proyectos y noticias de ${sector.label.toLowerCase()}` : "Trabajo que se ve en terreno"}
        intro={sector ? `Trabajos y actividades de Granalla Norte relacionados con ${sector.label.toLowerCase()} en Atacama.` : "Obras comunitarias, suministro a faenas y presencia en la industria. Lo último de Granalla Norte."}
      />
      <section className="py-12 sm:py-16">
        <Container>
          <nav aria-label="Filtrar proyectos por rubro" className="mb-8 flex flex-wrap gap-3">{[{ slug: "", label: "Todos" }, ...projectSectors].map(item => <Link key={item.slug} href={item.slug ? `/noticias?rubro=${item.slug}` : "/noticias"} aria-current={(sector?.slug ?? "") === item.slug ? "page" : undefined} className={`rounded-full px-5 py-3 text-sm font-semibold transition ${(sector?.slug ?? "") === item.slug ? "bg-olive-900 text-cream" : "bg-sand-300 text-olive-900 hover:bg-sand"}`}>{item.label}</Link>)}</nav>
          <p className="mb-6 text-sm text-ink/65">{sorted.length} {sorted.length === 1 ? "publicación" : "publicaciones"}{sector ? ` de ${sector.label.toLowerCase()}` : ""}</p>
          {!sorted.length && <div className="rounded-[var(--radius-card)] bg-sand-300 p-8"><h2 className="font-display text-2xl font-semibold text-olive-900">Aún no hay publicaciones de este rubro</h2><p className="text-body mt-3 text-ink/75">Consulta a nuestro equipo por la experiencia y las necesidades de tu proyecto.</p><Link href="/contacto" className="mt-5 inline-flex rounded-full bg-copper px-5 py-3 font-semibold text-white">Consultar proyecto</Link></div>}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </Container>
      </section>
      <CtaBand />
    </>
  );
}
