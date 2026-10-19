import Link from "next/link";
import Image from "next/image";
import { Arrow } from "./ui";
export function MonitoringAccess({ serviceSlug }: { serviceSlug: string }) {
  if (serviceSlug !== "monitoreo-de-tronaduras") return null;
  return <Link href="/equipos-monitoreo" className="group mt-7 flex items-center gap-3 overflow-hidden rounded-2xl border border-copper/50 bg-copper p-3 text-white shadow-lg transition hover:bg-copper-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper sm:gap-4 sm:p-4">
    <div className="relative h-24 w-28 shrink-0 overflow-hidden rounded-xl bg-white sm:h-28 sm:w-36"><Image src="/img/monitoreo/minimate-plus-geofono.png" alt="Sismógrafo Instantel Minimate Plus con geófono" fill sizes="(min-width: 640px) 144px, 112px" className="object-contain p-1" /></div>
    <p className="min-w-0 flex-1 font-display text-lg font-semibold leading-tight sm:text-2xl">Arriendo de geófonos y sismógrafos</p>
    <span className="shrink-0 rounded-full bg-white/15 p-2 transition group-hover:translate-x-1 sm:p-3" aria-hidden><Arrow /></span>
  </Link>;
}