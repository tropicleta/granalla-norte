import Image from "next/image";
import Link from "next/link";
import { ButtonLink, Container, CtaBand, Eyebrow, PostCard, SectionTitle, Arrow } from "@/components/ui";
import { YouTubeLite } from "@/components/YouTubeLite";
import { about, services, site } from "@/lib/site";
import { ClientCarousel } from "@/components/ClientCarousel";
import { publishedArticles } from "@/lib/content";
import { businessId, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { servicePath } from "@/lib/service-details";
import { projectSectors, sectorProjectsPath } from "@/lib/service-projects";

export const metadata = pageMetadata("", "Servicios mineros y caminos en Atacama", site.description);

export const dynamic = "force-dynamic";
export default async function Home() {
  const posts = (await publishedArticles()).slice(0, 4);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd({
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": `${site.url}/#sitio`,
        name: site.name,
        url: `${site.url}/`,
        inLanguage: "es-CL",
        publisher: { "@id": businessId },
      }) }} />
      {/* HERO — propuesta de valor clara + CTA, en vez del carrusel de noticias */}
      <section id="inicio" className="relative isolate overflow-hidden bg-olive-950">
        <Image
          src={site.images.hero}
          alt="Maquinaria en trabajos de movimiento de tierra en Atacama"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-olive-950 via-olive-950/85 to-olive-950/30" aria-hidden />
        <Container className="py-10 sm:py-12 lg:py-14">
          <Eyebrow dark>Tierra Amarilla · Región de Atacama</Eyebrow>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-cream text-balance sm:text-5xl lg:text-[3.5rem]">
            Servicios mineros y mantención integral de <span className="text-khaki">caminos mineros</span>.
          </h1>
          <p className="text-body mt-4 max-w-2xl text-base leading-relaxed text-cream/80 sm:text-lg">
            Coordinamos maquinaria, materiales y ejecución en terreno para conservar la transitabilidad y apoyar la continuidad operacional de tu faena.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/contacto?servicio=caminos">Cotizar mantención de caminos</ButtonLink>
            <ButtonLink href="/servicios" variant="ghost">
              Nuestros servicios
            </ButtonLink>
          </div>
        </Container>
      </section>

      <ClientCarousel />

      {/* SERVICIOS */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              eyebrow="Qué hacemos"
              title="Caminos como foco, capacidades que se complementan"
              intro="Integramos maquinaria, materiales y ejecución para caminos y accesos. Obras civiles, abastecimiento y monitoreo complementan nuestra oferta para Atacama."
            />
            <ButtonLink href="/servicios" variant="outline">
              Ver todos los servicios
            </ButtonLink>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {services.map((s) => (
              <article
                key={s.slug}
                className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-olive-900 shadow-[var(--shadow-card)]"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-olive-950">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-contain"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-olive-950/70 to-transparent" aria-hidden />
                  <span className="absolute bottom-4 left-5 text-xs font-semibold uppercase tracking-[0.18em] text-khaki">
                    {s.kicker}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-xl font-semibold text-cream">
                    <Link href={servicePath(s.slug)} className="hover:text-khaki">
                      {s.title}
                    </Link>
                  </h3>
                  <p className="text-body mt-3 text-cream/80">{s.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.items.map((i) => (
                      <li key={i.name} className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-cream/90">
                        {i.name}
                      </li>
                    ))}
                  </ul>
                  <div className="mt-auto space-y-3 pt-6">
                    <Link href={servicePath(s.slug)} className="inline-flex items-center gap-1 text-sm font-semibold text-khaki hover:underline">Conocer más <Arrow /></Link>
                    {["obras-civiles", "mantencion-integral-de-caminos", "suministro-y-abastecimiento"].includes(s.slug) && <Link href="/maquinaria" className="flex items-center justify-between gap-2 rounded-xl bg-copper px-4 py-3 text-sm font-semibold text-white transition hover:bg-copper-600">Arriendo de maquinaria <Arrow /></Link>}
                    {s.slug === "monitoreo-de-tronaduras" && <Link href="/equipos-monitoreo" className="flex items-center justify-between gap-2 rounded-xl bg-copper px-4 py-3 text-sm font-semibold text-white transition hover:bg-copper-600">Arriendo de equipos <Arrow /></Link>}
                    <Link href={sectorProjectsPath(s.slug)} className="block rounded-xl border border-white/20 bg-white/5 px-4 py-3 transition hover:bg-white/10"><span className="block text-xs text-khaki">Experiencia en {projectSectors.find(item => item.slug === s.slug)?.label.toLowerCase()}</span><span className="mt-1 flex items-center justify-between gap-2 text-sm font-semibold text-cream">Ver proyectos y noticias <Arrow /></span></Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* NOSOTROS + VIDEO */}
      <section className="brand-pattern bg-olive-900 py-12 sm:py-16">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionTitle
              dark
              eyebrow="Quiénes somos"
              title="Capacidad local para ejecutar, abastecer y responder"
              intro={about.intro}
            />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {about.values.map((v) => (
                <li key={v.title} className="border-l-2 border-khaki pl-4">
                  <p className="font-semibold text-cream">{v.title}</p>
                  <p className="text-body mt-1 text-sm text-cream/70">{v.text}</p>
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <ButtonLink href="/nosotros" variant="ghost">
                Nuestra historia
              </ButtonLink>
            </div>
          </div>
          <YouTubeLite id={site.youtubeId} title="Video promocional de Granalla Norte" />
        </Container>
      </section>

      {/* PROYECTOS */}
      <section className="py-12 sm:py-16">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              eyebrow="Proyectos y noticias"
              title="Proyectos destacados en faena y comunidad"
            />
            <ButtonLink href="/noticias" variant="outline">
              Ver todos
            </ButtonLink>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
