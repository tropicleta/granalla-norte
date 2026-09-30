import Image from "next/image";
import Link from "next/link";
import { ButtonLink, Container, CtaBand, Eyebrow, PostCard, SectionTitle, Arrow } from "@/components/ui";
import { YouTubeLite } from "@/components/YouTubeLite";
import { about, clients, pillars, services, site } from "@/lib/site";
import { publishedArticles } from "@/lib/content";

export const dynamic = "force-dynamic";
export default async function Home() {
  const posts = (await publishedArticles()).slice(0, 4);
  return (
    <>
      {/* HERO — propuesta de valor clara + CTA, en vez del carrusel de noticias */}
      <section className="relative isolate overflow-hidden bg-olive-950">
        <Image
          src={site.images.hero}
          alt="Equipo de Granalla Norte en faena en Tierra Amarilla"
          fill
          priority
          sizes="100vw"
          className="-z-10 object-cover opacity-45"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-olive-950 via-olive-950/85 to-olive-950/30" aria-hidden />
        <Container className="py-24 sm:py-32 lg:py-40">
          <Eyebrow dark>Tierra Amarilla · Región de Atacama</Eyebrow>
          <h1 className="mt-6 max-w-3xl font-display text-4xl font-semibold leading-[1.04] tracking-tight text-cream text-balance sm:text-6xl lg:text-7xl">
            Soluciones mineras hechas en el <span className="text-khaki">norte</span>, por gente del norte.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-cream/80">
            Suministro de minerales no metálicos, monitoreo de tronaduras y obras civiles para la minería y las
            comunidades de Atacama.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/contacto">Cotizar proyecto</ButtonLink>
            <ButtonLink href="/servicios" variant="ghost">
              Nuestros servicios
            </ButtonLink>
          </div>
        </Container>
        <div className="chevron absolute inset-x-0 bottom-0 h-1.5 opacity-50" aria-hidden />
      </section>

      {/* CIFRAS */}
      <section aria-label="Granalla Norte en cifras" className="border-b border-sand bg-sand-300">
        <Container>
          <dl className="grid grid-cols-2 divide-sand lg:grid-cols-4 lg:divide-x">
            {pillars.map((p) => (
              <div key={p.label} className="flex flex-col px-2 py-8 lg:px-8">
                <dt className="order-2 mt-1 text-sm text-ink/65">{p.label}</dt>
                <dd className="font-display text-3xl font-semibold text-olive-900 sm:text-4xl">{p.value}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* SERVICIOS */}
      <section className="py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              eyebrow="Qué hacemos"
              title="Tres líneas de servicio, un solo proveedor en terreno"
              intro="Desde el camino de acceso hasta la obra comunitaria: suministramos, medimos y construimos."
            />
            <ButtonLink href="/servicios" variant="outline">
              Ver todos los servicios
            </ButtonLink>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {services.map((s) => (
              <article
                key={s.slug}
                className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={s.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-olive-950/70 to-transparent" aria-hidden />
                  <span className="absolute bottom-4 left-5 text-xs font-semibold uppercase tracking-[0.18em] text-khaki">
                    {s.kicker}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-7">
                  <h3 className="font-display text-xl font-semibold text-olive-900">
                    <Link href={`/servicios#${s.slug}`} className="after:absolute after:inset-0">
                      {s.title}
                    </Link>
                  </h3>
                  <p className="mt-3 text-ink/70">{s.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {s.items.map((i) => (
                      <li key={i.name} className="rounded-full bg-sand-300 px-3 py-1 text-xs font-medium text-olive-800">
                        {i.name}
                      </li>
                    ))}
                  </ul>
                  <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-semibold text-copper-600">
                    Conocer más <Arrow />
                  </span>
                </div>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* NOSOTROS + VIDEO */}
      <section className="topo bg-olive-900 py-24">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <div>
            <SectionTitle
              dark
              eyebrow="Quiénes somos"
              title="Innovación minera al servicio de Tierra Amarilla"
              intro={about.intro}
            />
            <ul className="mt-10 grid gap-5 sm:grid-cols-2">
              {about.values.map((v) => (
                <li key={v.title} className="border-l-2 border-khaki pl-4">
                  <p className="font-semibold text-cream">{v.title}</p>
                  <p className="mt-1 text-sm text-cream/70">{v.text}</p>
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
      <section className="py-24">
        <Container>
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SectionTitle
              eyebrow="Proyectos y noticias"
              title="Trabajo reciente en faena y comunidad"
            />
            <ButtonLink href="/noticias" variant="outline">
              Ver todos
            </ButtonLink>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {posts.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </Container>
      </section>

      {/* CLIENTES */}
      <section aria-labelledby="clientes" className="border-y border-sand bg-sand-300 py-14">
        <Container>
          <h2 id="clientes" className="text-center text-xs font-semibold uppercase tracking-[0.2em] text-khaki-700">
            Han confiado en nosotros
          </h2>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
            {clients.map((c) => (
              <li key={c} className="font-display text-lg font-semibold text-olive-700/80 sm:text-xl">
                {c}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
