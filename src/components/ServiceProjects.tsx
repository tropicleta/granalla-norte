import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/site";
import { projectSectors, sectorProjects, sectorProjectsPath } from "@/lib/service-projects";
import { Arrow } from "./ui";

export function ServiceProjects({ serviceSlug, articles, dark = false }: { serviceSlug: string; articles: Post[]; dark?: boolean }) {
  const sector = projectSectors.find(item => item.slug === serviceSlug);
  if (!sector) return null;
  const projects = sectorProjects(articles, serviceSlug);
  return <section aria-label={`Proyectos y noticias de ${sector.label}`} className={dark ? "border-t border-white/15 bg-olive-950/40 p-6 sm:p-9" : "mt-10 rounded-[var(--radius-card)] border border-sand bg-sand-300 p-6 sm:p-8"}>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><p className={`text-xs font-semibold uppercase tracking-widest ${dark ? "text-khaki" : "text-copper-600"}`}>Experiencia en {sector.label.toLowerCase()}</p><h3 className={`mt-2 font-display text-2xl font-semibold ${dark ? "text-cream" : "text-olive-900"}`}>Proyectos y noticias del rubro</h3><p className={`text-body mt-2 text-sm ${dark ? "text-cream/75" : "text-ink/75"}`}>Conoce los trabajos y actividades que hemos realizado.</p></div>
      <Link href={sectorProjectsPath(serviceSlug)} className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition ${dark ? "bg-khaki text-olive-950 hover:bg-cream" : "bg-olive-900 text-cream hover:bg-olive-800"}`}>Ver noticias de {sector.label.toLowerCase()} <Arrow /></Link>
    </div>
    {projects.length ? <div className="mt-5 grid gap-4 md:grid-cols-2">{projects.slice(0, 2).map(project => <Link key={project.slug} href={`/noticias/${project.slug}`} className={`group flex gap-4 rounded-2xl p-4 transition ${dark ? "bg-white/5 hover:bg-white/10" : "bg-white hover:bg-cream"}`}>
      <div className="relative size-20 shrink-0 overflow-hidden rounded-xl"><Image src={project.image} alt="" fill sizes="80px" className="object-cover" unoptimized={project.image.startsWith("/api/")} /></div>
      <div className="min-w-0"><p className={`text-xs ${dark ? "text-khaki" : "text-copper-600"}`}>{project.location}</p><h4 className={`mt-1 font-semibold leading-snug ${dark ? "text-cream" : "text-olive-900"}`}>{project.title}</h4><span className={`mt-2 inline-flex items-center gap-1 text-xs font-semibold ${dark ? "text-khaki" : "text-copper-600"}`}>Conocer el trabajo <Arrow /></span></div>
    </Link>)}</div> : <p className={`text-body mt-5 text-sm ${dark ? "text-cream/75" : "text-ink/75"}`}>Aún no hay noticias publicadas de este rubro. Puedes consultar a nuestro equipo por la experiencia y el alcance de tu proyecto.</p>}
  </section>;
}
