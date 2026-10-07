// Contenido centralizado del sitio. Migrado desde granallanorte.cl (Hostinger Website Builder).
// Editar aquí actualiza todas las páginas.

import recoveredNews from "./recovered-news.json";

const CDN = "/img";

export const site = {
  name: "Granalla Norte",
  url: "https://www.granallanorte.cl",
  tagline: "Capacidad local para ejecutar, abastecer y responder en terreno",
  description:
    "Granalla Norte integra obras civiles, movimiento de tierra, mantención integral de caminos, arriendo de maquinaria, suministro y monitoreo de tronaduras en Tierra Amarilla y Atacama.",
  email: "contacto@granallanorte.cl",
  phone: "",
  phoneDisplay: "",
  whatsapp: "",
  address: "Tierra Amarilla, Región de Atacama, Chile",
  youtubeId: "h5RxcxaMmoc",
  logo: `${CDN}/logo-granalla-norte-a-color---copia1-YD0D4vr2LwFKXxV3.png`,
  images: {
    hero: `${CDN}/brochure/faena.jpg`,
    team: `${CDN}/brochure/equipo-local.jpg`,
    minerals: `${CDN}/brochure/suministro.jpg`,
    consulting: `${CDN}/img_3418-mxB8q33xG0tEa0Wp.JPEG`,
    civil: `${CDN}/brochure/obras.jpg`,
    clients: `${CDN}/pie-de-paina-m7Vk11oJBDSLDaZb.jpg`,
  },
  nav: [
    { href: "/", label: "Inicio" },
    { href: "/nosotros", label: "Nosotros" },
    { href: "/servicios", label: "Servicios" },
    { href: "/noticias", label: "Proyectos" },
    { href: "/contacto", label: "Contacto" },
  ],
} as const;

export type ServiceLine = {
  slug: string;
  kicker: string;
  title: string;
  summary: string;
  image: string;
  items: { name: string; detail: string }[];
};

export const services: ServiceLine[] = [
  {
    slug: "obras-civiles",
    kicker: "01 · Obras",
    title: "Obras civiles y movimiento de tierra",
    summary:
      "Ejecución y coordinación de trabajos de terreno para operaciones, proyectos y comunidades, con recursos y mano de obra local.",
    image: site.images.civil,
    items: [
      { name: "Movimiento de tierra", detail: "Excavación, carguío, retiro, limpieza y preparación de terreno según alcance." },
      { name: "Mejoras de infraestructura", detail: "Bienestar comunitario y operaciones industriales más eficientes." },
      { name: "Mano de obra local", detail: "Seguridad, eficiencia y calidad en cada etapa, con equipos de Tierra Amarilla." },
    ],
  },
  {
    slug: "mantencion-integral-de-caminos",
    kicker: "02 · Caminos",
    title: "Mantención integral de caminos",
    summary: "Habilitación y conservación de caminos: perfilado, nivelación, conformación, compactación y humectación según terreno y tránsito.",
    image: "/img/brochure/caminos.jpg",
    items: [
      { name: "Arriendo de maquinaria", detail: "Motoniveladora RG200B, rodillo New Holland V110 y camiones aljibe, con asignación según acceso, frente de trabajo y programación." },
      { name: "Venta de suministros", detail: "Estabilizado y cloruro de sodio para caminos; suministro y logística coordinados según el requerimiento." },
      { name: "Obras para caminos", detail: "Perfilado, nivelación, conformación, compactación, humectación y control de polvo según las condiciones operacionales." },
    ],
  },
  {
    slug: "minerales",
    kicker: "03 · Abastecimiento",
    title: "Suministro y abastecimiento",
    summary:
      "Materiales, insumos y logística coordinados según el alcance, el formato y las condiciones de cada proyecto.",
    image: site.images.minerals,
    items: [
      { name: "Cloruro de sodio", detail: "Estabilización de caminos, control de polvo y procesos industriales." },
      { name: "Sílice de cuarzo", detail: "Suministro para requerimientos industriales y proyectos, con especificaciones a coordinar." },
      { name: "Arena y gravilla", detail: "Materiales para obras civiles y preparación de superficies, según las especificaciones del proyecto." },
      { name: "Estabilizado", detail: "Mejora caminos y zonas de tránsito con mayor durabilidad y eficiencia operativa." },
    ],
  },
  {
    slug: "asesorias",
    kicker: "04 · Monitoreo",
    title: "Monitoreo de tronaduras",
    summary:
      "Monitoreos de campo cercano y campo lejano, con equipos, instalación, análisis e informes técnicos para operaciones mineras.",
    image: site.images.consulting,
    items: [
      { name: "Equipos e instalación", detail: "Coordinación de equipos y puntos de medición según el requerimiento." },
      { name: "Monitoreo y análisis", detail: "Registro y análisis de vibraciones de tronaduras en campo cercano y campo lejano." },
      { name: "Informes técnicos", detail: "Seguimiento y entrega de antecedentes técnicos de las mediciones." },
    ],
  },
];

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  location: string;
  client?: string;
  category: string;
  image: string;
  imageCaption?: string;
  excerpt: string;
  body: string[];
  highlights?: string[];
};

