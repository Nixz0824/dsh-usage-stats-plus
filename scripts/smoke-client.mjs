import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const client = readFileSync(join(root, "lib", "client.js"), "utf8");
const host = readFileSync(join(root, "lib", "index.js"), "utf8");

const checks = [
  ["outside click close", /pointerdown/, client],
  ["usage panel", /UsageStatsPanel/, client],
  ["host apply", /export \{ apply/, host],
  ["usage routes", /\/api\/usage-stats\//, host],
];

for (const [label, pattern, hay] of checks) {
  if (!pattern.test(hay)) {
    console.error("smoke failed:", label);
    process.exit(1);
  }
}

console.log("smoke ok");
