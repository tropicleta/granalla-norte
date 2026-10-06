import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Container, CtaBand, PostCard } from "@/components/ui";
import { formatDate, site } from "@/lib/site";
import { businessId, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { serviceDetails } from "@/lib/service-details";
import { publishedArticles } from "@/lib/content";
import recoveredNews from "@/lib/recovered-news.json";
import { YouTubeLite } from "@/components/YouTubeLite";
import { NewsPhotos } from "@/components/NewsPhotos";

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
          <Container className="py-9 sm:py-12">
            <Link href="/noticias" className="text-sm font-medium text-khaki hover:underline">
              ← Proyectos y noticias
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-khaki">{post.category}</p>
            <h1 className="mt-3 max-w-4xl font-display text-3xl font-semibold leading-tight text-cream text-balance sm:text-4xl">
              {post.title}
            </h1>
            <p className="text-body mt-5 max-w-3xl text-base leading-relaxed text-cream/85 sm:text-lg">{post.excerpt}</p>
            <dl className="mt-6 grid max-w-3xl grid-cols-2 gap-4 text-sm sm:grid-cols-3">
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

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
          <div className="order-2 min-w-0 space-y-6 text-base leading-7 text-ink/80 lg:order-1">
            {post.body.map((p, i) => (
              <section key={i}>
                {(i === 0 || i === 1 || i === post.body.length - 1) && <h2 className="mb-3 font-display text-xl font-semibold text-olive-900">{i === 0 ? headings[0] : i === post.body.length - 1 && post.body.length > 2 ? headings[2] : headings[1]}</h2>}
                <p className="text-body whitespace-pre-wrap">{p}</p>
              </section>
            ))}
            {!!post.highlights?.length && (
              <div className="mt-8 rounded-2xl border border-olive-900/10 bg-sand-300 p-5 sm:p-6">
                <h2 className="font-display text-xl font-semibold text-olive-900">Aspectos destacados</h2>
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
          <div className="order-1 mx-auto w-full max-w-xl lg:order-2"><NewsPhotos images={post.images.length ? post.images : [post.image]} title={post.title} caption={post.imageCaption} /></div>
          </div>
          {!!videos.length && <section className="mt-8 grid gap-6 sm:grid-cols-2" aria-label="Videos de la actividad">{videos.map((id, index) => <YouTubeLite key={id} id={id} title={`${post.title} — video ${index + 1}`} />)}</section>}
        </div>
      </article>

      <section className="border-t border-sand py-10 sm:py-12">
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
