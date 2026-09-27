import { createHash, timingSafeEqual } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { configuredPassword, createSession, SESSION_COOKIE, SESSION_SECONDS } from "@/lib/admin-session";
import { isSameOrigin } from "@/lib/request-origin";

// Best-effort per-instance throttling; platform rate limiting should supplement it.
const attempts = new Map<string, { count: number; expires: number }>();
const WINDOW = 15 * 60 * 1000;

export async function POST(request: NextRequest) {
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Solicitud no permitida." }, { status: 403 });
  const password = configuredPassword();
  if (!password) return NextResponse.json({ error: "El acceso todavía no está configurado." }, { status: 503 });
  const now = Date.now();
  for (const [key, value] of attempts) if (value.expires <= now) attempts.delete(key);
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  const entry = attempts.get(ip) ?? { count: 0, expires: now + WINDOW };
  if (entry.count >= 5 || attempts.size >= 10000) return NextResponse.json({ error: "Demasiados intentos. Espera 15 minutos antes de volver a intentarlo." }, { status: 429, headers: { "Retry-After": "900" } });
  entry.count += 1;
  attempts.set(ip, entry);
  let body: unknown;
  try { body = await request.json(); } catch { return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 }); }
  const input = body as { username?: unknown; password?: unknown } | null;
  if (!input || typeof input.username !== "string" || typeof input.password !== "string" || input.password.length > 1024) return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  const matches = timingSafeEqual(createHash("sha256").update(input.password).digest(), createHash("sha256").update(password).digest());
  if (input.username !== "admin" || !matches) return NextResponse.json({ error: "Usuario o contraseña incorrectos." }, { status: 401 });
  attempts.delete(ip);
  const response = NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  response.cookies.set(SESSION_COOKIE, await createSession(password), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
  return response;
}
