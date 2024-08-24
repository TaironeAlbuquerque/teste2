const cacheName = "cache1"; // Change value to force update

self.addEventListener("install", event => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll([
                "/",
                "index.html",
                "manifest.json",
                "css/style.css",
                "js/main.js",
                "js/sw.js"
            ]);
        })
    );
});

self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.map(key => {
                    if (key !== cacheName) {
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

self.addEventListener("fetch", event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(networkResponse => {
                return caches.open(cacheName).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            });
        })
    );
});
