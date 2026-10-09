/* Clarity SW 20261008FULL2 */
const CACHE = "clarity-20261008FULL2";
const PRECACHE = ["/", "/index.html", "/assets/clarity-critical-css-v1.css?v=20261008FULL2", "/assets/clarity-css-patches-v1.css?v=20261008FULL2", "/assets/clarity-runtime-overlays-v1.js?v=20261008FULL2", "/assets/clarity-chunk-8.js?v=20261008FULL2", "/assets/clarity-feature-pack-v1.js?v=20261008FULL2", "/assets/clarity-path-pack-v1.js?v=20261008FULL2", "/assets/clarity-aux-pack-v1.js?v=20261008FULL2", "/assets/clarity-amana-vault-gate-js-v1.js?v=20261008VAULTISOISO","/assets/clarity-amana-vault-access-v1.js?v=20261008VAULTISOISO","/assets/clarity-amana-vault-css-v1.css?v=20261008FULL2", "/robots.txt"];
self.addEventListener("install", (e) => { e.waitUntil(caches.open(CACHE).then((c) => Promise.all(PRECACHE.map((u) => c.add(u).catch(() => null)))).then(() => self.skipWaiting())); });
self.addEventListener("activate", (e) => { e.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener("fetch", (e) => {
  const req = e.request; if (req.method !== "GET") return;
  const url = new URL(req.url); if (url.origin !== self.location.origin) return;
  if (req.mode === "navigate" || url.pathname.endsWith(".html") || url.pathname === "/") {
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); return res; }).catch(() => caches.match(req).then((r) => r || caches.match("/index.html"))));
    return;
  }
  if (url.pathname.startsWith("/assets/")) {
    e.respondWith(caches.match(req).then((cached) => cached || fetch(req).then((res) => { if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {}); } return res; })));
  }
});
