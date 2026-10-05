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
  const schema = { "@context": "https://schema.org", "@type": "Article", headline: post.title, description: post.excerpt, image: new URL(post.image, site.url).href, datePublished: post.date, ...(post.updatedAt ? { dateModified: post.updatedAt } : {}), author: { "@id": businessId }, publisher: { "@id": businessId }, mainEntityOfPage: `${site.url}/noticias/${post.slug}` };

  return (
    <>
      <article>
        <header className="topo bg-olive-900">
          <Container className="py-16 sm:py-20">
            <Link href="/noticias" className="text-sm font-medium text-khaki hover:underline">
              ← Proyectos y noticias
            </Link>
            <p className="mt-6 text-xs font-semibold uppercase tracking-[0.2em] text-khaki">{post.category}</p>
            <h1 className="mt-3 max-w-4xl font-display text-3xl font-semibold leading-tight text-cream text-balance sm:text-5xl">
              {post.title}
            </h1>
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
          <div className="relative aspect-[16/9] overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)]">
            <Image src={post.image} unoptimized={post.image.startsWith("/api/media/")} alt={post.title} fill priority sizes="(min-width: 1024px) 900px, 100vw" className="object-cover" />
          </div>
          <div className="mx-auto mt-12 max-w-2xl space-y-5 text-lg leading-relaxed text-ink/80">
            {post.body.map((p, i) => (
              <p key={i} className="text-body whitespace-pre-wrap">{p}</p>
            ))}
            {!!post.highlights?.length && (
              <div className="mt-10 rounded-[var(--radius-card)] bg-sand-300 p-7">
                <h2 className="font-display text-xl font-semibold text-olive-900">Alcance del trabajo</h2>
                <ul className="mt-4 space-y-3 text-base">
                  {post.highlights?.map((h) => (
                    <li key={h} className="flex gap-3">
                      <span className="mt-2 size-2 shrink-0 rotate-45 bg-copper" aria-hidden />
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {post.images.length > 1 && <div className="mt-10 grid gap-5 sm:grid-cols-2">{post.images.slice(1).map((url, index) => <div key={url} className="relative aspect-[4/3] overflow-hidden rounded-2xl"><Image src={url} unoptimized={url.startsWith("/api/media/")} alt={`${post.title} — imagen ${index + 2}`} fill sizes="(min-width: 640px) 450px, 100vw" className="object-cover" /></div>)}</div>}
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
