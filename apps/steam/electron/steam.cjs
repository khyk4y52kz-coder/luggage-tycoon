/**
 * Steamworks integration scaffold.
 *
 * Uses steamworks.js when available; otherwise no-ops gracefully so dev/CI
 * and non-Steam launches still work.
 *
 * Test App ID (Spacewar): 480 — use during development before partner App ID.
 * Partner portal: https://partner.steamgames.com/
 */

const STEAM_TEST_APP_ID = 480;

function initSteamworks(appId = STEAM_TEST_APP_ID) {
  const resolvedAppId = Number(appId) || STEAM_TEST_APP_ID;

  try {
    // Optional: npm install steamworks.js when ready for live Steam client testing
    // eslint-disable-next-line import/no-unresolved, global-require
    const steamworks = require("steamworks.js");
    const client = steamworks.init(resolvedAppId);
    console.log(`[steam] Initialized Steamworks (App ID ${resolvedAppId})`);
    return { initialized: true, appId: resolvedAppId, client };
  } catch (err) {
    console.log(
      `[steam] Steamworks not active (App ID ${resolvedAppId}): ${err.message}`,
    );
    return { initialized: false, appId: resolvedAppId, client: null };
  }
}

module.exports = { initSteamworks, STEAM_TEST_APP_ID };