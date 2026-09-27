import test from "node:test";
import assert from "node:assert/strict";
import { createSession, verifySession, SESSION_SECONDS } from "../src/lib/admin-session.ts";
import { isSameOrigin } from "../src/lib/request-origin.ts";

const password = "test-only-password-not-a-real-credential";
const now = 1790000000000;
test("origin checks respect the public host behind the server", () => {
  const req = origin => new Request("http://localhost:3100/api/admin/login", { headers: { Host: "127.0.0.1:3100", Origin: origin, "x-forwarded-proto": "http" } });
  assert.equal(isSameOrigin(req("http://127.0.0.1:3100")), true);
  assert.equal(isSameOrigin(req("https://attacker.example")), false);
  assert.equal(isSameOrigin(req("null")), false);
  assert.equal(isSameOrigin(req("https://127.0.0.1:3100")), false);
});
test("signed sessions work and expire after eight hours", async () => {
  const token = await createSession(password, now);
  assert.equal(await verifySession(token, password, now), true);
  assert.equal(await verifySession(token, password, now + SESSION_SECONDS * 1000), false);
});
test("changed password revokes old sessions", async () => {
  assert.equal(await verifySession(await createSession(password, now), "different-test-password", now), false);
});
test("tampering, malformed tokens and missing configuration deny access", async () => {
  const token = await createSession(password, now);
  assert.equal(await verifySession(token.replace("v1.", "v2."), password, now), false);
  const parts = token.split("."); parts[1] = String(Number(parts[1]) - 10);
  assert.equal(await verifySession(parts.join("."), password, now), false);
  for (const invalid of [undefined, "", "fake", "v1.NaN.fake.fake", `${token}.extra`]) assert.equal(await verifySession(invalid, password, now), false);
  assert.equal(await verifySession(token, null, now), false);
});
