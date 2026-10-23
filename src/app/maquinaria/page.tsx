import { LocalServiceCoverage } from "@/components/LocalServiceCoverage";
import { pageMetadata, rentalPageSchema, serializeJsonLd } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { Container, PageHero, CtaBand } from "@/components/ui";
import { MachineIllustration } from "@/components/MachineIllustration";
import { publishedMachines } from "@/lib/machinery";
import { availabilityLabels } from "@/lib/machinery-model";
import { machineryPhotoReferences } from "@/lib/machinery-photos";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("/maquinaria", "Arriendo de maquinaria en Copiapó y Atacama", "Motoniveladora, rodillo, excavadoras, cargador y camiones para caminos, movimiento de tierra y apoyo operacional en Copiapó, Tierra Amarilla y Atacama. Consulta disponibilidad.");
export default async function Page() {
  const machines = await publishedMachines();
  return <>
    <PageHero eyebrow="Capacidad operativa / Arriendo" title="Arriendo de maquinaria en Copiapó y Atacama" intro="Equipos para caminos, movimiento de tierra, transporte, humectación, izaje y apoyo operacional. La asignación se coordina según alcance, acceso, frente de trabajo y programación." />
    <Container className="py-10 sm:py-12">
      <Link href="/servicios/mantencion-integral-de-caminos" className="text-sm font-semibold text-copper-600 underline underline-offset-4">← Mantención integral de caminos mineros</Link>
      {machines.some(m => m.demo) && <p className="text-body mt-6 rounded-xl border border-sand bg-sand-300 p-5 text-sm leading-relaxed text-olive-900">Estamos preparando nuestro catálogo. Los equipos marcados como «Ejemplo» son ilustrativos; sus fichas y disponibilidad se actualizarán con la información de la flota real.</p>}
      <p className="text-body mt-6 max-w-3xl leading-relaxed text-ink/75">Combinamos equipos para perfilado, nivelación, conformación, compactación, excavación, carguío y traslado de maquinaria. Consulta la disponibilidad para las fechas de tu proyecto.</p>
      {machines.some(machine => machine.type === "Excavadora" && !machine.demo) && <Link href="/maquinaria/excavadoras" className="mt-5 inline-flex font-semibold text-copper-600 underline underline-offset-4">Arriendo de excavadoras: modelos y datos para cotizar →</Link>}
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{machines.map(m => {
        const reference = machineryPhotoReferences[m.image];
        return <article key={m.id} className="flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-olive-900 text-cream">
        <div className={`relative h-72 ${reference && m.id !== "tolva-jac-3262" ? "bg-white" : "bg-olive-950"}`}>{m.image ? <Image src={m.image} alt={m.name} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-contain" unoptimized={m.image.startsWith('/api/')} /> : <div className="h-full p-5"><MachineIllustration type={m.type} /><span className="absolute bottom-3 left-5 rounded-full bg-olive-950/85 px-3 py-1 text-xs text-khaki">Ilustración del tipo de equipo</span></div>}</div>
        <div className="flex flex-1 flex-col p-5"><p className="text-xs font-semibold uppercase tracking-widest text-khaki">{m.type}{m.demo && " · Ejemplo"}</p><h2 className="mt-2 font-display text-xl leading-6 font-semibold md:min-h-12">{m.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-cream/80 text-body md:min-h-[4.125rem]">{m.description}</p>
          <dl className="mt-3 space-y-2 text-sm">{m.model ? <div><dt className="text-khaki">Marca y modelo</dt><dd>{m.model}</dd></div> : <div aria-hidden="true" className="hidden h-10 md:block" />}{m.capacity && <div><dt className="text-khaki">Capacidad / características</dt><dd>{m.capacity}</dd></div>}<div><dt className="sr-only">Disponibilidad</dt><dd className="text-khaki">{availabilityLabels[m.demo ? 'confirm' : m.availability]}</dd></div></dl>
          <Link href={`/contacto?equipo=${encodeURIComponent(m.name)}`} className="mt-auto pt-4 text-sm font-semibold text-cream underline underline-offset-4">Consultar arriendo →</Link>
        </div>
      </article>;
      })}</div>
      {!machines.length && <p className="text-body mt-8 rounded-xl bg-sand-300 p-8">Estamos actualizando el catálogo. Contáctanos para consultar maquinaria para tu proyecto.</p>}
      <LocalServiceCoverage serviceKey="maquinaria" />
      <section className="mt-12 max-w-3xl" aria-label="Elegir maquinaria para tu proyecto">
        <h2 className="font-display text-2xl font-semibold text-olive-900">Arriendo para excavación, nivelación y apoyo en terreno</h2>
        <p className="text-body mt-4 leading-relaxed text-ink/80">Para excavación y carguío, consulta las excavadoras y el cargador del catálogo. Para perfilado y compactación de caminos, consulta motoniveladora y rodillo; los camiones aljibe permiten coordinar humectación. La combinación de equipos se evalúa según el terreno y el alcance solicitado.</p>
        <div className="mt-6 space-y-6">
          <div><h3 className="font-semibold text-olive-900">¿Qué datos necesitan para cotizar un arriendo?</h3><p className="text-body mt-2 leading-relaxed text-ink/80">Indica el equipo o trabajo previsto, fechas, duración estimada y ubicación. Agrega condiciones de acceso y traslado, y consulta las condiciones de operación incluidas antes de confirmar la contratación.</p></div>
          <div><h3 className="font-semibold text-olive-900">¿Necesitas que ejecutemos el trabajo?</h3><p className="text-body mt-2 leading-relaxed text-ink/80">Si buscas un resultado de obra, podemos evaluar <Link href="/servicios/obras-civiles" className="font-semibold text-copper-600 underline underline-offset-4">obras civiles y movimiento de tierra</Link> o <Link href="/servicios/mantencion-integral-de-caminos" className="font-semibold text-copper-600 underline underline-offset-4">mantención de caminos mineros</Link>. Indica las tareas para definir recursos y alcance, además de la maquinaria.</p></div>
        </div>
      </section>
    </Container><CtaBand />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(rentalPageSchema("/maquinaria", "Arriendo de maquinaria en Copiapó y Atacama", "Arriendo de maquinaria para excavación, caminos y apoyo operacional. La disponibilidad, el traslado y las condiciones de operación se confirman por proyecto.")) }} />
  </>;
}
