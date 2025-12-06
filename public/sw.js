// public/sw.js
const CACHE_NAME = 'my-smart-wallet-v1';

// تنظيف الذاكرة المؤقتة القديمة
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// حفظ كل صفحة تتم زيارتها في الذاكرة المؤقتة
self.addEventListener('fetch', (event) => {
  // تجاهل طلبات non-GET وطلبات API (اختياري)
  if (event.request.method !== 'GET') return;

  // تجاهل طلبات غير HTTP/HTTPS
  if (!event.request.url.startsWith('http')) return;

  event.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(event.request).then((response) => {
        // إذا وُجد في الذاكرة المؤقتة، استخدمه
        if (response) {
          return response;
        }
        // وإلا، اجلبه من الشبكة واحفظه
        return fetch(event.request).then((networkResponse) => {
          // تأكد أن الاستجابة ناجحة
          if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
            return networkResponse;
          }
          // احفظ نسخة في الذاكرة المؤقتة
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});