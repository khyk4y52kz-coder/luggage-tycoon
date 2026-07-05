import assert from "node:assert/strict";
import { readFileSync, existsSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "../../../../.steam-build/dist");
const indexHtml = join(distDir, "index.html");

assert.ok(existsSync(indexHtml), "dist/index.html must exist");

const html = readFileSync(indexHtml, "utf8");
assert.match(html, /src="\.\/assets\/.*\.js"/, "index.html must use relative asset paths for Electron file:// loading");
assert.match(html, /id="root"/, "index.html must contain #root mount point");

const assetMatch = html.match(/src="(\.\/assets\/[^"]+\.js)"/);
const jsPath = join(distDir, assetMatch[1].replace("./", ""));
assert.ok(existsSync(jsPath), `bundled JS must exist: ${jsPath}`);
assert.ok(statSync(jsPath).size > 10000, "bundled JS must be non-trivial size");

const js = readFileSync(jsPath, "utf8");
assert.match(js, /The Little Bag Factory|Den Lille Taskefabrik/, "bundle must include game title strings");

console.log("verify-dist: OK");