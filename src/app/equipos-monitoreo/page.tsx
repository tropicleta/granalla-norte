import Image from "next/image";
import Link from "next/link";
import { Container, PageHero, CtaBand } from "@/components/ui";
import { MonitoringIllustration } from "@/components/MonitoringIllustration";
import { publishedMonitoringEquipment } from "@/lib/monitoring";
import { availabilityLabels } from "@/lib/machinery-model";
import { pageMetadata } from "@/lib/seo";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("/equipos-monitoreo", "Arriendo de geófonos y sismógrafos en Atacama", "Sistemas Instantel Minimate Plus y geófonos triaxiales para monitoreo de vibraciones de tronaduras. Consulta configuración, antecedentes técnicos y disponibilidad.");
export default async function Page() {
  const equipment = await publishedMonitoringEquipment();
  return <>
    <PageHero eyebrow="Monitoreo de tronaduras / Arriendo" title="Arriendo de geófonos y sismógrafos" intro="Equipamiento para registrar vibraciones de tronaduras en faenas mineras y trabajos en terreno. Coordina el sistema, los sensores y el período de arriendo según las necesidades de tu operación." />
    <Container className="py-10 sm:py-12">
      <Link href="/servicios/monitoreo-de-tronaduras" className="text-sm font-semibold text-copper-600 underline underline-offset-4">← Monitoreo de tronaduras</Link>
      <div className="mt-8 grid gap-4 md:grid-cols-3">{[
        ["Registro de vibraciones", "Sismógrafos digitales y geófonos triaxiales para medir vibraciones en tres ejes."],
        ["Respaldo técnico", "Antecedentes de calibración disponibles a solicitud para revisión del mandante."],
        ["Configuración para tu faena", "Consulta equipos, compatibilidad de sensores y disponibilidad para las fechas de trabajo."],
      ].map(([title, text]) => <div key={title} className="rounded-2xl bg-sand-300 p-6"><h2 className="font-display text-xl font-semibold text-olive-900">{title}</h2><p className="text-body mt-3 text-sm leading-relaxed text-ink/75">{text}</p></div>)}</div>
      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">{equipment.map(m => <article key={m.id} className="flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-olive-900 text-cream">
        <div className="relative h-56 bg-olive-950">{m.image ? <Image src={m.image} alt={m.name} fill sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-contain p-5" unoptimized={m.image.startsWith("/api/")} /> : <><MonitoringIllustration sensor={m.type === "Geófono triaxial"} /><span className="absolute bottom-3 left-4 rounded-full bg-olive-900 px-3 py-1 text-xs text-khaki">Ilustración del tipo de equipo</span></>}</div>
        <div className="flex flex-1 flex-col p-7"><p className="text-xs font-semibold uppercase tracking-widest text-khaki">{m.type}{m.demo && " · Ejemplo"}</p><h2 className="mt-3 font-display text-2xl font-semibold">{m.name}</h2><p className="text-body mt-3 text-sm leading-relaxed text-cream/80">{m.description}</p>
          <dl className="mt-5 space-y-3 text-sm">{m.model && <div><dt className="text-khaki">Marca y modelo</dt><dd>{m.model}</dd></div>}{m.capacity && <div><dt className="text-khaki">Características</dt><dd>{m.capacity}</dd></div>}{m.calibrationDate && <div><dt className="text-khaki">Certificado aportado</dt><dd>{new Intl.DateTimeFormat("es-CL", { dateStyle: "long", timeZone: "UTC" }).format(new Date(m.calibrationDate))}</dd><dd className="mt-1 text-xs text-cream/65">Vigencia y correspondencia documental por confirmar antes del arriendo.</dd></div>}<div><dt className="sr-only">Disponibilidad</dt><dd className="text-khaki">{availabilityLabels[m.demo ? "confirm" : m.availability]}</dd></div></dl>
          <Link href="/contacto" className="mt-auto pt-6 text-sm font-semibold underline underline-offset-4">Consultar arriendo de este equipo →</Link>
        </div>
      </article>)}</div>
      {!equipment.length && <p className="text-body mt-8 rounded-2xl bg-sand-300 p-8">Estamos actualizando el catálogo. Consulta equipos de monitoreo para tu proyecto.</p>}
      <section className="mt-12 rounded-[var(--radius-card)] bg-sand-300 p-7 sm:p-9"><h2 className="font-display text-2xl font-semibold text-olive-900">Prepara el arriendo para tu operación</h2><p className="text-body mt-3 max-w-3xl leading-relaxed text-ink/75">Indícanos la ubicación de la faena, las fechas, la cantidad de puntos de medición y los requisitos técnicos del mandante. Confirmaremos la configuración, los accesorios, las condiciones de entrega y la documentación del equipo asignado.</p><Link href="/contacto" className="mt-6 inline-flex rounded-full bg-copper px-6 py-3 font-semibold text-white">Cotizar equipos de monitoreo →</Link></section>
    </Container><CtaBand />
  </>;
}
