export const SESSION_COOKIE = "gn_admin_session";
export const SESSION_SECONDS = 8 * 60 * 60;

export function configuredPassword(): string | null {
  const password = process.env.ADMIN_PASSWORD;
  return password && password.length >= 12 ? password : null;
}

async function signingKey(password: string) {
  return crypto.subtle.importKey("raw", new TextEncoder().encode(`granalla-norte:admin:v1:${password}`), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

export async function createSession(password: string, now = Date.now()) {
  const payload = `v1.${Math.floor(now / 1000) + SESSION_SECONDS}.${crypto.randomUUID()}`;
  const signature = await crypto.subtle.sign("HMAC", await signingKey(password), new TextEncoder().encode(payload));
  return `${payload}.${Array.from(new Uint8Array(signature), byte => byte.toString(16).padStart(2, "0")).join("")}`;
}

export async function verifySession(token: string | undefined, password: string | null, now = Date.now()) {
  if (!token || !password || token.length > 200) return false;
  const parts = token.split(".");
  if (parts.length !== 4 || parts[0] !== "v1" || !/^\d+$/.test(parts[1]) || !/^[\da-f-]{36}$/.test(parts[2]) || !/^[\da-f]{64}$/.test(parts[3])) return false;
  const expiry = Number(parts[1]);
  const seconds = Math.floor(now / 1000);
  if (expiry <= seconds || expiry > seconds + SESSION_SECONDS) return false;
  const signature = Uint8Array.from(parts[3].match(/../g)!, pair => parseInt(pair, 16));
  return crypto.subtle.verify("HMAC", await signingKey(password), signature, new TextEncoder().encode(parts.slice(0, 3).join(".")));
}
