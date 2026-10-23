import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ButtonLink, Container, CtaBand, PageHero } from "@/components/ui";
import { publishedMachines } from "@/lib/machinery";
import { availabilityLabels } from "@/lib/machinery-model";
import { pageMetadata, rentalPageSchema, serializeJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
const title = "Arriendo de excavadoras en Copiapó y Atacama";
const description = "Consulta excavadoras para excavación, carguío y movimiento de tierra en Copiapó y Atacama. Revisa modelos publicados y coordina fechas, traslado y condiciones de operación.";
async function excavators() {
  return (await publishedMachines()).filter(machine => machine.type === "Excavadora" && !machine.demo);
}

export async function generateMetadata(): Promise<Metadata> {
  if (!(await excavators()).length) return { robots: { index: false, follow: true } };
  return pageMetadata("/maquinaria/excavadoras", title, description);
}

export default async function ExcavatorsPage() {
  const machines = await excavators();
  if (!machines.length) notFound();
  return <>
    <PageHero eyebrow="Maquinaria / Excavación" title={title} intro="Equipos para excavación, carguío y preparación de terrenos. Revisa las excavadoras de nuestro catálogo y envíanos las condiciones de tu proyecto para evaluar la asignación, el traslado y la programación." />
    <Container className="py-10 sm:py-12">
      <nav aria-label="Ruta de navegación" className="mb-8 flex flex-wrap gap-x-2 text-sm text-copper-600"><Link href="/">Inicio</Link><span>/</span><Link href="/maquinaria">Maquinaria</Link><span>/</span><span aria-current="page">Excavadoras</span></nav>
      <section aria-labelledby="modelos-excavadoras">
        <h2 id="modelos-excavadoras" className="font-display text-3xl font-semibold text-olive-900">Excavadoras publicadas en nuestro catálogo</h2>
        <p className="text-body mt-4 max-w-3xl leading-relaxed text-ink/80">Estos son los modelos publicados. Las características indicadas corresponden a cada ficha; la disponibilidad para una fecha y las condiciones del arriendo deben confirmarse con nuestro equipo.</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">{machines.map(machine => <article key={machine.id} className="overflow-hidden rounded-[var(--radius-card)] bg-olive-900 text-cream">
          {machine.image && <div className="relative h-64 bg-olive-950"><Image src={machine.image} alt={machine.name} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-contain" unoptimized={machine.image.startsWith("/api/")} /></div>}
          <div className="p-6"><h3 className="font-display text-2xl font-semibold">{machine.name}</h3><p className="text-body mt-3 leading-relaxed text-cream/85">{machine.description}</p>
            <dl className="mt-4 space-y-3 text-sm">{machine.model && <div><dt className="text-khaki">Marca y modelo</dt><dd>{machine.model}</dd></div>}{machine.capacity && <div><dt className="text-khaki">Características publicadas</dt><dd>{machine.capacity}</dd></div>}<div><dt className="text-khaki">Disponibilidad</dt><dd>{availabilityLabels[machine.availability]}</dd></div></dl>
            <Link href={`/contacto?equipo=${encodeURIComponent(machine.name)}`} className="mt-5 inline-block font-semibold underline underline-offset-4">Cotizar {machine.name.toLowerCase()} →</Link>
          </div>
        </article>)}</div>
      </section>
      <section className="mt-12 grid gap-8 lg:grid-cols-2" aria-labelledby="preparar-excavacion">
        <div><h2 id="preparar-excavacion" className="font-display text-3xl font-semibold text-olive-900">Cómo definir la excavadora para tu trabajo</h2><p className="text-body mt-4 leading-relaxed text-ink/80">La elección se realiza con los antecedentes del frente de trabajo. Para una excavación, describe las dimensiones y profundidad previstas; para carguío o movimiento de tierra, indica el volumen aproximado y el material. Fotografías y planos ayudan a evaluar accesos, espacio de maniobra y coordinación con otros equipos.</p><p className="text-body mt-4 leading-relaxed text-ink/80">Envíanos también la ubicación en Copiapó, Tierra Amarilla u otra comuna de Atacama, las fechas y la duración estimada. La base de coordinación está en Tierra Amarilla y la atención se realiza en terreno.</p></div>
        <aside className="rounded-[var(--radius-card)] bg-sand-300 p-7"><h2 className="font-display text-2xl font-semibold text-olive-900">Antes de confirmar el arriendo</h2><ul className="text-body my-5 list-disc space-y-3 pl-5 text-ink/80"><li>Modelo y características que requiere el trabajo.</li><li>Fechas, duración y disponibilidad del equipo.</li><li>Accesos, traslado al frente de trabajo y retiro.</li><li>Condiciones de operación y responsabilidades incluidas en la cotización.</li></ul><ButtonLink href={`/contacto?equipo=${encodeURIComponent("Excavadora")}`}>Consultar arriendo de excavadora</ButtonLink></aside>
      </section>
      <section className="mt-12 max-w-3xl"><h2 className="font-display text-2xl font-semibold text-olive-900">¿Buscas la ejecución del movimiento de tierra?</h2><p className="text-body mt-4 leading-relaxed text-ink/80">Puedes consultar el equipo en arriendo o solicitar una propuesta de ejecución. En el <Link href="/servicios/movimiento-de-tierra" className="font-semibold text-copper-600 underline underline-offset-4">servicio de movimiento de tierra</Link> definimos las tareas, los materiales y los recursos según el alcance. Para carguío, transporte y apoyo en terreno, revisa también el <Link href="/maquinaria" className="font-semibold text-copper-600 underline underline-offset-4">catálogo completo de maquinaria</Link>.</p></section>
      <section className="mt-12 max-w-3xl"><h2 className="font-display text-2xl font-semibold text-olive-900">Preguntas sobre arriendo de excavadoras</h2><div className="mt-5 divide-y divide-sand">
        <div className="py-5"><h3 className="font-semibold text-olive-900">¿El arriendo incluye operador y traslado?</h3><p className="text-body mt-3 leading-relaxed text-ink/80">Las condiciones de operación, traslado y retiro se deben acordar en la cotización. Indica qué necesitas para confirmar los recursos y responsabilidades incluidos.</p></div>
        <div className="py-5"><h3 className="font-semibold text-olive-900">¿Cuál es el precio del arriendo?</h3><p className="text-body mt-3 leading-relaxed text-ink/80">Solicita una cotización con modelo o trabajo previsto, lugar, fechas y duración. No publicamos una tarifa fija porque es necesario definir esas condiciones antes de confirmar el servicio.</p></div>
        <div className="py-5"><h3 className="font-semibold text-olive-900">¿Cómo confirmo disponibilidad?</h3><p className="text-body mt-3 leading-relaxed text-ink/80">Usa el enlace de cotización del modelo o llama al <a href={`tel:${site.phone}`} className="font-semibold text-copper-600 underline underline-offset-4">{site.phoneDisplay}</a>. Una ficha publicada no reserva el equipo para tus fechas.</p></div>
      </div></section>
    </Container><CtaBand />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(rentalPageSchema("/maquinaria/excavadoras", title, description, { path: "/maquinaria", name: "Arriendo de maquinaria" })) }} />
  </>;
}
