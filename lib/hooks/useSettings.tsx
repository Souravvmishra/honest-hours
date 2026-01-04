'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { getSettings, updateSettings } from '@/lib/storage/settings'
import type { Settings } from '@/lib/storage/settings'

interface SettingsContextType {
  settings: Settings | null
  loading: boolean
  update: (updates: Partial<Settings>) => Promise<void>
  reset: () => Promise<void>
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const loaded = await getSettings()
      setSettings(loaded)
    } catch (error) {
      console.error('Failed to load settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function update(updates: Partial<Settings>) {
    if (!settings) return

    try {
      const updated = await updateSettings(updates)
      setSettings(updated)
    } catch (error) {
      console.error('Failed to update settings:', error)
      throw error
    }
  }

  async function reset() {
    try {
      const { resetSettings } = await import('@/lib/storage/settings')
      const defaultSettings = await resetSettings()
      setSettings(defaultSettings)
    } catch (error) {
      console.error('Failed to reset settings:', error)
      throw error
    }
  }

  return (
    <SettingsContext.Provider value={{ settings, loading, update, reset }}>
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider')
  }
  return context
}




