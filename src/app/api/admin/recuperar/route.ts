import { cookies } from "next/headers";
import { limitedJson, privateJson, apiError } from "@/lib/admin-api";
import { adminAccount, matchesRecoveryCode, setAdminPassword } from "@/lib/admin-account";
import { configuredPassword, createSession, SESSION_COOKIE, SESSION_SECONDS } from "@/lib/admin-session";
import { ContentError } from "@/lib/content-model";
import { loginQuota } from "@/lib/portal";
import { isSameOrigin } from "@/lib/request-origin";
export async function POST(request: Request) {
  try {
    if (!isSameOrigin(request)) throw new ContentError("Solicitud no autorizada.", 403);
    const body = await limitedJson(request, 4096) as Record<string, unknown>;
    if (!body || typeof body !== "object") throw new ContentError("Solicitud inválida.");
    // Unknown codes must not let one source lock recovery for every other source.
    await loginQuota(request, "admin-recovery", true);
    const account = await adminAccount();
    if (!matchesRecoveryCode(body.code, account.value)) throw new ContentError("El código no es válido o ya fue reemplazado.");
    const updated = await setAdminPassword(body.password, account.etag);
    (await cookies()).set(SESSION_COOKIE, await createSession(configuredPassword()!, Date.now(), updated.revision), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: SESSION_SECONDS });
    return privateJson({ codes: updated.codes });
  } catch (error) { return apiError(error); }
}
