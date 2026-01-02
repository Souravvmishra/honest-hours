'use client'

import { useDailyLog } from '@/lib/hooks/useDailyLog'
import { useSettings } from '@/lib/hooks/useSettings'
import { MissingHoursSummary } from './MissingHoursSummary'
import { LogEntry } from './LogEntry'
import { DailyLogSkeleton } from '@/components/ui/skeleton'

export function DailyLogView() {
  const { logData, loading } = useDailyLog()
  const { settings } = useSettings()

  if (loading) {
    return <DailyLogSkeleton />
  }

  if (!logData) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <div className="mx-auto max-w-2xl">
        <MissingHoursSummary
          formattedDate={logData.formattedDate}
          missingCount={logData.missingCount}
          totalHours={logData.totalHours}
          name={settings?.name}
        />

        <div className="space-y-0">
          {logData.entries.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              No hours logged yet today
            </p>
          ) : (
            logData.entries.map((logEntry) => (
              <LogEntry
                key={logEntry.hourSlot}
                timeRange={logEntry.timeRange}
                entry={logEntry.entry}
                isMissing={logEntry.isMissing}
              />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
