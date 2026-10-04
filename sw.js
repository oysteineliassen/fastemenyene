// Fastemenyene service worker – versjon 2cc45d1f29
const CACHE="fastemenyene-2cc45d1f29";
const FONT_CACHE="fastemenyene-fonts";
const ASSETS=[
  "./",
  "index.html",
  "manifest.webmanifest",
  "icons/apple-touch-icon.png",
  "icons/icon-192.png",
  "icons/icon-512.png",
  "icons/icon-maskable-512.png",
  "img/appelsinsalat.jpg",
  "img/avokadosalat.jpg",
  "img/bakte-gronnsaker.jpg",
  "img/banan-te.jpg",
  "img/bananpannekaker.jpg",
  "img/bla-havregrot.jpg",
  "img/bla-tapas-1.jpg",
  "img/bla-tapas-2a.jpg",
  "img/blandet-salat.jpg",
  "img/blomkalris.jpg",
  "img/chia-blabaer.jpg",
  "img/chia-bringebaer.jpg",
  "img/curry.jpg",
  "img/fastetapas-1.jpg",
  "img/fastetapas-2.jpg",
  "img/frisk-salat.jpg",
  "img/fruktsalat-cashew.jpg",
  "img/fruktsalat-valnott.jpg",
  "img/fruktsalat.jpg",
  "img/gronnkal-paere.jpg",
  "img/gronnkalsalat.jpg",
  "img/gronnsaksuppe.jpg",
  "img/gul-tapas-1.jpg",
  "img/gul-tapas-2b.jpg",
  "img/gulrotsuppe-lilla.jpg",
  "img/gulrotsuppe.jpg",
  "img/havregrot-banan.jpg",
  "img/hummus.jpg",
  "img/kalsalat.jpg",
  "img/knekkebrod.jpg",
  "img/linsegryte.jpg",
  "img/middelhavssalat.jpg",
  "img/ovnsbakte.jpg",
  "img/pere-salat.jpg",
  "img/potetsalat.jpg",
  "img/salatwraps.jpg",
  "img/smoothie.jpg",
  "img/smoothiebowl.jpg",
  "img/sotpotetsticks.jpg",
  "img/squashpasta.jpg",
  "img/tomatsuppe.jpg",
  "img/wok.jpg"
];
self.addEventListener("install",e=>{
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)));
});
self.addEventListener("message",e=>{if(e.data==="skipWaiting")self.skipWaiting()});
self.addEventListener("activate",e=>{
  e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE&&k!==FONT_CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",e=>{
  const req=e.request; if(req.method!=="GET")return;
  const url=new URL(req.url);
  // Google Fonts: stale-while-revalidate
  if(url.hostname==="fonts.googleapis.com"||url.hostname==="fonts.gstatic.com"){
    e.respondWith(caches.open(FONT_CACHE).then(async c=>{
      const hit=await c.match(req);
      const net=fetch(req).then(r=>{if(r.ok||r.type==="opaque")c.put(req,r.clone());return r}).catch(()=>hit);
      return hit||net;
    }));
    return;
  }
  if(url.origin!==location.origin)return;
  // Sider: nett først, så cache (gir siste versjon når du er på nett)
  if(req.mode==="navigate"){
    e.respondWith(fetch(req).catch(()=>caches.match("index.html",{ignoreSearch:true})));
    return;
  }
  // Alt annet: cache først
  e.respondWith(caches.match(req,{ignoreSearch:true}).then(hit=>hit||fetch(req).then(r=>{
    if(r.ok){const cp=r.clone();caches.open(CACHE).then(c=>c.put(req,cp))}return r;
  })));
});
