# Domain verification (e.g. Prerender) still failing

When you enter only the **domain** (e.g. `https://weird-animals.belmin.workers.dev`), the integration fetches the **root** (`/`). The Worker now:

- Serves **minimal HTML with `<meta name="prerender-verify" content="ok">`** when the request looks like a verifier (User-Agent contains "prerender", "verify", "bot", "curl", etc.).
- Serves the real site for normal browsers.

If verification still fails, the request may **never reach your Worker** (see below).

## 1. Use a custom verification URL (if the integration allows it)

The Worker now responds with **200 OK** at these paths:

- `https://weird-animals.belmin.workers.dev/.well-known/prerender-verify`
- `https://weird-animals.belmin.workers.dev/prerender-verify`
- `https://weird-animals.belmin.workers.dev/verify`

If the integration lets you set a **verification URL**, use one of the above.  
Test in a browser or with:

```bash
curl -I https://weird-animals.belmin.workers.dev/verify
```

You should see `200 OK`.

## 2. Likely cause: Cloudflare is blocking the verifier

**\*.workers.dev** is Cloudflare’s domain. They may apply **bot / security** rules (Bot Fight Mode, challenges) to requests from the integration’s servers **before** the request hits your Worker. You cannot turn that off for `*.workers.dev`.

**Options:**

- **Use your own domain**  
  Add a **custom domain** to your Worker in the Cloudflare dashboard (e.g. `weird-animals.yourdomain.com`). Then in the integration, **add and verify that domain** instead of `weird-animals.belmin.workers.dev`. On your own zone you can relax WAF / bot rules or allowlist the integration’s IPs.

- **Whitelist the integration’s IPs**  
  If the integration documents **IP addresses** to allow, and you use a **custom domain** on a zone you control, add a WAF rule or allowlist so those IPs are not challenged/blocked.

- **Ask the integration**  
  Contact their support and say: “Verification fails for my Workers URL. Do you support a custom verification URL (e.g. `https://my-site.com/verify`)? Can you provide the IPs your verifier uses so I can allowlist them on my domain?”

## 3. Confirm the Worker URL

Your Worker’s public URL is determined by **`name` in `wrangler.toml`** and your account subdomain. If your repo/project is `weird-animals2` but `wrangler.toml` has `name = "weird-animals"`, the URL is:

- `https://weird-animals.<YOUR_SUBDOMAIN>.workers.dev`

Replace `<YOUR_SUBDOMAIN>` with your actual subdomain (e.g. `belmin`). Use that exact URL in the integration.

## 4. Quick checklist

- [ ] Deploy the latest Worker (with the `/verify` and `/.well-known/prerender-verify` routes).
- [ ] Test: `curl -I https://weird-animals.belmin.workers.dev/verify` returns 200.
- [ ] If the integration allows a custom verification URL, use one of the paths in section 1.
- [ ] Prefer adding a **custom domain** and verifying that domain instead of `*.workers.dev`.
- [ ] If you use a custom domain, whitelist the integration’s IPs if they provide them.
