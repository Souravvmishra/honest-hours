'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { IconFileTypePdf, IconFileTypeCsv, IconCode, IconCalendar, IconCalendarTime } from '@tabler/icons-react'
import { getTodayEntries, getWeekEntries } from '@/lib/storage/entries'
import { exportToday, exportWeek } from '@/lib/utils/export'
import { getWeekDateRange, getDateString } from '@/lib/utils/time'
import { showToast } from '@/components/ui/toast'

type ExportFormat = 'csv' | 'json' | 'pdf'

export function ExportSettings() {
  const [isExporting, setIsExporting] = useState(false)
  const [exportingType, setExportingType] = useState<string | null>(null)

  const handleExportToday = async (format: ExportFormat) => {
    setIsExporting(true)
    setExportingType(`today-${format}`)
    try {
      const today = getDateString()
      const entries = await getTodayEntries(today)
      await exportToday(entries, format)
      showToast(`Today's log exported as ${format.toUpperCase()}`, 'success')
    } catch (error) {
      console.error('Failed to export today:', error)
      showToast('Failed to export data. Please try again.', 'error')
    } finally {
      setIsExporting(false)
      setExportingType(null)
    }
  }

  const handleExportWeek = async (format: ExportFormat) => {
    setIsExporting(true)
    setExportingType(`week-${format}`)
    try {
      const { start, end } = getWeekDateRange()
      const entries = await getWeekEntries(start, end)
      await exportWeek(entries, format)
      showToast(`Week's log exported as ${format.toUpperCase()}`, 'success')
    } catch (error) {
      console.error('Failed to export week:', error)
      showToast('Failed to export data. Please try again.', 'error')
    } finally {
      setIsExporting(false)
      setExportingType(null)
    }
  }

  const formatButtons: { format: ExportFormat; icon: typeof IconFileTypePdf; label: string }[] = [
    { format: 'pdf', icon: IconFileTypePdf, label: 'PDF' },
    { format: 'csv', icon: IconFileTypeCsv, label: 'CSV' },
    { format: 'json', icon: IconCode, label: 'JSON' },
  ]

  return (
    <div className="space-y-4">
      <p className="text-xs text-muted-foreground">
        Export your time entries for backup or sharing.
      </p>

      {/* Today Export */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center">
              <IconCalendar className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle>Today</CardTitle>
              <CardDescription>Export today&apos;s entries</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {formatButtons.map(({ format, icon: Icon, label }) => (
              <Button
                key={`today-${format}`}
                variant="outline"
                size="sm"
                onClick={() => handleExportToday(format)}
                disabled={isExporting}
                className="flex-1 gap-1.5"
              >
                <Icon className="size-3.5" />
                {exportingType === `today-${format}` ? '...' : label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Week Export */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-md bg-primary/10 flex items-center justify-center">
              <IconCalendarTime className="size-4 text-primary" />
            </div>
            <div>
              <CardTitle>This Week</CardTitle>
              <CardDescription>Export this week&apos;s entries</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            {formatButtons.map(({ format, icon: Icon, label }) => (
              <Button
                key={`week-${format}`}
                variant="outline"
                size="sm"
                onClick={() => handleExportWeek(format)}
                disabled={isExporting}
                className="flex-1 gap-1.5"
              >
                <Icon className="size-3.5" />
                {exportingType === `week-${format}` ? '...' : label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
