/* Clarity Nur OS service worker · 20261011FINAL */
const CACHE = "clarity-20261012BANNER";
const PRECACHE = ["/", "/index.html", "/campus/", "/campus/index.html"];
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) =>
      Promise.all(PRECACHE.map((u) => c.add(u).catch(() => null)))
    ).then(() => self.skipWaiting())
  );
});
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});
self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (e.request.mode === "navigate" || url.pathname === "/" || url.pathname.endsWith(".html") || url.pathname.endsWith("/")) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const c = res.clone();
          caches.open(CACHE).then((cache) => cache.put(e.request, c)).catch(() => {});
          return res;
        })
        .catch(() => caches.match(e.request).then((r) => r || caches.match("/index.html")))
    );
    return;
  }
  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          if (res && res.ok) {
            const c = res.clone();
            caches.open(CACHE).then((cache) => cache.put(e.request, c)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(e.request))
    );
  }
});
