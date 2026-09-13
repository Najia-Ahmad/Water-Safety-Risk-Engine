/**
 * WATER SAFETY RISK ENGINE - SERVICE WORKER
 * Cache-First Strategy for Offline Field Assessment Capability
 */

const CACHE_NAME = 'water-safety-v1.2.0';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './waternajia.html',
    './css/chalkboard.css',
    './js/model.js',
    './js/i18n.js',
    './js/bacteria_db.js',
    './js/app.js',
    './manifest.json',
    'https://cdn.tailwindcss.com',
    'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Goudy+Bookletter+1911&family=Poppins:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        })
    );
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        })
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((networkResponse) => {
                if (event.request.method === 'GET' && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                }
                return networkResponse;
            });
        }).catch(() => {
            if (event.request.headers.get('accept').includes('text/html')) {
                return caches.match('./index.html');
            }
        })
    );
});
