import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { configuredPassword, sessionRevision, verifySession } from "./admin-session";
import { readJson, storageConfigured, writeJson } from "./content-storage";
import { checkPassword, hashPassword, password } from "./portal";
import { ContentError } from "./content-model";

type Account = { passwordHash: string; revision: string; bootstrap: string; recovery: string[]; updatedAt: string };
const path = "settings/admin-account.json";
const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export async function adminAccount() {
  if (!storageConfigured()) return { value: null, etag: undefined };
  const record = await readJson<Account>(path);
  const valid = record?.value.bootstrap === digest(configuredPassword() ?? "");
  return { value: valid ? record!.value : null, etag: record?.etag };
}
export async function verifyAdminSession(token: string | undefined) {
  if (!await verifySession(token, configuredPassword())) return false;
  const account = await adminAccount();
  return sessionRevision(token!) === (account.value?.revision ?? "bootstrap");
}
export async function matchesAdminPassword(value: string, account: Account | null) {
  if (account) return checkPassword(value, account.passwordHash);
  const configured = configuredPassword();
  return Boolean(configured) && timingSafeEqual(Buffer.from(digest(value), "hex"), Buffer.from(digest(configured ?? ""), "hex"));
}
export async function setAdminPassword(input: unknown, expectedEtag?: string) {
  const secret = configuredPassword();
  if (!secret) throw new ContentError("El acceso todavía no está configurado.", 503);
  const newPassword = password(input);
  const codes = Array.from({ length: 6 }, () => randomBytes(18).toString("hex").match(/.{6}/g)!.join("-"));
  const account: Account = { passwordHash: await hashPassword(newPassword), revision: randomUUID(), bootstrap: digest(secret), recovery: codes.map(c => digest(c.replaceAll("-", "").toLowerCase())), updatedAt: new Date().toISOString() };
  await writeJson(path, account, expectedEtag);
  return { revision: account.revision, codes };
}
export function matchesRecoveryCode(value: unknown, account: Account | null) {
  if (typeof value !== "string" || value.length > 100 || !account) return false;
  const normalized = value.trim().replaceAll("-", "").toLowerCase();
  if (!/^[a-f0-9]{36}$/.test(normalized)) return false;
  const hashed = Buffer.from(digest(normalized), "hex");
  return account.recovery.some(code => timingSafeEqual(hashed, Buffer.from(code, "hex")));
}
