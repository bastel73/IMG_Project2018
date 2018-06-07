'use strict'
let urlsToCache_ = [
    '/',
    'views/layouts/main.hbs',
    '/btsp/css/bootstrap.min.css',
    '/manifest.json',
    '/indexOfPlayers.handlebars'
];

let version = 'v1';

self.addEventListener('install', (event)=>{
    console.log('[ServiceWorker] Installed version', version);
    event.waitUntil(
        caches.open(version)
            .then((cache)=>{
                console.log("opened cache");
                return cache.addAll(urlsToCache_);
            })
    );
});

self.addEventListener('fetch', (event)=>{
    event.respondWith(
        caches.match(event.request)
            .then((response)=>{
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('activate', (event)=>{
    let cacheWhiteList = [version];

    event.waitUntil(
        caches.keys()
            .then((cacheNames)=>{
                return Promise.all(
                    cacheNames.map((cacheName)=>{
                        if (version && cacheWhiteList.indexOf(cacheName)===-1)
                        {
                            console.log('Deleted old cache');
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
    );
});

self.addEventListener('load', e=>{
    loadData();
});

function loadData() {   
    
    console.log("Hello serviceworker..."); 
};
