const CACHE = "aia-v1";

const arquivos = [
  "/",
  "/index.html",
  "/style.css",
  "/script.js",
  "/frases.json",
  "/verbos.json",
  "/palavras.json",
  "/img/aia-mascote.png"
];

self.addEventListener("install", e => {

  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(arquivos))
  );

});

self.addEventListener("fetch", e => {

  e.respondWith(
    caches.match(e.request)
      .then(resp => resp || fetch(e.request))
  );

});