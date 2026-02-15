/**
 * BrawlTracker Service Worker
 * Provides offline caching and PWA functionality
 */

const CACHE_NAME = 'brawltracker-v1';
const STATIC_CACHE = 'brawltracker-static-v1';
const API_CACHE = 'brawltracker-api-v1';

// Resources to cache immediately on install
const PRECACHE_RESOURCES = [
  '/',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
];

// Static resources that should be cached
const STATIC_PATTERNS = [
  /\.js$/,
  /\.css$/,
  /\.woff2?$/,
  /\.ttf$/,
  /\.png$/,
  /\.jpg$/,
  /\.svg$/,
  /\/_next\/static\//,
];

// API patterns to cache
const API_PATTERNS = [
  /api\.brawlstars\.com/,
];

// Install event - precache static resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_RESOURCES);
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            return name.startsWith('brawltracker-') && 
                   name !== CACHE_NAME && 
                   name !== STATIC_CACHE && 
                   name !== API_CACHE;
          })
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Handle static resources
  if (STATIC_PATTERNS.some((pattern) => pattern.test(url.href))) {
    event.respondWith(
      caches.open(STATIC_CACHE).then((cache) => {
        return cache.match(request).then((response) => {
          if (response) {
            return response;
          }
          return fetch(request).then((networkResponse) => {
            if (networkResponse.ok) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Handle navigation requests (SPA routing)
  if (request.mode === 'navigate') {
    event.respondWith(
      caches.match('/').then((cachedResponse) => {
        if (cachedResponse) {
          // Return cached page, then update cache in background
          fetch(request).then((response) => {
            if (response.ok) {
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, response);
              });
            }
          }).catch(() => {});
          return cachedResponse;
        }
        return fetch(request).catch(() => caches.match('/'));
      })
    );
    return;
  }

  // For other requests, try network first, then cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Cache successful responses
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Fall back to cache
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return offline fallback for navigation
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          return new Response('Offline', { status: 503 });
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-player-data') {
    event.waitUntil(syncPlayerData());
  }
});

async function syncPlayerData() {
  // This would sync any offline data when connection is restored
  console.log('Background sync triggered');
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data?.text() || 'New notification from BrawlTracker',
    icon: '/icons/icon-192.png',
    badge: '/icons/icon-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
    },
    actions: [
      { action: 'view', title: 'View' },
      { action: 'close', title: 'Close' },
    ],
  };

  event.waitUntil(
    self.registration.showNotification('BrawlTracker', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

console.log('BrawlTracker Service Worker loaded');
