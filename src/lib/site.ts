// Contenido centralizado del sitio. Migrado desde granallanorte.cl (Hostinger Website Builder).
// Editar aquí actualiza todas las páginas.

import recoveredNews from "./recovered-news.json";

const CDN = "/img";

export const site = {
  name: "Granalla Norte",
  url: "https://www.granallanorte.cl",
  tagline: "Minería, obras civiles y asesoría técnica en Tierra Amarilla",
  description:
    "Granalla Norte entrega venta de minerales no metálicos, monitoreo de tronaduras, consultoría minera y obras civiles con mano de obra local en Tierra Amarilla y Copiapó, Región de Atacama.",
  email: "granalla.norte@gmail.com",
  // TODO: completar con datos reales (el sitio actual no publica teléfono ni dirección).
  phone: "",
  whatsapp: "",
  address: "Tierra Amarilla, Región de Atacama, Chile",
  youtubeId: "h5RxcxaMmoc",
  logo: `${CDN}/logo-granalla-norte-a-color---copia1-YD0D4vr2LwFKXxV3.png`,
  images: {
    hero: `${CDN}/img_3465-YX4z68W28NHqE0bl.JPEG`,
    minerals: `${CDN}/20250513_111619-Yg2yB1nM3ohMrnV4.jpg`,
    consulting: `${CDN}/img_3418-mxB8q33xG0tEa0Wp.JPEG`,
    civil: `${CDN}/whatsapp-image-2024-03-19-at-15.57.22-1-mk35WbZKpofqnR69.jpeg`,
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
    slug: "minerales",
    kicker: "01 · Suministro",
    title: "Venta de minerales no metálicos",
    summary:
      "Insumos para caminos, control de polvo e industria, con entregas seguras y puntuales en faena.",
    image: site.images.minerals,
    items: [
      { name: "Cloruro de sodio", detail: "Estabilización de caminos, control de polvo y procesos industriales." },
      { name: "Sílice de cuarzo", detail: "Para fundición, construcción y otras industrias, con calidad y pureza garantizadas." },
      { name: "Bischofita", detail: "Alternativa ecológica para estabilizado y control de polvo, eficiente y sustentable." },
      { name: "Estabilizado", detail: "Mejora caminos y zonas de tránsito con mayor durabilidad y eficiencia operativa." },
    ],
  },
  {
    slug: "asesorias",
    kicker: "02 · Ingeniería",
    title: "Asesorías y consultoría especializada",
    summary:
      "Monitoreo de vibraciones y acompañamiento técnico de ingenieros en cada etapa de tu proyecto.",
    image: site.images.consulting,
    items: [
      { name: "Monitoreo de tronaduras", detail: "Sismógrafos y geófonos con reportes claros y precisos. Opción de render." },
      { name: "Gestión de compras", detail: "Adquisiciones eficientes y seguras, con optimización de recursos." },
      { name: "Consultoría minera", detail: "Acompañamiento técnico y estratégico de ingenieros con experiencia en faena." },
    ],
  },
  {
    slug: "obras-civiles",
    kicker: "03 · Construcción",
    title: "Obras civiles e infraestructura",
    summary:
      "Obras menores y mejoras de infraestructura para comunidades e industria, con mano de obra local.",
    image: site.images.civil,
    items: [
      { name: "Obras menores", detail: "Mejoran la funcionalidad de espacios comunitarios e industriales." },
      { name: "Mejoras de infraestructura", detail: "Bienestar comunitario y operaciones industriales más eficientes." },
      { name: "Mano de obra local", detail: "Seguridad, eficiencia y calidad en cada etapa, con equipos de Tierra Amarilla." },
    ],
  },
];

export const pillars = [
  { value: "3", label: "líneas de servicio integradas" },
  { value: "40 t", label: "de cloruro de sodio entregadas a Maricunga" },
  { value: "121 m²", label: "de cobertizo comunitario en Villa Los Forjadores" },
  { value: "100%", label: "equipos con mano de obra local" },
];

export const clients = [
  "Kinross · Minera Maricunga",
  "Minera Candelaria",
  "Minera Altair",
  "Fenix Gold",
  "Laria",
  "Branda",
];

export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  location: string;
  client?: string;
  category: "Minerales" | "Obras civiles" | "Eventos";
  image: string;
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
    "Somos una empresa sostenible de Tierra Amarilla dedicada a prestar servicios a la minería: suministro de minerales no metálicos, obras civiles, asesoría y monitoreo de vibraciones. Trabajamos con un equipo local altamente capacitado, comprometido con el medio ambiente, la calidad y la seguridad.",
  mission:
    "Ofrecer soluciones completas y sostenibles a la industria minera, mejorando la eficiencia operativa y asegurando la seguridad y el bienestar de nuestros trabajadores y comunidades. Innovamos con tecnología y prácticas responsables para reducir el impacto ambiental y aumentar el valor para nuestros clientes.",
  vision:
    "Ser líderes en la industria minera, reconocidos por soluciones sostenibles e innovadoras que mejoren la eficiencia operativa y promuevan el bienestar de las comunidades. Un socio confiable y responsable en cada proyecto, con impacto positivo y duradero.",
  values: [
    { title: "Seguridad primero", text: "Protocolos de faena en cada obra y entrega." },
    { title: "Talento local", text: "Contratamos y formamos en Tierra Amarilla." },
    { title: "Sostenibilidad", text: "Insumos y prácticas de menor impacto ambiental." },
    { title: "Cumplimiento", text: "Plazos y reportes claros, sin sorpresas." },
  ],
};

export const formatDate = (iso: string) =>
  new Date(iso + "T12:00:00").toLocaleDateString("es-CL", { day: "numeric", month: "long", year: "numeric" });
