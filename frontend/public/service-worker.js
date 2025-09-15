/* eslint-env serviceworker */
// Enhanced offline caching for ESRS PWA
// Strategy:
// - Precache core shell + dataset + template (if exists)
// - Runtime cache for templates & snapshot export retrieval
// - Provide offline response for last snapshot via virtual URL /offline/last-snapshot.json

const CORE_VERSION = "v2";
const CORE_CACHE = `esrs-core-${CORE_VERSION}`;
const RUNTIME_CACHE = "esrs-runtime";

const CORE_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/logo192.png",
  "/logo512.png",
  "/templates/template-bilancio.docx", // optional
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then(async (cache) => {
      try {
        await cache.addAll(CORE_ASSETS);
      } catch (e) {
        // Some assets (like template) may be missing; ignore
      }
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("esrs-core-") && k !== CORE_CACHE)
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

function isHtmlRequest(request) {
  return (
    request.mode === "navigate" ||
    (request.headers.get("accept") || "").includes("text/html")
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Virtual endpoint serving last snapshot offline
  if (new URL(request.url).pathname === "/offline/last-snapshot.json") {
    event.respondWith(
      (async () => {
        try {
          const data = await self.clients
            .matchAll({ includeUncontrolled: true })
            .then((clients) => {
              // We cannot access localStorage directly from SW; fallback to simple 404-like stub.
              // Future enhancement: use postMessage from app to SW to store snapshot in IDB.
              return null;
            });
          const body = data
            ? JSON.stringify(data)
            : JSON.stringify({
                offline: true,
                note: "Snapshot not synchronized to SW storage yet.",
              });
          return new Response(body, {
            headers: { "Content-Type": "application/json" },
          });
        } catch (e) {
          return new Response(JSON.stringify({ error: "unavailable" }), {
            status: 503,
          });
        }
      })()
    );
    return;
  }

  if (isHtmlRequest(request)) {
    // Network-first for navigations, fallback to cache
    event.respondWith(
      fetch(request)
        .then((resp) => {
          const copy = resp.clone();
          caches.open(CORE_CACHE).then((c) => c.put(request, copy));
          return resp;
        })
        .catch(() => caches.match("/index.html"))
    );
    return;
  }

  if (request.url.includes("/templates/")) {
    // Cache-first for template
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((resp) => {
            const copy = resp.clone();
            caches.open(CORE_CACHE).then((c) => c.put(request, copy));
            return resp;
          })
      )
    );
    return;
  }

  // Default runtime caching (stale-while-revalidate for static assets)
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((networkResp) => {
          if (
            networkResp &&
            networkResp.status === 200 &&
            networkResp.type === "basic"
          ) {
            const copy = networkResp.clone();
            caches.open(RUNTIME_CACHE).then((c) => c.put(request, copy));
          }
          return networkResp;
        })
        .catch(() => cached);
      return cached || fetchPromise;
    })
  );
});

// Listen for snapshot sync message (app can send latest snapshot for offline access)
self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SYNC_SNAPSHOT") {
    // Future: store snapshot in IndexedDB (currently placeholder)
    // event.data.payload would contain snapshot
  }
});
