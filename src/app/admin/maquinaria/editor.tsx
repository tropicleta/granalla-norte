"use client";
/* eslint-disable @next/next/no-img-element -- Uploaded images require the administrator's cookie while in draft. */
import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { machineryTypes, availabilityLabels, type Machine } from "@/lib/machinery-model";
import { MachineIllustration } from "@/components/MachineIllustration";
import styles from "../content.module.css";

const fresh = (): Machine => ({ id: crypto.randomUUID(), name: "", type: "Camión tolva", model: "", capacity: "", description: "", image: "", availability: "confirm", status: "draft", demo: false, updatedAt: "" });
async function responseJson(response: Response) {
  const data = await response.json();
  if (!response.ok) throw new Error(response.status === 401 ? "Tu sesión venció. Abre el acceso de administrador en otra pestaña y vuelve a intentar." : data.error || "No pudimos completar la operación.");
  return data;
}
export default function MachineryManager() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [version, setVersion] = useState("initial");
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [machine, setMachine] = useState<Machine | null>(null);
  const [creating, setCreating] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  async function load() {
    setLoading(true); setError("");
    try { const data = await responseJson(await fetch("/api/admin/maquinaria", { cache: "no-store" })); setMachines(data.machines); setVersion(data.version); setConfigured(data.configured); }
    catch (err) { setError((err as Error).message); } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function change(patch: Partial<Machine>) { setMachine(current => current ? { ...current, ...patch } : current); setDirty(true); setNotice(""); }
  function edit(value?: Machine) { setMachine(value ? structuredClone(value) : fresh()); setCreating(!value); setDirty(false); setError(""); setNotice(""); }
  function close() { if (dirty && !window.confirm("Tienes cambios sin guardar. ¿Quieres salir de la ficha?")) return; setMachine(null); setDirty(false); setError(""); }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!machine) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const data = await responseJson(await fetch("/api/admin/maquinaria", { method: creating ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ machine, version }) }));
      setMachines(current => creating ? [...current, data.machine] : current.map(m => m.id === data.machine.id ? data.machine : m));
      setMachine(data.machine); setVersion(data.version); setCreating(false); setDirty(false);
      setNotice(data.machine.status === "published" ? "Ficha publicada en el catálogo de maquinaria." : "Borrador guardado. No se muestra al público.");
    } catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  }
  async function upload(file?: File) {
    if (!file) return;
    setBusy(true); setError("");
    try {
      if (file.size > 3000000) throw new Error("Máximo 3 MB por imagen.");
      const form = new FormData(); form.set("file", file);
      const data = await responseJson(await fetch("/api/admin/imagenes", { method: "POST", body: form }));
      change({ image: data.url });
    } catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  }
  const visible = machines.filter(m => `${m.name} ${m.type} ${m.model}`.toLocaleLowerCase('es-CL').includes(query.toLocaleLowerCase('es-CL')));
  return <section className={styles.workspace}>
    <div className={styles.heading}><div><span className={styles.eyebrow}>Administración / Caminos</span><h1>{machine ? creating ? "Nuevo equipo" : "Editar equipo" : "Maquinaria para arriendo"}</h1><p>Actualiza el catálogo compartido y decide qué equipos se muestran en la página.</p></div>{machine ? <button className={styles.button} onClick={close} disabled={busy}>← Volver a la lista</button> : <button className={styles.primary} onClick={() => edit()} disabled={loading || !configured}>＋ Nuevo equipo</button>}</div>
    {error && <p role="alert" className={styles.error}>{error} {error.startsWith("Tu sesión venció.") && <a href="/admin/login" target="_blank" rel="noreferrer" className="underline">Acceso de administrador</a>}</p>}
    {notice && <p role="status" className={styles.notice}>{notice}</p>}
    {!loading && !configured && <p className={styles.error}>Falta conectar el almacenamiento para guardar cambios.</p>}
    {loading ? <p role="status">Cargando equipos…</p> : machine ? <form className={styles.form} onSubmit={save}><fieldset disabled={busy || !configured}>
      <label>Nombre del equipo *<input required minLength={3} maxLength={150} value={machine.name} onChange={e => change({ name: e.target.value })} placeholder="Ej.: Camión tolva — unidad 01" /></label>
      <div className={styles.grid}>
        <label>Tipo de equipo<select value={machine.type} onChange={e => change({ type: e.target.value })}>{machineryTypes.map(t => <option key={t}>{t}</option>)}</select></label>
        <label>Marca y modelo<input maxLength={150} value={machine.model} onChange={e => change({ model: e.target.value })} placeholder="Completar con información real" /></label>
      </div>
      <label>Capacidad / características<input maxLength={150} value={machine.capacity} onChange={e => change({ capacity: e.target.value })} placeholder="Ej.: capacidad de carga, volumen o peso operativo" /></label>
      <label>Descripción *<textarea required rows={5} minLength={10} maxLength={2000} value={machine.description} onChange={e => change({ description: e.target.value })} /><small>Incluye usos, condiciones de arriendo y características relevantes.</small></label>
      <label>Foto del equipo<input type="file" accept="image/jpeg,image/png,image/webp" onChange={e => { void upload(e.target.files?.[0]); e.target.value = ""; }} /><small>JPG, PNG o WebP; máximo 3 MB. Puedes añadir la foto real más adelante.</small></label>
      {machine.image ? <div className={`${styles.photo} mb-6`}><img src={machine.image} alt={machine.name || "Foto del equipo"} /><button type="button" onClick={() => change({ image: "" })}>Quitar foto</button></div> : <div className="mb-6 h-40 rounded-xl bg-olive-950 p-4"><MachineIllustration type={machine.type} /></div>}
      <label><input type="checkbox" checked={machine.demo} onChange={e => change({ demo: e.target.checked, ...(e.target.checked ? { availability: "confirm" } : {}) })} style={{ width: "auto", display: "inline-block", marginRight: "10px" }} />Equipo de ejemplo<small>Se identificará como ilustrativo y no anunciará disponibilidad real.</small></label>
      <div className={styles.grid}>
        <label>Disponibilidad<select value={machine.availability} disabled={machine.demo} onChange={e => change({ availability: e.target.value as Machine['availability'] })}>{Object.entries(availabilityLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label>Visibilidad<select value={machine.status} onChange={e => change({ status: e.target.value as Machine['status'] })}><option value="draft">Borrador — oculto al público</option><option value="published">Publicada — visible en el catálogo</option></select></label>
      </div>
      <div className={styles.actions}><button className={styles.primary} type="submit">{busy ? "Guardando…" : machine.status === "published" ? "Guardar y publicar" : "Guardar borrador"}</button><Link href="/maquinaria" target="_blank" className={styles.button}>Ver catálogo ↗</Link></div>
    </fieldset></form> : <>
      <div className={styles.toolbar}><input className={styles.input} aria-label="Buscar equipos" placeholder="Buscar por nombre, tipo o modelo…" value={query} onChange={e => setQuery(e.target.value)} /><button className={styles.button} onClick={() => void load()}>Actualizar</button><Link href="/maquinaria" target="_blank" className={styles.button}>Ver catálogo ↗</Link></div>
      <p className="mb-6 text-sm text-ink/65">Los ejemplos están listos para reemplazar sus datos y fotos. Guarda como borrador cualquier equipo que quieras ocultar.</p>
      <div className={styles.grid}>{visible.map(m => <article key={m.id} className={styles.card}><div className={styles.cardBody}><div className={styles.actions}><span className={`${styles.badge} ${m.status === 'draft' ? styles.draft : ''}`}>{m.status === 'published' ? 'Publicada' : 'Borrador'}</span>{m.demo && <span className={styles.badge}>Ejemplo</span>}</div><h2>{m.name}</h2><p className={styles.muted}>{m.model || m.type} · {availabilityLabels[m.availability]}</p><button className={`${styles.button} mt-5`} onClick={() => edit(m)}>Editar equipo</button></div></article>)}</div>
      {!visible.length && <p className={styles.empty}>No hay equipos que coincidan con tu búsqueda.</p>}
    </>}
  </section>;
}
