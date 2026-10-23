import { cookies } from "next/headers";
import { requireAdmin, limitedJson, privateJson, apiError } from "@/lib/admin-api";
import { adminAccount, matchesAdminPassword, setAdminPassword } from "@/lib/admin-account";
import { configuredPassword, createSession, SESSION_COOKIE, SESSION_SECONDS } from "@/lib/admin-session";
import { ContentError } from "@/lib/content-model";
import { loginQuota } from "@/lib/portal";
export async function GET() {
  try { await requireAdmin(); const account = await adminAccount(); return privateJson({ recoveryReady: Boolean(account.value?.recovery.length), updatedAt: account.value?.updatedAt ?? null }); }
  catch (error) { return apiError(error); }
}
export async function POST(request: Request) {
  try {
    await requireAdmin(request);
    const body = await limitedJson(request, 4096) as Record<string, unknown>;
    if (!body || typeof body.currentPassword !== "string" || body.currentPassword.length > 1024) throw new ContentError("Ingresa tu contraseña actual.");
    await loginQuota(request, "admin-password");
    const account = await adminAccount();
    if (!await matchesAdminPassword(body.currentPassword, account.value)) throw new ContentError("La contraseña actual no es correcta.");
    const updated = await setAdminPassword(body.password, account.etag);
    (await cookies()).set(SESSION_COOKIE, await createSession(configuredPassword()!, Date.now(), updated.revision), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
    return privateJson({ codes: updated.codes });
  } catch (error) { return apiError(error); }
}
