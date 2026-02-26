# Deploying to Cloudflare Workers

This project uses **Workers + Assets**: `_worker.js` plus static files in `dist/`.

## Why “build skipped” / deploy fails

If the **build step never runs**, there is no `dist/` folder. Then `wrangler deploy` runs without assets and fails.

You must run the app build **before** Wrangler deploy.

## Option A: Cloudflare dashboard (Git integration)

In your Cloudflare Workers/Pages project → **Settings** → **Builds & deployments**:

1. **Build command:** `npm run build`  
   (Do not leave this empty.)
2. **Build output directory:** `dist`
3. **Deploy command** (if separate): `npx wrangler deploy`  
   Or use a single build command: `npm run deploy` (runs build then deploy).

Save and redeploy.

## Option B: Single command (CI or local)

From the repo root:

```bash
npm run deploy
```

This runs `npm run build` then `npx wrangler deploy`, so the build is never skipped.

## Option C: GitHub Actions

Add a workflow that installs deps, runs `npm run build`, then `npx wrangler deploy` (with `CLOUDFLARE_API_TOKEN` in secrets). Then the build always runs in CI before deploy.
