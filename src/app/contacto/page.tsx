import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import { ContactForm } from "@/components/ContactForm";
import { Container, PageHero } from "@/components/ui";
import { services, site } from "@/lib/site";
import { storageConfigured } from "@/lib/content-storage";

export const dynamic = "force-dynamic";
export const metadata = pageMetadata("/contacto", "Cotizar servicios mineros y obras en Atacama", "Cotiza mantención integral de caminos, arriendo de maquinaria, minerales, monitoreo de tronaduras y obras civiles en Atacama con Granalla Norte.");
export default function ContactoPage() {
  return <>
    <PageHero eyebrow="Contacto" title="Conversemos sobre tu proyecto" intro="Mantención integral de caminos, maquinaria, suministros, asesoría u obras: cuéntanos qué necesitas y coordinemos una solución para tu proyecto." />
    <section className="bg-sand-300 py-10 sm:py-12">
      <Container className="grid items-start gap-6 lg:grid-cols-[0.85fr_1.4fr]">
        <aside className="rounded-[var(--radius-card)] bg-olive-800 p-6 text-cream sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-widest text-khaki">Granalla Norte / Atacama</p>
          <h2 className="mt-3 font-display text-2xl font-semibold">Contacto directo</h2>
          <p className="text-body mt-3 text-sm leading-relaxed text-cream/80">Nuestro equipo puede orientarte sobre el alcance del trabajo, los suministros y la maquinaria que necesita tu operación.</p>
          <dl className="mt-6 space-y-5 border-y border-white/15 py-6 text-sm">
            <div><dt className="text-cream/65">Correo de contacto</dt><dd className="mt-2"><a href={`mailto:${site.email}`} className="break-all font-semibold text-khaki underline-offset-4 hover:underline">{site.email}</a></dd></div>
            <div><dt className="text-cream/65">Zona de operación</dt><dd className="mt-2 leading-relaxed">Tierra Amarilla, Copiapó y Región de Atacama</dd></div>
            {site.phone && <div><dt className="text-cream/65">Teléfono</dt><dd className="mt-2"><a href={`tel:${site.phone}`} className="text-khaki">{site.phoneDisplay}</a></dd></div>}
          </dl>
          <h3 className="mt-6 font-semibold">¿En qué podemos ayudarte?</h3>
          <ul className="mt-3 space-y-3 text-sm text-cream/85">{services.map(s => <li key={s.slug}><Link href={`/servicios#${s.slug}`} className="inline-flex gap-2 hover:text-khaki"><span aria-hidden className="text-khaki">↗</span>{s.title}</Link></li>)}</ul>
          {site.whatsapp && <a href={`https://wa.me/${site.whatsapp}`} className="mt-6 inline-flex rounded-full bg-copper px-5 py-3 text-sm font-semibold text-white">Escríbenos por WhatsApp</a>}
        </aside>
        {storageConfigured() ? <ContactForm services={services.map(s => s.title)} /> : <div className="rounded-[var(--radius-card)] bg-olive-950 p-8 text-cream"><h2 className="font-display text-2xl font-semibold">Solicita tu cotización por correo</h2><p className="text-body mt-4 text-cream/85">Cuéntanos qué servicio necesitas, la ubicación de tu proyecto y los plazos estimados.</p><a href={`mailto:${site.email}?subject=Solicitud%20de%20cotizaci%C3%B3n`} className="mt-6 inline-flex rounded-full bg-copper px-6 py-3 font-semibold text-white">Escribir a Granalla Norte</a></div>}
      </Container>
    </section>
  </>;
}
