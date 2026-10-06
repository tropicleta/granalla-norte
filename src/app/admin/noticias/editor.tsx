"use client";

/* eslint-disable @next/next/no-img-element -- Private draft images require the browser's session cookie. */
import { useEffect, useState, type FormEvent } from "react";
import type { Article } from "@/lib/content-model";
import { formatDate } from "@/lib/site";
import { categoryKey, newsCategories, normalizeCategory } from "@/lib/news-categories";
import styles from "../content.module.css";

const fresh = (): Article => ({ slug: "", title: "", date: new Date().toLocaleDateString("en-CA", { timeZone: "America/Santiago" }), location: "", client: "", category: "Eventos", image: "", images: [], excerpt: "", body: [""], highlights: [], status: "draft", updatedAt: "" });
const slugify = (title: string) => title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 100);
async function responseJson(response: Response) {
  const data = await response.json();
  if (!response.ok) throw new Error(response.status === 401 ? "Tu sesión venció. Abre el acceso de administrador en otra pestaña y vuelve a intentar." : data.error || "No se pudo completar la operación.");
  return data;
}
export default function NewsManager() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [version, setVersion] = useState("initial");
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(""); const [notice, setNotice] = useState("");
  const [query, setQuery] = useState(""); const [filter, setFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [addingCategory, setAddingCategory] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [categoryError, setCategoryError] = useState("");
  const [sessionCategories, setSessionCategories] = useState<string[]>([]);
  const [article, setArticle] = useState<Article | null>(null);
  const [creating, setCreating] = useState(false); const [dirty, setDirty] = useState(false); const [preview, setPreview] = useState(false);
  async function load() {
    setLoading(true); setError("");
    try { const data = await responseJson(await fetch("/api/admin/noticias", { cache: "no-store" })); setArticles(data.articles); setVersion(data.version); setConfigured(data.configured); }
    catch (err) { setError((err as Error).message); } finally { setLoading(false); }
  }
  useEffect(() => { void load(); }, []);
  useEffect(() => {
    const warn = (event: BeforeUnloadEvent) => { if (dirty) { event.preventDefault(); event.returnValue = ""; } };
    window.addEventListener("beforeunload", warn); return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);
  function change(patch: Partial<Article>) { setArticle(current => current ? { ...current, ...patch } : current); setDirty(true); setNotice(""); }
  function edit(value?: Article) { setArticle(value ? structuredClone(value) : fresh()); setCreating(!value); setPreview(false); setError(""); setNotice(""); setDirty(false); setAddingCategory(false); setCategoryName(""); setCategoryError(""); }
  const categories = newsCategories([...articles.map(p => p.category), ...sessionCategories, ...(article ? [article.category] : [])]);
  function addCategory() {
    const name = normalizeCategory(categoryName);
    if (name.length < 2 || name.length > 60) { setCategoryError("Escribe un nombre de entre 2 y 60 caracteres."); return; }
    const existing = categories.find(c => categoryKey(c) === categoryKey(name));
    if (!existing) setSessionCategories(current => [...current, name]);
    change({ category: existing || name }); setAddingCategory(false); setCategoryName(""); setCategoryError("");
  }
  function close() { if (dirty && !window.confirm("Tienes cambios sin guardar. ¿Quieres salir del editor?")) return; setArticle(null); setDirty(false); setError(""); }
  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (!article) return;
    setBusy(true); setError(""); setNotice("");
    try {
      const data = await responseJson(await fetch("/api/admin/noticias", { method: creating ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ article, version }) }));
      setArticles(current => creating ? [...current, data.article] : current.map(p => p.slug === data.article.slug ? data.article : p));
      setVersion(data.version); setArticle(data.article); setCreating(false); setDirty(false);
      setNotice(data.article.status === "published" ? "Noticia publicada. Ya está disponible en la página." : "Borrador guardado. Solo puedes verlo desde Administración.");
    } catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  }
  async function upload(files: FileList | null) {
    if (!files || !article) return;
    if (article.images.length + files.length > 12) { setError("Puedes agregar hasta 12 imágenes por noticia."); return; }
    setBusy(true); setError("");
    try {
      for (const file of Array.from(files)) {
        if (file.size > 3000000) throw new Error(`${file.name}: máximo 3 MB por imagen.`);
        const form = new FormData(); form.set("file", file);
        const data = await responseJson(await fetch("/api/admin/imagenes", { method: "POST", body: form }));
        setArticle(current => current ? { ...current, images: [...current.images, data.url] } : current); setDirty(true);
      }
    } catch (err) { setError((err as Error).message); } finally { setBusy(false); }
  }
  const sorted = [...articles].sort((a, b) => b.date.localeCompare(a.date)).filter(p => (filter === "all" || p.status === filter) && (!categoryFilter || categoryKey(p.category) === categoryKey(categoryFilter)) && `${p.title} ${p.category}`.toLowerCase().includes(query.toLowerCase()));
  return <section className={styles.workspace}>
    <div className={styles.heading}><div><span className={styles.eyebrow}>Administración / Contenido</span><h1>{article ? creating ? "Nueva noticia" : "Editar noticia" : "Noticias y proyectos"}</h1><p>{article ? "Completa la información y elige cuándo publicarla." : "Publica novedades y mantén al día los proyectos de Granalla Norte."}</p></div>
      {article ? <button className={styles.button} onClick={close} disabled={busy}>← Volver a la lista</button> : <button className={styles.primary} onClick={() => edit()} disabled={loading || !configured}>＋ Nueva noticia</button>}
    </div>
    {error && <div role="alert" className={styles.error}>{error} {error.startsWith("Tu sesión venció.") && <a href="/admin/login" target="_blank" rel="noreferrer" className="underline">Acceso de administrador</a>}</div>}
    {notice && <p role="status" className={styles.notice}>{notice}</p>}
    {!loading && !configured && <p className={styles.error}>El editor está preparado, pero falta conectar el almacenamiento compartido. Las noticias actuales siguen visibles.</p>}
    {loading ? <p role="status">Cargando noticias…</p> : article ? <form className={styles.form} onSubmit={save}>
      <fieldset disabled={busy || !configured}>
        <label>Título *<input required minLength={3} maxLength={200} value={article.title} onChange={e => change({ title: e.target.value, ...(creating && article.slug === slugify(article.title) ? { slug: slugify(e.target.value) } : {}) })} placeholder="Ej.: Nueva obra comunitaria en Tierra Amarilla" /></label>
        <div className={styles.grid}>
          <label>Fecha *<input type="date" required value={article.date} onChange={e => change({ date: e.target.value })} /></label>
          <div>
            <label>Categoría<select value={article.category} onChange={e => {
              if (e.target.value === "") { setAddingCategory(true); setCategoryError(""); }
              else { change({ category: e.target.value }); setAddingCategory(false); }
            }}>{categories.map(category => <option key={category} value={category}>{category}</option>)}<option value="">＋ Añadir categoría…</option></select></label>
            {addingCategory && <div className="rounded-xl border border-sand p-4">
              <label>Nombre de la nueva categoría<input autoFocus maxLength={60} value={categoryName} onChange={e => { setCategoryName(e.target.value); setCategoryError(""); }} onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addCategory(); } }} placeholder="Ej.: Capacitación comunitaria" aria-describedby="category-help" aria-invalid={!!categoryError} /></label>
              <p id="category-help" className="mb-3 text-sm text-ink/65">Quedará disponible para otras noticias al guardar esta noticia.</p>
              {categoryError && <p role="alert" className="mb-3 text-sm text-red-700">{categoryError}</p>}
              <div className="flex flex-wrap gap-2"><button type="button" className={styles.primary} onClick={addCategory}>Añadir y seleccionar</button><button type="button" className={styles.button} onClick={() => { setAddingCategory(false); setCategoryError(""); }}>Cancelar</button></div>
            </div>}
          </div>
          <label>Ubicación<input maxLength={200} value={article.location} onChange={e => change({ location: e.target.value })} /></label>
          <label>Cliente o mandante<input maxLength={200} value={article.client || ""} onChange={e => change({ client: e.target.value })} /></label>
        </div>
        <label>Resumen *<textarea rows={3} required minLength={10} maxLength={500} value={article.excerpt} onChange={e => change({ excerpt: e.target.value })} /><small>Aparece en las tarjetas de noticias y en los buscadores.</small></label>
        <label>Cuerpo de la noticia *<textarea rows={12} required maxLength={50000} value={article.body.join("\n\n")} onChange={e => change({ body: e.target.value.split("\n\n") })} placeholder="Primer párrafo: contexto, lugar y objetivo. Párrafos centrales: trabajos o actividad. Último párrafo: resultado comprobado. Separa los párrafos con una línea en blanco." /></label>
        <p className="text-sm">Mantén una redacción breve y concreta. Omite montos, órdenes de compra, datos personales y condiciones contractuales.</p>
        <label>Pie de la imagen de portada (opcional)<input maxLength={500} value={article.imageCaption || ""} onChange={e => change({ imageCaption: e.target.value })} placeholder="Identifica una foto de archivo o describe lo que muestra la portada." /></label>
        <label>Puntos destacados (opcional)<textarea rows={4} value={(article.highlights || []).join("\n")} onChange={e => change({ highlights: e.target.value ? e.target.value.split("\n") : [] })} placeholder="Un punto por línea, por ejemplo: 120 m² de nueva infraestructura" /></label>
        <label>Imágenes<input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={e => { void upload(e.target.files); e.target.value = ""; }} /><small>Hasta 12 imágenes. JPG, PNG o WebP; máximo 3 MB cada una. La primera será la portada.</small></label>
        <div className={styles.photos}>{article.images.map((url, index) => <div key={url} className={styles.photo}><img src={url} alt={`Imagen ${index + 1} de la noticia`} /><span className={styles.badge}>{index === 0 ? "Portada" : `Imagen ${index + 1}`}</span><div>{index > 0 && <button type="button" onClick={() => change({ images: [url, ...article.images.filter(i => i !== url)] })}>Usar como portada</button>}<button type="button" onClick={() => change({ images: article.images.filter(i => i !== url) })}>Quitar</button></div></div>)}</div>
        <details className="mb-6"><summary className="cursor-pointer text-sm">Dirección de la noticia</summary><label className="mt-3">/noticias/<input required pattern="[a-z0-9]+(-[a-z0-9]+)*" minLength={3} maxLength={120} readOnly={!creating} value={article.slug} onChange={e => change({ slug: e.target.value })} /><small>{creating ? "Se genera a partir del título; puedes ajustarla antes de guardar." : "La dirección se conserva para mantener los enlaces anteriores."}</small></label></details>
        <label>Visibilidad<select value={article.status} onChange={e => change({ status: e.target.value as Article["status"] })}><option value="draft">Borrador — no se muestra al público</option><option value="published">Publicada — visible en la página</option></select></label>
        <div className={styles.actions}><button className={styles.primary} type="submit">{busy ? "Guardando…" : article.status === "published" ? "Guardar y publicar" : "Guardar borrador"}</button><button type="button" className={styles.button} onClick={() => setPreview(!preview)}>{preview ? "Ocultar vista previa" : "Vista previa"}</button>{!creating && !dirty && article.status === "published" && <a href={`/noticias/${article.slug}`} target="_blank" rel="noreferrer" className={styles.button}>Ver en la página ↗</a>}</div>
      </fieldset>
      {busy && <p role="status" className="mt-4">Guardando información o imágenes…</p>}
      {preview && <article className={styles.preview}><span className={styles.eyebrow}>Vista previa · {article.category}</span><h2>{article.title || "Título de la noticia"}</h2>{article.images[0] && <img src={article.images[0]} alt="Portada" />}<p><strong>{article.excerpt}</strong></p>{article.body.map((p, i) => <p key={i}>{p}</p>)}{!!article.highlights?.length && <ul>{article.highlights.map((p, i) => <li key={i}>• {p}</li>)}</ul>}{article.images.slice(1).map(url => <img key={url} src={url} alt="Imagen de la noticia" />)}</article>}
    </form> : <>
      <div className={styles.toolbar}><input className={styles.input} aria-label="Buscar noticias" placeholder="Buscar por título o categoría…" value={query} onChange={e => setQuery(e.target.value)} /><select className={styles.button} aria-label="Filtrar noticias" value={filter} onChange={e => setFilter(e.target.value)}><option value="all">Todas</option><option value="published">Publicadas</option><option value="draft">Borradores</option></select><select className={styles.button} aria-label="Filtrar por categoría" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}><option value="">Todas las categorías</option>{categories.map(category => <option key={category} value={category}>{category}</option>)}</select><button className={styles.button} onClick={() => void load()}>Actualizar</button></div>
      <div className={styles.grid}>{sorted.map(p => <article key={p.slug} className={styles.card}>{p.image && <img className={styles.cover} src={p.image} alt="" />}<div className={styles.cardBody}><div className={styles.actions}><span className={`${styles.badge} ${p.status === "draft" ? styles.draft : ""}`}>{p.status === "published" ? "Publicada" : "Borrador"}</span><span className={styles.muted}>{formatDate(p.date)}</span></div><h2>{p.title}</h2><p className={styles.muted}>{p.excerpt}</p><div className={`${styles.actions} mt-5`}><button className={styles.button} onClick={() => edit(p)}>Editar noticia</button>{p.status === "published" && <a href={`/noticias/${p.slug}`} target="_blank" rel="noreferrer" className={styles.muted}>Ver publicación ↗</a>}</div></div></article>)}</div>
      {!sorted.length && <p className={styles.empty}>No hay noticias que coincidan con tu búsqueda.</p>}
    </>}
  </section>;
}
