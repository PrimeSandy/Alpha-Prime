const CACHE_NAME = 'alphaprime-v2';
const ASSETS = [
    '/',
    '/index.html',
    '/style.css',
    '/output.css',
    '/script.js',
    '/manifest.json',
    '/apple-touch-icon.png',
    '/favicon.ico'
];

// Install Event - Cache Static Assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching all: app shell and content');
                return cache.addAll(ASSETS);
            })
    );
});

// Activate Event - Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
});

// Fetch Event - Network First, then Cache (Stale-While-Revalidate pattern)
self.addEventListener('fetch', (event) => {
    // Only handle GET requests and local assets
    if (event.request.method !== 'GET' || !event.request.url.startsWith(self.location.origin)) {
        return;
    }

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            // Return cached response if found
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Check if we received a valid response
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
                    return networkResponse;
                }

                // Clone the response
                const responseToCache = networkResponse.clone();

                caches.open(CACHE_NAME)
                    .then((cache) => {
                        // Update cache with new version
                        cache.put(event.request, responseToCache);
                    });

                return networkResponse;
            });

            // Return cached response immediately if available, otherwise wait for network
            return cachedResponse || fetchPromise;
        })
    );
});
