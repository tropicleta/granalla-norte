import Image from "next/image";
import Link from "next/link";
import { ButtonLink, Container, CtaBand, Eyebrow, PostCard, SectionTitle } from "@/components/ui";
import { YouTubeLite } from "@/components/YouTubeLite";
import { about, site } from "@/lib/site";
import { ClientCarousel } from "@/components/ClientCarousel";
import { publishedArticles } from "@/lib/content";
import { businessId, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { ServiceCards } from "@/components/ServiceCards";

export const metadata = pageMetadata("", "Obras civiles y servicios mineros en Copiapó y Atacama", site.description);

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
          <Eyebrow dark>Copiapó · Tierra Amarilla · Atacama</Eyebrow>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-semibold leading-[1.08] tracking-tight text-cream text-balance sm:text-5xl lg:text-[3.5rem]">
            Obras civiles, movimiento de tierra y <span className="text-khaki">servicios mineros</span>.
          </h1>
          <p className="text-body mt-4 max-w-2xl text-base leading-relaxed text-cream/80 sm:text-lg">
            Atendemos empresas y faenas en Copiapó, Tierra Amarilla y Atacama: obras civiles, movimiento de tierra, mantención de caminos, suministro de materiales, arriendo de maquinaria y monitoreo de tronaduras.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/contacto">Cotizar un servicio</ButtonLink>
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
              title="Servicios para obras, caminos y faenas en Atacama"
              intro="Coordinamos ejecución en terreno, maquinaria, materiales y mediciones según el alcance de cada proyecto en Copiapó, Tierra Amarilla y la región."
            />
            <ButtonLink href="/servicios" variant="outline">
              Ver todos los servicios
            </ButtonLink>
          </div>

          <div className="mt-6"><ServiceCards /></div>
          <p className="text-body mt-6 max-w-3xl leading-relaxed text-ink/80">Para excavación, relleno o habilitación de terrenos, consulta el <Link href="/servicios/movimiento-de-tierra" className="font-semibold text-copper-600 underline underline-offset-4">servicio de movimiento de tierra</Link>. Si necesitas un equipo para tu propia ejecución, revisa el <Link href="/maquinaria/excavadoras" className="font-semibold text-copper-600 underline underline-offset-4">arriendo de excavadoras</Link>.</p>
        </Container>
      </section>

      {/* NOSOTROS + VIDEO */}
      <section className="brand-pattern bg-olive-900 py-10 sm:py-12">
        <Container>
          <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <SectionTitle
              dark
              eyebrow="Quiénes somos"
              title="Capacidad local para ejecutar, abastecer y responder"
              intro={about.intro}
            />
            <div className="mt-6">
              <ButtonLink href="/nosotros" variant="ghost">
                Nuestra historia
              </ButtonLink>
            </div>
          </div>
          <YouTubeLite id={site.youtubeId} title="Video promocional de Granalla Norte" />
          </div>
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v) => (
              <li key={v.title} className="border-l-2 border-khaki pl-4">
                <p className="font-semibold text-cream">{v.title}</p>
                <p className="text-body mt-1 text-sm text-cream/70">{v.text}</p>
              </li>
            ))}
          </ul>
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
