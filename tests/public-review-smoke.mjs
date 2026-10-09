import { spawn } from "node:child_process";
import { mkdtemp } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import assert from "node:assert/strict";

const storage = await mkdtemp(join(tmpdir(), "granalla-public-review-"));
const origin = "http://127.0.0.1:3119";
const server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--hostname", "127.0.0.1", "--port", "3119"], {
  env: { ...process.env, NEXT_BUILD_DIR: ".next", CONTENT_LOCAL_DIR: storage, VERCEL: "" },
  windowsHide: true,
  stdio: ["ignore", "pipe", "pipe"],
});
let output = "";
server.stdout.on("data", data => { output += data; });
server.stderr.on("data", data => { output += data; });
try {
  let ready = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    if (server.exitCode !== null) throw new Error(output);
    try { ready = (await fetch(origin)).ok; } catch {}
    if (ready) break;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  assert.ok(ready, output);
  for (const file of ["quote-context-smoke.mjs", "seo-smoke.mjs", "service-navigation-smoke.mjs"]) {
    await new Promise((resolve, reject) => {
      const test = spawn(process.execPath, [`tests/${file}`, origin], { windowsHide: true, stdio: "inherit" });
      test.on("error", reject);
      test.on("exit", code => code === 0 ? resolve() : reject(new Error(`${file} exited with ${code}`)));
    });
  }
} finally {
  server.kill();
}
