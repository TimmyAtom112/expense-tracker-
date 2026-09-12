const CACHE_NAME = "expense-tracker-v9";

const APP_FILES = [
"./",
"./index.html",
"./style.css",
"./script.js",
"./manifest.json",
"./icon-192.png",
"./icon-512.png"
];

/* ========================================
INSTALL
======================================== */

self.addEventListener("install", (event) => {

event.waitUntil(

    caches.open(CACHE_NAME)

        .then((cache) => {

            return cache.addAll(APP_FILES);

        })

        .then(() => {

            return self.skipWaiting();

        })

);

});

/* ========================================
ACTIVATE
======================================== */

self.addEventListener("activate", (event) => {

event.waitUntil(

    caches.keys()

        .then((cacheNames) => {

            return Promise.all(

                cacheNames
                    .filter(
                        (name) =>
                            name !== CACHE_NAME
                    )
                    .map(
                        (name) =>
                            caches.delete(name)
                    )

            );

        })

        .then(() => {

            return self.clients.claim();

        })

);

});

/* ========================================
FETCH
======================================== */

self.addEventListener("fetch", (event) => {

const request =
    event.request;


/* Only handle GET requests */

if (request.method !== "GET") {

    return;

}


const url =
    new URL(request.url);


/* Do not interfere with external websites/CDNs */

if (
    url.origin !== self.location.origin
) {

    return;

}


/*
   Network first.

   This makes sure the latest version
   from GitHub is used whenever internet
   is available.
*/

event.respondWith(

    fetch(request, {
        cache: "no-store"
    })

        .then((networkResponse) => {

            if (
                networkResponse &&
                networkResponse.ok
            ) {

                const responseToCache =
                    networkResponse.clone();


                caches.open(CACHE_NAME)
                    .then((cache) => {

                        cache.put(
                            request,
                            responseToCache
                        );

                    });

            }


            return networkResponse;

        })

        .catch(() => {

            return caches.match(request)

                .then((cachedResponse) => {

                    if (cachedResponse) {

                        return cachedResponse;

                    }


                    if (
                        request.mode === "navigate"
                    ) {

                        return caches.match(
                            "./index.html"
                        );

                    }


                    return new Response(
                        "Offline",
                        {
                            status: 503,
                            headers: {
                                "Content-Type":
                                    "text/plain"
                            }
                        }
                    );

                });

        })

);

});