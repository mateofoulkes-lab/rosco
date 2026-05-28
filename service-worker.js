const CACHE_NAME = "el-rosco-app-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./index1.html",
  "./index2.html",
  "./logo.png",
  "./manifest.webmanifest",
  "./rosco_set_1.csv",
  "./rosco_set_2.csv",
  "./rosco_set_3.csv",
  "./rosco_set_4.csv",
  "./rosco_set_5.csv",
  "./rosco_set_6.csv"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(APP_FILES))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(response => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, response.clone());
          return response;
        });
      });
    })
  );
});
