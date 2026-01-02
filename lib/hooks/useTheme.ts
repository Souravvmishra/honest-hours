'use client'

import { useEffect } from 'react'
import { useTheme as useNextTheme } from 'next-themes'
import { useSettings } from './useSettings'

export function useTheme() {
  const { settings } = useSettings()
  const { setTheme: setNextTheme } = useNextTheme()

  // Initialize next-themes from saved settings on mount only
  useEffect(() => {
    if (settings?.theme) {
      setNextTheme(settings.theme)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}
