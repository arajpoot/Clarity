/* Clarity SW 20261013NC3 — multipage university safe
 * Network-first for HTML/navigate + campus buildings; cache assets.
 * One registration; old caches purged on activate.
 */
const CACHE = "clarity-20261013NC3";
const PRECACHE = ["/", "/robots.txt", "/campus/"];

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

function isBuilding(path) {
  const roots = [
    "/campus",
    "/lab",
    "/vault",
    "/journey",
    "/library",
    "/charter",
    "/systems"
  ];
  for (var i = 0; i < roots.length; i++) {
    var r = roots[i];
    if (path === r || path === r + "/" || path.indexOf(r + "/") === 0) return true;
  }
  return false;
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;
  const isNavigate =
    req.mode === "navigate" || path.endsWith(".html") || path === "/" || path === "";
  const isSeal = path.indexOf("/SEAL.json") >= 0 || path.indexOf("/boot.js") >= 0;
  const isMulti = isBuilding(path);

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
          if (isMulti || isSeal) return Promise.reject();
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
