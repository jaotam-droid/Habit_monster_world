const CACHE="hmw-v27-6-cinematic-3d-art-pass";
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

  // Never serve stale HTML. GitHub Pages/network first for every navigation.
  if(req.mode==="navigate" || req.destination==="document"){
    event.respondWith(
      fetch(req,{cache:"no-store"})
        .then(res=>res)
        .catch(()=>caches.match("./index.html"))
    );
    return;
  }

  // Static assets: network first, cache fallback.
  if(req.method==="GET"){
    event.respondWith(
      fetch(req)
        .then(res=>{
          if(res && res.status===200){
            const copy=res.clone();
            caches.open(CACHE).then(cache=>cache.put(req,copy));
          }
          return res;
        })
        .catch(()=>caches.match(req))
    );
  }
});
