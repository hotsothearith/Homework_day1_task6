self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open('my-cache').then((cache) => {
            return cache.addAll([
                './',
                'index.html',
                'service-worker.js',
                'manifest.json',
                'style.css' // Add any other assets you want to cache
            ]);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }

            return fetch(event.request).then((response) => {
                return caches.open('my-cache').then((cache) => {
                    cache.put(event.request, response.clone());
                    return response;
                });
            }).catch((error) => {
                console.error('Error fetching:', error);
                return caches.match('/fallback.html'); // Serve a fallback page if the network request fails
            });
        })
    );
});