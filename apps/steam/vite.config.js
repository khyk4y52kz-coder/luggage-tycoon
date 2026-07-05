import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STEAM_BUILD_ROOT = path.join(__dirname, "../../../.steam-build");

export default defineConfig({
  base: "./",
  plugins: [react()],
  root: path.join(__dirname, "src"),
  publicDir: path.join(__dirname, "public"),
  server: { port: 5173, strictPort: true },
  build: {
    outDir: path.join(STEAM_BUILD_ROOT, "dist"),
    emptyOutDir: true,
  },
  resolve: {
    dedupe: ["react", "react-dom"],
  },
});