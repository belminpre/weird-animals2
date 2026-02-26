# Prerender integration and “domain verification”

## How Prerender works (no special verification)

Prerender does **not** use TXT records, meta tags, or a dedicated verification URL. It:

- **Crawls your public URLs** the same way search engines do (e.g. `https://yourdomain.com/`, `/some-page`).
- Uses a **User-Agent that contains "Prerender"** when fetching from your origin.
- Requires **no verification meta tag or token** in the HTML. Integration is done at the **proxy/CDN** (your Cloudflare Worker), not in the page.

So when the dashboard “verifies” your domain, it is effectively checking that Prerender’s crawler can reach your site and get a normal response (e.g. 200).

## How this project is wired (Cloudflare Worker)

- **Worker:** `_worker.js` in front of static assets in `dist/`.
- **When `ENABLE_PRERENDER` is not set (default):** All requests, including Prerender’s crawler (UA contains "Prerender"), are served from your origin (assets/SPA). So Prerender just gets your real pages.
- **When `ENABLE_PRERENDER=true`:** Requests that look like crawlers are sent to the Prerender API (using `PRERENDER_BASE` + `PRERENDER_TOKEN`); Prerender returns rendered HTML and the Worker serves that. So search engines and Prerender’s own crawler get prerendered content.

So Prerender is integrated at the CDN/Worker level, as they expect.

## Why “verification” can fail on `*.workers.dev`

The dashboard check is: “Can we fetch your URL?” If that fails, it’s usually because:

- **Cloudflare is blocking or challenging the request** before it reaches your Worker. The `*.workers.dev` hostname is on Cloudflare’s zone; they may apply bot/challenge rules to requests from Prerender’s IPs. You cannot change those rules for `*.workers.dev`.
- So Prerender’s servers may get a **403, 503, or a challenge page** instead of your Worker’s 200.

Your Worker is configured correctly; the failure is at the **hostname/zone** level, not the integration logic.

## What to do

### Option A: Try a URL with query string (quick test)

If Prerender’s “Add domain” or “Website URL” field accepts a **full URL** (not just the domain), try:

```text
https://weird-animals.belmin.workers.dev/?prerender_verify=1
```

The Worker treats that as a verifier request and responds with minimal HTML. If Prerender only stores the host and crawls the root without the query string, this won’t help.

### Option B: Use a custom domain (reliable fix)

Verification often fails on `*.workers.dev` because **Cloudflare may block or challenge Prerender’s requests before they reach your Worker**. You can’t change that for `workers.dev`. Using your own domain fixes it:

1. **Add a custom domain to the Worker**
   - Cloudflare Dashboard → **Workers & Pages** → your project **weird-animals** → **Settings** → **Domains & routes** (or **Triggers** → **Custom Domains**).
   - Click **Add** / **Add Custom Domain**.
   - Enter a hostname you own (e.g. `weird-animals.yourdomain.com` or a subdomain like `animals.yourdomain.com`).
   - Follow the steps (add the CNAME they show to your DNS for that hostname). Wait until the domain shows as active.

2. **In Prerender, add that domain**
   - Use `https://weird-animals.yourdomain.com` (or whatever hostname you added) as the site URL.
   - Run “Verify” again. The request goes to your domain; your Worker still runs, and Cloudflare won’t apply the same bot rules as on `*.workers.dev`.

3. **Optional: allowlist Prerender’s IPs**
   - If Prerender documents IPs to allow, in Cloudflare go to your **domain’s** zone (not Workers) → **Security** → **WAF** (or **Tools** → **IP Access Rules**) and allow those IPs so their crawler isn’t challenged.

## Summary

- No special verification URL or meta tag is required; your Worker already integrates Prerender at the proxy level.
- Verification fails on `*.workers.dev` because Cloudflare’s global bot/security for that host can block Prerender’s requests.
- Use a **custom domain** for this Worker and verify that domain in Prerender; that’s the reliable fix.
