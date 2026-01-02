'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { showToast } from '@/components/ui/toast'
import { IconRefresh } from '@tabler/icons-react'

export function ServiceWorkerUpdater() {
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((reg) => {
        setRegistration(reg)

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New service worker available
                setUpdateAvailable(true)
                showToast('New version available. Click to update.', 'info', 0)
              }
            })
          }
        })

        // Check for updates periodically
        setInterval(() => {
          reg.update()
        }, 60 * 60 * 1000) // Check every hour
      })
    }
  }, [])

  const handleUpdate = async () => {
    if (!registration) return

    try {
      await registration.update()
      if (registration.waiting) {
        registration.waiting.postMessage({ type: 'SKIP_WAITING' })
        window.location.reload()
      }
    } catch (error) {
      console.error('Failed to update service worker:', error)
      showToast('Failed to update. Please refresh the page.', 'error')
    }
  }

  if (!updateAvailable) return null

  return (
    <div className="fixed bottom-4 left-4 z-50">
      <Button
        onClick={handleUpdate}
        size="sm"
        className="shadow-lg"
        aria-label="Update application"
      >
        <IconRefresh className="mr-2 size-4" />
        Update Available
      </Button>
    </div>
  )
}
