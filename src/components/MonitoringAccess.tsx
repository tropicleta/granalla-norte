import Link from "next/link";
import Image from "next/image";
import { Arrow } from "./ui";
export function MonitoringAccess({ serviceSlug }: { serviceSlug: string }) {
  if (serviceSlug !== "asesorias") return null;
  return <Link href="/equipos-monitoreo" className="group mt-7 flex items-center gap-4 rounded-2xl border border-copper/50 bg-copper p-5 text-white shadow-lg transition hover:bg-copper-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper">
    <div className="relative h-20 w-24 shrink-0 overflow-hidden rounded-xl bg-white sm:h-28 sm:w-36"><Image src="/img/monitoreo/minimate-plus-geofono.png" alt="Sismógrafo Instantel Minimate Plus con geófono" fill sizes="(min-width: 640px) 144px, 96px" className="object-contain p-1" /></div>
    <div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-widest text-white/80">Equipamiento para tu faena</p><p className="mt-2 font-display text-xl font-semibold sm:text-2xl">Arriendo de geófonos y sismógrafos</p><p className="mt-1 text-sm text-white/90">Sistemas Instantel para registro de vibraciones de tronaduras.</p><span className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">Ver equipos y consultar arriendo</span></div><Arrow />
  </Link>;
}
