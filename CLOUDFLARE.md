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

## Local deploy when `wrangler login` fails (403 / bot challenge)

Use an **API token** so Wrangler doesn’t need browser OAuth:

1. In Cloudflare: **Profile** → **API Tokens** → **Create Token** → use a template that includes **Workers** (e.g. “Edit Cloudflare Workers”) or create a custom token with **Account** → **Cloudflare Workers Scripts** → **Edit**.
2. Create the token and copy the value.
3. In your terminal (from the project directory, after `npm run build`):
   ```bash
   export CLOUDFLARE_API_TOKEN="your_token_here"
   npx wrangler deploy
   ```
   Or run in one line: `CLOUDFLARE_API_TOKEN="your_token_here" npx wrangler deploy`

No browser login is used; the token is enough for deploy.

## Deploy via Git (no local Wrangler)

Push to the connected repo; Cloudflare runs **Build command** and **Deploy command** and deploys the Worker. Ensure the latest `_worker.js` and code are committed and pushed.

## Local / CI

From the repo root:

```bash
npm install && npm run build && npx wrangler deploy
```

If you use Pages deploy: `npm run deploy:pages` (build → copy `_worker.js` into `dist/` → `wrangler pages deploy ./dist`).

## Prerender (Worker env vars)

- **ENABLE_PRERENDER** and **PRERENDER_BASE** are set in `wrangler.toml` so the Worker gets them on every deploy (including Git).
- **PRERENDER_TOKEN** is a secret. Set it once from your machine (then Git deploys keep using it):

  ```bash
  npx wrangler secret put PRERENDER_TOKEN
  ```
  Paste your Prerender API token when prompted. Token is stored in Cloudflare and bound to the Worker **weird-animals**.

See **PRERENDER-SETUP.md** for full setup.
