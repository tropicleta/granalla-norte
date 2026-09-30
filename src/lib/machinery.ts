import { cache } from "react";
import { ContentError } from "./content-model";
import { readJson, writeJson, storageConfigured } from "./content-storage";
import { demoMachines, type Machine } from "./machinery-model";

export async function machineryCatalog() {
  if (!storageConfigured()) return { machines: demoMachines, version: "initial", configured: false };
  const stored = await readJson<Machine[]>("machinery.json");
  return { machines: stored?.value ?? demoMachines, version: stored?.etag ?? "initial", configured: true };
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
