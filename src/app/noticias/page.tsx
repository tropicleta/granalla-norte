import { pageMetadata } from "@/lib/seo";
import { Container, CtaBand, PageHero, PostCard } from "@/components/ui";
import { publishedArticles } from "@/lib/content";

export const metadata = pageMetadata("/noticias", "Proyectos mineros y obras comunitarias en Atacama", "Revisa proyectos de Granalla Norte: obras comunitarias, suministro de minerales y servicios para faenas en Tierra Amarilla y la Región de Atacama.");

export const dynamic = "force-dynamic";
export default async function NoticiasPage() {
  const sorted = await publishedArticles();
  return (
    <>
      <PageHero
        eyebrow="Proyectos"
        title="Trabajo que se ve en terreno"
        intro="Obras comunitarias, suministro a faenas y presencia en la industria. Lo último de Granalla Norte."
      />
      <section className="py-12 sm:py-16">
        <Container>
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
