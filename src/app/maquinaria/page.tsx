import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Container, PageHero, CtaBand } from "@/components/ui";
import { MachineIllustration } from "@/components/MachineIllustration";
import { publishedMachines } from "@/lib/machinery";
import { availabilityLabels } from "@/lib/machinery-model";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Maquinaria para caminos", description: "Catálogo de camiones y maquinaria para trabajos de caminos. Consulta características y disponibilidad con Granalla Norte." };
export default async function Page() {
  const machines = await publishedMachines();
  return <>
    <PageHero eyebrow="Mantención de caminos / Arriendo" title="Equipos para trabajar en terreno" intro="Camiones y maquinaria para apoyar el transporte, riego, nivelación y compactación de caminos. Coordina con nuestro equipo las características y condiciones de arriendo." />
    <Container className="py-14 sm:py-20">
      <Link href="/servicios#mantencion-de-caminos" className="text-sm font-semibold text-copper-600 underline underline-offset-4">← Mantención de caminos</Link>
      {machines.some(m => m.demo) && <p className="text-body mt-6 rounded-xl border border-sand bg-sand-300 p-5 text-sm leading-relaxed text-olive-900">Estamos preparando nuestro catálogo. Los equipos marcados como «Ejemplo» son ilustrativos; sus fichas y disponibilidad se actualizarán con la información de la flota real.</p>}
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{machines.map(m => <article key={m.id} className="flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-olive-900 text-cream">
        <div className="relative h-56 bg-olive-950 p-5">{m.image ? <Image src={m.image} alt={m.name} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" unoptimized={m.image.startsWith('/api/')} /> : <MachineIllustration type={m.type} />}</div>
        <div className="flex flex-1 flex-col p-7"><p className="text-xs font-semibold uppercase tracking-widest text-khaki">{m.type}{m.demo && " · Ejemplo"}</p><h2 className="mt-3 font-display text-2xl font-semibold">{m.name}</h2>
          <p className="mt-3 text-sm leading-relaxed text-cream/80 text-body">{m.description}</p>
          <dl className="mt-5 space-y-2 text-sm">{m.model && <div><dt className="text-khaki">Marca y modelo</dt><dd>{m.model}</dd></div>}{m.capacity && <div><dt className="text-khaki">Capacidad / características</dt><dd>{m.capacity}</dd></div>}<div><dt className="sr-only">Disponibilidad</dt><dd className="text-khaki">{availabilityLabels[m.demo ? 'confirm' : m.availability]}</dd></div></dl>
          <Link href="/contacto" className="mt-auto pt-6 text-sm font-semibold text-cream underline underline-offset-4">Consultar arriendo →</Link>
        </div>
      </article>)}</div>
      {!machines.length && <p className="text-body mt-8 rounded-xl bg-sand-300 p-8">Estamos actualizando el catálogo. Contáctanos para consultar maquinaria para tu proyecto.</p>}
    </Container><CtaBand />
  </>;
}
