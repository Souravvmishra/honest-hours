// Service Worker for HonestHours PWA
// Handles background notifications when tab is closed

const CACHE_VERSION = 'v1.0.0'
const CACHE_NAME = `honesthours-cache-${CACHE_VERSION}`

const STATIC_ASSETS = [
    '/',
    '/icon-192x192.png',
    '/icon-512x512.png',
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => cache.addAll(STATIC_ASSETS))
            .then(() => self.skipWaiting())
    )
})

self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([
            // Clean up old caches
            caches.keys().then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter((name) => name !== CACHE_NAME)
                        .map((name) => caches.delete(name))
                )
            }),
            // Take control of all pages immediately
            clients.claim(),
        ])
    )
})

// Handle skip waiting message from client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }
})

// Cache-first strategy for static assets
self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Only cache GET requests for same-origin
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return
    }

    // Cache static assets
    if (STATIC_ASSETS.some((asset) => url.pathname === asset)) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                return cachedResponse || fetch(request)
            })
        )
    }
})

self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json()
        const options = {
            body: data.body || 'What did you do in the last hour?',
            icon: data.icon || '/icon-192x192.png',
            badge: '/icon-192x192.png',
            tag: 'hourly-prompt',
            requireInteraction: true,
            data: {
                url: '/',
                dateOfArrival: Date.now(),
            },
        }
        event.waitUntil(self.registration.showNotification(data.title || 'HonestHours', options))
    }
})

self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    event.waitUntil(
        clients
            .matchAll({
                type: 'window',
                includeUncontrolled: true,
            })
            .then((clientList) => {
                // If a window is already open, focus it
                for (const client of clientList) {
                    if (client.url === '/' && 'focus' in client) {
                        return client.focus()
                    }
                }
                // Otherwise, open a new window
                if (clients.openWindow) {
                    return clients.openWindow('/')
                }
            })
    )
})
