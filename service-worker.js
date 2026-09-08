const CACHE_NAME = "expense-tracker-v3";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.json",
  "./icon-192.png",
  "./icon-512.png"
];

// Install new service worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(FILES_TO_CACHE))
      .then(() => self.skipWaiting())
  );
});

// Activate new service worker and remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Handle requests
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached file if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Otherwise fetch from the internet
        return fetch(event.request)
          .then((networkResponse) => {

            // Don't cache unsuccessful responses
            if (!networkResponse || networkResponse.status !== 200) {
              return networkResponse;
            }

            // Cache the new file
            return caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, networkResponse.clone());
                return networkResponse;
              });
          });
      })
  );
});
