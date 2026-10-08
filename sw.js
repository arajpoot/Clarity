/* Clarity Service Worker — full production shell 20261008FULL */
const CACHE = "clarity-20261008FULL";
const PRECACHE = [
  "/",
  "/index.html",
  "/assets/clarity-critical-css-v1.css?v=20261008FULL",
  "/assets/clarity-css-patches-v1.css?v=20261008FULL",
  "/assets/clarity-runtime-overlays-v1.js?v=20261008FULL",
  "/assets/clarity-chunk-8.js?v=20261008FULL",
  "/assets/clarity-feature-pack-v1.js?v=20261008FULL",
  "/assets/clarity-path-pack-v1.js?v=20261008FULL",
  "/assets/clarity-aux-pack-v1.js?v=20261008FULL",
  "/assets/clarity-amana-vault-gate-js-v1.js?v=20261008FULL",
  "/robots.txt"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(PRECACHE.map((url) => cache.add(url).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname === "/") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(req).then((r) => r || caches.match("/index.html")))
    );
    return;
  }

  if (url.pathname.startsWith("/assets/")) {
    event.respondWith(
      caches.match(req).then((cached) => {
        if (cached) return cached;
        return fetch(req).then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        });
      })
    );
  }
});
