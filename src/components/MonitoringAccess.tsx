import Link from "next/link";
import { Arrow } from "./ui";
import { MonitoringIllustration } from "./MonitoringIllustration";
export function MonitoringAccess({ serviceSlug }: { serviceSlug: string }) {
  if (serviceSlug !== "asesorias") return null;
  return <Link href="/equipos-monitoreo" className="group mt-7 flex items-center gap-4 rounded-2xl border border-copper/50 bg-copper p-5 text-white shadow-lg transition hover:bg-copper-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper">
    <div className="hidden size-20 shrink-0 rounded-xl bg-olive-950 sm:block"><MonitoringIllustration /></div>
    <div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-widest text-white/80">Equipamiento para tu faena</p><p className="mt-2 font-display text-xl font-semibold sm:text-2xl">Arriendo de geófonos y sismógrafos</p><p className="mt-1 text-sm text-white/90">Sistemas Instantel para registro de vibraciones de tronaduras.</p><span className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">Ver equipos y consultar arriendo</span></div><Arrow />
  </Link>;
}
