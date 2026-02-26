import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import fs from "fs";
import { sitemapPlugin } from "./src/plugins/sitemapPlugin";

// Copy Cloudflare Pages worker and config into dist for deployment
function cloudflarePlugin() {
  const files = ["_worker.js", "_routes.json", "_headers"];
  return {
    name: "cloudflare-pages",
    closeBundle() {
      const outDir = path.resolve(__dirname, "dist");
      for (const file of files) {
        const src = path.resolve(__dirname, file);
        if (fs.existsSync(src)) {
          fs.copyFileSync(src, path.join(outDir, file));
        }
      }
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), sitemapPlugin(), cloudflarePlugin()],
  resolve: {
    alias: {
      "~features": path.resolve(__dirname, "./src/features"),
    },
  },
});
