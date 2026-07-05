# Bag Business Tycoon — Steam (Desktop)

This app shares the same UI and game logic as the web version via workspace packages:

- `@luggage-tycoon/game-core` — rules, translations, engine
- `@luggage-tycoon/game-ui` — React components (splash, demo, game)

## Development

From the repo root:

```bash
npm install
npm run dev:steam
```

## Next steps for Steam release

1. Add **Steamworks SDK** integration (`steamworks.js` or Greenworks)
2. Add **electron-builder** for Windows/macOS/Linux builds
3. Wire Steam achievements, cloud saves, and overlay
4. Replace browser `localStorage` with Electron-safe persistence if needed
5. Add app icon, store capsule art, and depots in Steamworks partner portal

Changes to `packages/game-core` or `packages/game-ui` automatically apply to both web and Steam.