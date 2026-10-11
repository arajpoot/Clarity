/* Clarity SW 20261009MP3 — multipage safe
 * Network-first HTML + SEAL; cache other assets; one registration only.
 */
const CACHE = "clarity-20261009MP3";
const PRECACHE = ["/", "/robots.txt"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => Promise.all(PRECACHE.map((u) => c.add(u).catch(() => null))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;
  /* Never serve SPA fallback for multipage buildings */
  const isNavigate =
    req.mode === "navigate" || path.endsWith(".html") || path === "/" || path === "";
  const isSeal = path.indexOf("/SEAL.json") >= 0 || path.indexOf("/boot.js") >= 0;
  const isMulti =
    path === "/campus" ||
    path === "/campus/" ||
    path.indexOf("/campus/") === 0 ||
    path === "/lab" ||
    path === "/lab/" ||
    path.indexOf("/lab/") === 0 ||
    path === "/vault" ||
    path === "/vault/" ||
    path.indexOf("/vault/") === 0;

  if (isNavigate || isSeal || isMulti) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok && isNavigate) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => {
          if (isMulti || isSeal) return fetch(req);
          return caches.match(req).then((r) => r || caches.match("/"));
        })
    );
    return;
  }

  if (path.startsWith("/assets/")) {
    e.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => caches.match(req))
    );
  }
});
