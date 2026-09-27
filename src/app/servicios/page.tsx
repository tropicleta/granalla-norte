import type { Metadata } from "next";
import Image from "next/image";
import { Container, CtaBand, PageHero } from "@/components/ui";
import { services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Venta de cloruro de sodio, sílice, bischofita y estabilizado; monitoreo de tronaduras; consultoría minera y obras civiles en Tierra Amarilla y Copiapó.",
};

export default function ServiciosPage() {
  return (
    <>
      <PageHero
        eyebrow="Servicios"
        title="Suministramos, medimos y construimos"
        intro="Soluciones confiables para la industria y la comunidad: minerales no metálicos, asesorías especializadas y obras civiles para potenciar tus proyectos."
      />

      {/* Índice rápido */}
      <nav aria-label="Líneas de servicio" className="sticky top-18 z-40 border-b border-sand bg-cream/95 backdrop-blur">
        <Container>
          <ul className="flex gap-2 overflow-x-auto py-3 text-sm">
            {services.map((s) => (
              <li key={s.slug} className="shrink-0">
                <a href={`#${s.slug}`} className="block rounded-full px-4 py-2 font-medium text-olive-800 hover:bg-sand-300">
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </nav>

      {services.map((s, idx) => (
        <section key={s.slug} id={s.slug} className={`scroll-mt-36 py-20 sm:py-24 ${idx % 2 ? "bg-sand-300" : ""}`}>
          <Container className="grid items-start gap-12 lg:grid-cols-2">
            <div className={`relative aspect-[4/3] overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)] ${idx % 2 ? "lg:order-2" : ""}`}>
              <Image src={s.image} alt="" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-khaki-700">{s.kicker}</p>
              <h2 className="mt-3 font-display text-3xl font-semibold text-olive-900 sm:text-4xl">{s.title}</h2>
              <p className="mt-4 text-lg text-ink/70">{s.summary}</p>
              <ul className="mt-8 divide-y divide-olive-900/10 border-y border-olive-900/10">
                {s.items.map((i) => (
                  <li key={i.name} className="flex gap-4 py-5">
                    <span className="mt-1.5 size-2.5 shrink-0 rotate-45 bg-copper" aria-hidden />
                    <div>
                      <p className="font-semibold text-olive-900">{i.name}</p>
                      <p className="mt-1 text-ink/70">{i.detail}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      ))}

      <CtaBand />
    </>
  );
}
