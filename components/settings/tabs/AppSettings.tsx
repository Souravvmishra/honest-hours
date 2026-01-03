'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  IconDownload,
  IconCheck,
  IconBrandApple,
  IconBell,
  IconBellOff,
  IconDeviceMobile,
} from '@tabler/icons-react'
import { usePWAInstall } from '@/lib/hooks/usePWAInstall'
import { showToast } from '@/components/ui/toast'
import { sendNotification, requestNotificationPermission } from '@/lib/utils/notifications'

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
    <div className="space-y-4">
      {/* Notifications Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center">
                <IconBell className="size-4 text-primary" />
              </div>
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription>Hourly reminders</CardDescription>
              </div>
            </div>
            {notificationPermission === 'granted' ? (
              <Badge variant="success">
                <IconCheck className="size-3" />
                On
              </Badge>
            ) : notificationPermission === 'denied' ? (
              <Badge variant="destructive">
                <IconBellOff className="size-3" />
                Blocked
              </Badge>
            ) : (
              <Badge variant="secondary">Off</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {notificationPermission === 'granted' ? (
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">
                You&apos;ll get reminded every hour to log your activities.
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={handleTestNotification}
                className="w-full gap-1.5"
              >
                <IconBell className="size-3.5" />
                Test Notification
              </Button>
            </div>
          ) : notificationPermission === 'denied' ? (
            <p className="text-xs text-muted-foreground">
              Enable in browser settings and refresh the page.
            </p>
          ) : (
            <Button
              onClick={handleRequestNotifications}
              size="sm"
              className="w-full gap-1.5"
            >
              <IconBell className="size-3.5" />
              Enable Notifications
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Install App Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center">
                <IconDeviceMobile className="size-4 text-primary" />
              </div>
              <div>
                <CardTitle>Install App</CardTitle>
                <CardDescription>Quick access & offline</CardDescription>
              </div>
            </div>
            {isInstalled && (
              <Badge variant="success">
                <IconCheck className="size-3" />
                Installed
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isInstalled ? (
            <p className="text-xs text-muted-foreground">
              App is installed! Enjoy background notifications and offline access.
            </p>
          ) : isIOS ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <IconBrandApple className="size-3.5" />
                iOS detected
              </div>
              <p className="text-xs text-muted-foreground">
                Tap Share → &quot;Add to Home Screen&quot;
              </p>
            </div>
          ) : isInstallable ? (
            <Button
              onClick={handleInstall}
              size="sm"
              className="w-full gap-1.5"
            >
              <IconDownload className="size-3.5" />
              Install Honest Hours
            </Button>
          ) : (
            <p className="text-xs text-muted-foreground">
              Use Chrome or Edge for the best experience.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
