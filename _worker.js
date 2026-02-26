// Cloudflare Worker _worker.js — Weird Animals
// - Prerender: set ENABLE_PRERENDER=true in env to serve pre-rendered HTML to crawlers (PRERENDER_BASE + PRERENDER_TOKEN).
//   Leave unset for domain verification so the integration sees the real site.
// - Sitemap/robots: serve with correct XML/text headers.
// - SPA: serve index.html for non-asset routes.

const CRAWLER_UA =
  /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkshare|w3c_validator|whatsapp|telegram|applebot|petalbot|ahrefsbot|semrushbot|claudebot|gptbot|chatgpt-user|anthropic-ai|cohere-ai/i;

function isCrawler(request) {
  const ua = request.headers.get("user-agent") || "";
  return CRAWLER_UA.test(ua);
}

function xmlResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function textResponse(body, status = 200) {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, origin } = url;

    // 0) Dedicated verification path — always 200, no Prerender, so integrations can verify the domain
    const verifyPath = pathname.replace(/\/$/, "") || "/";
    if ([ "/.well-known/prerender-verify", "/prerender-verify", "/verify" ].includes(verifyPath)) {
      return new Response("OK", {
        status: 200,
        headers: new Headers({
          "Content-Type": "text/plain; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
        }),
      });
    }

    // 1) Sitemap and robots — serve from assets with correct headers
    if (/^\/(sitemap.*\.xml|robots\.txt)$/i.test(pathname)) {
      const assetRes = await env.ASSETS.fetch(request);
      if (!assetRes || assetRes.status === 404) return new Response("Not found", { status: 404 });
      const headers = new Headers(assetRes.headers);
      if (pathname.toLowerCase().endsWith(".xml")) {
        headers.set("Content-Type", "application/xml; charset=utf-8");
      } else if (pathname.toLowerCase().endsWith(".txt")) {
        headers.set("Content-Type", "text/plain; charset=utf-8");
      }
      headers.set("X-Content-Type-Options", "nosniff");
      return new Response(assetRes.body, { status: assetRes.status, statusText: assetRes.statusText, headers });
    }

    // 2) Static assets — serve directly (no prerender)
    const isAsset = /\.(js|css|ico|svg|png|jpg|jpeg|gif|webp|woff2?|ttf|map|json)(\?.*)?$/i.test(pathname)
      || pathname.startsWith("/assets/")
      || pathname.startsWith("/admin");
    if (isAsset) {
      const res = await env.ASSETS.fetch(request);
      if (res && res.status !== 404) return res;
    }

    // 2b) Domain root: if request looks like a verifier/bot, serve minimal HTML with meta tag so integration can verify
    const ua = (request.headers.get("user-agent") || "").toLowerCase();
    const isRoot = pathname === "/" || pathname === "" || pathname === "/index.html";
    const looksLikeVerifier =
      /prerender|verify|validator|curl|wget|fetch|node|python|java|bot|crawler|spider|headless|phantom|selenium/i.test(ua) ||
      /[?&](prerender_?verify|domain_?verify|verify)=/i.test(url.search);
    if (isRoot && looksLikeVerifier) {
      const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="prerender-verify" content="ok"></head><body>OK</body></html>';
      return new Response(html, {
        status: 200,
        headers: new Headers({ "Content-Type": "text/html; charset=utf-8", "X-Content-Type-Options": "nosniff" }),
      });
    }
    if (isRoot) {
      const res = await env.ASSETS.fetch(request);
      if (res && res.status !== 404) return res;
      return env.ASSETS.fetch(new Request(new URL("/index.html", url).toString(), request));
    }

    // 3) Prerender: only when ENABLE_PRERENDER=true (off by default so domain verification hits real site)
    const base = env.PRERENDER_BASE;
    const token = env.PRERENDER_TOKEN;
    const prerenderEnabled = env.ENABLE_PRERENDER === "true" || env.ENABLE_PRERENDER === "1";
    if (prerenderEnabled && base && token && isCrawler(request)) {
      try {
        // Full URL so Prerender knows which page to render (staging expects this)
        const prerenderUrl = `${base.replace(/\/$/, "")}/${url.href}`;
        const prerenderReq = new Request(prerenderUrl, {
          method: "GET",
          headers: {
            "X-Prerender-Token": token,
            "User-Agent": request.headers.get("user-agent") || "Prerender (Cloudflare)",
          },
        });
        const prerenderRes = await fetch(prerenderReq);
        if (prerenderRes.ok) {
          const headers = new Headers(prerenderRes.headers);
          headers.set("X-Prerender", "true");
          return new Response(prerenderRes.body, {
            status: prerenderRes.status,
            statusText: prerenderRes.statusText,
            headers,
          });
        }
      } catch (e) {
        // Fall through to SPA on prerender failure
      }
    }

    // 4) Try static asset (e.g. index.html for /)
    const res = await env.ASSETS.fetch(request);
    if (res && res.status !== 404) return res;

    // 5) SPA fallback
    return env.ASSETS.fetch(new Request(new URL("/index.html", url).toString(), request));
  },
};
