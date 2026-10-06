import { ContentError, record } from "./content-model";
import { parseMachine, type Machine } from "./machinery-model";

export const monitoringTypes = ["Sistema de monitoreo", "Geófono triaxial", "Sismógrafo", "Otro"] as const;
export type MonitoringEquipment = Machine & { serial: string; sensorSerial: string; calibrationDate: string };
const base = { availability: "confirm" as const, status: "published" as const, demo: false, updatedAt: "", serial: "", sensorSerial: "", calibrationDate: "" };
export const initialMonitoringEquipment: MonitoringEquipment[] = [
  { ...base, id: "instantel-minimate-plus", name: "Instantel Minimate Plus", type: "Sismógrafo", model: "Instantel Minimate Plus", capacity: "Registro digital de vibraciones de tronaduras", description: "Contamos con equipos Instantel Minimate Plus para registrar vibraciones en faenas mineras y trabajos en terreno. Consulta la configuración y disponibilidad para las fechas de tu operación.", image: "/img/monitoreo/minimate-plus.png" },
  { ...base, id: "geofono-triaxial", name: "Geófono triaxial Instantel", type: "Geófono triaxial", model: "Instantel · Compatible con Minimate Plus", capacity: "Medición de vibraciones en tres ejes", description: "Contamos con geófonos triaxiales para nuestros sismógrafos Instantel Minimate Plus. Consulta el arriendo de sensores o del sistema completo según los puntos de medición de tu proyecto.", image: "/img/monitoreo/geofono-instantel-referencial.png" },
];
export function parseMonitoringEquipment(value: unknown): MonitoringEquipment {
  const input = record(value);
  const base = parseMachine(value, monitoringTypes);
  const field = (key: string, max: number) => {
    const value = input[key] ?? "";
    if (typeof value !== "string" || value.length > max) throw new ContentError("Revisa la identificación y los datos de calibración del equipo.", 422);
    return value.trim();
  };
  const calibrationDate = field("calibrationDate", 10);
  if (calibrationDate && (!/^\d{4}-\d{2}-\d{2}$/.test(calibrationDate) || Number.isNaN(Date.parse(calibrationDate)) || new Date(calibrationDate).toISOString().slice(0, 10) !== calibrationDate || calibrationDate > new Date().toISOString().slice(0, 10))) throw new ContentError("Indica una fecha de calibración válida, sin fechas futuras.", 422);
  return { ...base, serial: field("serial", 80), sensorSerial: field("sensorSerial", 80), calibrationDate };
}
