const CACHE = 'sandvik-reports-offline-v4';

const CORE = [
  './',
  './index.html',
  './audit-report.html',
  './site-visit.html',
  './training-report.html',
  './commissioning-drills.html',
  './vehicle-pre-check.html',
  './manifest.webmanifest',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './Sandvik.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(key => key !== CACHE).map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  const request = event.request;
  const url = new URL(request.url);

  // Do not intercept requests outside this application's origin.
  if (url.origin !== self.location.origin) return;

  const isPage =
    request.mode === 'navigate' ||
    request.destination === 'document' ||
    url.pathname.endsWith('.html');

  if (isPage) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) {
          // Refresh the cached page in the background whenever network is available.
          event.waitUntil(
            fetch(request, { cache: 'no-store' })
              .then(response => {
                if (response && response.ok) {
                  return caches.open(CACHE)
                    .then(cache => cache.put(request, response.clone()));
                }
              })
              .catch(() => undefined)
          );
          return cached;
        }

        return fetch(request, { cache: 'no-store' })
          .then(response => {
            if (response && response.ok) {
              const copy = response.clone();
              caches.open(CACHE).then(cache => cache.put(request, copy));
            }
            return response;
          })
          .catch(() => caches.match('./index.html'));
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request)
        .then(response => {
          if (response && response.ok) {
            const copy = response.clone();
            caches.open(CACHE).then(cache => cache.put(request, copy));
          }
          return response;
        });
    })
  );
});
