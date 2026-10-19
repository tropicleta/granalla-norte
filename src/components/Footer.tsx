import Image from "next/image";
import Link from "next/link";
import { services, site } from "@/lib/site";
import { servicePath } from "@/lib/service-details";

export function Footer() {
  return (
    <footer className="brand-pattern bg-olive-950 text-cream/80">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-6 px-4 py-7 sm:px-6 md:grid-cols-12 md:gap-8 lg:px-8">
        <div className="col-span-2 md:col-span-5">
          <Link href="/#inicio" aria-label="Granalla Norte — Ir al inicio" className="inline-block rounded focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-khaki">
            <Image src={site.logo} alt={site.name} width={170} height={54} className="h-12 w-auto" />
          </Link>
          <p className="text-body mt-3 max-w-sm text-sm leading-relaxed">
            Ejecución, abastecimiento, caminos y monitoreo para la minería de Atacama, con coordinación local en Tierra Amarilla.
          </p>
          <a
            href={`mailto:${site.email}`}
            className="mt-3 inline-block break-all font-display text-base text-khaki underline-offset-4 hover:underline"
          >
            {site.email}
          </a>
          <a href={`tel:${site.phone}`} className="mt-1 block text-sm text-khaki underline-offset-4 hover:underline">{site.phoneDisplay}</a>
          <div className="mt-3 text-sm">
            <h2 className="sr-only">Ubicación</h2>
            <p>{site.address}</p>
          </div>
        </div>

        <div className="md:col-span-4">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-khaki">Servicios</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={servicePath(s.slug)} className="hover:text-cream">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-khaki">Empresa</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {site.nav.slice(1).map((n) => (
              <li key={n.href}>
                <Link href={n.href} className="hover:text-cream">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

      </div>
      <div className="bg-olive-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 border-t border-cream/10 px-4 py-4 text-xs text-cream/60 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} {site.name}. Todos los derechos reservados.</p>
          <p>Tierra Amarilla · Copiapó · Atacama</p>
          <p>
            Desarrollado por{" "}
            <a href="https://el-arca-six.vercel.app/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#80ff55] underline-offset-4 hover:underline">El Arca</a>
            {" y "}
            <a href="https://naitre.cl/" target="_blank" rel="noopener noreferrer" className="font-semibold text-[#ff9f43] underline-offset-4 hover:underline">Naitre</a>
          </p>
        </div>
      </div>
    </footer>
  );
}
