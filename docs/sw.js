const CACHE_NAME="2024-08-04 00:00",urlsToCache=["/abc-typing/","/abc-typing/index.js","/abc-typing/mp3/bgm.mp3","/abc-typing/mp3/cat.mp3","/abc-typing/mp3/correct.mp3","/abc-typing/mp3/end.mp3","/abc-typing/mp3/keyboard.mp3","/abc-typing/favicon/favicon.svg","https://marmooo.github.io/fonts/textar-light.woff2"];self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE_NAME).then(e=>e.addAll(urlsToCache)))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))}),self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(e=>Promise.all(e.filter(e=>e!==CACHE_NAME).map(e=>caches.delete(e)))))})