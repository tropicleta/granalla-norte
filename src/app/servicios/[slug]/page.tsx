import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, Container, CtaBand, PageHero, PostCard } from "@/components/ui";
import { services, site } from "@/lib/site";
import { serviceDetails } from "@/lib/service-details";
import { businessId, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { publishedArticles } from "@/lib/content";

type Props = { params: Promise<{ slug: string }> };
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const detail = serviceDetails.find(s => s.slug === slug);
  if (!detail) return { robots: { index: false, follow: false } };
  const service = services.find(s => s.slug === detail.serviceSlug)!;
  return pageMetadata(`/servicios/${slug}`, detail.title, detail.description, service.image);
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const detail = serviceDetails.find(s => s.slug === slug);
  if (!detail) notFound();
  const service = services.find(s => s.slug === detail.serviceSlug)!;
  const projects = (await publishedArticles()).filter(p => detail.projectCategories.includes(p.category)).slice(0, 3);
  const url = `${site.url}/servicios/${slug}`;
  const schema = {
    "@context": "https://schema.org", "@graph": [
      { "@type": "Service", "@id": `${url}#servicio`, name: service.title, serviceType: service.title, url, description: detail.description, provider: { "@id": businessId }, areaServed: ["Tierra Amarilla", "Copiapó", "Región de Atacama"] },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
        { "@type": "ListItem", position: 2, name: "Servicios", item: `${site.url}/servicios` },
        { "@type": "ListItem", position: 3, name: service.title, item: url },
      ] },
    ],
  };
  return <>
    <PageHero eyebrow="Servicios · Región de Atacama" title={detail.title} intro={detail.intro} />
    <Container className="py-10 sm:py-12">
      <nav aria-label="Ruta de navegación" className="mb-8 text-sm text-copper-600"><Link href="/">Inicio</Link> / <Link href="/servicios">Servicios</Link> / <span aria-current="page">{service.title}</span></nav>
      <div className="grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-display text-3xl font-semibold text-olive-900">Qué necesidad resolvemos</h2>
          <p className="text-body mt-4 leading-relaxed text-ink/80">{detail.problem}</p>
          <h2 className="mt-8 font-display text-2xl font-semibold text-olive-900">Qué incluye el servicio</h2>
          <p className="text-body mt-4 leading-relaxed text-ink/80">{detail.scope}</p>
          <ul className="mt-6 space-y-4">{service.items.map(item => <li key={item.name}><h3 className="font-semibold text-olive-900">{item.name}</h3><p className="text-body mt-1 text-ink/75">{item.detail}</p></li>)}</ul>
        </div>
        <div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]"><Image src={service.image} alt={service.title} fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" /></div>
          <aside className="mt-6 rounded-[var(--radius-card)] bg-sand-300 p-7">
            <h2 className="font-display text-2xl font-semibold text-olive-900">Datos para cotizar</h2>
            <ul className="my-5 list-disc space-y-3 pl-5 text-ink/80">{detail.quote.map(item => <li key={item}>{item}</li>)}</ul>
            <ButtonLink href="/contacto">Consultar {service.title.toLowerCase()}</ButtonLink>
          </aside>
        </div>
      </div>
      {service.slug === "mantencion-de-caminos" && <p className="mt-8"><Link href="/maquinaria" className="font-semibold text-copper-600 underline underline-offset-4">Ver catálogo de maquinaria para arriendo</Link></p>}
      {!!projects.length && <section className="mt-14"><h2 className="font-display text-3xl font-semibold text-olive-900">Proyectos relacionados</h2><div className="mt-7 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{projects.map(project => <PostCard key={project.slug} post={project} />)}</div></section>}
      <section className="mt-14 max-w-3xl"><h2 className="font-display text-3xl font-semibold text-olive-900">Preguntas frecuentes</h2><div className="mt-6 divide-y divide-sand">{detail.questions.map(q => <div key={q.question} className="py-5"><h3 className="font-semibold text-olive-900">{q.question}</h3><p className="text-body mt-3 leading-relaxed text-ink/80">{q.answer}</p></div>)}</div></section>
      <nav aria-label="Otros servicios" className="mt-10 flex flex-wrap gap-4">{serviceDetails.filter(s => s.slug !== slug).map(s => <Link key={s.slug} href={`/servicios/${s.slug}`} className="text-sm font-semibold text-copper-600 underline underline-offset-4">{services.find(line => line.slug === s.serviceSlug)!.title}</Link>)}</nav>
    </Container>
    <CtaBand />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
  </>;
}
