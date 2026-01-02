'use client'

interface MissingHoursSummaryProps {
  formattedDate: string
  missingCount: number
  totalHours: number
}

export function MissingHoursSummary({
  formattedDate,
  missingCount,
  totalHours,
}: MissingHoursSummaryProps) {
  return (
    <div className="mb-6 space-y-1 border-b border-border/50 pb-4">
      <h1
        className="text-xl font-semibold cursor-pointer select-none"
        title="Long-press for settings"
        aria-label={`Date: ${formattedDate}. Long-press to open settings.`}
      >
        {formattedDate}
      </h1>
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
