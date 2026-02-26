/**
 * Injects dist/index.html into _worker.js as EMBEDDED_INDEX_HTML so the Worker
 * can serve it when ASSETS.fetch fails for SPA routes (e.g. /categories).
 * Run after: vite build
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const distDir = path.join(root, "dist");
const indexPath = path.join(distDir, "index.html");
const workerSrc = path.join(root, "_worker.js");
const workerOut = path.join(distDir, "_worker.js");

const html = fs.readFileSync(indexPath, "utf8");
const placeholder = '= "__EMBEDDED_INDEX_HTML__"';
const replacement = "= " + JSON.stringify(html);
const workerCode = fs.readFileSync(workerSrc, "utf8");

if (!workerCode.includes(placeholder)) {
  throw new Error("_worker.js must contain = \"__EMBEDDED_INDEX_HTML__\" placeholder");
}

const out = workerCode.replace(placeholder, replacement);
fs.writeFileSync(workerOut, out, "utf8");
console.log("Injected index.html into dist/_worker.js");
