'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { IconDownload, IconX } from '@tabler/icons-react'
import { showToast } from '@/components/ui/toast'
import { usePWAInstall } from '@/lib/hooks/usePWAInstall'

export function InstallPrompt() {
  const { isInstallable, isInstalled, install } = usePWAInstall()
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if user previously dismissed
    const dismissed = localStorage.getItem('pwa-install-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed, 10)
      // Show again after 7 days
      if (Date.now() - dismissedTime < 7 * 24 * 60 * 60 * 1000) {
        setIsDismissed(true)
      }
    }
  }, [])

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      showToast('App installed successfully!', 'success')
    }
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('pwa-install-dismissed', Date.now().toString())
  }

  // Don't show if already installed, dismissed, or no prompt available
  if (isInstalled || isDismissed || !isInstallable) {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-auto z-50 animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-card border border-border rounded-lg shadow-lg p-4 flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground">Install Honest Hours</p>
          <p className="text-xs text-muted-foreground truncate">
            Add to your home screen for quick access
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <Button
            onClick={handleInstall}
            size="sm"
            className="gap-1.5"
            aria-label="Install app"
          >
            <IconDownload className="size-4" />
            Install
          </Button>
          <Button
            onClick={handleDismiss}
            size="sm"
            variant="ghost"
            className="size-8 p-0"
            aria-label="Dismiss install prompt"
          >
            <IconX className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
