var EMBEDDED_INDEX_HTML = "__EMBEDDED_INDEX_HTML__";

const CRAWLER_UA = /googlebot|bingbot|slurp|duckduckbot|baiduspider|yandexbot|facebookexternalhit|twitterbot|rogerbot|linkedinbot|embedly|quora link preview|showyoubot|outbrain|pinterest|slackbot|vkshare|w3c_validator|whatsapp|telegram|applebot|petalbot|ahrefsbot|semrushbot|claudebot|gptbot|chatgpt-user|anthropic-ai|cohere-ai/i;

function isCrawler(request) {
  const ua = request.headers.get("user-agent") || "";
  return CRAWLER_UA.test(ua);
}

function isAssetPath(pathname) {
  return (
    pathname.startsWith("/uploads/") ||
    /\.(js|css|ico|svg|png|jpg|jpeg|gif|webp|woff2?|ttf|map|json)(\?.*)?$/i.test(pathname) ||
    pathname.startsWith("/assets/") ||
    pathname.startsWith("/admin")
  );
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const { pathname, origin } = url;

    // ===== PRE-2735 TEST ENDPOINTS =====
    // Paths under /__pre2735/ don't exist in dist/, so they bypass static asset serving.
    if (pathname === "/__pre2735/debug") {
      return new Response(
        JSON.stringify(
          {
            prerenderEnabled:
              env.ENABLE_PRERENDER === "true" || env.ENABLE_PRERENDER === "1",
            hasBase: !!env.PRERENDER_BASE,
            hasToken: !!env.PRERENDER_TOKEN,
            isCrawler: isCrawler(request),
            ua: request.headers.get("user-agent"),
          },
          null,
          2,
        ),
        { status: 200, headers: { "content-type": "application/json" } },
      );
    }

    if (
      pathname === "/__pre2735/happy" ||
      pathname === "/__pre2735/stripped" ||
      pathname === "/__pre2735/broken"
    ) {
      const mode = pathname.split("/").pop();
      const headers = new Headers({ "content-type": "text/html; charset=utf-8" });
      if (mode === "happy") {
        headers.set("x-prerender-requestid", "test-rid-happy");
      }
      const metaTag =
        mode === "broken"
          ? ""
          : '<meta rel="x-prerender-request-id" content="test-rid-meta">';
      const body = `<!DOCTYPE html><html><head><meta charset="UTF-8">${metaTag}<title>PRE-2735 ${mode}</title></head><body>ok</body></html>`;
      return new Response(body, { status: 200, headers });
    }
    // ===== /PRE-2735 =====

    try {
      const verifyPath = pathname.replace(/\/$/, "") || "/";
      if (["/.well-known/prerender-verify", "/prerender-verify", "/verify"].includes(verifyPath)) {
        return new Response("OK", {
          status: 200,
          headers: new Headers({
            "Content-Type": "text/plain; charset=utf-8",
            "X-Content-Type-Options": "nosniff",
          }),
        });
      }
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
      if (isAssetPath(pathname)) {
        try {
          const res2 = await env.ASSETS.fetch(request);
          if (res2 && res2.status === 200) {
            const h = new Headers(res2.headers);
            if (pathname.startsWith("/assets/")) {
              h.set("Access-Control-Allow-Origin", "*");
            }
            return new Response(res2.body, { status: res2.status, statusText: res2.statusText, headers: h });
          }
        } catch (_) {}
        return new Response("Not Found", { status: 404, headers: { "Content-Type": "text/plain" } });
      }
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
        if (!prerenderEnabled || !isCrawler(request)) {
          const res2 = await env.ASSETS.fetch(request);
          if (res2 && res2.status !== 404) return res2;
          return await env.ASSETS.fetch(new Request(new URL("/index.html", url).toString(), request));
        }
      }
      let prerenderAttempted = false;
      let prerenderStatus = null;
      const base = env.PRERENDER_BASE;
      const token = env.PRERENDER_TOKEN;
      if (prerenderEnabled && base && token && isCrawler(request)) {
        prerenderAttempted = true;
        try {
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
            if (url.searchParams.has("strip_header") || env.STRIP_PRERENDER_HEADER === "true") {
              headers.delete("x-prerender-requestid");
            }
            return new Response(prerenderRes.body, {
              status: prerenderRes.status,
              statusText: prerenderRes.statusText,
              headers,
            });
          }
          prerenderStatus = prerenderRes.status;
        } catch (e) {
          prerenderStatus = "error";
        }
      }
      let res;
      try {
        res = await env.ASSETS.fetch(request);
      } catch (_) {
        res = null;
      }
      if (res && res.status !== 404) return res;
      try {
        const indexRequest = new Request(new URL("/index.html", url).href, { method: "GET" });
        const spaRes = await env.ASSETS.fetch(indexRequest);
        if (!spaRes || !spaRes.ok) throw new Error("ASSETS fetch failed");
        if (prerenderAttempted) {
          const h2 = new Headers(spaRes.headers);
          h2.set("X-Prerender-Attempted", "1");
          if (prerenderStatus != null) h2.set("X-Prerender-Status", String(prerenderStatus));
          h2.set("Cache-Control", "public, max-age=300, s-maxage=300");
          return new Response(spaRes.body, { status: spaRes.status, headers: h2 });
        }
        const h = new Headers(spaRes.headers);
        h.set("Cache-Control", "public, max-age=300, s-maxage=300");
        return new Response(spaRes.body, { status: spaRes.status, headers: h });
      } catch (e) {
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
      if (isAssetPath(pathname)) {
        return new Response("Not Found", { status: 404, headers: { "Content-Type": "text/plain" } });
      }
      throw err;
    }
  },
};
