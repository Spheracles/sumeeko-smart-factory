/* SUMEEKO stage 4: offline cache, installed app path and deploy update support. */
const CACHE = 'sumeeko-smart-factory-pwa-28fc0ce2fb0b3513';
const CORE = [
  './','./index.html','./app.html','./manifest.webmanifest',
  './sumeeko-app.js','./sumeeko-style.css','./brand-app.css','./landing.css','./landing.js',
  './pwa-ui.css','./pwa-ui.js','./survival.html',
  './icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png',
  './icons/favicon.png','./icons/apple-touch-icon.png',
  './assets/factory-cover.webp','./assets/home-concept.webp',
  './assets/brand-guide.webp','./assets/logo-concept.webp',
  './assets/splash-concept.webp','./assets/web-concept.webp'
];
self.addEventListener('install', event => {
  event.waitUntil((async()=>{
    const cache = await caches.open(CACHE);
    await cache.addAll(CORE);
    // Only the offline bootstrap uses the separated React runtime.
    // GitHub Actions production build bundles React, so this URL may be absent.
    try { const optional = await fetch('./vendor-react.js'); if (optional.ok) await cache.put('./vendor-react.js', optional); } catch {}
  })());
});
self.addEventListener('activate', event => {
  event.waitUntil((async()=>{
    for (const key of await caches.keys()) {
      if (key.startsWith('sumeeko-smart-factory-pwa-') && key !== CACHE) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith((async()=>{
      try {
        const fresh = await fetch(request);
        if (fresh.ok) (await caches.open(CACHE)).put(request, fresh.clone());
        return fresh;
      } catch {
        const exact = await caches.match(request, {ignoreSearch:true});
        if (exact) return exact;
        const file = url.pathname.endsWith('/survival.html') ? './survival.html'
          : url.pathname.endsWith('/app.html') ? './app.html' : './index.html';
        return await caches.match(file) || new Response('離線資源尚未快取完成，請恢復連線。', {status:503});
      }
    })());
    return;
  }
  event.respondWith((async()=>{
    const stored=await caches.match(request,{ignoreSearch:true});
    if (stored) return stored;
    try { return await fetch(request); }
    catch { return new Response('Offline resource unavailable',{status:503}); }
  })());
});
