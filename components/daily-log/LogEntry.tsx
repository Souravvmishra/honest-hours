'use client'

import { memo } from 'react'
import type { HourEntry } from '@/lib/storage/entries'

interface LogEntryProps {
    timeRange: string
    entry: HourEntry | null
    isMissing: boolean
}

export const LogEntry = memo(function LogEntry({ timeRange, entry, isMissing }: LogEntryProps) {
    return (
        <div className="border-b border-border/30 py-4 last:border-b-0">
            <div className="mb-2">
                <span className="text-sm font-medium text-muted-foreground">
                    {timeRange}
                </span>
            </div>
            {isMissing ? (
                <p className="text-base text-destructive">Missing</p>
            ) : (
                <p className="text-base leading-relaxed">{entry?.text}</p>
            )}
        </div>
    )
})
