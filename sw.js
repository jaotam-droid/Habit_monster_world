const CACHE="hmw-v27-9-character-art-overhaul";
const CORE=["./manifest.webmanifest"];
self.addEventListener("install",e=>{self.skipWaiting();e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)))});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener("fetch",e=>{
 const r=e.request;
 if(r.mode==="navigate"||r.destination==="document"){
   e.respondWith(fetch(r,{cache:"no-store"}).catch(()=>caches.match("./index.html"))); return;
 }
 if(r.method==="GET"){
   e.respondWith(caches.match(r).then(cached=>{
     const fresh=fetch(r).then(res=>{if(res&&res.status===200)caches.open(CACHE).then(c=>c.put(r,res.clone()));return res}).catch(()=>cached);
     return cached||fresh;
   }));
 }
});