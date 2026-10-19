import Link from "next/link";
import { ButtonLink, Container, PageHero, PostCard, SectionTitle } from "@/components/ui";
import { publishedArticles } from "@/lib/content";
import { localServices } from "@/lib/local-services";
import { pageMetadata } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata = pageMetadata("/empresas", "Servicios para empresas y faenas en Atacama", "Obras civiles, movimiento de tierra, caminos, maquinaria, materiales y monitoreo para empresas en Atacama. Revisa proyectos y solicita una propuesta técnica y comercial.");
export const dynamic = "force-dynamic";

export default async function EmpresasPage() {
  const projects = (await publishedArticles()).slice(0, 3);
  return <>
    <PageHero eyebrow="Empresas y abastecimiento" title="Servicios para empresas y faenas en Atacama" intro="Desde Tierra Amarilla coordinamos recursos para obras y operaciones en Copiapó y la Región de Atacama. Comparte el alcance de tu requerimiento para evaluar una propuesta técnica y comercial." />
    <section className="py-12 sm:py-16"><Container>
      <SectionTitle eyebrow="Capacidades" title="Una oferta conectada con las necesidades de tu operación" />
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{localServices.map(service => <article key={service.key} className="rounded-[var(--radius-card)] bg-white p-7 shadow-[var(--shadow-card)]">
        <h2 className="font-display text-xl font-semibold text-olive-900"><Link href={service.path} className="underline-offset-4 hover:underline">{service.name}</Link></h2>
        <p className="text-body mt-3 text-sm leading-relaxed text-ink/75">{service.description}</p>
      </article>)}</div>
    </Container></section>
    <section className="bg-sand-300 py-12 sm:py-16"><Container className="grid gap-10 lg:grid-cols-2">
      <div><SectionTitle eyebrow="Compras y proyectos" title="Qué necesitamos para preparar tu propuesta" />
        <p className="text-body mt-4 leading-relaxed text-ink/75">Puedes enviar bases técnicas, fotografías del terreno o un resumen del trabajo al correo comercial. Incluye los antecedentes disponibles; revisaremos contigo los puntos pendientes.</p>
        <ul className="mt-5 list-disc space-y-3 pl-5 text-ink/80">
          <li>Empresa, persona de contacto y ubicación de la obra o faena.</li>
          <li>Alcance, cantidades, especificaciones y resultado esperado.</li>
          <li>Fechas, duración estimada, accesos y condiciones de recepción.</li>
          <li>Requisitos de seguridad, documentación y registro de proveedores que exige tu empresa.</li>
        </ul>
      </div>
      <div className="rounded-[var(--radius-card)] bg-olive-900 p-8 text-cream">
        <h2 className="font-display text-2xl font-semibold">Coordinación comercial directa</h2>
        <p className="mt-4 leading-relaxed text-cream/80">Evaluamos recursos, disponibilidad y condiciones de ejecución para cada solicitud. El alcance, la programación y los requisitos se acuerdan antes del inicio del trabajo.</p>
        <a href={`mailto:${site.email}`} className="mt-6 block break-all text-khaki hover:underline">{site.email}</a>
        <a href={`tel:${site.phone}`} className="mt-3 block text-khaki hover:underline">{site.phoneDisplay}</a>
        <p className="mt-3 text-sm text-cream/75">{site.hoursDisplay}</p>
        <div className="mt-6 flex flex-wrap gap-3"><ButtonLink href="/contacto">Solicitar propuesta</ButtonLink><ButtonLink href={`https://wa.me/${site.whatsapp}`} variant="ghost">Consultar por WhatsApp</ButtonLink></div>
      </div>
    </Container></section>
    <section className="py-12 sm:py-16"><Container>
      <SectionTitle eyebrow="Experiencia en terreno" title="Conoce nuestros trabajos publicados" intro="Revisa el alcance y las fotografías de proyectos que hemos compartido en nuestro sitio." />
      <div className="mt-8 grid gap-6 md:grid-cols-3">{projects.map(post => <PostCard key={post.slug} post={post} />)}</div>
      <div className="mt-8"><ButtonLink href="/noticias" variant="outline">Ver todos los proyectos</ButtonLink></div>
    </Container></section>
  </>;
}
