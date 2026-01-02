'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { getSettings, updateSettings, type Settings } from '@/lib/storage/settings'
import { getEntryByHourSlot } from '@/lib/storage/entries'
import {
  getCurrentHourSlot,
  getPreviousHourSlot,
  formatHourSlot,
} from '@/lib/utils/time'

interface PromptState {
  isDue: boolean
  hourSlot: string | null
  timeRange: string | null
  isActive: boolean
}

export function useHourlyPrompt() {
  const [promptState, setPromptState] = useState<PromptState>({
    isDue: false,
    hourSlot: null,
    timeRange: null,
    isActive: false,
  })
  const [settings, setSettings] = useState<Settings | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const isCheckingRef = useRef(false) // Prevent race conditions

  async function loadSettings() {
    try {
      const loaded = await getSettings()
      setSettings(loaded)
    } catch (error) {
      console.error('Failed to load settings:', error)
    }
  }

  const checkPromptStatus = useCallback(async () => {
    if (!settings || isCheckingRef.current) return
    
    isCheckingRef.current = true

    try {
      const now = new Date()
      const currentSlot = getCurrentHourSlot(now)
      const previousSlot = getPreviousHourSlot(now)

      // Check if we already logged the previous hour
      const existingEntry = await getEntryByHourSlot(previousSlot)

      // Check if enough time has passed since last prompt (60 minutes fixed)
      const lastPromptTime = settings.lastPromptTime || 0
      const timeSinceLastPrompt = now.getTime() - lastPromptTime
      const intervalMs = 60 * 60 * 1000 // Fixed 60 minutes

      const isDue =
        !existingEntry && timeSinceLastPrompt >= intervalMs && document.visibilityState === 'visible'

      setPromptState((prevState) => {
        // Only update if state actually changed
        if (isDue && !prevState.isActive) {
          const timeRange = formatHourSlot(previousSlot)

          return {
            isDue: true,
            hourSlot: previousSlot,
            timeRange,
            isActive: true,
          }
        } else if (!isDue && prevState.isDue) {
          return {
            isDue: false,
            hourSlot: null,
            timeRange: null,
            isActive: false,
          }
        }
        return prevState
      })
    } catch (error) {
      console.error('Failed to check prompt status:', error)
    } finally {
      isCheckingRef.current = false
    }
  }, [settings])

  useEffect(() => {
    loadSettings()

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!settings) return

    checkPromptStatus()
    
    // Check every minute if prompt is due
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
    }
    intervalRef.current = setInterval(() => {
      checkPromptStatus()
    }, 60 * 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [settings, checkPromptStatus])

  const markPromptComplete = useCallback(async () => {
    if (!settings || !promptState.hourSlot) return

    try {
      const updatedSettings = await updateSettings({ lastPromptTime: Date.now() })
      
      // Update local state instead of reloading
      setSettings(updatedSettings)
      
      setPromptState({
        isDue: false,
        hourSlot: null,
        timeRange: null,
        isActive: false,
      })
    } catch (error) {
      console.error('Failed to mark prompt complete:', error)
    }
  }, [settings, promptState.hourSlot])

  return {
    ...promptState,
    markPromptComplete,
  }
}
