// Service Worker for Memorial Platform - Blistering Fast Edition
const CACHE_NAME = 'memorial-v2';
const RUNTIME_CACHE = 'memorial-runtime-v2';
const IMAGE_CACHE = 'memorial-images-v2';

// Critical assets to precache
const PRECACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.svg',
  '/icons/icon.svg',
  '/icons/icon-192x192.png'
];

// Install - precache critical assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate - clean old caches
self.addEventListener('activate', (event) => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE, IMAGE_CACHE];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => !currentCaches.includes(name))
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch - aggressive caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET
  if (request.method !== 'GET') return;

  // Skip API endpoints - always fresh
  if (url.hostname.includes('workers.dev') ||
      url.hostname.includes('formspree.io') ||
      url.hostname.includes('paystack.co') ||
      url.hostname.includes('anthropic.com') ||
      url.hostname.includes('youtube.com') ||
      url.hostname.includes('ytimg.com')) {
    return;
  }

  // IMAGES - Cache first, background update (fastest for repeat visits)
  if (request.destination === 'image' ||
      url.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/i)) {
    event.respondWith(
      caches.open(IMAGE_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => cached);

          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // FONTS - Cache first (fonts rarely change)
  if (url.hostname.includes('fonts.googleapis.com') ||
      url.hostname.includes('fonts.gstatic.com') ||
      request.destination === 'font') {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          if (cached) return cached;
          return fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          });
        });
      })
    );
    return;
  }

  // JS/CSS - Stale while revalidate (fast + fresh)
  if (request.destination === 'script' ||
      request.destination === 'style' ||
      url.pathname.match(/\.(js|css)$/i)) {
    event.respondWith(
      caches.open(RUNTIME_CACHE).then((cache) => {
        return cache.match(request).then((cached) => {
          const fetchPromise = fetch(request).then((response) => {
            if (response.ok) cache.put(request, response.clone());
            return response;
          }).catch(() => cached);

          return cached || fetchPromise;
        });
      })
    );
    return;
  }

  // HTML/Navigation - Network first, cache fallback
  if (request.destination === 'document' || request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/')))
    );
    return;
  }

  // Default - Network first
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, clone));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});

// Background sync for offline form submissions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-tributes') {
    event.waitUntil(syncTributes());
  }
});

async function syncTributes() {
  // Placeholder for offline tribute sync
  console.log('Syncing offline tributes...');
}
