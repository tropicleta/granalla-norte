import Image from "next/image";
import Link from "next/link";
import { ButtonLink, Container, CtaBand, PageHero } from "@/components/ui";
import { publishedArticles } from "@/lib/content";
import { serviceArea } from "@/lib/local-services";
import { projectEvidence } from "@/lib/project-evidence";
import { businessId, pageMetadata, serializeJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const dynamic = "force-dynamic";
const path = "/servicios/movimiento-de-tierra";
const title = "Movimiento de tierra en Copiapó y Atacama";
const description = "Excavación, carguío, retiro, relleno y nivelación de terrenos para obras y faenas de Copiapó y Atacama. Conoce trabajos realizados y solicita una cotización.";
export const metadata = pageMetadata(path, title, description, site.images.civil);

const work = [
  { title: "Excavación y adecuación del terreno", text: "Excavación y preparación de áreas según las medidas y condiciones del proyecto. Para evaluar el frente de trabajo revisamos profundidad, tipo de material, accesos y espacio de maniobra." },
  { title: "Carguío y retiro de material", text: "Coordinación de maquinaria y transporte para cargar y retirar material del sector intervenido. El volumen, el tipo de material y el destino acordado permiten definir los recursos y la logística." },
  { title: "Relleno, distribución y nivelación", text: "Distribución y nivelación de materiales para habilitar superficies según su uso previsto. Las especificaciones del proyecto determinan el material y si corresponde compactar; estas condiciones se acuerdan antes de ejecutar." },
  { title: "Limpieza y habilitación de áreas", text: "Retiro de material y preparación del sector para la etapa siguiente de la obra. Se evalúan los obstáculos, el acceso de equipos y la coordinación con las actividades del recinto o faena." },
];
const caseSlugs = ["relleno-nivelacion-bosque-mina-santos", "limpieza-habilitacion-plantacion-mina-santos"];

export default async function EarthworksPage() {
  const articles = await publishedArticles();
  const cases = caseSlugs.flatMap(slug => {
    const article = articles.find(post => post.slug === slug);
    return article ? [article] : [];
  });
  const url = site.url + path;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Service", "@id": `${url}#servicio`, name: "Movimiento de tierra", serviceType: "Excavación, carguío, relleno y nivelación de terrenos", url, description, provider: { "@id": businessId }, areaServed: serviceArea },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: site.url },
        { "@type": "ListItem", position: 2, name: "Servicios", item: `${site.url}/servicios` },
        { "@type": "ListItem", position: 3, name: "Movimiento de tierra", item: url },
      ] },
    ],
  };
  return <>
    <PageHero eyebrow="Servicios / Preparación de terrenos" title={title} intro="Excavación, carguío, retiro de material, relleno y nivelación para empresas, obras y faenas. Granalla Norte coordina los trabajos de movimiento de tierra desde Tierra Amarilla, con atención en terreno en Copiapó y la Región de Atacama." />
    <Container className="py-10 sm:py-12">
      <nav aria-label="Ruta de navegación" className="mb-8 flex flex-wrap gap-x-2 text-sm text-copper-600"><Link href="/">Inicio</Link><span>/</span><Link href="/servicios">Servicios</Link><span>/</span><span aria-current="page">Movimiento de tierra</span></nav>
      <section aria-labelledby="alcance-movimiento">
        <h2 id="alcance-movimiento" className="font-display text-3xl font-semibold text-olive-900">Trabajos que puedes solicitar</h2>
        <p className="text-body mt-4 max-w-3xl leading-relaxed text-ink/80">Describe qué necesitas habilitar y para qué se utilizará el terreno. Con esos antecedentes evaluamos las tareas, la maquinaria, los materiales y la secuencia de trabajo; el alcance se confirma para cada proyecto.</p>
        <div className="mt-6 grid gap-5 md:grid-cols-2">{work.map(item => <article key={item.title} className="rounded-[var(--radius-card)] bg-sand-300 p-6"><h3 className="font-display text-xl font-semibold text-olive-900">{item.title}</h3><p className="text-body mt-3 leading-relaxed text-ink/80">{item.text}</p></article>)}</div>
      </section>
      {!!cases.length && <section className="mt-12" aria-labelledby="experiencia-terrenos">
        <h2 id="experiencia-terrenos" className="font-display text-3xl font-semibold text-olive-900">Trabajos de terreno realizados en Mina Santos</h2>
        <p className="text-body mt-4 max-w-3xl leading-relaxed text-ink/80">Estos registros muestran el alcance ejecutado y las fotografías de cada intervención. Sirven como referencia de nuestra experiencia; las condiciones de una nueva obra se evalúan por separado.</p>
        <div className="mt-6 grid gap-6 md:grid-cols-2">{cases.map(post => <article key={post.slug} className="overflow-hidden rounded-[var(--radius-card)] bg-olive-900 text-cream">
          <div className="relative h-60"><Image src={post.image} alt={post.title} fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" unoptimized={post.image.startsWith("/api/")} /></div>
          <div className="p-6"><p className="text-sm text-khaki">{post.location}</p><h3 className="mt-2 font-display text-xl font-semibold"><Link href={`/noticias/${post.slug}`} className="underline underline-offset-4">{post.title}</Link></h3><p className="text-body mt-3 leading-relaxed text-cream/85">{projectEvidence[post.slug].summary}</p><Link href={`/noticias/${post.slug}`} className="mt-4 inline-block text-sm font-semibold text-khaki underline underline-offset-4">Ver fotografías y detalle del trabajo →</Link></div>
        </article>)}</div>
      </section>}
      <section className="mt-12 grid gap-8 lg:grid-cols-2" aria-labelledby="cotizar-terreno">
        <div><h2 id="cotizar-terreno" className="font-display text-3xl font-semibold text-olive-900">Antecedentes para cotizar movimiento de tierra</h2><ul className="text-body mt-5 list-disc space-y-3 pl-5 text-ink/80"><li>Ubicación del terreno y descripción de los trabajos.</li><li>Medidas, profundidad o volumen aproximado de material; planos y fotografías disponibles.</li><li>Tipo de material, necesidad de relleno y destino del retiro.</li><li>Accesos, espacio de maniobra y restricciones del recinto.</li><li>Fechas, plazo previsto y requisitos del mandante.</li></ul><p className="text-body mt-4 leading-relaxed text-ink/80">Si no cuentas con todos los datos, envía los antecedentes disponibles para coordinar cómo completar la evaluación. El precio se define con el alcance y los recursos de la intervención.</p><div className="mt-6"><ButtonLink href="/contacto?servicio=obras-civiles">Cotizar movimiento de tierra</ButtonLink></div></div>
        <aside className="rounded-[var(--radius-card)] bg-sand-300 p-7"><h2 className="font-display text-2xl font-semibold text-olive-900">¿Necesitas ejecutar el trabajo o arrendar maquinaria?</h2><p className="text-body mt-4 leading-relaxed text-ink/80">Para ejecutar un movimiento de tierra se definen las tareas, la secuencia y los recursos de la obra. Si tu empresa organiza la ejecución y necesita un equipo, revisa el <Link href="/maquinaria/excavadoras" className="font-semibold text-copper-600 underline underline-offset-4">arriendo de excavadoras</Link> y el <Link href="/maquinaria" className="font-semibold text-copper-600 underline underline-offset-4">catálogo de maquinaria</Link>. Las condiciones de operación, traslado y disponibilidad se confirman en la cotización.</p><p className="text-body mt-4 leading-relaxed text-ink/80">Si el requerimiento incluye infraestructura, fundaciones o cierres, consulta también nuestra línea de <Link href="/servicios/obras-civiles" className="font-semibold text-copper-600 underline underline-offset-4">obras civiles</Link>. Para conservar una vía de tránsito existente, revisa la <Link href="/servicios/mantencion-integral-de-caminos" className="font-semibold text-copper-600 underline underline-offset-4">mantención de caminos mineros y accesos</Link>.</p></aside>
      </section>
      <section className="mt-12 max-w-3xl" aria-labelledby="consultas-terreno"><h2 id="consultas-terreno" className="font-display text-3xl font-semibold text-olive-900">Consultas sobre el servicio</h2><div className="mt-5 divide-y divide-sand">
        <div className="py-5"><h3 className="font-semibold text-olive-900">¿Atienden movimiento de tierra en Copiapó?</h3><p className="text-body mt-3 leading-relaxed text-ink/80">Sí. Evaluamos trabajos en Copiapó, Tierra Amarilla y otras comunas de Atacama. Nuestra coordinación está en Tierra Amarilla y la atención se realiza en el lugar de la obra; la programación depende del alcance, los accesos y los recursos requeridos.</p></div>
        <div className="py-5"><h3 className="font-semibold text-olive-900">¿El relleno siempre incluye compactación?</h3><p className="text-body mt-3 leading-relaxed text-ink/80">Depende del uso de la superficie y de las especificaciones del proyecto. Por ejemplo, el relleno del Bosque Mina Santos se ejecutó para una futura plantación, sin compactación mecánica. Para una nueva obra se acuerdan el material, las etapas y los requisitos aplicables.</p></div>
        <div className="py-5"><h3 className="font-semibold text-olive-900">¿Pueden coordinar materiales y retiro?</h3><p className="text-body mt-3 leading-relaxed text-ink/80">Se evalúan con el volumen y las especificaciones del trabajo. Indica qué materiales aporta el mandante, cuáles necesitas cotizar y las condiciones del destino del retiro. También puedes consultar nuestro <Link href="/servicios/suministro-y-abastecimiento" className="font-semibold text-copper-600 underline underline-offset-4">suministro de áridos y estabilizado</Link>.</p></div>
      </div></section>
    </Container>
    <CtaBand />
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(schema) }} />
  </>;
}
