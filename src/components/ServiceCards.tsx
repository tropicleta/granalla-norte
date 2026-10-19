import Image from "next/image";
import Link from "next/link";
import { services } from "@/lib/site";
import { servicePath } from "@/lib/service-details";
import { sectorProjectsPath } from "@/lib/service-projects";
import { Arrow } from "./ui";
import styles from "./ServiceCards.module.css";

const summaries: Record<string, string> = {
  "mantencion-integral-de-caminos": "Perfilado, compactación y humectación de caminos mineros, con maquinaria y materiales coordinados.",
  "obras-civiles": "Movimiento de tierra y obras para faenas y comunidades, con recursos y mano de obra local.",
  "suministro-y-abastecimiento": "Materiales e insumos para tu proyecto, con formato, cantidades y entregas coordinadas.",
  "monitoreo-de-tronaduras": "Medición de vibraciones en campo cercano y lejano, con equipos, análisis e informes técnicos.",
};

const legacyIds: Record<string, string> = {
  "mantencion-integral-de-caminos": "mantencion-de-caminos",
  "suministro-y-abastecimiento": "minerales",
  "monitoreo-de-tronaduras": "asesorias",
};

const scopes: Record<string, string[]> = {
  "mantencion-integral-de-caminos": ["Perfilado, nivelación y conformación del camino.", "Compactación, humectación y apoyo al control de polvo.", "Maquinaria, materiales y logística según el proyecto."],
  "obras-civiles": ["Excavación, carguío, retiro y preparación de terreno.", "Mejoras de infraestructura y obras comunitarias.", "Coordinación de equipos y mano de obra local."],
  "suministro-y-abastecimiento": ["Cloruro de sodio, sílice, áridos y estabilizado.", "Cantidades y especificaciones según el requerimiento.", "Entregas coordinadas con los accesos y la recepción de la obra."],
  "monitoreo-de-tronaduras": ["Mediciones de campo cercano y campo lejano.", "Instalación de equipos y registro de vibraciones.", "Análisis y entrega de informes técnicos."],
};

export function ServiceCards({ listing = false }: { listing?: boolean }) {
  const Heading = listing ? "h2" : "h3";
  return <div className={`${styles.grid} ${listing ? styles.listing : ""}`}>
    {services.map(service => {
      const monitoring = service.slug === "monitoreo-de-tronaduras";
      return <article key={service.slug} id={listing ? service.slug : undefined} aria-labelledby={`${listing ? "titulo" : "resumen"}-${service.slug}`} className={styles.card}>
        <div className={styles.media}>
          {listing && legacyIds[service.slug] && <span id={legacyIds[service.slug]} className="absolute top-0 scroll-mt-40" aria-hidden />}
          <Image src={service.image} alt="" fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-contain" />
          <span className={styles.kicker}>{service.kicker}</span>
        </div>
        <Heading id={`${listing ? "titulo" : "resumen"}-${service.slug}`} className={styles.title}><Link href={servicePath(service.slug)}>{service.title}</Link></Heading>
        <p className={styles.summary}>{listing ? service.summary : summaries[service.slug]}</p>
        <ul className={styles.items}>{listing ? scopes[service.slug].map(scope => <li key={scope}>{scope}</li>) : service.items.map(item => <li key={item.name}><span className={styles.itemName}>{item.name}</span></li>)}</ul>
        <div className={styles.actions}>
          <Link href={servicePath(service.slug)} className={styles.primary}>{listing ? "Alcance completo y cotización" : "Ver servicio y cómo cotizar"} <Arrow /></Link>
          <Link href={monitoring ? "/equipos-monitoreo" : "/maquinaria"} className={styles.equipment}>
            <span className={styles.equipmentPhoto}><Image src={monitoring ? "/img/monitoreo/minimate-plus-geofono.png" : "/img/brochure/cargador.jpg"} alt={monitoring ? "Sismógrafo Instantel con geófono" : "Maquinaria para trabajos en terreno"} fill sizes={listing ? "64px" : "44px"} className="object-contain" /></span>
            <span className={styles.equipmentLabel}>{monitoring ? "Arriendo de equipos" : "Arriendo de maquinaria"}</span><Arrow />
          </Link>
          <Link href={sectorProjectsPath(service.slug)} className={styles.news} aria-label={`Proyectos y noticias de ${service.title.toLowerCase()}`}>Proyectos y noticias <Arrow /></Link>
        </div>
      </article>;
    })}
  </div>;
}
