"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

export default function LoginForm() {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setBusy(true); setError("");
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/admin/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(Object.fromEntries(form)) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error ?? "No pudimos iniciar sesión.");
      window.location.assign("/admin");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "No pudimos conectar. Inténtalo de nuevo."); setBusy(false); }
  }
  const input = "mt-2 w-full rounded-xl border border-sand px-4 py-3 focus:outline-2 focus:outline-copper";
  return <form className="mt-8 space-y-5" onSubmit={submit}><label className="block text-sm font-medium">Usuario<input className={input} name="username" autoComplete="username" defaultValue="admin" required maxLength={100}/></label><label className="block text-sm font-medium">Contraseña<input className={input} name="password" type={visible ? "text" : "password"} autoComplete="current-password" required maxLength={1024}/></label><button type="button" className="text-sm underline underline-offset-4" aria-pressed={visible} onClick={()=>setVisible(!visible)}>{visible ? "Ocultar contraseña" : "Mostrar contraseña"}</button>{error && <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">{error}</p>}<button disabled={busy} className="w-full rounded-full bg-olive-900 px-5 py-3 font-semibold text-white disabled:opacity-60">{busy ? "Ingresando…" : "Entrar al administrador"}</button><Link href="/" className="block text-center text-sm text-khaki-700 underline">Volver al sitio</Link></form>;
}
