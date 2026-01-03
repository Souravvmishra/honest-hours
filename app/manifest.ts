import type { MetadataRoute } from 'next'
import { APP_NAME, APP_SHORT_NAME } from '@/lib/constants/app'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: APP_NAME,
        short_name: APP_SHORT_NAME,
        description: 'Honest Hours is a time tracking app that forces you to create journal entries for every hour.',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#ffffff',
        theme_color: '#1a1a1a',
        categories: ['productivity', 'utilities'],
        icons: [
            {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'maskable',
            },
            {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}
