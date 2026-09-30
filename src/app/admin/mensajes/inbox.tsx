"use client";
import { useEffect, useState } from "react";
import type { InboxMessage } from "@/lib/content-model";
import styles from "../content.module.css";

type Message = InboxMessage & { version: string };
const labels = { new: "Nuevo", read: "Leído", archived: "Archivado" };
export default function Inbox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [cursor, setCursor] = useState<string>();
  const [loading, setLoading] = useState(true); const [busy, setBusy] = useState("");
  const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const [query, setQuery] = useState(""); const [filter, setFilter] = useState("active");
  async function load(next?: string) {
    setLoading(true); setError("");
    try {
      const response = await fetch(`/api/admin/mensajes${next ? `?cursor=${encodeURIComponent(next)}` : ""}`, { cache: "no-store" });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setMessages(current => next ? Array.from(new Map([...current, ...data.messages].map(m => [m.id, m])).values()) : data.messages);
      setCursor(data.cursor);
    } catch (err) { setError((err as Error).message); } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  async function update(message: Message, status: InboxMessage["status"]) {
    setBusy(message.id); setError(""); setNotice("");
    try {
      const response = await fetch("/api/admin/mensajes", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: message.id, version: message.version, status }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error);
      setMessages(current => current.map(m => m.id === message.id ? { ...data.message, version: data.version } : m)); setNotice(`Mensaje marcado como ${labels[status].toLowerCase()}.`);
    } catch (err) { setError((err as Error).message); } finally { setBusy(""); }
  }
  const visible = messages.filter(m => (filter === "all" || filter === m.status || filter === "active" && m.status !== "archived") && `${m.nombre} ${m.email} ${m.empresa} ${m.mensaje}`.toLowerCase().includes(query.toLowerCase()));
  return <section className={styles.workspace}>
    <div className={styles.heading}><div><span className={styles.eyebrow}>Administración / Contacto</span><h1>Mensajes recibidos</h1><p>Solicitudes enviadas desde el formulario de la página.</p></div><button className={styles.button} disabled={loading || Boolean(busy)} onClick={() => void load()}>Actualizar bandeja</button></div>
    <p className={styles.notice}>Aquí aparecerán los mensajes del formulario desde su activación. Los correos anteriores y los enviados directamente a tu dirección de correo se consultan en tu correo habitual.</p>
    {error && <p role="alert" className={styles.error}>{error}</p>}{notice && <p role="status" className={styles.notice}>{notice}</p>}
    <div className={styles.toolbar}><input className={styles.input} aria-label="Buscar mensajes" placeholder="Buscar por nombre, correo, empresa o mensaje…" value={query} onChange={e => setQuery(e.target.value)} /><select className={styles.button} aria-label="Filtrar mensajes" value={filter} onChange={e => setFilter(e.target.value)}><option value="active">Bandeja de entrada</option><option value="new">Nuevos</option><option value="read">Leídos</option><option value="archived">Archivados</option><option value="all">Todos</option></select></div>
    <div className={styles.messages}>{visible.map(m => <article key={m.id} className={`${styles.message} ${m.status === "new" ? styles.unread : ""}`}>
      <details><summary><span className={styles.badge}>{labels[m.status]}</span><h2 className="mt-3 inline-block ml-3">{m.nombre}</h2><p className={styles.muted}>{m.servicio || "Consulta general"} · {new Date(m.createdAt).toLocaleString("es-CL", { timeZone: "America/Santiago" })}</p></summary>
        <dl className={styles.details}><dt>Correo</dt><dd>{m.email}</dd><dt>Empresa</dt><dd>{m.empresa || "No indicada"}</dd><dt>Teléfono</dt><dd>{m.telefono || "No indicado"}</dd><dt>Servicio</dt><dd>{m.servicio || "No indicado"}</dd></dl>
        <p className={styles.body}>{m.mensaje}</p>
        <div className={styles.actions}><a className={styles.primary} href={`mailto:${m.email}?subject=${encodeURIComponent(`Respuesta a tu consulta — ${m.servicio || "Granalla Norte"}`)}`}>Responder por correo ↗</a>
          {m.status !== "read" && <button className={styles.button} disabled={Boolean(busy)} onClick={() => void update(m, "read")}>Marcar leído</button>}
          {m.status !== "new" && <button className={styles.button} disabled={Boolean(busy)} onClick={() => void update(m, "new")}>Marcar nuevo</button>}
          {m.status !== "archived" && <button className={styles.button} disabled={Boolean(busy)} onClick={() => void update(m, "archived")}>Archivar</button>}
        </div><p className={`${styles.muted} mt-3`}>Responder abre tu aplicación de correo; no envía un mensaje automáticamente.</p>
      </details>
    </article>)}</div>
    {loading && <p role="status" className="mt-6">Cargando mensajes…</p>}
    {!loading && !error && !visible.length && <p className={styles.empty}>{messages.length ? "No hay coincidencias entre los mensajes cargados." : "Todavía no hay mensajes. Las nuevas consultas aparecerán aquí."}</p>}
    {cursor && <div className="mt-6"><p className={styles.muted}>La búsqueda y los filtros se aplican a los mensajes cargados.</p><button className={styles.button} disabled={loading} onClick={() => void load(cursor)}>Cargar más mensajes</button></div>}
  </section>;
}
