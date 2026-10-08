"use client";

import { useState } from "react";

type Status = "idle" | "sending" | "ok" | "error";

const field =
  "mt-2 block w-full rounded-xl border border-white/25 bg-white/10 px-4 py-3 text-cream placeholder:text-cream/50 focus:border-khaki focus:outline-none focus:ring-2 focus:ring-khaki/60";

export function ContactForm({ services, roadQuote = false }: { services: string[]; roadQuote?: boolean }) {
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
      <div role="status" className="rounded-[var(--radius-card)] bg-olive-900 p-8 text-cream">
        <p className="font-display text-2xl font-semibold">¡Mensaje recibido!</p>
        <p className="text-body mt-3 text-cream/85">Tu solicitud quedó guardada. Te responderemos al correo que nos indicaste.</p>
        <button onClick={() => setStatus("idle")} className="mt-6 text-sm font-semibold text-khaki underline">
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="contact-form rounded-[var(--radius-card)] border border-white/15 bg-olive-950 p-6 text-cream shadow-[var(--shadow-card)] sm:p-8" noValidate={false}>
      <h2 className="font-display text-2xl font-semibold sm:text-3xl">{roadQuote ? "Cotizar mantención de caminos mineros" : "Envíanos un mensaje"}</h2>
      <p className="text-body mb-6 mt-2 text-sm leading-relaxed text-cream/80">{roadQuote ? "Cuéntanos la ubicación, longitud y ancho aproximados, estado del camino, tipo de tránsito y fecha requerida." : "Cuéntanos el servicio, la ubicación y los plazos de tu proyecto."} Los campos con * son obligatorios.</p>
      <div className="grid gap-6 sm:grid-cols-2">
        <label className="block text-sm font-medium text-olive-900">
          Nombre *
          <input name="nombre" autoComplete="name" required maxLength={150} className={field} />
        </label>
        <label className="block text-sm font-medium text-olive-900">
          Empresa
          <input name="empresa" autoComplete="organization" maxLength={200} className={field} />
        </label>
        <label className="block text-sm font-medium text-olive-900">
          Correo electrónico *
          <input name="email" type="email" autoComplete="email" maxLength={254} required className={field} />
        </label>
        <label className="block text-sm font-medium text-olive-900">
          Teléfono
          <input name="telefono" type="tel" autoComplete="tel" maxLength={50} className={field} />
        </label>
        <label className="block text-sm font-medium text-olive-900 sm:col-span-2">
          Servicio de interés
          <select name="servicio" className={field} defaultValue={roadQuote ? "Mantención integral de caminos mineros" : ""}>
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
          <textarea name="mensaje" rows={5} required minLength={10} maxLength={10000} className={field} placeholder={roadQuote ? "Ubicación de faena, longitud y ancho del camino, estado, tránsito, fecha requerida, materiales y requisitos de seguridad…" : "Cantidades, ubicación de faena, plazos…"} />
        </label>
        {/* honeypot anti-spam */}
        <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      </div>

      {status === "error" && (
        <p role="alert" className="mt-6 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-800">
          {error}
        </p>
      )}
      <p className="text-body mt-5 text-xs leading-relaxed text-cream/75">Usaremos tus datos de contacto para responder a esta solicitud. Solo el administrador puede consultar el mensaje.</p>

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
