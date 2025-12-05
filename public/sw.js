// اسم ذاكرة التخزين المؤقت
const CACHE_NAME = 'my-smart-wallet-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// تثبيت Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('تم فتح ذاكرة التخزين المؤقت');
        return cache.addAll(urlsToCache);
      })
      .then(() => self.skipWaiting())
  );
});

// تفعيل Service Worker
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('حذف ذاكرة التخزين القديمة:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// اعتراض الطلبات
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // إذا كان الملف في ذاكرة التخزين، قم بإرجاعه
        if (response) {
          return response;
        }
        
        // إذا لم يكن في ذاكرة التخزين، قم بجلب الملف من الشبكة
        return fetch(event.request).then(response => {
          // تحقق من أن الرد صالح
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // استنساخ الرد
          const responseToCache = response.clone();
          
          // تخزين الملف الجديد في ذاكرة التخزين
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
            
          return response;
        });
      })
      .catch(() => {
        // إذا فشل الاتصال، يمكن إرجاع صفحة بديلة
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      })
  );
});

// التعامل مع إشعارات Push
self.addEventListener('push', event => {
  const options = {
    body: event.data?.text() || 'إشعار من محفظتي الذكية',
    icon: '/icon-192x192.png',
    badge: '/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('محفظتي الذكية', options)
  );
});

// التعامل مع النقر على الإشعارات
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then(clientList => {
      for (const client of clientList) {
        if (client.url === '/' && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow('/');
      }
    })
  );
});