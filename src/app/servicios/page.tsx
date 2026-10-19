import Image from "next/image";
import Link from "next/link";
import { Container, CtaBand, PageHero, Arrow } from "@/components/ui";
import { services } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";
import { servicePath } from "@/lib/service-details";
import { publishedArticles } from "@/lib/content";
import { MonitoringAccess } from "@/components/MonitoringAccess";
import { MachineryAccess } from "@/components/MachineryAccess";
import { ServiceProjects } from "@/components/ServiceProjects";
import photoStyles from "@/components/ServiceCards.module.css";

export const metadata = pageMetadata("/servicios", "Servicios para minería y obras civiles en Atacama", "Obras civiles, movimiento de tierra, caminos, suministro y abastecimiento, maquinaria y monitoreo de tronaduras en Tierra Amarilla y Atacama.");
export const dynamic = "force-dynamic";

export default async function ServiciosPage() {
  const articles = await publishedArticles();
  return <>
    <PageHero eyebrow="Servicios" title="Caminos mineros y capacidades complementarias en Atacama" intro="Nuestro foco es la mantención integral de caminos y accesos, con maquinaria, materiales y ejecución coordinados. Complementamos esta solución con obras civiles, abastecimiento y monitoreo de tronaduras según cada requerimiento." />
    <nav aria-label="Líneas de servicio" className="sticky top-18 z-40 border-b border-sand bg-cream/95 backdrop-blur">
      <Container><ul className="flex gap-2 overflow-x-auto py-3 text-sm">{services.map(s => <li key={s.slug} className="shrink-0"><a href={`#${s.slug}`} className="block rounded-full px-4 py-2 font-medium text-olive-800 hover:bg-sand-300">{s.title}</a></li>)}</ul></Container>
    </nav>
    <Container className="space-y-6 py-10 sm:space-y-8 sm:py-12">
      {services.map(s => <section key={s.slug} id={s.slug} aria-labelledby={`titulo-${s.slug}`} className="scroll-mt-40 overflow-hidden rounded-[var(--radius-card)] bg-olive-900 text-cream shadow-[var(--shadow-card)]">
        {s.slug === "mantencion-integral-de-caminos" && <span id="mantencion-de-caminos" className="block scroll-mt-40" aria-hidden />}
        {s.slug === "suministro-y-abastecimiento" && <span id="minerales" className="block scroll-mt-40" aria-hidden />}
        {s.slug === "monitoreo-de-tronaduras" && <span id="asesorias" className="block scroll-mt-40" aria-hidden />}
        <div className="grid items-start gap-6 p-6 sm:p-8 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-8">
          <div className="lg:col-start-1 lg:row-start-1">
            <Image src={s.image} alt={s.title} width={1600} height={900} sizes="(min-width: 1024px) 45vw, 100vw" className={`mx-auto h-auto max-h-72 w-full rounded-2xl object-contain ${photoStyles.listingPhoto} ${s.slug === "suministro-y-abastecimiento" ? photoStyles.supplyPhoto : s.slug === "monitoreo-de-tronaduras" ? photoStyles.monitoringPhoto : s.slug === "obras-civiles" ? photoStyles.civilPhoto : ""}`} />
          </div>
          <div className="min-w-0 lg:col-start-2 lg:row-start-1 lg:row-span-2">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-khaki">{s.kicker}</p>
            <h2 id={`titulo-${s.slug}`} className="mt-3 font-display text-3xl font-semibold leading-tight sm:text-4xl">{s.title}</h2>
            <p className="text-body mt-4 leading-relaxed text-cream/85">{s.summary}</p>
            <ul className="mt-6 grid gap-5 border-y border-white/15 py-5">{s.items.map(i => <li key={i.name} className="flex gap-3">
              <span className="mt-2 size-2 shrink-0 rotate-45 bg-khaki" aria-hidden />
              <div className="min-w-0"><h3 className="font-semibold text-cream">{i.name}</h3><p className="text-body mt-2 text-sm leading-relaxed text-cream/80">{i.detail}</p></div>
            </li>)}</ul>
          </div>
          <div className="lg:col-start-1 lg:row-start-2 [&>a]:mt-0">
            <MachineryAccess serviceSlug={s.slug} /><MonitoringAccess serviceSlug={s.slug} />
            <div className="mt-6 flex flex-wrap gap-3">
              <Link href={servicePath(s.slug)} className="inline-flex items-center gap-2 rounded-full bg-khaki px-5 py-3 text-sm font-semibold text-olive-950 hover:bg-cream">Conocer alcance y cómo cotizar <Arrow /></Link>
              <Link href={`/contacto?servicio=${s.slug}`} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-semibold text-cream hover:bg-white/10">Consultar este servicio <Arrow /></Link>
            </div>
          </div>
        </div>
        <ServiceProjects serviceSlug={s.slug} articles={articles} dark />
      </section>)}
    </Container>
    <CtaBand />
  </>;
}
