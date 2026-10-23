"use client";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import s from "../content.module.css";
import w from "../workspace.module.css";
export default function AccountForm({ recovery = false }: { recovery?: boolean }) {
  const [busy, setBusy] = useState(false); const [error, setError] = useState(""); const [codes, setCodes] = useState<string[]>([]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); const form = event.currentTarget; const body = Object.fromEntries(new FormData(form));
    if (body.password !== body.confirm) { setError("Las contraseñas nuevas no coinciden."); return; }
    setBusy(true);
    try { const response = await fetch(recovery ? "/api/admin/recuperar" : "/api/admin/cuenta", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setCodes(data.codes); form.reset(); }
    catch (e) { setError(e instanceof Error ? e.message : "No pudimos cambiar la contraseña."); } finally { setBusy(false); }
  }
  function download() { const content = `Granalla Norte — códigos privados de recuperación\nUsuario: admin\nGuárdalos fuera del sitio. No los compartas con mandantes.\nCada recuperación reemplaza todos estos códigos.\n\n${codes.join("\n")}\n`; const url = URL.createObjectURL(new Blob([content], { type: "text/plain;charset=utf-8" })); const link = document.createElement("a"); link.href = url; link.download = "granalla-norte-codigos-privados.txt"; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); }
  return <main className={s.workspace}><div className={s.heading}><div><h1>{recovery ? "Recuperar acceso" : "Tu cuenta de administración"}</h1><p>{recovery ? "Usa uno de los códigos privados que guardaste al cambiar tu contraseña." : "Una sola cuenta para gestionar el sitio y los documentos de tus mandantes."}</p></div></div>
    {error ? <p className={s.error} role="alert">{error}</p> : null}
    {codes.length ? <section className={s.notice} role="status"><h2 className="text-xl font-semibold">Contraseña actualizada</h2><p className="mt-3">Se cerraron las sesiones anteriores. Guarda estos códigos en un lugar privado: solo se muestran ahora y permiten recuperar tu acceso.</p><div className={w.codes}>{codes.map(code => <code key={code}>{code}</code>)}</div><div className={s.actions}><button className={s.primary} onClick={download}>Descargar códigos privados</button><Link className={s.button} href="/admin">Volver al inicio</Link></div><p className="mt-3 text-sm">Los códigos anteriores quedaron reemplazados. No entregues estos códigos a tus clientes.</p></section> : <form className={s.form} style={{ maxWidth: 640 }} onSubmit={submit}><fieldset disabled={busy}><h2 className="mb-5 text-xl font-semibold">{recovery ? "Elige una nueva contraseña" : "Cambiar tu contraseña"}</h2><label>{recovery ? "Código de recuperación" : "Contraseña actual"}<input name={recovery ? "code" : "currentPassword"} type={recovery ? "text" : "password"} autoComplete={recovery ? "off" : "current-password"} maxLength={recovery ? 100 : 1024} required /></label><label>Nueva contraseña<input name="password" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /><small>Entre 12 y 128 caracteres. Puedes usar una frase fácil de recordar.</small></label><label>Repetir nueva contraseña<input name="confirm" type="password" autoComplete="new-password" minLength={12} maxLength={128} required /></label><button className={s.primary}>{busy ? "Guardando…" : recovery ? "Recuperar acceso" : "Guardar nueva contraseña"}</button><p className="mt-5 text-sm leading-relaxed">Al guardar recibirás nuevos códigos privados para recuperar el acceso si olvidas la contraseña. Consérvalos fuera del sitio.</p></fieldset></form>}
    {recovery && !codes.length ? <p className={s.muted}>Si todavía no configuraste tus códigos o los perdiste, pide ayuda a quien administra el alojamiento del sitio. <Link href="/admin/login" className="underline">Volver al ingreso</Link></p> : null}
  </main>;
}
