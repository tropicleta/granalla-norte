import { ContentError, record, validImage } from "./content-model";

export const machineryTypes = ["Camión tolva", "Camión aljibe", "Motoniveladora", "Rodillo compactador", "Excavadora", "Retroexcavadora", "Otro"] as const;
export type Machine = {
  id: string; name: string; type: string; model: string; capacity: string;
  description: string; image: string; availability: "confirm" | "available" | "maintenance";
  status: "draft" | "published"; demo: boolean; updatedAt: string;
};
export const availabilityLabels = { confirm: "Disponibilidad por confirmar", available: "Disponible para consulta", maintenance: "En mantención" };
export const demoMachines: Machine[] = [
  { id: "ejemplo-tolva", name: "Camión tolva", type: "Camión tolva", model: "", capacity: "", description: "Ejemplo de equipo para traslado de áridos y material de relleno en trabajos de caminos.", image: "", availability: "confirm", status: "published", demo: true, updatedAt: "" },
  { id: "ejemplo-aljibe", name: "Camión aljibe", type: "Camión aljibe", model: "", capacity: "", description: "Ejemplo de equipo para riego de superficies y apoyo al control de polvo en caminos.", image: "", availability: "confirm", status: "published", demo: true, updatedAt: "" },
  { id: "ejemplo-motoniveladora", name: "Motoniveladora", type: "Motoniveladora", model: "", capacity: "", description: "Ejemplo de maquinaria para perfilado y nivelación de caminos y accesos.", image: "", availability: "confirm", status: "published", demo: true, updatedAt: "" },
  { id: "ejemplo-rodillo", name: "Rodillo compactador", type: "Rodillo compactador", model: "", capacity: "", description: "Ejemplo de maquinaria para compactación de superficies y capas de estabilizado.", image: "", availability: "confirm", status: "published", demo: true, updatedAt: "" },
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
