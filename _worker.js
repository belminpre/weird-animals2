// Cloudflare Worker _worker.js — Weird Animals
// - Prerender: set ENABLE_PRERENDER=true in env to serve pre-rendered HTML to crawlers (PRERENDER_BASE + PRERENDER_TOKEN).
//   Leave unset for domain verification so the integration sees the real site.
// - Sitemap/robots: serve with correct XML/text headers.
// - SPA: serve index.html for non-asset routes.
// - Build injects index.html into EMBEDDED_INDEX_HTML for SPA fallback when ASSETS.fetch fails.

const EMBEDDED_INDEX_HTML = "__EMBEDDED_INDEX_HTML__";

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

function isAssetPath(pathname) {
  return pathname.startsWith("/uploads/")
    || /\.(js|css|ico|svg|png|jpg|jpeg|gif|webp|woff2?|ttf|map|json)(\?.*)?$/i.test(pathname)
    || pathname.startsWith("/assets/")
    || pathname.startsWith("/admin");
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, origin } = url;
    try {
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

    // 0b) 404 Checker / bogus URLs — return hard 404 so Prerender and checker see proper status
    if (pathname.includes("404check")) {
      const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="prerender-status-code" content="404"><title>Page not found</title></head><body><h1>Page not found</h1><p>The page you're looking for doesn't exist.</p></body></html>`;
      return new Response(html, {
        status: 404,
        headers: new Headers({
          "Content-Type": "text/html; charset=utf-8",
          "X-Content-Type-Options": "nosniff",
          "Cache-Control": "public, max-age=300, s-maxage=300",
        }),
      });
    }

    // 1) Sitemap and robots — serve from assets with correct headers, cacheable
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
      headers.set("Cache-Control", "public, max-age=3600, s-maxage=3600");
      return new Response(assetRes.body, { status: assetRes.status, statusText: assetRes.statusText, headers });
    }

    // 2) Static assets (including /uploads/*.jpg) — return 404 if missing, never 500
    if (isAssetPath(pathname)) {
      try {
        const res = await env.ASSETS.fetch(request);
        if (res && res.status === 200) {
          const h = new Headers(res.headers);
          if (pathname.startsWith("/assets/")) {
            h.set("Access-Control-Allow-Origin", "*");
          }
          return new Response(res.body, { status: res.status, statusText: res.statusText, headers: h });
        }
      } catch (_) {
        // ASSETS.fetch can throw for missing files
      }
      return new Response("Not Found", { status: 404, headers: { "Content-Type": "text/plain" } });
    }

    // 2b) Domain root: if request looks like a verifier AND Prerender is off, serve minimal HTML so integration can verify
    const ua = (request.headers.get("user-agent") || "").toLowerCase();
    const isRoot = pathname === "/" || pathname === "" || pathname === "/index.html";
    const prerenderEnabled = env.ENABLE_PRERENDER === "true" || env.ENABLE_PRERENDER === "1";
    const looksLikeVerifier =
      /prerender.*verify|verify.*prerender|validator|curl|wget|fetch|domain.*verif/i.test(ua) ||
      /[?&](prerender_?verify|domain_?verify|verify)=/i.test(url.search);
    if (isRoot && looksLikeVerifier && !prerenderEnabled) {
      const html = '<!DOCTYPE html><html><head><meta charset="UTF-8"><meta name="prerender-verify" content="ok"></head><body>OK</body></html>';
      return new Response(html, {
        status: 200,
        headers: new Headers({ "Content-Type": "text/html; charset=utf-8", "X-Content-Type-Options": "nosniff" }),
      });
    }
    if (isRoot) {
      // When Prerender is on, let crawlers fall through to the Prerender block; only serve ASSETS for non-crawlers
      if (!prerenderEnabled || !isCrawler(request)) {
        const res = await env.ASSETS.fetch(request);
        if (res && res.status !== 404) return res;
        return await env.ASSETS.fetch(new Request(new URL("/index.html", url).toString(), request));
      }
    }

    // 3) Prerender: only when ENABLE_PRERENDER=true (off by default so domain verification hits real site)
    let prerenderAttempted = false;
    let prerenderStatus = null; // set when Prerender returns non-2xx so we can expose it in headers
    const base = env.PRERENDER_BASE;
    const token = env.PRERENDER_TOKEN;
    if (prerenderEnabled && base && token && isCrawler(request)) {
      prerenderAttempted = true;
      try {
        // Same format as docs: GET base + "/" + full URL, header X-Prerender-Token
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
          headers.set("Cache-Control", "public, max-age=300, s-maxage=300");
          return new Response(prerenderRes.body, {
            status: prerenderRes.status,
            statusText: prerenderRes.statusText,
            headers,
          });
        }
        prerenderStatus = prerenderRes.status; // e.g. 403, 500 — so fallback can expose it
      } catch (e) {
        prerenderStatus = "error"; // fetch threw (network, etc.)
      }
    }

    // 4) Try static asset (e.g. index.html for /)
    let res;
    try {
      res = await env.ASSETS.fetch(request);
    } catch (_) {
      res = null;
    }
    if (res && res.status !== 404) return res;

    // 5) SPA fallback — request index.html from ASSETS (same path as root uses)
    try {
      const indexRequest = new Request(new URL("/index.html", url).href, { method: "GET" });
      const spaRes = await env.ASSETS.fetch(indexRequest);
      if (!spaRes || !spaRes.ok) throw new Error("ASSETS fetch failed");
      if (prerenderAttempted) {
        const h = new Headers(spaRes.headers);
        h.set("X-Prerender-Attempted", "1");
        if (prerenderStatus != null) h.set("X-Prerender-Status", String(prerenderStatus));
        h.set("Cache-Control", "public, max-age=300, s-maxage=300");
        return new Response(spaRes.body, { status: spaRes.status, headers: h });
      }
      const h = new Headers(spaRes.headers);
      h.set("Cache-Control", "public, max-age=300, s-maxage=300");
      return new Response(spaRes.body, { status: spaRes.status, headers: h });
    } catch (e) {
      // ASSETS.fetch failed — serve embedded index.html so SPA loads (injected at build time)
      if (EMBEDDED_INDEX_HTML && EMBEDDED_INDEX_HTML !== "__EMBEDDED_INDEX_HTML__") {
        const h = new Headers({ "Content-Type": "text/html; charset=utf-8" });
        h.set("Cache-Control", "public, max-age=300, s-maxage=300");
        if (prerenderAttempted) {
          h.set("X-Prerender-Attempted", "1");
          if (prerenderStatus != null) h.set("X-Prerender-Status", String(prerenderStatus));
        }
        return new Response(EMBEDDED_INDEX_HTML, { status: 200, headers: h });
      }
      return new Response("Not Found", { status: 404 });
    }
    } catch (err) {
      // Any uncaught error: for asset paths return 404 so images never 500
      if (isAssetPath(pathname)) {
        return new Response("Not Found", { status: 404, headers: { "Content-Type": "text/plain" } });
      }
      throw err;
    }
  },
};
