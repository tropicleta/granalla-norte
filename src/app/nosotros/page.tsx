import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import { Container, CtaBand, PageHero, SectionTitle } from "@/components/ui";
import { about, site } from "@/lib/site";

export const metadata = pageMetadata("/nosotros", "Empresa de servicios mineros en Tierra Amarilla", "Granalla Norte integra ejecución, abastecimiento, logística y coordinación de recursos para operaciones y proyectos mineros de Atacama.");

export default function NosotrosPage() {
  return (
    <>
      <PageHero
        eyebrow="Quiénes somos"
        title="Una empresa del norte, comprometida con su gente y su territorio"
        intro={about.intro}
      />

      <section className="py-12 sm:py-16">
        <Container className="grid items-center gap-10">
          <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-[2rem] shadow-[var(--shadow-card)]">
            <Image
              src={site.images.team}
              alt="Equipo de Granalla Norte"
              width={1598}
              height={722}
              sizes="(min-width: 768px) 768px, 100vw"
              className="h-auto w-full"
            />
          </div>
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <SectionTitle eyebrow="Nuestro enfoque" title="De la necesidad a la ejecución" />
              <p className="text-body mt-5 text-lg leading-relaxed text-ink/75">{about.mission}</p>
            </div>
            <div>
              <SectionTitle eyebrow="Presencia local" title="Cercanía que se traduce en respuesta" />
              <p className="text-body mt-5 text-lg leading-relaxed text-ink/75">{about.vision}</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="border-y border-sand bg-sand-300 py-12 sm:py-16">
        <Container>
          <SectionTitle eyebrow="Valores" title="Cómo trabajamos" center />
          <ul className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {about.values.map((v, i) => (
              <li key={v.title} className="rounded-[var(--radius-card)] bg-white p-7 shadow-[var(--shadow-card)]">
                <span className="font-display text-sm font-semibold text-copper-600">0{i + 1}</span>
                <p className="mt-3 font-display text-xl font-semibold text-olive-900">{v.title}</p>
                <p className="text-body mt-2 text-ink/70">{v.text}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section className="py-12 sm:py-16">
        <Container>
          <SectionTitle eyebrow="Cómo resolvemos" title="Recursos coordinados para responder en terreno" />
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Requerimiento", "Definimos la necesidad."],
              ["Evaluación", "Revisamos condiciones y recursos."],
              ["Coordinación", "Organizamos maquinaria, suministro y logística con apoyo local según el proyecto."],
              ["Ejecución", "Ejecutamos con eficiencia, en los plazos definidos y con foco en la seguridad operacional, buscando cero accidentes."],
              ["Seguimiento", "Seguimos los trabajos y resultados, verificamos el cumplimiento y los estándares de calidad, y coordinamos ajustes ante cambios."],
            ].map(([title, text], i) => <li key={title} className="rounded-[var(--radius-card)] bg-sand-300 p-6"><span className="text-sm font-semibold text-copper-600">0{i + 1}</span><h3 className="mt-3 font-display text-xl font-semibold text-olive-900">{title}</h3><p className="text-body mt-2 text-sm text-ink/75">{text}</p></li>)}
          </ol>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="overflow-hidden rounded-[var(--radius-card)] bg-olive-900 text-cream">
              <div className="p-7"><p className="font-display text-4xl font-semibold text-khaki">22 días</p><h3 className="mt-3 font-display text-2xl font-semibold">Experiencia de ejecución reportada</h3><p className="text-body mt-3 leading-relaxed text-cream/80">En la consultoría PTI Minero Atacama, la empresa reportó un trabajo previsto para dos meses y ejecutado en 22 días. Este antecedente de ejecución está pendiente de respaldo documental y de identificación del alcance antes de presentarse como caso comercial.</p></div>
            </article>
            <article className="overflow-hidden rounded-[var(--radius-card)] bg-olive-900 text-cream">
              <div className="relative h-52 sm:h-60"><Image src={site.images.minerals} alt="Maxisacos de cloruro de sodio de Granalla Norte" fill sizes="(min-width: 1024px) 50vw, 100vw" className="object-contain" /></div>
              <div className="p-7"><p className="font-display text-4xl font-semibold text-khaki">200 toneladas</p><h3 className="mt-3 font-display text-2xl font-semibold">Logística adaptada a la operación</h3><p className="text-body mt-3 leading-relaxed text-cream/80">Cloruro de sodio en maxisacos de 1.000 kg, con entregas parciales coordinadas según la capacidad de almacenamiento del cliente y sin agregar costos de bodegaje.</p></div>
            </article>
          </div>
        </Container>
      </section>

      <CtaBand />
    </>
  );
}
