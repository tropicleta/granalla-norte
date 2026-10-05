export const defaultNewsCategories = ["Eventos", "Minerales", "Obras civiles", "Caminos", "Monitoreo de tronaduras"];
export const normalizeCategory = (value: string) => value.normalize("NFC").trim().replace(/\s+/g, " ");
export const categoryKey = (value: string) => normalizeCategory(value).toLocaleLowerCase("es-CL");

export function newsCategories(values: string[]) {
  const categories = new Map<string, string>();
  for (const value of [...defaultNewsCategories, ...values]) {
    const name = normalizeCategory(value);
    if (name && !categories.has(categoryKey(name))) categories.set(categoryKey(name), name);
  }
  return [...categories.values()];
}
