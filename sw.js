/* Clarity Service Worker — Seeker-first offline shell 20261006DP */
const CACHE = "clarity-seeker-v20261006DP";
const PRECACHE = [
  "/",
  "/index.html",
  "/assets/clarity-critical-css-v1.css?v=20261006DP",
  "/assets/clarity-css-patches-v1.css?v=20261006DP",
  "/assets/clarity-runtime-overlays-v1.js?v=20261006DP",
  "/assets/curriculum/pathway-hydrator-v1.js?v=20261006DP",
  "/assets/clarity-path-progress-v1.js?v=20261006DP",
  "/assets/clarity-chunk-8.js?v=20261006DP",
  "/assets/clarity-track-os-v3.js?v=20261006DP",
  "/robots.txt"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        PRECACHE.map((url) =>
          cache.add(url).catch(() => null)
        )
      )
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // Only same-origin
  if (url.origin !== self.location.origin) return;

  // Network-first for HTML (always fresh index)
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

  // Cache-first for versioned assets
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
