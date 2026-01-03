'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { IconDownload, IconCheck, IconBrandApple, IconRefresh, IconBell, IconBellOff } from '@tabler/icons-react'
import { usePWAInstall } from '@/lib/hooks/usePWAInstall'
import { showToast } from '@/components/ui/toast'
import { APP_VERSION } from '@/lib/constants/app'
import { sendNotification, canSendNotifications, requestNotificationPermission } from '@/lib/utils/notifications'

export function AppSettings() {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall()
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | null>(null)

  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
    }
  }, [])

  const handleInstall = async () => {
    const success = await install()
    if (success) {
      showToast('App installed successfully!', 'success')
    }
  }

  const handleClearDismissed = () => {
    localStorage.removeItem('pwa-install-dismissed')
    showToast('Install prompt will show again on next visit', 'info')
  }

  const handleRequestNotifications = async () => {
    const permission = await requestNotificationPermission()
    setNotificationPermission(permission)
    if (permission === 'granted') {
      showToast('Notifications enabled!', 'success')
    } else if (permission === 'denied') {
      showToast('Notifications blocked. Please enable in browser settings.', 'error')
    }
  }

  const handleTestNotification = async () => {
    const success = await sendNotification({
      title: 'HonestHours - Test',
      body: 'Notifications are working! 🎉',
      requireInteraction: false,
    })
    if (success) {
      showToast('Test notification sent!', 'success')
    } else {
      showToast('Failed to send notification', 'error')
    }
  }

  return (
    <div className="space-y-6">
      {/* Notifications Section */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Notifications</p>
          <p className="text-xs text-muted-foreground mt-1">
            Get reminded every hour to log your activities.
          </p>
        </div>

        {notificationPermission === 'granted' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <IconBell className="size-4 text-green-500" />
              <span>Notifications enabled</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestNotification}
              className="w-full gap-1.5"
            >
              <IconBell className="size-4" />
              Send Test Notification
            </Button>
            {isInstalled && (
              <p className="text-xs text-green-600 dark:text-green-400">
                ✓ Background notifications enabled (when app is installed)
              </p>
            )}
          </div>
        ) : notificationPermission === 'denied' ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-destructive/10 rounded-lg p-3">
              <IconBellOff className="size-4 text-destructive" />
              <span>Notifications blocked</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Enable notifications in your browser settings, then refresh the page.
            </p>
          </div>
        ) : (
          <Button
            onClick={handleRequestNotifications}
            variant="outline"
            className="w-full gap-1.5"
          >
            <IconBell className="size-4" />
            Enable Notifications
          </Button>
        )}
        
        {!isInstalled && notificationPermission === 'granted' && (
          <p className="text-xs text-muted-foreground">
            💡 Tip: Install the app for background notifications even when the browser is minimized.
          </p>
        )}
      </div>

      {/* Install Section */}
      <div className="space-y-3">
        <div>
          <p className="text-sm font-medium">Install App</p>
          <p className="text-xs text-muted-foreground mt-1">
            Install Honest Hours for quick access and offline support.
          </p>
        </div>

        {isInstalled ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
            <IconCheck className="size-4 text-green-500" />
            <span>App is already installed</span>
          </div>
        ) : isIOS ? (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <IconBrandApple className="size-4" />
              <span>iOS detected</span>
            </div>
            <p className="text-xs text-muted-foreground">
              To install on iOS: Tap the Share button in Safari, then &quot;Add to Home Screen&quot;.
            </p>
          </div>
        ) : isInstallable ? (
          <Button
            onClick={handleInstall}
            className="w-full gap-2"
          >
            <IconDownload className="size-4" />
            Install Honest Hours
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 rounded-lg p-3">
              <IconDownload className="size-4" />
              <span>Install not available</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Try refreshing the page or use Chrome/Edge for the best experience.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearDismissed}
              className="gap-1.5"
            >
              <IconRefresh className="size-3.5" />
              Reset install prompt
            </Button>
          </div>
        )}
      </div>

      {/* Version Info */}
      <div className="space-y-2">
        <p className="text-sm font-medium">About</p>
        <div className="text-xs text-muted-foreground space-y-1">
          <p>Version: {APP_VERSION}</p>
          <p>
            Honest Hours is a privacy-focused time tracking app. All data is stored locally on your device.
          </p>
        </div>
      </div>

      {/* Service Worker Info */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Offline Support</p>
        <p className="text-xs text-muted-foreground">
          This app works offline. Your entries are saved locally and synced when you&apos;re back online.
        </p>
      </div>
    </div>
  )
}
