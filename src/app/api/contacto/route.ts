import { NextResponse } from "next/server";
import { site } from "@/lib/site";

/**
 * Recibe el formulario de contacto.
 * Si RESEND_API_KEY está definida, envía el correo vía Resend (https://resend.com).
 * Sin clave, solo registra en consola (útil en desarrollo).
 *
 * Variables de entorno:
 *   RESEND_API_KEY   clave de Resend
 *   CONTACT_TO       destino (por defecto el correo del sitio)
 *   CONTACT_FROM     remitente verificado, ej. "Web Granalla <web@granallanorte.cl>"
 */
export async function POST(req: Request) {
  let body: Record<string, string>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  if (body.website) return NextResponse.json({ ok: true }); // honeypot

  const email = String(body.email ?? "").trim();
  const mensaje = String(body.mensaje ?? "").trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Ingresa un correo válido." }, { status: 422 });
  }
  if (mensaje.length < 10) {
    return NextResponse.json({ error: "Cuéntanos un poco más en el mensaje." }, { status: 422 });
  }

  const lines = [
    `Nombre: ${body.nombre ?? "-"}`,
    `Empresa: ${body.empresa ?? "-"}`,
    `Correo: ${email}`,
    `Teléfono: ${body.telefono ?? "-"}`,
    `Servicio: ${body.servicio ?? "-"}`,
    "",
    mensaje,
  ].join("\n");

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info("[contacto] RESEND_API_KEY no configurada. Mensaje:\n" + lines);
    return NextResponse.json({ ok: true });
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM ?? "Web Granalla Norte <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO ?? site.email],
      reply_to: email,
      subject: `Nueva solicitud web — ${body.servicio || "Contacto"}`,
      text: lines,
    }),
  });

  if (!res.ok) {
    console.error("[contacto] Resend error", await res.text());
    return NextResponse.json({ error: "No pudimos enviar el mensaje. Escríbenos directo al correo." }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
