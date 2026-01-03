'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { IconFileTypePdf, IconFileTypeCsv, IconCode } from '@tabler/icons-react'
import { getTodayEntries, getWeekEntries } from '@/lib/storage/entries'
import { exportToday, exportWeek } from '@/lib/utils/export'
import { getWeekDateRange, getDateString } from '@/lib/utils/time'
import { showToast } from '@/components/ui/toast'

export function ExportSettings() {
  const [isExporting, setIsExporting] = useState(false)

  async function handleExportToday(format: 'csv' | 'json' | 'pdf') {
    setIsExporting(true)
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
    }
  }

  async function handleExportWeek(format: 'csv' | 'json' | 'pdf') {
    setIsExporting(true)
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
    }
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Export your time entries in different formats for backup or sharing.
      </p>

      <div className="space-y-3">
        <div className="space-y-2">
          <p className="text-sm font-medium">Today</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportToday('pdf')}
              disabled={isExporting}
              className="flex-1"
            >
              <IconFileTypePdf className="size-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportToday('csv')}
              disabled={isExporting}
              className="flex-1"
            >
              <IconFileTypeCsv className="size-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportToday('json')}
              disabled={isExporting}
              className="flex-1"
            >
              <IconCode className="size-4" />
              JSON
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-sm font-medium">This Week</p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportWeek('pdf')}
              disabled={isExporting}
              className="flex-1"
            >
              <IconFileTypePdf className="size-4" />
              PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportWeek('csv')}
              disabled={isExporting}
              className="flex-1"
            >
              <IconFileTypeCsv className="size-4" />
              CSV
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleExportWeek('json')}
              disabled={isExporting}
              className="flex-1"
            >
              <IconCode className="size-4" />
              JSON
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

