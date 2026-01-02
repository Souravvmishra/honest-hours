'use client'

interface MissingHoursSummaryProps {
  formattedDate: string
  missingCount: number
  totalHours: number
  name?: string
}

export function MissingHoursSummary({
  formattedDate,
  missingCount,
  totalHours,
  name,
}: MissingHoursSummaryProps) {
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="mb-6 space-y-1 border-b border-border/50 pb-4">
      {name && (
        <p className="text-base text-muted-foreground">
          {getGreeting()}, {name}
        </p>
      )}
      <h1
        className="text-xl font-semibold"
        aria-label={`Date: ${formattedDate}`}
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
