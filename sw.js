/* Clarity – Furnish Your Grave | Service Worker v2
   Offline app-shell cache. Dynamic Quran/Hadith APIs still need network.
*/
const CACHE = 'clarity-shell-v2';

// Only same-origin shell assets (external fonts are best-effort, never block install)
const SHELL = [
  './',
  './index.html',
  './sw.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then(async (cache) => {
      for (const url of SHELL) {
        try {
          await cache.add(url);
        } catch (e) {
          // ignore missing optional files
        }
      }
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  let url;
  try {
    url = new URL(req.url);
  } catch (e) {
    return;
  }

  const accept = req.headers.get('accept') || '';
  if (req.mode === 'navigate' || accept.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((r) =>
            r ||
            caches.match('./index.html') ||
            caches.match('./') ||
            new Response(
              '<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Clarity · Offline</title><style>body{font-family:system-ui,sans-serif;background:#0f4c3a;color:#f7f3eb;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;padding:1.5rem;text-align:center}h1{font-size:1.4rem;margin:0 0 .5rem}p{opacity:.9;line-height:1.5;max-width:22rem}</style></head><body><div><h1>Clarity · Offline</h1><p>The app shell is cached. Reconnect for live Quran, Hadith, and prayer data. Your local notes and counts remain on this device.</p></div></body></html>',
              { headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            )
          )
        )
    );
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const network = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
            }
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  event.respondWith(fetch(req));
});
