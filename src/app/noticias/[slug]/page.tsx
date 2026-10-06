import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, CtaBand, PostCard } from "@/components/ui";
import { formatDate, site } from "@/lib/site";
import { businessId, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { serviceDetails } from "@/lib/service-details";
import { publishedArticles } from "@/lib/content";
import recoveredNews from "@/lib/recovered-news.json";
import { YouTubeLite } from "@/components/YouTubeLite";

type Props = { params: Promise<{ slug: string }> };

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = (await publishedArticles()).find((p) => p.slug === slug);
  if (!post) return {};
  return {
    ...pageMetadata(`/noticias/${slug}`, post.title, post.excerpt, post.image),
    openGraph: { ...pageMetadata(`/noticias/${slug}`, post.title, post.excerpt, post.image).openGraph, type: "article", publishedTime: post.date, ...(post.updatedAt ? { modifiedTime: post.updatedAt } : {}) },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const posts = await publishedArticles();
  const post = posts.find((p) => p.slug === slug);
  if (!post) notFound();
  const related = posts.filter((p) => p.slug !== slug).slice(0, 3);
  const videos = recoveredNews.find(p => p.slug === slug)?.videos ?? [];
  const service = serviceDetails.find(s => s.projectCategories.includes(post.category));
  const historical = post.slug === "evento-de-polvo-en-tierra-amarilla";
  const activity = post.category === "Eventos" || post.category === "Monitoreo de tronaduras";
  const supply = post.category === "Minerales" || post.category === "Suministro y abastecimiento";
  const headings = historical ? ["Contexto del comunicado", "Medidas informadas", "Sobre este registro"] : activity ? ["La actividad", "Participación y contenidos", "Balance de la jornada"] : supply ? ["El suministro", "Desarrollo del servicio", "Resultado"] : ["El proyecto", "Trabajos realizados", "Resultado"];
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt, image: new URL(post.image, site.url).href, datePublished: post.date, ...(post.updatedAt ? { dateModified: post.updatedAt } : {}), author: { "@id": businessId }, publisher: { "@id": businessId }, mainEntityOfPage: `${site.url}/noticias/${post.slug}` };

  return (
    <>
      <article>
        <header className="brand-pattern bg-olive-900">
          <Container className="py-12 sm:py-16">
            <Link href="/noticias" className="text-sm font-medium text-khaki hover:underline">
              ← Proyectos y noticias
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-khaki">{post.category}</p>
            <h1 className="mt-3 max-w-4xl font-display text-3xl font-semibold leading-tight text-cream text-balance sm:text-5xl">
              {post.title}
            </h1>
            <p className="text-body mt-5 max-w-3xl text-base leading-relaxed text-cream/85 sm:text-lg">{post.excerpt}</p>
            <dl className="mt-8 grid max-w-3xl gap-6 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-cream/55">Fecha</dt>
                <dd className="mt-1 text-cream">
                  <time dateTime={post.date}>{formatDate(post.date)}</time>
                </dd>
              </div>
              <div>
                <dt className="text-cream/55">Ubicación</dt>
                <dd className="mt-1 text-cream">{post.location}</dd>
              </div>
              {post.client && (
                <div>
                  <dt className="text-cream/55">Mandante</dt>
                  <dd className="mt-1 text-cream">{post.client}</dd>
                </div>
              )}
            </dl>
          </Container>
        </header>

        <Container className="-mt-2 max-w-4xl py-14">
          <figure>
          <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)]">
            <Image src={post.image} unoptimized={post.image.startsWith("/api/media/")} alt={post.title} fill priority sizes="(min-width: 1024px) 900px, 100vw" className="object-cover" />
          </div>
          {post.imageCaption && <figcaption className="mt-3 text-sm leading-relaxed text-ink/65">{post.imageCaption}</figcaption>}
          </figure>
          <div className="mx-auto mt-10 max-w-2xl space-y-6 text-base leading-relaxed text-ink/80 sm:text-lg">
            {post.body.map((p, i) => (
              <section key={i}>
                {(i === 0 || i === 1 || i === post.body.length - 1) && <h2 className="mb-3 font-display text-xl font-semibold text-olive-900">{i === 0 ? headings[0] : i === post.body.length - 1 && post.body.length > 2 ? headings[2] : headings[1]}</h2>}
                <p className="text-body whitespace-pre-wrap">{p}</p>
              </section>
            ))}
            {!!post.highlights?.length && (
              <div className="mt-10 rounded-[var(--radius-card)] bg-sand-300 p-7">
                <h2 className="font-display text-xl font-semibold text-olive-900">{historical || activity ? "Puntos destacados" : "Alcance del trabajo"}</h2>
                <ul className="mt-4 space-y-3 text-base">
                  {post.highlights?.map((h) => (
                    <li key={h} className="text-body flex gap-3">
                      <span className="mt-2 size-2 shrink-0 rotate-45 bg-copper" aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {post.images.length > 1 && <section className="mt-10" aria-label="Registro fotográfico"><h2 className="mb-5 font-display text-xl font-semibold text-olive-900">Registro fotográfico</h2><div className="grid gap-5 sm:grid-cols-2">{post.images.slice(1).map((url, index) => <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-sand"><Image src={url} unoptimized={url.startsWith("/api/media/")} alt={`${post.title} — imagen ${index + 2}`} fill sizes="(min-width: 640px) 450px, 100vw" className="object-contain" /></div>)}</div></section>}
          {!!videos.length && <section className="mt-12 space-y-6" aria-label="Videos de la actividad">{videos.map((id, index) => <YouTubeLite key={id} id={id} title={`${post.title} — video ${index + 1}`} />)}</section>}
        </Container>
      </article>

      <section className="border-t border-sand py-16">
        <Container>
          <h2 className="font-display text-2xl font-semibold text-olive-900">Otros proyectos</h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </Container>
      </section>
      {service && <Container className="pb-10"><Link href={`/servicios/${service.slug}`} className="font-semibold text-copper-600 underline underline-offset-4">Conocer el servicio: {service.title}</Link></Container>}
      <CtaBand />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
    </>
  );
}
