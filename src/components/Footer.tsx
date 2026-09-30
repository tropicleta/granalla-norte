import Image from "next/image";
import Link from "next/link";
import { services, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="topo bg-olive-950 text-cream/80">
      <div className="chevron h-2 opacity-60" aria-hidden />
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 md:grid-cols-12 lg:px-8">
        <div className="md:col-span-5">
          <Image src={site.logo} alt={site.name} width={170} height={54} className="h-12 w-auto" />
          <p className="text-body mt-5 max-w-sm text-sm leading-relaxed">
            Suministro, ingeniería y obras civiles para la minería de Atacama, con equipos de Tierra Amarilla.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-6 inline-block font-display text-lg text-khaki underline-offset-4 hover:underline"
          >
            {site.email}
          </a>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-khaki">Servicios</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/servicios#${s.slug}`} className="hover:text-cream">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-khaki">Empresa</h2>
          <ul className="mt-4 space-y-2 text-sm">
            {site.nav.slice(1).map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-cream">
                  {n.label}
                </Link>
              </li>
            ))}
            <li><Link href="/admin" className="hover:text-cream">Administración</Link></li>
          </ul>
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-khaki">Ubicación</h2>
          <p className="mt-4 text-sm">{site.address}</p>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-xs text-cream/60 sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</p>
          <p>Tierra Amarilla · Copiapó · Atacama</p>
        </div>
      </div>
    </footer>
  );
}
