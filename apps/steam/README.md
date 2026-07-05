# Bag Business Tycoon — Steam (Desktop)

Desktop build sharing the same game as the web version via workspace packages:

| Package | Role |
|---------|------|
| `@luggage-tycoon/game-core` | Rules, translations, engine |
| `@luggage-tycoon/game-ui` | React UI (splash, demo, game) |

## Development

From the repo root:

```bash
npm install
npm run dev:steam      # Vite dev server + Electron
```

## Production build (no dev server)

```bash
npm run build:steam    # Vite bundle + electron-builder package
```

Artifacts land in `.steam-build/release/` at the Grok Code workspace root (`.dmg`/`.zip` on macOS, `.exe` on Windows, `.AppImage` on Linux). This directory is gitignored and kept outside the source tree.

Test the unpackaged production build:

```bash
cd apps/steam
npm run start:prod
```

## Steamworks setup

### 1. Partner account

1. Go to [Steamworks Partner](https://partner.steamgames.com/)
2. Pay the one-time app fee ($100 per title)
3. Create your app and note your **App ID**

### 2. Development without a live App ID

Use Valve's test App ID **480** (Spacewar):

```bash
STEAM_APP_ID=480 npm run dev:steam
```

The scaffold in `electron/steam.cjs` exports `initSteamworks(appId)`. It no-ops when `steamworks.js` is not installed or the Steam client is absent.

### 3. Enable live Steamworks

```bash
cd apps/steam
npm install steamworks.js
```

Set your real App ID when launching:

```bash
STEAM_APP_ID=YOUR_APP_ID npm run start:prod
```

### 4. Upload to Steam

1. Install [SteamCMD](https://developer.valvesoftware.com/wiki/SteamCMD)
2. Create depots in the partner portal (Windows / macOS / Linux) and note your **Depot IDs**
3. Copy and fill in the templates in `steam/`:
   - `app_build.template.vdf` — set `YOUR_APP_ID` and depot IDs
   - `depot_build_mac.template.vdf` — set `YOUR_DEPOT_ID` (adjust `ContentRoot` per platform)
4. Upload packaged builds from `release/`:

```bash
steamcmd +login YOUR_STEAM_USERNAME \
  +run_app_build_http steam/app_build.vdf \
  +quit
```

5. Configure store page, pricing, and release branch in the partner portal

For local Steam client testing, `steam/steam_appid.txt` contains test App ID **480**.

## File map

```
apps/steam/
├── electron/
│   ├── main.cjs      # Electron window + production dist loader
│   └── steam.cjs     # Steamworks init scaffold
├── src/              # Vite renderer entry
├── dist/             # Vite production bundle (generated)
└── release/          # electron-builder output (generated)
```

Changes to `packages/game-core` or `packages/game-ui` apply to both web and Steam automatically.