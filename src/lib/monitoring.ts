import { cache } from "react";
import { ContentError } from "./content-model";
import { readJson, writeJson, storageConfigured } from "./content-storage";
import { initialMonitoringEquipment, type MonitoringEquipment } from "./monitoring-model";

export async function monitoringCatalog() {
  if (!storageConfigured()) return { machines: initialMonitoringEquipment, version: "initial", configured: false };
  const stored = await readJson<MonitoringEquipment[]>("monitoring-equipment.json");
  return { machines: stored?.value ?? initialMonitoringEquipment, version: stored?.etag ?? "initial", configured: true };
}
export const publishedMonitoringEquipment = cache(async () => (await monitoringCatalog()).machines.filter(m => m.status === "published"));
export async function saveMonitoringEquipment(machine: MonitoringEquipment, version: string, create: boolean) {
  const current = await monitoringCatalog();
  if (version !== current.version) throw new ContentError("Otra sesión guardó cambios. Actualiza la lista antes de guardar.", 409);
  const exists = current.machines.some(m => m.id === machine.id);
  if (create && exists) throw new ContentError("Ya existe ese equipo.", 409);
  if (!create && !exists) throw new ContentError("No encontramos el equipo.", 404);
  const machines = create ? [...current.machines, machine] : current.machines.map(m => m.id === machine.id ? machine : m);
  if (machines.length > 200) throw new ContentError("Máximo 200 equipos.", 422);
  return { machine, version: await writeJson("monitoring-equipment.json", machines, version === "initial" ? undefined : version) };
}
