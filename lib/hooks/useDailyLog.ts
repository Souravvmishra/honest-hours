'use client'

import { useEffect, useState, useRef } from 'react'
import { getTodayEntries, type HourEntry } from '@/lib/storage/entries'
import { getSettings } from '@/lib/storage/settings'
import {
  getTodayHourSlots,
  formatHourSlot,
  getDateString,
  formatDate,
} from '@/lib/utils/time'

export interface LogEntry {
  hourSlot: string
  timeRange: string
  entry: HourEntry | null
  isMissing: boolean
}

export interface DailyLogData {
  date: string
  formattedDate: string
  entries: LogEntry[]
  missingCount: number
  totalHours: number
}

export function useDailyLog() {
  const [logData, setLogData] = useState<DailyLogData | null>(null)
  const [loading, setLoading] = useState(true)
  const lastDateRef = useRef<string>('')
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const logDataRef = useRef<DailyLogData | null>(null)

  // Keep ref in sync with state
  useEffect(() => {
    logDataRef.current = logData
  }, [logData])

  useEffect(() => {
    loadDailyLog()
    
    // Check every minute if a new hour has started (only refresh if date/hour changed)
    intervalRef.current = setInterval(() => {
      const currentDate = getDateString()
      if (currentDate !== lastDateRef.current) {
        loadDailyLog()
      }
    }, 60 * 1000)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  async function loadDailyLog() {
    try {
      const [settings, todayDate] = await Promise.all([
        getSettings(),
        Promise.resolve(getDateString()),
      ])

      // Skip if date hasn't changed and we already have data
      if (todayDate === lastDateRef.current && logDataRef.current && logDataRef.current.date === todayDate) {
        setLoading(false)
        return
      }

      lastDateRef.current = todayDate

      const dayStartHour = settings.dayStartHour
      const hourSlots = getTodayHourSlots(dayStartHour)
      const entries = await getTodayEntries(todayDate)

      // Create a map of hourSlot -> entry
      const entryMap = new Map<string, HourEntry>()
      entries.forEach((entry) => {
        entryMap.set(entry.hourSlot, entry)
      })

      // Build log entries
      const logEntries: LogEntry[] = hourSlots.map((slot) => {
        const entry = entryMap.get(slot) || null
        return {
          hourSlot: slot,
          timeRange: formatHourSlot(slot),
          entry,
          isMissing: !entry,
        }
      })

      const missingCount = logEntries.filter((e) => e.isMissing).length

      setLogData({
        date: todayDate,
        formattedDate: formatDate(new Date()),
        entries: logEntries,
        missingCount,
        totalHours: hourSlots.length,
      })
    } catch (error) {
      console.error('Failed to load daily log:', error)
    } finally {
      setLoading(false)
    }
  }

  return {
    logData,
    loading,
    refresh: loadDailyLog,
  }
}
