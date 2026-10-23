import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { randomUUID } from "node:crypto";
import { limitedJson, apiError, privateJson } from "@/lib/admin-api";
import { ContentError } from "@/lib/content-model";
import { isSameOrigin } from "@/lib/request-origin";
import { loadPortal, requireMandante, publicClient, email, password, hashPassword, checkPassword, issueToken, loginQuota, savePortal, PORTAL_COOKIE, PORTAL_SECONDS } from "@/lib/portal";
export const runtime = "nodejs";
const cookieOptions = { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict" as const, path: "/", maxAge: PORTAL_SECONDS };
export async function GET() { try { return privateJson({ client: publicClient((await requireMandante()).client) }); } catch (error) { return apiError(error); } }
export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) throw new ContentError("Solicitud no autorizada.", 403);
    const body = await limitedJson(request, 3000) as Record<string, unknown>;
    if (!body || typeof body !== "object") throw new ContentError("Solicitud inválida.");
    if (body.action === "logout") { (await cookies()).set(PORTAL_COOKIE, "", { ...cookieOptions, maxAge: 0 }); return privateJson({ ok: true }); }
    if (body.action === "login") {
      const address = email(body.email);
      await loginQuota(request, address);
      const value = typeof body.password === "string" && body.password.length <= 128 ? body.password : "";
      const store = await loadPortal(); const client = store.value.clients.find(c => c.email === address);
      const valid = await checkPassword(value, client?.passwordHash);
      if (!client || !valid || !client.active) throw new ContentError("Correo o contraseña incorrectos, o acceso desactivado.", 401);
      const response = NextResponse.json({ client: publicClient(client) }, { headers: { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex" } });
      response.cookies.set(PORTAL_COOKIE, issueToken(client), cookieOptions); return response;
    }
    if (body.action === "password") {
      const store = await requireMandante();
      await loginQuota(request, store.client.email);
      if (typeof body.currentPassword !== "string" || body.currentPassword.length > 128 || !await checkPassword(body.currentPassword, store.client.passwordHash)) throw new ContentError("La contraseña actual no es correcta.", 400);
      store.client.passwordHash = await hashPassword(password(body.password)); store.client.sessionVersion = randomUUID();
      await savePortal(store.value, store.etag);
      (await cookies()).set(PORTAL_COOKIE, issueToken(store.client), cookieOptions);
      return privateJson({ ok: true });
    }
    throw new ContentError("Acción inválida.");
  } catch (error) { return apiError(error); }
}
