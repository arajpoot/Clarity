/* Clarity SW Phase A — per-room cache buckets · network-first HTML · enrichment hold
 * Educational only — not a fatwa.
 * Cache names are versioned; activate purges unknown buckets.
 */
const SW_VERSION = "20261106A1";
const ROOM_CACHES = {
  port: "clarity-port-v" + SW_VERSION,
  yawm: "clarity-yawm-v" + SW_VERSION,
  companion: "clarity-companion-v" + SW_VERSION,
  campus: "clarity-campus-v" + SW_VERSION,
  amana: "clarity-amana-desk-v" + SW_VERSION,
  craft: "clarity-craft-static-v" + SW_VERSION,
  assets: "clarity-assets-v" + SW_VERSION
};

const PRECACHE = {
  port: ["/", "/index.html", "/robots.txt", "/assets/port-castle-v1.css", "/assets/port-castle-v1.js", "/assets/room-nav/clarity-room-nav-v1.css"],
  yawm: ["/daily/", "/daily/index.html", "/daily/assets/daily.css"],
  companion: ["/companion/"],
  campus: ["/campus/"],
  amana: ["/amana/"],
  craft: ["/craft/"]
};

function cacheNameForPath(path) {
  if (path === "/" || path === "" || path === "/index.html") return ROOM_CACHES.port;
  if (path.indexOf("/daily") === 0) return ROOM_CACHES.yawm;
  if (path.indexOf("/companion") === 0) return ROOM_CACHES.companion;
  if (path.indexOf("/campus") === 0) return ROOM_CACHES.campus;
  if (path.indexOf("/amana") === 0) return ROOM_CACHES.amana;
  if (path.indexOf("/craft") === 0) return ROOM_CACHES.craft;
  if (path.indexOf("/assets/") === 0) return ROOM_CACHES.assets;
  return ROOM_CACHES.port;
}

self.addEventListener("install", (e) => {
  e.waitUntil(
    (async () => {
      for (const [room, urls] of Object.entries(PRECACHE)) {
        const name = ROOM_CACHES[room] || ROOM_CACHES.port;
        const c = await caches.open(name);
        await Promise.all(urls.map((u) => c.add(u).catch(() => null)));
      }
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    (async () => {
      const keep = new Set(Object.values(ROOM_CACHES));
      const keys = await caches.keys();
      await Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)));
      await self.clients.claim();
    })()
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  const path = url.pathname;
  const isNavigate =
    req.mode === "navigate" || path.endsWith(".html") || path === "/" || path === "";
  const bucket = cacheNameForPath(path);

  if (isNavigate) {
    e.respondWith(
      (async () => {
        try {
          const timed = await Promise.race([
            fetch(req),
            new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), 8000))
          ]);
          if (timed && timed.ok) {
            const copy = timed.clone();
            caches.open(bucket).then((c) => c.put(req, copy)).catch(() => {});
            return timed;
          }
        } catch (err) {}
        const hit = await caches.match(req);
        if (hit) return hit;
        if (path.indexOf("/daily") === 0) return (await caches.match("/daily/")) || (await caches.match("/"));
        if (path.indexOf("/companion") === 0) return (await caches.match("/companion/")) || (await caches.match("/"));
        return (await caches.match("/")) || Response.error();
      })()
    );
    return;
  }

  if (path.startsWith("/assets/") || path.startsWith("/companion/assets/") || path.startsWith("/daily/assets/")) {
    e.respondWith(
      caches.open(bucket).then((c) =>
        c.match(req).then((hit) => {
          const net = fetch(req)
            .then((res) => {
              if (res && res.ok) c.put(req, res.clone()).catch(() => {});
              return res;
            })
            .catch(() => hit);
          return hit || net;
        })
      )
    );
  }
});
