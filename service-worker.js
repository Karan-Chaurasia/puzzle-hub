const CACHE_NAME = 'puzzle-hub-v1';
const urlsToCache = [
  './',
  './index.html',
  './css/styles.css',
  './js/app.js',
  './js/gameManager.js',
  './js/storage.js',
  './games/sudoku.js',
  './games/wordsearch.js',
  './games/sliding.js',
  './games/mathquiz.js',
  './games/crossword.js',
  './games/tictactoe.js',
  './games/memory.js',
  './games/snake.js',
  './games/2048.js',
  './games/minesweeper.js',
  './manifest.json'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});