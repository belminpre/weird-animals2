#!/usr/bin/env node
/**
 * Check all image URLs used in the project (animals JSON, animals.ts, index.html).
 * Exits with code 1 if any URL returns 4xx/5xx.
 *
 * Usage: node scripts/check-image-urls.mjs
 *        npm run check:images
 */

import { readFileSync, readdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ANIMALS_DIR = join(ROOT, "src/data/animals");
const ANIMALS_TS = join(ROOT, "src/data/animals.ts");
const INDEX_HTML = join(ROOT, "index.html");

const IMAGE_URL_REGEX = /"image":\s*"([^"]+)"/g;
const IMAGE_PROP_REGEX = /image:\s*["']([^"']+)["']/g;
const OG_IMAGE_REGEX = /og:image["']?\s+content=["']([^"']+)["']/;

function collectFromJsonFiles() {
  const entries = [];
  const files = readdirSync(ANIMALS_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const path = join(ANIMALS_DIR, file);
    const text = readFileSync(path, "utf8");
    const name = file.replace(".json", "");
    for (const m of text.matchAll(IMAGE_URL_REGEX)) {
      entries.push({ url: m[1], source: `animals/${file} (${name})` });
    }
  }
  return entries;
}

function collectFromAnimalsTs() {
  const entries = [];
  const text = readFileSync(ANIMALS_TS, "utf8");
  let lastId = "";
  const idMatch = text.matchAll(/\bid:\s*["']([^"']+)["']/g);
  const idList = [...idMatch].map((m) => m[1]);
  let idx = 0;
  for (const m of text.matchAll(IMAGE_PROP_REGEX)) {
    const id = idList[idx] ?? `entry-${idx}`;
    idx++;
    entries.push({ url: m[1], source: `animals.ts (${id})` });
  }
  return entries;
}

function collectFromIndexHtml() {
  const text = readFileSync(INDEX_HTML, "utf8");
  const m = text.match(OG_IMAGE_REGEX) || text.match(/property="og:image"\s+content="([^"]+)"/);
  if (!m) return [];
  return [{ url: m[1], source: "index.html (og:image)" }];
}

async function checkUrl(entry) {
  const { url, source } = entry;
  try {
    // Use GET so servers that don't support HEAD (e.g. picsum) still pass
    const res = await fetch(url, { method: "GET", redirect: "follow" });
    const status = res.status;
    return { ...entry, status, ok: status >= 200 && status < 400 };
  } catch (err) {
    return { ...entry, status: "ERR", ok: false, error: err.message };
  }
}

async function main() {
  const all = [
    ...collectFromJsonFiles(),
    ...collectFromAnimalsTs(),
    ...collectFromIndexHtml(),
  ];

  const byUrl = new Map();
  for (const e of all) {
    if (!byUrl.has(e.url)) byUrl.set(e.url, e);
  }
  const unique = [...byUrl.values()];

  console.log(`Checking ${unique.length} unique image URL(s)...\n`);

  const results = await Promise.all(unique.map(checkUrl));

  const ok = results.filter((r) => r.ok);
  const fail = results.filter((r) => !r.ok);

  if (fail.length) {
    console.log("❌ FAILED (4xx/5xx or error):\n");
    for (const r of fail) {
      console.log(`  ${r.status}  ${r.url}`);
      console.log(`       source: ${r.source}`);
      if (r.error) console.log(`       error: ${r.error}`);
    }
    console.log("");
  }

  if (ok.length) {
    console.log("✅ OK:\n");
    for (const r of ok) {
      console.log(`  ${r.status}  ${r.url}`);
      console.log(`       source: ${r.source}`);
    }
  }

  console.log(`\n--- Summary: ${ok.length} OK, ${fail.length} failed ---`);
  process.exit(fail.length ? 1 : 0);
}

main();
