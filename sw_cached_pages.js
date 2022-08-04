const cacheName ='v1'
const filesToCache = [
    'index.html',
    'video.html',
    '/js/main.js',
]
// call install_sw_cached_pages() to install the service worker
self.addEventListener('install', event => {
    console.log('Service Worker: Installed');
    event.waitUntil(
        caches.open(cacheName)
        .then(cache =>{ 
            console.log('Service Worker: Caching Files');
            cache.addAll(filesToCache)
        })
        .then(
            () => self.skipWaiting()
        )
    );
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
    event.respondWith( fetch(event.request).catch( () => caches.match(event.request)));
});