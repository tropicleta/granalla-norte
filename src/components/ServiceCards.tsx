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

export function ServiceCards() {
  return <div className={styles.grid}>
    {services.map(service => {
      const monitoring = service.slug === "monitoreo-de-tronaduras";
      return <article key={service.slug} aria-labelledby={`resumen-${service.slug}`} className={styles.card}>
        <div className={styles.media}>
          <Image src={service.image} alt="" fill sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 100vw" className="object-contain" />
          <span className={styles.kicker}>{service.kicker}</span>
        </div>
        <h3 id={`resumen-${service.slug}`} className={styles.title}><Link href={servicePath(service.slug)}>{service.title}</Link></h3>
        <p className={styles.summary}>{summaries[service.slug]}</p>
        <ul className={styles.items}>{service.items.map(item => <li key={item.name}><span className={styles.itemName}>{item.name}</span></li>)}</ul>
        <div className={styles.actions}>
          <Link href={servicePath(service.slug)} className={styles.primary}>Ver servicio y cómo cotizar <Arrow /></Link>
          <Link href={monitoring ? "/equipos-monitoreo" : "/maquinaria"} className={styles.equipment}>
            <span className={styles.equipmentPhoto}><Image src={monitoring ? "/img/monitoreo/minimate-plus-geofono.png" : "/img/brochure/cargador.jpg"} alt={monitoring ? "Sismógrafo Instantel con geófono" : "Maquinaria para trabajos en terreno"} fill sizes="44px" className="object-contain" /></span>
            <span className={styles.equipmentLabel}>{monitoring ? "Arriendo de equipos" : "Arriendo de maquinaria"}</span><Arrow />
          </Link>
          <Link href={sectorProjectsPath(service.slug)} className={styles.news} aria-label={`Proyectos y noticias de ${service.title.toLowerCase()}`}>Proyectos y noticias <Arrow /></Link>
        </div>
      </article>;
    })}
  </div>;
}
