# Den Lille Taskefabrik / The Little Bag Factory

Monorepo for the web and Steam desktop versions of *Den Lille Taskefabrik* (Danish) / *The Little Bag Factory* (English).

| App | Path | Deploy target |
|-----|------|---------------|
| Web | `apps/web` | [Vercel](https://luggagetycoon.vercel.app) |
| Steam | `apps/steam` | electron-builder → SteamPipe |

Shared game logic lives in `packages/game-core` and `packages/game-ui`.

## Quick start

```bash
npm install
npm run dev:web          # Next.js at http://localhost:3000
npm run dev:steam        # Vite + Electron
```

## Steam desktop build

```bash
npm run build:steam      # Vite bundle + .dmg/.zip (macOS) or .exe/.AppImage
npm test                 # game-core unit tests
npm run verify:steam     # automated release checks
```

See `apps/steam/README.md` for Steamworks partner portal steps and SteamPipe upload templates.

## Repository

Canonical GitHub repo: https://github.com/khyk4y52kz-coder/luggage-tycoon