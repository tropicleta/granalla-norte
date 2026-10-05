import { ContentError, record } from "./content-model";
import { parseMachine, type Machine } from "./machinery-model";

export const monitoringTypes = ["Sistema de monitoreo", "Geófono triaxial", "Sismógrafo", "Otro"] as const;
export type MonitoringEquipment = Machine & { serial: string; sensorSerial: string; calibrationDate: string };
const equipment = (id: string, number: number, serial: string, sensorSerial: string, calibrationDate: string): MonitoringEquipment => ({
  id, name: `Sistema Instantel Minimate Plus · Equipo ${number}`, type: "Sistema de monitoreo", model: "Instantel Minimate Plus", capacity: "Sismógrafo de 8 canales + geófono triaxial", description: "Registro de vibraciones de tronaduras con sismógrafo digital y geófono triaxial. Identificación de instrumentos y antecedentes de calibración disponibles para revisión técnica del mandante. Consulta la configuración y disponibilidad para tu faena.", image: "", availability: "confirm", status: "published", demo: false, updatedAt: "", serial, sensorSerial, calibrationDate,
});
// Identificaciones y fechas de los certificados entregados; no implican vigencia actual.
export const initialMonitoringEquipment: MonitoringEquipment[] = [
  equipment("instantel-equipo-2", 2, "BE9663", "BG7054", "2024-07-05"),
  equipment("instantel-equipo-5", 5, "BE18008", "BG6467", "2024-08-12"),
  equipment("instantel-equipo-6", 6, "BE11567", "BG19914", "2024-08-03"),
  { ...equipment("geofono-triaxial", 0, "", "", ""), name: "Geófono triaxial Instantel", type: "Geófono triaxial", model: "Instantel", capacity: "Medición de vibraciones en tres ejes", description: "Sensor triaxial para registro de vibraciones de tronaduras. Consulta arriendo, compatibilidad con tu sismógrafo y disponibilidad del sensor o del sistema completo.", serial: "", sensorSerial: "", calibrationDate: "" },
  ...([4, 6] as const).map(channels => ({ ...equipment(`minimate-pro${channels}`, 0, "", "", ""), name: `Instantel Minimate Pro${channels}`, type: "Sismógrafo", model: `Instantel Minimate Pro${channels}`, capacity: `${channels} canales · Memoria de 64 MB · Protección IP67`, description: `Referencia técnica del fabricante: registro de vibración con geófono triaxial y sobrepresión con micrófono compatible, según configuración. ${channels === 6 ? "Admite dos geófonos triaxiales para medir en dos ubicaciones." : "Admite un geófono triaxial y un micrófono lineal."} Confirmar existencia en el catálogo y accesorios antes de publicar.`, image: `/img/monitoreo/minimate-pro${channels}.jpg`, status: "draft" as const, serial: "", sensorSerial: "", calibrationDate: "" })),
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
