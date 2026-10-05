import { ContentError, record, validImage } from "./content-model";

export const machineryTypes = ["Camión tolva", "Camión aljibe", "Motoniveladora", "Rodillo compactador", "Excavadora", "Cargador frontal", "Camión pluma", "Otro"] as const;
export type Machine = {
  id: string; name: string; type: string; model: string; capacity: string;
  description: string; image: string; availability: "confirm" | "available" | "maintenance";
  status: "draft" | "published"; demo: boolean; updatedAt: string;
};
export const availabilityLabels = { confirm: "Disponibilidad por confirmar", available: "Disponible para consulta", maintenance: "En mantención" };
// Catálogo documentado en BROCHURE MAQUINARIA.pdf. La asignación se confirma por proyecto.
export const brochureMachines: Machine[] = [
  {
    "id": "motoniveladora-rg200b",
    "name": "Motoniveladora RG200B",
    "type": "Motoniveladora",
    "model": "RG200B",
    "capacity": "Año 2021",
    "description": "Perfilado, nivelación y conformación de caminos.",
    "image": "/img/motoniveladora-rg200b-referencial.jpg",
    "availability": "confirm",
    "status": "published",
    "demo": false,
    "updatedAt": ""
  },
  {
    "id": "rodillo-new-holland-v110",
    "name": "Rodillo New Holland V110",
    "type": "Rodillo compactador",
    "model": "New Holland V110",
    "capacity": "Año 2024",
    "description": "Compactación y terminación de superficies.",
    "image": "/img/brochure/rodillo.jpg",
    "availability": "confirm",
    "status": "published",
    "demo": false,
    "updatedAt": ""
  },
  {
    "id": "excavadora-doosan-dx225",
    "name": "Excavadora Doosan DX225",
    "type": "Excavadora",
    "model": "Doosan DX225",
    "capacity": "Año 2024",
    "description": "Excavación y movimiento de tierra.",
    "image": "/img/brochure/excavadoras.jpg",
    "availability": "confirm",
    "status": "published",
    "demo": false,
    "updatedAt": ""
  },
  {
    "id": "excavadora-doosan-dx210",
    "name": "Excavadora Doosan DX210",
    "type": "Excavadora",
    "model": "Doosan DX210",
    "capacity": "Año 2026",
    "description": "Excavación y apoyo en frentes que requieren mayor movilidad de desplazamiento.",
    "image": "/img/excavadora-dx210-referencial.jpg",
    "availability": "confirm",
    "status": "published",
    "demo": false,
    "updatedAt": ""
  },
  {
    "id": "cargador-doosan-sd310",
    "name": "Cargador Doosan SD310",
    "type": "Cargador frontal",
    "model": "Doosan SD310",
    "capacity": "3 m³ · Año 2024",
    "description": "Carga, acopio y distribución de material.",
    "image": "/img/brochure/cargador.jpg",
    "availability": "confirm",
    "status": "published",
    "demo": false,
    "updatedAt": ""
  },
  {
    "id": "aljibe-jac-3311",
    "name": "Camión aljibe JAC 3311",
    "type": "Camión aljibe",
    "model": "JAC 3311",
    "capacity": "15 m³ · Año 2019",
    "description": "Humectación, apoyo al control de polvo y abastecimiento de agua en terreno.",
    "image": "/img/aljibe-jac-referencial.jpg",
    "availability": "confirm",
    "status": "published",
    "demo": false,
    "updatedAt": ""
  },
  {
    "id": "aljibe-iveco-trakker",
    "name": "Camión aljibe Iveco Trakker",
    "type": "Camión aljibe",
    "model": "Iveco Trakker",
    "capacity": "30 m³ · Año 2018",
    "description": "Abastecimiento de agua para frentes de trabajo y humectación de caminos.",
    "image": "/img/brochure/aljibe.jpg",
    "availability": "confirm",
    "status": "published",
    "demo": false,
    "updatedAt": ""
  },
  {
    "id": "tolva-jac-3262",
    "name": "Camión tolva JAC 3262",
    "type": "Camión tolva",
    "model": "JAC 3262",
    "capacity": "15 m³ · Año 2022",
    "description": "Transporte y descarga de material.",
    "image": "/img/tolva-jac-3262-referencial.jpg",
    "availability": "confirm",
    "status": "published",
    "demo": false,
    "updatedAt": ""
  },
  {
    "id": "camion-pluma",
    "name": "Camión pluma",
    "type": "Camión pluma",
    "model": "",
    "capacity": "8 t · Año 2026",
    "description": "Izaje y apoyo en maniobras en terreno.",
    "image": "/img/brochure/pluma.jpg",
    "availability": "confirm",
    "status": "published",
    "demo": false,
    "updatedAt": ""
  }
];
export function parseMachine(value: unknown): Machine {
  const input = record(value);
  const labels: Record<string, string> = { id: "identificador", name: "nombre", model: "marca y modelo", capacity: "capacidad", description: "descripción", image: "imagen", type: "tipo de equipo" };
  const field = (key: string, max: number, min = 0) => {
    if (typeof input[key] !== "string" || (input[key] as string).trim().length < min || (input[key] as string).length > max) throw new ContentError(`Revisa ${labels[key] || key} (entre ${min} y ${max} caracteres).`, 422);
    return (input[key] as string).trim();
  };
  const id = field("id", 100, 3);
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id)) throw new ContentError("Identificador de equipo inválido.", 422);
  const type = field("type", 60, 1);
  if (!machineryTypes.some(t => t === type)) throw new ContentError("Selecciona un tipo de equipo válido.", 422);
  const image = field("image", 200);
  if (image && !validImage(image)) throw new ContentError("Selecciona una imagen válida.", 422);
  if (input.status !== "published" && input.status !== "draft") throw new ContentError("Visibilidad inválida.", 422);
  if (!Object.hasOwn(availabilityLabels, String(input.availability))) throw new ContentError("Disponibilidad inválida.", 422);
  if (typeof input.demo !== "boolean") throw new ContentError("Indica si es un equipo de ejemplo.", 422);
  return { id, type, name: field("name", 150, 3), model: field("model", 150), capacity: field("capacity", 150), description: field("description", 2000, 10), image, availability: input.demo ? "confirm" : input.availability as Machine["availability"], status: input.status, demo: input.demo, updatedAt: new Date().toISOString() };
}
