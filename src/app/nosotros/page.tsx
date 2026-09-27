import type { Metadata } from "next";
import Image from "next/image";
import { Container, CtaBand, PageHero, SectionTitle } from "@/components/ui";
import { about, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Nosotros",
  description:
    "Empresa sostenible de Tierra Amarilla que presta servicios a la minería: minerales no metálicos, obras civiles, asesoría y monitoreo de vibraciones.",
};

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        eyebrow="Quiénes somos"
        title="Una empresa del norte, comprometida con su gente y su territorio"
        intro={about.intro}
      />

      <section className="py-24">
        <Container className="grid items-center gap-14 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)]">
            <Image
              src={site.images.hero}
              alt="Equipo de Granalla Norte"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="space-y-12">
            <div>
              <SectionTitle eyebrow="Misión" title="Lo que hacemos cada día" />
              <p className="mt-5 text-lg leading-relaxed text-ink/75">{about.mission}</p>
            </div>
            <div>
              <SectionTitle eyebrow="Visión" title="Hacia dónde vamos" />
              <p className="mt-5 text-lg leading-relaxed text-ink/75">{about.vision}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-sand bg-sand-300 py-20">
        <Container>
          <SectionTitle eyebrow="Valores" title="Cómo trabajamos" center />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v, i) => (
              <li key={v.title} className="rounded-[var(--radius-card)] bg-white p-7 shadow-[var(--shadow-card)]">
                <span className="font-display text-sm font-semibold text-copper-600">0{i + 1}</span>
                <p className="mt-3 font-display text-xl font-semibold text-olive-900">{v.title}</p>
                <p className="mt-2 text-ink/70">{v.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
