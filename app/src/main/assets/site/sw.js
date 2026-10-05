const CACHE='quran-v81';
const AUDIO_CACHE='quran-audio-offline-v76';
const CORE=['./','./index.html','./style.css','./app.js','./app-v66.js','./manifest.webmanifest','./app-navigation.js','./app-install.js','./icons/icon-192.png','./icons/icon-512.png','./icons/apple-touch-icon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE && k.startsWith('quran-v')).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;const u=new URL(e.request.url);if(u.origin===location.origin){e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{caches.open(CACHE).then(c=>c.put(e.request,res.clone()));return res}).catch(()=>caches.match('./index.html'))));return}if(/mp3quran\.net$/.test(u.hostname)){e.respondWith(caches.open(AUDIO_CACHE).then(async c=>{const r=await c.match(e.request.url);if(r)return r;return fetch(e.request)}))}});


const QURAN_ICON='./icons/icon-192.png';
const QURAN_BADGE='./icons/icon-192.png';
async function showQuranReminder(title='القرآن الكريم', body='📖 تذكير لطيف: خذ بضع دقائق لقراءة القرآن أو الاستماع إليه.'){
  await self.registration.showNotification(title,{body,icon:QURAN_ICON,badge:QURAN_BADGE,tag:'quran-4h',renotify:false,data:{url:'./'}});
}
self.addEventListener('message',event=>{
  const d=event.data||{};
  if(d.type==='QURAN_NOTIFY') event.waitUntil(showQuranReminder(d.title||'القرآن الكريم',d.body||'📖 تذكير لطيف بقراءة القرآن الكريم.'));
});
self.addEventListener('periodicsync',event=>{
  if(event.tag==='quran-reminder-4h') event.waitUntil(showQuranReminder());
});
self.addEventListener('notificationclick',event=>{
  event.notification.close();
  event.waitUntil(clients.matchAll({type:'window',includeUncontrolled:true}).then(list=>{
    for(const c of list){if('focus' in c)return c.focus();}
    return clients.openWindow('./');
  }));
});
