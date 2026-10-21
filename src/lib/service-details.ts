export type ServiceDetail = {
  serviceSlug: string;
  slug: string;
  title: string;
  searchTitle: string;
  description: string;
  intro: string;
  problem: string;
  scope: string;
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
    "intro": "Ejecución y coordinación de trabajos de terreno para operaciones, proyectos y comunidades. Combinamos recursos, maquinaria y mano de obra local según alcance y programación.",
    "problem": "Una intervención en terreno necesita organizar equipos, materiales y logística para responder a las condiciones reales de la obra y a los plazos del requerimiento.",
    "scope": "Excavación, carguío, retiro, limpieza y preparación de terreno, junto con trabajos asociados a obras civiles según alcance. El brochure incluye excavadoras Doosan DX225 y DX210, cargador Doosan SD310 de 3 m³, además de transporte, izaje y traslado de maquinaria como apoyo operacional.",
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
    "title": "Suministro de materiales en Copiapó y Atacama",
    "searchTitle": "Cloruro de sodio y áridos en Copiapó y Atacama",
    "description": "Suministro de cloruro de sodio, áridos, estabilizado y sílice de cuarzo para Copiapó, Tierra Amarilla y Atacama. Consulta cantidades y entregas.",
    "intro": "Materiales e insumos para obras y operaciones: sílice de cuarzo, arena, gravilla, estabilizado y cloruro de sodio. Coordinamos disponibilidad, formato y logística según las condiciones del proyecto.",
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
