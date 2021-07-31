var CACHE_NAME = '2021-07-31 10:25';
var urlsToCache = [
  '/abc-typng/',
  '/abc-typng/index.js',
  '/abc-typng/bgm.mp3',
  '/abc-typng/cat.mp3',
  '/abc-typng/correct.mp3',
  '/abc-typng/end.mp3',
  '/abc-typng/index.js',
  '/abc-typng/keyboard.mp3',
  '/abc-typng/favicon/original.svg',
  'https://marmooo.github.io/fonts/textar-light.woff2',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/simple-keyboard@latest/build/index.js',
  'https://cdn.jsdelivr.net/npm/simple-keyboard@latest/build/css/index.css',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches
    .open(CACHE_NAME)
    .then(function(cache) {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

self.addEventListener('activate', function(event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