export const posts: Post[] = [
  {
    slug: "expo-forede-2025",
    title: "Granalla Norte presente en la Expo FOREDE 2025",
    date: "2025-10-16",
    location: "FOREDE 2025",
    category: "Eventos",
    image: `${CDN}/forede-YD0ELMEZGNFbgnwJ.jpg`,
    excerpt: "Participamos entre el 14 y el 16 de octubre en FOREDE 2025, mostrando nuestros servicios a la industria.",
    body: [
      "Entre el 14 y el 16 de octubre estuvimos presentes en la Expo FOREDE 2025, compartiendo con la comunidad minera nuestras líneas de suministro, ingeniería y obras civiles.",
    ],
  },
  {
    slug: "ventas-de-cloruro-de-sodio-para-minera-maricunga",
    title: "Ampliamos la venta de cloruro de sodio para Minera Maricunga",
    date: "2025-06-03",
    location: "Minera Maricunga, Región de Atacama",
    client: "Kinross",
    category: "Minerales",
    image: `${CDN}/20250513_111619-Yg2yB1nM3ohMrnV4.jpg`,
    excerpt: "40 toneladas en dos entregas de 20 t para estabilización de caminos y control de polvo.",
    body: [
      "Durante este trimestre consolidamos la venta de 40 toneladas de cloruro de sodio, distribuidas en dos entregas de 20 toneladas cada una, destinadas a Minera Maricunga en la Región de Atacama.",
      "El cloruro de sodio es fundamental para la estabilización de caminos no pavimentados y la reducción del polvo en suspensión, optimizando las rutas de acceso y tránsito en entornos mineros. Su uso en procesos de lixiviación y recuperación de minerales mejora además la eficiencia y sustentabilidad de las operaciones.",
      "Con estas entregas reafirmamos nuestro compromiso con la calidad y el suministro confiable de productos que aportan valor a las operaciones de nuestros clientes.",
    ],
    highlights: [
      "Mayor cohesión del terreno y menos polvo en suspensión",
      "Optimización de procesos de lixiviación y recuperación",
      "Amplia aplicación en obras civiles y minería",
    ],
  },
  {
    slug: "mejora-sede-social-villa-los-forjadores",
    title: "Mejoramos la sede social Villa Los Forjadores",
    date: "2025-05-12",
    location: "El Escorial, Tierra Amarilla",
    client: "Minera Candelaria",
    category: "Obras civiles",
    image: `${CDN}/img-20250418-wa0025-dJobpGgB8qS6eq5N.jpg`,
    excerpt: "Cobertizo de 121 m² en madera cepillada, iluminación LED y nuevo equipamiento para la comunidad.",
    body: [
      "Finalizamos con éxito la construcción de un cobertizo en la Sede Comunitaria Villa Los Forjadores, un proyecto impulsado por Minera Candelaria como parte de su programa de inversión social para fortalecer la infraestructura comunitaria.",
      "El proyecto ofrece un nuevo espacio de reunión y participación para los vecinos, fomentando el bienestar y la cohesión social de la comunidad.",
    ],
    highlights: [
      "Cobertizo de 121 m² con estructura de madera cepillada",
      "Cubierta de madera tratada y revestimiento cerámico en zonas de tránsito",
      "Iluminación LED exterior y tomacorrientes estratégicos",
      "Lavaplatos de acero inoxidable con pedestal metálico",
    ],
  },
  {
    slug: "mejora-escuela-paul-harris",
    title: "Renovamos la Escuela Paul Harris de Nantoco",
    date: "2025-03-19",
    location: "Nantoco, Tierra Amarilla",
    client: "Minera Altair",
    category: "Obras civiles",
    image: `${CDN}/whatsapp-image-2025-03-26-at-12.28.56-pm-1-YrDW3LzowztBKakz.jpeg`,
    excerpt: "Áreas de juego, fachadas renovadas, pasto sintético y sombra para los niños de Nantoco.",
    body: [
      "Finalizamos las obras de mejoramiento y renovación de la Escuela Paul Harris de Nantoco, un proyecto impulsado por Minera Altair como parte de su compromiso social.",
      "El proyecto, inaugurado el 14 de marzo, renovó los espacios de recreación y entregó a los niños un entorno más amigable para su desarrollo.",
    ],
    highlights: [
      "Instalación de áreas de juego infantiles",
      "Arreglo de fachadas y renovación de pintura",
      "Pasto sintético y áreas de sombra",
      "Mejoras de infraestructura para mayor seguridad y confort",
    ],
  },
];

posts.push(...recoveredNews.map(({ slug, title, date, location, category, image, excerpt, body, ...rest }) => ({
  slug, title, date, location, category: category as Post["category"], image, excerpt, body,
  client: "client" in rest ? rest.client : undefined,
  highlights: "highlights" in rest ? rest.highlights : undefined,
})));

export const about = {
  intro:
    "Somos una empresa local de Tierra Amarilla que apoya operaciones y proyectos mineros, integrando ejecución en terreno, abastecimiento, logística y coordinación de recursos. Articulamos nuestras capacidades según el alcance, los plazos y las condiciones reales de cada requerimiento.",
  mission:
    "Coordinar los recursos necesarios para transformar una necesidad operativa en una solución ejecutable. Integramos suministro, logística, ejecución y seguimiento, adaptándonos a las condiciones del proyecto.",
  vision:
    "Consolidar nuestra capacidad de respuesta local como un socio cercano para operaciones y proyectos de Atacama, con conocimiento del territorio, coordinación en terreno y vínculos con sus comunidades.",
  values: [
    { title: "Ejecución", text: "Recursos coordinados para llevar cada requerimiento a terreno." },
    { title: "Presencia local", text: "Cercanía territorial y conocimiento del entorno minero de Atacama." },
    { title: "Capacidad de respuesta", text: "Adaptación a condiciones, plazos e imprevistos operacionales." },
    { title: "Empleo y comunidad", text: "Priorizamos oportunidades laborales locales y apoyamos iniciativas del territorio." },
  ],
};

export const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
