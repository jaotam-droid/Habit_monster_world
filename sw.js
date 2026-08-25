const CACHE="hmw-v34-final-premium-game-art";
const CORE=["./manifest.webmanifest"];

self.addEventListener("install",event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE)));
});
self.addEventListener("activate",event=>{
  event.waitUntil(
    caches.keys()
      .then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
      .then(()=>self.clients.claim())
  );
});
self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.mode==="navigate" || req.destination==="document"){
    event.respondWith(fetch(req,{cache:"no-store"}).catch(()=>caches.match("./index.html")));
    return;
  }
  if(req.method==="GET"){
    event.respondWith(
      caches.match(req).then(cached=>{
        const fresh=fetch(req).then(res=>{
          if(res && res.status===200){
            const copy=res.clone();
            caches.open(CACHE).then(c=>c.put(req,copy));
          }
          return res;
        }).catch(()=>cached);
        return cached || fresh;
      })
    );
  }
});
