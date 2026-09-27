"use client";

import { useEffect, useState, type FormEvent } from "react";
import styles from "./panel.module.css";

type Module = "Inventario" | "Finanzas" | "Obras" | "Maquinaria";
type Row = { id: string; [key: string]: string };
type Data = Record<Module, Row[]>;
type Field = { key: string; label: string; type?: string; options?: string[] };
const fields: Record<Module, Field[]> = {
  Inventario: [{key:"name",label:"Artículo"},{key:"category",label:"Categoría",options:["Materiales","Herramientas","Minerales","Insumos"]},{key:"quantity",label:"Cantidad",type:"number"},{key:"unit",label:"Unidad"},{key:"minimum",label:"Stock mínimo",type:"number"},{key:"location",label:"Ubicación"},{key:"responsible",label:"Responsable"}],
  Finanzas: [{key:"name",label:"Concepto"},{key:"type",label:"Tipo",options:["Ingreso","Egreso"]},{key:"amount",label:"Monto CLP",type:"number"},{key:"category",label:"Categoría"},{key:"project",label:"Obra"},{key:"date",label:"Fecha",type:"date"},{key:"status",label:"Estado",options:["Pendiente","Pagado"]}],
  Obras: [{key:"name",label:"Obra"},{key:"client",label:"Cliente"},{key:"location",label:"Ubicación"},{key:"status",label:"Estado",options:["Planificación","En ejecución","Finalizada"]}],
  Maquinaria: [{key:"name",label:"Equipo"},{key:"location",label:"Ubicación"},{key:"hours",label:"Horómetro (h)",type:"number"},{key:"status",label:"Estado",options:["Disponible","En operación","En mantenimiento"]}],
};
const modules = Object.keys(fields) as Module[];
const storageKey = "granalla-norte-admin-demo-v1";
const initial: Data = {
  Inventario: [
    {id:"i1",name:"Arena gruesa",category:"Minerales",quantity:"120",unit:"m³",minimum:"30",location:"Acopio principal",responsible:"Bodega"},
    {id:"i2",name:"Sacos de cemento",category:"Materiales",quantity:"12",unit:"sacos",minimum:"20",location:"Bodega central",responsible:"Bodega"},
    {id:"i3",name:"Rotomartillo",category:"Herramientas",quantity:"1",unit:"unidad",minimum:"0",location:"Obra de ejemplo",responsible:"Encargado de obra"},
  ],
  Finanzas: [
    {id:"f1",name:"Anticipo de obra",type:"Ingreso",amount:"8500000",category:"Obras civiles",project:"Obra de ejemplo",date:"2026-09-21",status:"Pagado"},
    {id:"f2",name:"Venta de arena",type:"Ingreso",amount:"2400000",category:"Minerales",project:"General",date:"2026-09-23",status:"Pagado"},
    {id:"f3",name:"Combustible",type:"Egreso",amount:"1650000",category:"Combustible",project:"Obra de ejemplo",date:"2026-09-24",status:"Pagado"},
    {id:"f4",name:"Mantención de equipo",type:"Egreso",amount:"480000",category:"Mantenimiento",project:"General",date:"2026-09-26",status:"Pendiente"},
  ],
  Obras: [{id:"o1",name:"Obra de ejemplo",client:"Cliente de demostración",location:"Tierra Amarilla",status:"En ejecución"}],
  Maquinaria: [{id:"m1",name:"Excavadora",location:"Obra de ejemplo",hours:"2450",status:"En operación"},{id:"m2",name:"Retroexcavadora",location:"Taller",hours:"1820",status:"En mantenimiento"}],
};
const money = (value: number) => new Intl.NumberFormat("es-CL", {style:"currency",currency:"CLP",maximumFractionDigits:0}).format(value);
function validData(value: unknown): value is Data {
  if (!value || typeof value !== "object") return false;
  return modules.every(module => {
    const rows = (value as Data)[module];
    return Array.isArray(rows) && rows.every(row => row && typeof row.id === "string" && fields[module].every(field => typeof row[field.key] === "string" && (field.type !== "number" || (Number.isFinite(Number(row[field.key])) && Number(row[field.key]) >= 0))));
  });
}

