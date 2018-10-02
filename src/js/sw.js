self.addEventListener('install', function(event) {
	event.waitUntil(
		caches.open('printerland').then(function(cache) {
			return cache.addAll([
				'/',
				'/index.html',
				'/main.css',
				'/main.bundle.js',
				])
		})
		)
})

self.addEventListener('fetch', function(event) {
	// console.log(event.request.url);

	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});
