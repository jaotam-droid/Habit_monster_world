const CACHE="hmw-v26-3-character-redesign";
const CORE=["./","./index.html","./manifest.webmanifest"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))));self.clients.claim();});
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET") return;
 const u=new URL(e.request.url);
 if(u.origin===location.origin && (u.pathname.endsWith("/")||u.pathname.endsWith("/index.html"))){
  e.respondWith(fetch(e.request).then(r=>{const x=r.clone();caches.open(CACHE).then(c=>c.put(e.request,x));return r;}).catch(()=>caches.match(e.request)));
  return;
 }
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(r=>{if(u.origin===location.origin){const x=r.clone();caches.open(CACHE).then(c=>c.put(e.request,x));}return r;})));
});