export default function AdminPanel() {
  const [data, setData] = useState<Data>(initial);
  const [section, setSection] = useState<Module | "Resumen">("Resumen");
  const [ready, setReady] = useState(false);
  const [notice, setNotice] = useState("");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Row | null>(null);
  const [showForm, setShowForm] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (!validData(parsed)) throw new Error("Invalid data");
        setData(parsed);
      }
    } catch { setNotice("No se pudieron recuperar los registros guardados. Se muestran los ejemplos; la copia anterior no se ha modificado."); }
    setReady(true);
  }, []);

  function update(next: Data) {
    setData(next);
    try { localStorage.setItem(storageKey, JSON.stringify(next)); setNotice("Cambios guardados en este navegador."); }
    catch { setNotice("No se pudo guardar en este navegador. Exporta una copia antes de cerrar."); }
  }
  function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (section === "Resumen") return;
    const form = new FormData(event.currentTarget);
    const row: Row = {id: editing?.id ?? crypto.randomUUID()};
    for (const field of fields[section]) {
      row[field.key] = String(form.get(field.key) ?? "").trim();
      if (!row[field.key] || (field.type === "number" && (!Number.isFinite(Number(row[field.key])) || Number(row[field.key]) < 0))) {
        setNotice("Completa todos los campos con valores válidos."); return;
      }
    }
    update({...data,[section]:editing ? data[section].map(item => item.id === editing.id ? row : item) : [...data[section],row]});
    setShowForm(false); setEditing(null);
  }
  function exportData() {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"}));
    const link = document.createElement("a"); link.href = url; link.download = "granalla-norte-modelo.json"; link.click();
    setTimeout(() => URL.revokeObjectURL(url),1000);
  }
  const sum = (type: string, status: string) => data.Finanzas.filter(row => row.type === type && row.status === status).reduce((total,row) => total + Number(row.amount),0);
  const income = sum("Ingreso","Pagado"), expense = sum("Egreso","Pagado");
  const low = data.Inventario.filter(row => Number(row.quantity) < Number(row.minimum));
  const rows = section === "Resumen" ? [] : data[section].filter(row => Object.values(row).some(value => value.toLocaleLowerCase().includes(query.toLocaleLowerCase())));

  return <div className={styles.shell}>
    <aside className={styles.sidebar}>
      <p className={styles.eyebrow}>GRANALLA NORTE</p><h1>Administración</h1><p className={styles.muted}>Control y operación</p>
      <nav aria-label="Módulos de administración">{(["Resumen",...modules] as const).map(name => <button key={name} aria-current={section === name ? "page" : undefined} onClick={() => {setSection(name);setQuery("");setShowForm(false);setEditing(null);}}>{name}<span aria-hidden>→</span></button>)}</nav>
      <p className={styles.sidebarNote}>Obras civiles<br/>Minerales no metálicos<br/>Movimiento de tierra</p>
    </aside>
    <div className={styles.content}>
      <div className={styles.banner}><div><strong>Modelo de demostración</strong><p>Datos de ejemplo · Guardado solo en este navegador · Acceso de administrador.</p></div><button disabled={!ready} onClick={exportData}>Exportar copia ↓</button></div>
      <div className={styles.heading}><div><p className={styles.eyebrow}>ESPACIO DE TRABAJO</p><h2>{section === "Resumen" ? "Una mirada a tu empresa" : section}</h2><p>Organiza tus recursos y sigue los movimientos de tu operación.</p></div>{section !== "Resumen" && <button className={styles.primary} disabled={!ready} onClick={() => {setEditing(null);setShowForm(true);}}>＋ Nuevo registro</button>}</div>
      {notice && <p className={styles.notice} role="status">{notice}</p>}
      {!ready ? <p role="status">Cargando registros…</p> : <>
      {(section === "Resumen" || section === "Finanzas") && <div className={styles.stats}>{[["Ingresos cobrados",income],["Egresos pagados",expense],["Flujo neto",income-expense],["Por pagar",sum("Egreso","Pendiente")],["Por cobrar",sum("Ingreso","Pendiente")]].map(([label,value]) => <article key={label}><p>{label}</p><strong>{money(Number(value))}</strong><small>{label === "Flujo neto" ? "Ingresos menos egresos; no es utilidad" : "Total de registros"}</small></article>)}</div>}
      {section === "Resumen" ? <div className={styles.overview}>
        <section className={styles.card}><h3>Distribución de gastos</h3><p className={styles.muted}>Solo egresos pagados</p>{Array.from(new Set(data.Finanzas.filter(row=>row.type === "Egreso" && row.status === "Pagado").map(row=>row.category))).map(category => {const amount = data.Finanzas.filter(row=>row.type === "Egreso" && row.status === "Pagado" && row.category === category).reduce((total,row)=>total+Number(row.amount),0); return <div className={styles.bar} key={category}><div><span>{category}</span><strong>{money(amount)}</strong></div><progress aria-label={category} value={amount} max={expense || 1}/></div>;})}{!expense && <p>Aún no hay egresos pagados.</p>}</section>
        <section className={styles.card}><h3>Alertas de inventario</h3>{low.length ? low.map(row=><p className={styles.alert} key={row.id}><strong>{row.name}</strong><br/>{row.quantity} {row.unit} disponibles · mínimo {row.minimum}</p>) : <p>Sin artículos bajo el stock mínimo.</p>}<p className={styles.muted}>{data.Obras.length} obras · {data.Maquinaria.length} equipos registrados</p></section>
      </div> : <>
        {showForm && <section className={styles.card}><h3>{editing ? "Editar registro" : "Nuevo registro"}</h3><form key={`${section}-${editing?.id ?? "new"}`} onSubmit={save} className={styles.form}>{fields[section].map(field => <label key={field.key}>{field.label}{field.options ? <select name={field.key} defaultValue={editing?.[field.key] ?? field.options[0]}>{field.options.map(option=><option key={option}>{option}</option>)}</select> : <input autoFocus={field.key === "name"} name={field.key} type={field.type ?? "text"} required min={field.type === "number" ? 0 : undefined} step={field.type === "number" ? "any" : undefined} defaultValue={editing?.[field.key] ?? ""} list={field.key === "project" ? "admin-projects" : undefined}/>}</label>)}<datalist id="admin-projects"><option value="General"/>{data.Obras.map(row=><option key={row.id} value={row.name}/>)}</datalist><div className={styles.actions}><button type="submit" className={styles.primary}>Guardar registro</button><button type="button" onClick={()=>{setShowForm(false);setEditing(null);}}>Cancelar</button></div></form></section>}
        <section className={styles.card}><div className={styles.toolbar}><h3>{rows.length} registros</h3><input aria-label="Buscar registros" placeholder="Buscar en este módulo…" value={query} onChange={event=>setQuery(event.target.value)}/></div><div className={styles.tableWrap}><table><thead><tr>{fields[section].map(field=><th key={field.key} scope="col">{field.label}</th>)}<th scope="col">Acciones</th></tr></thead><tbody>{rows.map(row=><tr key={row.id}>{fields[section].map(field=><td key={field.key}>{field.key === "amount" ? money(Number(row[field.key])) : row[field.key]}{field.key === "quantity" && Number(row.quantity) < Number(row.minimum) && <small className={styles.low}>Stock bajo</small>}</td>)}<td><button onClick={()=>{setEditing(row);setShowForm(true);}}>Editar</button>{section === "Finanzas" && row.status === "Pendiente" && <button onClick={()=>update({...data,Finanzas:data.Finanzas.map(item=>item.id === row.id ? {...item,status:"Pagado"} : item)})}>Marcar pagado</button>}</td></tr>)}</tbody></table>{!rows.length && <p className={styles.empty}>No hay registros para mostrar.</p>}</div></section>
      </>}
      </>}
      <p className={styles.footnote}>Modelo inicial. Los registros se guardan en este navegador y no se comparten entre dispositivos. La base de datos compartida queda pendiente.</p>
    </div>
  </div>;
}
