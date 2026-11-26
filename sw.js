const CACHE_NAME = 'onpe-vision-2026-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './leaflet.css',
  './leaflet.js',
  './three.min.js',
  './OrbitControls.js',
  './logo_onpe.jpg',
  './css/variables.css',
  './css/base.css',
  './css/layout.css',
  './css/components.css',
  './css/views.css',
  './css/chatbot.css',
  './css/responsive.css',
  './js/app.js',
  './js/telemetria.js',
  './js/analista.js',
  './js/grafo.js',
  './js/texturas_globo.js',
  './js/globo3d.js',
  './js/database.js',
  './js/notificaciones.js',
  './js/tutorial.js',
  './js/chatbot.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE)).catch(() => null)
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.pathname.startsWith('/api/')) return;

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).catch(() => caches.match('./index.html'));
    })
  );
});
