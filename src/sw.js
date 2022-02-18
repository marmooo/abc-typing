var CACHE_NAME = '2021-02-19 00:45';
var urlsToCache = [
  "/abc-typing/",
  "/abc-typing/index.js",
  "/abc-typing/bgm.mp3",
  "/abc-typing/cat.mp3",
  "/abc-typing/correct.mp3",
  "/abc-typing/end.mp3",
  "/abc-typing/index.js",
  "/abc-typing/keyboard.mp3",
  "/abc-typing/favicon/original.svg",
  "https://marmooo.github.io/fonts/textar-light.woff2",
  "https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css",
  "https://cdn.jsdelivr.net/npm/simple-keyboard@latest/build/index.js",
  "https://cdn.jsdelivr.net/npm/simple-keyboard@latest/build/css/index.css",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(urlsToCache);
      }),
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request)
      .then(function (response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }),
  );
});

self.addEventListener("activate", function (event) {
  var cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(function (cacheNames) {
      return Promise.all(
        cacheNames.map(function (cacheName) {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        }),
      );
    }),
  );
});
