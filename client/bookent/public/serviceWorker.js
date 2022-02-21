const staticCacheName = 'site-static-v1';
const assets = [
  './',
  'index.html',
  'fallback.html',
  'https://fonts.googleapis.com/css2?family=NTR&family=Offside&display=swap',
  'assets/bookent logo black.svg',
  'assets/logo small.svg',
  'assets/add.svg',
  'assets/Group 18.svg',
  'assets/home.svg',
  'assets/love.svg',
  'assets/lover.svg',
  'assets/user.svg',
  'assets/sort.svg',
  'assets/delete.svg',
  '/static/js/main.chunk.js',
  '/static/js/5.chunk.js',
  '/static/js/12.chunk.js',
  '/static/js/13.chunk.js',
  '/static/js/14.chunk.js',
  '/static/js/10.chunk.js',
  '/static/js/19.chunk.js',
  '/static/js/20.chunk.js',
  '/static/js/11.chunk.js',
];
const self = this;



// Install SW
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(staticCacheName)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(assets);
      })
  )
});


// Activate the SW
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(staticCacheName);

  event.waitUntil(
      caches.keys().then((cacheNames) => Promise.all(
          cacheNames.map((cacheName) => {
              if(!cacheWhitelist.includes(cacheName)) {
                  return caches.delete(cacheName);
              }
          })
      ))
          
  )
});




// Listen for requests
self.addEventListener('fetch', (event) => {
  event.respondWith(
      caches.match(event.request)
          .then(() => {
              return fetch(event.request) 
                  .catch(() => caches.match('offline.html'))
          })
  )
});
