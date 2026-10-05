import { cache } from "react";
import { ContentError } from "./content-model";
import { readJson, writeJson, storageConfigured } from "./content-storage";
import { brochureMachines, type Machine } from "./machinery-model";

export async function machineryCatalog() {
  if (!storageConfigured()) return { machines: brochureMachines, version: "initial", configured: false };
  const stored = await readJson<Machine[]>("machinery.json");
  // Keep edited records (including drafts); replace the old example fleet and
  // add brochure equipment that has not yet been saved in the administrator.
  const savedMachines = (stored?.value ?? [])
    .filter(m => !m.demo && !["Retroexcavadora", "Camión cama baja"].includes(m.type)
      && !["retroexcavadoras", "camion-cama-baja"].includes(m.id))
    .map(m => {
      const brochure = brochureMachines.find(item => item.id === m.id);
      const oldCatalogPhoto = m.id === "tolva-jac-3262" && m.image === "/img/brochure/tolva.jpg";
      return brochure && (!m.image || oldCatalogPhoto) ? { ...m, image: brochure.image } : m;
    });
  const savedIds = new Set(savedMachines.map(m => m.id));
  const machines = [...savedMachines, ...brochureMachines.filter(m => !savedIds.has(m.id))];
  return { machines, version: stored?.etag ?? "initial", configured: true };
}
export const publishedMachines = cache(async () => (await machineryCatalog()).machines.filter(m => m.status === "published"));
export async function saveMachine(machine: Machine, version: string, create: boolean) {
  const current = await machineryCatalog();
  if (version !== current.version) throw new ContentError("Otra sesión guardó cambios. Actualiza la lista antes de guardar.", 409);
  const exists = current.machines.some(m => m.id === machine.id);
  if (create && exists) throw new ContentError("Ya existe ese equipo.", 409);
  if (!create && !exists) throw new ContentError("No encontramos el equipo.", 404);
  const machines = create ? [...current.machines, machine] : current.machines.map(m => m.id === machine.id ? machine : m);
  if (machines.length > 200) throw new ContentError("Máximo 200 equipos.", 422);
  return { machine, version: await writeJson("machinery.json", machines, version === "initial" ? undefined : version) };
}
