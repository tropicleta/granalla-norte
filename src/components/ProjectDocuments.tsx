"use client";
import { useRef, useState } from "react";
import type { publicClient } from "@/lib/portal";
import s from "./portal.module.css";
type Client = ReturnType<typeof publicClient>;
type Props = { client: Client; project: Client["projects"][number]; admin: boolean; busy: boolean; version: string; onEdit: () => void; onUpload: (form: FormData) => Promise<unknown>; onChange: (body: Record<string, unknown>) => Promise<unknown> };
const categories = ["Informes", "Contratos", "Certificados", "Planos", "Fotografías", "Otros"];
const bytes = (size: number) => size < 1024 * 1024 ? `${Math.max(1, Math.ceil(size / 1024))} KB` : `${(size / 1024 / 1024).toFixed(1)} MB`;
export default function ProjectDocuments({ client, project, admin, busy, version, onEdit, onUpload, onChange }: Props) {
  const [query, setQuery] = useState(""); const [category, setCategory] = useState("");
  const [uploadPart, setUploadPart] = useState(project.parts[0]?.id ?? "");
  const uploads = useRef(new Map<string, HTMLFormElement>());
  const downloading = useRef(false);
  const [downloadId, setDownloadId] = useState("");
  const [downloaded, setDownloaded] = useState<string[]>([]);
  const [downloadNotice, setDownloadNotice] = useState<{ text: string; error?: boolean } | null>(null);
  function openUpload() {
    const form = uploads.current.get(uploadPart) ?? uploads.current.values().next().value;
    if (!form) return;
    const part = form.closest("details");
    if (part) part.open = true;
    form.scrollIntoView({ block: "center" });
    form.querySelector<HTMLInputElement>('input[type="file"]')?.focus({ preventScroll: true });
  }
  async function download(doc: Client["projects"][number]["parts"][number]["documents"][number]) {
    if (downloading.current) return;
    downloading.current = true;
    setDownloadId(doc.id);
    setDownloadNotice({ text: `Preparando descarga: ${doc.filename}…` });
    try {
      const response = await fetch(`/api/mandantes/documentos?id=${encodeURIComponent(doc.id)}`, { cache: "no-store" });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || "No pudimos descargar el archivo. Vuelve a intentar.");
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url; link.download = doc.filename;
      document.body.appendChild(link); link.click(); link.remove();
      window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
      setDownloaded(current => current.includes(doc.id) ? current : [...current, doc.id]);
      setDownloadNotice({ text: `Descarga iniciada: ${doc.filename}. Revisa las descargas de tu navegador.` });
    } catch (error) {
      setDownloadNotice({ text: error instanceof Error ? error.message : "No pudimos descargar el archivo.", error: true });
    } finally { downloading.current = false; setDownloadId(""); }
  }
  const filtered = Boolean(query.trim() || category);
  return <article className={s.project}><div className={s.listHeading}><div><h2>{project.name}</h2><span className={s.badge}>{project.status}</span></div>{admin ? <button disabled={busy} onClick={onEdit}>Editar proyecto y partes</button> : null}</div>{project.description ? <p className={s.description}>{project.description}</p> : null}
    {admin ? <div className={s.uploadOptions}><label>Parte para cargar documentos<select value={uploadPart} onChange={event => setUploadPart(event.target.value)}>{project.parts.map(part => <option key={part.id} value={part.id}>{part.name}</option>)}</select></label><button className={s.primary} disabled={busy} onClick={openUpload}>Cargar documentos</button><p>Agrega PDF, Word, Excel, imágenes u otros archivos a la parte correspondiente del proyecto.</p></div> : null}
    <div className={s.columns}><label>Buscar documento<input type="search" placeholder="Nombre o archivo" value={query} onChange={e => setQuery(e.target.value)} /></label><label>Categoría<select value={category} onChange={e => setCategory(e.target.value)}><option value="">Todas las categorías</option>{categories.map(c => <option key={c}>{c}</option>)}</select></label></div>
    {downloadNotice ? <div className={`${s.downloadNotice} ${downloadNotice.error ? s.error : s.notice}`} role={downloadNotice.error ? "alert" : "status"}><span>{downloadNotice.text}</span><button type="button" aria-label="Cerrar aviso de descarga" onClick={() => setDownloadNotice(null)}>Cerrar</button></div> : null}
    <p className={s.hint}>Selecciona una parte para consultar su documentación.</p>
    {project.parts.map((part, index) => {
      const documents = part.documents.filter(d => (!category || d.category === category) && `${d.name} ${d.filename}`.toLocaleLowerCase("es").includes(query.trim().toLocaleLowerCase("es")));
      return <details key={part.id} className={s.part} open={filtered || project.parts.length === 1 || undefined}><summary><span className={s.partNumber}>{index + 1}</span><strong>{part.name}</strong><span>{filtered ? `${documents.length} de ${part.documents.length}` : part.documents.length} {part.documents.length === 1 ? "documento" : "documentos"}</span></summary><div className={s.partBody}>
        {documents.length ? <ul className={s.documents}>{documents.map(doc => <li key={doc.id}><div><a href={`/api/mandantes/documentos?id=${encodeURIComponent(doc.id)}`} aria-disabled={Boolean(downloadId)} onClick={event => { event.preventDefault(); void download(doc); }}>{doc.name}</a><small>{doc.category} · {doc.filename} · {bytes(doc.size)} · {new Date(doc.uploadedAt).toLocaleDateString("es-CL", { timeZone: "America/Santiago" })}</small></div><div className={s.actions}><button className={s.download} disabled={Boolean(downloadId)} aria-busy={downloadId === doc.id} onClick={() => void download(doc)}>{downloadId === doc.id ? "Descargando…" : downloaded.includes(doc.id) ? "Descargar de nuevo" : "Descargar"}</button>{admin ? <><button disabled={busy} onClick={async () => { const name = window.prompt("Nombre del documento", doc.name); if (name?.trim()) await onChange({ action: "renameDocument", clientId: client.id, projectId: project.id, partId: part.id, documentId: doc.id, name }); }}>Renombrar</button><button disabled={busy} onClick={async () => { if (window.confirm(`¿Enviar «${doc.name}» a la papelera? Podrás recuperarlo desde Respaldos.`)) await onChange({ action: "removeDocument", clientId: client.id, projectId: project.id, partId: part.id, documentId: doc.id }); }}>Retirar</button></> : null}</div>{admin ? <label className={s.documentCategory}>Categoría de {doc.name}<select disabled={busy} value={doc.category} onChange={e => void onChange({ action: "renameDocument", clientId: client.id, projectId: project.id, partId: part.id, documentId: doc.id, name: doc.name, category: e.target.value })}>{categories.map(c => <option key={c}>{c}</option>)}</select></label> : null}</li>)}</ul> : <p className={s.empty}>{filtered ? "No hay documentos que coincidan con esta búsqueda." : "Esta parte aún no tiene documentos."}</p>}
        {admin ? <form ref={node => { if (node) uploads.current.set(part.id, node); else uploads.current.delete(part.id); }} className={s.upload} onSubmit={async event => { event.preventDefault(); const form = event.currentTarget; const data = new FormData(form); data.set("clientId", client.id); data.set("projectId", project.id); data.set("partId", part.id); data.set("version", version); if (await onUpload(data)) form.reset(); }}><fieldset disabled={busy}><h3>Cargar documento en {part.name}</h3><div className={s.columns}><label>Archivo<input name="file" type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.csv,.txt,.png,.jpg,.jpeg,.zip" required /><small>Hasta 3 MB. PDF, Word, Excel, CSV, TXT, imágenes o ZIP.</small></label><label>Categoría<select name="category" defaultValue="Informes">{categories.map(c => <option key={c}>{c}</option>)}</select></label></div><label>Nombre del documento (opcional)<input name="name" maxLength={160} placeholder="Deja en blanco para usar el nombre del archivo" /></label><button className={s.primary}>{busy ? "Guardando…" : "Subir documento"}</button><small>Quedará disponible solo para {client.name}, en {project.name} / {part.name}.</small></fieldset></form> : null}
      </div></details>;
    })}
  </article>;
}
