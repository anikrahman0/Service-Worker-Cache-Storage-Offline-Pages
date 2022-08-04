const cacheName ='v1'
// call install_sw_cached_pages() to install the service worker
self.addEventListener('install', event => {
    console.log('Service Worker: Installed');
});

//activate
self.addEventListener('activate', event => {
    console.log('Service Worker: Activated');
    event.waitUntil(
        caches.keys()
        .then(cacheNames => {
            return Promise.all(
                cacheNames.map(cache => {
                    if(cache !== cacheName){
                        console.log('Service Worker: Clearing Old Cache');
                        return caches.delete(cache);
                    }
                })
            );
        })
        // .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    console.log('Service Worker: Fetching');
    event.respondWith(
        fetch(event.request)
        .then(response => {
            const responseClone = response.clone();
            caches.open(cacheName)
            .then(cache => {
                cache.put(event.request, responseClone);
            }).catch(err => console.log(err));
            return response;
        }).catch(err => caches.match(event.request).then(response => response))
    );
}).catch(err => console.log(err));
