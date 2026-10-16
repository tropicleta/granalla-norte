import Link from "next/link";
import { localServices } from "@/lib/local-services";
import { site } from "@/lib/site";

export function LocalServiceCoverage({ serviceKey }: { serviceKey: string }) {
  const service = localServices.find(item => item.key === serviceKey);
  if (!service) return null;
  const quote = ["maquinaria", "equipos-monitoreo"].includes(serviceKey) ? "/contacto" : `/contacto?servicio=${serviceKey}`;
  return <section className="mt-12 max-w-3xl" aria-label="Cobertura y coordinación del servicio">
    <h2 className="font-display text-2xl font-semibold text-olive-900">{service.heading}</h2>
    <p className="text-body mt-4 leading-relaxed text-ink/80">{service.description}</p>
    <p className="text-body mt-3 leading-relaxed text-ink/80">Nuestra coordinación está en Tierra Amarilla y la atención se realiza en terreno. Evaluamos cada ubicación dentro de la Región de Atacama antes de confirmar el alcance y la programación.</p>
    <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm font-semibold text-copper-600">
      <Link href={quote} className="underline underline-offset-4">Consultar ubicación y fechas →</Link>
      <a href={`tel:${site.phone}`} className="underline underline-offset-4">Llamar al {site.phoneDisplay}</a>
    </div>
  </section>;
}
