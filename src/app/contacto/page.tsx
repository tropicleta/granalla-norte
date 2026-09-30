import type { Metadata } from "next";
import { ContactForm } from "@/components/ContactForm";
import { Container, PageHero } from "@/components/ui";
import { services, site } from "@/lib/site";
import { storageConfigured } from "@/lib/content-storage";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Cotiza minerales no metálicos, monitoreo de tronaduras, consultoría u obras civiles con Granalla Norte.",
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Conversemos sobre tu proyecto"
        intro="Cuéntanos qué necesitas —insumos, monitoreo u obra— y te respondemos con una propuesta a la brevedad."
      />
      <section className="py-20">
        <Container className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <aside className="space-y-8">
            <div className="rounded-[var(--radius-card)] bg-olive-900 p-8 text-cream">
              <h2 className="font-display text-xl font-semibold">Canales directos</h2>
              <dl className="mt-6 space-y-5 text-sm">
                <div>
                  <dt className="text-cream/60">Correo</dt>
                  <dd className="mt-1">
                    <a href={`mailto:${site.email}`} className="text-lg text-khaki hover:underline">
                      {site.email}
                    </a>
                  </dd>
                </div>
                {site.phone && (
                  <div>
                    <dt className="text-cream/60">Teléfono</dt>
                    <dd className="mt-1">
                      <a href={`tel:${site.phone}`} className="text-lg text-khaki hover:underline">
                        {site.phone}
                      </a>
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-cream/60">Zona de operación</dt>
                  <dd className="mt-1">Tierra Amarilla, Copiapó y Región de Atacama</dd>
                </div>
              </dl>
              {site.whatsapp && (
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  className="mt-8 inline-flex rounded-full bg-copper px-5 py-3 text-sm font-semibold text-white hover:bg-copper-600"
                >
                  Escríbenos por WhatsApp
                </a>
              )}
            </div>
            <div className="rounded-[var(--radius-card)] border border-sand p-8">
              <h2 className="font-display text-lg font-semibold text-olive-900">¿Qué podemos cotizar?</h2>
              <ul className="mt-4 space-y-2 text-sm text-ink/75">
                {services.flatMap((s) => s.items.map((i) => <li key={i.name}>· {i.name}</li>))}
              </ul>
            </div>
          </aside>
          {storageConfigured() ? <ContactForm services={services.map((s) => s.title)} /> : (
            <div className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)] sm:p-10">
              <h2 className="font-display text-2xl font-semibold text-olive-900">Solicita tu cotización por correo</h2>
              <p className="text-body mt-4 text-ink/75">Cuéntanos qué servicio necesitas, la ubicación de tu proyecto y los plazos estimados.</p>
              <a href={`mailto:${site.email}?subject=Solicitud%20de%20cotizaci%C3%B3n`} className="mt-8 inline-flex rounded-full bg-copper px-6 py-3.5 font-semibold text-white hover:bg-copper-600">Escribir a Granalla Norte</a>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
