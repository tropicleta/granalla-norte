"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

const field =
  "mt-2 block w-full rounded-xl border border-olive-900/15 bg-white px-4 py-3 text-ink placeholder:text-ink/40 focus:border-olive-700 focus:outline-none focus:ring-2 focus:ring-khaki/60";

export function ContactForm({ services }: { services: string[] }) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch("/api/contacto", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "No pudimos enviar el mensaje.");
      setStatus("ok");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "No pudimos enviar el mensaje.");
    }
  }

  if (status === "ok") {
    return (
      <div role="status" className="rounded-[var(--radius-card)] bg-sand-300 p-10">
        <p className="font-display text-2xl font-semibold text-olive-900">¡Mensaje recibido!</p>
        <p className="mt-3 text-ink/75">Te responderemos a la brevedad al correo que nos indicaste.</p>
        <button onClick={() => setStatus("idle")} className="mt-6 text-sm font-semibold text-copper-600 underline">
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius-card)] bg-white p-8 shadow-[var(--shadow-card)] sm:p-10" noValidate={false}>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium text-olive-900">
          Nombre
          <input name="nombre" autoComplete="name" required className={field} />
        </label>
        <label className="block text-sm font-medium text-olive-900">
          Empresa
          <input name="empresa" autoComplete="organization" className={field} />
        </label>
        <label className="block text-sm font-medium text-olive-900">
          Correo electrónico *
          <input name="email" type="email" autoComplete="email" required className={field} />
        </label>
        <label className="block text-sm font-medium text-olive-900">
          Teléfono
          <input name="telefono" type="tel" autoComplete="tel" className={field} />
        </label>
        <label className="block text-sm font-medium text-olive-900 sm:col-span-2">
          Servicio de interés
          <select name="servicio" className={field} defaultValue="">
            <option value="" disabled>
              Selecciona una opción
            </option>
            {services.map((s) => (
              <option key={s}>{s}</option>
            ))}
            <option>Otro</option>
          </select>
        </label>
        <label className="block text-sm font-medium text-olive-900 sm:col-span-2">
          Mensaje *
          <textarea name="mensaje" rows={5} required minLength={10} className={field} placeholder="Cantidades, ubicación de faena, plazos…" />
        </label>
        {/* honeypot anti-spam */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      </div>

      {status === "error" && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-copper px-6 py-3.5 font-semibold text-white transition hover:bg-copper-600 disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" ? "Enviando…" : "Enviar solicitud"}
      </button>
    </form>
  );
}
