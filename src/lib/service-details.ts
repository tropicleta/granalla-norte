export type ServiceDetail = {
  serviceSlug: string;
  slug: string;
  title: string;
  searchTitle: string;
  description: string;
  intro: string;
  problem: string;
  scope: string;
  applications?: { title: string; description: string }[];
  applicationsTitle?: string;
  quote: string[];
  questions: { question: string; answer: string }[];
  projectCategories: string[];
};

export const serviceDetails: ServiceDetail[] = [
  {
    "serviceSlug": "obras-civiles",
    "slug": "obras-civiles",
    "title": "Obras civiles y movimiento de tierra en Copiapó y Atacama",
    "searchTitle": "Obras civiles y movimiento de tierra en Copiapó",
    "description": "Obras civiles, excavación, carguío y preparación de terreno en Copiapó, Tierra Amarilla y Atacama. Consulta alcance, maquinaria y programación.",
    "intro": "Obras civiles, excavaciones, rellenos, nivelación y preparación de terrenos para empresas, faenas y proyectos comunitarios en Copiapó y Atacama. Coordinamos maquinaria, materiales y mano de obra según el trabajo requerido.",
    "problem": "Una intervención en terreno necesita organizar equipos, materiales y logística para responder a las condiciones reales de la obra y a los plazos del requerimiento.",
    "scope": "Excavación, carguío, retiro, limpieza y preparación de terreno, junto con trabajos de obras civiles según alcance. Coordinamos excavadoras, cargador y transporte como apoyo a la ejecución. La selección de equipos, los materiales y la programación se definen con los antecedentes de cada proyecto.",
    "applicationsTitle": "Trabajos de obras civiles y movimiento de tierra",
    "applications": [
      { "title": "Excavación y preparación de terrenos", "description": "Limpieza, excavación, carguío y retiro de material para habilitar áreas de trabajo. Evaluamos el volumen, los accesos y las condiciones del terreno antes de asignar maquinaria." },
      { "title": "Relleno y nivelación", "description": "Distribución y nivelación de materiales según el uso previsto del sector. El proyecto de Bosque Mina Santos documenta estos trabajos para una futura plantación, sin compactación mecánica." },
      { "title": "Mejoras de infraestructura y cierres", "description": "Nuestra experiencia publicada incluye pasarelas, tarimas, espacios comunitarios y cierres perimetrales. Revisamos planos, medidas, materiales y funcionamiento del lugar para definir la intervención." }
    ],
    "quote": [
      "Ubicación y descripción de los trabajos.",
      "Fotografías, medidas, planos y especificaciones disponibles.",
      "Volumen de material y condiciones de acceso.",
      "Plazos, programación y necesidades de apoyo operacional."
    ],
    "questions": [
      {
        "question": "¿Qué incluye el movimiento de tierra?",
        "answer": "Excavación, carguío, retiro, limpieza y preparación de áreas. Los equipos y recursos se coordinan según el frente de trabajo y las condiciones del proyecto."
      },
      {
        "question": "¿Trabajan también en infraestructura comunitaria?",
        "answer": "Sí. La experiencia publicada incluye mejoras en sedes sociales y establecimientos educacionales, con participación local y coordinación según las necesidades de cada obra."
      },
      {
        "question": "¿Cómo se cotiza una excavación o un movimiento de tierra?",
        "answer": "Envíanos la ubicación, fotografías, medidas o volumen aproximado, tipo de material y fechas. Con esos antecedentes evaluamos maquinaria, carguío, retiro y accesos; si falta información, coordinamos cómo completar la evaluación antes de confirmar el alcance."
      },
      {
        "question": "¿Puedo contratar la obra o consultar solo por maquinaria?",
        "answer": "Puedes consultar la ejecución de los trabajos o un arriendo de maquinaria. Son requerimientos distintos: para la obra definimos tareas y recursos; para el arriendo confirmamos equipo, fechas, traslado y condiciones de uso."
      }
    ],
    "projectCategories": [
      "Obras civiles"
    ]
  },
  {
    "serviceSlug": "mantencion-integral-de-caminos",
    "slug": "mantencion-integral-de-caminos",
    "title": "Mantención de caminos mineros en Copiapó y Atacama",
    "searchTitle": "Mantención de caminos mineros en Copiapó",
    "description": "Perfilado, nivelación, compactación y humectación de caminos mineros en Copiapó, Tierra Amarilla y Atacama. Coordinamos maquinaria y materiales.",
    "intro": "Conservamos la transitabilidad de caminos mineros y accesos para apoyar la continuidad operacional y logística. Integramos maquinaria, materiales y ejecución en Tierra Amarilla y Atacama según el alcance de cada intervención.",
    "problem": "Un camino deteriorado puede restringir el acceso de personas, equipos y suministros a la faena. Evaluamos superficie, tránsito, polvo y condiciones de acceso para planificar la intervención y coordinarla con la operación del cliente.",
    "scope": "Perfilado, nivelación, conformación, compactación y humectación de caminos. El brochure contempla motoniveladora RG200B año 2021, rodillo New Holland V110 año 2024 y camiones aljibe de 15 y 30 m³. La combinación y asignación de equipos se define según alcance y programación.",
    "quote": [
      "Ubicación, longitud aproximada y estado del camino.",
      "Tipo de tránsito, ancho aproximado y sectores que requieren intervención; fotografías o planos disponibles.",
      "Condiciones de acceso y fechas del trabajo.",
      "Necesidades de suministro, humectación y equipos, además de requisitos técnicos y de seguridad del mandante."
    ],
    "questions": [
      {
        "question": "¿Se puede consultar solo por arriendo de maquinaria?",
        "answer": "Sí. Consulta el catálogo con los equipos del brochure y coordina disponibilidad, condiciones de acceso y programación con nuestro equipo."
      },
      {
        "question": "¿Qué trabajos realizan en caminos?",
        "answer": "Habilitación, mantención, perfilado, nivelación, conformación, compactación, humectación y apoyo al control de polvo, según las condiciones del terreno y el alcance acordado."
      }
    ],
    "projectCategories": []
  },
  {
    "serviceSlug": "suministro-y-abastecimiento",
    "slug": "suministro-y-abastecimiento",
    "title": "Cloruro de sodio, áridos y materiales para obras en Copiapó y Atacama",
    "searchTitle": "Cloruro de sodio y áridos en Copiapó y Atacama",
    "description": "Suministro de cloruro de sodio, áridos, estabilizado y sílice de cuarzo para Copiapó, Tierra Amarilla y Atacama. Consulta cantidades y entregas.",
    "intro": "Suministro de cloruro de sodio para requerimientos industriales, áridos y sílice de cuarzo para empresas y faenas. Coordinamos cantidades, especificaciones y entregas en Copiapó y Atacama según disponibilidad y condiciones de recepción.",
    "applicationsTitle": "Materiales que puedes solicitar",
    "applications": [
      { "title": "Cloruro de sodio para uso industrial", "description": "Suministro y coordinación de entregas para obras y faenas. Los casos publicados de Maricunga y La Coipa documentan abastecimiento de cloruro de sodio; indica el uso previsto, las especificaciones, el volumen y el formato requerido." },
      { "title": "Áridos: arena, gravilla y estabilizado", "description": "Consulta suministro para tu obra con el tipo de material, la granulometría o especificación disponible, la cantidad y el punto de entrega. Evaluamos accesos y capacidad de descarga antes de confirmar la logística." },
      { "title": "Sílice de cuarzo", "description": "Para evaluar el requerimiento, envía la especificación técnica, cantidad, presentación y destino. La disponibilidad y las condiciones de entrega se confirman para cada solicitud." }
    ],
    "problem": "Abastecer también implica coordinar correctamente. Las cantidades, los accesos, los plazos y la capacidad de almacenamiento del cliente deben incorporarse a la planificación de las entregas.",
    "scope": "Integramos suministro, recursos, coordinación y ejecución. Definimos la necesidad, evaluamos condiciones, organizamos la logística y realizamos seguimiento. Nuestra experiencia incluye 200 toneladas de cloruro de sodio en maxisacos de 1.000 kg, mediante entregas parciales ajustadas a la capacidad de almacenamiento, sin agregar costos de bodegaje al cliente.",
    "quote": [
      "Material requerido y uso previsto.",
      "Cantidad, especificaciones y formato de entrega.",
      "Destino, accesos y capacidad de almacenamiento.",
      "Fechas requeridas y necesidad de entregas parciales."
    ],
    "questions": [
      {
        "question": "¿Qué materiales suministran?",
        "answer": "El dossier incluye sílice de cuarzo, arena, gravilla, estabilizado y cloruro de sodio. La disponibilidad, el formato y la logística se coordinan según el requerimiento."
      },
      {
        "question": "¿Pueden coordinar entregas parciales?",
        "answer": "Sí. Evaluamos la programación y la capacidad de recepción del proyecto para coordinar entregas. El dossier documenta un suministro de 200 toneladas de cloruro de sodio gestionado de esta forma."
      },
      {
        "question": "¿Qué información necesitan para cotizar áridos?",
        "answer": "Indica si necesitas arena, gravilla o estabilizado, las especificaciones del proyecto y la cantidad con su unidad de medida. Agrega ubicación, fechas, accesos y condiciones de descarga para evaluar suministro y transporte."
      },
      {
        "question": "¿El suministro de cloruro incluye su aplicación en caminos?",
        "answer": "La cotización de suministro define material, formato y entregas. Si también necesitas trabajos en caminos, indícalo para evaluar ese alcance por separado según las condiciones y requisitos técnicos del proyecto."
      }
    ],
    "projectCategories": [
      "Minerales"
    ]
  },
  {
    "serviceSlug": "monitoreo-de-tronaduras",
    "slug": "monitoreo-de-tronaduras",
    "title": "Monitoreo de tronaduras y vibraciones en Copiapó y Atacama",
    "searchTitle": "Monitoreo de tronaduras y vibraciones en Copiapó",
    "description": "Medición de vibraciones de tronaduras en Copiapó, Tierra Amarilla y Atacama: equipos, instalación, análisis e informes según el alcance acordado.",
    "intro": "Realizamos monitoreos de tronaduras de campo cercano y campo lejano, con equipos, instalación, análisis e informes técnicos para operaciones y proyectos mineros de Atacama.",
    "problem": "El seguimiento de las vibraciones de una tronadura requiere coordinar equipos, instalación y registros de medición según los objetivos y condiciones de la operación.",
    "scope": "Coordinación de equipos e instalación, monitoreo en terreno de campo cercano y campo lejano, análisis de las mediciones y elaboración de informes técnicos. Definimos los puntos de medición, el alcance y la programación con el cliente antes de ejecutar el trabajo.",
    "quote": [
      "Ubicación y objetivo del monitoreo.",
      "Programación y cantidad estimada de eventos.",
      "Puntos de medición y condiciones de acceso.",
      "Requisitos técnicos y formato de informe."
    ],
    "questions": [
      {
        "question": "¿Qué contempla el monitoreo?",
        "answer": "Monitoreos de campo cercano y campo lejano, con equipos, instalación, análisis e informes técnicos. El alcance se coordina según el requerimiento de la operación."
      },
      {
        "question": "¿Cómo se programa el trabajo?",
        "answer": "Indica la faena, las fechas, los eventos y los objetivos de medición para coordinar los recursos y las condiciones de ejecución."
      }
    ],
    "projectCategories": [
      "Monitoreo de tronaduras"
    ]
  }
];

export function servicePath(serviceSlug: string) {
  const detail = serviceDetails.find(s => s.serviceSlug === serviceSlug);
  return detail ? `/servicios/${detail.slug}` : "/servicios";
}
