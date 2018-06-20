console.log('start')
let VERSION = 'v3';
// 缓存
self.addEventListener('install', function (event) {
    console.log('on install')
    event.waitUntil(
        caches.open(VERSION).then(function (cache) {
            console.log('addAll')
            return cache.addAll([
                './start.html',
                './static/jquery.min.js',
                './static/mm1.jpg'
            ]);
        })
    );
});
// 缓存更新
self.addEventListener('activate', function (event) {
    console.log('on activate')
    event.waitUntil(
        caches.keys().then(function (cacheNames) {
            return Promise.all(
                cacheNames.map(function (cacheName) {
                    // 如果当前版本和缓存版本不一致
                    if (cacheName !== VERSION) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
// 捕获请求并返回缓存数据
self.addEventListener('fetch', function (event) {
    console.log('on fetch')
    event.respondWith(caches.match(event.request).catch(function () {
        return fetch(event.request);
    }).then(function (response) {
        caches.open(VERSION).then(function (cache) {
            cache.put(event.request, response);
        });
        return response.clone();
    }).catch(function () {
        return caches.match('./static/mm1.jpg');
    }));
});
console.log('end')