/* Clarity service worker, offline app shell.
   Strategy: network-first for the page, cache-first for static assets.
   Routing needs the network either way, but the shell should never white-screen
   when signal drops in a basement lecture hall.

   Bump CACHE_VERSION whenever you change index.html or the icons. */
const CACHE_VERSION = 'clarity-v2';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
  'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_VERSION)
      .then(c => Promise.allSettled(SHELL.map(u => c.add(u))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Routing / tiles: always try the network, fall back to cache.
  const isData = url.hostname.includes('openstreetmap') ||
                 url.hostname.includes('routing') ||
                 url.hostname.includes('tile');

  if (isData) {
    e.respondWith(
      fetch(req).then(r => {
        const copy = r.clone();
        caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
        return r;
      }).catch(() => caches.match(req).then(r => r || Response.error()))
    );
    return;
  }

  // App shell: cache-first, then network, then offline page.
  e.respondWith(
    caches.match(req).then(cached => {
      if (cached) {
        // Refresh in the background so the next open is current.
        fetch(req).then(r => {
          if (r && r.ok) caches.open(CACHE_VERSION).then(c => c.put(req, r));
        }).catch(() => {});
        return cached;
      }
      return fetch(req).then(r => {
        if (r && r.ok) {
          const copy = r.clone();
          caches.open(CACHE_VERSION).then(c => c.put(req, copy)).catch(() => {});
        }
        return r;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
