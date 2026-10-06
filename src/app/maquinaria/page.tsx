import { pageMetadata } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import { Container, PageHero, CtaBand } from "@/components/ui";
import { MachineIllustration } from "@/components/MachineIllustration";
import { publishedMachines } from "@/lib/machinery";
import { availabilityLabels } from "@/lib/machinery-model";
import { machineryPhotoReferences } from "@/lib/machinery-photos";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("/maquinaria", "Arriendo de maquinaria y equipos en Atacama", "Motoniveladora, rodillo, excavadoras, cargador y camiones para caminos, movimiento de tierra y apoyo operacional en Atacama. Consulta disponibilidad.");
export default async function Page() {
  const machines = await publishedMachines();
  return <>
    <PageHero eyebrow="Capacidad operativa / Arriendo" title="Arriendo de maquinaria y equipos en Atacama" intro="Equipos para caminos, movimiento de tierra, transporte, humectación, izaje y apoyo operacional. La asignación se coordina según alcance, acceso, frente de trabajo y programación." />
    <Container className="py-10 sm:py-12">
      <Link href="/servicios/mantencion-de-caminos" className="text-sm font-semibold text-copper-600 underline underline-offset-4">← Mantención de caminos</Link>
      {machines.some(m => m.demo) && <p className="text-body mt-6 rounded-xl border border-sand bg-sand-300 p-5 text-sm leading-relaxed text-olive-900">Estamos preparando nuestro catálogo. Los equipos marcados como «Ejemplo» son ilustrativos; sus fichas y disponibilidad se actualizarán con la información de la flota real.</p>}
      <p className="text-body mt-6 max-w-3xl leading-relaxed text-ink/75">Combinamos equipos para perfilado, nivelación, conformación, compactación, excavación, carguío y traslado de maquinaria. Consulta la disponibilidad para las fechas de tu proyecto.</p>
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{machines.map(m => {
        const reference = machineryPhotoReferences[m.image];
        return <article key={m.id} className="flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-olive-900 text-cream">
        <div className={`relative h-72 ${reference ? "bg-white" : "bg-olive-950"}`}>{m.image ? <Image src={m.image} alt={m.name} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-contain" unoptimized={m.image.startsWith('/api/')} /> : <div className="h-full p-5"><MachineIllustration type={m.type} /><span className="absolute bottom-3 left-5 rounded-full bg-olive-950/85 px-3 py-1 text-xs text-khaki">Ilustración del tipo de equipo</span></div>}</div>
        <div className="flex flex-1 flex-col p-5"><p className="text-xs font-semibold uppercase tracking-widest text-khaki">{m.type}{m.demo && " · Ejemplo"}</p><h2 className="mt-2 font-display text-xl leading-6 font-semibold md:min-h-12">{m.name}</h2>
          <p className="mt-2 text-sm leading-relaxed text-cream/80 text-body md:min-h-[4.125rem]">{m.description}</p>
          <dl className="mt-3 space-y-2 text-sm">{m.model ? <div><dt className="text-khaki">Marca y modelo</dt><dd>{m.model}</dd></div> : <div aria-hidden="true" className="hidden h-10 md:block" />}{m.capacity && <div><dt className="text-khaki">Capacidad / características</dt><dd>{m.capacity}</dd></div>}<div><dt className="sr-only">Disponibilidad</dt><dd className="text-khaki">{availabilityLabels[m.demo ? 'confirm' : m.availability]}</dd></div></dl>
          <Link href="/contacto" className="mt-auto pt-4 text-sm font-semibold text-cream underline underline-offset-4">Consultar arriendo →</Link>
        </div>
      </article>;
      })}</div>
      {!machines.length && <p className="text-body mt-8 rounded-xl bg-sand-300 p-8">Estamos actualizando el catálogo. Contáctanos para consultar maquinaria para tu proyecto.</p>}
    </Container><CtaBand />
  </>;
}
