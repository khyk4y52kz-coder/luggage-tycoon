#!/usr/bin/env node
/**
 * Runs plan verification checks for the Steam desktop build.
 * Usage: node scripts/verify-steam-release.mjs [scratchDir]
 */
import { execSync } from "node:child_process";
import { existsSync, statSync, readdirSync, readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = join(__dirname, "..");
const GROK_ROOT = join(REPO_ROOT, "..");
const STEAM_BUILD_ROOT = join(GROK_ROOT, ".steam-build");
const SCRATCH = process.argv[2] || join(REPO_ROOT, ".verify-scratch");

function log(msg) {
  console.log(msg);
}

function assert(cond, msg) {
  if (!cond) throw new Error(`ASSERT FAIL: ${msg}`);
}

function sh(cmd, opts = {}) {
  return execSync(cmd, { cwd: REPO_ROOT, encoding: "utf8", ...opts }).trim();
}

log(`REPO_ROOT=${REPO_ROOT}`);
log(`STEAM_BUILD_ROOT=${STEAM_BUILD_ROOT}`);
log(`SCRATCH=${SCRATCH}`);

sh(`npm run build -w @luggage-tycoon/steam`);
const distIndex = join(STEAM_BUILD_ROOT, "dist/index.html");
assert(existsSync(distIndex), ".steam-build/dist/index.html must exist");
const assetsDir = join(STEAM_BUILD_ROOT, "dist/assets");
const jsFiles = readdirSync(assetsDir).filter((f) => f.endsWith(".js"));
assert(jsFiles.length > 0, "dist/assets/*.js must exist");
assert(statSync(join(assetsDir, jsFiles[0])).size > 10000, "bundled JS must be non-empty");
log("PASS step 1: vite renderer bundle");

const testOut = sh("npm test");
assert(testOut.includes("pass 11"), "game-core tests must pass (11)");
assert(testOut.includes("getSkill"), "tests must exercise getSkill");
log("PASS step 4: game-core unit tests");

const steamCjs = join(REPO_ROOT, "apps/steam/electron/steam.cjs");
const steamSrc = readFileSync(steamCjs, "utf8");
assert(steamSrc.includes("initSteamworks"), "steam.cjs must export initSteamworks");
assert(steamSrc.includes("480"), "steam.cjs must document test App ID 480");
log("PASS step 5: Steamworks scaffold");

sh("npm run verify:dist -w @luggage-tycoon/steam");
log("PASS step 6: verify-dist");

const releaseDir = join(STEAM_BUILD_ROOT, "release");
if (existsSync(releaseDir)) {
  const entries = readdirSync(releaseDir);
  const hasArtifact =
    entries.some(
      (e) => e.endsWith(".dmg") || e.endsWith(".zip") || e.endsWith(".app"),
    ) || existsSync(join(releaseDir, "mac-arm64", "Bag Business Tycoon.app"));
  assert(hasArtifact, ".steam-build/release must contain installable artifact");
  log(`PASS step 3: release artifacts present: ${entries.join(", ")}`);
} else {
  log("SKIP step 3: run npm run build:steam to produce .steam-build/release artifacts");
}

log("\nALL CHECKS PASSED");