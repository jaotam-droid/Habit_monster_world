self.addEventListener('install',e=>{self.skipWaiting();});
self.addEventListener('activate',e=>{e.waitUntil((async()=>{try{const ks=await caches.keys();await Promise.all(ks.map(k=>caches.delete(k)));await self.clients.claim();await self.registration.unregister();}catch(err){}})());});
self.addEventListener('fetch',()=>{});
