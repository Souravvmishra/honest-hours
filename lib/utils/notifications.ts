'use client'

import { NOTIFICATION_ICON, NOTIFICATION_TAG } from '@/lib/constants/app'

interface NotificationOptions {
  title: string
  body: string
  tag?: string
  requireInteraction?: boolean
}

/**
 * Check if notifications are supported and permitted
 */
export function canSendNotifications(): boolean {
  return 'Notification' in window && Notification.permission === 'granted'
}

/**
 * Request notification permission
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) {
    return 'denied'
  }
  return Notification.requestPermission()
}

/**
 * Send a notification using the service worker (for better reliability)
 */
export async function sendNotification(options: NotificationOptions): Promise<boolean> {
  if (!canSendNotifications()) {
    console.log('Notifications not permitted')
    return false
  }

  try {
    // Try to use service worker registration for better notification handling
    const registration = await navigator.serviceWorker?.ready
    
    if (registration) {
      await registration.showNotification(options.title, {
        body: options.body,
        icon: NOTIFICATION_ICON,
        badge: NOTIFICATION_ICON,
        tag: options.tag || NOTIFICATION_TAG,
        requireInteraction: options.requireInteraction ?? true,
        data: {
          url: '/',
          timestamp: Date.now(),
        },
      })
      return true
    } else {
      // Fallback to regular Notification API
      new Notification(options.title, {
        body: options.body,
        icon: NOTIFICATION_ICON,
        tag: options.tag || NOTIFICATION_TAG,
        requireInteraction: options.requireInteraction ?? true,
      })
      return true
    }
  } catch (error) {
    console.error('Failed to send notification:', error)
    return false
  }
}

/**
 * Send the hourly prompt notification
 */
export async function sendHourlyPromptNotification(timeRange: string): Promise<boolean> {
  return sendNotification({
    title: 'HonestHours - Time to log!',
    body: `What did you do from ${timeRange}?`,
    tag: NOTIFICATION_TAG,
    requireInteraction: true,
  })
}

/**
 * Schedule a notification for a specific time (using setTimeout)
 * Note: This only works while the tab is open. For true background notifications,
 * you'd need a server-side push notification system.
 */
export function scheduleNotification(
  options: NotificationOptions,
  delayMs: number
): () => void {
  const timeoutId = setTimeout(() => {
    sendNotification(options)
  }, delayMs)

  // Return cleanup function
  return () => clearTimeout(timeoutId)
}
