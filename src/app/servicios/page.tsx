import { Container, CtaBand, PageHero } from "@/components/ui";
import { ServiceCards } from "@/components/ServiceCards";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata("/servicios", "Servicios para minería y obras civiles en Atacama", "Caminos mineros, obras civiles, suministro y monitoreo de tronaduras en Atacama. Conoce cada servicio y consulta por maquinaria y equipos.");

export default function ServiciosPage() {
  return <>
    <PageHero eyebrow="Servicios" title="Soluciones para tu faena y proyecto" intro="Conoce qué resolvemos y los principales trabajos de cada línea. En la ficha de cada servicio encontrarás el alcance completo y los antecedentes para cotizar." />
    <Container className="py-8 sm:py-10">
      <ServiceCards listing />
    </Container>
    <CtaBand />
  </>;
}
