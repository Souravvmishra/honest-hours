'use client'

import { useEffect, useState } from 'react'
import { getSettings, updateSettings } from '@/lib/storage/settings'
import type { Settings } from '@/lib/storage/settings'

export function useSettings() {
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

  return {
    settings,
    loading,
    update,
    reset,
  }
}
