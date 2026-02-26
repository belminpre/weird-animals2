# Deploying to Cloudflare Pages

This project uses **Pages (advanced mode)** with a custom `_worker.js` and static files in `dist/`.

## Dashboard settings (Git integration)

In **Cloudflare Pages** → your project → **Settings** → **Builds & deployments**:

1. **Build command:** `npm run build`
2. **Build output directory:** `dist`
3. **Deploy command:** `cp _worker.js dist && npx wrangler pages deploy ./dist`

Or use the single script (build + copy worker + deploy):

- **Build command:** `npm run deploy:pages`
- **Build output directory:** leave empty (script handles deploy).

If your UI has separate "Build" and "Deploy" steps, set **Deploy command** to:

```bash
cp _worker.js dist && npx wrangler pages deploy ./dist
```

`_worker.js` must be inside the deployed directory for Pages to use it.

## Local / CI

From the repo root:

```bash
npm run deploy:pages
```

Runs: build → copy `_worker.js` into `dist/` → `wrangler pages deploy ./dist`.
