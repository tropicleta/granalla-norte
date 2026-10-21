import type { Post } from "./site";
import { categoryKey } from "./news-categories";

export const PROJECT_CONTEXT_UPDATED = "2026-10-21";
type ServiceLink = { slug: string; label: string; context: string };
type Evidence = { summary: string; services: ServiceLink[] };
const civil = "obras-civiles";
const supply = "suministro-y-abastecimiento";

// Editorial associations are supported by the published project descriptions.
// Equipment used on a project is not evidence of an equipment rental contract.
export const projectEvidence: Record<string, Evidence> = {
  "relleno-nivelacion-bosque-mina-santos": {
    summary: "Relleno, distribución y nivelación de terreno para plantación, sin compactación mecánica. Se utilizó material estabilizado del mandante y tierra fértil suministrada por Granalla Norte.",
    services: [
      { slug: civil, label: "Movimiento de tierra y preparación de terrenos", context: "Este caso documenta la conformación del relleno, la distribución de materiales y la nivelación del terreno en Mina Santos." },
      { slug: supply, label: "Suministro y coordinación de materiales", context: "La tierra fértil fue suministrada por Granalla Norte; el material estabilizado utilizado en esta obra fue dispuesto por el mandante. Consulta los materiales de nuestra oferta actual." },
    ],
  },
  "limpieza-habilitacion-plantacion-mina-santos": {
    summary: "Limpieza y habilitación del sector de plantación: poda, retiro de material vegetal, rebaje de talud con retroexcavadora, relleno y nivelación, con humectación mediante camión aljibe.",
    services: [
      { slug: civil, label: "Limpieza, habilitación y movimiento de tierra", context: "El trabajo incluyó adecuación de talud, relleno y nivelación del sector, además de poda y retiro de material vegetal." },
      { slug: "mantencion-integral-de-caminos", label: "Humectación y control de polvo: capacidades para caminos", context: "El registro documenta humectación con camión aljibe durante la habilitación de terreno. Es una capacidad relacionada con nuestra oferta de caminos; este caso no documenta la construcción ni la mantención de un camino." },
    ],
  },
  "mejoramiento-oficina-comunitaria-candelaria": {
    summary: "Renovación de pasarelas, tarimas, parrones y sector huerto, coordinando las obras con el funcionamiento de la Oficina Comunitaria Candelaria.",
    services: [{ slug: civil, label: "Obras civiles y mejoramiento de infraestructura", context: "Este caso permite conocer intervenciones de mejoramiento de espacios exteriores y la coordinación de trabajos en un recinto en funcionamiento." }],
  },
  "cierre-perimetral-sti-caldera": {
    summary: "Preparación del terreno, excavaciones, fundaciones, albañilería y montaje de rejas y accesos para el cierre perimetral de STI en Caldera.",
    services: [{ slug: civil, label: "Obras civiles, excavación y preparación del terreno", context: "El cierre perimetral integra nivelación, plataformas, fundaciones y construcción, con una solución adaptada al desnivel del recinto." }],
  },
  "ventas-de-cloruro-de-sodio-para-minera-maricunga": {
    summary: "Suministro y coordinación de entregas de cloruro de sodio para estabilización de caminos no pavimentados y control del polvo en Minera Maricunga.",
    services: [{ slug: supply, label: "Suministro industrial de cloruro de sodio", context: "Este caso documenta suministro y logística de entrega. Revisa nuestra oferta de cloruro de sodio y materiales para obras y faenas de Atacama." }],
  },
  "ventas-significativas-de-cloruro-de-sodio-para-kinross-en-la-coipa": {
    summary: "Inicio del suministro de cloruro de sodio para la faena La Coipa, en Atacama, como parte de la ampliación de la línea de abastecimiento.",
    services: [{ slug: supply, label: "Abastecimiento de cloruro de sodio para faenas", context: "El registro corresponde al inicio del suministro. No informa una cantidad total ni documenta ejecución de caminos por Granalla Norte." }],
  },
};

export function projectServices(post: Post): ServiceLink[] {
  if (projectEvidence[post.slug]) return projectEvidence[post.slug].services;
  const category = categoryKey(post.category);
  if (["obras civiles", "movimiento de tierra"].includes(category)) return [{ slug: civil, label: "Obras civiles y movimiento de tierra", context: "Conoce el alcance de nuestra oferta de obras civiles y los antecedentes necesarios para evaluar un proyecto." }];
  if (["minerales", "abastecimiento", "suministro y abastecimiento"].includes(category)) return [{ slug: supply, label: "Suministro y abastecimiento industrial", context: "Consulta materiales, especificaciones y condiciones de entrega para tu proyecto." }];
  if (["caminos", "mantención integral de caminos", "mantención de caminos"].includes(category)) return [{ slug: "mantencion-integral-de-caminos", label: "Mantención de caminos mineros y accesos", context: "Conoce los trabajos de perfilado, nivelación, compactación y humectación que se evalúan según las condiciones de cada camino." }];
  if (["monitores-comunitarios-segundo-semestre-2024", "monitoreo-vibraciones-primer-semestre-2024"].includes(post.slug)) return [{ slug: "monitoreo-de-tronaduras", label: "Monitoreo de tronaduras y vibraciones", context: "Este registro trata de formación y participación comunitaria en monitoreo. Consulta por separado el alcance del servicio de medición, instalación, análisis e informes." }];
  if (category === "monitoreo de tronaduras") return [{ slug: "monitoreo-de-tronaduras", label: "Monitoreo de tronaduras y vibraciones", context: "Conoce el alcance del monitoreo de campo cercano y lejano, con equipos, instalación, análisis e informes según el requerimiento." }];
  return [];
}

export function relatedProjectArticles<T extends Post>(posts: T[], current: Post): T[] {
  const currentServices = projectServices(current);
  const services = new Set(currentServices.map(service => service.slug));
  const score = (post: Post) => {
    const links = projectServices(post);
    if (currentServices[0] && links[0]?.slug === currentServices[0].slug) return 4;
    return links.some(service => services.has(service.slug)) ? 2 : post.category === current.category ? 1 : 0;
  };
  return posts.filter(post => post.slug !== current.slug).sort((a, b) => score(b) - score(a) || b.date.localeCompare(a.date)).slice(0, 3);
}

export function projectContextModified(post: Post & { updatedAt?: string }) {
  if (!projectServices(post).length) return post.updatedAt;
  return post.updatedAt && post.updatedAt > PROJECT_CONTEXT_UPDATED ? post.updatedAt : PROJECT_CONTEXT_UPDATED;
}
