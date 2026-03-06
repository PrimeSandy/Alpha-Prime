// KILL SWITCH SERVICE WORKER
// This service worker immediately installs, activates, wipes all caches, and never intercepts fetches.

self.addEventListener('install', () => {
    // Force immediate installation and progression to activation
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // Delete ALL existing caches from previous service workers
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(keyList.map((key) => {
                console.log('[Service Worker Kill Switch] Removing cache:', key);
                return caches.delete(key);
            }));
        }).then(() => {
            // Take control of all open pages immediately without needing a reload
            return self.clients.claim();
        }).then(() => {
            // Unregister itself
            self.registration.unregister().then(() => {
                console.log('[Service Worker Kill Switch] Unregistered successfully.');
            });
        })
    );
});

self.addEventListener('fetch', () => {
    // Do absolutely nothing. Let the browser handle the network request naturally.
});
