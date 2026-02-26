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

1. **Use a custom domain (recommended)**  
   Add a **custom domain** to this Worker in Cloudflare (e.g. `weird-animals.yourdomain.com`).  
   In Prerender, **add and “verify” that domain** instead of `weird-animals.belmin.workers.dev`.  
   On your own domain you control WAF/bot rules and can allowlist Prerender’s IPs if needed.

2. **Allowlist Prerender’s IPs (if you use a custom domain)**  
   If Prerender provides a list of IPs, add a WAF allowlist for those IPs on the zone that serves your custom domain so their crawler is not challenged.

3. **Optional: ask Prerender for IPs**  
   You can ask: “Which IPs do you use when crawling our origin so we can allowlist them on our custom domain?” and then allowlist them in Cloudflare for that domain.

## Summary

- No special verification URL or meta tag is required; your Worker already integrates Prerender at the proxy level.
- Verification fails on `*.workers.dev` because Cloudflare’s global bot/security for that host can block Prerender’s requests.
- Use a **custom domain** for this Worker and verify that domain in Prerender; that’s the reliable fix.
