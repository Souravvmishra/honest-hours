'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { IconBell, IconBellOff, IconAlertCircle } from '@tabler/icons-react'

export function NotificationPermissionAlert() {
  const [permission, setPermission] = useState<NotificationPermission | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission)
      
      // Check periodically (in case user changes it in browser settings)
      const checkPermission = () => {
        setPermission(Notification.permission)
      }
      
      const interval = setInterval(checkPermission, 5000)
      return () => clearInterval(interval)
    } else {
      setPermission('denied') // Not supported
    }
  }, [])

  async function handleRequestPermission() {
    if (!('Notification' in window)) {
      alert('Notifications are not supported in this browser.')
      return
    }

    // Always try to request permission (browser will ignore if already denied)
    try {
      const newPermission = await Notification.requestPermission()
      setPermission(newPermission)
      
      if (newPermission === 'granted') {
        setIsOpen(false)
      } else if (newPermission === 'denied') {
        // Permission was denied - browser won't show prompt again
        // User needs to enable it manually in browser settings
        alert(
          'Notification permission was denied. ' +
          'To enable it, you need to change the setting in your browser. ' +
          'See the instructions in this dialog.'
        )
      }
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      alert('Failed to request notification permission. Please try enabling it manually in browser settings.')
    }
  }

  function getBrowserInstructions() {
    const userAgent = navigator.userAgent.toLowerCase()
    
    if (userAgent.includes('chrome')) {
      return {
        browser: 'Chrome',
        steps: [
          'Click the lock icon (🔒) in the address bar',
          'Find "Notifications" in the permissions list',
          'Change from "Block" to "Allow"',
          'Refresh the page',
        ],
      }
    } else if (userAgent.includes('firefox')) {
      return {
        browser: 'Firefox',
        steps: [
          'Click the shield icon in the address bar',
          'Click "Permissions"',
          'Find "Notifications" and click "Allow"',
          'Refresh the page',
        ],
      }
    } else if (userAgent.includes('safari')) {
      return {
        browser: 'Safari',
        steps: [
          'Go to Safari → Settings → Websites',
          'Select "Notifications"',
          'Find this website and change to "Allow"',
          'Refresh the page',
        ],
      }
    } else if (userAgent.includes('edge')) {
      return {
        browser: 'Edge',
        steps: [
          'Click the lock icon (🔒) in the address bar',
          'Find "Notifications" in the permissions list',
          'Change from "Block" to "Allow"',
          'Refresh the page',
        ],
      }
    }
    
    return {
      browser: 'Your Browser',
      steps: [
        'Open browser settings',
        'Find "Site Settings" or "Permissions"',
        'Look for "Notifications"',
        'Allow notifications for this site',
        'Refresh the page',
      ],
    }
  }

  if (!permission || permission === 'granted') {
    return null
  }

  const instructions = getBrowserInstructions()

  return (
    <>
      {/* Small indicator button */}
      <Button
        variant="destructive"
        size="icon-xs"
        className="shadow-lg"
        onClick={() => setIsOpen(true)}
        title="Notifications not enabled - Click to fix"
      >
        <IconBellOff className="size-3.5" />
      </Button>

      {/* Modal with instructions */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <IconAlertCircle className="size-5 text-destructive" />
              Notifications {permission === 'denied' ? 'Blocked' : 'Not Enabled'}
            </DialogTitle>
            <DialogDescription>
              Hourly prompts won't appear when the tab is closed without notification permission.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Button
              onClick={handleRequestPermission}
              className="w-full"
              disabled={permission === 'granted'}
            >
              {permission === 'default' 
                ? 'Enable Notifications' 
                : 'Try Requesting Permission Again'}
            </Button>

            {permission === 'denied' && (
              <div className="space-y-3 pt-2 border-t border-border">
                <p className="text-xs text-muted-foreground">
                  If the browser prompt didn't appear, you need to enable it manually:
                </p>
                <p className="text-sm font-medium">To enable in {instructions.browser}:</p>
                <ol className="text-sm text-muted-foreground space-y-2 ml-4 list-decimal">
                  {instructions.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                  className="w-full mt-2"
                >
                  Refresh Page After Enabling
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
