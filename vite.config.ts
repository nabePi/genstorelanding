import { defineConfig } from "vite";
import type { Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Landing statis ada di public/l/<slug>/index.html dan dilayani di /l/<slug>.
 * Vite dev memberi fallback SPA untuk path tanpa trailing slash, jadi arahkan
 * ke index.html milik landing tersebut (production ditangani public/serve.json).
 */
function staticLandings(): Plugin {
  return {
    name: "static-landings",
    configureServer(server) {
      server.middlewares.use((req, _res, next) => {
        const r = req as { url?: string }; // tanpa @types/node
        const match = r.url?.match(/^\/l\/([a-z0-9-]+)\/?(\?.*)?$/i);
        if (match) r.url = `/l/${match[1]}/index.html${match[2] ?? ""}`;
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), staticLandings()],
});
