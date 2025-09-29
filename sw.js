// Service Worker för Valentine Bounce PWA
const CACHE_NAME = 'valentine-bounce-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600&display=swap'
];

// Installation av service worker
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache öppnad');
        return cache.addAll(urlsToCache);
      })
  );
});

// Hämta resurser från cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Returnera från cache om tillgängligt
        if (response) {
          return response;
        }
        
        // Annars hämta från nätet
        return fetch(event.request).then(
          function(response) {
            // Kontrollera om vi fick ett giltigt svar
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Klona svaret
            var responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
    );
});

// Uppdatera service worker
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});