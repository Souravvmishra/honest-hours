// Service Worker for HonestHours PWA
// Handles background notifications when tab is closed

const CACHE_VERSION = 'v1.2.1'
const CACHE_NAME = `honesthours-cache-${CACHE_VERSION}`

// Static assets to cache immediately
const STATIC_ASSETS = [
    '/',
    '/android-chrome-192x192.png',
    '/android-chrome-512x512.png',
    '/apple-touch-icon.png',
    '/favicon-16x16.png',
    '/favicon-32x32.png',
]

// Runtime cache patterns (cache on first request)
const RUNTIME_CACHE_PATTERNS = [
    /\/_next\/static\/.*/,  // Next.js static chunks
    /\/fonts\/.*/,          // Font files
]

// IndexedDB helper for service worker
const DB_NAME = 'honesthours'
const SETTINGS_STORE = 'settings'

async function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1)
        request.onerror = () => reject(request.error)
        request.onsuccess = () => resolve(request.result)
    })
}

async function getLastPromptTime() {
    try {
        const db = await openDB()
        return new Promise((resolve) => {
            const transaction = db.transaction(SETTINGS_STORE, 'readonly')
            const store = transaction.objectStore(SETTINGS_STORE)
            const request = store.get('settings')
            request.onsuccess = () => {
                const settings = request.result
                resolve(settings?.lastPromptTime || 0)
            }
            request.onerror = () => resolve(0)
        })
    } catch {
        return 0
    }
}

// Show hourly notification
async function showHourlyNotification() {
    const now = new Date()
    const hour = now.getHours()
    const prevHour = hour === 0 ? 12 : hour > 12 ? hour - 1 : hour
    const prevPeriod = hour === 0 ? 'AM' : hour <= 12 ? 'AM' : 'PM'
    const currPeriod = hour < 12 ? 'AM' : 'PM'
    const currHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour
    
    const timeRange = `${prevHour} ${prevPeriod} – ${currHour} ${currPeriod}`

    await self.registration.showNotification('HonestHours - Time to log!', {
        body: `What did you do from ${timeRange}?`,
        icon: '/android-chrome-192x192.png',
        badge: '/android-chrome-192x192.png',
        tag: 'hourly-prompt',
        requireInteraction: true,
        vibrate: [200, 100, 200],
        actions: [
            { action: 'open', title: 'Log Now' },
            { action: 'dismiss', title: 'Later' },
        ],
        data: {
            url: '/',
            timestamp: Date.now(),
        },
    })
}

// Check if notification is needed
async function checkAndNotify() {
    try {
        const lastPromptTime = await getLastPromptTime()
        const now = Date.now()
        const hourInMs = 60 * 60 * 1000

        // If more than an hour since last prompt, show notification
        if (now - lastPromptTime >= hourInMs) {
            // Check if any client windows are focused
            const clients = await self.clients.matchAll({ type: 'window' })
            const hasVisibleClient = clients.some(client => client.visibilityState === 'visible')

            // Only show notification if no visible client (user is away)
            if (!hasVisibleClient) {
                await showHourlyNotification()
            }
        }
    } catch (error) {
        console.error('Error checking notifications:', error)
    }
}

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

// Handle messages from client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting()
    }
    
    // Manual trigger for notification check
    if (event.data && event.data.type === 'CHECK_NOTIFICATIONS') {
        checkAndNotify()
    }
})

// Periodic Background Sync - runs hourly when supported (Chrome Android)
self.addEventListener('periodicsync', (event) => {
    if (event.tag === 'hourly-check') {
        event.waitUntil(checkAndNotify())
    }
})

// Regular Background Sync - fallback
self.addEventListener('sync', (event) => {
    if (event.tag === 'hourly-sync') {
        event.waitUntil(checkAndNotify())
    }
})

// Cache-first strategy for static assets, stale-while-revalidate for runtime
self.addEventListener('fetch', (event) => {
    const { request } = event
    const url = new URL(request.url)

    // Only cache GET requests for same-origin
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return
    }

    // Cache-first for static assets
    if (STATIC_ASSETS.some((asset) => url.pathname === asset)) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                return cachedResponse || fetch(request).then((response) => {
                    // Cache the new response
                    if (response.ok) {
                        const responseClone = response.clone()
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone)
                        })
                    }
                    return response
                })
            })
        )
        return
    }

    // Stale-while-revalidate for runtime assets (JS chunks, fonts)
    if (RUNTIME_CACHE_PATTERNS.some((pattern) => pattern.test(url.pathname))) {
        event.respondWith(
            caches.match(request).then((cachedResponse) => {
                const fetchPromise = fetch(request).then((response) => {
                    if (response.ok) {
                        const responseClone = response.clone()
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(request, responseClone)
                        })
                    }
                    return response
                }).catch(() => cachedResponse) // Fallback to cache on network error
                
                return cachedResponse || fetchPromise
            })
        )
    }
})

// Push notification handler (for server-sent push)
self.addEventListener('push', (event) => {
    if (event.data) {
        const data = event.data.json()
        const options = {
            body: data.body || 'What did you do in the last hour?',
            icon: data.icon || '/android-chrome-192x192.png',
            badge: '/android-chrome-192x192.png',
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

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close()

    // Handle action buttons
    if (event.action === 'dismiss') {
        return
    }

    event.waitUntil(
        clients
            .matchAll({
                type: 'window',
                includeUncontrolled: true,
            })
            .then((clientList) => {
                // If a window is already open, focus it
                for (const client of clientList) {
                    if ('focus' in client) {
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
