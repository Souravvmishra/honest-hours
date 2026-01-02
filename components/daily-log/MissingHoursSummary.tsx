'use client'

import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { getDateString } from '@/lib/utils/time'

interface MissingHoursSummaryProps {
  formattedDate: string
  missingCount: number
  totalHours: number
  name?: string
  selectedDate: string
  onDateChange: (date: string | undefined) => void
}

export function MissingHoursSummary({
  formattedDate,
  missingCount,
  totalHours,
  name,
  selectedDate,
  onDateChange,
}: MissingHoursSummaryProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const today = getDateString()
  const isToday = selectedDate === today

  const handlePreviousDay = () => {
    const currentDate = new Date(selectedDate + 'T00:00:00')
    currentDate.setDate(currentDate.getDate() - 1)
    onDateChange(getDateString(currentDate))
  }

  const handleNextDay = () => {
    const currentDate = new Date(selectedDate + 'T00:00:00')
    currentDate.setDate(currentDate.getDate() + 1)
    const nextDateStr = getDateString(currentDate)
    // Don't allow going to future dates
    if (nextDateStr <= today) {
      onDateChange(nextDateStr === today ? undefined : nextDateStr)
    }
  }

  const handleToday = () => {
    onDateChange(undefined)
  }

  return (
    <div className="mb-6 space-y-2 border-b border-border/50 pb-4">
      {name && isToday && (
        <p className="text-base text-muted-foreground">
          {getGreeting()}, {name}
        </p>
      )}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={handlePreviousDay}
          aria-label="Previous day"
          className="h-9 w-9"
        >
          <IconChevronLeft className="size-5" />
        </Button>
        <div className="flex flex-col gap-1">
          <h1
            className="text-xl font-semibold"
            aria-label={`Date: ${formattedDate}`}
          >
            {formattedDate}
          </h1>
          {!isToday && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="h-6 w-fit text-xs text-muted-foreground hover:text-foreground"
            >
              Back to today
            </Button>
          )}
        </div>
        {!isToday && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNextDay}
            aria-label="Next day"
            className="h-9 w-9"
            disabled={selectedDate >= today}
          >
            <IconChevronRight className="size-5" />
          </Button>
        )}
      </div>
      {missingCount > 0 ? (
        <p className="text-base text-destructive">
          {missingCount} {missingCount === 1 ? 'hour' : 'hours'} unaccounted – face it
        </p>
      ) : (
        <p className="text-base text-muted-foreground">
          All {totalHours} {totalHours === 1 ? 'hour' : 'hours'} accounted for
        </p>
      )}
    </div>
  )
}
