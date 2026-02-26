# Prerender + Cloudflare Worker: setup and form answers

## Security / compliance form answers (copy as needed)

**1. Verification behavior**

When we “add” a domain, there is no special verification endpoint or multi-URL verification crawl performed by Prerender. Our infrastructure (Cloudflare Worker) is configured to forward certain bot requests for our normal public URLs to Prerender. Prerender then issues standard HTTP GET requests to those URLs as needed. There is no dedicated “Verify” button behavior that hits a special path; any requests are just normal GETs to our existing public pages (e.g. `https://ourdomain.com/` and other crawlable paths). There is no separate verification success condition—Prerender expects normal HTTP responses (200, 301/302, 404, etc.) from our origin. No special header or HTML token is required. Integration success is determined by whether our proxy/CDN correctly forwards bot traffic to Prerender and Prerender can fetch and render our pages.

**2. IP addresses**

Prerender’s rendering service uses a set of IP addresses that should be allowlisted so Cloudflare (or other security layers) do not block or challenge them. The official, up-to-date list is maintained in Prerender’s documentation. We rely on that list to configure allowlists on Cloudflare and other firewalls.

- **Official list (use this):** https://ipranges.prerender.io/ipranges-all.txt  
- **Docs:** https://docs.prerender.io/docs/ip-addresses and https://docs.prerender.io/docs/how-can-i-whitelist-prerenders-ip-addresses-and-user-agents  

Example ranges (check the links above for current values): `103.207.40.0/22`, `104.224.12.0/22`, `2602:2dd::/36`, and sitemap crawler `5.161.0.0/16`. Update your allowlist at least monthly.

**3. User-Agent**

Requests from Prerender’s rendering service use a Prerender-specific User-Agent string that includes the word “Prerender”. We already treat any User-Agent containing “Prerender” as the Prerender crawler and allow it through our security layers.

**4. workers.dev / no custom domain**

Our site is currently only available on a Cloudflare Workers subdomain (`https://weird-animals.belmin.workers.dev`). Cloudflare’s protections on `*.workers.dev` likely block or challenge Prerender’s requests. There is no special bypass or manual approval flow on the Prerender side. The recommended approach is to serve the Worker behind a **custom domain** we control, then configure Prerender and our Cloudflare rules (including IP/User-Agent allowlisting) on that custom domain.

---

## Step-by-step: custom domain + Prerender on Cloudflare

You’re already using Cloudflare (Worker + env vars). To get Prerender working and verification passing:

### 1. Add a custom domain or subdomain to the Worker

1. Cloudflare Dashboard → **Workers & Pages** → project **weird-animals**.
2. **Settings** → **Domains & routes** (or **Triggers** → **Custom Domains**).
3. **Add Custom Domain** → enter your hostname (e.g. `weird-animals.duckdns.org` or `weird-animals.yourdomain.com`).
4. Add the CNAME (or A/AAAA) record Cloudflare shows to your DNS (DuckDNS, Freenom, your registrar, etc.). Wait until the domain shows as **Active**.

**Routes (subdomains)** — Cloudflare is route-based; Prerender’s guide supports subdomains with patterns like:

| You want | Route pattern |
|----------|----------------|
| One specific subdomain (e.g. your site) | `weird-animals.duckdns.org/*` |
| Any subdomain on a domain you own | `*.yourdomain.com/*` |
| Multiple specific subdomains | `sub1.yourdomain.com/*` and `sub2.yourdomain.com/*` (or one route with regex) |

The `/*` is required so all paths are matched, not just the root. For this project you only need the single custom hostname (step 3); the route is created when you add it. The table above is for reference if you later use multiple subdomains or a dedicated Prerender proxy Worker.

### 2. Allowlist Prerender’s IPs on your domain

If your **custom domain’s** DNS is on **Cloudflare** (same or another zone):

1. Go to the **zone** for that domain (e.g. `yourdomain.com`) → **Security** → **WAF** (or **Tools** → **IP Access Rules**, depending on plan).
2. Add **allow** rules for Prerender’s IPs. Use the list from:
   - https://ipranges.prerender.io/ipranges-all.txt  
   Or the ranges from:
   - https://docs.prerender.io/docs/ip-addresses  
   So Prerender’s requests are not challenged or blocked.

If you use **IP Access Rules**: create rules that **Allow** the IP ranges from the Prerender doc. If you use **WAF custom rules**: add a rule that allows requests when the source IP is in those ranges (or when the request is to your origin and you’ve identified Prerender by IP).

### 3. Add the custom domain in Prerender

1. In Prerender’s dashboard, add your site using the **custom domain** URL, e.g. `https://weird-animals.yourdomain.com`.
2. Run **Verify**. The request goes to your domain; your Worker still runs; with IPs allowlisted, Prerender should get a 200.

### 4. Turn Prerender on for crawlers (optional)

Once verification passes, in your Worker’s **Settings** → **Variables and secrets**, set:

- **ENABLE_PRERENDER** = `true`

Redeploy if needed. Then crawler traffic to your custom domain will be sent to Prerender (using `PRERENDER_BASE` and `PRERENDER_TOKEN`), and Prerender will serve prerendered HTML for bots.

---

## Quick reference

| Item | Value |
|------|--------|
| Prerender IP list | https://ipranges.prerender.io/ipranges-all.txt |
| Prerender IP/UA docs | https://docs.prerender.io/docs/ip-addresses , https://docs.prerender.io/docs/how-can-i-whitelist-prerenders-ip-addresses-and-user-agents |
| Worker env for crawler prerender | `ENABLE_PRERENDER=true`, `PRERENDER_BASE`, `PRERENDER_TOKEN` |
| **Staging** (use staging API) | `PRERENDER_BASE` = `https://private-cache.internal.prerender-staging.dev` |
| **Production** | `PRERENDER_BASE` = `https://service.prerender.io` |
| User-Agent | Contains `Prerender` (already handled in `_worker.js`) |
