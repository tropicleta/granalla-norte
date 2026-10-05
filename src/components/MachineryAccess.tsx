import Image from "next/image";
import Link from "next/link";
import { Arrow } from "./ui";

export function MachineryAccess({ serviceSlug }: { serviceSlug: string }) {
  if (!["mantencion-de-caminos", "obras-civiles", "minerales"].includes(serviceSlug)) return null;
  return <Link href="/maquinaria" className="group mt-7 flex items-center gap-4 overflow-hidden rounded-2xl border border-copper/50 bg-copper p-4 text-white shadow-lg transition hover:bg-copper-600 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper sm:p-5">
    <div className="relative hidden size-20 shrink-0 overflow-hidden rounded-xl sm:block"><Image src="/img/brochure/cargador.jpg" alt="" fill sizes="80px" className="object-cover" /></div>
    <div className="min-w-0 flex-1"><p className="text-xs font-semibold uppercase tracking-widest text-white/80">También puedes arrendar equipos</p><p className="mt-2 font-display text-xl font-semibold sm:text-2xl">Arriendo de maquinaria</p><p className="mt-1 text-sm leading-relaxed text-white/90">{serviceSlug === "mantencion-de-caminos" ? "Equipos para nivelación, compactación y humectación de caminos." : "Excavadoras, cargador y camiones para tus trabajos en terreno."}</p><span className="mt-3 inline-block text-sm font-semibold underline underline-offset-4">Ver equipos y consultar disponibilidad</span></div>
    <span className="shrink-0 rounded-full bg-white/15 p-3 transition group-hover:translate-x-1" aria-hidden><Arrow /></span>
  </Link>;
}
