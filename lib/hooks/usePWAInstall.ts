'use client'

import { useEffect, useState, useCallback } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

interface PWAInstallState {
  isInstallable: boolean
  isInstalled: boolean
  isIOS: boolean
  install: () => Promise<boolean>
}

// Global state to share across components
let globalInstallPrompt: BeforeInstallPromptEvent | null = null
let globalIsInstalled = false
const listeners = new Set<() => void>()

function notifyListeners() {
  listeners.forEach((listener) => listener())
}

// Initialize listeners once
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    globalInstallPrompt = e as BeforeInstallPromptEvent
    notifyListeners()
  })

  window.addEventListener('appinstalled', () => {
    globalIsInstalled = true
    globalInstallPrompt = null
    notifyListeners()
  })
}

export function usePWAInstall(): PWAInstallState {
  const [, forceUpdate] = useState({})

  useEffect(() => {
    // Check if already installed
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as Navigator & { standalone?: boolean }).standalone === true

    if (isStandalone) {
      globalIsInstalled = true
    }

    const listener = () => forceUpdate({})
    listeners.add(listener)

    return () => {
      listeners.delete(listener)
    }
  }, [])

  const isIOS = typeof window !== 'undefined' &&
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !(window as Window & { MSStream?: unknown }).MSStream

  const install = useCallback(async (): Promise<boolean> => {
    if (!globalInstallPrompt) return false

    try {
      await globalInstallPrompt.prompt()
      const { outcome } = await globalInstallPrompt.userChoice

      if (outcome === 'accepted') {
        globalInstallPrompt = null
        notifyListeners()
        return true
      }
      return false
    } catch (error) {
      console.error('Install prompt error:', error)
      return false
    }
  }, [])

  return {
    isInstallable: !!globalInstallPrompt && !globalIsInstalled,
    isInstalled: globalIsInstalled,
    isIOS,
    install,
  }
}

