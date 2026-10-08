import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, Container, CtaBand, PageHero } from "@/components/ui";
import { MonitoringAccess } from "@/components/MonitoringAccess";
import { MachineryAccess } from "@/components/MachineryAccess";
import { ServiceProjects } from "@/components/ServiceProjects";
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
  const articles = await publishedArticles();
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
          <div className="overflow-hidden rounded-[var(--radius-card)]"><Image src={service.image} alt={service.title} width={1600} height={900} sizes="(min-width: 1024px) 50vw, 100vw" className="h-auto w-full" /></div>
          <MachineryAccess serviceSlug={service.slug} /><MonitoringAccess serviceSlug={service.slug} />
          <aside className="mt-6 rounded-[var(--radius-card)] bg-sand-300 p-7">
            <h2 className="font-display text-2xl font-semibold text-olive-900">Datos para cotizar</h2>
            <ul className="my-5 list-disc space-y-3 pl-5 text-ink/80">{detail.quote.map(item => <li key={item}>{item}</li>)}</ul>
            <ButtonLink href={service.slug === "mantencion-integral-de-caminos" ? "/contacto?servicio=caminos" : "/contacto"}>Cotizar {service.title.toLowerCase()}</ButtonLink>
          </aside>
        </div>
      </div>
      {service.slug === "mantencion-integral-de-caminos" && <section className="mt-12 rounded-[var(--radius-card)] bg-olive-900 p-7 text-cream">
        <h2 className="font-display text-3xl font-semibold">Una solución integrada para tu camino</h2>
        <ol className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Evaluación", "Revisamos el estado del camino, el tránsito, los accesos y los requisitos del mandante."],
            ["Coordinación", "Organizamos maquinaria, materiales y logística según alcance y disponibilidad."],
            ["Ejecución", "Coordinamos perfilado, conformación, compactación y humectación con la programación de la faena."],
            ["Seguimiento", "Revisamos el alcance ejecutado y coordinamos ajustes según las condiciones del terreno."],
          ].map(([title, text], index) => <li key={title}><p className="text-sm text-khaki">0{index + 1}</p><h3 className="mt-2 font-semibold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-cream/80">{text}</p></li>)}
        </ol>
        <p className="mt-6 border-t border-white/20 pt-5 text-sm leading-relaxed text-cream/80">La selección de materiales y cualquier aplicación de cloruro de sodio se evalúan según especificaciones técnicas, condiciones ambientales y requisitos del proyecto.</p>
      </section>}
      <ServiceProjects serviceSlug={service.slug} articles={articles} />
      <section className="mt-14 max-w-3xl"><h2 className="font-display text-3xl font-semibold text-olive-900">Preguntas frecuentes</h2><div className="mt-6 divide-y divide-sand">{detail.questions.map(q => <div key={q.question} className="py-5"><h3 className="font-semibold text-olive-900">{q.question}</h3><p className="text-body mt-3 leading-relaxed text-ink/80">{q.answer}</p></div>)}</div></section>
      <nav aria-label="Otros servicios" className="mt-10 flex flex-wrap gap-4">{serviceDetails.filter(s => s.slug !== slug).map(s => <Link key={s.slug} href={`/servicios/${s.slug}`} className="text-sm font-semibold text-copper-600 underline underline-offset-4">{services.find(line => line.slug === s.serviceSlug)!.title}</Link>)}</nav>
    </Container>
    <CtaBand />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
  </>;
}
